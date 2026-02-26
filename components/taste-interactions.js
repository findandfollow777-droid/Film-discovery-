/* =============================================
   TASTE INTERACTIONS
   Shared long-press / hover-hold overlay for movie cards
   Works with results cards (.movie-card) and timeline cards (.at-card)
============================================= */

(function () {
  'use strict';

  var HOVER_DELAY_MS = 800;
  var TOUCH_DELAY_MS = 500;
  var GRACE_PERIOD_MS = 300;
  var TOUCH_MOVE_THRESHOLD = 10;

  /**
   * Initialize taste interactions on a container via event delegation.
   * Call once per container — survives child re-renders.
   *
   * @param {Object} options
   * @param {string|Element} options.container - Selector or element for the card grid/track
   * @param {string} options.cardSelector - CSS selector for movie cards (e.g. '.movie-card')
   * @param {Function} options.getMovieData - (card) => { id, title, year, poster, genres } | null
   * @param {Function} [options.onOverlayShow] - Called when overlay appears (receives card)
   * @param {Function} [options.onOverlayHide] - Called when overlay hides (receives card)
   */
  function initTasteInteractions(options) {
    var container = typeof options.container === 'string'
      ? document.querySelector(options.container)
      : options.container;
    if (!container) return;

    var cardSelector = options.cardSelector || '.movie-card';
    var getMovieData = options.getMovieData;
    var onOverlayShow = options.onOverlayShow || null;
    var onOverlayHide = options.onOverlayHide || null;

    var hoverTimer = null;
    var graceTimer = null;
    var touchTimer = null;
    var activeCard = null;
    var hoveredCard = null;
    var touchStartX = 0;
    var touchStartY = 0;

    // ── Desktop: hover-hold via mouseover/mouseout delegation ──

    container.addEventListener('mouseover', function (e) {
      var card = e.target.closest(cardSelector);
      if (!card || card === hoveredCard) return;

      // Entering a new card
      hoveredCard = card;
      clearTimeout(hoverTimer);

      // If we have an active overlay on a different card, dismiss it
      if (activeCard && activeCard !== card) {
        clearTimeout(graceTimer);
        dismissOverlay();
      }

      // If re-entering the card that already has an overlay, cancel grace dismiss
      if (activeCard === card) {
        clearTimeout(graceTimer);
        return;
      }

      hoverTimer = setTimeout(function () {
        showOverlay(card);
      }, HOVER_DELAY_MS);
    });

    container.addEventListener('mouseout', function (e) {
      var card = e.target.closest(cardSelector);
      var related = e.relatedTarget ? e.relatedTarget.closest(cardSelector) : null;

      // Only act if we're truly leaving the card (not moving to a child)
      if (card && card !== related) {
        if (hoveredCard === card) hoveredCard = null;
        clearTimeout(hoverTimer);

        if (activeCard === card) {
          graceTimer = setTimeout(function () {
            dismissOverlay();
          }, GRACE_PERIOD_MS);
        }
      }
    });

    // ── Mobile: long-press via touch events ──

    container.addEventListener('touchstart', function (e) {
      var card = e.target.closest(cardSelector);
      if (!card) return;

      // Don't re-trigger on overlay button taps
      if (e.target.closest('.taste-overlay')) return;

      // If overlay is active on this card, dismiss it on outside tap
      if (activeCard === card) return;

      var touch = e.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;

      touchTimer = setTimeout(function () {
        showOverlay(card);
        if (navigator.vibrate) navigator.vibrate(30);
      }, TOUCH_DELAY_MS);
    }, { passive: true });

    container.addEventListener('touchmove', function (e) {
      // Cancel if finger moved too far (it's a scroll)
      if (touchTimer) {
        var touch = e.touches[0];
        var dx = Math.abs(touch.clientX - touchStartX);
        var dy = Math.abs(touch.clientY - touchStartY);
        if (dx > TOUCH_MOVE_THRESHOLD || dy > TOUCH_MOVE_THRESHOLD) {
          clearTimeout(touchTimer);
          touchTimer = null;
        }
      }
    }, { passive: true });

    container.addEventListener('touchend', function () {
      clearTimeout(touchTimer);
      touchTimer = null;
    });

    // ── Dismiss on outside click/tap ──

    document.addEventListener('click', function (e) {
      if (!activeCard) return;
      // Keep overlay if clicking inside it or on the active card
      if (e.target.closest('.taste-overlay')) return;
      var card = e.target.closest(cardSelector);
      if (card === activeCard) return;
      dismissOverlay();
    });

    // ── Show / Hide Overlay ──

    function showOverlay(card) {
      dismissOverlay();

      var movieData = getMovieData(card);
      if (!movieData) return;

      activeCard = card;
      card.classList.add('taste-overlay-active');

      // Determine injection target (poster wrap or card itself)
      var posterWrap = card.querySelector('.movie-poster-wrap');
      var target = posterWrap || card;

      var status = typeof getTasteStatus === 'function' ? getTasteStatus(movieData.id) : null;

      // Build overlay
      var overlay = document.createElement('div');
      overlay.className = 'taste-overlay';
      overlay.style.opacity = '1';
      overlay.style.pointerEvents = 'auto';

      // Love button
      var loveBtn = document.createElement('button');
      var isLoved = status === 'loved';
      loveBtn.className = 'taste-btn taste-btn-love' + (isLoved ? ' taste-active' : '');
      loveBtn.innerHTML = '<span class="og ' + (isLoved ? 'og-heart-filled' : 'og-heart') + '"></span> '
        + (isLoved ? 'Loved' : 'Love It');

      loveBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        e.preventDefault();
        if (isLoved) {
          unloveMovie(movieData.id);
        } else {
          loveMovie(movieData);
        }
        dismissOverlay();
        applyTasteClassToCard(card, movieData.id);
      });

      overlay.appendChild(loveBtn);

      // Skip button (hidden for already-loved movies)
      if (!isLoved) {
        var skipBtn = document.createElement('button');
        skipBtn.className = 'taste-btn taste-btn-skip';
        skipBtn.innerHTML = '<span class="og og-moon"></span> Not Tonight';

        skipBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          e.preventDefault();
          skipMovie(movieData);
          dismissOverlay();
          applyTasteClassToCard(card, movieData.id);
        });

        overlay.appendChild(skipBtn);
      }

      target.appendChild(overlay);
      if (onOverlayShow) onOverlayShow(card);
    }

    function dismissOverlay() {
      if (!activeCard) return;
      var card = activeCard;
      card.classList.remove('taste-overlay-active');
      var overlay = card.querySelector('.taste-overlay');
      if (overlay) overlay.remove();
      if (onOverlayHide) onOverlayHide(card);
      activeCard = null;
    }
  }

  // ── Apply taste classes to rendered cards ──

  function applyTasteClassToCard(card, movieId) {
    card.classList.remove('taste-loved', 'taste-skipped');
    if (typeof getTasteStatus !== 'function') return;
    var status = getTasteStatus(movieId);
    if (status === 'loved') card.classList.add('taste-loved');
    else if (status === 'skipped') card.classList.add('taste-skipped');
  }

  /**
   * Apply .taste-loved / .taste-skipped to all cards in a container.
   * Call after each render (page change, re-sort, etc.).
   *
   * @param {string|Element} container
   * @param {string} cardSelector
   * @param {Function} [getIdFromCard] - (card) => movieId. Defaults to card.dataset.movieId.
   */
  function applyTasteClasses(container, cardSelector, getIdFromCard) {
    var el = typeof container === 'string'
      ? document.querySelector(container)
      : container;
    if (!el || typeof getTasteStatus !== 'function') return;

    el.querySelectorAll(cardSelector).forEach(function (card) {
      var movieId = getIdFromCard
        ? getIdFromCard(card)
        : parseInt(card.dataset.movieId);
      if (!movieId) return;
      applyTasteClassToCard(card, movieId);
    });
  }

  // ── Expose on window ──

  window.initTasteInteractions = initTasteInteractions;
  window.applyTasteClasses = applyTasteClasses;

})();
