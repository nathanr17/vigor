// Date + formatting helpers. Dates are local ISO strings: YYYY-MM-DD. Weeks start Monday.

const pad = (n) => String(n).padStart(2, '0');
export const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const parseISO = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
export const todayISO = () => toISO(new Date());
export const addDays = (iso, n) => { const d = parseISO(iso); d.setDate(d.getDate() + n); return toISO(d); };
export const weekStart = (iso = todayISO()) => { const d = parseISO(iso); const dow = (d.getDay() + 6) % 7; d.setDate(d.getDate() - dow); return toISO(d); };
export const weekDays = (wk) => Array.from({ length: 7 }, (_, i) => addDays(wk, i));
export const dayIndex = (iso) => (parseISO(iso).getDay() + 6) % 7;
export const daysBetween = (a, b) => Math.round((parseISO(b) - parseISO(a)) / 86400000);

const DOW = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DOW_LONG = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const dowShort = (iso) => DOW[dayIndex(iso)];
export const dowLong = (iso) => DOW_LONG[dayIndex(iso)];
export const dowLetter = (iso) => DOW[dayIndex(iso)][0];
export const fmtMonthDay = (iso) => { const d = parseISO(iso); return `${MON[d.getMonth()]} ${d.getDate()}`; };
export const fmtDayLabel = (iso) => {
  const t = todayISO();
  if (iso === t) return 'Today';
  if (iso === addDays(t, -1)) return 'Yesterday';
  if (iso === addDays(t, 1)) return 'Tomorrow';
  return `${dowShort(iso)}, ${fmtMonthDay(iso)}`;
};
export const fmtWeekRange = (wk) => {
  const end = addDays(wk, 6);
  const a = parseISO(wk), b = parseISO(end);
  return a.getMonth() === b.getMonth() ? `${MON[a.getMonth()]} ${a.getDate()}–${b.getDate()}` : `${fmtMonthDay(wk)} – ${fmtMonthDay(end)}`;
};

export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
export const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
export const round = (v, step = 1) => Math.round(v / step) * step;
export const fmtNum = (n, dp = 0) => (n == null || Number.isNaN(n) ? '–' : Number(n).toLocaleString('en-US', { maximumFractionDigits: dp, minimumFractionDigits: 0 }));
export const fmtQty = (q) => {
  // Kitchen-friendly fractions
  const whole = Math.floor(q + 1e-9);
  const frac = q - whole;
  const fracs = [[0, ''], [0.25, '¼'], [0.33, '⅓'], [0.5, '½'], [0.67, '⅔'], [0.75, '¾'], [1, '']];
  let best = fracs[0];
  for (const f of fracs) if (Math.abs(frac - f[0]) < Math.abs(frac - best[0])) best = f;
  const w = best[0] === 1 ? whole + 1 : whole;
  if (Math.abs(frac - best[0]) > 0.09 && q < 10) return String(Math.round(q * 10) / 10);
  if (!best[1]) return String(w);
  return w ? `${w}${best[1]}` : best[1];
};
export const fmtDuration = (sec) => {
  if (!sec && sec !== 0) return '–';
  sec = Math.round(sec);
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
  return h ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
};
export const fmtPace = (sec, miles) => (miles > 0 && sec > 0 ? `${fmtDuration(sec / miles)} /mi` : '–');
export const greeting = () => { const h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'; };
export const plural = (word, n) => (n === 1 ? word : /(s|x|ch|sh)$/.test(word) ? word + 'es' : word + 's');
