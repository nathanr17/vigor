// Derived numbers for the dashboard, logs and insights.
import { S } from './store.js';
import { computeTargets, analyze, RECIPE_BY_ID, RECIPES, ING, FODMAP_GROUPS, excludedIn } from './nutrition.js';
import { addDays, todayISO, weekStart, weekDays } from './util.js';
import { CARDIO_BY_ID } from './data/workouts.js';

export const targets = () => computeTargets(S().profile);

export const mealsOn = (date) => S().meals.filter((m) => m.date === date);

export function intakeOn(date) {
  const t = { kcal: 0, p: 0, c: 0, f: 0, fib: 0 };
  for (const m of mealsOn(date)) for (const k in t) t[k] += Number(m[k]) || 0;
  return t;
}

export function rangeDates(days, end = todayISO()) {
  return Array.from({ length: days }, (_, i) => addDays(end, i - days + 1));
}

export const workoutsOn = (date) => S().workouts.filter((w) => w.date === date);
export const cardioOn = (date) => S().cardio.filter((c) => c.date === date);
export const isRun = (c) => CARDIO_BY_ID[c.type]?.run;

export function weekSummary(wk = weekStart()) {
  const days = new Set(weekDays(wk));
  const s = S();
  const lifts = s.workouts.filter((w) => days.has(w.date) && w.templateId !== 'pelvic');
  const pelvic = s.workouts.filter((w) => days.has(w.date) && w.templateId === 'pelvic').length
    + Object.entries(s.habits).filter(([d, h]) => days.has(d) && h.kegels).length;
  const cardio = s.cardio.filter((c) => days.has(c.date));
  const runs = cardio.filter(isRun).length;
  const miles = cardio.filter(isRun).reduce((a, c) => a + (Number(c.miles) || 0), 0);
  const cardioMins = cardio.reduce((a, c) => a + (Number(c.sec) || 0) / 60, 0);
  const t = targets();
  const loggedDays = [...days].filter((d) => mealsOn(d).length);
  const proteinHits = loggedDays.filter((d) => intakeOn(d).p >= t.protein * 0.95).length;
  const avgKcal = loggedDays.length ? loggedDays.reduce((a, d) => a + intakeOn(d).kcal, 0) / loggedDays.length : 0;
  const avgP = loggedDays.length ? loggedDays.reduce((a, d) => a + intakeOn(d).p, 0) / loggedDays.length : 0;
  const volume = lifts.reduce((a, w) => a + workoutVolume(w), 0);
  return { lifts: lifts.length, pelvic, runs, miles, cardioMins, cardioCount: cardio.length, proteinHits, loggedDays: loggedDays.length, avgKcal, avgP, volume };
}

export function workoutVolume(w) {
  let v = 0;
  for (const ex of w.exercises || []) for (const st of ex.sets || []) if (st.done) v += (Number(st.w) || 0) * (Number(st.r) || 0);
  return v;
}

/** Sets from the most recent completed workout that included this exercise. */
export function lastPerformance(exId, beforeTs = Infinity) {
  const ws = S().workouts.filter((w) => (w.startedAt || 0) < beforeTs).sort((a, b) => (b.startedAt || 0) - (a.startedAt || 0));
  for (const w of ws) {
    const ex = w.exercises?.find((e) => e.exId === exId);
    if (ex && ex.sets.some((s) => s.done)) return { date: w.date, sets: ex.sets.filter((s) => s.done) };
  }
  return null;
}

export function bestSet(sets) {
  // Estimated 1RM (Epley) to compare sets
  let best = null;
  for (const s of sets || []) {
    const w = Number(s.w) || 0, r = Number(s.r) || 0;
    if (!r) continue;
    const e1rm = w * (1 + r / 30);
    if (!best || e1rm > best.e1rm) best = { w, r, e1rm };
  }
  return best;
}

export function weeklySeries(weeks, fn) {
  const wk0 = weekStart();
  return Array.from({ length: weeks }, (_, i) => {
    const wk = addDays(wk0, (i - weeks + 1) * 7);
    return { wk, value: fn(wk) };
  });
}

// ---------------------------------------------------------------- gut insights
export const SYMPTOMS = ['Bloating', 'Gas', 'Cramping', 'Pain', 'Urgency', 'Loose stool', 'Constipation', 'Reflux', 'Nausea', 'Fatigue'];
export const REACTIONS = {
  good: { emoji: '😊', label: 'Felt good' },
  meh: { emoji: '😐', label: 'Some discomfort' },
  bad: { emoji: '😣', label: 'Bad reaction' },
};

export function gutInsights() {
  const meals = S().meals.filter((m) => m.reaction?.rating);
  const byFood = {};
  const byGroup = {};
  const byIng = {};
  let total = 0, bad = 0;
  for (const m of meals) {
    const isBad = m.reaction.rating === 'bad';
    const isMeh = m.reaction.rating === 'meh';
    total++; if (isBad) bad++;
    const key = m.recipeId || 'q:' + m.name.toLowerCase();
    const f = (byFood[key] ??= { key, name: m.name, recipeId: m.recipeId, good: 0, meh: 0, bad: 0, n: 0 });
    f.n++; f[m.reaction.rating]++;
    const r = m.recipeId && RECIPE_BY_ID[m.recipeId];
    if (r) {
      const a = analyze(r);
      const groups = a.fodGroups.length ? a.fodGroups : ['none'];
      for (const g of groups) {
        const x = (byGroup[g] ??= { group: g, n: 0, bad: 0, meh: 0 });
        x.n++; if (isBad) x.bad++; if (isMeh) x.meh++;
      }
      for (const [key2] of r.ing) {
        const ing = ING[key2];
        if (ing.cat === 'staple' && !ing.fod) continue;
        const flagged = ing.fod && r.ing.some((l) => l[0] === key2 && (l[1] * (ing.u[l[2]] || 1)) / r.serves > ing.fod.g);
        const x = (byIng[key2] ??= { key: key2, name: ing.name, n: 0, bad: 0, meh: 0, fod: null });
        if (flagged) x.fod = ing.fod.lvl;
        x.n++; if (isBad) x.bad++; if (isMeh) x.meh++;
      }
    }
  }
  const baseline = total ? bad / total : 0;
  const foods = Object.values(byFood);
  const triggers = foods.filter((f) => f.bad + f.meh * 0.5 > 0).sort((a, b) => (b.bad + b.meh * 0.5) / b.n - (a.bad + a.meh * 0.5) / a.n || b.n - a.n);
  const safe = foods.filter((f) => f.good >= 1 && f.bad === 0).sort((a, b) => b.good - a.good);
  const groups = Object.values(byGroup).map((g) => ({ ...g, label: g.group === 'none' ? 'Low-FODMAP meals' : FODMAP_GROUPS[g.group], rate: g.n ? (g.bad + g.meh * 0.5) / g.n : 0 })).sort((a, b) => b.rate - a.rate);
  const ings = Object.values(byIng).filter((x) => x.bad >= 2 || (x.bad + x.meh) >= 3).map((x) => ({ ...x, rate: (x.bad + x.meh * 0.5) / x.n }))
    .filter((x) => x.rate > baseline * 1.25)
    .sort((a, b) => (!!b.fod - !!a.fod) || b.rate - a.rate || b.n - a.n).slice(0, 8);
  return { total, bad, baseline, triggers: triggers.slice(0, 8), safe: safe.slice(0, 8), groups, ings };
}

export function recipeReactions(recipeId) {
  const out = { good: 0, meh: 0, bad: 0, notes: [] };
  for (const m of S().meals) {
    if (m.recipeId !== recipeId || !m.reaction?.rating) continue;
    out[m.reaction.rating]++;
    if (m.reaction.notes) out.notes.push({ date: m.date, text: m.reaction.notes, rating: m.reaction.rating });
  }
  return out;
}

/** Recipes to keep out of auto-generated plans: more bad than good reactions. */
export function avoidSet() {
  const r = {};
  for (const m of S().meals) {
    if (!m.recipeId || !m.reaction?.rating) continue;
    r[m.recipeId] ??= 0;
    r[m.recipeId] += m.reaction.rating === 'bad' ? 1 : m.reaction.rating === 'good' ? -1 : 0;
  }
  const out = new Set(Object.entries(r).filter(([, v]) => v > 0).map(([k]) => k));
  const ex = S().settings.excluded || [];
  for (const rec of RECIPES) if (excludedIn(rec, ex).length) out.add(rec.id);
  return out;
}

/** True if the recipe contains a food the user has excluded. */
export function isExcluded(r) {
  return excludedIn(r, S().settings.excluded || []).length > 0;
}

export function streak() {
  // consecutive days (ending today or yesterday) with anything logged
  const s = S();
  const has = (d) => s.meals.some((m) => m.date === d) || s.workouts.some((w) => w.date === d) || s.cardio.some((c) => c.date === d) || s.checkins[d];
  let d = todayISO();
  if (!has(d)) d = addDays(d, -1);
  let n = 0;
  while (has(d) && n < 999) { n++; d = addDays(d, -1); }
  return n;
}
