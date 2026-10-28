/* Page Réflexes archaïques : figures au trait, déroulé qui se dessine, événements triés. */
import { init, calm, protractorReveal } from './core.js?v=20261028-2';
import { createFigure } from './figures.js?v=20261028-2';
import { EVENEMENTS } from './data.js?v=20261028-2';

const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;

function figures() {
  document.querySelectorAll('canvas[data-figure]').forEach(c => createFigure(c, c.dataset.figure, { calm, speed: Number(c.dataset.speed || .5) }));
}

function deroule() {
  const list = document.querySelector('.deroule');
  if (!list || calm) return;
  const line = list.querySelector('.frise__line');
  const items = [...list.querySelectorAll('li')];
  gsap.fromTo(line, { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: list, start: 'top 70%', end: 'bottom 55%', scrub: true,
    onUpdate: s => items.forEach((it, i) => it.classList.toggle('is-on', s.progress >= i / Math.max(1, items.length - 1) - .02)) } });
}

function events() {
  const host = document.querySelector('.events');
  if (!host) return;
  const now = Date.now();
  const sorted = [...EVENEMENTS].map(e => ({ ...e, t: new Date(e.date).getTime() }));
  const upcoming = sorted.filter(e => e.t >= now).sort((a, b) => a.t - b.t);
  const past = sorted.filter(e => e.t < now).sort((a, b) => b.t - a.t);
  const fmt = t => new Date(t).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Paris' });
  const row = (e, next) => `<article class="event">
      <span class="event__date">${fmt(e.t)} · ${new Date(e.t).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris' }).replace(':', ' h ')}</span>
      <div><h3>${e.titre}</h3><p class="mono" style="margin-top:8px;color:rgba(242,241,236,.6)">${e.lieu} · ${e.tarif} · ${e.organisateur}</p></div>
      <span class="event__badge${next ? ' is-next' : ''}">${next ? 'À venir' : 'Passé'}</span>
    </article>`;
  host.innerHTML = (upcoming.length ? upcoming.map(e => row(e, true)).join('') : `<p class="mono" style="padding:24px 0;color:rgba(242,241,236,.6)">Aucune date à venir pour le moment · <span class="todo">prochaines dates à compléter</span></p>`) + past.map(e => row(e, false)).join('');
}

function faq() {
  document.querySelectorAll('.faq-item').forEach(item => item.addEventListener('toggle', () => {
    if (!item.open || calm) return;
    gsap.from(item.querySelector('.faq-item__body'), { height: 0, opacity: 0, duration: .6, ease: 'expo.out', clearProps: 'height,opacity' });
  }));
}

function heroIn() {
  if (calm) return;
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } });
  const title = document.querySelector('.page-hero h1');
  if (window.SplitText && title) {
    const split = window.SplitText.create(title, { type: 'lines, words', mask: 'lines' });
    tl.from(split.words, { yPercent: 115, duration: 1.2, stagger: .07 }, 0);
  }
  tl.from('.page-hero .lead, .page-hero .hero__cta, .crumbs', { opacity: 0, y: 16, duration: .9, stagger: .08 }, .25)
    .from('.page-hero .figure-stage', { opacity: 0, scale: .97, duration: 1.2 }, .2);
  document.addEventListener('bb:opened', () => tl.play(), { once: true });
}

init(() => {
  heroIn();
  figures();
  deroule();
  events();
  faq();
  document.querySelectorAll('[data-protractor]').forEach(el => protractorReveal(el));
});
