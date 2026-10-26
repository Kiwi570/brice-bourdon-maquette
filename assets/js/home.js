/* Accueil : colonne qui s'aligne, profils, approche en couches, séance, cabinets, journal, réservation simulée. */
import { init, calm, isDesktop, finePointer, protractorReveal } from './core.js?v=2';
import { createSpine } from './spine.js?v=2';
import { Stabilo } from './stabilo.js?v=2';
import { CABINETS, ARTICLES, TARIFS, PRATICIEN } from './data.js?v=2';
import { fillMedia } from './placeholders.js?v=2';
import { openState, nowParis, DAYS, label as hourLabel } from './hours.js?v=2';

const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
const fmt = (n, d = 1) => n.toLocaleString('fr-FR', { minimumFractionDigits: d, maximumFractionDigits: d });

/* ---------- Hero ---------- */
async function hero() {
  const canvas = document.getElementById('spine');
  const tilt = document.getElementById('tilt');
  const hero = document.querySelector('.hero');
  if (!canvas) return;
  let spine = null, progress = calm ? 1 : 0;
  if (!calm) {
    ScrollTrigger.create({
      trigger: hero, start: 'top top', end: () => '+=' + Math.round(innerHeight * (isDesktop() ? 1.1 : .8)),
      pin: true, scrub: true, anticipatePin: 1,
      onUpdate: s => { progress = s.progress; spine?.setAlign(progress); }
    });
    gsap.to('.hero__text', { yPercent: -8, opacity: .25, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: () => '+=' + innerHeight, scrub: true } });
  }
  createSpine(canvas, { calm, onTilt: v => { if (tilt) tilt.textContent = fmt(v) + '°'; } }).then(sp => {
    spine = sp;
    spine.setAlign(progress);
    document.documentElement.dataset.spine = sp.mode;
  });

  const st = document.querySelector('.hero .stabilo canvas');
  let stab = null;
  if (st) {
    stab = new Stabilo(st, { surfaceEl: document.getElementById('stabilo-surface'), calm });
    if (!calm) {
      let lastY = scrollY;
      gsap.ticker.add(() => {
        const v = Math.abs(scrollY - lastY); lastY = scrollY;
        if (v > 0.5) stab.bump(Math.min(.15, v * .004));
        stab.target = .16;
        stab.tick();
      });
    }
  }
  if (calm) return;

  const title = document.querySelector('.hero__title');
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } });
  if (window.SplitText && title) {
    const split = window.SplitText.create(title, { type: 'lines, words', mask: 'lines' });
    tl.from(split.words, { yPercent: 115, duration: 1.3, stagger: .06 }, 0);
  }
  tl.from('.hero .eyebrow', { opacity: 0, y: 12, duration: .9 }, .15)
    .from('.hero__lead', { opacity: 0, y: 18, duration: 1 }, .35)
    .from('.hero__cta > *', { opacity: 0, y: 18, duration: 1, stagger: .08 }, .45)
    .from('.hero__stage', { opacity: 0, duration: 1.6, ease: 'power2.out' }, .1)
    .from('.readout, .levels, .hero__foot > *', { opacity: 0, y: 10, duration: .9, stagger: .06 }, .6);
  document.addEventListener('bb:opened', () => tl.play(), { once: true });
}

/* ---------- Profils : galerie horizontale épinglée ---------- */
function profils() {
  const sec = document.querySelector('.profils');
  if (!sec) return;
  const track = sec.querySelector('.profils__track');
  const bar = sec.querySelector('.profils__progress i');
  const cards = [...sec.querySelectorAll('.profil')];

  if (!calm && finePointer) {
    cards.forEach(card => {
      const inner = card.querySelector('.profil__card');
      const rx = gsap.quickTo(inner, 'rotationX', { duration: .6, ease: 'power3.out' });
      const ry = gsap.quickTo(inner, 'rotationY', { duration: .6, ease: 'power3.out' });
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - .5) * 10);
        rx(-((e.clientY - r.top) / r.height - .5) * 8);
      });
      card.addEventListener('pointerleave', () => { rx(0); ry(0); });
    });
  }
  if (calm) return;

  const mm = gsap.matchMedia();
  mm.add('(min-width: 900px)', () => {
    sec.classList.add('is-pinned');
    const dist = () => { const w = track.parentElement, cs = getComputedStyle(w); return Math.max(0, track.scrollWidth - (w.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight))); };
    const tween = gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: { trigger: sec, start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 1, invalidateOnRefresh: true,
        onUpdate: s => { if (bar) bar.style.transform = `scaleX(${s.progress})`; } }
    });
    cards.forEach(card => {
      const m = card.querySelector('.media');
      if (!m) return;
      m.classList.add('protractor');
      m.style.setProperty('--a', '0deg');
      const o = { a: 0 };
      gsap.to(o, { a: 180, ease: 'none', scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left 98%', end: 'left 70%', scrub: true },
        onUpdate: () => m.style.setProperty('--a', o.a + 'deg') });
    });
    return () => { sec.classList.remove('is-pinned'); cards.forEach(c => { const m = c.querySelector('.media'); m?.classList.remove('protractor'); m?.style.removeProperty('--a'); }); };
  });
  mm.add('(max-width: 899px)', () => {
    track.addEventListener('scroll', () => { if (bar) bar.style.transform = `scaleX(${track.scrollLeft / Math.max(1, track.scrollWidth - track.clientWidth)})`; }, { passive: true });
    gsap.from(cards, { y: 40, opacity: 0, stagger: .08, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: sec, start: 'top 70%', once: true } });
  });
}

/* ---------- Approche : silhouette d'analyse posturale en couches ---------- */
function approche() {
  const sec = document.querySelector('.approche');
  const canvas = document.getElementById('posture');
  if (!sec || !canvas) return;
  const ctx = canvas.getContext('2d');
  const piliers = [...sec.querySelectorAll('.pilier')];
  const layerName = sec.querySelector('.approche__layer-name');
  const NAMES = ['Structure', 'Lignes de posture', 'Organisation neuro-motrice', 'Terrain'];
  let W = 0, H = 0, dpr = 1, P = calm ? 4 : 0, Pt = P, time = 0;
  const resize = () => { dpr = Math.min(devicePixelRatio || 1, 2); const r = canvas.getBoundingClientRect(); W = r.width; H = r.height; canvas.width = W * dpr; canvas.height = H * dpr; draw(); };
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ease = x => x * x * (3 - 2 * x);

  let lastIdx = -1;
  function draw() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const FH = Math.min(H * .84, W * 1.7), cx = W / 2, top = (H - FH) / 2 + FH * .02;
    const X = x => cx + (x - .5) * FH, Y = y => top + y * FH;
    const v = [clamp(P + .7), clamp(P - 1 + .15), clamp(P - 2 + .15), clamp(P - 3 + .15)].map(ease);
    const mis = 1 - ease(clamp(P - 1));

    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(27,29,31,.07)';
    const step = FH / 16;
    ctx.beginPath();
    for (let x = cx % step; x < W; x += step) { ctx.moveTo(x, 0); ctx.lineTo(x, H); }
    for (let y = top % step; y < H; y += step) { ctx.moveTo(0, y); ctx.lineTo(W, y); }
    ctx.stroke();

    const J = {
      head: [.5 + .022 * mis, .11], neck: [.5 + .012 * mis, .19],
      sL: [.37, .235 + .02 * mis], sR: [.63, .235 - .016 * mis],
      eL: [.335, .37 + .02 * mis], eR: [.665, .37 - .012 * mis],
      wL: [.315, .49 + .018 * mis], wR: [.685, .49 - .01 * mis],
      pc: [.5 - .006 * mis, .505], hL: [.43, .515 - .012 * mis], hR: [.57, .515 + .012 * mis],
      kL: [.44, .71 - .006 * mis], kR: [.56, .71 + .006 * mis],
      aL: [.45, .905], aR: [.55, .905]
    };
    const P2 = k => [X(J[k][0]), Y(J[k][1])];

    if (v[0] > 0) {
      ctx.globalAlpha = v[0];
      ctx.strokeStyle = '#1B1D1F'; ctx.lineWidth = 1.6; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      const seg = (...ks) => { ctx.beginPath(); ks.forEach((k, i) => { const [x, y] = P2(k); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke(); };
      seg('sL', 'eL', 'wL'); seg('sR', 'eR', 'wR'); seg('sL', 'neck', 'sR'); seg('sL', 'hL', 'hR', 'sR');
      seg('hL', 'kL', 'aL'); seg('hR', 'kR', 'aR');
      const [hx, hy] = P2('head');
      ctx.beginPath(); ctx.arc(hx, hy, FH * .052, 0, Math.PI * 2); ctx.stroke();
      ctx.setLineDash([2, 5]);
      ctx.beginPath();
      const [nx, ny] = P2('neck'), [px, py] = P2('pc');
      ctx.moveTo(nx, ny);
      ctx.bezierCurveTo(nx + FH * .03 * mis, ny + (py - ny) * .35, px - FH * .025 * mis, ny + (py - ny) * .7, px, py);
      ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = '#F2F1EC';
      Object.keys(J).forEach(k => { if (k === 'head') return; const [x, y] = P2(k); ctx.beginPath(); ctx.arc(x, y, 3.4, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); });
    }

    if (v[1] > 0) {
      ctx.globalAlpha = v[1];
      ctx.strokeStyle = '#2F5BFF'; ctx.lineWidth = 1;
      ctx.setLineDash([4, 5]);
      ctx.beginPath(); ctx.moveTo(cx, Y(.02)); ctx.lineTo(cx, Y(.95)); ctx.stroke();
      ctx.setLineDash([]);
      ctx.font = '500 10px "Geist Mono", monospace';
      ctx.fillStyle = '#2F5BFF';
      const pairs = [['Yeux', [J.head[0] - .03, J.head[1] - .004 + .006 * mis], [J.head[0] + .03, J.head[1] - .004 - .006 * mis]], ['Épaules', J.sL, J.sR], ['Bassin', J.hL, J.hR], ['Genoux', J.kL, J.kR]];
      pairs.forEach(([name, a, b]) => {
        const ax = X(a[0]), ay = Y(a[1]), bx = X(b[0]), by = Y(b[1]);
        const dx = bx - ax, dy = by - ay, k = (W * .42) / Math.max(1, Math.hypot(dx, dy));
        const mx = (ax + bx) / 2, my = (ay + by) / 2;
        ctx.beginPath(); ctx.moveTo(mx - dx * k, my - dy * k); ctx.lineTo(mx + dx * k, my + dy * k); ctx.stroke();
        const deg = Math.abs(Math.atan2(dy, dx) * 180 / Math.PI);
        const label = `${name.toUpperCase()} ${fmt(deg)}°`;
        ctx.fillText(label, Math.min(W - 110, mx + dx * k + 6) > 0 ? Math.max(8, W - ctx.measureText(label).width - 12) : 8, my - 6);
      });
    }

    if (v[2] > 0) {
      ctx.globalAlpha = v[2] * .9;
      ctx.strokeStyle = '#2F5BFF'; ctx.lineWidth = 1.4;
      ctx.setLineDash([6, 6]); ctx.lineDashOffset = -time * 24;
      const [hx, hy] = P2('head');
      [['wR', .25], ['wL', -.25], ['aR', .12], ['aL', -.12]].forEach(([k, bend]) => {
        const [x, y] = P2(k);
        ctx.beginPath(); ctx.moveTo(hx, hy);
        ctx.quadraticCurveTo((hx + x) / 2 + bend * FH * .45, (hy + y) / 2, x, y);
        ctx.stroke();
      });
      ctx.setLineDash([]);
    }

    if (v[3] > 0) {
      ctx.globalAlpha = v[3];
      const [px, py] = P2('pc');
      const cyy = (Y(.24) + py) / 2;
      for (let i = 0; i < 140; i++) {
        const a = i * 2.39996, rr = Math.sqrt(i / 140);
        const x = px + Math.cos(a) * rr * FH * .095, y = cyy + Math.sin(a) * rr * FH * .16;
        const s = 1.2 + 1.2 * (.5 + .5 * Math.sin(time * 2 + i * .7));
        ctx.fillStyle = i % 7 === 0 ? 'rgba(47,91,255,.9)' : 'rgba(47,91,255,.35)';
        ctx.beginPath(); ctx.arc(x, y, s, 0, Math.PI * 2); ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
    const idx = Math.min(3, Math.floor(clamp(P, 0, 3.999)));
    if (idx !== lastIdx) {
      lastIdx = idx;
      if (layerName) layerName.innerHTML = `Couche ${idx + 1} / 4 · <b>${NAMES[idx]}</b>`;
      piliers.forEach((p, i) => p.classList.toggle('is-active', i === idx));
    }
  }

  resize();
  window.addEventListener('resize', resize);
  if (calm) { piliers.forEach(p => p.classList.add('is-active')); return; }

  gsap.ticker.add((t, dt) => { time += dt / 1000; Pt += (P - Pt) * .12; const keep = P; P = Pt; draw(); P = keep; });
  const mm = gsap.matchMedia();
  mm.add('(min-width: 900px)', () => {
    sec.classList.add('is-pinned');
    ScrollTrigger.create({ trigger: sec.querySelector('.approche__layout'), start: 'center center', end: () => '+=' + innerHeight * 2.4, pin: true, scrub: true, onUpdate: s => { P = s.progress * 4; } });
    return () => sec.classList.remove('is-pinned');
  });
  mm.add('(max-width: 899px)', () => {
    piliers.forEach((p, i) => ScrollTrigger.create({ trigger: p, start: 'top 75%', end: 'bottom 40%', onToggle: s => { if (s.isActive) P = i + .99; } }));
  });
}

/* ---------- Séance : cycle qui se dessine ---------- */
function seance() {
  const sec = document.querySelector('.seance');
  if (!sec) return;
  const prog = sec.querySelector('.cycle__progress');
  const nodes = [...sec.querySelectorAll('.cycle__node')];
  const steps = [...sec.querySelectorAll('.etape')];
  const centerName = sec.querySelector('.cycle__name');
  const centerN = sec.querySelector('.cycle__n');
  const L = prog.getTotalLength();
  prog.style.strokeDasharray = `${L}`;
  const set = p => {
    prog.style.strokeDashoffset = `${L * (1 - p)}`;
    const k = Math.min(3, Math.floor(p * 4 + .02));
    steps.forEach((s, i) => s.classList.toggle('is-on', i <= k));
    nodes.forEach((n, i) => n.setAttribute('fill', i <= k ? '#2F5BFF' : '#F2F1EC'));
    if (centerName) centerName.textContent = steps[k]?.querySelector('h3')?.textContent || '';
    if (centerN) centerN.textContent = `Étape ${k + 1} / 4`;
  };
  if (calm) { set(1); return; }
  set(0);
  ScrollTrigger.create({ trigger: sec, start: 'top 55%', end: 'bottom 70%', scrub: true, onUpdate: s => set(s.progress) });
}

/* ---------- Cabinets : plan schématique et horaires ---------- */
function plan() {
  const host = document.getElementById('plan');
  if (!host) return;
  const lat0 = 45.742, lon0 = 4.833, k = 6200;
  const proj = ([la, lo]) => [((lo - lon0) * Math.cos(lat0 * Math.PI / 180)) * k + 300, -(la - lat0) * k + 330];
  const path = pts => {
    const p = pts.map(proj);
    let d = `M${p[0][0].toFixed(1)} ${p[0][1].toFixed(1)}`;
    for (let i = 1; i < p.length; i++) {
      const p0 = p[i - 2] || p[i - 1], p1 = p[i - 1], p2 = p[i], p3 = p[i + 1] || p2;
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
    }
    return d;
  };
  const rhone = [[45.792, 4.872], [45.782, 4.862], [45.775, 4.851], [45.767, 4.845], [45.758, 4.842], [45.75, 4.838], [45.742, 4.832], [45.735, 4.825], [45.729, 4.82], [45.72, 4.822], [45.71, 4.824], [45.698, 4.821], [45.688, 4.817]];
  const saone = [[45.792, 4.812], [45.781, 4.815], [45.772, 4.822], [45.765, 4.826], [45.757, 4.827], [45.749, 4.825], [45.741, 4.822], [45.734, 4.82], [45.729, 4.82]];
  const ligneB = [
    ['Charpennes', 45.7705, 4.8634], ['Brotteaux', 45.7676, 4.8590], ['Part-Dieu', 45.7606, 4.8590], ['Place Guichard', 45.7593, 4.8476],
    ['Saxe-Gambetta', 45.7540, 4.8470], ['Jean Macé', 45.7457, 4.8423], ['Place Jean Jaurès', 45.7380, 4.8380], ['Debourg', 45.7313, 4.8333],
    ['Stade de Gerland', 45.7266, 4.8300], ['Gare d’Oullins', 45.7166, 4.8150], ['Oullins Centre', 45.7128, 4.8068], ['Saint-Genis-Laval Hôpitaux Sud', 45.6985, 4.7955]
  ];
  const showLabel = new Set(['Brotteaux', 'Part-Dieu', 'Saxe-Gambetta', 'Jean Macé', 'Debourg', 'Gare d’Oullins', 'Oullins Centre']);
  const lineD = path(ligneB.map(s => [s[1], s[2]]));
  let stations = '';
  ligneB.forEach(([n, la, lo]) => {
    const [x, y] = proj([la, lo]);
    stations += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.2" fill="#F2F1EC" stroke="#1B1D1F" stroke-width="1.2"/>`;
    if (showLabel.has(n)) stations += `<text x="${(x + 8).toFixed(1)}" y="${(y + 3.5).toFixed(1)}" font-family="Geist Mono, monospace" font-size="9.5" letter-spacing=".04em" fill="#565A61">${n.toUpperCase()}</text>`;
  });
  const [ox, oy] = proj([45.7146, 4.8112]);
  const [lx, ly] = proj([45.7662, 4.8565]);
  let grid = '';
  for (let x = 0; x <= 600; x += 40) grid += `M${x} 0V660`;
  for (let y = 0; y <= 660; y += 40) grid += `M0 ${y}H600`;
  host.innerHTML = `
  <svg viewBox="0 0 600 660" role="img" aria-labelledby="plan-title">
    <title id="plan-title">Plan schématique : la ligne B du métro relie Lyon 6 Brotteaux à Oullins</title>
    <rect width="600" height="660" fill="#F2F1EC"/>
    <path d="${grid}" stroke="rgba(27,29,31,.06)" fill="none"/>
    <path class="plan-river" d="${path(rhone)}" fill="none" stroke="#C9C6BF" stroke-width="14" stroke-linecap="round"/>
    <path class="plan-river" d="${path(saone)}" fill="none" stroke="#C9C6BF" stroke-width="10" stroke-linecap="round"/>
    <text x="${proj([45.776, 4.857])[0]}" y="${proj([45.776, 4.857])[1]}" font-family="Geist, sans-serif" font-style="italic" font-size="12" fill="#8C8982">Rhône</text>
    <text x="${proj([45.776, 4.806])[0]}" y="${proj([45.776, 4.806])[1]}" font-family="Geist, sans-serif" font-style="italic" font-size="12" fill="#8C8982">Saône</text>
    <path id="ligneB" d="${lineD}" fill="none" stroke="#2F5BFF" stroke-width="3" stroke-linecap="round"/>
    ${stations}
    <g class="plan-marker" transform="translate(${ox.toFixed(1)} ${oy.toFixed(1)})">
      <circle r="18" fill="rgba(47,91,255,.14)"/><circle r="7" fill="#2F5BFF"/>
      <text x="-14" y="-24" font-family="Geist, sans-serif" font-size="13" font-weight="500" fill="#1B1D1F" text-anchor="end">Cabinet Oullins–Pierre-Bénite</text><text x="-14" y="-10" font-family="Geist Mono, monospace" font-size="9" fill="#565A61" text-anchor="end">2 BD DU GÉNÉRAL-DE-GAULLE</text>
    </g>
    <g class="plan-marker" transform="translate(${lx.toFixed(1)} ${ly.toFixed(1)})">
      <circle r="18" fill="rgba(47,91,255,.14)"/><circle r="7" fill="#F2F1EC" stroke="#2F5BFF" stroke-width="2"/>
      <text x="-14" y="-22" font-family="Geist, sans-serif" font-size="13" font-weight="500" fill="#1B1D1F" text-anchor="end">Cabinet Lyon 6</text>
      <text x="-14" y="-8" font-family="Geist Mono, monospace" font-size="9" fill="#565A61" text-anchor="end">19 RUE GODEFROY</text>
    </g>
    <text x="24" y="640" font-family="Geist Mono, monospace" font-size="9" letter-spacing=".06em" fill="#565A61">MÉTRO B · PLAN SCHÉMATIQUE, POSITIONS INDICATIVES</text>
    <g transform="translate(548 40)"><path d="M0 18L6 0L12 18L6 13Z" fill="#1B1D1F"/><text x="6" y="32" font-family="Geist Mono, monospace" font-size="9" text-anchor="middle" fill="#1B1D1F">N</text></g>
  </svg>`;
  if (calm) return;
  const line = host.querySelector('#ligneB');
  const len = line.getTotalLength();
  gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
  gsap.timeline({ scrollTrigger: { trigger: host, start: 'top 75%', once: true } })
    .to(line, { strokeDashoffset: 0, duration: 2.2, ease: 'power2.inOut' })
    .from(host.querySelectorAll('.plan-marker'), { scale: 0, transformOrigin: 'center', duration: .9, ease: 'back.out(2)', stagger: .2 }, '-=.6');
}

function cabinets() {
  document.querySelectorAll('[data-cabinet]').forEach(card => {
    const cab = CABINETS.find(c => c.id === card.dataset.cabinet);
    if (!cab) return;
    const status = card.querySelector('.status');
    const table = card.querySelector('.horaires');
    const now = nowParis();
    if (table) {
      if (cab.horaires) {
        table.innerHTML = [1, 2, 3, 4, 5, 6, 0].map(d => {
          const sl = cab.horaires[d];
          const txt = sl ? sl.map(([a, b]) => `${hourLabel(a)}–${hourLabel(b)}`).join(', ') : 'Fermé';
          const cls = d === now.day ? ' class="is-today"' : '';
          return `<span${cls}>${DAYS[d].slice(0, 3)}.</span><span${cls}>${txt}</span>`;
        }).join('');
      } else table.innerHTML = '<span class="todo">Horaires à compléter</span><span></span>';
    }
    if (status) {
      const s = openState(cab.horaires, now);
      status.classList.toggle('is-open', s.open);
      status.innerHTML = `<i></i>${s.label}`;
    }
  });
}

/* ---------- Journal ---------- */
function journal() {
  const grid = document.querySelector('.journal__grid');
  if (!grid) return;
  grid.innerHTML = ARTICLES.map(a => `
    <a class="article-card" href="${a.url}" data-cat="${a.cat}"${a.interne ? '' : ' target="_blank" rel="noopener"'} data-cursor="Lire">
      <figure class="media media--1610" data-file="${a.image}" data-ph="${a.ph}" data-source="site" data-parallax data-alt=""><div class="parallax-inner"></div></figure>
      <div class="article-card__meta mono"><span>${a.catLabel}</span><span>${a.lecture} min de lecture</span></div>
      <h3>${a.titre}</h3>
      <span class="article-card__date">${a.date}${a.interne ? ' · article type de la maquette' : ' · site actuel'}</span>
    </a>`).join('');
  fillMedia(grid);
  const chips = [...document.querySelectorAll('.filters .chip')];
  chips.forEach(chip => chip.addEventListener('click', () => {
    chips.forEach(c => c.setAttribute('aria-pressed', String(c === chip)));
    const cat = chip.dataset.filter;
    const cards = [...grid.children];
    cards.forEach(c => { c.hidden = !(cat === 'tous' || c.dataset.cat === cat); });
    if (!calm) gsap.fromTo(cards.filter(c => !c.hidden), { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: .7, stagger: .05, ease: 'expo.out' });
    ScrollTrigger.refresh();
  }));
  if (!calm) {
    gsap.from(grid.children, { y: 40, opacity: 0, duration: 1, ease: 'expo.out', stagger: .07, scrollTrigger: { trigger: grid, start: 'top 85%', once: true } });
  }
}

/* ---------- FAQ ---------- */
function faq() {
  document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('toggle', () => {
      if (!item.open || calm) return;
      const body = item.querySelector('.faq-item__body');
      gsap.from(body, { height: 0, opacity: 0, duration: .6, ease: 'expo.out', clearProps: 'height,opacity' });
    });
  });
}

/* ---------- Réservation simulée ---------- */
function booking() {
  const el = document.querySelector('.booking');
  if (!el) return;
  const body = el.querySelector('.booking__body');
  const back = el.querySelector('.booking__back');
  const stepsBar = [...el.querySelectorAll('.booking__steps i')];
  const stepLabel = el.querySelector('.booking__steplabel');
  const stabCanvas = el.querySelector('.booking__stabilo canvas');
  const stab = stabCanvas ? new Stabilo(stabCanvas, { calm, scale: .8 }) : null;
  const stabLabel = el.querySelector('.booking__stabilo span');
  if (stab && !calm) { stab.agitation = 1.6; stab.target = 1.2; gsap.ticker.add(() => stab.tick()); }

  const MOTIFS = TARIFS.map(t => ({ id: t.id, label: t.libelle, prix: t.prix, detail: t.detail }));
  const s = { step: 0, cabinet: null, motif: null, day: null, slot: null };
  const priceTxt = p => p ? `${p} €` : 'Tarif à compléter';

  const days = () => {
    const out = [];
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    while (out.length < 6) {
      d.setDate(d.getDate() + 1);
      const wd = d.getDay();
      if (wd === 0) continue;
      const cab = CABINETS.find(c => c.id === s.cabinet);
      if (cab?.horaires && !cab.horaires[wd]) continue;
      out.push(new Date(d));
    }
    return out;
  };
  const slotsFor = date => {
    const cab = CABINETS.find(c => c.id === s.cabinet);
    const ranges = cab?.horaires?.[date.getDay()] || [['09:00', '19:00']];
    const seed = date.getDate() * 7 + date.getMonth() * 31;
    const out = [];
    ranges.forEach(([a, b]) => {
      const [ah, am] = a.split(':').map(Number), [bh, bm] = b.split(':').map(Number);
      for (let m = ah * 60 + am; m + 45 <= bh * 60 + bm; m += 45) {
        if (((m / 45 + seed) * 2654435761 >>> 0) % 3 === 0) out.push(`${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`);
      }
    });
    return out.slice(0, 8);
  };

  const render = (dir = 1) => {
    stepsBar.forEach((b, i) => b.classList.toggle('is-on', i <= s.step));
    back.disabled = s.step === 0;
    stepLabel.textContent = s.step < 3 ? `Étape ${s.step + 1} / 3` : 'Récapitulatif';
    let html = '';
    if (s.step === 0) {
      html = `<div class="booking__panel"><h3>Quel cabinet ?</h3><div class="choices">${CABINETS.map(c => `<button type="button" class="choice" data-v="${c.id}" aria-pressed="${s.cabinet === c.id}"><span>${c.nom}<small>${c.adresse}, ${c.ville}</small></span><span class="mono">${c.id === 'oullins' ? 'Métro B' : 'Lyon 6'}</span></button>`).join('')}</div></div>`;
    } else if (s.step === 1) {
      html = `<div class="booking__panel"><h3>Pour quel motif ?</h3><div class="choices">${MOTIFS.map(m => `<button type="button" class="choice" data-v="${m.id}" aria-pressed="${s.motif === m.id}"><span>${m.label}<small>${m.detail}</small></span><span class="mono num">${priceTxt(m.prix)}</span></button>`).join('')}</div></div>`;
    } else if (s.step === 2) {
      const ds = days();
      if (!s.day) s.day = ds[0].toISOString();
      const cur = new Date(s.day);
      const sl = slotsFor(cur);
      html = `<div class="booking__panel"><h3>Quel créneau ?</h3><p class="mono illustratif">Créneaux fictifs pour la démonstration</p>
        <div class="days">${ds.map(d => `<button type="button" class="day" data-day="${d.toISOString()}" aria-pressed="${d.toDateString() === cur.toDateString()}"><span class="mono">${d.toLocaleDateString('fr-FR', { weekday: 'short' })}</span><b>${d.getDate()}</b><span class="mono">${d.toLocaleDateString('fr-FR', { month: 'short' })}</span></button>`).join('')}</div>
        <div class="slots">${sl.length ? sl.map(t => `<button type="button" class="slot" data-slot="${t}" aria-pressed="${s.slot === t}">${t.replace(':', ' h ')}</button>`).join('') : '<p>Aucun créneau ce jour-là.</p>'}</div></div>`;
    } else {
      const cab = CABINETS.find(c => c.id === s.cabinet), mo = MOTIFS.find(m => m.id === s.motif), d = new Date(s.day);
      html = `<div class="booking__panel"><h3>Votre demande est prête</h3>
        <dl class="recap"><dt>Cabinet</dt><dd>${cab.nom}</dd><dt>Motif</dt><dd>${mo.label}</dd><dt>Tarif</dt><dd>${priceTxt(mo.prix)}</dd><dt>Créneau</dt><dd>${d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} à ${s.slot.replace(':', ' h ')}</dd></dl>
        <p class="note-maquette"><strong>Démonstration</strong>Aucune réservation n’est envoyée depuis cette maquette. La prise de rendez-vous réelle se fait sur Doctolib, avec le choix du cabinet.</p>
        <a class="btn btn--signal" href="${PRATICIEN.doctolib}" target="_blank" rel="noopener"><span class="btn__label">Réserver sur Doctolib</span></a></div>`;
    }
    const old = body.firstElementChild;
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    const next = tmp.firstElementChild;
    if (calm || !old) { body.innerHTML = ''; body.appendChild(next); }
    else {
      gsap.to(old, { xPercent: -12 * dir, opacity: 0, duration: .35, ease: 'power2.in', onComplete: () => {
        body.innerHTML = ''; body.appendChild(next);
        gsap.from(next, { xPercent: 12 * dir, opacity: 0, duration: .55, ease: 'expo.out' });
      } });
    }
    if (stab) {
      const calmness = [1.2, .8, .45, .1][s.step];
      stab.target = calmness;
      if (stabLabel) stabLabel.textContent = s.step === 3 ? 'Stabilisé' : 'En recherche d’équilibre';
      if (calm) stab.draw();
    }
  };

  body.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    if (s.step === 0 && b.dataset.v) { s.cabinet = b.dataset.v; s.day = null; s.slot = null; s.step = 1; render(1); }
    else if (s.step === 1 && b.dataset.v) { s.motif = b.dataset.v; s.step = 2; render(1); }
    else if (s.step === 2 && b.dataset.day) { s.day = b.dataset.day; s.slot = null; render(0); }
    else if (s.step === 2 && b.dataset.slot) { s.slot = b.dataset.slot; s.step = 3; render(1); }
  });
  back.addEventListener('click', () => { if (s.step > 0) { s.step -= 1; render(-1); } });
  render();
}

/* ---------- Détails : repères, portrait, frise ---------- */
function details() {
  if (calm) return;
  document.querySelectorAll('.repere__line').forEach((l, i) => {
    gsap.from(l, { scaleX: 0, duration: 1.4, ease: 'expo.inOut', delay: i * .08, scrollTrigger: { trigger: l, start: 'top 92%', once: true } });
  });
  const portrait = document.querySelector('.portrait');
  if (portrait) {
    const lines = portrait.querySelectorAll('.portrait__levels i');
    const media = portrait.querySelector('.media');
    gsap.timeline({ scrollTrigger: { trigger: portrait, start: 'top 75%', once: true } })
      .from(lines, { scaleX: 0, duration: 1, ease: 'expo.inOut', stagger: .12 })
      .from(media, { clipPath: 'inset(0 0 100% 0)', duration: 1.4, ease: 'expo.inOut' }, .2)
      .to(lines, { opacity: .35, duration: .8 }, 1.2);
  }
  const frise = document.querySelector('.frise');
  if (frise) {
    const line = frise.querySelector('.frise__line');
    const items = [...frise.querySelectorAll('li')];
    gsap.fromTo(line, { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: frise, start: 'top 70%', end: 'bottom 60%', scrub: true,
      onUpdate: s => items.forEach((it, i) => it.classList.toggle('is-on', s.progress >= i / Math.max(1, items.length - 1) - .02)) } });
  }
  document.querySelectorAll('.prix__ticks').forEach((t, i) => gsap.from(t, { scaleX: 0, duration: 1.2, ease: 'expo.inOut', delay: i * .1, scrollTrigger: { trigger: t, start: 'top 92%', once: true } }));
  document.querySelectorAll('[data-protractor]').forEach(el => protractorReveal(el));
}

init(() => {
  hero();
  profils();
  approche();
  seance();
  plan();
  cabinets();
  journal();
  faq();
  booking();
  details();
});
