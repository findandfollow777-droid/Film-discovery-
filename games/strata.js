/* ============================================================
   STRATA — daily game logic (Phase 3)
   Renders into the Phase-2 skin classes (strata.css); this file
   toggles state classes only — all colour lives in strata.css.
   Consumes window.STRATA_BOARDS from strata-puzzles.js.
   ORBIT integration mirrors collision.js (getTodayKey / stats /
   clipboard share flash).
   ============================================================ */

(function () {
  'use strict';

  const BOARDS = window.STRATA_BOARDS || [];

  /* ============================================================
     CORE LOGIC — ported verbatim (DOM-agnostic; mutates `st`)
     ============================================================ */
  let B, st;
  function loadBoard(idx){
    B=BOARDS[idx % BOARDS.length];
    st={ idx, ptr:B.stacks.map(()=>0), locked:B.stacks.map(()=>false), live:new Set(),
         filled:{}, pips:{}, keys:0, armed:false, sel:null, justDug:null, gone:null, reveal:null,
         cleared:0, total:B.stacks.reduce((s,a)=>s+a.length,0), status:'play',
         msg:'Tap a tile, then the card it belongs to. A wrong card locks the stack.' };
    B.stacks.forEach((s,i)=>{ if(s.length) st.live.add(s[0].g); });
    render();
  }
  function topOf(s){ return st.ptr[s]<B.stacks[s].length ? B.stacks[s][st.ptr[s]] : null; }
  function refreshLive(){ for(let s=0;s<9;s++){ const t=topOf(s); if(t) st.live.add(t.g); } }
  function liveGens(){ return [...st.live].filter(g=>!genDone(g)).sort((a,b)=>a-b); }
  function cid(g,ax){ return g+'-'+ax; }
  // A generation retires only when its cards are quota-filled AND its keystone
  // has been revealed. pips are set ONLY on keystone reveal, so they double as
  // the "keystone found" test — this keeps a gen's (full) cards on screen as a
  // valid target until the buried keystone surfaces and is sorted.
  function genDone(g){
    const full = B.gens[g].cards.every(c=>(st.filled[cid(g,c.axis)]||0)>=quota(g));
    const ksRevealed = B.gens[g].cards.every(c=>st.pips[cid(g,c.axis)]);
    return full && ksRevealed;
  }
  function quota(g){ if(st._q) return st._q; return st._q = countSingles(0, B.gens[0].cards[0].axis); }
  function countSingles(g,ax){ let n=0; B.stacks.forEach(stk=>stk.forEach(t=>{ if(t.g===g&&t.a===ax) n++; })); return n; }
  function need(g,ax){ return countSingles(g,ax); }

  function select(s){
    if(st.status!=='play')return;
    if(st.locked[s]){
      if(st.armed&&st.keys>0){ st.keys--; st.armed=false; st.locked[s]=false; st.msg='Key spent — stack freed.'; render(); }
      else { st.msg='That stack is locked. Tap a key in the tray to arm it, then tap the stack.'; render(); }
      return;
    }
    if(!topOf(s))return;
    st.sel=(st.sel===s?null:s); st.justDug=null; render();
  }
  function clearTop(s){ st.gone=s; render();
    setTimeout(()=>{ st.ptr[s]++; st.cleared++; st.justDug=s; st.gone=null; refreshLive(); finishMove(); },180);
  }
  function assign(g,ax){
    if(st.sel==null){ st.msg='Tap a tile first.'; render(); return; }
    const s=st.sel,t=topOf(s);
    // Keystone is checked FIRST — before the card-full guard — so it is
    // discovered by sorting (never by looking) and can go into an already-full
    // card of its own generation. A keystone consumes no quota slot.
    if(t.a==='K'){
      if(g===t.g){
        // CORRECT — any card of the keystone's OWN generation reveals it.
        B.gens[t.g].cards.forEach(c=>st.pips[cid(t.g,c.axis)]=true);
        st.keys++; st.sel=null;
        st.msg='★ Keystone! '+t.t+' tied all three — banked a key.';
        revealKeystone(s);
      } else {
        // WRONG generation — lock the stack, like any bad placement.
        st.locked[s]=true; st.sel=null;
        st.msg='✗ '+t.t+' doesn’t belong there. Stack locked — free it with a key.';
        finishMove();
      }
      return;
    }
    const id=cid(g,ax),q=need(g,ax);
    if((st.filled[id]||0)>=q){ st.msg='That card is already full.'; render(); return; }
    if(t.a===ax && t.g===g){
      st.filled[id]=(st.filled[id]||0)+1;
      st.msg='✓ '+t.t+' → '+B.gens[g].cards.find(c=>c.axis===ax).label+'.'+(st.filled[id]>=q?'  Card complete.':'');
      st.sel=null; clearTop(s);
    } else {
      st.locked[s]=true; st.sel=null;
      st.msg='✗ '+t.t+' isn’t '+B.gens[g].cards.find(c=>c.axis===ax).label+'. Stack locked — free it with a key.';
      finishMove();
    }
  }
  // Keystone reveal — same bookkeeping as clearTop but with a longer gold
  // flourish (~450ms) so the payoff reads. No quota slot is consumed.
  function revealKeystone(s){ st.reveal=s; render();
    setTimeout(()=>{ st.ptr[s]++; st.cleared++; st.justDug=s; st.reveal=null; refreshLive(); finishMove(); },450);
  }
  function finishMove(){
    if(st.cleared>=st.total){ st.status='won'; onGameEnd(true); }
    else { const open=[...Array(9).keys()].filter(s=>topOf(s)!==null);
      if(open.length && open.every(s=>st.locked[s]) && st.keys===0){ st.status='dead'; onGameEnd(false); } }
    render();
    if(st.justDug!=null){ const jd=st.justDug; setTimeout(()=>{ if(st.justDug===jd){ st.justDug=null; render(); } },1150); }
  }
  function armKey(){ if(st.keys>0){ st.armed=!st.armed; st.msg=st.armed?'Key armed — tap a locked stack to free it.':'Key disarmed.'; render(); } }

  /* ============================================================
     RENDER — rebuilds the game area into the Phase-2 classes.
     Pure function of `st`; no DOM diffing.
     ============================================================ */
  let gameMain, resultPopup, statsPopup, helpPopup, statsBtn, helpBtn;

  // Inline board-canvas art (same idiom as the Phase-2 static board).
  const EYE_SVG  = '<svg class="depth-eye" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6z"/><circle cx="12" cy="12" r="2.4" fill="currentColor" stroke="none"/></svg>';
  const DIAMOND_SVG = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l6 9-6 9-6-9z"/></svg>';
  // lowest live gen = cyan, then gold, then a third accent. Only fam-cyan/
  // fam-gold are defined in strata.css (Phase 2); fam-strata falls back to
  // the .gen-row cyan default until a third-family rule is added there.
  const FAM_CLASSES = ['fam-cyan', 'fam-gold', 'fam-strata'];

  function esc(v){ return String(v).replace(/[&<>"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
  function titleAxis(ax){ return ax.charAt(0)+ax.slice(1).toLowerCase(); }

  function tileHTML(s){
    const stk=B.stacks[s], remaining=stk.length-st.ptr[s], t=topOf(s);
    if(!t){ return '<div class="strata-tile empty" data-position="'+s+'"></div>'; }
    // Keystones are indistinguishable from an ordinary tile of their generation
    // (cyan chip, family diamond, no gold) — gold only appears on reveal.
    const cls=['strata-tile', 'fam-cyan', 'depth-'+Math.min(Math.max(remaining,1),3)];
    if(st.sel===s) cls.push('selected');
    if(st.locked[s]) cls.push('locked');
    if(st.gone===s) cls.push('gone');
    if(st.reveal===s) cls.push('reveal');
    if(st.justDug===s) cls.push('flash');
    let lays='';
    for(let i=Math.min(remaining-1,3); i>=1; i--) lays+='<div class="strata-lay lay-'+i+'"></div>';
    return '<div class="'+cls.join(' ')+'" data-position="'+s+'">'+lays+
      '<div class="tile-face">'+
        '<div class="depth-chip">'+EYE_SVG+'<span class="depth-num">'+remaining+'</span></div>'+
        '<span class="family-mark">'+DIAMOND_SVG+'</span>'+
        '<div class="tile-title">'+esc(t.t)+'</div>'+
      '</div></div>';
  }

  function cardHTML(g,c){
    const id=cid(g,c.axis), nd=need(g,c.axis), fl=st.filled[id]||0;
    let dots='';
    for(let i=0;i<nd;i++) dots+='<span class="dot'+(i<fl?' filled':'')+'"></span>';
    const pip = st.pips[id] ? '<span class="og og-star card-pip" title="Keystone hint"></span>' : '';
    return '<div class="sort-card'+(fl>=nd?' full':'')+'" data-g="'+g+'" data-ax="'+esc(c.axis)+'">'+
      pip+
      '<span class="axis-label">'+titleAxis(c.axis)+'</span>'+
      '<span class="axis-value">'+esc(c.label)+'</span>'+
      '<div class="quota-dots">'+dots+'</div>'+
    '</div>';
  }

  function render(){
    if(!gameMain) return;
    const remainingTotal = st.total - st.cleared;

    const dig = '<div class="dig-header">'+
      '<div class="dig-label"><span class="dig-title">The Dig</span><span class="dig-sub">'+remainingTotal+' to Bedrock</span></div>'+
      '<div class="keys-readout"><span class="og og-star keys-nova"></span><span class="keys-count">'+st.keys+'</span><span class="keys-label">Keys</span></div>'+
    '</div>';

    let tiles='';
    for(let s=0;s<9;s++) tiles+=tileHTML(s);
    const board='<section class="strata-board" id="strataBoard">'+tiles+'</section>';

    const sortDir='<div class="sort-direction">Sort the selected tile into <span class="sort-arrow">↓</span></div>';

    let rows='';
    liveGens().forEach((g,i)=>{
      rows+='<div class="gen-row '+FAM_CLASSES[i%FAM_CLASSES.length]+'">'+
        '<div class="fam-tab">'+DIAMOND_SVG+'</div>'+
        '<div class="gen-cards">'+B.gens[g].cards.map(c=>cardHTML(g,c)).join('')+'</div>'+
      '</div>';
    });
    const sortArea='<section class="sort-area">'+rows+'</section>';

    let tray;
    if(st.keys>0){
      let pills='';
      for(let i=0;i<st.keys;i++){ const armed=(st.armed&&i===st.keys-1)?' armed':''; pills+='<span class="key-pill'+armed+'"><span class="og og-star"></span> Key</span>'; }
      tray='<span class="key-tray-label">Key Tray</span><div class="key-slots">'+pills+'</div>';
    } else {
      tray='<span class="key-tray-label">Key Tray</span><div class="key-slots"><span class="key-empty">none yet</span></div>';
    }
    const keyTray='<section class="key-tray">'+tray+'</section>';

    const msg='<div class="strata-msg">'+esc(st.msg)+'</div>';

    const footer='<footer class="strata-footer">'+
      '<button class="btn-secondary" id="restartBtn" type="button">Restart</button>'+
      '<button class="btn-secondary" id="nextBoardBtn" type="button">Next Board →</button>'+
    '</footer>';

    gameMain.innerHTML = dig + board + sortDir + sortArea + keyTray + msg + footer;
  }

  /* ============================================================
     ORBIT INTEGRATION — daily state, stats, share
     ============================================================ */
  function getTodayKey(){ const d=new Date(); return d.getFullYear()+'_'+(d.getMonth()+1)+'_'+d.getDate(); }
  function dailyKey(){ return 'orbit_strata_'+getTodayKey(); }

  function saveDailyState(won){
    localStorage.setItem(dailyKey(), JSON.stringify({
      status: won?'won':'lost', keys:st.keys, cleared:st.cleared, total:st.total, idx:st.idx, ts:Date.now()
    }));
  }
  function loadDailyState(){ try{ return JSON.parse(localStorage.getItem(dailyKey())); }catch(e){ return null; } }

  function getStats(){ try{ return JSON.parse(localStorage.getItem('orbit_strata_stats')) || {}; }catch(e){ return {}; } }
  function saveStats(s){ localStorage.setItem('orbit_strata_stats', JSON.stringify(s)); }
  function updateStats(won){
    const s=Object.assign({played:0,won:0,currentStreak:0,maxStreak:0,totalKeys:0,bestKeys:0,lastPlayed:null}, getStats());
    const day=OrbitUtils.getDayNumber();
    if(s.lastPlayed===day) return; // already counted today's dig
    s.played++;
    if(won){ s.won++; s.currentStreak=(s.lastPlayed===day-1)?s.currentStreak+1:1; }
    else { s.currentStreak=0; }
    s.maxStreak=Math.max(s.maxStreak, s.currentStreak);
    s.totalKeys+=st.keys; s.bestKeys=Math.max(s.bestKeys, st.keys);
    s.lastPlayed=day;
    saveStats(s);
  }

  function onGameEnd(won){ saveDailyState(won); updateStats(won); showResult(won); }

  function showResult(won){
    if(!resultPopup) return;
    const mc=resultPopup.querySelector('.modal-content');
    const title=won?'Bottom Reached':'Choked';
    const sub=won?('You cleared all '+st.total+' tiles and reached bedrock.')
                 :('Every open stack locked with no keys left to free them.');
    mc.innerHTML=
      '<button class="modal-close orbit-close" aria-label="Close">&#x2715;</button>'+
      '<h2 class="modal-title">'+title+'</h2>'+
      '<p class="modal-placeholder">'+sub+'</p>'+
      '<p class="modal-placeholder">Keys banked: '+st.keys+'</p>'+
      '<p class="modal-placeholder">Cleared: '+st.cleared+' / '+st.total+'</p>'+
      '<div class="strata-footer"><button class="btn-secondary" id="strataShareBtn" type="button"><span class="og og-clipboard"></span> Share Result</button></div>';
    openPopup('strataResult');
  }

  // Share grid mapping (spoiler-free): one square per stack, row-major 3x3.
  //   🟦 (blue)  = stack fully cleared to bedrock
  //   ⬛  (black) = stack still locked / unfinished
  function shareResult(btn){
    const day=OrbitUtils.getDayNumber();
    const won=st.status==='won';
    let grid='';
    for(let r=0;r<3;r++){ let row=''; for(let c=0;c<3;c++){ const s=r*3+c; row+=(st.ptr[s]>=B.stacks[s].length)?'🟦':'⬛'; } grid+=row+'\n'; }
    const text='🎬 Strata #'+day+' '+(won?'BOTTOM REACHED':'CHOKED')+'\n\n'+grid+'\nKeys: '+st.keys+' ◆\n\nPlay at orbit-game.com';
    navigator.clipboard.writeText(text).then(function(){
      const orig=btn.innerHTML;
      btn.innerHTML='<span>✓</span> Copied!';
      setTimeout(function(){ btn.innerHTML=orig; },2000);
    }).catch(function(){});
  }

  function renderStats(){
    if(!statsPopup) return;
    const s=Object.assign({played:0,won:0,currentStreak:0,maxStreak:0,totalKeys:0,bestKeys:0}, getStats());
    const winPct=s.played ? Math.round(s.won/s.played*100) : 0;
    const mc=statsPopup.querySelector('.modal-content');
    mc.innerHTML=
      '<button class="modal-close orbit-close" aria-label="Close">&#x2715;</button>'+
      '<h2 class="modal-title">Statistics</h2>'+
      '<p class="modal-placeholder">Digs played: '+s.played+'</p>'+
      '<p class="modal-placeholder">Bedrock reached: '+s.won+' ('+winPct+'%)</p>'+
      '<p class="modal-placeholder">Current streak: '+s.currentStreak+'</p>'+
      '<p class="modal-placeholder">Best streak: '+s.maxStreak+'</p>'+
      '<p class="modal-placeholder">Best keys in one dig: '+s.bestKeys+'</p>';
  }

  function openPopup(id){ const p=document.getElementById(id); if(p) p.hidden=false; }

  /* ============================================================
     EVENT WIRING + BOOT
     ============================================================ */
  function onGameClick(e){
    const restart=e.target.closest('#restartBtn'); if(restart){ loadBoard(st.idx); return; }
    const next=e.target.closest('#nextBoardBtn'); if(next){ loadBoard(st.idx+1); return; }
    const card=e.target.closest('.sort-card'); if(card && card.dataset.g!==undefined){ assign(+card.dataset.g, card.dataset.ax); return; }
    const pill=e.target.closest('.key-pill'); if(pill){ armKey(); return; }
    const tile=e.target.closest('.strata-tile'); if(tile && tile.dataset.position!==undefined){ select(+tile.dataset.position); return; }
  }

  function init(){
    gameMain=document.querySelector('.game-main');
    resultPopup=document.getElementById('strataResult');
    statsPopup=document.getElementById('strataStats');
    helpPopup=document.getElementById('strataHelp');
    statsBtn=document.getElementById('statsBtn');
    helpBtn=document.getElementById('helpBtn');

    if(!gameMain) return;
    if(!BOARDS.length){ gameMain.innerHTML='<div class="strata-msg">Daily boards failed to load.</div>'; return; }

    gameMain.addEventListener('click', onGameClick);
    document.addEventListener('click', function(e){
      const share=e.target.closest('#strataShareBtn'); if(share) shareResult(share);
    });
    if(statsBtn) statsBtn.addEventListener('click', function(){ renderStats(); openPopup('strataStats'); });
    if(helpBtn)  helpBtn.addEventListener('click', function(){ openPopup('strataHelp'); });

    const idx=OrbitUtils.getPuzzleIndex(BOARDS.length);
    const saved=loadDailyState();
    if(saved && saved.idx===idx && (saved.status==='won' || saved.status==='lost')){
      // Finished today already — restore result, no replay.
      loadBoard(idx);
      st.status = saved.status==='won' ? 'won' : 'dead';
      st.keys   = saved.keys || 0;
      st.cleared= (saved.cleared!=null) ? saved.cleared : st.cleared;
      render();
      showResult(saved.status==='won');
    } else {
      loadBoard(idx);
    }
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();
