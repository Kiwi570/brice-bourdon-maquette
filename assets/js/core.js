/* Socle commun à toutes les pages : défilement fluide, mode calme, curseur fil à plomb,
   boutons magnétiques, rideau de transition, ouverture, révélations au défilement. */
import { fillMedia } from './placeholders.js?v=20261027';

const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
const SplitText = window.SplitText;
const root = document.documentElement;
root.classList.remove('no-js');

export const finePointer = matchMedia('(pointer: fine)').matches;
export const isDesktop = () => matchMedia('(min-width: 900px)').matches;

/* ---------- Mode calme ---------- */
function readCalm() {
  const q = new URLSearchParams(location.search).get('calme');
  if (q === '1') return true;
  if (q === '0') return false;
  try { const v = localStorage.getItem('bb-calm'); if (v !== null) return v === '1'; } catch (e) { /* stockage indisponible */ }
  return matchMedia('(prefers-reduced-motion: reduce)').matches;
}
export const calm = readCalm();
root.classList.toggle('is-calm', calm);

function setupCalmToggle() {
  document.querySelectorAll('[data-calm-toggle]').forEach(btn => {
    btn.setAttribute('aria-pressed', String(calm));
    btn.addEventListener('click', () => {
      const next = !calm;
      try { localStorage.setItem('bb-calm', next ? '1' : '0'); } catch (e) { /* ignoré */ }
      try { sessionStorage.setItem('bb-scroll', String(window.scrollY)); } catch (e) { /* ignoré */ }
      const url = new URL(location.href);
      url.searchParams.set('calme', next ? '1' : '0');
      location.replace(url.toString());
    });
  });
  try {
    const y = sessionStorage.getItem('bb-scroll');
    if (y !== null) { sessionStorage.removeItem('bb-scroll'); requestAnimationFrame(() => window.scrollTo(0, Number(y))); }
  } catch (e) { /* ignoré */ }
}

/* ---------- Défilement ---------- */
export let lenis = null;
export function scrollToTarget(target) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: -64, duration: 1.4 });
  else el.scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'start' });
}

function setupScroll() {
  if (gsap && ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  if (SplitText) gsap.registerPlugin(SplitText);
  if (!calm && window.Lenis) {
    lenis = new window.Lenis({ lerp: .085, wheelMultiplier: .95, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    let el = null;
    try { el = document.getElementById(decodeURIComponent(id.slice(1))); } catch (er) { /* ancre invalide */ }
    if (!el) return;
    e.preventDefault();
    closeMenu();
    scrollToTarget(el);
    history.replaceState(null, '', id);
    if (!el.matches('a, button, input, select, textarea, [tabindex]')) el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
  });
}

/* ---------- En-tête, menu, règle ---------- */
function setupHeader() {
  const header = document.querySelector('.header');
  const onScroll = () => header && header.classList.toggle('is-scrolled', window.scrollY > 12);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const ruler = document.querySelector('.ruler');
  if (ruler) {
    const mark = ruler.querySelector('.ruler__mark');
    const label = ruler.querySelector('.ruler__label');
    const update = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      mark.style.setProperty('--y', `${p * (innerHeight - 2)}px`);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    document.querySelectorAll('[data-section]').forEach(sec => {
      ScrollTrigger.create({ trigger: sec, start: 'top 50%', end: 'bottom 50%', onToggle: s => { if (s.isActive) label.textContent = sec.dataset.section; } });
    });
  }
}

let menuEl = null;
const horsMenu = () => document.querySelectorAll('body > main, body > footer, body > .header, body > .mobilebar, body > .skip');
function closeMenu() {
  if (!menuEl || menuEl.hidden) return false;
  menuEl.hidden = true;
  document.querySelector('.menu-btn')?.setAttribute('aria-expanded', 'false');
  root.classList.remove('menu-ouvert');
  horsMenu().forEach(el => { el.inert = false; });
  lenis?.start();
  return true;
}
function setupMenu() {
  menuEl = document.querySelector('.menu');
  const btn = document.querySelector('.menu-btn');
  if (!menuEl || !btn) return;
  btn.addEventListener('click', () => {
    menuEl.hidden = false;
    menuEl.setAttribute('data-lenis-prevent', '');
    btn.setAttribute('aria-expanded', 'true');
    root.classList.add('menu-ouvert');
    horsMenu().forEach(el => { el.inert = true; });
    lenis?.stop();
    menuEl.querySelector('.menu__close')?.focus();
    if (!calm) gsap.fromTo(menuEl.querySelectorAll('nav a'), { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, overwrite: true, stagger: .05, duration: .7, ease: 'expo.out' });
  });
  menuEl.querySelector('.menu__close')?.addEventListener('click', () => { closeMenu(); btn.focus(); });
  document.addEventListener('keydown', e => {
    if (menuEl.hidden) return;
    if (e.key === 'Escape') { if (closeMenu()) btn.focus(); return; }
    if (e.key !== 'Tab') return;
    const items = [...menuEl.querySelectorAll('a[href], button:not([disabled])')];
    const i = items.indexOf(document.activeElement);
    if (e.shiftKey && i <= 0) { e.preventDefault(); items[items.length - 1].focus(); }
    else if (!e.shiftKey && i === items.length - 1) { e.preventDefault(); items[0].focus(); }
  });
  window.addEventListener('pageshow', ev => { if (ev.persisted) closeMenu(); });
}

/* ---------- Curseur fil à plomb ---------- */
function setupPlumb() {
  if (calm || !finePointer) return;
  const c = document.createElement('canvas');
  c.className = 'plumb';
  c.setAttribute('aria-hidden', 'true');
  document.body.appendChild(c);
  root.classList.add('has-plumb');
  const ctx = c.getContext('2d');
  let dpr = 1, W = 0, H = 0;
  const resize = () => { dpr = Math.min(devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight; c.width = W * dpr; c.height = H * dpr; c.style.width = W + 'px'; c.style.height = H + 'px'; };
  resize();
  window.addEventListener('resize', resize);
  const m = { x: W / 2, y: H * .4, seen: false };
  let ax = m.x, av = 0, hover = 0, hoverT = 0, label = '';
  window.addEventListener('pointermove', e => { m.x = e.clientX; m.y = e.clientY; m.seen = true; }, { passive: true });
  document.addEventListener('pointerleave', () => { m.seen = false; });
  document.addEventListener('pointerover', e => {
    const t = e.target.closest('a, button, summary, [data-cursor]');
    hoverT = t ? 1 : 0;
    label = t?.dataset.cursor || '';
  });
  gsap.ticker.add(() => {
    av += (m.x - ax) * .045; av *= .86; ax += av;
    hover += (hoverT - hover) * .18;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    if (!m.seen) return;
    ctx.strokeStyle = 'rgba(47,91,255,.55)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(ax, 0); ctx.lineTo(m.x, m.y - 9); ctx.stroke();
    const ang = Math.atan2(m.x - ax, m.y);
    ctx.save(); ctx.translate(m.x, m.y); ctx.rotate(-ang);
    ctx.fillStyle = '#2F5BFF';
    const s = 1 - hover * .5;
    ctx.beginPath(); ctx.moveTo(-5 * s, -10 * s); ctx.lineTo(5 * s, -10 * s); ctx.lineTo(0, 3 * s); ctx.closePath(); ctx.fill();
    ctx.restore();
    if (hover > .02) {
      ctx.strokeStyle = `rgba(47,91,255,${hover})`;
      ctx.beginPath(); ctx.arc(m.x, m.y, 10 + hover * 14, 0, Math.PI * 2); ctx.stroke();
      if (label && hover > .6) { ctx.fillStyle = '#1B1D1F'; ctx.font = '500 10px "Geist Mono", monospace'; ctx.fillText(label.toUpperCase(), m.x + 30, m.y + 4); }
    }
  });
}

/* ---------- Boutons magnétiques ---------- */
function setupMagnetic() {
  if (calm || !finePointer) return;
  document.querySelectorAll('.magnetic').forEach(el => {
    const xTo = gsap.quickTo(el, 'x', { duration: .6, ease: 'elastic.out(1, .4)' });
    const yTo = gsap.quickTo(el, 'y', { duration: .6, ease: 'elastic.out(1, .4)' });
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * .28);
      yTo((e.clientY - (r.top + r.height / 2)) * .38);
    });
    el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
  });
}

/* ---------- Rideau de transition et ouverture ---------- */
function setupCurtain(onOpened) {
  const curtain = document.querySelector('.curtain');
  const intro = document.querySelector('.intro');
  if (calm || !curtain) { intro?.remove(); curtain?.remove(); onOpened?.(); return; }
  let fromInside = false;
  try { fromInside = sessionStorage.getItem('bb-nav') === '1'; sessionStorage.removeItem('bb-nav'); } catch (e) { /* ignoré */ }

  if (intro && !fromInside) {
    curtain.style.transform = 'scaleY(0)';
    const name = intro.querySelector('.intro__name');
    const letters = name ? [...name.textContent].map(ch => `<span>${ch === ' ' ? '&nbsp;' : ch}</span>`).join('') : '';
    if (name) name.innerHTML = letters;
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, onComplete: () => { intro.remove(); } });
    tl.from(intro.querySelector('.intro__thread'), { scaleY: 0, duration: .7, ease: 'power3.in' })
      .from(intro.querySelector('.intro__bob'), { y: '-46vh', duration: .7, ease: 'power3.in' }, 0)
      .to(intro.querySelector('.intro__thread'), { rotate: 3, duration: .22, ease: 'sine.out' }, .7)
      .to(intro.querySelector('.intro__thread'), { rotate: -1.6, duration: .26, ease: 'sine.inOut' }, .92)
      .to(intro.querySelector('.intro__thread'), { rotate: 0, duration: .3, ease: 'sine.out' }, 1.18)
      .to(intro.querySelector('.intro__bob'), { x: '1.2vw', duration: .22, ease: 'sine.out' }, .7)
      .to(intro.querySelector('.intro__bob'), { x: '-.6vw', duration: .26, ease: 'sine.inOut' }, .92)
      .to(intro.querySelector('.intro__bob'), { x: 0, duration: .3, ease: 'sine.out' }, 1.18)
      .from(name?.children || [], { y: 26, opacity: 0, stagger: .025, duration: .7 }, .55)
      .from(intro.querySelector('.intro__meta'), { opacity: 0, y: 10, duration: .6 }, .9)
      .to(intro, { yPercent: -100, duration: .9, ease: 'expo.inOut' }, 1.65)
      .add(() => onOpened?.(), 1.85);
  } else {
    intro?.remove();
    gsap.fromTo(curtain, { scaleY: 1, transformOrigin: '50% 100%' }, { scaleY: 0, duration: .8, ease: 'expo.inOut', delay: .05, onComplete: () => onOpened?.() });
  }

  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a || a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey) return;
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || /^(https?:|mailto:|tel:)/.test(href)) return;
    const norm = p => p.replace(/\/index(\.html)?$/, '/').replace(/\.html$/, '');
    if (a.origin === location.origin && norm(a.pathname) === norm(location.pathname) && !a.hash && a.search === location.search) {
      e.preventDefault(); closeMenu(); scrollToTarget(document.body); return;
    }
    e.preventDefault();
    try { sessionStorage.setItem('bb-nav', '1'); } catch (er) { /* ignoré */ }
    gsap.fromTo(curtain, { scaleY: 0, transformOrigin: '50% 0%' }, { scaleY: 1, duration: .6, ease: 'expo.inOut', onComplete: () => { location.href = a.href; } });
  });
  window.addEventListener('pageshow', ev => { if (ev.persisted) gsap.set(curtain, { scaleY: 0 }); });
}

/* ---------- Révélations ---------- */
function setupReveals() {
  if (calm) return;
  document.querySelectorAll('[data-split]').forEach(el => {
    if (!SplitText) return;
    const split = SplitText.create(el, { type: 'lines, words', mask: 'lines', linesClass: 'split-line' });
    gsap.from(split.words, { yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: .045, scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
  });
  document.querySelectorAll('[data-reveal]').forEach(el => {
    gsap.from(el, { y: 36, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
  });
  document.querySelectorAll('[data-stagger]').forEach(group => {
    gsap.from(group.children, { y: 30, opacity: 0, duration: .9, ease: 'expo.out', stagger: .08, scrollTrigger: { trigger: group, start: 'top 88%', once: true } });
  });
  document.querySelectorAll('[data-draw-x]').forEach(el => {
    gsap.from(el, { scaleX: 0, transformOrigin: '0 50%', duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
  });
  document.querySelectorAll('.media[data-parallax]').forEach(el => {
    const inner = el.querySelector('.parallax-inner');
    if (!inner) return;
    gsap.fromTo(inner, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
}

/* Révélation au rapporteur d'angle */
export function protractorReveal(el, opts = {}) {
  if (calm) return;
  el.classList.add('protractor');
  const dial = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  dial.setAttribute('viewBox', '0 0 200 100');
  dial.classList.add('protractor__dial');
  let ticks = '';
  for (let i = 0; i <= 18; i++) {
    const a = Math.PI - (i / 18) * Math.PI;
    const r1 = 96, r2 = i % 9 === 0 ? 82 : 89;
    ticks += `<line x1="${100 + Math.cos(a) * r1}" y1="${100 - Math.sin(a) * r1}" x2="${100 + Math.cos(a) * r2}" y2="${100 - Math.sin(a) * r2}" stroke="#2F5BFF" stroke-width="1"/>`;
  }
  dial.innerHTML = `<path d="M4 100A96 96 0 0 1 196 100" fill="none" stroke="#2F5BFF" stroke-width="1"/>${ticks}<line class="needle" x1="100" y1="100" x2="4" y2="100" stroke="#2F5BFF" stroke-width="1.5"/><circle cx="100" cy="100" r="3" fill="#2F5BFF"/>`;
  el.appendChild(dial);
  const needle = dial.querySelector('.needle');
  const st = { a: 0 };
  gsap.set(el, { '--a': '0deg' });
  gsap.to(st, {
    a: 180, duration: opts.duration || 1.6, ease: 'expo.inOut',
    scrollTrigger: opts.trigger === false ? undefined : { trigger: el, start: 'top 82%', once: true },
    onUpdate: () => {
      el.style.setProperty('--a', st.a + 'deg');
      needle.setAttribute('transform', `rotate(${st.a} 100 100)`);
    },
    onComplete: () => { gsap.to(dial, { opacity: 0, duration: .6 }); }
  });
}

/* Compteurs façon instrument de mesure */
export function setupCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const to = Number(el.dataset.count);
    const dec = Number(el.dataset.decimals || 0);
    if (calm) { el.textContent = to.toLocaleString('fr-FR', { minimumFractionDigits: dec, maximumFractionDigits: dec }); return; }
    const o = { v: 0 };
    gsap.to(o, { v: to, duration: 1.8, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onUpdate: () => { el.textContent = o.v.toLocaleString('fr-FR', { minimumFractionDigits: dec, maximumFractionDigits: dec }); } });
  });
}

/* Boutons « copier » */
function setupCopy() {
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const text = btn.dataset.copy;
      const done = msg => { const old = btn.textContent; btn.textContent = msg; setTimeout(() => { btn.textContent = old; }, 1600); };
      try { await navigator.clipboard.writeText(text); done('Copié'); }
      catch (e) {
        const target = document.getElementById(btn.dataset.copyTarget || '');
        if (target) { const r = document.createRange(); r.selectNodeContents(target); const s = getSelection(); s.removeAllRanges(); s.addRange(r); }
        done('Sélectionné');
      }
    });
  });
}

export function init(pageInit) {
  setupCalmToggle();
  setupScroll();
  fillMedia();
  setupHeader();
  setupMenu();
  setupPlumb();
  setupMagnetic();
  setupCopy();
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
  let opened = false;
  const opening = () => { if (opened) return; opened = true; window.__bbOuvert = true; document.dispatchEvent(new CustomEvent('bb:opened')); };
  // une erreur dans un module ne doit pas empêcher l'ouverture : elle est signalée sans bloquer le rideau
  const sur = fn => { try { fn(); } catch (e) { setTimeout(() => { throw e; }); } };
  sur(() => pageInit?.());
  sur(setupReveals);
  sur(setupCounters);
  setupCurtain(opening);
  ScrollTrigger?.refresh();
  window.addEventListener('load', () => ScrollTrigger?.refresh());
  document.fonts?.ready.then(() => ScrollTrigger?.refresh());
}
