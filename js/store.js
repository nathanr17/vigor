// Tiny persistent store. All data lives on-device in localStorage; Settings offers JSON backup/restore.
import { uid } from './util.js';

const KEY = 'vigor:v1';

export const defaultState = () => ({
  v: 1,
  profile: { onboarded: false, name: '', age: '', heightIn: '', weightLb: '', sex: 'male', activity: 'moderate', goal: 'lean_bulk', overrides: {} },
  goals: { workouts: 4, runs: 2 },
  plans: {}, // weekKey -> { days: { 0..6: { slotId: { id, servings } } }, prepped: { recipeId: true } }
  grocery: {}, // weekKey -> { checked: { key: true }, extras: [{ id, name, checked }] }
  meals: [], // { id, date, slot, recipeId?, name, servings, kcal, p, c, f, fib, reaction? }
  workouts: [], // { id, date, templateId, name, startedAt, durationMin, exercises: [{ exId, target, sets: [{ w, r, done }] }], notes }
  cardio: [], // { id, date, type, miles, sec, effort, notes }
  checkins: {}, // date -> { energy, mood, sleep, libido, gut, stress, symptoms: [], bristol, notes }
  habits: {}, // date -> { water, kegels }
  weights: [], // { date, lb }
  favorites: [],
  active: null, // workout in progress
  settings: { planLowFodmap: true, restSec: 90, excluded: [] }, // excluded: ingredient keys you don't eat
  backupAt: null,
  createdAt: Date.now(),
});

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState();
    return migrate(JSON.parse(raw));
  } catch (e) {
    console.warn('Could not load saved data', e);
    return defaultState();
  }
}

function migrate(s) {
  // Fill any keys added in later versions without losing data.
  const d = defaultState();
  for (const k of Object.keys(d)) if (s[k] === undefined) s[k] = d[k];
  s.profile = { ...d.profile, ...s.profile };
  s.goals = { ...d.goals, ...s.goals };
  s.settings = { ...d.settings, ...s.settings };
  return s;
}

let state = load();
const subs = new Set();
let saveError = null;

export const S = () => state;
export const getSaveError = () => saveError;

export function update(fn) {
  fn(state);
  persist();
  subs.forEach((f) => f());
}

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    saveError = null;
  } catch (e) {
    saveError = e;
    console.error('Save failed', e);
  }
}

export function subscribe(f) {
  subs.add(f);
  return () => subs.delete(f);
}

// Ask the browser not to evict our storage (Safari 17+ honours this for home-screen apps).
export async function requestPersistence() {
  try {
    if (navigator.storage?.persist && !(await navigator.storage.persisted())) await navigator.storage.persist();
  } catch { /* not supported */ }
}

// ---------------------------------------------------------------- actions
export const actions = {
  logMeal(entry) {
    update((s) => { s.meals.push({ id: uid(), ...entry }); });
  },
  removeMeal(id) {
    update((s) => { s.meals = s.meals.filter((m) => m.id !== id); });
  },
  patchMeal(id, patch) {
    update((s) => { const m = s.meals.find((x) => x.id === id); if (m) Object.assign(m, patch); });
  },
  setPlanItem(wk, dayIdx, slot, item) {
    update((s) => {
      const plan = (s.plans[wk] ??= { days: {}, prepped: {} });
      const day = (plan.days[dayIdx] ??= {});
      if (item) day[slot] = item; else delete day[slot];
    });
  },
  setPlanDays(wk, days) {
    update((s) => { s.plans[wk] = { days, prepped: {} }; s.grocery[wk] = { checked: {}, extras: s.grocery[wk]?.extras || [] }; });
  },
  copyDay(wk, from, toList) {
    update((s) => {
      const plan = (s.plans[wk] ??= { days: {}, prepped: {} });
      const src = plan.days[from] || {};
      for (const t of toList) plan.days[t] = JSON.parse(JSON.stringify(src));
    });
  },
  togglePrepped(wk, id) {
    update((s) => { const p = (s.plans[wk] ??= { days: {}, prepped: {} }); p.prepped ??= {}; p.prepped[id] = !p.prepped[id]; });
  },
  toggleGrocery(wk, key) {
    update((s) => { const g = (s.grocery[wk] ??= { checked: {}, extras: [] }); g.checked[key] = !g.checked[key]; });
  },
  addGroceryExtra(wk, name) {
    update((s) => { const g = (s.grocery[wk] ??= { checked: {}, extras: [] }); g.extras.push({ id: uid(), name, checked: false }); });
  },
  toggleGroceryExtra(wk, id) {
    update((s) => { const e = s.grocery[wk]?.extras.find((x) => x.id === id); if (e) e.checked = !e.checked; });
  },
  removeGroceryExtra(wk, id) {
    update((s) => { const g = s.grocery[wk]; if (g) g.extras = g.extras.filter((x) => x.id !== id); });
  },
  clearGroceryChecks(wk) {
    update((s) => { const g = s.grocery[wk]; if (g) { g.checked = {}; g.extras.forEach((e) => (e.checked = false)); } });
  },
  saveCheckin(date, patch) {
    update((s) => { s.checkins[date] = { ...(s.checkins[date] || {}), ...patch, updatedAt: Date.now() }; });
  },
  setHabit(date, patch) {
    update((s) => { s.habits[date] = { ...(s.habits[date] || {}), ...patch }; });
  },
  addWeight(date, lb) {
    update((s) => {
      s.weights = s.weights.filter((w) => w.date !== date);
      s.weights.push({ date, lb });
      s.weights.sort((a, b) => a.date.localeCompare(b.date));
      s.profile.weightLb = s.weights[s.weights.length - 1].lb;
    });
  },
  removeWeight(date) {
    update((s) => { s.weights = s.weights.filter((w) => w.date !== date); });
  },
  addCardio(entry) {
    update((s) => { s.cardio.push({ id: uid(), ...entry }); });
  },
  removeCardio(id) {
    update((s) => { s.cardio = s.cardio.filter((c) => c.id !== id); });
  },
  removeWorkout(id) {
    update((s) => { s.workouts = s.workouts.filter((w) => w.id !== id); });
  },
  toggleFavorite(id) {
    update((s) => { s.favorites = s.favorites.includes(id) ? s.favorites.filter((x) => x !== id) : [...s.favorites, id]; });
  },
};

export function exportJSON() {
  return JSON.stringify({ app: 'vigor', exportedAt: new Date().toISOString(), data: state }, null, 2);
}

export function importJSON(text) {
  const parsed = JSON.parse(text);
  const data = parsed?.data ?? parsed;
  if (!data || typeof data !== 'object' || !data.profile) throw new Error('This file does not look like a Vigor backup.');
  update((s) => {
    for (const k of Object.keys(s)) delete s[k];
    Object.assign(s, migrate(data));
  });
}

export function resetAll() {
  update((s) => {
    for (const k of Object.keys(s)) delete s[k];
    Object.assign(s, defaultState());
  });
}
