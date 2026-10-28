/* Visuels provisoires dessinés en code, dans l'esprit d'une planche d'analyse posturale.
   Remplacés automatiquement par la vraie image dès qu'elle est déclarée dans IMAGES (data.js). */
import { IMAGES } from './data.js?v=20261028-2';

const INK = '#1B1D1F';
const SIG = '#2F5BFF';

function grid(w, h, step, color) {
  let d = '';
  for (let x = step; x < w; x += step) d += `M${x} 0V${h}`;
  for (let y = step; y < h; y += step) d += `M0 ${y}H${w}`;
  return `<path d="${d}" stroke="${color}" stroke-width="1" fill="none" opacity=".09"/>`;
}

function ticks(w, h, color) {
  let d = '';
  for (let i = 0; i <= 20; i++) {
    const y = 24 + i * ((h - 48) / 20);
    d += `M${w - 18} ${y}H${w - (i % 5 === 0 ? 4 : 10)}`;
  }
  return `<path d="${d}" stroke="${color}" stroke-width="1" opacity=".45"/>`;
}

function pts(list) { return list.map(p => p.join(' ')).join(' '); }

const THEMES = {
  dos(w, h, c) {
    let s = '';
    for (let i = 0; i < 24; i++) {
      const t = i / 23;
      const y = h * .12 + t * h * .72;
      const x = w / 2 + Math.sin(t * Math.PI * 1.6) * w * .06 * (1 - t * .3);
      const r = 5 + t * 7;
      s += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${(r * 1.5).toFixed(1)}" ry="${(r * .55).toFixed(1)}" fill="none" stroke="${c}" stroke-width="1.2" opacity=".75"/>`;
    }
    s += `<path d="M${w / 2} ${h * .06}V${h * .92}" stroke="${SIG}" stroke-dasharray="4 5"/>`;
    s += `<path d="M${w * .2} ${h * .66}H${w * .8}" stroke="${SIG}"/><text x="${w * .8 + 6}" y="${h * .66 + 4}" font-family="monospace" font-size="11" fill="${SIG}">L4–L5</text>`;
    return s;
  },
  tete(w, h, c) {
    const cx = w * .5, cy = h * .4, r = w * .2;
    let s = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${c}" stroke-width="1.3"/>`;
    s += `<path d="M${cx - r * .35} ${cy + r * .9}L${cx - r * .3} ${h * .78}M${cx + r * .35} ${cy + r * .9}L${cx + r * .3} ${h * .78}" stroke="${c}" stroke-width="1.3"/>`;
    s += `<path d="M${cx - r * .85} ${cy + r * .45}Q${cx} ${cy + r * 1.25} ${cx + r * .85} ${cy + r * .45}" fill="none" stroke="${c}" stroke-width="1"/>`;
    s += `<circle cx="${cx + r * .78}" cy="${cy + r * .35}" r="7" fill="none" stroke="${SIG}" stroke-width="1.5"/><text x="${cx + r * .78 + 12}" y="${cy + r * .35 + 4}" font-family="monospace" font-size="11" fill="${SIG}">ATM</text>`;
    for (let i = 1; i < 4; i++) s += `<circle cx="${cx}" cy="${cy}" r="${r + i * 22}" fill="none" stroke="${c}" opacity="${.3 - i * .07}"/>`;
    s += `<path d="M${w * .15} ${cy}H${w * .85}" stroke="${SIG}" stroke-dasharray="3 4"/>`;
    return s;
  },
  vertiges(w, h, c) {
    let s = '';
    for (let i = 0; i < 7; i++) {
      const y = h * .25 + i * h * .08;
      const a = (i - 3) * 2.4;
      s += `<line x1="${w * .12}" y1="${y}" x2="${w * .88}" y2="${y}" stroke="${i === 3 ? SIG : c}" stroke-width="${i === 3 ? 1.6 : 1}" opacity="${i === 3 ? 1 : .55}" transform="rotate(${a} ${w / 2} ${y})"/>`;
    }
    s += `<ellipse cx="${w / 2}" cy="${h * .49}" rx="${w * .16}" ry="${w * .07}" fill="none" stroke="${c}" opacity=".5"/>`;
    s += `<text x="${w * .12}" y="${h * .2}" font-family="monospace" font-size="11" fill="${SIG}">HORIZON 0,0°</text>`;
    return s;
  },
  enfant(w, h, c) {
    const P = [[.3, .45], [.42, .5], [.6, .52], [.72, .5]];
    let s = `<polyline points="${pts(P.map(p => [p[0] * w, p[1] * h]))}" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round"/>`;
    s += `<circle cx="${w * .22}" cy="${h * .4}" r="${w * .06}" fill="none" stroke="${c}" stroke-width="2"/>`;
    const limbs = [[[.42, .5], [.4, .62], [.38, .72]], [[.46, .5], [.5, .63], [.52, .72]], [[.68, .51], [.64, .63], [.72, .72]], [[.72, .5], [.78, .62], [.84, .72]]];
    limbs.forEach((l, i) => { s += `<polyline points="${pts(l.map(p => [p[0] * w, p[1] * h]))}" fill="none" stroke="${i % 2 ? SIG : c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`; });
    s += `<path d="M${w * .1} ${h * .73}H${w * .9}" stroke="${c}" opacity=".4"/>`;
    return s;
  },
  sport(w, h, c) {
    const ox = w * .45, oy = h * .7;
    let s = `<line x1="${ox}" y1="${oy}" x2="${ox - w * .04}" y2="${h * .15}" stroke="${c}" stroke-width="2.2" stroke-linecap="round"/>`;
    s += `<line x1="${ox}" y1="${oy}" x2="${ox + w * .34}" y2="${oy + h * .04}" stroke="${c}" stroke-width="2.2" stroke-linecap="round"/>`;
    s += `<path d="M${ox - 4} ${oy - 70}A70 70 0 0 1 ${ox + 70} ${oy + 8}" fill="none" stroke="${SIG}" stroke-width="1.5"/>`;
    s += `<text x="${ox + 52}" y="${oy - 46}" font-family="monospace" font-size="12" fill="${SIG}">92°</text>`;
    s += `<circle cx="${ox}" cy="${oy}" r="6" fill="${SIG}"/>`;
    return s;
  },
  grossesse(w, h, c) {
    let s = `<path d="M${w * .46} ${h * .14}C${w * .4} ${h * .3} ${w * .44} ${h * .38} ${w * .5} ${h * .42}C${w * .72} ${h * .5} ${w * .7} ${h * .72} ${w * .5} ${h * .76}C${w * .46} ${h * .84} ${w * .46} ${h * .9} ${w * .48} ${h * .96}" fill="none" stroke="${c}" stroke-width="1.6"/>`;
    for (let i = 1; i < 4; i++) s += `<path d="M${w * .5} ${h * .44}C${w * (.68 + i * .04)} ${h * .52} ${w * (.66 + i * .04)} ${h * .7} ${w * .5} ${h * .75}" fill="none" stroke="${SIG}" opacity="${.5 - i * .12}"/>`;
    s += `<path d="M${w * .3} ${h * .62}H${w * .8}" stroke="${SIG}" stroke-dasharray="3 4"/><text x="${w * .3}" y="${h * .6}" font-family="monospace" font-size="11" fill="${SIG}">BASSIN</text>`;
    return s;
  },
  bebe(w, h, c) {
    let s = `<circle cx="${w * .42}" cy="${h * .42}" r="${w * .11}" fill="none" stroke="${c}" stroke-width="1.6"/>`;
    s += `<path d="M${w * .5} ${h * .5}C${w * .64} ${h * .52} ${w * .7} ${h * .64} ${w * .62} ${h * .72}C${w * .52} ${h * .8} ${w * .36} ${h * .74} ${w * .36} ${h * .6}" fill="none" stroke="${c}" stroke-width="1.6"/>`;
    s += `<path d="M${w * .7} ${h * .3}C${w * .62} ${h * .36} ${w * .58} ${h * .42} ${w * .56} ${h * .48}" fill="none" stroke="${SIG}" stroke-width="2" stroke-linecap="round"/>`;
    s += `<text x="${w * .12}" y="${h * .9}" font-family="monospace" font-size="11" fill="${SIG}">0–12 MOIS</text>`;
    return s;
  },
  portrait(w, h, c) {
    let s = `<ellipse cx="${w / 2}" cy="${h * .36}" rx="${w * .15}" ry="${w * .19}" fill="none" stroke="${c}" stroke-width="1.4"/>`;
    s += `<path d="M${w * .14} ${h}C${w * .16} ${h * .7} ${w * .32} ${h * .62} ${w / 2} ${h * .62}C${w * .68} ${h * .62} ${w * .84} ${h * .7} ${w * .86} ${h}" fill="none" stroke="${c}" stroke-width="1.4"/>`;
    s += `<path d="M${w / 2} ${h * .05}V${h}" stroke="${SIG}" stroke-dasharray="4 5"/>`;
    [.3, .36, .55].forEach(y => { s += `<path d="M${w * .2} ${h * y}H${w * .8}" stroke="${SIG}" opacity=".6"/>`; });
    return s;
  },
  cabinet(w, h, c) {
    const vx = w * .55, vy = h * .45;
    let s = `<rect x="${w * .38}" y="${h * .32}" width="${w * .34}" height="${h * .26}" fill="none" stroke="${c}" opacity=".7"/>`;
    [[0, 0], [w, 0], [0, h], [w, h]].forEach(([x, y]) => { s += `<line x1="${x}" y1="${y}" x2="${x ? w * .72 : w * .38}" y2="${y ? h * .58 : h * .32}" stroke="${c}" opacity=".5"/>`; });
    s += `<rect x="${w * .44}" y="${h * .5}" width="${w * .22}" height="${h * .05}" fill="none" stroke="${SIG}" stroke-width="1.5"/>`;
    s += `<circle cx="${vx}" cy="${vy}" r="3" fill="${SIG}"/>`;
    return s;
  },
  texture(w, h, c) {
    let s = '';
    for (let i = 0; i < 34; i++) {
      const y0 = (i / 33) * h;
      let d = `M0 ${y0.toFixed(1)}`;
      for (let x = 0; x <= w; x += w / 8) d += ` Q${(x + w / 16).toFixed(1)} ${(y0 + Math.sin(i * .7 + x * .02) * 14).toFixed(1)} ${(x + w / 8).toFixed(1)} ${(y0 + Math.sin(i * .5 + x * .015) * 6).toFixed(1)}`;
      s += `<path d="${d}" fill="none" stroke="${i % 9 === 0 ? SIG : c}" stroke-width="1" opacity="${i % 9 === 0 ? .8 : .35}"/>`;
    }
    return s;
  },
  mains(w, h, c) {
    let s = '';
    [[.36, .48, -18], [.6, .52, 16]].forEach(([x, y, a]) => {
      s += `<g transform="rotate(${a} ${w * x} ${h * y})"><ellipse cx="${w * x}" cy="${h * y}" rx="${w * .1}" ry="${w * .13}" fill="none" stroke="${c}" stroke-width="1.4"/>`;
      for (let f = 0; f < 4; f++) s += `<line x1="${w * x - w * .06 + f * w * .04}" y1="${h * y - w * .12}" x2="${w * x - w * .07 + f * w * .045}" y2="${h * y - w * .24}" stroke="${c}" stroke-width="1.4" stroke-linecap="round"/>`;
      s += '</g>';
    });
    s += `<path d="M${w * .1} ${h * .72}C${w * .35} ${h * .66} ${w * .65} ${h * .66} ${w * .9} ${h * .72}" fill="none" stroke="${SIG}" stroke-width="1.5"/>`;
    return s;
  },
  drap(w, h, c) {
    let s = '';
    for (let i = 0; i < 9; i++) s += `<path d="M0 ${h * (.15 + i * .09)}C${w * .3} ${h * (.1 + i * .09)} ${w * .6} ${h * (.22 + i * .09)} ${w} ${h * (.14 + i * .09)}" fill="none" stroke="${c}" opacity=".35"/>`;
    return s;
  },
  fil(w, h, c) {
    let s = `<line x1="${w / 2}" y1="0" x2="${w / 2}" y2="${h * .66}" stroke="${c}" stroke-width="1.2"/>`;
    s += `<path d="M${w / 2 - 10} ${h * .66}H${w / 2 + 10}L${w / 2} ${h * .66 + 26}Z" fill="${SIG}"/>`;
    s += `<rect x="${w * .2}" y="${h * .82}" width="${w * .6}" height="14" rx="7" fill="none" stroke="${c}"/><rect x="${w / 2 - 12}" y="${h * .82 + 3}" width="24" height="8" rx="4" fill="${SIG}"/>`;
    return s;
  },
  lumiere(w, h, c) {
    let s = '';
    for (let i = 0; i < 3; i++) s += `<polygon points="${w * (.2 + i * .2)},${h * .1} ${w * (.32 + i * .2)},${h * .1} ${w * (.44 + i * .22)},${h * .9} ${w * (.26 + i * .22)},${h * .9}" fill="${c}" opacity=".06"/>`;
    s += `<line x1="0" y1="${h * .9}" x2="${w}" y2="${h * .9}" stroke="${c}" opacity=".4"/>`;
    return s;
  },
  salle(w, h, c) {
    let s = `<rect x="${w * .3}" y="${h * .2}" width="${w * .4}" height="${h * .24}" fill="none" stroke="${SIG}" stroke-width="1.5"/>`;
    for (let r = 0; r < 4; r++) for (let k = 0; k < 6; k++) s += `<rect x="${w * (.14 + k * .13 - r * .02)}" y="${h * (.58 + r * .09)}" width="${w * .08}" height="${h * .03}" fill="none" stroke="${c}" opacity=".5"/>`;
    return s;
  },
  grille(w, h, c) {
    return `<circle cx="${w / 2}" cy="${h / 2}" r="${Math.min(w, h) * .2}" fill="none" stroke="${SIG}"/><path d="M${w / 2} 0V${h}M0 ${h / 2}H${w}" stroke="${c}" opacity=".3"/>`;
  }
};

export function placeholderSVG(theme, file, dark = false, ratio = 1.25) {
  const w = 400, h = Math.round(400 * ratio);
  const c = dark ? '#F2F1EC' : INK;
  const fn = THEMES[theme] || THEMES.grille;
  return `<svg class="ph" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">${grid(w, h, 25, c)}${ticks(w, h, c)}${fn(w, h, c)}</svg>`;
}

/* Remplit chaque .media[data-file] : vraie image si disponible, sinon visuel provisoire. */
export function fillMedia(root = document) {
  root.querySelectorAll('.media[data-file]').forEach(el => {
    if (el.dataset.filled) return;
    el.dataset.filled = '1';
    const file = el.dataset.file;
    const img = IMAGES[file];
    const target = el.querySelector('.parallax-inner') || el;
    if (img) {
      const base = (el.dataset.base || (document.documentElement.dataset.root || '') + 'assets/img/') + file.replace(/\.webp$/, '');
      const sizes = img.sizes || [img.w];
      const srcset = sizes.map(s => `${base}-${s}.webp ${s}w`).join(', ');
      el.classList.add('has-img');
      target.insertAdjacentHTML('beforeend', `<img src="${base}-${sizes[sizes.length - 1]}.webp" srcset="${srcset}" sizes="${el.dataset.sizes || '(min-width: 900px) 50vw, 100vw'}" width="${img.w}" height="${img.h}" alt="${img.alt || ''}" loading="lazy" decoding="async">`);
    } else {
      const r = el.getBoundingClientRect();
      const ratio = r.width > 0 && r.height > 0 ? r.height / r.width : 1.25;
      const dark = !!el.closest('.dark');
      target.insertAdjacentHTML('beforeend', placeholderSVG(el.dataset.ph || 'grille', file, dark, ratio));
      if (!el.hasAttribute('data-notag')) el.insertAdjacentHTML('beforeend', `<span class="ph-tag">${el.dataset.source === 'grok' ? 'Grok' : el.dataset.source === 'client' ? 'À fournir' : 'Site'} · ${file}</span>`);
      if (el.getAttribute('role') !== 'img') { el.setAttribute('role', 'img'); el.setAttribute('aria-label', el.dataset.alt || 'Visuel provisoire'); }
    }
  });
}
