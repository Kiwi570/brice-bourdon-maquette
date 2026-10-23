/* Calcul « ouvert maintenant » à l'heure de Paris, à partir des horaires de data.js. */
export const DAYS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

export function nowParis(date = new Date()) {
  const parts = new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris', weekday: 'long', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(date);
  const get = t => parts.find(p => p.type === t)?.value || '';
  const day = DAYS.indexOf(get('weekday').toLowerCase());
  const minutes = Number(get('hour')) % 24 * 60 + Number(get('minute'));
  return { day: day < 0 ? date.getDay() : day, minutes };
}

const toMin = s => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };
export const label = s => s.replace(/^0/, '').replace(':', ' h ').replace(/ h 00$/, ' h');

export function openState(horaires, now = nowParis()) {
  if (!horaires) return { open: false, label: 'Horaires à compléter' };
  const today = horaires[now.day] || [];
  for (const [a, b] of today) {
    if (now.minutes >= toMin(a) && now.minutes < toMin(b)) return { open: true, label: `Ouvert · jusqu’à ${label(b)}` };
  }
  for (const [a] of today) if (now.minutes < toMin(a)) return { open: false, label: `Fermé · ouvre à ${label(a)}` };
  for (let i = 1; i <= 7; i++) {
    const d = (now.day + i) % 7;
    if (horaires[d]?.length) return { open: false, label: `Fermé · ouvre ${i === 1 ? 'demain' : DAYS[d]} à ${label(horaires[d][0][0])}` };
  }
  return { open: false, label: 'Fermé' };
}
