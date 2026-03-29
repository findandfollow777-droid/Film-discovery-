/* ============================================================
   HOME PAGE LOGIC — ORBIT Cinematic Landing Page
   Responsibilities:
   - Featured anchor film via TMDB (1 API call, daily rotation)
   - Trending films + actors via TMDB (2 API calls on load)
   - Mosaic poster image population (3 API calls)
   - Showcase carousel tab switching
   - Search bar submit handling
   API CALL VOLUME: 6 calls on load (1 anchor film, 1 trending movies,
   1 trending people, 3 mosaic). All cached in sessionStorage.
   Added: 2026-03-28
   ============================================================ */

/* ============================================================
   HOME CONSTELLATION PREVIEW — Added 2026-03-29
   Shows a mini constellation of a popular film rotating every
   4 hours. Clicking navigates to constellation.html.
   API calls: 2 on load (popular + recommendations)
   Cache: sessionStorage, 4-hour TTL
   ============================================================ */

const CONSTELLATION_ROTATION_HOURS = 4;

function getRotationIndex(len) {
  return Math.floor(Date.now() / (CONSTELLATION_ROTATION_HOURS * 3600000)) % len;
}

function populateInfoStrip(film) {
  const titleEl = document.getElementById('home-const-info-title');
  const metaEl = document.getElementById('home-const-info-meta');
  const badgesEl = document.getElementById('home-const-info-badges');
  if (titleEl) titleEl.textContent = film.title || '\u2014';
  if (metaEl) {
    const year = (film.release_date || '').split('-')[0];
    const rating = film.vote_average ? film.vote_average.toFixed(1) : '';
    metaEl.textContent = [year, rating ? '\u2605 ' + rating : ''].filter(Boolean).join(' \u00B7 ');
  }
  if (badgesEl) {
    badgesEl.innerHTML = '';
    const genres = film.genre_ids || [];
    const genreMap = {28:'Action',12:'Adventure',16:'Animation',35:'Comedy',80:'Crime',99:'Documentary',18:'Drama',10751:'Family',14:'Fantasy',36:'History',27:'Horror',10402:'Music',9648:'Mystery',10749:'Romance',878:'Sci-Fi',10770:'TV Movie',53:'Thriller',10752:'War',37:'Western'};
    if (genres.length > 0 && genreMap[genres[0]]) {
      const pill = document.createElement('span');
      pill.textContent = genreMap[genres[0]].toUpperCase();
      pill.style.cssText = 'display:inline-block;padding:2px 8px;font-family:var(--font-display);font-size:9px;letter-spacing:0.08em;border-radius:10px;background:rgba(0,217,255,0.12);border:1px solid rgba(0,217,255,0.3);color:var(--accent-cyan);';
      badgesEl.appendChild(pill);
    }
    if (film.vote_average >= 7.5) {
      const gold = document.createElement('span');
      gold.textContent = 'HIGHLY RATED';
      gold.style.cssText = 'display:inline-block;padding:2px 8px;font-family:var(--font-display);font-size:9px;letter-spacing:0.08em;border-radius:10px;background:rgba(255,215,0,0.12);border:1px solid rgba(255,215,0,0.3);color:var(--accent-gold);';
      badgesEl.appendChild(gold);
    }
  }
}

async function loadHomeConstellation() {
  const canvas = document.getElementById('home-const-canvas');
  if (!canvas) return;

  const cacheKey = 'orbit_home_nowplaying_v1';
  const ttl = CONSTELLATION_ROTATION_HOURS * 3600000;
  let popular = null;

  try {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      const p = JSON.parse(cached);
      if (Date.now() - p.timestamp < ttl) popular = p.films;
    }
  } catch (e) {}

  if (!popular) {
    try {
      const res = await OrbitUtils.tmdbFetch('/movie/now_playing', { language: 'en-US', page: 1 });
      popular = (res.results || []).filter(m => m.poster_path).slice(0, 20);
      sessionStorage.setItem(cacheKey, JSON.stringify({ films: popular, timestamp: Date.now() }));
    } catch (e) {
      console.warn('[ORBIT Home] Constellation now_playing fetch failed:', e);
      return;
    }
  }

  const idx = getRotationIndex(popular.length);
  const anchorFilm = popular[idx];

  populateInfoStrip(anchorFilm);

  // Fetch recommendations
  let orbitals = [];
  const recsCacheKey = 'orbit_home_const_recs_' + anchorFilm.id;
  try {
    const rc = sessionStorage.getItem(recsCacheKey);
    if (rc) {
      const p = JSON.parse(rc);
      if (Date.now() - p.timestamp < ttl) orbitals = p.films;
    }
  } catch (e) {}

  if (orbitals.length === 0) {
    try {
      const res = await OrbitUtils.tmdbFetch('/movie/' + anchorFilm.id + '/recommendations', { language: 'en-US', page: 1 });
      orbitals = (res.results || []).filter(m => m.poster_path && m.id !== anchorFilm.id).slice(0, 20);
      sessionStorage.setItem(recsCacheKey, JSON.stringify({ films: orbitals, timestamp: Date.now() }));
    } catch (e) {
      orbitals = [];
    }
  }

  const setAnchorAndNavigate = (film) => {
    localStorage.setItem('anchorMovie', JSON.stringify({
      id: film.id, title: film.title, poster_path: film.poster_path,
      release_date: film.release_date, vote_average: film.vote_average, overview: film.overview
    }));
    localStorage.removeItem('anchorFromResults');
    window.location.href = '../games/constellation.html';
  };

  const enterBtn = document.getElementById('home-const-enter');
  if (enterBtn) {
    enterBtn.addEventListener('click', (e) => { e.preventDefault(); setAnchorAndNavigate(anchorFilm); });
  }

  waitForSize(canvas, () => renderHomeConstellation(anchorFilm, orbitals, canvas));

  // Fetch detailed info for carousel films
  const detailCacheTTL = 2 * 3600000;
  const detailPromises = popular.slice(0, 5).map(f => {
    const detailCacheKey = 'orbit_home_film_detail_' + f.id;
    try {
      const dc = sessionStorage.getItem(detailCacheKey);
      if (dc) {
        const dp = JSON.parse(dc);
        if (Date.now() - dp.timestamp < detailCacheTTL) return Promise.resolve(dp.data);
      }
    } catch (e) {}
    return OrbitUtils.tmdbFetch('/movie/' + f.id, { append_to_response: 'credits', language: 'en-US' }).then(d => {
      try { sessionStorage.setItem(detailCacheKey, JSON.stringify({ data: d, timestamp: Date.now() })); } catch (e) {}
      return d;
    });
  });
  const detailedFilms = await Promise.all(detailPromises);
  initFilmCarousel(detailedFilms);
}

function renderHomeConstellation(anchor, orbitals, canvas) {
  const loading = document.getElementById('home-const-loading');
  if (loading) loading.classList.add('hidden');

  const W = canvas.offsetWidth;
  const H = canvas.offsetHeight;
  const cx = W / 2;
  const cy = H / 2;

  const anchorW = 148, anchorH = 212;
  const tileW = 96, tileH = 138;

  // Star field (behind everything) — vivid
  const starCvs = document.createElement('canvas');
  starCvs.width = W;
  starCvs.height = H;
  starCvs.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:0;';
  const sCtx = starCvs.getContext('2d');
  for (let i = 0; i < 120; i++) {
    sCtx.beginPath();
    sCtx.arc(Math.random() * W, Math.random() * H, Math.random() * 1.2 + 0.3, 0, Math.PI * 2);
    sCtx.fillStyle = 'rgba(255,255,255,' + (Math.random() * 0.4 + 0.1) + ')';
    sCtx.fill();
  }
  for (let i = 0; i < 20; i++) {
    sCtx.beginPath();
    sCtx.arc(Math.random() * W, Math.random() * H, Math.random() * 0.8 + 1.0, 0, Math.PI * 2);
    sCtx.fillStyle = 'rgba(255,255,255,0.7)';
    sCtx.fill();
  }
  // A few coloured stars
  for (let i = 0; i < 6; i++) {
    sCtx.beginPath();
    sCtx.arc(Math.random() * W, Math.random() * H, Math.random() * 0.6 + 0.8, 0, Math.PI * 2);
    sCtx.fillStyle = i % 2 === 0 ? 'rgba(0,217,255,0.4)' : 'rgba(255,215,0,0.35)';
    sCtx.fill();
  }
  canvas.appendChild(starCvs);

  // Corona glow
  const glow = document.createElement('div');
  glow.style.cssText = `position:absolute;width:340px;height:340px;left:${cx-170}px;top:${cy-170}px;border-radius:50%;background:radial-gradient(circle,rgba(255,215,0,0.12) 0%,rgba(255,215,0,0.05) 35%,transparent 70%);pointer-events:none;z-index:5;animation:anchorCorona 3s ease-in-out infinite alternate;`;
  canvas.appendChild(glow);

  // Anchor tile
  const anchorEl = document.createElement('div');
  anchorEl.className = 'home-const-anchor';
  anchorEl.style.left = (cx - anchorW / 2) + 'px';
  anchorEl.style.top = (cy - anchorH / 2) + 'px';
  if (anchor.poster_path) {
    anchorEl.style.backgroundImage = 'url(' + TMDB_IMG + 'w185' + anchor.poster_path + ')';
  }
  const anchorLabel = document.createElement('div');
  anchorLabel.className = 'home-const-anchor-label';
  anchorLabel.textContent = anchor.title;
  anchorEl.appendChild(anchorLabel);
  anchorEl.addEventListener('click', () => {
    if (typeof openMovieCube === 'function') openMovieCube(anchor.id);
  });
  canvas.appendChild(anchorEl);

  // Position orbital tiles
  const count = Math.min(orbitals.length, 20);
  const positions = [];

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
    const variance = 0.45 + Math.random() * 0.55;
    const rx = W * 0.44 * variance;
    const ry = H * 0.38 * variance;
    let x = cx + Math.cos(angle) * rx - tileW / 2;
    let y = cy + Math.sin(angle) * ry - tileH / 2;
    x = Math.max(8, Math.min(W - tileW - 8, x));
    y = Math.max(8, Math.min(H - tileH - 8, y));
    positions.push({ x, y, film: orbitals[i] });
  }

  // Separation pass
  const pad = 8;
  for (let iter = 0; iter < 150; iter++) {
    let any = false;
    for (let a = 0; a < positions.length; a++) {
      // Tile vs tile
      for (let b = a + 1; b < positions.length; b++) {
        const pa = positions[a], pb = positions[b];
        const oX = (tileW + pad) - Math.abs((pa.x + tileW / 2) - (pb.x + tileW / 2));
        const oY = (tileH + pad) - Math.abs((pa.y + tileH / 2) - (pb.y + tileH / 2));
        if (oX > 0 && oY > 0) {
          any = true;
          const sx = Math.sign((pa.x + tileW / 2) - (pb.x + tileW / 2)) || 1;
          const sy = Math.sign((pa.y + tileH / 2) - (pb.y + tileH / 2)) || 1;
          const px = Math.min(6, oX / 2) * sx;
          const py = Math.min(6, oY / 2) * sy;
          pa.x += px; pa.y += py;
          pb.x -= px; pb.y -= py;
        }
      }
      // Tile vs anchor
      const p = positions[a];
      const aoX = (tileW / 2 + anchorW / 2 + pad * 2) - Math.abs((p.x + tileW / 2) - cx);
      const aoY = (tileH / 2 + anchorH / 2 + pad * 2) - Math.abs((p.y + tileH / 2) - cy);
      if (aoX > 0 && aoY > 0) {
        any = true;
        p.x += 5 * (Math.sign((p.x + tileW / 2) - cx) || 1);
        p.y += 5 * (Math.sign((p.y + tileH / 2) - cy) || 1);
      }
      positions[a].x = Math.max(8, Math.min(W - tileW - 8, positions[a].x));
      positions[a].y = Math.max(8, Math.min(H - tileH - 8, positions[a].y));
    }
    if (!any) break;
  }

  // Connection lines (behind tiles)
  const linesCvs = document.createElement('canvas');
  linesCvs.width = W;
  linesCvs.height = H;
  linesCvs.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:1;';
  const lCtx = linesCvs.getContext('2d');
  positions.forEach(pos => {
    const tcx = pos.x + tileW / 2;
    const tcy = pos.y + tileH / 2;
    const dist = Math.hypot(tcx - cx, tcy - cy);
    const maxDist = Math.hypot(W / 2, H / 2);
    const prox = 1 - (dist / maxDist);

    // Line from anchor to tile
    lCtx.beginPath();
    lCtx.moveTo(cx, cy);
    lCtx.lineTo(tcx, tcy);
    lCtx.strokeStyle = 'rgba(0, 217, 255, ' + (0.12 + prox * 0.2) + ')';
    lCtx.lineWidth = 0.8;
    lCtx.stroke();

    // Dot at midpoint
    const dotX = cx + (tcx - cx) * 0.55;
    const dotY = cy + (tcy - cy) * 0.55;
    lCtx.beginPath();
    lCtx.arc(dotX, dotY, 2.2, 0, Math.PI * 2);
    lCtx.fillStyle = prox > 0.5 ? 'rgba(255,107,53,0.65)' : 'rgba(0,217,255,0.45)';
    lCtx.fill();
  });
  canvas.appendChild(linesCvs);

  // Render tiles
  positions.forEach((pos, i) => {
    const dist = Math.hypot((pos.x + tileW/2) - cx, (pos.y + tileH/2) - cy);
    const maxDist = Math.hypot(W/2, H/2);
    const band = dist / maxDist;

    const tile = document.createElement('div');
    tile.className = 'home-const-tile';
    tile.style.left = pos.x + 'px';
    tile.style.top = pos.y + 'px';
    tile.style.zIndex = '2';
    tile.style.opacity = '0';
    const finalOp = (band >= 0.65) ? 0.82 : 1.0;
    if (band >= 0.65) {
      tile.style.filter = 'brightness(0.85)';
    }
    tile.style.animation = 'homeConstellationFadeIn 0.4s ease forwards';
    tile.style.animationDelay = (i * 35) + 'ms';
    tile.addEventListener('animationend', () => { tile.style.opacity = finalOp; }, { once: true });
    if (pos.film.poster_path) {
      tile.style.backgroundImage = 'url(' + TMDB_IMG + 'w185' + pos.film.poster_path + ')';
    }
    const label = document.createElement('div');
    label.className = 'home-const-tile-label';
    label.textContent = pos.film.title;
    tile.appendChild(label);
    tile.addEventListener('click', () => {
      if (typeof openMovieCube === 'function') openMovieCube(pos.film.id);
    });
    canvas.appendChild(tile);
  });

}

/* ----------------------------------------------------------
   Popular Strip + Loading Helpers
   ---------------------------------------------------------- */

function showHomeLoader() {
  const canvas = document.getElementById('home-const-canvas');
  if (!canvas) return;
  let loader = canvas.querySelector('.home-const-loading');
  if (loader) { loader.classList.remove('hidden'); return; }
  loader = document.createElement('div');
  loader.className = 'home-const-loading';
  loader.innerHTML = '<div class="home-const-rings"><div class="hcr hcr-1"></div><div class="hcr hcr-2"></div><div class="hcr hcr-3"></div><div class="hcr-core"></div></div>';
  canvas.appendChild(loader);
}

function hideHomeLoader() {
  const loader = document.querySelector('#home-const-canvas .home-const-loading');
  if (loader) loader.classList.add('hidden');
}

/* ============================================================
   HOME FILM CAROUSEL — Added 2026-03-29
   6-slide carousel below constellation. Slides 1-5: now_playing
   films with full detail. Slide 6: instructional panel.
   ============================================================ */

let carouselCurrentIndex = 0;
let carouselFilms = [];
let hasInteracted = false;
let hciSelectedFilm = null;

function initFilmCarousel(films) {
  carouselFilms = films;
  renderCarouselSlides(films);
  wireCarouselNavigation();
  wireCarouselTouch();
  wireSlide6Search();
  // Go to rotation anchor slide
  const rotIdx = getRotationIndex(films.length);
  goToSlide(rotIdx, false);
}

function renderCarouselSlides(films) {
  const track = document.getElementById('home-carousel-track');
  const instructionSlide = document.getElementById('home-carousel-slide-6');
  if (!track || !instructionSlide) return;

  const borderColors = [
    'rgba(0,217,255,0.35)',
    'rgba(168,85,247,0.35)',
    'rgba(16,185,129,0.3)',
    'rgba(255,215,0,0.28)'
  ];

  films.forEach((film, i) => {
    const slide = document.createElement('div');
    slide.className = 'home-carousel-slide';
    slide.id = 'home-carousel-slide-' + (i + 1);
    slide.dataset.slide = String(i + 1);

    // Poster column — full bleed
    const posterCol = document.createElement('div');
    posterCol.className = 'hcs-poster-col';
    const poster = document.createElement('div');
    poster.className = 'hcs-poster';
    poster.id = 'hcs-poster-' + film.id;
    if (film.poster_path) {
      poster.style.backgroundImage = 'url(' + TMDB_IMG + 'w342' + film.poster_path + ')';
    }
    poster.addEventListener('click', () => {
      if (typeof openMovieCube === 'function') openMovieCube(film.id);
    });
    posterCol.appendChild(poster);
    slide.appendChild(posterCol);

    // Info column
    const infoCol = document.createElement('div');
    infoCol.className = 'hcs-info-col';

    // Eyebrow
    const eyebrow = document.createElement('div');
    eyebrow.className = 'hcs-eyebrow';
    eyebrow.textContent = 'NOW PLAYING';
    infoCol.appendChild(eyebrow);

    // Title
    const titleEl = document.createElement('div');
    titleEl.className = 'hcs-title';
    titleEl.textContent = film.title || '';
    infoCol.appendChild(titleEl);

    // Stats row
    const metaRow = document.createElement('div');
    metaRow.className = 'hcs-meta-row';

    if (film.vote_average) {
      const r = document.createElement('span');
      r.className = 'hcs-stat hcs-stat--rating';
      r.textContent = '\u2605 ' + film.vote_average.toFixed(1);
      metaRow.appendChild(r);
    }
    if (film.runtime) {
      const hrs = Math.floor(film.runtime / 60);
      const mins = film.runtime % 60;
      const rt = document.createElement('span');
      rt.className = 'hcs-stat hcs-stat--runtime';
      rt.textContent = hrs > 0 ? hrs + 'h ' + mins + 'm' : mins + 'm';
      metaRow.appendChild(rt);
    }
    if (film.genres && film.genres[0]) {
      const g = document.createElement('span');
      g.className = 'hcs-stat hcs-stat--genre';
      g.textContent = film.genres[0].name.toUpperCase();
      metaRow.appendChild(g);
    }
    const cin = document.createElement('span');
    cin.className = 'hcs-stat hcs-stat--cinema';
    cin.textContent = 'IN CINEMAS';
    metaRow.appendChild(cin);
    if (film.revenue && film.revenue > 1000000) {
      const rev = document.createElement('span');
      rev.className = 'hcs-stat hcs-stat--revenue';
      rev.textContent = '$' + (film.revenue / 1000000).toFixed(0) + 'M BOX OFFICE';
      metaRow.appendChild(rev);
    }
    infoCol.appendChild(metaRow);

    // Synopsis
    const syn = document.createElement('div');
    syn.className = 'hcs-synopsis';
    // Truncate at last full sentence within ~180 chars
    let overview = film.overview || '';
    if (overview.length > 180) {
      const cut = overview.substring(0, 180);
      const lastPeriod = cut.lastIndexOf('.');
      overview = lastPeriod > 60 ? cut.substring(0, lastPeriod + 1) : cut + '\u2026';
    }
    syn.textContent = overview;
    infoCol.appendChild(syn);

    // Cast strip — circular portraits pinned to bottom
    const credits = film.credits;
    if (credits && credits.cast && credits.cast.length > 0) {
      const castStrip = document.createElement('div');
      castStrip.className = 'hcs-cast-strip';

      const castLabel = document.createElement('span');
      castLabel.className = 'hcs-cast-strip-label';
      castLabel.textContent = 'CAST';
      castStrip.appendChild(castLabel);

      const castAvatars = document.createElement('div');
      castAvatars.className = 'hcs-cast-avatars';

      credits.cast.slice(0, 4).forEach((actor, ci) => {
        const wrap = document.createElement('div');
        wrap.className = 'hcs-avatar-wrap';
        wrap.title = actor.name;
        wrap.style.cursor = 'pointer';

        const circle = document.createElement('div');
        circle.className = 'hcs-avatar-circle';
        circle.style.borderColor = borderColors[ci % borderColors.length];
        if (actor.profile_path) {
          circle.style.backgroundImage = 'url(' + TMDB_IMG + 'w185' + actor.profile_path + ')';
          circle.style.backgroundSize = 'cover';
        }
        wrap.appendChild(circle);

        const name = document.createElement('div');
        name.className = 'hcs-avatar-name';
        const parts = actor.name.split(' ');
        if (parts.length >= 2) {
          name.innerHTML = parts.slice(0, -1).join(' ') + '<br>' + parts[parts.length - 1];
        } else {
          name.textContent = actor.name;
        }
        wrap.appendChild(name);

        wrap.addEventListener('click', () => {
          window.location.href = 'timeline.html?type=person&search=' + encodeURIComponent(actor.name);
        });

        castAvatars.appendChild(wrap);
      });

      castStrip.appendChild(castAvatars);
      infoCol.appendChild(castStrip);
    }

    slide.appendChild(infoCol);
    track.insertBefore(slide, instructionSlide);
  });
}

function goToSlide(index, fromInteraction) {
  const track = document.getElementById('home-carousel-track');
  const dots = document.querySelectorAll('.home-carousel-dot');
  if (!track) return;

  const totalSlides = 6;
  if (index < 0) index = totalSlides - 1;
  if (index >= totalSlides) index = 0;

  carouselCurrentIndex = index;
  track.style.transform = 'translateX(-' + (index * 100) + '%)';

  // Update dots
  dots.forEach((dot, di) => {
    dot.classList.toggle('active', di === index);
  });

  // Update poster glow
  const allPosters = document.querySelectorAll('.hcs-poster');
  allPosters.forEach((p, pi) => {
    p.classList.toggle('active-anchor-poster', pi === index);
  });

  if (fromInteraction) hasInteracted = true;

  // Trigger constellation change for film slides (0-4)
  if (index < 5 && carouselFilms[index]) {
    triggerConstellationChange(carouselFilms[index]);
  }
}

function wireCarouselNavigation() {
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const dots = document.querySelectorAll('.home-carousel-dot');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      goToSlide(carouselCurrentIndex - 1, true);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      goToSlide(carouselCurrentIndex + 1, true);
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.dataset.index);
      if (!isNaN(idx)) goToSlide(idx, true);
    });
  });
}

function wireCarouselTouch() {
  const wrap = document.getElementById('home-carousel-wrap');
  if (!wrap) return;

  let startX = 0;
  let startY = 0;
  let dragging = false;

  wrap.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    dragging = true;
  }, { passive: true });

  wrap.addEventListener('touchmove', (e) => {
    if (!dragging) return;
  }, { passive: true });

  wrap.addEventListener('touchend', (e) => {
    if (!dragging) return;
    dragging = false;
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const dx = endX - startX;
    const dy = endY - startY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      if (dx < 0) {
        goToSlide(carouselCurrentIndex + 1, true);
      } else {
        goToSlide(carouselCurrentIndex - 1, true);
      }
    }
  }, { passive: true });
}

function triggerConstellationChange(film) {
  populateInfoStrip(film);
  showHomeLoader();

  // Update enter link
  const enterBtn = document.getElementById('home-const-enter');
  if (enterBtn) {
    enterBtn.onclick = (e) => {
      e.preventDefault();
      localStorage.setItem('anchorMovie', JSON.stringify({
        id: film.id, title: film.title, poster_path: film.poster_path,
        release_date: film.release_date, vote_average: film.vote_average, overview: film.overview
      }));
      localStorage.removeItem('anchorFromResults');
      window.location.href = '../games/constellation.html';
    };
  }

  // Fetch recs and re-render constellation
  (async () => {
    let recs = [];
    const recsCacheKey = 'orbit_home_const_recs_' + film.id;
    const ttl = 4 * 3600000;
    try {
      const rc = sessionStorage.getItem(recsCacheKey);
      if (rc) { const p = JSON.parse(rc); if (Date.now() - p.timestamp < ttl) recs = p.films; }
    } catch (e) {}
    if (recs.length === 0) {
      try {
        const res = await OrbitUtils.tmdbFetch('/movie/' + film.id + '/recommendations', { language: 'en-US', page: 1 });
        recs = (res.results || []).filter(m => m.poster_path && m.id !== film.id).slice(0, 20);
        sessionStorage.setItem(recsCacheKey, JSON.stringify({ films: recs, timestamp: Date.now() }));
      } catch (e) { recs = []; }
    }

    hideHomeLoader();
    const canvas = document.getElementById('home-const-canvas');
    if (!canvas) return;
    canvas.innerHTML = '';
    waitForSize(canvas, () => renderHomeConstellation(film, recs, canvas));
  })();
}

function wireSlide6Search() {
  const input = document.getElementById('hci-search-input');
  const btn = document.getElementById('hci-anchor-btn');
  const hintEl = document.querySelector('.hci-anchor-hint');
  const searchWrap = document.getElementById('hci-search-wrap');
  if (!input || !btn) return;

  let debounceTimer = null;
  let fetchController = null;
  let dropdown = null;

  function ensureDropdown() {
    if (!dropdown) {
      dropdown = document.createElement('div');
      dropdown.className = 'home-search-dropdown';
      dropdown.style.cssText = 'position:absolute;top:100%;left:0;right:0;z-index:200;';
      searchWrap.appendChild(dropdown);
    }
    return dropdown;
  }

  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    const q = input.value.trim();
    if (q.length < 2) { closeHciDropdown(); return; }
    debounceTimer = setTimeout(() => fetchHciResults(q), 300);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const dd = ensureDropdown();
      const first = dd.querySelector('.home-search-result');
      if (first) first.click();
    }
    if (e.key === 'Escape') closeHciDropdown();
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('#hci-search-wrap')) closeHciDropdown();
  });

  async function fetchHciResults(query) {
    if (fetchController) fetchController.abort();
    fetchController = new AbortController();
    try {
      const movieRes = await fetch('https://api.themoviedb.org/3/search/movie?api_key=' + TMDB_API_KEY + '&query=' + encodeURIComponent(query), { signal: fetchController.signal }).then(r => r.json());
      const movies = (movieRes.results || []).slice(0, 6);
      renderHciDropdown(movies);
    } catch (err) {
      if (err.name !== 'AbortError') console.warn('[ORBIT HCI Search]', err);
    } finally {
      fetchController = null;
    }
  }

  function renderHciDropdown(movies) {
    const dd = ensureDropdown();
    if (movies.length === 0) {
      dd.innerHTML = '<div class="home-search-no-results">No films found</div>';
      dd.classList.add('open');
      return;
    }

    dd.innerHTML = movies.map(m => {
      const year = (m.release_date || '').split('-')[0];
      const rating = m.vote_average ? ' \u00B7 \u2605' + m.vote_average.toFixed(1) : '';
      const thumb = m.poster_path ? TMDB_IMG + 'w92' + m.poster_path : '';
      return '<div class="home-search-result" data-id="' + m.id + '">' +
        '<div class="home-search-thumb" style="' + (thumb ? 'background-image:url(' + thumb + ')' : '') + '"></div>' +
        '<div class="home-search-result-info">' +
          '<div class="home-search-result-title">' + (m.title || '') + '</div>' +
          '<div class="home-search-result-meta">' + year + rating + '</div>' +
        '</div>' +
        '<span class="home-search-badge" style="color:var(--accent-cyan);border-color:rgba(0,217,255,0.3)">FILM</span>' +
      '</div>';
    }).join('');

    dd.classList.add('open');

    dd.querySelectorAll('.home-search-result').forEach(row => {
      row.addEventListener('click', () => {
        const movie = movies.find(m => String(m.id) === row.dataset.id);
        if (!movie) return;
        hciSelectedFilm = movie;
        input.value = movie.title || '';
        closeHciDropdown();
        btn.disabled = false;
        if (hintEl) hintEl.classList.add('hidden');
      });
    });
  }

  function closeHciDropdown() {
    if (dropdown) {
      dropdown.classList.remove('open');
      dropdown.innerHTML = '';
    }
  }

  btn.addEventListener('click', () => {
    if (!hciSelectedFilm || btn.disabled) return;
    localStorage.setItem('anchorMovie', JSON.stringify({
      id: hciSelectedFilm.id,
      title: hciSelectedFilm.title,
      poster_path: hciSelectedFilm.poster_path,
      release_date: hciSelectedFilm.release_date,
      vote_average: hciSelectedFilm.vote_average,
      overview: hciSelectedFilm.overview
    }));
    localStorage.removeItem('anchorFromResults');
    window.location.href = '../games/constellation.html';
  });
}

/* ----------------------------------------------------------
   SECTION 3 — loadTrendingFilms()
   ---------------------------------------------------------- */

async function loadTrendingFilms() {
  const CACHE_KEY = 'orbit_home_trending_films';
  const CACHE_TTL = 30 * 60 * 1000;

  try {
    // Check sessionStorage cache
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < CACHE_TTL) {
        applyTrendingFilms(parsed.data);
        return;
      }
    }

    const response = await OrbitUtils.tmdbFetch('/trending/movie/week', { language: 'en-US' });
    const results = (response.results || []).slice(0, 5);

    // Cache with timestamp
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data: results, timestamp: Date.now() }));

    applyTrendingFilms(results);
  } catch (err) {
    console.warn('ORBIT: Failed to load trending films', err);
  }
}

function applyTrendingFilms(results) {
  const tiles = document.querySelectorAll('.film-tile');

  results.forEach((movie, i) => {
    if (!tiles[i]) return;
    const tile = tiles[i];

    const poster = tile.querySelector('.film-tile-poster');
    if (poster && movie.poster_path) {
      poster.style.backgroundImage = `url(${TMDB_IMG}w342${movie.poster_path})`;
    }

    const title = tile.querySelector('.film-tile-title');
    if (title) title.textContent = movie.title;

    const meta = tile.querySelector('.film-tile-meta');
    if (meta) meta.textContent = (movie.release_date || '').split('-')[0];

    tile.dataset.movieId = movie.id;

    if (movie.vote_count > 5000 && movie.vote_average > 7.5) {
      const badge = tile.querySelector('.film-tile-award');
      if (badge) badge.style.display = 'block';
    }
  });
}

/* ----------------------------------------------------------
   SECTION 4 — loadTrendingPeople()
   ---------------------------------------------------------- */

async function loadTrendingPeople() {
  const CACHE_KEY = 'orbit_home_trending_people';
  const CACHE_TTL = 30 * 60 * 1000;

  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < CACHE_TTL) {
        applyTrendingPeople(parsed.data);
        return;
      }
    }

    const response = await OrbitUtils.tmdbFetch('/trending/person/week', { language: 'en-US' });
    const results = (response.results || []).slice(0, 5);

    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data: results, timestamp: Date.now() }));

    applyTrendingPeople(results);
  } catch (err) {
    console.warn('ORBIT: Failed to load trending people', err);
  }
}

function applyTrendingPeople(results) {
  const tiles = document.querySelectorAll('.actor-tile');

  results.forEach((person, i) => {
    if (!tiles[i]) return;
    const tile = tiles[i];

    const portrait = tile.querySelector('.actor-portrait');
    if (portrait && person.profile_path) {
      portrait.style.backgroundImage = `url(${TMDB_IMG}w185${person.profile_path})`;
    }

    const name = tile.querySelector('.actor-name');
    if (name) name.textContent = person.name;

    const dept = tile.querySelector('.actor-dept');
    if (dept) dept.textContent = person.known_for_department || '';

    tile.dataset.personId = person.id;
    tile.dataset.name = person.name;
  });
}

/* ----------------------------------------------------------
   SECTION 5 — populateMosaic(posterPaths)
   ---------------------------------------------------------- */

async function loadMosaicPosters() {
  const CACHE_KEY = 'orbit_home_mosaic_posters';
  const CACHE_TTL = 2 * 60 * 60 * 1000; // 2 hours

  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < CACHE_TTL) {
        populateMosaic(parsed.data);
        return;
      }
    }

    const [page1, page2, topRated] = await Promise.all([
      OrbitUtils.tmdbFetch('/trending/movie/week', { language: 'en-US', page: 1 }),
      OrbitUtils.tmdbFetch('/trending/movie/week', { language: 'en-US', page: 2 }),
      OrbitUtils.tmdbFetch('/movie/top_rated', { language: 'en-US', page: 1 })
    ]);

    const paths = [
      ...(page1.results || []),
      ...(page2.results || []),
      ...(topRated.results || [])
    ].map(m => m.poster_path).filter(Boolean);

    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data: paths, timestamp: Date.now() }));
    populateMosaic(paths);
  } catch (err) {
    console.warn('ORBIT: Failed to load mosaic posters', err);
  }
}

function populateMosaic(posterPaths) {
  if (!posterPaths || posterPaths.length === 0) return;

  const cells = document.querySelectorAll('#hero-mosaic .mosaic-cell');
  if (cells.length === 0) return;

  // Fisher-Yates shuffle
  const shuffled = [...posterPaths];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Ensure no adjacent cells repeat if we need to extend
  const paths = [];
  let idx = 0;
  for (let i = 0; i < cells.length; i++) {
    if (idx >= shuffled.length) idx = 0;
    // Skip if same as previous to avoid adjacent repeats
    if (i > 0 && paths[i - 1] === shuffled[idx] && shuffled.length > 1) {
      idx = (idx + 1) % shuffled.length;
    }
    paths.push(shuffled[idx]);
    idx++;
  }

  // Staggered fade-in
  cells.forEach((cell, i) => {
    cell.style.opacity = '0';
    cell.style.transition = 'opacity 0.8s ease';
    cell.style.backgroundImage = `url(${TMDB_IMG}w92${paths[i]})`;
    cell.style.backgroundSize = 'cover';
    cell.style.backgroundPosition = 'center';
    setTimeout(() => { cell.style.opacity = '1'; }, 50 * i);
  });
}

/* ----------------------------------------------------------
   SECTION 6 — initShowcase()
   ---------------------------------------------------------- */

function initShowcase() {
  const tabs = document.querySelectorAll('.showcase-tab');
  const panels = document.querySelectorAll('.showcase-panel');

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      if (panels[index]) panels[index].classList.add('active');
    });
  });
}

/* ----------------------------------------------------------
   SECTION 7 — Home Search — Live dropdown
   Identical behaviour to index.html Quick Search.
   Debounced live dropdown with TMDB results.
   Added: 2026-03-29
   ---------------------------------------------------------- */

function initSearch() {
  const input = document.querySelector('.hero-search-input');
  const btn = document.querySelector('.hero-search-btn');
  const dropdown = document.getElementById('home-search-dropdown');
  if (!input || !dropdown) return;

  let debounceTimer = null;
  let fetchController = null;

  // Debounced input
  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    const q = input.value.trim();
    if (q.length < 2) { closeDropdown(); return; }
    debounceTimer = setTimeout(() => fetchResults(q), 300);
  });

  // Enter key — select first result or submit as search
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const first = dropdown.querySelector('.home-search-result');
      if (first) first.click();
    }
    if (e.key === 'Escape') closeDropdown();
  });

  // Search button — trigger search immediately
  if (btn) {
    btn.addEventListener('click', () => {
      const q = input.value.trim();
      if (q.length >= 2) fetchResults(q);
    });
  }

  // Click outside to close
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#home-search-wrap')) closeDropdown();
  });

  // Seed suggestion clicks
  document.querySelectorAll('.seed-link').forEach(seed => {
    seed.addEventListener('click', () => {
      if (!input) return;
      const text = seed.textContent || '';
      const firstName = text.split('+')[0].trim().split('\u00D7')[0].trim();
      input.value = firstName;
      fetchResults(firstName);
    });
  });

  async function fetchResults(query) {
    if (fetchController) fetchController.abort();
    fetchController = new AbortController();

    try {
      // Search movies and people in parallel
      const [movieRes, personRes] = await Promise.all([
        fetch('https://api.themoviedb.org/3/search/movie?api_key=' + TMDB_API_KEY + '&query=' + encodeURIComponent(query), { signal: fetchController.signal }).then(r => r.json()),
        fetch('https://api.themoviedb.org/3/search/person?api_key=' + TMDB_API_KEY + '&query=' + encodeURIComponent(query), { signal: fetchController.signal }).then(r => r.json())
      ]);

      const movies = (movieRes.results || []).slice(0, 4).map(m => ({ ...m, _type: 'movie' }));
      const people = (personRes.results || []).slice(0, 4).map(p => ({ ...p, _type: 'person' }));

      // Interleave: movie, person, movie, person...
      const results = [];
      const maxLen = Math.max(movies.length, people.length);
      for (let i = 0; i < maxLen; i++) {
        if (i < movies.length) results.push(movies[i]);
        if (i < people.length) results.push(people[i]);
      }

      renderDropdown(results.slice(0, 8));
    } catch (err) {
      if (err.name !== 'AbortError') console.warn('[ORBIT Search]', err);
    } finally {
      fetchController = null;
    }
  }

  function renderDropdown(results) {
    if (results.length === 0) {
      dropdown.innerHTML = '<div class="home-search-no-results">No results found</div>';
      dropdown.classList.add('open');
      return;
    }

    dropdown.innerHTML = results.map(item => {
      if (item._type === 'movie') {
        const year = (item.release_date || '').split('-')[0];
        const rating = item.vote_average ? ' \u00B7 \u2605' + item.vote_average.toFixed(1) : '';
        const thumb = item.poster_path ? TMDB_IMG + 'w92' + item.poster_path : '';
        return `<div class="home-search-result" data-id="${item.id}" data-type="movie" data-title="${(item.title||'').replace(/"/g,'&quot;')}">
          <div class="home-search-thumb" style="${thumb ? 'background-image:url('+thumb+')' : ''}"></div>
          <div class="home-search-result-info">
            <div class="home-search-result-title">${item.title || ''}</div>
            <div class="home-search-result-meta">${year}${rating}</div>
          </div>
          <span class="home-search-badge" style="color:var(--accent-cyan);border-color:rgba(0,217,255,0.3)">FILM</span>
        </div>`;
      } else {
        const dept = item.known_for_department || '';
        const knownFor = (item.known_for || []).map(k => k.title || k.name).filter(Boolean).slice(0,2).join(', ');
        const thumb = item.profile_path ? TMDB_IMG + 'w92' + item.profile_path : '';
        return `<div class="home-search-result" data-id="${item.id}" data-type="person" data-name="${(item.name||'').replace(/"/g,'&quot;')}">
          <div class="home-search-thumb person" style="${thumb ? 'background-image:url('+thumb+')' : ''}"></div>
          <div class="home-search-result-info">
            <div class="home-search-result-title">${item.name || ''}</div>
            <div class="home-search-result-meta">${dept}${knownFor ? ' \u00B7 ' + knownFor : ''}</div>
          </div>
          <span class="home-search-badge" style="color:var(--accent-gold);border-color:rgba(255,215,0,0.3)">PERSON</span>
        </div>`;
      }
    }).join('');

    dropdown.classList.add('open');

    // Wire click handlers
    dropdown.querySelectorAll('.home-search-result').forEach(row => {
      row.addEventListener('click', () => {
        const id = parseInt(row.dataset.id);
        const type = row.dataset.type;
        closeDropdown();
        handleSelect(id, type, row.dataset.title || row.dataset.name || '');
      });
    });
  }

  async function handleSelect(id, type, name) {
    // Clear old state
    localStorage.removeItem('vennPeople');
    localStorage.removeItem('orbitFilters');
    localStorage.removeItem('movies');
    localStorage.removeItem('orbitBaseQuery');

    if (type === 'movie') {
      // Check for collection
      try {
        const movie = await fetch('https://api.themoviedb.org/3/movie/' + id + '?api_key=' + TMDB_API_KEY).then(r => r.json());
        localStorage.setItem('timelineMovieId', id);
        localStorage.setItem('timelineType', 'movie');
        if (movie.belongs_to_collection) {
          window.location.href = 'timeline.html';
        } else {
          window.location.href = 'timeline.html?openCube=' + id;
        }
      } catch (e) {
        localStorage.setItem('timelineMovieId', id);
        localStorage.setItem('timelineType', 'movie');
        window.location.href = 'timeline.html?openCube=' + id;
      }
    } else {
      // Person
      localStorage.setItem('timelineMovieId', id);
      localStorage.setItem('timelineType', 'person');
      localStorage.setItem('timelineMediaMode', 'both');
      window.location.href = 'timeline.html';
    }
  }

  function closeDropdown() {
    dropdown.classList.remove('open');
    dropdown.innerHTML = '';
  }
}

/* ----------------------------------------------------------
   SECTION 8 — Star Field + Helpers
   ---------------------------------------------------------- */

function generateStarField(container) {
  const existing = container.querySelector('.hero-star-field');
  if (existing) existing.remove();

  const cvs = document.createElement('canvas');
  cvs.className = 'hero-star-field';
  cvs.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;';
  container.insertBefore(cvs, container.firstChild);

  function draw() {
    cvs.width = container.offsetWidth || 600;
    cvs.height = container.offsetHeight || 480;
    const ctx = cvs.getContext('2d');
    ctx.clearRect(0, 0, cvs.width, cvs.height);

    for (let i = 0; i < 90; i++) {
      const x = Math.random() * cvs.width;
      const y = Math.random() * cvs.height;
      const r = Math.random() * 0.9 + 0.2;
      const o = Math.random() * 0.35 + 0.06;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${o})`;
      ctx.fill();
    }

    for (let i = 0; i < 14; i++) {
      const x = Math.random() * cvs.width;
      const y = Math.random() * cvs.height;
      const r = Math.random() * 0.7 + 0.9;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.fill();
    }
  }

  draw();
  window.addEventListener('resize', draw);
}

function waitForSize(el, cb, attempts) {
  attempts = attempts || 0;
  if (el.offsetWidth > 0 && el.offsetHeight > 0) { cb(); return; }
  if (attempts > 20) return;
  requestAnimationFrame(() => waitForSize(el, cb, attempts + 1));
}

/* ----------------------------------------------------------
   SECTION 9 — INIT
   ---------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  // Init MovieCube with anchor handler
  if (typeof initMovieCube === 'function') {
    initMovieCube({
      onPersonClick: (personId) => {
        if (typeof openPeopleCube === 'function') openPeopleCube(parseInt(personId));
      },
      onAnchorClick: (movie) => {
        localStorage.setItem('anchorMovie', JSON.stringify(movie));
        localStorage.removeItem('anchorFromResults');
        window.location.href = '../games/constellation.html';
      }
    });
    if (typeof initPeopleCube === 'function') initPeopleCube();
  }

  // Star field behind constellation
  const heroRight = document.querySelector('.hero-right');
  if (heroRight) generateStarField(heroRight);

  loadHomeConstellation();
  loadTrendingFilms();
  loadTrendingPeople();
  loadMosaicPosters();
  initShowcase();
  initSearch();

  // Film tiles -> MovieCube (with fallback)
  document.querySelectorAll('.film-tile').forEach(tile => {
    tile.addEventListener('click', () => {
      const movieId = parseInt(tile.dataset.movieId);
      if (movieId && typeof openMovieCube === 'function') {
        openMovieCube(movieId);
      } else if (movieId) {
        window.location.href = 'results.html?movie=' + movieId;
      }
    });
  });

  // Actor tiles -> Timeline
  document.querySelectorAll('.actor-tile').forEach(tile => {
    tile.addEventListener('click', () => {
      const name = tile.dataset.name;
      if (name) window.location.href = 'timeline.html?type=person&search=' + encodeURIComponent(name);
    });
  });
});
