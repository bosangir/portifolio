(function () {
  "use strict";
  var D = window.PORTFOLIO;
  var C = { teal: "#2dd4bf", amber: "#fbbf24", coral: "#fb7185", violet: "#a78bfa", sky: "#38bdf8", lime: "#a3e635", text: "#e6edf7", muted: "#94a3b8", grid: "rgba(148,178,222,0.12)", axis: "rgba(148,178,222,0.35)" };
  var PALETTE = [C.teal, C.amber, C.violet, C.coral, C.sky, C.lime];
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- maths helpers ---------------- */
  function randn() { var u = 0, v = 0; while (u === 0) u = Math.random(); while (v === 0) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
  function erf(x) { var s = x < 0 ? -1 : 1; x = Math.abs(x); var t = 1 / (1 + 0.3275911 * x); var y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x); return s * y; }
  function pnorm(z) { return 0.5 * (1 + erf(z / Math.SQRT2)); }
  function qnorm(p) {
    var a = [-39.69683028665376, 220.9460984245205, -275.9285104469687, 138.357751867269, -30.66479806614716, 2.506628277459239];
    var b = [-54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572];
    var c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
    var d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416];
    var q, r, pl = 0.02425;
    if (p < pl) { q = Math.sqrt(-2 * Math.log(p)); return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
    if (p > 1 - pl) { q = Math.sqrt(-2 * Math.log(1 - p)); return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
    q = p - 0.5; r = q * q;
    return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  }
  function lgamma(x) {
    var g = 7, cf = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
    if (x < 0.5) return Math.log(Math.PI / Math.abs(Math.sin(Math.PI * x))) - lgamma(1 - x);
    x -= 1; var a = cf[0], t = x + g + 0.5;
    for (var i = 1; i < 9; i++) a += cf[i] / (x + i);
    return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
  }
  function rgamma(k) {
    if (k < 1) return rgamma(1 + k) * Math.pow(Math.random(), 1 / k);
    var d = k - 1 / 3, c = 1 / Math.sqrt(9 * d);
    for (;;) { var x, v; do { x = randn(); v = 1 + c * x; } while (v <= 0); v = v * v * v; var u = Math.random(); if (u < 1 - 0.0331 * x * x * x * x) return d * v; if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) return d * v; }
  }
  function rbeta(a, b) { var x = rgamma(a), y = rgamma(b); return x / (x + y); }
  function rbinom(n, p) { var s = 0; for (var i = 0; i < n; i++) if (Math.random() < p) s++; return s; }
  function mean(a) { var s = 0; for (var i = 0; i < a.length; i++) s += a[i]; return s / a.length; }
  function sd(a) { var m = mean(a), s = 0; for (var i = 0; i < a.length; i++) s += (a[i] - m) * (a[i] - m); return Math.sqrt(s / (a.length - 1)); }
  function fmt(x, d) { return (x === undefined || isNaN(x)) ? "–" : Number(x).toFixed(d === undefined ? 2 : d); }
  function pct(x, d) { return fmt(100 * x, d === undefined ? 1 : d) + "%"; }
  function fmtP(p) { return p < 0.001 ? "< 0.001" : fmt(p, 3); }

  /* ---------------- canvas helpers ---------------- */
  function setup(canvas) {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = canvas.clientWidth, h = canvas.clientHeight;
    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) { canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr); }
    var ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    return { ctx: ctx, w: w, h: h };
  }
  function ticks(min, max, n) {
    var span = max - min, step = Math.pow(10, Math.floor(Math.log10(span / n))), err = n / span * step;
    if (err <= 0.15) step *= 10; else if (err <= 0.35) step *= 5; else if (err <= 0.75) step *= 2;
    var out = [], s = Math.ceil(min / step) * step;
    for (var v = s; v <= max + 1e-9; v += step) out.push(+v.toFixed(10));
    return out;
  }
  function frame(g, o) {
    var ctx = g.ctx, pad = { l: o.padL || 54, r: 18, t: o.padT || 26, b: 46 };
    var X0 = pad.l, X1 = g.w - pad.r, Y0 = g.h - pad.b, Y1 = pad.t;
    var sx = function (x) { return X0 + (x - o.xmin) / (o.xmax - o.xmin) * (X1 - X0); };
    var sy = function (y) { return Y0 - (y - o.ymin) / (o.ymax - o.ymin) * (Y0 - Y1); };
    ctx.font = "11px JetBrains Mono, monospace"; ctx.lineWidth = 1;
    var xt = o.xticks || ticks(o.xmin, o.xmax, Math.max(3, Math.floor((X1 - X0) / 80)));
    var yt = o.yticks || ticks(o.ymin, o.ymax, 5);
    ctx.textAlign = "center"; ctx.textBaseline = "top";
    xt.forEach(function (t) { ctx.strokeStyle = C.grid; ctx.beginPath(); ctx.moveTo(sx(t), Y0); ctx.lineTo(sx(t), Y1); ctx.stroke(); ctx.fillStyle = C.muted; ctx.fillText(o.xf ? o.xf(t) : t, sx(t), Y0 + 6); });
    ctx.textAlign = "right"; ctx.textBaseline = "middle";
    yt.forEach(function (t) { ctx.strokeStyle = C.grid; ctx.beginPath(); ctx.moveTo(X0, sy(t)); ctx.lineTo(X1, sy(t)); ctx.stroke(); ctx.fillStyle = C.muted; ctx.fillText(o.yf ? o.yf(t) : t, X0 - 8, sy(t)); });
    ctx.strokeStyle = C.axis; ctx.beginPath(); ctx.moveTo(X0, Y1); ctx.lineTo(X0, Y0); ctx.lineTo(X1, Y0); ctx.stroke();
    ctx.fillStyle = C.muted; ctx.font = "12px Inter, sans-serif";
    if (o.xlabel) { ctx.textAlign = "center"; ctx.textBaseline = "bottom"; ctx.fillText(o.xlabel, (X0 + X1) / 2, g.h - 4); }
    if (o.ylabel) { ctx.save(); ctx.translate(13, (Y0 + Y1) / 2); ctx.rotate(-Math.PI / 2); ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(o.ylabel, 0, 0); ctx.restore(); }
    return { sx: sx, sy: sy, X0: X0, X1: X1, Y0: Y0, Y1: Y1 };
  }
  function title(g, txt, sub) {
    var ctx = g.ctx; ctx.textAlign = "left"; ctx.textBaseline = "top";
    ctx.fillStyle = C.text; ctx.font = "600 14px Inter, sans-serif"; ctx.fillText(txt, 8, 2);
    if (sub) { ctx.fillStyle = C.muted; ctx.font = "12px Inter, sans-serif"; ctx.fillText(sub, 8, 20); }
  }
  function legend(g, items, x, y) {
    var ctx = g.ctx; ctx.font = "12px Inter, sans-serif"; ctx.textAlign = "left"; ctx.textBaseline = "middle";
    items.forEach(function (it, i) { ctx.fillStyle = it[1]; ctx.fillRect(x, y + i * 18 - 5, 12, 10); ctx.fillStyle = C.text; ctx.fillText(it[0], x + 18, y + i * 18); });
  }
  function hexA(hex, a) { var n = parseInt(hex.slice(1), 16); return "rgba(" + (n >> 16) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")"; }

  /* ---------------- chrome: nav, progress, reveal ---------------- */
  var nav = $("#nav"), prog = $("#progress");
  window.addEventListener("scroll", function () {
    var st = window.scrollY, max = document.documentElement.scrollHeight - innerHeight;
    prog.style.width = (max > 0 ? st / max * 100 : 0) + "%";
    nav.classList.toggle("scrolled", st > 10);
  }, { passive: true });
  var toggle = $("#navToggle"), links = $("#navLinks");
  toggle.addEventListener("click", function () { var o = links.classList.toggle("open"); toggle.setAttribute("aria-expanded", o); });
  $$("#navLinks a").forEach(function (a) { a.addEventListener("click", function () { links.classList.remove("open"); toggle.setAttribute("aria-expanded", false); }); });

  var navMap = {};
  $$("#navLinks a").forEach(function (a) { navMap[a.getAttribute("href").slice(1)] = a; });
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { threshold: 0.12 });
    $$(".reveal").forEach(function (el) { io.observe(el); });
    var so = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting && navMap[e.target.id]) { $$("#navLinks a").forEach(function (a) { a.classList.remove("active"); }); navMap[e.target.id].classList.add("active"); } });
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$("main section[id]").forEach(function (s) { so.observe(s); });
  } else { $$(".reveal").forEach(function (el) { el.classList.add("in"); }); }

  $("#year").textContent = new Date().getFullYear();

  /* counters */
  $$("[data-count]").forEach(function (el) {
    var target = +el.dataset.count, suf = el.dataset.suffix || "", t0 = null;
    function step(t) { if (!t0) t0 = t; var k = Math.min(1, (t - t0) / 1400); el.textContent = Math.round(target * (1 - Math.pow(1 - k, 3))) + suf; if (k < 1) requestAnimationFrame(step); }
    setTimeout(function () { requestAnimationFrame(step); }, 400);
  });

  /* typed code line */
  (function () {
    var el = $("#typed"), lines = D.typed, li = 0, ci = 0, del = false;
    if (reduceMotion) { el.textContent = lines[0]; return; }
    function tick() {
      var s = lines[li];
      if (!del) { ci++; el.textContent = s.slice(0, ci); if (ci === s.length) { del = true; return setTimeout(tick, 1800); } }
      else { ci -= 2; el.textContent = s.slice(0, Math.max(0, ci)); if (ci <= 0) { del = false; ci = 0; li = (li + 1) % lines.length; } }
      setTimeout(tick, del ? 18 : 42);
    }
    tick();
  })();

  /* ---------------- hero background ---------------- */
  (function () {
    var cv = $("#heroCanvas"), pts = [], t = 0;
    for (var i = 0; i < 70; i++) pts.push({ x: Math.random(), y: Math.random(), vx: (Math.random() - .5) * .0006, vy: (Math.random() - .5) * .0006, c: PALETTE[i % 4] });
    function draw() {
      var g = setup(cv), ctx = g.ctx, w = g.w, h = g.h;
      // flowing density curves
      for (var k = 0; k < 4; k++) {
        var mu = 0.25 + k * 0.17 + 0.04 * Math.sin(t * 0.4 + k), s = 0.06 + 0.02 * k + 0.01 * Math.sin(t * 0.3 + k * 2);
        ctx.beginPath();
        for (var x = 0; x <= w; x += 6) {
          var u = x / w, y = Math.exp(-0.5 * Math.pow((u - mu) / s, 2));
          var py = h * 0.98 - y * h * (0.32 - k * 0.04);
          if (x === 0) ctx.moveTo(x, py); else ctx.lineTo(x, py);
        }
        ctx.strokeStyle = hexA(PALETTE[k], 0.35); ctx.lineWidth = 1.6; ctx.stroke();
        ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath(); ctx.fillStyle = hexA(PALETTE[k], 0.035); ctx.fill();
      }
      // network of points
      pts.forEach(function (p) { p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > 1) p.vx *= -1; if (p.y < 0 || p.y > 1) p.vy *= -1; });
      for (var a = 0; a < pts.length; a++) for (var b = a + 1; b < pts.length; b++) {
        var dx = (pts[a].x - pts[b].x) * w, dy = (pts[a].y - pts[b].y) * h, d = Math.sqrt(dx * dx + dy * dy);
        if (d < 120) { ctx.strokeStyle = "rgba(148,178,222," + (0.12 * (1 - d / 120)) + ")"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(pts[a].x * w, pts[a].y * h); ctx.lineTo(pts[b].x * w, pts[b].y * h); ctx.stroke(); }
      }
      pts.forEach(function (p) { ctx.fillStyle = hexA(p.c, 0.7); ctx.beginPath(); ctx.arc(p.x * w, p.y * h, 2, 0, 7); ctx.fill(); });
      t += 0.016;
      if (!reduceMotion) requestAnimationFrame(draw);
    }
    draw();
  })();

  /* mini posterior sparkline */
  (function () {
    var a = 1, b = 1, n = 0, trueP = 0.68;
    var line = $("#miniLine"), area = $("#miniArea");
    function render() {
      var pts = [], lb = lgamma(a + b) - lgamma(a) - lgamma(b), mx = 0, vals = [];
      for (var i = 1; i < 100; i++) { var x = i / 100, v = Math.exp(lb + (a - 1) * Math.log(x) + (b - 1) * Math.log(1 - x)); vals.push(v); if (v > mx) mx = v; }
      vals.forEach(function (v, i) { pts.push(((i + 1) / 100 * 300).toFixed(1) + "," + (66 - v / mx * 60).toFixed(1)); });
      var d = "M" + pts.join(" L");
      line.setAttribute("d", d); area.setAttribute("d", d + " L300,70 L0,70 Z");
    }
    render();
    if (!reduceMotion) setInterval(function () { if (n >= 80) { a = 1; b = 1; n = 0; } if (Math.random() < trueP) a++; else b++; n++; render(); }, 600);
  })();

  /* ---------------- expertise angles ---------------- */
  (function () {
    var tabs = $("#angleTabs"), panel = $("#anglePanel");
    D.angles.forEach(function (a, i) {
      var b = document.createElement("button");
      b.setAttribute("role", "tab"); b.innerHTML = '<span class="ic">' + a.icon + "</span>" + a.title;
      b.addEventListener("click", function () { show(i); });
      tabs.appendChild(b);
    });
    function show(i) {
      var a = D.angles[i];
      $$("button", tabs).forEach(function (b, j) { b.classList.toggle("active", i === j); b.setAttribute("aria-selected", i === j); });
      panel.innerHTML = '<div class="fade-swap"><span class="big-ic">' + a.icon + "</span><h3>" + a.title + '</h3><p class="lead2">' + a.lead + "</p><p>" + a.body + "</p><ul>" +
        a.points.map(function (p) { return "<li>" + p + "</li>"; }).join("") + '</ul><div class="tool-chips">' + a.tools.map(function (t) { return "<span>" + t + "</span>"; }).join("") + "</div></div>";
    }
    show(0);
  })();

  /* ---------------- Stats Lab ---------------- */
  var labs = {};
  var currentLab = "clt";
  $$("#labTabs button").forEach(function (b) {
    b.addEventListener("click", function () {
      $$("#labTabs button").forEach(function (x) { x.classList.remove("active"); });
      b.classList.add("active");
      $$(".lab-pane").forEach(function (p) { p.classList.remove("active"); });
      $("#lab-" + b.dataset.lab).classList.add("active");
      currentLab = b.dataset.lab;
      if (labs[currentLab]) labs[currentLab].draw();
    });
  });
  function bindRange(id, outFmt, cb) {
    var el = $("#" + id), out = $("#" + id + "Out");
    function upd() { if (out) out.textContent = outFmt(+el.value); cb && cb(); }
    el.addEventListener("input", upd); upd();
    return el;
  }

  /* --- CLT --- */
  labs.clt = (function () {
    var cv = $("#cltCanvas"), means = [], dist = $("#cltDist"), nEl;
    var pops = {
      exp: { draw: function () { return -Math.log(1 - Math.random()); }, mu: 1, sigma: 1, lo: 0, hi: 5, pdf: function (x) { return x < 0 ? 0 : Math.exp(-x); } },
      unif: { draw: function () { return Math.random(); }, mu: 0.5, sigma: Math.sqrt(1 / 12), lo: 0, hi: 1, pdf: function (x) { return x >= 0 && x <= 1 ? 1 : 0; } },
      bimodal: { draw: function () { return Math.random() < 0.5 ? randn() * 0.5 - 1.5 : randn() * 0.5 + 1.5; }, mu: 0, sigma: Math.sqrt(0.25 + 2.25), lo: -3.5, hi: 3.5, pdf: function (x) { var f = function (m) { return Math.exp(-0.5 * Math.pow((x - m) / 0.5, 2)) / (0.5 * Math.sqrt(2 * Math.PI)); }; return 0.5 * f(-1.5) + 0.5 * f(1.5); } },
      bern: { draw: function () { return Math.random() < 0.2 ? 1 : 0; }, mu: 0.2, sigma: 0.4, lo: -0.1, hi: 1.1, pdf: null }
    };
    function addSamples(k) {
      var P = pops[dist.value], n = +nEl.value;
      for (var j = 0; j < k; j++) { var s = 0; for (var i = 0; i < n; i++) s += P.draw(); means.push(s / n); }
      draw();
    }
    function draw() {
      var P = pops[dist.value], n = +nEl.value, g = setup(cv), ctx = g.ctx;
      var se = P.sigma / Math.sqrt(n);
      $("#cltCount").textContent = means.length.toLocaleString();
      $("#cltMean").textContent = means.length ? fmt(mean(means), 3) : "–";
      $("#cltSd").textContent = means.length > 1 ? fmt(sd(means), 3) : "–";
      $("#cltSe").textContent = fmt(se, 3);
      // population strip on top
      var topH = Math.min(150, g.h * 0.32);
      var lo = P.lo, hi = P.hi;
      ctx.save();
      title(g, "Population", null);
      var f1 = frame({ ctx: ctx, w: g.w, h: topH + 24 }, { xmin: lo, xmax: hi, ymin: 0, ymax: 1, yticks: [], padT: 24 });
      if (P.pdf) {
        var mx = 0, xs = []; for (var i = 0; i <= 200; i++) { var x = lo + (hi - lo) * i / 200; xs.push([x, P.pdf(x)]); mx = Math.max(mx, P.pdf(x)); }
        ctx.beginPath(); xs.forEach(function (p, i) { var X = f1.sx(p[0]), Y = f1.sy(p[1] / mx * 0.9); if (i) ctx.lineTo(X, Y); else ctx.moveTo(X, Y); });
        ctx.strokeStyle = C.amber; ctx.lineWidth = 2; ctx.stroke(); ctx.lineTo(f1.sx(hi), f1.sy(0)); ctx.lineTo(f1.sx(lo), f1.sy(0)); ctx.fillStyle = hexA(C.amber, 0.12); ctx.fill();
      } else {
        [[0, 0.8], [1, 0.2]].forEach(function (b) { ctx.fillStyle = hexA(C.amber, 0.6); ctx.fillRect(f1.sx(b[0]) - 10, f1.sy(b[1]), 20, f1.sy(0) - f1.sy(b[1])); });
      }
      ctx.restore();
      // histogram of means
      ctx.save(); ctx.translate(0, topH + 34);
      var g2 = { ctx: ctx, w: g.w, h: g.h - topH - 34 };
      var mlo = P.mu - 4.2 * se, mhi = P.mu + 4.2 * se;
      if (dist.value === "bern" || dist.value === "unif" || dist.value === "exp") { mlo = Math.max(mlo, lo); mhi = Math.min(mhi, hi); }
      var bins = 40, w = (mhi - mlo) / bins, counts = new Array(bins).fill(0);
      means.forEach(function (m) { var k = Math.floor((m - mlo) / w); if (k >= 0 && k < bins) counts[k]++; });
      var dens = counts.map(function (c) { return means.length ? c / (means.length * w) : 0; });
      var peak = 1 / (se * Math.sqrt(2 * Math.PI));
      var ymax = Math.max(peak, Math.max.apply(null, dens)) * 1.12;
      var f = frame(g2, { xmin: mlo, xmax: mhi, ymin: 0, ymax: ymax, xlabel: "sample mean (n = " + n + ")", ylabel: "density", yf: function (t) { return +t.toFixed(2); }, xf: function (t) { return +t.toFixed(2); }, padT: 24 });
      ctx.fillStyle = C.text; ctx.font = "600 14px Inter, sans-serif"; ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillText("Distribution of " + means.length.toLocaleString() + " sample means", 8, 0);
      dens.forEach(function (d, i) { var x0 = f.sx(mlo + i * w), x1 = f.sx(mlo + (i + 1) * w); ctx.fillStyle = hexA(C.teal, 0.55); ctx.fillRect(x0 + 1, f.sy(d), x1 - x0 - 2, f.Y0 - f.sy(d)); });
      ctx.beginPath();
      for (var j = 0; j <= 200; j++) { var x = mlo + (mhi - mlo) * j / 200, y = Math.exp(-0.5 * Math.pow((x - P.mu) / se, 2)) * peak; if (j) ctx.lineTo(f.sx(x), f.sy(y)); else ctx.moveTo(f.sx(x), f.sy(y)); }
      ctx.strokeStyle = C.coral; ctx.lineWidth = 2.2; ctx.stroke();
      legend(g2, [["simulated means", hexA(C.teal, .7)], ["Normal(μ, σ/√n)", C.coral]], g.w - 160, 34);
      ctx.restore();
    }
    nEl = bindRange("cltN", function (v) { return v; }, function () { means = []; if (nEl) draw(); });
    dist.addEventListener("change", function () { means = []; draw(); });
    var running = false;
    $("#cltRun").addEventListener("click", function () {
      if (running) return; running = true; var left = 1000;
      (function chunk() { addSamples(50); left -= 50; if (left > 0) requestAnimationFrame(chunk); else running = false; })();
    });
    $("#cltReset").addEventListener("click", function () { means = []; draw(); });
    return { draw: function () { if (!means.length) addSamples(300); else draw(); } };
  })();

  /* --- Kaplan-Meier --- */
  labs.km = (function () {
    var cv = $("#kmCanvas"), hrEl, nEl, cEl, data = null;
    function simulate() {
      var hr = +hrEl.value, n = +nEl.value, cr = +cEl.value / 100, lc = Math.log(2) / 12, admin = 36, out = [];
      [0, 1].forEach(function (arm) {
        var lam = arm ? lc * hr : lc;
        for (var i = 0; i < n; i++) {
          var t = -Math.log(1 - Math.random()) / lam, ev = 1;
          if (Math.random() < cr) { var c = Math.random() * Math.min(t, admin); t = c; ev = 0; }
          if (t > admin) { t = admin; ev = 0; }
          out.push({ t: t, e: ev, a: arm });
        }
      });
      data = out; draw();
    }
    function km(arr) {
      arr = arr.slice().sort(function (x, y) { return x.t - y.t; });
      var s = 1, atRisk = arr.length, pts = [[0, 1]], cens = [], med = NaN, i = 0;
      while (i < arr.length) {
        var t = arr[i].t, d = 0, c = 0;
        while (i < arr.length && arr[i].t === t) { if (arr[i].e) d++; else c++; i++; }
        if (d > 0) { pts.push([t, s]); s *= 1 - d / atRisk; pts.push([t, s]); if (isNaN(med) && s <= 0.5) med = t; }
        if (c > 0) cens.push([t, s]);
        atRisk -= d + c;
      }
      return { pts: pts, cens: cens, med: med, events: arr.filter(function (x) { return x.e; }).length };
    }
    function logrank(arr) {
      var times = arr.filter(function (x) { return x.e; }).map(function (x) { return x.t; });
      times = times.filter(function (t, i) { return times.indexOf(t) === i; }).sort(function (a, b) { return a - b; });
      var O = 0, E = 0, V = 0;
      times.forEach(function (t) {
        var n1 = 0, n = 0, d1 = 0, d = 0;
        arr.forEach(function (x) { if (x.t >= t) { n++; if (x.a === 1) n1++; } if (x.t === t && x.e) { d++; if (x.a === 1) d1++; } });
        if (n < 2) return;
        O += d1; E += d * n1 / n; V += d * (n1 / n) * (1 - n1 / n) * (n - d) / (n - 1);
      });
      var chi = V > 0 ? (O - E) * (O - E) / V : 0;
      return { chi: chi, p: 2 * (1 - pnorm(Math.sqrt(chi))) };
    }
    function draw() {
      if (!data) return;
      var g = setup(cv), ctx = g.ctx;
      var a0 = km(data.filter(function (x) { return x.a === 0; })), a1 = km(data.filter(function (x) { return x.a === 1; })), lr = logrank(data);
      title(g, "Kaplan–Meier survival estimate", "36-month follow-up · control median ≈ 12 months");
      var f = frame(g, { xmin: 0, xmax: 36, ymin: 0, ymax: 1, xticks: [0, 6, 12, 18, 24, 30, 36], xlabel: "months since randomisation", ylabel: "event-free probability", yf: function (t) { return Math.round(t * 100) + "%"; }, padT: 48 });
      ctx.setLineDash([4, 4]); ctx.strokeStyle = C.axis; ctx.beginPath(); ctx.moveTo(f.X0, f.sy(0.5)); ctx.lineTo(f.X1, f.sy(0.5)); ctx.stroke(); ctx.setLineDash([]);
      [[a0, C.amber], [a1, C.teal]].forEach(function (pair) {
        var r = pair[0]; ctx.strokeStyle = pair[1]; ctx.lineWidth = 2.4; ctx.beginPath();
        r.pts.forEach(function (p, i) { if (i) ctx.lineTo(f.sx(p[0]), f.sy(p[1])); else ctx.moveTo(f.sx(p[0]), f.sy(p[1])); });
        var last = r.pts[r.pts.length - 1]; ctx.lineTo(f.sx(36), f.sy(last[1])); ctx.stroke();
        ctx.lineWidth = 1.5; r.cens.forEach(function (c) { var x = f.sx(c[0]), y = f.sy(c[1]); ctx.beginPath(); ctx.moveTo(x, y - 4); ctx.lineTo(x, y + 4); ctx.stroke(); });
      });
      legend(g, [["Control", C.amber], ["Treatment", C.teal], ["| censored", C.muted]], g.w - 130, 60);
      $("#kmEv").textContent = a0.events + " / " + a1.events;
      $("#kmMed").textContent = (isNaN(a0.med) ? "NR" : fmt(a0.med, 1)) + " / " + (isNaN(a1.med) ? "NR" : fmt(a1.med, 1));
      $("#kmChi").textContent = fmt(lr.chi, 2);
      var pe = $("#kmP"); pe.textContent = fmtP(lr.p); pe.style.color = lr.p < 0.05 ? C.teal : C.coral;
    }
    hrEl = bindRange("kmHr", function (v) { return v.toFixed(2); }, function () { data && simulate(); });
    nEl = bindRange("kmN", function (v) { return v; }, function () { data && simulate(); });
    cEl = bindRange("kmC", function (v) { return v + "%"; }, function () { data && simulate(); });
    $("#kmRun").addEventListener("click", simulate);
    return { draw: function () { if (!data) simulate(); else draw(); } };
  })();

  /* --- Bayesian VE --- */
  labs.bayes = (function () {
    var cv = $("#bayesCanvas"), vEl, pEl, prior = $("#byPrior");
    var priors = { flat: [1, 1], skept: [5, 5], pfizer: [0.700102, 1] };
    function th2ve(t) { return (1 - 2 * t) / (1 - t); }
    function ve2th(v) { return (1 - v) / (2 - v); }
    function betaCurve(a, b) {
      var N = 3000, lb = lgamma(a + b) - lgamma(a) - lgamma(b), th = [], pdf = [], cdf = [], acc = 0;
      for (var i = 0; i < N; i++) { var t = (i + 0.5) / N; th.push(t); var v = Math.exp(lb + (a - 1) * Math.log(t) + (b - 1) * Math.log(1 - t)); pdf.push(v); acc += v / N; cdf.push(acc); }
      for (var j = 0; j < N; j++) cdf[j] /= acc;
      return { th: th, pdf: pdf, cdf: cdf, q: function (p) { for (var k = 0; k < N; k++) if (cdf[k] >= p) return th[k]; return th[N - 1]; }, F: function (t) { var k = Math.min(N - 1, Math.max(0, Math.floor(t * N))); return cdf[k]; } };
    }
    function veDensity(B, lo, hi) {
      var out = [];
      for (var i = 0; i <= 300; i++) {
        var v = lo + (hi - lo) * i / 300, t = ve2th(v), k = Math.min(2999, Math.max(0, Math.floor(t * 3000)));
        out.push([v, B.pdf[k] / Math.pow(2 - v, 2)]);
      }
      return out;
    }
    function draw() {
      var pr = priors[prior.value], x = +vEl.value, y = +pEl.value;
      var post = betaCurve(pr[0] + x, pr[1] + y), pri = betaCurve(pr[0], pr[1]);
      var med = th2ve(post.q(0.5)), lo = th2ve(post.q(0.975)), hi = th2ve(post.q(0.025));
      $("#byMed").textContent = pct(med); $("#byCri").textContent = pct(lo) + " – " + pct(hi);
      $("#byP30").textContent = fmt(post.F(ve2th(0.3)), 3); $("#byP50").textContent = fmt(post.F(ve2th(0.5)), 3);
      var g = setup(cv), ctx = g.ctx, xmax = 1;
      var xmin = Math.max(-1, Math.min(0, Math.floor((lo - 0.25) * 4) / 4));
      var pd = veDensity(post, xmin, 0.999), pq = veDensity(pri, xmin, 0.999);
      var ymax = Math.max.apply(null, pd.map(function (p) { return p[1]; })) * 1.12;
      title(g, "Posterior for vaccine efficacy", x + " vs " + y + " cases · VE = 1 − θ/(1−θ)");
      var f = frame(g, { xmin: xmin, xmax: xmax, ymin: 0, ymax: ymax, xticks: [-1, -0.75, -0.5, -0.25, 0, 0.3, 0.5, 0.75, 1].filter(function (t) { return t >= xmin - 1e-9; }), xf: function (t) { return Math.round(t * 100) + "%"; }, yticks: [], xlabel: "vaccine efficacy", ylabel: "posterior density", padT: 48 });
      // CrI band
      ctx.fillStyle = hexA(C.teal, 0.08); ctx.fillRect(f.sx(lo), f.Y1, f.sx(hi) - f.sx(lo), f.Y0 - f.Y1);
      // prior
      var pmax = Math.max.apply(null, pq.map(function (p) { return p[1]; }));
      ctx.setLineDash([5, 5]); ctx.strokeStyle = C.muted; ctx.lineWidth = 1.5; ctx.beginPath();
      pq.forEach(function (p, i) { var Y = f.sy(Math.min(p[1] / pmax * ymax * 0.35, ymax)); if (i) ctx.lineTo(f.sx(p[0]), Y); else ctx.moveTo(f.sx(p[0]), Y); }); ctx.stroke(); ctx.setLineDash([]);
      // posterior
      ctx.beginPath(); pd.forEach(function (p, i) { if (i) ctx.lineTo(f.sx(p[0]), f.sy(p[1])); else ctx.moveTo(f.sx(p[0]), f.sy(p[1])); });
      ctx.strokeStyle = C.teal; ctx.lineWidth = 2.5; ctx.stroke();
      ctx.lineTo(f.sx(pd[pd.length - 1][0]), f.Y0); ctx.lineTo(f.sx(xmin), f.Y0); ctx.closePath(); ctx.fillStyle = hexA(C.teal, 0.18); ctx.fill();
      // reference lines
      [[0.3, C.amber, "30% threshold"], [med, C.coral, "median"]].forEach(function (r) { ctx.strokeStyle = r[1]; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(f.sx(r[0]), f.Y0); ctx.lineTo(f.sx(r[0]), f.Y1); ctx.stroke(); });
      legend(g, [["posterior", C.teal], ["prior (scaled)", C.muted], ["95% CrI", hexA(C.teal, .35)], ["30% success bar", C.amber], ["posterior median", C.coral]], f.X0 + 10, 62);
    }
    vEl = bindRange("byV", function (v) { return v; }, function () { labs.bayes && draw(); });
    pEl = bindRange("byP", function (v) { return v; }, function () { labs.bayes && draw(); });
    prior.addEventListener("change", draw);
    return { draw: draw };
  })();

  /* --- Power / sample size --- */
  labs.power = (function () {
    var cv = $("#powerCanvas"), e = {};
    function nPerArm(p1, p2, a, pw) {
      var pb = (p1 + p2) / 2, za = qnorm(1 - a / 2), zb = qnorm(pw), d = Math.abs(p1 - p2);
      if (d < 1e-9) return Infinity;
      return Math.pow(za * Math.sqrt(2 * pb * (1 - pb)) + zb * Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2)), 2) / (d * d);
    }
    function powerAt(n, p1, p2, a) {
      var pb = (p1 + p2) / 2, za = qnorm(1 - a / 2), d = Math.abs(p1 - p2);
      return pnorm((d * Math.sqrt(n) - za * Math.sqrt(2 * pb * (1 - pb))) / Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2)));
    }
    function draw() {
      if (!e.d) return;
      var p1 = +e.p1.value, p2 = +e.p2.value, a = +e.a.value, pw = +e.b.value, dr = +e.d.value / 100;
      var n = Math.ceil(nPerArm(p1, p2, a, pw)), nd = Math.ceil(n / (1 - dr));
      $("#pwN").textContent = isFinite(n) ? n.toLocaleString() : "∞";
      $("#pwNd").textContent = isFinite(nd) ? nd.toLocaleString() : "∞";
      $("#pwTot").textContent = isFinite(nd) ? (2 * nd).toLocaleString() : "∞";
      $("#pwRR").textContent = fmt(p2 / p1, 2);
      var g = setup(cv), ctx = g.ctx;
      var xmax = isFinite(n) ? Math.max(50, Math.ceil(n * 2.2 / 50) * 50) : 1000;
      title(g, "Power curve", "two-sided α = " + a.toFixed(2) + " · p₁ = " + p1.toFixed(2) + ", p₂ = " + p2.toFixed(2));
      var f = frame(g, { xmin: 0, xmax: xmax, ymin: 0, ymax: 1, xlabel: "participants per arm", ylabel: "power", yf: function (t) { return Math.round(t * 100) + "%"; }, padT: 48 });
      ctx.setLineDash([4, 4]); ctx.strokeStyle = C.amber; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(f.X0, f.sy(pw)); ctx.lineTo(f.X1, f.sy(pw)); ctx.stroke();
      if (isFinite(n) && n <= xmax) { ctx.beginPath(); ctx.moveTo(f.sx(n), f.Y0); ctx.lineTo(f.sx(n), f.sy(pw)); ctx.stroke(); }
      ctx.setLineDash([]);
      // alternative alphas, faint
      [0.01, 0.1].forEach(function (aa) { if (Math.abs(aa - a) < 1e-9) return; ctx.beginPath(); for (var i = 0; i <= 200; i++) { var x = xmax * i / 200, y = Math.max(0, powerAt(Math.max(x, 1e-6), p1, p2, aa)); if (i) ctx.lineTo(f.sx(x), f.sy(y)); else ctx.moveTo(f.sx(x), f.sy(y)); } ctx.strokeStyle = hexA(C.violet, 0.45); ctx.lineWidth = 1.2; ctx.stroke(); });
      ctx.beginPath(); for (var i = 0; i <= 300; i++) { var x = xmax * i / 300, y = Math.max(0, powerAt(Math.max(x, 1e-6), p1, p2, a)); if (i) ctx.lineTo(f.sx(x), f.sy(y)); else ctx.moveTo(f.sx(x), f.sy(y)); }
      ctx.strokeStyle = C.teal; ctx.lineWidth = 2.6; ctx.stroke();
      if (isFinite(n) && n <= xmax) {
        ctx.fillStyle = C.coral; ctx.beginPath(); ctx.arc(f.sx(n), f.sy(pw), 6, 0, 7); ctx.fill();
        ctx.fillStyle = C.text; ctx.font = "600 12px JetBrains Mono, monospace"; ctx.textAlign = "left"; ctx.textBaseline = "bottom";
        ctx.fillText("n = " + n + " per arm", Math.min(f.sx(n) + 10, f.X1 - 130), f.sy(pw) - 8);
      }
      legend(g, [["power at chosen α", C.teal], ["α = 0.01 / 0.10", hexA(C.violet, .7)], ["target power", C.amber]], g.w - 170, f.Y0 - 70);
    }
    e.p1 = bindRange("pwP1", function (v) { return v.toFixed(2); }, draw);
    e.p2 = bindRange("pwP2", function (v) { return v.toFixed(2); }, draw);
    e.a = bindRange("pwA", function (v) { return v.toFixed(2); }, draw);
    e.b = bindRange("pwB", function (v) { return Math.round(v * 100) + "%"; }, draw);
    e.d = bindRange("pwD", function (v) { return v + "%"; }, draw);
    return { draw: draw };
  })();

  /* --- k-means clustering --- */
  labs.cluster = (function () {
    var cv = $("#clusterCanvas"), kEl, gEl, sEl, pts = [], cents = [], iter = 0, assign = [], timer = null;
    function newData() {
      var G = +gEl.value, s = +sEl.value; pts = [];
      var centres = [];
      for (var c = 0; c < G; c++) { var ang = 2 * Math.PI * c / G + Math.random() * 0.5; centres.push([Math.cos(ang) * 3.2 + randn() * 0.4, Math.sin(ang) * 3.2 + randn() * 0.4]); }
      for (var i = 0; i < 180; i++) { var g = i % G; pts.push({ x: centres[g][0] + randn() * s, y: centres[g][1] + randn() * s, g: g }); }
      init();
    }
    function init() {
      var k = +kEl.value; cents = []; iter = 0; assign = pts.map(function () { return -1; });
      // k-means++ seeding
      var first = pts[Math.floor(Math.random() * pts.length)]; cents.push([first.x, first.y]);
      while (cents.length < k) {
        var d2 = pts.map(function (p) { return Math.min.apply(null, cents.map(function (c) { return Math.pow(p.x - c[0], 2) + Math.pow(p.y - c[1], 2); })); });
        var tot = d2.reduce(function (a, b) { return a + b; }, 0), r = Math.random() * tot, acc = 0;
        for (var i = 0; i < pts.length; i++) { acc += d2[i]; if (acc >= r) { cents.push([pts[i].x, pts[i].y]); break; } }
      }
      stats(); draw();
    }
    function step() {
      var changed = false;
      pts.forEach(function (p, i) {
        var best = 0, bd = Infinity;
        cents.forEach(function (c, j) { var d = Math.pow(p.x - c[0], 2) + Math.pow(p.y - c[1], 2); if (d < bd) { bd = d; best = j; } });
        if (assign[i] !== best) { assign[i] = best; changed = true; }
      });
      cents = cents.map(function (c, j) {
        var m = pts.filter(function (p, i) { return assign[i] === j; });
        return m.length ? [mean(m.map(function (p) { return p.x; })), mean(m.map(function (p) { return p.y; }))] : c;
      });
      iter++; stats(); draw();
      return changed;
    }
    function stats() {
      $("#clIter").textContent = iter;
      if (assign[0] === -1) { $("#clWss").textContent = "–"; $("#clSil").textContent = "–"; $("#clAri").textContent = "–"; return; }
      var wss = 0; pts.forEach(function (p, i) { var c = cents[assign[i]]; wss += Math.pow(p.x - c[0], 2) + Math.pow(p.y - c[1], 2); });
      $("#clWss").textContent = fmt(wss, 1);
      // silhouette
      var k = cents.length, sil = 0;
      pts.forEach(function (p, i) {
        var sums = new Array(k).fill(0), cnt = new Array(k).fill(0);
        pts.forEach(function (q, j) { if (i === j) return; var d = Math.sqrt(Math.pow(p.x - q.x, 2) + Math.pow(p.y - q.y, 2)); sums[assign[j]] += d; cnt[assign[j]]++; });
        var a = cnt[assign[i]] ? sums[assign[i]] / cnt[assign[i]] : 0, b = Infinity;
        for (var c = 0; c < k; c++) if (c !== assign[i] && cnt[c]) b = Math.min(b, sums[c] / cnt[c]);
        sil += (b === Infinity || cnt[assign[i]] === 0) ? 0 : (b - a) / Math.max(a, b);
      });
      $("#clSil").textContent = fmt(sil / pts.length, 3);
      $("#clAri").textContent = fmt(ari(pts.map(function (p) { return p.g; }), assign), 3);
    }
    function ari(a, b) {
      var n = a.length, tab = {}, ra = {}, rb = {}, c2 = function (x) { return x * (x - 1) / 2; };
      for (var i = 0; i < n; i++) { var key = a[i] + "_" + b[i]; tab[key] = (tab[key] || 0) + 1; ra[a[i]] = (ra[a[i]] || 0) + 1; rb[b[i]] = (rb[b[i]] || 0) + 1; }
      var sij = 0, sa = 0, sb = 0; Object.keys(tab).forEach(function (k) { sij += c2(tab[k]); }); Object.keys(ra).forEach(function (k) { sa += c2(ra[k]); }); Object.keys(rb).forEach(function (k) { sb += c2(rb[k]); });
      var exp = sa * sb / c2(n), mx = (sa + sb) / 2;
      return mx === exp ? 1 : (sij - exp) / (mx - exp);
    }
    var F = null;
    function draw() {
      var g = setup(cv), ctx = g.ctx;
      var xs = pts.map(function (p) { return p.x; }).concat(cents.map(function (c) { return c[0]; })), ys = pts.map(function (p) { return p.y; }).concat(cents.map(function (c) { return c[1]; }));
      var xmin = Math.min.apply(null, xs) - 0.8, xmax = Math.max.apply(null, xs) + 0.8, ymin = Math.min.apply(null, ys) - 0.8, ymax = Math.max.apply(null, ys) + 0.8;
      title(g, "k-means with k-means++ seeding", "click anywhere to add a point · colours = assigned cluster");
      F = frame(g, { xmin: xmin, xmax: xmax, ymin: ymin, ymax: ymax, xlabel: "latent factor 1", ylabel: "latent factor 2", xf: function (t) { return +t.toFixed(1); }, yf: function (t) { return +t.toFixed(1); }, padT: 48 });
      F.inv = function (X, Y) { return [xmin + (X - F.X0) / (F.X1 - F.X0) * (xmax - xmin), ymin + (F.Y0 - Y) / (F.Y0 - F.Y1) * (ymax - ymin)]; };
      // voronoi-ish shading
      if (assign[0] !== -1) {
        var step = 10;
        for (var X = F.X0; X < F.X1; X += step) for (var Y = F.Y1; Y < F.Y0; Y += step) {
          var p = F.inv(X + step / 2, Y + step / 2), best = 0, bd = Infinity;
          cents.forEach(function (c, j) { var d = Math.pow(p[0] - c[0], 2) + Math.pow(p[1] - c[1], 2); if (d < bd) { bd = d; best = j; } });
          ctx.fillStyle = hexA(PALETTE[best % 6], 0.06); ctx.fillRect(X, Y, step, step);
        }
      }
      pts.forEach(function (p, i) {
        ctx.beginPath(); ctx.arc(F.sx(p.x), F.sy(p.y), 4, 0, 7);
        ctx.fillStyle = assign[i] === -1 ? hexA(C.muted, 0.7) : hexA(PALETTE[assign[i] % 6], 0.85); ctx.fill();
      });
      cents.forEach(function (c, j) {
        var X = F.sx(c[0]), Y = F.sy(c[1]);
        ctx.strokeStyle = "#0b1220"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(X - 9, Y - 9); ctx.lineTo(X + 9, Y + 9); ctx.moveTo(X + 9, Y - 9); ctx.lineTo(X - 9, Y + 9); ctx.stroke();
        ctx.strokeStyle = PALETTE[j % 6]; ctx.lineWidth = 3; ctx.stroke();
      });
    }
    cv.addEventListener("click", function (ev) {
      if (!F) return; var r = cv.getBoundingClientRect(), p = F.inv(ev.clientX - r.left, ev.clientY - r.top);
      pts.push({ x: p[0], y: p[1], g: -1 }); assign.push(-1);
      if (iter > 0) step(); else draw();
    });
    kEl = bindRange("clK", function (v) { return v; }, function () { pts.length && init(); });
    gEl = bindRange("clG", function (v) { return v; }, function () { pts.length && newData(); });
    sEl = bindRange("clS", function (v) { return v.toFixed(1); }, function () { pts.length && newData(); });
    $("#clStep").addEventListener("click", function () { step(); });
    $("#clRunAll").addEventListener("click", function () {
      clearInterval(timer); var n = 0;
      timer = setInterval(function () { var ch = step(); n++; if (!ch || n > 30) clearInterval(timer); }, 350);
    });
    $("#clNew").addEventListener("click", function () { clearInterval(timer); newData(); });
    return { draw: function () { if (!pts.length) newData(); else draw(); } };
  })();

  /* --- coverage survey --- */
  labs.survey = (function () {
    var cv = $("#surveyCanvas"), e = {}, hist = [], last = null;
    function reset() { hist = []; last = null; }
    function run() {
      var p = +e.p.value / 100, m = +e.m.value, b = +e.b.value, rho = +e.i.value;
      var props = [];
      for (var j = 0; j < m; j++) {
        var pj = rho > 0 ? rbeta(p * (1 - rho) / rho, (1 - p) * (1 - rho) / rho) : p;
        props.push(rbinom(b, pj) / b);
      }
      var est = mean(props), n = m * b;
      var seD = Math.sqrt(Math.pow(sd(props), 2) / m), seN = Math.sqrt(est * (1 - est) / n);
      var tq = qnorm(0.975);
      last = { props: props, est: est, lo: est - tq * seD, hi: est + tq * seD, nlo: est - tq * seN, nhi: est + tq * seN, deffObs: seN > 0 ? Math.pow(seD / seN, 2) : NaN };
      hist.push(last); if (hist.length > 400) hist.shift();
      draw();
    }
    function draw() {
      var p = +e.p.value / 100, m = +e.m.value, b = +e.b.value, rho = +e.i.value, deff = 1 + (b - 1) * rho;
      $("#svDeff").textContent = fmt(deff, 2);
      $("#svEss").textContent = Math.round(m * b / deff).toLocaleString() + " of " + (m * b).toLocaleString();
      $("#svEst").textContent = last ? pct(last.est) : "–";
      $("#svCi").textContent = last ? pct(Math.max(0, last.lo)) + " – " + pct(Math.min(1, last.hi)) : "–";
      var g = setup(cv), ctx = g.ctx;
      var show = hist.slice(-25);
      title(g, "Repeated surveys: design-based vs naive 95% CIs", "true coverage " + Math.round(p * 100) + "% · each row is one simulated survey");
      var f = frame(g, { xmin: Math.max(0, p - 0.35), xmax: Math.min(1, p + 0.35), ymin: 0, ymax: 26, yticks: [], xlabel: "estimated coverage", xf: function (t) { return Math.round(t * 100) + "%"; }, padL: 30, padT: 48 });
      ctx.strokeStyle = C.amber; ctx.lineWidth = 1.5; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(f.sx(p), f.Y0); ctx.lineTo(f.sx(p), f.Y1); ctx.stroke(); ctx.setLineDash([]);
      var clamp = function (v) { return Math.max(f.X0, Math.min(f.X1, v)); };
      show.forEach(function (s, i) {
        var y = f.sy(i + 1), ok = s.lo <= p && s.hi >= p;
        ctx.strokeStyle = hexA(C.muted, 0.55); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(clamp(f.sx(s.nlo)), y + 3); ctx.lineTo(clamp(f.sx(s.nhi)), y + 3); ctx.stroke();
        ctx.strokeStyle = ok ? C.teal : C.coral; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(clamp(f.sx(s.lo)), y - 2); ctx.lineTo(clamp(f.sx(s.hi)), y - 2); ctx.stroke();
        ctx.fillStyle = C.text; ctx.beginPath(); ctx.arc(f.sx(s.est), y - 2, 3, 0, 7); ctx.fill();
      });
      if (hist.length) {
        var cd = hist.filter(function (s) { return s.lo <= p && s.hi >= p; }).length / hist.length;
        var cn = hist.filter(function (s) { return s.nlo <= p && s.nhi >= p; }).length / hist.length;
        ctx.font = "600 12px JetBrains Mono, monospace"; ctx.textAlign = "right"; ctx.textBaseline = "bottom";
        ctx.fillStyle = "rgba(11,18,32,0.85)"; ctx.fillRect(f.X1 - 290, f.Y0 - 46, 286, 42);
        ctx.fillStyle = C.teal; ctx.fillText("design-based CI covers truth: " + pct(cd, 0), f.X1 - 8, f.Y0 - 26);
        ctx.fillStyle = C.muted; ctx.fillText("naive SRS CI: " + pct(cn, 0) + " · " + hist.length + " surveys", f.X1 - 8, f.Y0 - 8);
      } else {
        ctx.fillStyle = C.muted; ctx.font = "13px Inter, sans-serif"; ctx.textAlign = "center"; ctx.fillText("Press “Run 1 survey”, or hold it down, to start sampling.", (f.X0 + f.X1) / 2, (f.Y0 + f.Y1) / 2);
      }
      legend(g, [["design-based CI (covers)", C.teal], ["design-based CI (misses)", C.coral], ["naive SRS CI", hexA(C.muted, .8)]], f.X0 + 8, f.Y0 - 60);
    }
    ["p", "m", "b", "i"].forEach(function (k) {
      var id = { p: "svP", m: "svM", b: "svB", i: "svI" }[k];
      e[k] = bindRange(id, k === "p" ? function (v) { return v + "%"; } : k === "i" ? function (v) { return v.toFixed(2); } : function (v) { return v; }, function () { reset(); e.i && draw(); });
    });
    var hold = null, btn = $("#svRun");
    btn.addEventListener("click", function () { run(); });
    btn.addEventListener("pointerdown", function () { hold = setTimeout(function () { hold = setInterval(run, 60); }, 400); });
    ["pointerup", "pointerleave"].forEach(function (ev) { btn.addEventListener(ev, function () { clearTimeout(hold); clearInterval(hold); }); });
    return { draw: function () { if (!hist.length) { for (var i = 0; i < 20; i++) run(); } else draw(); } };
  })();

  /* draw first lab when visible, redraw on resize */
  var labDrawn = false;
  function drawLab() { labs[currentLab].draw(); }
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (es) { if (es[0].isIntersecting && !labDrawn) { labDrawn = true; setTimeout(drawLab, 50); } }).observe($(".lab"));
  } else { drawLab(); }
  var rT; window.addEventListener("resize", function () { clearTimeout(rT); rT = setTimeout(function () { if (labDrawn) drawLab(); drawCardViz(); drawRadar(); }, 150); });

  /* ---------------- card mini-visuals ---------------- */
  function drawCardViz() {
    $$(".card-viz").forEach(function (box) {
      var cv = box.querySelector("canvas"); if (!cv) { cv = document.createElement("canvas"); box.appendChild(cv); }
      var g = setup(cv), ctx = g.ctx;
      if (box.dataset.viz === "heatmap") {
        if (!box._m) {
          var R = 18, Cc = 48, M = [];
          for (var r = 0; r < R; r++) { M.push([]); for (var c = 0; c < Cc; c++) { var v = randn() * 0.6; if (r < 7 && c < 18) v += 2; if (r >= 6 && r < 13 && c >= 22 && c < 36) v -= 2; if (r >= 12 && c >= 34) v += 1.6; M[r].push(v); } }
          box._m = M;
        }
        var M2 = box._m, cw = g.w / M2[0].length, ch = g.h / M2.length;
        M2.forEach(function (row, r) { row.forEach(function (v, c) { var t = Math.max(-1, Math.min(1, v / 2.5)); ctx.fillStyle = t > 0 ? hexA(C.teal, 0.1 + 0.85 * t) : hexA(C.coral, 0.1 + 0.85 * -t); ctx.fillRect(c * cw, r * ch, cw - 0.5, ch - 0.5); }); });
      } else {
        // dendrogram-like consensus tree
        var leaves = 24, lw = g.w / leaves, colors = [C.teal, C.amber, C.violet];
        var groups = [[0, 8], [8, 15], [15, 24]];
        ctx.lineWidth = 1.5;
        groups.forEach(function (gr, gi) {
          var col = colors[gi], top = g.h * 0.45;
          for (var i = gr[0]; i < gr[1]; i++) { var x = (i + 0.5) * lw, h1 = g.h - 8 - (10 + ((i * 37) % 23)); ctx.strokeStyle = col; ctx.beginPath(); ctx.moveTo(x, g.h - 4); ctx.lineTo(x, top); ctx.stroke(); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, g.h - 4, 2.5, 0, 7); ctx.fill(); }
          ctx.strokeStyle = col; ctx.beginPath(); ctx.moveTo((gr[0] + 0.5) * lw, top); ctx.lineTo((gr[1] - 0.5) * lw, top); ctx.stroke();
          var mid = ((gr[0] + gr[1]) / 2) * lw; ctx.beginPath(); ctx.moveTo(mid, top); ctx.lineTo(mid, gi < 2 ? g.h * 0.28 : g.h * 0.14); ctx.stroke();
        });
        var m1 = 4 * lw, m2 = 11.5 * lw, m3 = 19.5 * lw;
        ctx.strokeStyle = C.muted; ctx.beginPath(); ctx.moveTo(m1, g.h * 0.28); ctx.lineTo(m2, g.h * 0.28); ctx.moveTo((m1 + m2) / 2, g.h * 0.28); ctx.lineTo((m1 + m2) / 2, g.h * 0.14); ctx.lineTo(m3, g.h * 0.14); ctx.moveTo((m1 + m2 + 2 * m3) / 4, g.h * 0.14); ctx.lineTo((m1 + m2 + 2 * m3) / 4, 6); ctx.stroke();
      }
    });
  }
  drawCardViz();

  /* ---------------- timeline ---------------- */
  (function () {
    var ol = $("#timeline");
    D.timeline.forEach(function (t, i) {
      var li = document.createElement("li"); li.className = "tl-item reveal in";
      li.innerHTML = '<button class="tl-btn" aria-expanded="false"><span class="tl-when">' + t.when + '</span><span class="tl-role">' + t.role + '<span class="tl-org">' + t.org + '</span></span><span class="tl-plus">+</span></button>' +
        '<div class="tl-body"><div class="tl-body-inner"><ul>' + t.details.map(function (d) { return "<li>" + d + "</li>"; }).join("") + '</ul><div class="tool-chips">' + t.tags.map(function (x) { return "<span>" + x + "</span>"; }).join("") + "</div></div></div>";
      var btn = li.querySelector(".tl-btn"), body = li.querySelector(".tl-body");
      btn.addEventListener("click", function () {
        var open = li.classList.toggle("open"); btn.setAttribute("aria-expanded", open);
        body.style.maxHeight = open ? body.scrollHeight + "px" : 0;
      });
      ol.appendChild(li);
      if (i === 0) setTimeout(function () { btn.click(); }, 0);
    });
  })();

  /* ---------------- publications ---------------- */
  (function () {
    var chips = $("#pubChips"), list = $("#pubList"), search = $("#pubSearch"), active = "All";
    var areas = ["All"]; D.pubs.forEach(function (p) { if (areas.indexOf(p.area) < 0) areas.push(p.area); });
    areas.forEach(function (a) {
      var n = a === "All" ? D.pubs.length : D.pubs.filter(function (p) { return p.area === a; }).length;
      var b = document.createElement("button"); b.innerHTML = a + '<span class="n">' + n + "</span>";
      b.addEventListener("click", function () { active = a; render(); });
      chips.appendChild(b);
    });
    function esc(s) { return s.replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
    function render() {
      $$("button", chips).forEach(function (b, i) { b.classList.toggle("active", areas[i] === active); });
      var q = search.value.trim().toLowerCase();
      var items = D.pubs.filter(function (p) { return (active === "All" || p.area === active) && (!q || (p.title + " " + p.venue + " " + p.y + " " + p.authors).toLowerCase().indexOf(q) >= 0); });
      list.innerHTML = items.length ? items.map(function (p) {
        var au = esc(p.authors).replace(/(Osang'ir BI|Osang'ir I|Osangir I)/, "<b>$1</b>");
        return '<li class="pub"><div class="yr">' + (p.status ? "<small>" + p.status + "</small>" : p.y) + '</div><div><h4>' + esc(p.title) + '</h4><p class="au">' + au + ' · <span class="ven">' + esc(p.venue) + "</span></p></div></li>";
      }).join("") : '<li class="pub-empty">No publications match that search.</li>';
    }
    search.addEventListener("input", render);
    render();
  })();

  /* ---------------- AI cards + radar ---------------- */
  $("#aiCards").innerHTML = D.ai.map(function (a) {
    return '<article class="ai-card reveal in"><div class="ic">' + a.icon + "</div><h3>" + a.title + "</h3><ul>" + a.items.map(function (i) { return "<li>" + i + "</li>"; }).join("") + "</ul></article>";
  }).join("");

  var radarK = 0, radarStarted = false;
  function drawRadar() {
    var cv = $("#radarCanvas"), g = setup(cv), ctx = g.ctx, R = D.radar, n = R.length;
    var cx = g.w / 2, cy = g.h / 2, rad = Math.min(g.w, g.h) / 2 - 78;
    ctx.font = "11px JetBrains Mono, monospace";
    for (var ring = 2; ring <= 10; ring += 2) {
      ctx.beginPath();
      for (var i = 0; i <= n; i++) { var a = -Math.PI / 2 + 2 * Math.PI * i / n, r = rad * ring / 10; if (i) ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a)); else ctx.moveTo(cx + r * Math.cos(a), cy + r * Math.sin(a)); }
      ctx.strokeStyle = C.grid; ctx.lineWidth = 1; ctx.stroke();
    }
    R.forEach(function (d, i) {
      var a = -Math.PI / 2 + 2 * Math.PI * i / n;
      ctx.strokeStyle = C.grid; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + rad * Math.cos(a), cy + rad * Math.sin(a)); ctx.stroke();
      ctx.fillStyle = C.text; ctx.font = "600 12px Inter, sans-serif";
      ctx.textAlign = Math.abs(Math.cos(a)) < 0.2 ? "center" : Math.cos(a) > 0 ? "left" : "right";
      ctx.textBaseline = Math.abs(Math.sin(a)) < 0.2 ? "middle" : Math.sin(a) > 0 ? "top" : "bottom";
      var lx = cx + (rad + 10) * Math.cos(a), ly = cy + (rad + 10) * Math.sin(a), words = d.k.split(" ");
      var lines = (ctx.measureText(d.k).width > 70 && words.length > 1) ? [words.slice(0, Math.ceil(words.length / 2)).join(" "), words.slice(Math.ceil(words.length / 2)).join(" ")] : [d.k];
      var off = ctx.textBaseline === "middle" ? -(lines.length - 1) * 7 : ctx.textBaseline === "bottom" ? -(lines.length - 1) * 14 : 0;
      lines.forEach(function (ln, j) { ctx.fillText(ln, lx, ly + off + j * 14); });
    });
    var k = radarK;
    ctx.beginPath();
    R.forEach(function (d, i) { var a = -Math.PI / 2 + 2 * Math.PI * i / n, r = rad * d.v / 10 * k; if (i) ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a)); else ctx.moveTo(cx + r * Math.cos(a), cy + r * Math.sin(a)); });
    ctx.closePath();
    var grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad); grd.addColorStop(0, hexA(C.teal, 0.15)); grd.addColorStop(1, hexA(C.violet, 0.4));
    ctx.fillStyle = grd; ctx.fill(); ctx.strokeStyle = C.teal; ctx.lineWidth = 2; ctx.stroke();
    R.forEach(function (d, i) { var a = -Math.PI / 2 + 2 * Math.PI * i / n, r = rad * d.v / 10 * k; ctx.fillStyle = PALETTE[i % 6]; ctx.beginPath(); ctx.arc(cx + r * Math.cos(a), cy + r * Math.sin(a), 4.5, 0, 7); ctx.fill(); });
  }
  drawRadar();
  if ("IntersectionObserver" in window && !reduceMotion) {
    new IntersectionObserver(function (es) {
      if (es[0].isIntersecting && !radarStarted) {
        radarStarted = true; var t0 = null;
        (function anim(t) { if (!t0) t0 = t; radarK = Math.min(1, (t - t0) / 1200); radarK = 1 - Math.pow(1 - radarK, 3); drawRadar(); if (radarK < 1) requestAnimationFrame(anim); })(performance.now());
      }
    }, { threshold: 0.3 }).observe($("#radarCanvas"));
  } else { radarK = 1; drawRadar(); }
})();
