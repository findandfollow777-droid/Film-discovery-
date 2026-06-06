/* ============================================================
   ORBIT — Discovery Slider Interaction Module
   Phase 3a — added 2026-06-06
   Spec: ORBIT-UI-PATTERNS.md B1 §3 (.slider component).

   The .slider component in components/discover-components.css is an
   APPEARANCE-ONLY shell — it styles .track / .fill / .knob but the CSS
   header (discover-components.css:104) declares position "data-driven,
   set by the consuming tab via inline left/width". THIS module is that
   driver: it makes a .slider interactive (drag + keyboard + ARIA) and
   sets ONLY inline position. It never sets colour — the cyan→gold fill
   is CSS-owned (B1 §3, constant-thread rule).

   First consumer: Ratings-C (Phase 3b). Reused later by Production
   budget, Era runtime, Awards year-range — anything slider-bearing.

   PUBLIC API
     OrbitSlider.create(rootEl, options) -> controller
       options = {
         mode:    'single' | 'dual',
         min, max, step:   Number,
         value:   Number,            // single mode
         values:  [Number, Number],  // dual mode [low, high]
         onChange: (vals) => {},     // fires on every drag/keyboard change
         ariaLabel:  String,         // single (or low knob)
         ariaLabels: [String,String] // dual [low, high]
       }
     controller = {
       getValues(),   // single -> Number ; dual -> [low, high]
       setValues(v),  // single -> Number|[v] ; dual -> [low, high]  (does NOT fire onChange)
       destroy()      // removes all listeners (leaves DOM in place)
     }

   No dependencies, no build step, plain window global.
   ============================================================ */
(function (global) {
  "use strict";

  /* Double-definition guard — never clobber an already-loaded module. */
  if (global.OrbitSlider) return;

  function clampNum(v, lo, hi) {
    return Math.min(hi, Math.max(lo, v));
  }

  /* Coerce to a finite Number; fall back to `fallback` if NaN/undefined/
     non-numeric. The dual `values:[low,high]` path runs every element
     through this so a mis-wired or garbled option degrades to a bound
     instead of propagating NaN into positions + ARIA (Phase 3a fix). */
  function num(v, fallback) {
    var n = Number(v);
    return isFinite(n) ? n : fallback;
  }

  /* Decimal places implied by the step, so snapping doesn't surface
     floating-point dust (0.1 + 0.2 → 0.30000000000000004). */
  function decimalsOf(step) {
    var s = String(step);
    var dot = s.indexOf(".");
    return dot === -1 ? 0 : (s.length - dot - 1);
  }

  function create(rootEl, options) {
    if (!rootEl) throw new Error("OrbitSlider.create: rootEl is required");
    options = options || {};

    var mode = options.mode === "dual" ? "dual" : "single";
    var min = Number(options.min);
    var max = Number(options.max);
    var step = Number(options.step) > 0 ? Number(options.step) : 1;
    if (!(max > min)) throw new Error("OrbitSlider.create: max must be > min");
    var decimals = decimalsOf(step);
    var onChange = typeof options.onChange === "function" ? options.onChange : function () {};

    /* ---- ensure the .track / .fill / .knob skeleton (reuse or create) ---- */
    var track = rootEl.querySelector(".track");
    if (!track) { track = document.createElement("div"); track.className = "track"; rootEl.appendChild(track); }
    var fill = rootEl.querySelector(".fill");
    if (!fill) { fill = document.createElement("div"); fill.className = "fill"; rootEl.appendChild(fill); }

    var needed = mode === "dual" ? 2 : 1;
    var knobs = Array.prototype.slice.call(rootEl.querySelectorAll(".knob"));
    while (knobs.length < needed) {
      var k = document.createElement("div");
      k.className = "knob";
      rootEl.appendChild(k);
      knobs.push(k);
    }
    /* If markup carried extra knobs (e.g. a dual shell reused as single),
       hide the surplus rather than leave dead handles. */
    for (var x = needed; x < knobs.length; x++) { knobs[x].style.display = "none"; }
    knobs = knobs.slice(0, needed);

    /* ---- value snapping / state ---- */
    function snap(v) {
      var n = num(v, min);                 // NaN guard: degrade to lower bound, never propagate
      var s = Math.round((n - min) / step) * step + min;
      return clampNum(parseFloat(s.toFixed(decimals)), min, max);
    }
    function roundOut(v) { return parseFloat(Number(v).toFixed(decimals)); }

    var values; // always an array internally: [v] | [low, high]
    if (mode === "dual") {
      /* Only an actual array is a valid source; anything else (undefined,
         a stray scalar, a garbled value) falls back element-wise to the
         bounds via num() so init can never yield [NaN, NaN]. */
      var vs = Array.isArray(options.values) ? options.values : [];
      var lo = snap(num(vs[0], min));
      var hi = snap(num(vs[1], max));
      if (lo > hi) { var t = lo; lo = hi; hi = t; }
      values = [lo, hi];
    } else {
      values = [snap(num(options.value, min))];
    }

    /* ---- ARIA + focusability ---- */
    var labels = options.ariaLabels || [options.ariaLabel || "Value", options.ariaLabel || "Value"];
    knobs.forEach(function (knob, i) {
      knob.setAttribute("role", "slider");
      knob.setAttribute("tabindex", "0");
      knob.setAttribute("aria-label", mode === "dual" ? (labels[i] || (i === 0 ? "Minimum" : "Maximum")) : (labels[0] || "Value"));
    });

    /* Position % for a value, clamped to [0,100]; a NaN value degrades to
       0% instead of writing "NaN%" into inline left/width. */
    function pct(v) {
      var p = ((num(v, min) - min) / (max - min)) * 100;
      return isFinite(p) ? clampNum(p, 0, 100) : 0;
    }

    function setAria(knob, vmin, vmax, vnow) {
      /* defensive: a NaN cross-ref or value degrades to the nearest bound
         rather than emitting aria-value*="NaN" to the DOM. */
      var lo = roundOut(num(vmin, min));
      var hi = roundOut(num(vmax, max));
      var now = roundOut(num(vnow, lo));
      knob.setAttribute("aria-valuemin", lo);
      knob.setAttribute("aria-valuemax", hi);
      knob.setAttribute("aria-valuenow", now);
      knob.setAttribute("aria-valuetext", String(now));
    }

    function render() {
      if (mode === "single") {
        var p = pct(values[0]);
        fill.style.left = "0%";
        fill.style.width = p + "%";
        knobs[0].style.left = p + "%";
        setAria(knobs[0], min, max, values[0]);
      } else {
        var lop = pct(values[0]);
        var hip = pct(values[1]);
        fill.style.left = lop + "%";
        fill.style.width = (hip - lop) + "%";
        knobs[0].style.left = lop + "%";
        knobs[1].style.left = hip + "%";
        /* each knob's range reflects the opposing knob's clamp (no cross) */
        setAria(knobs[0], min, values[1], values[0]);
        setAria(knobs[1], values[0], max, values[1]);
      }
    }

    function getValues() {
      return mode === "dual" ? values.slice() : values[0];
    }

    /* Set knob i to value v, enforcing step + clamp + non-cross. */
    function setKnob(i, v, emit) {
      v = snap(v);
      if (mode === "dual") {
        if (i === 0) v = clampNum(v, min, values[1]);   // low can't pass high
        else v = clampNum(v, values[0], max);            // high can't pass low
      } else {
        v = clampNum(v, min, max);
      }
      var changed = v !== values[i];
      values[i] = v;
      render();
      if (emit && changed) onChange(getValues());
    }

    /* ---- pointer geometry ---- */
    function fractionFromEvent(e) {
      var r = track.getBoundingClientRect();
      if (r.width === 0) return 0;
      return clampNum((e.clientX - r.left) / r.width, 0, 1);
    }
    function valueFromFraction(f) { return min + f * (max - min); }

    /* Which knob a pointer grabs. For dual, the nearest — but when both
       sit on the same spot, pick by direction so a stacked pair can still
       be pulled apart (drag right grabs high, drag left grabs low). */
    function pickKnob(f) {
      if (mode === "single") return 0;
      var v = valueFromFraction(f);
      if (values[0] === values[1]) return v >= values[0] ? 1 : 0;
      return Math.abs(v - values[0]) <= Math.abs(v - values[1]) ? 0 : 1;
    }

    /* ---- listener bookkeeping for destroy() ---- */
    var bound = [];
    function on(el, type, fn, opts) {
      el.addEventListener(type, fn, opts);
      bound.push({ el: el, type: type, fn: fn, opts: opts });
    }

    /* Drag model (b): move/up are bound to DOCUMENT for the gesture's
       duration, not to the knob — so the drag follows the cursor anywhere
       on screen (including outside the slider) and never drops when the
       pointer outruns the 14px knob. No setPointerCapture: document-bound
       listeners always fire regardless of target. The active knob is LOCKED
       at pointerdown (pickKnob runs once, here only) — cross-prevention is
       by clamping that locked knob in setKnob(), never by re-picking. */
    var dragMove = null, dragUp = null;
    function endDrag() {
      if (dragMove) document.removeEventListener("pointermove", dragMove);
      if (dragUp) {
        document.removeEventListener("pointerup", dragUp);
        document.removeEventListener("pointercancel", dragUp);
      }
      dragMove = dragUp = null;
    }

    function onPointerDown(e) {
      /* ignore non-primary buttons */
      if (e.button != null && e.button !== 0) return;
      e.preventDefault();
      endDrag(); // clear any stale drag before starting a new one

      var f = fractionFromEvent(e);
      var i = pickKnob(f);       // active knob locked for the WHOLE gesture
      knobs[i].focus();
      setKnob(i, valueFromFraction(f), true);

      dragMove = function (ev) {
        ev.preventDefault();                    // suppress text-select / touch-scroll while dragging
        /* fraction from the TRACK rect first, THEN map to value (the value
           commits continuously, so it stays at the drop point on release). */
        setKnob(i, valueFromFraction(fractionFromEvent(ev)), true);
      };
      dragUp = function () { endDrag(); };       // commit-at-drop: last move already set it, no snap-back

      document.addEventListener("pointermove", dragMove);
      document.addEventListener("pointerup", dragUp);
      document.addEventListener("pointercancel", dragUp);
    }
    on(rootEl, "pointerdown", onPointerDown);

    /* Keyboard — per knob. Arrows nudge by step, PageUp/Down by 10×,
       Home/End jump to the (clamped) ends. */
    knobs.forEach(function (knob, i) {
      function onKey(e) {
        var v = values[i];
        switch (e.key) {
          case "ArrowRight": case "ArrowUp":   v += step; break;
          case "ArrowLeft":  case "ArrowDown": v -= step; break;
          case "PageUp":   v += step * 10; break;
          case "PageDown": v -= step * 10; break;
          case "Home": v = min; break;
          case "End":  v = max; break;
          default: return;
        }
        e.preventDefault();
        setKnob(i, v, true);
      }
      on(knob, "keydown", onKey);
    });

    /* ---- public controller ---- */
    function setValues(nv) {
      if (mode === "dual") {
        var arr = Array.isArray(nv) ? nv : [nv, nv];
        var lo = snap(arr[0]);
        var hi = snap(arr[1]);
        if (lo > hi) { var t = lo; lo = hi; hi = t; }
        values[0] = clampNum(lo, min, max);
        values[1] = clampNum(hi, min, max);
      } else {
        var single = Array.isArray(nv) ? nv[0] : nv;
        values[0] = clampNum(snap(single), min, max);
      }
      render(); // programmatic set does NOT fire onChange (avoids feedback loops)
    }

    function destroy() {
      endDrag(); // remove any in-flight document-bound move/up listeners
      bound.forEach(function (b) { b.el.removeEventListener(b.type, b.fn, b.opts); });
      bound.length = 0;
    }

    render(); // initial paint
    return { getValues: getValues, setValues: setValues, destroy: destroy };
  }

  global.OrbitSlider = { create: create };
})(typeof window !== "undefined" ? window : this);
