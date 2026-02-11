// ============================================
// FLOATING SHORTLIST BADGE
// Site-wide indicator for shortlist count
// ============================================

(function() {
  let badge = null;
  let badgeCount = null;

  /**
   * Initialize the floating shortlist badge
   */
  function initShortlistBadge() {
    // Check if badge already exists
    if (document.getElementById('shortlist-badge')) {
      badge = document.getElementById('shortlist-badge');
      badgeCount = document.getElementById('badge-count');
      setupBadgeEvents();
      updateShortlistBadge();
      return;
    }

    // Create badge HTML
    const badgeHTML = `
      <div class="shortlist-badge hidden" id="shortlist-badge">
        <span class="badge-count" id="badge-count">0</span>
        <span class="badge-icon">★</span>
        <span class="badge-label">Shortlist</span>
      </div>
    `;

    // Inject into body
    document.body.insertAdjacentHTML('beforeend', badgeHTML);

    // Get references
    badge = document.getElementById('shortlist-badge');
    badgeCount = document.getElementById('badge-count');

    // Setup events
    setupBadgeEvents();

    // Initial update
    updateShortlistBadge();
  }

  /**
   * Setup badge event listeners
   */
  function setupBadgeEvents() {
    if (!badge) return;

    badge.addEventListener('click', handleBadgeClick);
  }

  /**
   * Handle badge click
   */
  function handleBadgeClick() {
    if (!window.canCompare || !window.getShortlistCount) {
      console.warn('Shortlist service not loaded');
      return;
    }

    const count = window.getShortlistCount();

    if (count >= 2) {
      // Navigate to comparison page (compare.html lives at project root)
      const inSubdir = window.location.pathname.includes('/games/');
      window.location.href = inSubdir ? '../compare.html' : 'compare.html';
    } else if (count === 1) {
      // Show tooltip
      showBadgeTooltip('Add 1 more to compare');
    }
  }

  /**
   * Update badge visibility and content
   */
  function updateShortlistBadge() {
    if (!badge || !badgeCount) return;

    // Check if shortlist service is available
    if (!window.getShortlistCount) {
      badge.classList.add('hidden');
      return;
    }

    const count = window.getShortlistCount();

    // Update count display
    badgeCount.textContent = count;

    // Show/hide badge
    if (count === 0) {
      badge.classList.add('hidden');
      badge.classList.remove('ready');
    } else {
      badge.classList.remove('hidden');

      // Add 'ready' class when 2+ movies
      if (count >= 2) {
        badge.classList.add('ready');
        badge.title = 'Click to compare movies';
      } else {
        badge.classList.remove('ready');
        badge.title = 'Add 1 more movie to compare';
      }
    }
  }

  /**
   * Show tooltip message on badge
   */
  function showBadgeTooltip(message) {
    if (!badge) return;

    // Create tooltip element
    const tooltip = document.createElement('div');
    tooltip.className = 'badge-tooltip';
    tooltip.textContent = message;

    // Position above badge
    badge.appendChild(tooltip);

    // Trigger animation
    setTimeout(() => tooltip.classList.add('show'), 10);

    // Remove after 2 seconds
    setTimeout(() => {
      tooltip.classList.remove('show');
      setTimeout(() => tooltip.remove(), 300);
    }, 2000);
  }

  // ============================================
  // INITIALIZATION
  // ============================================

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initShortlistBadge);
  } else {
    // DOM already loaded
    initShortlistBadge();
  }

  // ============================================
  // EXPORTS
  // ============================================

  // Expose update function globally so Movie Cube can call it
  window.updateShortlistBadge = updateShortlistBadge;

})();
