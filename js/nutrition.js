import { ING, CATEGORIES, VITALITY, FODMAP_GROUPS } from './data/ingredients.js';
import { RECIPES } from './data/recipes.js';
import { round, plural, fmtQty, clamp } from './util.js';

export const RECIPE_BY_ID = Object.fromEntries(RECIPES.map((r) => [r.id, r]));
export { RECIPES, ING, VITALITY, FODMAP_GROUPS };

export const SLOTS = [
  { id: 'breakfast', label: 'Breakfast', type: 'breakfast' },
  { id: 'snack1', label: 'Morning snack', type: 'snack' },
  { id: 'lunch', label: 'Lunch', type: 'main' },
  { id: 'snack2', label: 'Afternoon snack', type: 'snack' },
  { id: 'dinner', label: 'Dinner', type: 'main' },
  { id: 'snack3', label: 'Evening snack', type: 'snack' },
];
export const SLOT_BY_ID = Object.fromEntries(SLOTS.map((s) => [s.id, s]));

const LVL = { low: 0, mod: 1, high: 2 };
export const FOD_LABEL = { low: 'Low FODMAP', mod: 'Moderate FODMAP', high: 'High FODMAP' };

export function lineGrams([key, qty, unit]) {
  const ing = ING[key];
  if (!ing) throw new Error(`Unknown ingredient: ${key}`);
  const per = ing.u[unit];
  if (per == null) throw new Error(`Unit "${unit}" not defined for ${key}`);
  return qty * per;
}

const cache = new Map();
/** Per-serving nutrition, FODMAP flags and vitality highlights for a recipe. */
export function analyze(r) {
  if (cache.has(r.id)) return cache.get(r.id);
  const tot = { kcal: 0, p: 0, c: 0, f: 0, fib: 0 };
  const flags = [];
  const vit = new Set();
  const groups = new Set();
  let level = 'low';
  for (const line of r.ing) {
    const ing = ING[line[0]];
    const g = lineGrams(line);
    for (const k in tot) tot[k] += (ing[k] * g) / 100;
    const per = g / r.serves;
    if (ing.fod && per > ing.fod.g) {
      flags.push({ key: ing.key, name: ing.name, lvl: ing.fod.lvl, groups: ing.fod.groups, note: ing.fod.note, grams: per });
      ing.fod.groups.forEach((x) => groups.add(x));
      if (LVL[ing.fod.lvl] > LVL[level]) level = ing.fod.lvl;
    }
    if (ing.vit && per >= (ing.vmin ?? 10)) ing.vit.forEach((v) => vit.add(v));
  }
  const per = {};
  for (const k in tot) per[k] = tot[k] / r.serves;
  const isSnack = r.meal.length === 1 && r.meal[0] === 'snack';
  const a = {
    per,
    kcal: Math.round(per.kcal), p: Math.round(per.p), c: Math.round(per.c), f: Math.round(per.f), fib: Math.round(per.fib),
    level, flags, fodGroups: [...groups], vit: [...vit],
    highProtein: per.p >= (isSnack ? 20 : 38),
    quick: r.mins <= 15,
    vitality: vit.size >= 2,
    lowFodmap: level === 'low',
  };
  cache.set(r.id, a);
  return a;
}

export const recipeFits = (r, type) => r.meal.includes(type);
/** Ingredients in this recipe that the user has marked as foods they don't eat. */
export const excludedIn = (r, excluded = []) => (excluded.length ? r.ing.filter(([k]) => excluded.includes(k)).map(([k]) => ING[k]?.name || k) : []);

// ------------------------------------------------------------------
// Targets
// ------------------------------------------------------------------
export const ACTIVITY = {
  light: { label: 'Light', desc: 'Desk job, 2–3 workouts a week', f: 1.375 },
  moderate: { label: 'Moderate', desc: '4–5 workouts a week', f: 1.55 },
  active: { label: 'Very active', desc: '6+ sessions a week or an active job', f: 1.725 },
};
export const GOALS = {
  lean_bulk: { label: 'Build muscle (lean bulk)', kcal: 300, pPerLb: 0.9 },
  recomp: { label: 'Recomp (maintain weight)', kcal: 0, pPerLb: 0.9 },
  cut: { label: 'Lose fat, keep muscle', kcal: -450, pPerLb: 1.0 },
};

export function computeTargets(profile) {
  const lb = Number(profile.weightLb) || 185;
  const kg = lb * 0.4536;
  const cm = (Number(profile.heightIn) || 70) * 2.54;
  const age = Number(profile.age) || 25;
  const bmr = 10 * kg + 6.25 * cm - 5 * age + (profile.sex === 'female' ? -161 : 5);
  const act = ACTIVITY[profile.activity] || ACTIVITY.moderate;
  const goal = GOALS[profile.goal] || GOALS.lean_bulk;
  const tdee = bmr * act.f;
  const o = profile.overrides || {};
  const kcal = Number(o.kcal) || round(tdee + goal.kcal, 50);
  const protein = Number(o.protein) || round(lb * goal.pPerLb, 5);
  const fat = round((kcal * 0.27) / 9, 5);
  const carbs = Math.max(0, round((kcal - protein * 4 - fat * 9) / 4, 5));
  const fiber = clamp(round((kcal / 1000) * 12), 30, 40);
  const water = clamp(Math.round((lb * 0.5) / 8), 8, 16);
  return { kcal, protein, fat, carbs, fiber, water, bmr: Math.round(bmr), tdee: Math.round(tdee) };
}

// ------------------------------------------------------------------
// Plan helpers
// ------------------------------------------------------------------
export function itemTotals(item) {
  const r = RECIPE_BY_ID[item?.id];
  if (!r) return { kcal: 0, p: 0, c: 0, f: 0, fib: 0 };
  const a = analyze(r);
  const s = item.servings || 1;
  return { kcal: a.per.kcal * s, p: a.per.p * s, c: a.per.c * s, f: a.per.f * s, fib: a.per.fib * s };
}
export function dayTotals(day = {}) {
  const t = { kcal: 0, p: 0, c: 0, f: 0, fib: 0 };
  for (const s of SLOTS) {
    if (!day[s.id]) continue;
    const it = itemTotals(day[s.id]);
    for (const k in t) t[k] += it[k];
  }
  return t;
}

function weightedPick(pool, n, weight) {
  const items = pool.map((r) => ({ r, w: weight(r) * (0.5 + Math.random()) }));
  items.sort((a, b) => b.w - a.w);
  return items.slice(0, n).map((x) => x.r);
}

/**
 * Generate a week. Picks a small set of recipes per meal type (so meal prep stays simple),
 * rotates them across the days, then scales servings toward the calorie/protein targets.
 */
export function generateWeek({ targets, lowFodmap = true, counts = { breakfast: 2, main: 3, snack: 3 }, avoid = new Set(), favorites = new Set() }) {
  const ok = (r) => !avoid.has(r.id) && (!lowFodmap || analyze(r).lowFodmap);
  const w = (r, type) => {
    const a = analyze(r);
    let x = 1;
    if (favorites.has(r.id)) x *= 3;
    if (type === 'main' && r.prep) x *= 2;
    if (type === 'breakfast' && (r.prep || a.quick)) x *= 1.6;
    if (a.highProtein) x *= 1.4;
    if (a.vitality) x *= 1.2;
    return x;
  };
  const pool = (type) => RECIPES.filter((r) => r.meal.includes(type) && ok(r) && !(type === 'main' && r.serves === 1 && r.meal.includes('breakfast')));
  const b = weightedPick(pool('breakfast').filter((r) => !r.meal.includes('snack') || r.tags.includes('smoothie')), counts.breakfast, (r) => w(r, 'breakfast'));
  const m = weightedPick(pool('main').filter((r) => !b.includes(r)), counts.main, (r) => w(r, 'main'));
  // Snacks: one protein-focused, the rest energy-focused (carbs + healthy fats) so protein doesn't balloon.
  const snackPool = pool('snack').filter((r) => !b.includes(r) && !r.meal.includes('breakfast') && r.id !== 'vanilla-protein-shake');
  const sw = (r) => w(r, 'snack') / (analyze(r).highProtein ? 1.4 : 1);
  const s = [
    ...weightedPick(snackPool.filter((r) => pRatio(r.id) >= 0.3), Math.min(1, counts.snack), sw),
    ...weightedPick(snackPool.filter((r) => pRatio(r.id) < 0.3), Math.max(0, counts.snack - 1), sw),
  ];

  const days = {};
  for (let d = 0; d < 7; d++) {
    const day = {};
    if (b.length) day.breakfast = { id: b[d % b.length].id, servings: 1 };
    if (m.length) {
      day.lunch = { id: m[d % m.length].id, servings: 1 };
      day.dinner = { id: m[(d + 1) % m.length].id, servings: 1 };
    }
    if (s.length) {
      day.snack1 = { id: s[d % s.length].id, servings: 1 };
      if (s.length > 1) day.snack2 = { id: s[(d + 1) % s.length].id, servings: 1 };
    }
    fitDay(day, targets, avoid);
    days[d] = day;
  }
  return { days, picks: [...b, ...m, ...s].map((r) => r.id) };
}

/**
 * Nudge servings so the day lands near the calorie target without blowing far past protein:
 * each step bumps whichever item best matches what the day still needs (protein vs. energy).
 */
const MAX_SERV = { breakfast: 1.5, snack1: 1.5, lunch: 2, snack2: 1.5, dinner: 2, snack3: 2 };
const ENERGY_SNACKS = ['pb-banana-rice-cakes', 'vitality-trail-mix', 'pre-workout-toast', 'choc-pb-protein-bites'];
const pRatio = (id) => { const a = analyze(RECIPE_BY_ID[id]); return (a.per.p * 4) / a.per.kcal; };

export function fitDay(day, targets, avoid = new Set()) {
  for (let i = 0; i < 40; i++) {
    const t = dayTotals(day);
    if (t.kcal >= targets.kcal * 0.95) break;
    const needP = t.p < targets.protein;
    let best = null, bestScore = -Infinity;
    for (const s of SLOTS) {
      const it = day[s.id];
      if (!it || it.servings >= MAX_SERV[s.id]) continue;
      const score = (needP ? pRatio(it.id) : -pRatio(it.id)) - (it.servings - 1) * 0.6;
      if (score > bestScore) { bestScore = score; best = it; }
    }
    if (!day.snack3) {
      const used = new Set(SLOTS.map((s) => day[s.id]?.id));
      const id = needP ? 'vanilla-protein-shake' : ENERGY_SNACKS.find((x) => !used.has(x) && !avoid.has(x)) || 'vanilla-protein-shake';
      const score = (needP ? pRatio(id) : -pRatio(id)) + 0.05;
      if (!best || score > bestScore) { day.snack3 = { id, servings: 1 }; continue; }
    }
    if (!best) break;
    best.servings += 0.25;
  }
  return day;
}

// ------------------------------------------------------------------
// Grocery list
// ------------------------------------------------------------------
const UNIT_LABEL = { lb: 'lb', oz: 'oz', g: 'g', cup: 'cup', tbsp: 'tbsp', tsp: 'tsp', can: 'can', slice: 'slice', scoop: 'scoop', clove: 'clove', inch: 'inch', block: 'block' };
const CEIL_STEP = { lb: 0.25, oz: 1, g: 10, cup: 0.25, tbsp: 0.5, tsp: 0.5 };

export function formatBuy(ing, grams) {
  const unit = ing.buy;
  const per = ing.u[unit] || 1;
  const raw = grams / per;
  const step = CEIL_STEP[unit] ?? 1;
  const amt = Math.max(step, Math.ceil(raw / step - 1e-6) * step);
  let text;
  if (unit === 'each') {
    text = ing.unitName ? `${amt} ${pluralUnit(ing.unitName, amt)}` : `${amt}`;
  } else if (['lb', 'oz', 'g', 'tbsp', 'tsp'].includes(unit)) {
    text = `${fmtQty(amt)} ${UNIT_LABEL[unit]}`;
  } else if (unit === 'inch') {
    text = `${amt}" knob`;
  } else {
    text = `${fmtQty(amt)} ${plural(UNIT_LABEL[unit] || unit, amt > 1 ? 2 : 1)}`;
  }
  let hint = '';
  if (ing.pack && raw >= ing.pack[0] * 0.6) {
    const n = Math.max(0.5, Math.ceil((raw / ing.pack[0]) * 2) / 2);
    hint = `≈ ${fmtQty(n)} ${n > 1 ? pluralUnit(ing.pack[1], 2) : ing.pack[1]}`;
  }
  return { amount: amt, text, hint };
}
function pluralUnit(name, n) {
  if (n <= 1 || name.startsWith('dozen')) return name;
  const [first, ...rest] = name.split(' ');
  return [plural(first, 2), ...rest].join(' ');
}

/** Aggregate every planned serving of the week into a categorized shopping list. */
export function buildGrocery(week) {
  const need = {};
  const recipeCounts = {};
  for (const d of Object.values(week?.days || {})) {
    for (const s of SLOTS) {
      const it = d[s.id];
      const r = it && RECIPE_BY_ID[it.id];
      if (!r) continue;
      const factor = (it.servings || 1) / r.serves;
      recipeCounts[r.id] = (recipeCounts[r.id] || 0) + (it.servings || 1);
      for (const line of r.ing) {
        const key = line[0];
        need[key] ??= { grams: 0, recipes: new Set() };
        need[key].grams += lineGrams(line) * factor;
        need[key].recipes.add(r.name);
      }
    }
  }
  const groups = CATEGORIES.map(([cat, label]) => ({ cat, label, items: [] }));
  const byCat = Object.fromEntries(groups.map((g) => [g.cat, g]));
  for (const [key, v] of Object.entries(need)) {
    const ing = ING[key];
    const b = formatBuy(ing, v.grams);
    byCat[ing.cat].items.push({ key, name: ing.name, ...b, recipes: [...v.recipes], fod: ing.fod });
  }
  groups.forEach((g) => g.items.sort((a, b) => a.name.localeCompare(b.name)));
  return { groups: groups.filter((g) => g.items.length), recipeCounts };
}

/** Recipes to cook for the week, with batch multipliers. */
export function prepList(week) {
  const { recipeCounts } = buildGrocery(week);
  return Object.entries(recipeCounts)
    .map(([id, servings]) => {
      const r = RECIPE_BY_ID[id];
      return { r, servings, batches: servings / r.serves };
    })
    .sort((a, b) => (b.r.prep - a.r.prep) || (b.servings - a.servings));
}

/** Scaled ingredient lines for display. */
export function scaledIngredients(r, servings) {
  const f = servings / r.serves;
  return r.ing.map((line) => {
    const [key, qty, unit, note] = line;
    const ing = ING[key];
    const q = qty * f;
    const unitText = unit === 'each' ? (ing.unitName ? ' ' + pluralUnit(ing.unitName, q > 1 ? 2 : 1) : '') : unit === 'g' ? ' g' : ' ' + (q > 1 && !['oz', 'lb', 'tbsp', 'tsp'].includes(unit) ? plural(unit, 2) : unit);
    const per = lineGrams(line) / r.serves;
    const flagged = ing.fod && per > ing.fod.g ? ing.fod.lvl : null;
    return { key, name: ing.name, qty: fmtQty(q) + unitText, note, flagged };
  });
}
