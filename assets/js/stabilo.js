/* Statokinésigramme illustratif : le centre de pression oscille, trace son balancement,
   puis se stabilise quand le visiteur s'arrête. Données fictives, à but décoratif. */
export class Stabilo {
  constructor(canvas, { surfaceEl = null, calm = false, scale = 1 } = {}) {
    this.c = canvas;
    this.ctx = canvas.getContext('2d');
    this.surfaceEl = surfaceEl;
    this.calm = calm;
    this.scale = scale;
    this.p = { x: 0, y: 0 };
    this.v = { x: 0, y: 0 };
    this.trail = [];
    this.agitation = .6;
    this.target = .25;
    this.t = 0;
    this.resize();
    window.addEventListener('resize', () => this.resize());
    if (calm) { this.seed(); this.draw(); }
  }
  resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const r = this.c.getBoundingClientRect();
    this.w = r.width || 88; this.h = r.height || 88;
    this.c.width = this.w * dpr; this.c.height = this.h * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  seed() {
    for (let i = 0; i < 260; i++) this.step(.25);
  }
  bump(amount) { this.agitation = Math.min(2.4, this.agitation + amount); }
  settle(level = .12) { this.target = level; }
  step(amp) {
    this.t += .016;
    const k = .018, damp = .93;
    const n = () => (Math.random() - .5) * amp;
    this.v.x = (this.v.x - this.p.x * k + n() * .06 + Math.sin(this.t * 1.3) * .0009 * amp) * damp;
    this.v.y = (this.v.y - this.p.y * k + n() * .09 + Math.cos(this.t * .9) * .0012 * amp) * damp;
    this.p.x += this.v.x; this.p.y += this.v.y;
    this.trail.push([this.p.x, this.p.y]);
    if (this.trail.length > 260) this.trail.shift();
  }
  tick() {
    if (this.calm) return;
    this.agitation += (this.target - this.agitation) * .02;
    this.step(this.agitation);
    this.draw();
  }
  draw() {
    const { ctx, w, h } = this;
    const cx = w / 2, cy = h / 2, s = Math.min(w, h) * .9 * this.scale;
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(27,29,31,.18)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(cx, 6); ctx.lineTo(cx, h - 6); ctx.moveTo(6, cy); ctx.lineTo(w - 6, cy); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, s * .32, 0, Math.PI * 2); ctx.stroke();
    let mx = 0, my = 0;
    this.trail.forEach(([x, y]) => { mx += x; my += y; });
    const n = this.trail.length || 1; mx /= n; my /= n;
    let sxx = 0, syy = 0, sxy = 0;
    this.trail.forEach(([x, y]) => { sxx += (x - mx) ** 2; syy += (y - my) ** 2; sxy += (x - mx) * (y - my); });
    sxx /= n; syy /= n; sxy /= n;
    const tr = sxx + syy, det = sxx * syy - sxy * sxy;
    const l1 = tr / 2 + Math.sqrt(Math.max(0, tr * tr / 4 - det));
    const l2 = tr / 2 - Math.sqrt(Math.max(0, tr * tr / 4 - det));
    const ang = .5 * Math.atan2(2 * sxy, sxx - syy);
    const k = 2.45;
    ctx.strokeStyle = 'rgba(47,91,255,.5)';
    ctx.beginPath();
    ctx.ellipse(cx + mx * s, cy + my * s, Math.max(1, Math.sqrt(Math.max(l1, 0)) * k * s), Math.max(1, Math.sqrt(Math.max(l2, 0)) * k * s), ang, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    this.trail.forEach(([x, y], i) => { const X = cx + x * s, Y = cy + y * s; i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); });
    ctx.strokeStyle = 'rgba(27,29,31,.62)';
    ctx.stroke();
    ctx.fillStyle = '#2F5BFF';
    ctx.beginPath(); ctx.arc(cx + this.p.x * s, cy + this.p.y * s, 2.6, 0, Math.PI * 2); ctx.fill();
    if (this.surfaceEl) {
      const area = Math.PI * k * k * Math.sqrt(Math.max(l1, 0)) * Math.sqrt(Math.max(l2, 0)) * 2400;
      this.surfaceEl.textContent = Math.round(area).toLocaleString('fr-FR');
    }
  }
}
