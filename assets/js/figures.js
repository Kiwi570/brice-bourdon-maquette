/* Figures au trait des réflexes archaïques : deux poses interpolées en boucle.
   Coordonnées dans une boîte 1 × 0,75 (format 4:3). Illustrations schématiques, non médicales. */

const INK = '#1B1D1F', SIG = '#2F5BFF';
const lerp = (a, b, t) => a + (b - a) * t;
const ease = t => .5 - .5 * Math.cos(Math.PI * t);

const REST = {
  head: [.5, .2], neck: [.5, .29], pelvis: [.5, .55],
  shL: [.43, .32], shR: [.57, .32], elL: [.385, .42], elR: [.615, .42], haL: [.44, .475], haR: [.56, .475],
  hipL: [.465, .56], hipR: [.535, .56], knL: [.41, .645], knR: [.59, .645], ftL: [.45, .715], ftR: [.55, .715]
};
const SUPINE_SEG = [['neck', 'pelvis'], ['shL', 'shR'], ['shL', 'elL', 'haL'], ['shR', 'elR', 'haR'], ['hipL', 'hipR'], ['hipL', 'knL', 'ftL'], ['hipR', 'knR', 'ftR']];

export const REFLEXES = {
  moro: {
    a: REST, look: [[0, -1], [0, -1]],
    b: { ...REST, head: [.5, .19], elL: [.31, .27], elR: [.69, .27], haL: [.21, .18], haR: [.79, .18], knL: [.405, .655], knR: [.595, .655], ftL: [.43, .735], ftR: [.57, .735] },
    seg: SUPINE_SEG, accent: ['shL-elL-haL', 'shR-elR-haR'], r: .062
  },
  rtac: {
    a: REST, look: [[0, -1], [1, -.15]],
    b: { ...REST, head: [.505, .2], elR: [.68, .355], haR: [.79, .375], elL: [.37, .27], haL: [.425, .17], knR: [.575, .665], ftR: [.595, .75], knL: [.385, .615], ftL: [.44, .655] },
    seg: SUPINE_SEG, accent: ['shR-elR-haR', 'hipR-knR-ftR'], r: .062
  },
  rtsc: {
    a: { head: [.25, .25], neck: [.32, .34], sh: [.355, .38], el: [.35, .52], ha: [.345, .665], hip: [.62, .5], kn: [.71, .665], ft: [.84, .665] },
    b: { head: [.3, .52], neck: [.345, .45], sh: [.38, .46], el: [.34, .575], ha: [.42, .665], hip: [.66, .33], kn: [.735, .5], ft: [.84, .665] },
    look: [[-1, -.6], [-.2, 1]],
    seg: [['neck', 'sh'], ['sh', 'hip'], ['sh', 'el', 'ha'], ['hip', 'kn', 'ft']], accent: ['sh-el-ha', 'hip-kn-ft'], r: .055, ground: .67
  },
  galant: {
    a: { head: [.5, .17], neck: [.5, .25], mid: [.5, .41], pelvis: [.5, .56], shL: [.43, .28], shR: [.57, .28], haL: [.36, .2], haR: [.64, .2], hipL: [.465, .57], hipR: [.535, .57], ftL: [.43, .72], ftR: [.57, .72] },
    b: { head: [.52, .17], neck: [.51, .25], mid: [.45, .41], pelvis: [.47, .56], shL: [.44, .28], shR: [.58, .27], haL: [.37, .2], haR: [.65, .19], hipL: [.43, .565], hipR: [.505, .575], ftL: [.38, .71], ftR: [.53, .725] },
    look: [[0, -1], [.15, -1]],
    seg: [['neck', 'mid', 'pelvis'], ['shL', 'shR'], ['shL', 'haL'], ['shR', 'haR'], ['hipL', 'hipR'], ['hipL', 'ftL'], ['hipR', 'ftR']], accent: ['neck-mid-pelvis'], r: .055, stroke: [[.56, .3], [.56, .52]]
  },
  agrippement: { hand: true }
};

function drawHand(ctx, W, H, t, time) {
  const S = Math.min(W, H / .75);
  const X = x => (W - S) / 2 + x * S, Y = y => (H - S * .75) / 2 + y * S;
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const fx = lerp(1.05, .58, ease(Math.min(1, t * 1.4)));
  ctx.strokeStyle = 'rgba(27,29,31,.35)'; ctx.lineWidth = Math.max(10, S * .045);
  ctx.beginPath(); ctx.moveTo(X(fx), Y(.36)); ctx.lineTo(X(fx + .5), Y(.36)); ctx.stroke();
  ctx.lineWidth = Math.max(2.2, S * .007);
  ctx.strokeStyle = INK;
  ctx.beginPath();
  ctx.moveTo(X(.36), Y(.72)); ctx.lineTo(X(.36), Y(.48)); ctx.quadraticCurveTo(X(.36), Y(.42), X(.42), Y(.42));
  ctx.lineTo(X(.62), Y(.42)); ctx.quadraticCurveTo(X(.66), Y(.43), X(.66), Y(.5)); ctx.lineTo(X(.64), Y(.72)); ctx.stroke();
  const bases = [.4, .46, .53, .6];
  const lens = [[.08, .055, .045], [.09, .06, .05], [.085, .058, .048], [.07, .048, .04]];
  const k = ease(Math.max(0, Math.min(1, (t - .25) / .75)));
  bases.forEach((bx, i) => {
    let ang = -Math.PI / 2 + (i - 1.5) * .06, x = bx, y = .42;
    const pts = [[x, y]];
    const flex = [lerp(0, .9, k), lerp(0, 1.25, k), lerp(0, 1.1, k)];
    lens[i].forEach((L, j) => { ang += flex[j]; x += Math.cos(ang) * L; y += Math.sin(ang) * L; pts.push([x, y]); });
    ctx.strokeStyle = k > .05 ? SIG : INK;
    ctx.beginPath(); pts.forEach(([px, py], n) => n ? ctx.lineTo(X(px), Y(py)) : ctx.moveTo(X(px), Y(py))); ctx.stroke();
    pts.forEach(([px, py]) => { ctx.beginPath(); ctx.arc(X(px), Y(py), 2.6, 0, Math.PI * 2); ctx.fillStyle = '#F2F1EC'; ctx.fill(); ctx.stroke(); });
  });
  const tp = [[.37, .56], [lerp(.3, .35, k), lerp(.5, .48, k)], [lerp(.28, .41, k), lerp(.43, .44, k)]];
  ctx.strokeStyle = INK;
  ctx.beginPath(); tp.forEach(([px, py], n) => n ? ctx.lineTo(X(px), Y(py)) : ctx.moveTo(X(px), Y(py))); ctx.stroke();
}

export function createFigure(canvas, name, { calm = false, speed = .55 } = {}) {
  const def = REFLEXES[name];
  const ctx = canvas.getContext('2d');
  let W = 0, H = 0, dpr = 1, time = 0, running = false, raf = 0, last = 0;
  const resize = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    const r = canvas.parentElement.getBoundingClientRect();
    W = r.width; H = r.height; canvas.width = W * dpr; canvas.height = H * dpr;
    draw(calm ? 1 : phase());
  };
  const phase = () => { const c = (time * speed) % 2; const p = c < 1 ? c : 2 - c; return Math.min(1, Math.max(0, (p - .12) / .76)); };

  function grid(S, ox, oy) {
    ctx.strokeStyle = 'rgba(27,29,31,.07)'; ctx.lineWidth = 1;
    ctx.beginPath();
    const step = S / 16;
    for (let x = ox % step; x < W; x += step) { ctx.moveTo(x, 0); ctx.lineTo(x, H); }
    for (let y = oy % step; y < H; y += step) { ctx.moveTo(0, y); ctx.lineTo(W, y); }
    ctx.stroke();
  }

  function draw(t) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const S = Math.min(W, H / .75), ox = (W - S) / 2, oy = (H - S * .75) / 2;
    grid(S, ox, oy);
    if (def.hand) { drawHand(ctx, W, H, t, time); return; }
    const X = x => ox + x * S, Y = y => oy + y * S;
    const e = ease(t);
    const J = {};
    Object.keys(def.a).forEach(k => { J[k] = [lerp(def.a[k][0], def.b[k][0], e), lerp(def.a[k][1], def.b[k][1], e)]; });
    if (def.ground) { ctx.strokeStyle = 'rgba(27,29,31,.35)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(X(.1), Y(def.ground)); ctx.lineTo(X(.92), Y(def.ground)); ctx.stroke(); }
    if (calm) {
      ctx.globalAlpha = .22; ctx.strokeStyle = INK; ctx.lineWidth = 2;
      def.seg.forEach(s => { ctx.beginPath(); s.forEach((k, i) => { const p = def.a[k]; i ? ctx.lineTo(X(p[0]), Y(p[1])) : ctx.moveTo(X(p[0]), Y(p[1])); }); ctx.stroke(); });
      ctx.globalAlpha = 1;
    }
    if (def.stroke) {
      ctx.strokeStyle = SIG; ctx.lineWidth = 1.5; ctx.setLineDash([3, 5]); ctx.lineDashOffset = -time * 30;
      ctx.beginPath(); ctx.moveTo(X(def.stroke[0][0]), Y(def.stroke[0][1])); ctx.lineTo(X(def.stroke[1][0]), Y(def.stroke[1][1])); ctx.stroke();
      ctx.setLineDash([]);
    }
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    def.seg.forEach(s => {
      const key = s.join('-');
      const acc = def.accent.includes(key);
      ctx.strokeStyle = acc ? SIG : INK;
      ctx.lineWidth = Math.max(2.2, S * (acc ? .0085 : .0075));
      ctx.beginPath();
      s.forEach((k, i) => { const [x, y] = J[k]; i ? ctx.lineTo(X(x), Y(y)) : ctx.moveTo(X(x), Y(y)); });
      ctx.stroke();
    });
    const [hx, hy] = J.head;
    ctx.strokeStyle = INK; ctx.lineWidth = Math.max(2.2, S * .0075);
    ctx.beginPath(); ctx.arc(X(hx), Y(hy), def.r * S, 0, Math.PI * 2); ctx.stroke();
    if (def.look) {
      const lx = lerp(def.look[0][0], def.look[1][0], e), ly = lerp(def.look[0][1], def.look[1][1], e);
      const n = Math.hypot(lx, ly) || 1;
      ctx.strokeStyle = SIG; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(X(hx + lx / n * def.r * .4), Y(hy + ly / n * def.r * .4)); ctx.lineTo(X(hx + lx / n * def.r * 1.05), Y(hy + ly / n * def.r * 1.05)); ctx.stroke();
    }
    ctx.fillStyle = '#F2F1EC';
    Object.keys(J).forEach(k => {
      if (k === 'head' || k === 'mid') return;
      const [x, y] = J[k];
      ctx.beginPath(); ctx.arc(X(x), Y(y), Math.max(2.4, S * .007), 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 1.4; ctx.stroke();
    });
  }

  const loop = now => {
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    time += dt;
    draw(phase());
    if (running) raf = requestAnimationFrame(loop);
  };
  resize();
  window.addEventListener('resize', resize);
  if (!calm) {
    const io = new IntersectionObserver(([en]) => {
      if (en.isIntersecting && !running) { running = true; last = performance.now(); raf = requestAnimationFrame(loop); }
      else if (!en.isIntersecting && running) { running = false; cancelAnimationFrame(raf); }
    });
    io.observe(canvas);
  }
  return { draw };
}
