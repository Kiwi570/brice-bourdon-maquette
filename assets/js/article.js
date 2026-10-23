/* Article : niveau à bulle de lecture, sommaire suivi, sensations animées, articles liés. */
import { init, calm } from './core.js';
import { ARTICLES } from './data.js';
import { fillMedia } from './placeholders.js';

const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;

function level() {
  const vial = document.querySelector('.level__vial');
  const bubble = document.querySelector('.level__bubble');
  const label = document.querySelector('.level__label');
  const prose = document.querySelector('.prose');
  if (!vial || !bubble || !prose) return;
  const update = () => {
    const r = prose.getBoundingClientRect();
    const total = r.height - innerHeight * .6;
    const p = Math.min(1, Math.max(0, (-r.top + innerHeight * .2) / Math.max(1, total)));
    const max = vial.clientWidth - bubble.offsetWidth - 4;
    const target = (max / 2) + 2;
    const x = 2 + p * (target - 2);
    bubble.style.setProperty('--x', x + 'px');
    const deg = (1 - p) * 4;
    if (label) label.textContent = p > .995 ? 'De niveau' : `${deg.toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}° · ${Math.round(p * 100)} %`;
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
}

function toc() {
  const nav = document.querySelector('.toc');
  const heads = [...document.querySelectorAll('.prose h2[id]')];
  if (!nav || !heads.length) return;
  nav.insertAdjacentHTML('beforeend', heads.map(h => `<a href="#${h.id}">${h.dataset.short || h.textContent}</a>`).join(''));
  const links = [...nav.querySelectorAll('a')];
  heads.forEach((h, i) => ScrollTrigger.create({ trigger: h, start: 'top 40%', endTrigger: heads[i + 1] || '.prose', end: heads[i + 1] ? 'top 40%' : 'bottom 40%',
    onToggle: s => { if (s.isActive) links.forEach((l, k) => l.classList.toggle('is-active', k === i)); } }));
}

/* Quatre sensations : rotation, tangage, flottement, voile */
function sensations() {
  document.querySelectorAll('.sensation canvas').forEach(c => {
    const kind = c.dataset.kind;
    const ctx = c.getContext('2d');
    let W = 0, H = 0, dpr = 1, t = 0, on = false, last = 0;
    const resize = () => { dpr = Math.min(devicePixelRatio || 1, 2); const r = c.parentElement.getBoundingClientRect(); W = r.width; H = r.height; c.width = W * dpr; c.height = H * dpr; draw(); };
    function draw() {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2, cy = H * .46, R = Math.min(W, H) * .32;
      ctx.strokeStyle = 'rgba(27,29,31,.12)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
      ctx.save(); ctx.translate(cx, cy);
      ctx.strokeStyle = '#1B1D1F'; ctx.lineWidth = 1.6;
      if (kind === 'rotation') {
        ctx.rotate(t * .9);
        for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(-R, (i - 1) * R * .35); ctx.lineTo(R, (i - 1) * R * .35); ctx.stroke(); }
      } else if (kind === 'tangage') {
        ctx.rotate(Math.sin(t * 1.4) * .22);
        ctx.beginPath(); ctx.moveTo(-R, 0); ctx.lineTo(R, 0); ctx.stroke();
        ctx.strokeStyle = 'rgba(27,29,31,.3)'; ctx.beginPath(); ctx.moveTo(-R * .6, R * .35); ctx.lineTo(R * .6, R * .35); ctx.stroke();
      } else if (kind === 'flottement') {
        for (let k = -1; k <= 1; k++) {
          ctx.beginPath();
          for (let x = -R; x <= R; x += 3) { const y = k * R * .35 + Math.sin(x * .06 + t * 2 + k) * R * .08; x === -R ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
          ctx.globalAlpha = k ? .45 : 1; ctx.stroke();
        }
        ctx.globalAlpha = 1;
      } else {
        const a = .5 + .5 * Math.sin(t * 1.2);
        ctx.beginPath(); ctx.moveTo(-R, 0); ctx.lineTo(R, 0); ctx.stroke();
        ctx.fillStyle = `rgba(27,29,31,${.05 + a * .22})`;
        ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
      ctx.strokeStyle = '#2F5BFF'; ctx.setLineDash([3, 4]);
      ctx.beginPath(); ctx.moveTo(cx - R * 1.15, cy); ctx.lineTo(cx + R * 1.15, cy); ctx.stroke(); ctx.setLineDash([]);
    }
    const loop = now => { t += Math.min(.05, (now - last) / 1000); last = now; draw(); if (on) requestAnimationFrame(loop); };
    resize();
    window.addEventListener('resize', resize);
    if (!calm) new IntersectionObserver(([e]) => { if (e.isIntersecting && !on) { on = true; last = performance.now(); requestAnimationFrame(loop); } else if (!e.isIntersecting) on = false; }).observe(c);
  });
}

function related() {
  const host = document.querySelector('.related');
  if (!host) return;
  const list = ARTICLES.filter(a => !a.interne).slice(0, 3);
  host.innerHTML = list.map(a => `
    <a class="article-card" href="${a.url}" target="_blank" rel="noopener" data-cursor="Lire">
      <figure class="media media--1610" data-file="${a.image}" data-ph="${a.ph}" data-source="site" data-parallax><div class="parallax-inner"></div></figure>
      <div class="article-card__meta mono"><span>${a.catLabel}</span><span>${a.lecture} min de lecture</span></div>
      <h3>${a.titre}</h3>
      <span class="article-card__date">${a.date} · site actuel</span>
    </a>`).join('');
  fillMedia(host);
}

init(() => {
  related();
  level();
  toc();
  sensations();
  if (!calm) {
    const tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } });
    const h1 = document.querySelector('.article-hero h1');
    if (window.SplitText && h1) { const s = window.SplitText.create(h1, { type: 'lines, words', mask: 'lines' }); tl.from(s.words, { yPercent: 115, duration: 1.1, stagger: .03 }, 0); }
    tl.from('.article-hero .crumbs, .article-meta, .article-cover', { opacity: 0, y: 18, duration: 1, stagger: .1 }, .2);
    document.addEventListener('bb:opened', () => tl.play(), { once: true });
  }
});
