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

const pickWeight = (r, type, favorites) => {
  const a = analyze(r);
  let x = 1;
  if (favorites.has(r.id)) x *= 3;
  if (type === 'main' && r.prep) x *= 2;
  if (type === 'breakfast' && (r.prep || a.quick)) x *= 1.6;
  if (a.highProtein && type !== 'snack') x *= 1.4;
  if (a.vitality) x *= 1.2;
  return x;
};

/** Recipes the week-setup screen offers for a meal type. */
export function poolFor(type, { lowFodmap = false, avoid = new Set() } = {}) {
  return RECIPES.filter((r) => {
    if (!r.meal.includes(type) || avoid.has(r.id)) return false;
    if (lowFodmap && !analyze(r).lowFodmap) return false;
    if (type === 'breakfast' && r.meal.includes('snack') && !r.tags.includes('smoothie') && r.serves === 1 && analyze(r).kcal < 350) return false;
    if (type === 'snack' && r.id === 'vanilla-protein-shake') return false;
    return true;
  });
}

/** "Choose for me": fill up to n picks for a meal type, keeping any already chosen. */
export function suggestRecipes(type, n, { lowFodmap = true, avoid = new Set(), favorites = new Set(), keep = [] } = {}) {
  const chosen = keep.filter((id) => RECIPE_BY_ID[id]);
  const pool = poolFor(type, { lowFodmap, avoid }).filter((r) => !chosen.includes(r.id) && !(type === 'snack' && r.meal.includes('breakfast')));
  if (type === 'snack') {
    // one protein-focused snack, the rest energy-focused so protein doesn't balloon
    const haveProtein = chosen.some((id) => pRatio(id) >= 0.3);
    const out = [...chosen];
    if (!haveProtein && out.length < n) out.push(...weightedPick(pool.filter((r) => pRatio(r.id) >= 0.3), 1, (r) => pickWeight(r, type, favorites)).map((r) => r.id));
    const rest = pool.filter((r) => !out.includes(r.id) && pRatio(r.id) < 0.3);
    out.push(...weightedPick(rest, Math.max(0, n - out.length), (r) => pickWeight(r, type, favorites)).map((r) => r.id));
    return out.slice(0, n);
  }
  return [...chosen, ...weightedPick(pool, Math.max(0, n - chosen.length), (r) => pickWeight(r, type, favorites)).map((r) => r.id)];
}

/**
 * Build a week around the 2–3 meals the user preps. Mains rotate through lunches and dinners,
 * breakfasts and snacks rotate too. Portion size is set once per recipe (so every container of
 * the same meal matches), scaled toward the calorie target; an evening snack is added if needed.
 */
export function buildWeek({ mains = [], breakfasts = [], snacks = [], targets, avoid = new Set() }) {
  const days = {};
  for (let d = 0; d < 7; d++) {
    const day = {};
    if (breakfasts.length) day.breakfast = { id: breakfasts[d % breakfasts.length], servings: 1 };
    if (mains.length) {
      day.lunch = { id: mains[d % mains.length], servings: 1 };
      day.dinner = { id: mains[(d + 1) % mains.length], servings: 1 };
    }
    if (snacks.length) {
      day.snack1 = { id: snacks[d % snacks.length], servings: 1 };
      if (snacks.length > 1) day.snack2 = { id: snacks[(d + 1) % snacks.length], servings: 1 };
    }
    days[d] = day;
  }
  const portions = {};
  [...mains, ...breakfasts, ...snacks].forEach((id) => (portions[id] = 1));
  // Only size what's actually planned: if breakfast or snacks are left to the user, aim lower.
  const share = 0.55 + (breakfasts.length ? 0.2 : 0) + (snacks.length ? 0.25 : 0);
  const goal = { kcal: targets.kcal * share, protein: targets.protein * share };
  const max = (id) => (mains.includes(id) ? 2 : 1.5);
  const apply = () => { for (const day of Object.values(days)) for (const s of SLOTS) if (day[s.id]) day[s.id].servings = portions[day[s.id].id] ?? 1; };
  const avg = () => {
    const t = { kcal: 0, p: 0 };
    for (const day of Object.values(days)) { const x = dayTotals(day); t.kcal += x.kcal / 7; t.p += x.p / 7; }
    return t;
  };
  let eveningSnack = null;
  for (let i = 0; i < 60; i++) {
    apply();
    const t = avg();
    if (t.kcal >= goal.kcal * 0.95) break;
    const needP = t.p < goal.protein;
    let best = null, bestScore = -Infinity;
    for (const id of Object.keys(portions)) {
      if (portions[id] >= max(id)) continue;
      const score = (needP ? pRatio(id) : -pRatio(id)) - (portions[id] - 1) * 0.6;
      if (score > bestScore) { bestScore = score; best = id; }
    }
    if (!eveningSnack && snacks.length) {
      const own = snacks.length >= 3;
      const id = own ? null : needP ? 'vanilla-protein-shake' : ENERGY_SNACKS.find((x) => !avoid.has(x) && !snacks.includes(x)) || 'vanilla-protein-shake';
      const score = own ? -0.1 : (needP ? pRatio(id) : -pRatio(id)) + 0.05;
      if (!best || score > bestScore) {
        for (let d = 0; d < 7; d++) {
          const sid = own ? snacks[(d + 2) % snacks.length] : id;
          days[d].snack3 = { id: sid, servings: 1 };
          portions[sid] ??= 1;
        }
        eveningSnack = own ? 'your snacks' : RECIPE_BY_ID[id].name;
        continue;
      }
    }
    if (!best) break;
    portions[best] += 0.25;
  }
  apply();
  return { days, portions, eveningSnack, share, picks: { mains, breakfasts, snacks } };
}

/** Fully automatic week (used as a fallback / for testing). */
export function generateWeek({ targets, lowFodmap = true, counts = { breakfast: 2, main: 3, snack: 3 }, avoid = new Set(), favorites = new Set() }) {
  const opts = { lowFodmap, avoid, favorites };
  const mains = suggestRecipes('main', counts.main, opts);
  const breakfasts = suggestRecipes('breakfast', counts.breakfast, { ...opts, avoid: new Set([...avoid, ...mains]) });
  const snacks = suggestRecipes('snack', counts.snack, { ...opts, avoid: new Set([...avoid, ...mains, ...breakfasts]) });
  return buildWeek({ mains, breakfasts, snacks, targets, avoid });
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
  const meals = {};
  for (const d of Object.values(week?.days || {})) for (const s of SLOTS) if (d[s.id]) (meals[d[s.id].id] ??= []).push(d[s.id].servings || 1);
  return Object.entries(recipeCounts)
    .map(([id, servings]) => {
      const r = RECIPE_BY_ID[id];
      const list = meals[id] || [];
      const uniform = list.length && list.every((x) => x === list[0]);
      return { r, servings, batches: servings / r.serves, count: list.length, portion: uniform ? list[0] : null };
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
