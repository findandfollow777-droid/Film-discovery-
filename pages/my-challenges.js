/* ============================================================
   MY CHALLENGES — Added 2026-05-02
   Reads from `orbit_my_challenges` localStorage (see data/storage-keys.md).
   Renders three sections: Rivalries, Pending, Completed.
   ============================================================ */

const MY_CHALLENGES_KEY = 'orbit_my_challenges';

document.addEventListener('DOMContentLoaded', () => {
  const data = loadData();
  renderRivalries(data);
  renderPending(data);
  renderCompleted(data);
});

function loadData() {
  try {
    const raw = localStorage.getItem(MY_CHALLENGES_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (parsed && Array.isArray(parsed.sent) && Array.isArray(parsed.received)) {
      return parsed;
    }
  } catch (e) { /* fall through */ }
  return { sent: [], received: [] };
}

function escapeHtml(s) {
  return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function timeAgo(ts) {
  if (!ts) return '';
  const sec = Math.floor((Date.now() - ts) / 1000);
  if (sec < 60) return 'just now';
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  return `${Math.floor(sec / 86400)}d ago`;
}

function diffLabel(steps, par) {
  const d = steps - par;
  if (d === 0) return { text: 'On par', cls: 'pill-par' };
  if (d < 0) return { text: `${-d} under`, cls: 'pill-under' };
  return { text: `${d} over`, cls: 'pill-over' };
}

function pathLabel(c) {
  return `${escapeHtml(c.startActor.name)} → ${escapeHtml(c.endActor.name)}`;
}

function seriesLabel(c) {
  if (!c.seriesLength || c.seriesLength <= 1) return '';
  return ` · Best of ${c.seriesLength} (R${(c.round || 0) + 1}/${c.seriesLength})`;
}

/* ============================================================
   RIVALRIES — derive W/L records from sent + received challenges,
   grouped by opponent name. Only includes entries where the user
   has named the opponent (sentTo on sent records, from on received).
   ============================================================ */
function renderRivalries(data) {
  const list = document.getElementById('rivalriesList');
  const map = {}; // { name: { wins, losses, ties, rounds: [] } }

  function bump(name, result, summary) {
    const key = name.trim();
    if (!map[key]) map[key] = { wins: 0, losses: 0, ties: 0, rounds: [] };
    if (result === 'win') map[key].wins++;
    else if (result === 'loss') map[key].losses++;
    else map[key].ties++;
    map[key].rounds.push(summary);
  }

  // Sent challenges: opponent's score determines outcome from creator's perspective.
  // Lower steps = won (they beat your par); equal = tie; higher = you "won" (they couldn't match par).
  data.sent.forEach(c => {
    if (!c.sentTo || !c.opponentResult) return;
    const oppSteps = c.opponentResult.steps;
    const result = oppSteps < c.par ? 'loss' : oppSteps > c.par ? 'win' : 'tie';
    bump(c.sentTo, result, {
      ts: c.opponentResult.completedAt,
      path: pathLabel(c),
      detail: `they: ${oppSteps} · par: ${c.par}`,
      result
    });
  });

  // Received challenges: my own score determines outcome from my perspective.
  data.received.forEach(c => {
    if (!c.from || c.mySteps == null) return;
    const result = c.mySteps < c.par ? 'win' : c.mySteps > c.par ? 'loss' : 'tie';
    bump(c.from, result, {
      ts: c.completedAt,
      path: pathLabel(c),
      detail: `you: ${c.mySteps} · par: ${c.par}`,
      result
    });
  });

  const entries = Object.entries(map).sort((a, b) => {
    const totA = a[1].wins + a[1].losses + a[1].ties;
    const totB = b[1].wins + b[1].losses + b[1].ties;
    return totB - totA;
  });

  if (entries.length === 0) {
    list.innerHTML = '<p class="mc-empty">No rivalries yet. Add an opponent name when you send a challenge.</p>';
    return;
  }

  list.innerHTML = entries.map(([name, r]) => {
    const recent = r.rounds.slice().sort((a, b) => (b.ts || 0) - (a.ts || 0)).slice(0, 4);
    return `
      <article class="mc-rivalry">
        <header class="mc-rivalry-head">
          <span class="mc-rivalry-name">${escapeHtml(name)}</span>
          <span class="mc-record">
            <span class="mc-record-w">${r.wins}W</span> ·
            <span class="mc-record-l">${r.losses}L</span> ·
            <span class="mc-record-t">${r.ties}T</span>
          </span>
        </header>
        <ol class="mc-rivalry-rounds">
          ${recent.map(rd => `
            <li class="mc-round mc-round-${rd.result}">
              <span class="mc-round-path">${rd.path}</span>
              <span class="mc-round-detail">${rd.detail}</span>
            </li>
          `).join('')}
        </ol>
      </article>
    `;
  }).join('');
}

/* ============================================================
   PENDING — sent challenges with no opponent result, plus received
   challenges the user hasn't completed yet.
   ============================================================ */
function renderPending(data) {
  const list = document.getElementById('pendingList');
  const sentPending = data.sent.filter(c => !c.opponentResult).map(c => ({ ...c, kind: 'sent' }));
  const recvPending = data.received.filter(c => c.mySteps == null).map(c => ({ ...c, kind: 'received' }));
  const all = sentPending.concat(recvPending).sort((a, b) => (b.createdAt || b.receivedAt || 0) - (a.createdAt || a.receivedAt || 0));

  if (all.length === 0) {
    list.innerHTML = '<p class="mc-empty">No pending challenges.</p>';
    return;
  }

  list.innerHTML = all.map(c => {
    const ts = c.createdAt || c.receivedAt;
    const who = c.kind === 'sent'
      ? (c.sentTo ? `Sent to ${escapeHtml(c.sentTo)}` : 'Sent (no recipient)')
      : (c.from ? `From ${escapeHtml(c.from)}` : 'Received');
    const action = c.kind === 'received'
      ? `<button class="mc-btn mc-btn-primary" data-action="play" data-cid="${c.id}">Play</button>`
      : `<button class="mc-btn mc-btn-secondary" data-action="copy" data-cid="${c.id}">Copy link</button>`;
    return `
      <article class="mc-card mc-card-pending mc-card-${c.kind}">
        <div class="mc-card-head">
          <span class="mc-card-who">${who}</span>
          <span class="mc-card-time">${timeAgo(ts)}</span>
        </div>
        <div class="mc-card-path">${pathLabel(c)}</div>
        <div class="mc-card-meta">Par ${c.par}${seriesLabel(c)}</div>
        <div class="mc-card-actions">${action}</div>
      </article>
    `;
  }).join('');

  list.querySelectorAll('[data-action="play"]').forEach(btn => {
    btn.addEventListener('click', () => playReceived(btn.dataset.cid, data));
  });
  list.querySelectorAll('[data-action="copy"]').forEach(btn => {
    btn.addEventListener('click', () => copySentLink(btn.dataset.cid, data));
  });
}

/* ============================================================
   COMPLETED — both sides have results.
   ============================================================ */
function renderCompleted(data) {
  const list = document.getElementById('completedList');
  const completedSent = data.sent.filter(c => c.opponentResult).map(c => ({ ...c, kind: 'sent' }));
  const completedRecv = data.received.filter(c => c.mySteps != null).map(c => ({ ...c, kind: 'received' }));
  const all = completedSent.concat(completedRecv).sort((a, b) => {
    const ta = a.opponentResult?.completedAt || a.completedAt || 0;
    const tb = b.opponentResult?.completedAt || b.completedAt || 0;
    return tb - ta;
  });

  if (all.length === 0) {
    list.innerHTML = '<p class="mc-empty">No completed challenges yet.</p>';
    return;
  }

  list.innerHTML = all.slice(0, 20).map(c => {
    const ts = c.opponentResult?.completedAt || c.completedAt;
    let resultLine;
    if (c.kind === 'sent') {
      const oppSteps = c.opponentResult.steps;
      const d = diffLabel(oppSteps, c.par);
      const who = c.sentTo ? escapeHtml(c.sentTo) : 'Opponent';
      resultLine = `${who} scored ${oppSteps} <span class="mc-pill ${d.cls}">${d.text}</span>`;
    } else {
      const d = diffLabel(c.mySteps, c.par);
      const who = c.from ? escapeHtml(c.from) : 'Sender';
      resultLine = `You scored ${c.mySteps} <span class="mc-pill ${d.cls}">${d.text}</span> · vs ${who}`;
    }
    return `
      <article class="mc-card mc-card-completed mc-card-${c.kind}">
        <div class="mc-card-head">
          <span class="mc-card-who">${c.kind === 'sent' ? 'You sent' : 'You received'}</span>
          <span class="mc-card-time">${timeAgo(ts)}</span>
        </div>
        <div class="mc-card-path">${pathLabel(c)}</div>
        <div class="mc-card-meta">Par ${c.par}${seriesLabel(c)}</div>
        <div class="mc-card-result">${resultLine}</div>
      </article>
    `;
  }).join('');
}

/* ============================================================
   ACTIONS
   ============================================================ */
function copySentLink(cid, data) {
  const c = data.sent.find(x => x.id === cid);
  if (!c) return;
  const params = new URLSearchParams();
  params.set('s', c.startActor.id);
  params.set('g', c.endActor.id);
  params.set('p', c.par);
  params.set('cid', c.id);
  if (c.seriesLength > 1) {
    params.set('series', c.seriesLength);
    params.set('round', c.round || 0);
  }
  if (c.replyTo) params.set('reply', c.replyTo);
  const root = (typeof OrbitUtils !== 'undefined' && OrbitUtils.ROOT) ? OrbitUtils.ROOT : '../';
  const url = `${window.location.origin}/${root}games/journeys.html?${params.toString()}`
    .replace(/\/{2,}/g, '/').replace(':/', '://');
  navigator.clipboard.writeText(url).then(() => {
    alert('Challenge link copied to clipboard.');
  }).catch(() => {
    prompt('Copy this challenge link:', url);
  });
}

function playReceived(cid, data) {
  const c = data.received.find(x => x.id === cid);
  if (!c) return;
  const params = new URLSearchParams();
  params.set('s', c.startActor.id);
  params.set('g', c.endActor.id);
  params.set('p', c.par);
  params.set('cid', c.id);
  if (c.seriesLength > 1) {
    params.set('series', c.seriesLength);
    params.set('round', c.round || 0);
  }
  if (c.replyTo) params.set('reply', c.replyTo);
  if (c.from) params.set('n', c.from);
  window.location.href = `../games/journeys.html?${params.toString()}`;
}
