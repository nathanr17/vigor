// Shared sheets: recipe picker, food logger, reaction journal.
import { html, useState, useMemo } from '../../vendor/preact-htm.js';
import { S, actions } from '../store.js';
import { RECIPES, analyze, SLOTS, SLOT_BY_ID, RECIPE_BY_ID } from '../nutrition.js';
import { SYMPTOMS, REACTIONS, recipeReactions, isExcluded } from '../stats.js';
import { Icon, Sheet, Chip, Stepper, FodBadge, Segmented, NumInput, toast } from '../ui.js';
import { fmtNum, fmtQty } from '../util.js';
import { SNACK_IDEAS } from '../data/products.js';

export function guessSlot() {
  const h = new Date().getHours();
  return h < 10 ? 'breakfast' : h < 12 ? 'snack1' : h < 15 ? 'lunch' : h < 17 ? 'snack2' : h < 21 ? 'dinner' : 'snack3';
}

export function ReactionEmoji({ recipeId }) {
  const r = recipeReactions(recipeId);
  if (!r.good && !r.meh && !r.bad) return null;
  const top = r.bad > r.good ? 'bad' : r.meh > r.good ? 'meh' : 'good';
  return html`<span class="react-emoji" title=${REACTIONS[top].label}>${REACTIONS[top].emoji}</span>`;
}

export function RecipeRow({ r, onClick, right, servings }) {
  const a = analyze(r);
  const s = servings || 1;
  return html`<button class="recipe-row" onClick=${onClick}>
    <span class="recipe-emoji" aria-hidden="true">${r.emoji}</span>
    <span class="recipe-row-main">
      <span class="recipe-row-name">${r.name}</span>
      <span class="recipe-row-meta">
        ${fmtNum(a.per.kcal * s)} kcal · ${fmtNum(a.per.p * s)} g protein · ${r.mins} min
      </span>
      <span class="recipe-row-badges">
        <${FodBadge} level=${a.level} small />
        ${r.prep ? html`<span class="badge sm neutral">Meal prep</span>` : null}
        ${a.vitality ? html`<span class="badge sm vit">Vitality</span>` : null}
        <${ReactionEmoji} recipeId=${r.id} />
      </span>
    </span>
    ${right ?? html`<${Icon} name="right" size=${18} cls="muted" />`}
  </button>`;
}

/** Searchable recipe list filtered to a meal type. */
export function RecipePicker({ type, onPick }) {
  const s = S();
  const [q, setQ] = useState('');
  const [low, setLow] = useState(!!s.settings.planLowFodmap);
  const [all, setAll] = useState(false);
  const [fav, setFav] = useState(false);
  const list = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return RECIPES.filter((r) => !isExcluded(r))
      .filter((r) => (all || !type || r.meal.includes(type)))
      .filter((r) => !low || analyze(r).lowFodmap)
      .filter((r) => !fav || s.favorites.includes(r.id))
      .filter((r) => !qq || r.name.toLowerCase().includes(qq) || r.ing.some(([k]) => k.includes(qq)))
      .sort((a, b) => (s.favorites.includes(b.id) - s.favorites.includes(a.id)) || analyze(b).p - analyze(a).p);
  }, [q, low, all, fav, type]);
  return html`<div class="picker">
    <div class="search"><${Icon} name="search" size=${18} /><input placeholder="Search recipes or ingredients" value=${q} onInput=${(e) => setQ(e.target.value)} /></div>
    <div class="chips-row">
      <${Chip} on=${low} onClick=${() => setLow(!low)}>Low-FODMAP only</${Chip}>
      <${Chip} on=${fav} onClick=${() => setFav(!fav)}>★ Saved</${Chip}>
      ${type ? html`<${Chip} on=${all} onClick=${() => setAll(!all)}>All meal types</${Chip}>` : null}
    </div>
    <div class="list">
      ${list.length ? list.map((r) => html`<${RecipeRow} key=${r.id} r=${r} onClick=${() => onPick(r)} right=${html`<span class="add-dot"><${Icon} name="plus" size=${18} /></span>`} />`)
        : html`<div class="muted pad">No recipes match. Try turning off a filter.</div>`}
    </div>
  </div>`;
}

/** Sheet for logging food: from a recipe, quick-add macros, or a recent item. */
export function LogFoodSheet({ open, onClose, date, slot: slot0 }) {
  const [mode, setMode] = useState('recipe');
  const [slot, setSlot] = useState(slot0 || guessSlot());
  const [picked, setPicked] = useState(null);
  const [servings, setServings] = useState(1);
  const [quick, setQuick] = useState({ name: '', kcal: '', p: '', c: '', f: '' });
  const reset = () => { setPicked(null); setServings(1); setQuick({ name: '', kcal: '', p: '', c: '', f: '' }); setMode('recipe'); };
  const close = () => { reset(); onClose(); };
  const recent = useMemo(() => {
    const seen = new Set(); const out = [];
    for (const m of [...S().meals].reverse()) {
      const k = m.recipeId || m.name.toLowerCase();
      if (seen.has(k)) continue; seen.add(k); out.push(m);
      if (out.length >= 15) break;
    }
    return out;
  }, [open]);

  const logRecipe = () => {
    const a = analyze(picked);
    actions.logMeal({ date, slot, recipeId: picked.id, name: picked.name, servings, kcal: Math.round(a.per.kcal * servings), p: Math.round(a.per.p * servings), c: Math.round(a.per.c * servings), f: Math.round(a.per.f * servings), fib: Math.round(a.per.fib * servings) });
    toast(`Logged ${picked.name}`);
    close();
  };
  const logQuick = () => {
    if (!quick.name.trim()) return toast('Give it a name');
    actions.logMeal({ date, slot, name: quick.name.trim(), servings: 1, kcal: Number(quick.kcal) || 0, p: Number(quick.p) || 0, c: Number(quick.c) || 0, f: Number(quick.f) || 0, fib: 0 });
    toast(`Logged ${quick.name.trim()}`);
    close();
  };
  const logAgain = (m) => {
    const { id, reaction, date: _d, slot: _s, ...rest } = m;
    actions.logMeal({ ...rest, date, slot });
    toast(`Logged ${m.name}`);
    close();
  };

  const slotPicker = html`<div class="field"><div class="field-label">Meal</div>
    <div class="chips-row wrap">${SLOTS.map((x) => html`<${Chip} on=${slot === x.id} onClick=${() => setSlot(x.id)}>${x.label}</${Chip}>`)}</div></div>`;

  let body, footer = null;
  if (picked) {
    const a = analyze(picked);
    body = html`<div>
      <div class="picked-head"><span class="recipe-emoji lg">${picked.emoji}</span><div><div class="picked-name">${picked.name}</div><${FodBadge} level=${a.level} small /></div></div>
      <div class="field"><div class="field-label">Servings</div><${Stepper} value=${servings} step=${0.25} min=${0.25} max=${4} onChange=${setServings} fmt=${fmtQty} /></div>
      <div class="macro-strip">
        <span><b>${fmtNum(a.per.kcal * servings)}</b> kcal</span><span><b>${fmtNum(a.per.p * servings)}</b> g P</span><span><b>${fmtNum(a.per.c * servings)}</b> g C</span><span><b>${fmtNum(a.per.f * servings)}</b> g F</span>
      </div>
      ${slotPicker}
    </div>`;
    footer = html`<button class="btn ghost" onClick=${() => setPicked(null)}>Back</button><button class="btn primary grow" onClick=${logRecipe}>Log ${SLOT_BY_ID[slot].label.toLowerCase()}</button>`;
  } else if (mode === 'recipe') {
    body = html`<${RecipePicker} type=${SLOT_BY_ID[slot]?.type} onPick=${(r) => setPicked(r)} />`;
  } else if (mode === 'quick') {
    body = html`<div>
      <label class="field"><div class="field-label">Food</div><input class="text-input" placeholder="e.g. Chicken wrap from the café" value=${quick.name} onInput=${(e) => setQuick({ ...quick, name: e.target.value })} /></label>
      <div class="grid-2">
        <${NumInput} label="Calories" value=${quick.kcal} onInput=${(v) => setQuick({ ...quick, kcal: v })} suffix="kcal" />
        <${NumInput} label="Protein" value=${quick.p} onInput=${(v) => setQuick({ ...quick, p: v })} suffix="g" />
        <${NumInput} label="Carbs" value=${quick.c} onInput=${(v) => setQuick({ ...quick, c: v })} suffix="g" />
        <${NumInput} label="Fat" value=${quick.f} onInput=${(v) => setQuick({ ...quick, f: v })} suffix="g" />
      </div>
      ${slotPicker}
      <div class="field"><div class="field-label">Snack ideas</div>
        <div class="list compact">${SNACK_IDEAS.map((x) => html`<button class="mini-row" onClick=${() => setQuick({ name: x.name, kcal: x.kcal, p: x.p, c: '', f: '' })}>
          <span>${x.name}</span><span class="muted">${x.kcal} kcal · ${x.p} g</span></button>`)}</div>
      </div>
    </div>`;
    footer = html`<button class="btn primary grow" onClick=${logQuick}>Log food</button>`;
  } else {
    body = html`<div>${slotPicker}<div class="list">${recent.length ? recent.map((m) => html`<button class="mini-row" onClick=${() => logAgain(m)}>
      <span>${m.name}${m.servings && m.servings !== 1 ? ` ×${fmtQty(m.servings)}` : ''}</span><span class="muted">${fmtNum(m.kcal)} kcal · ${fmtNum(m.p)} g</span></button>`) : html`<div class="muted pad">Foods you log will show up here for one-tap re-logging.</div>`}</div></div>`;
  }

  return html`<${Sheet} open=${open} onClose=${close} title="Log food" full footer=${footer}>
    ${!picked ? html`<${Segmented} options=${[['recipe', 'Recipes'], ['quick', 'Quick add'], ['recent', 'Recent']]} value=${mode} onChange=${setMode} />` : null}
    ${body}
  </${Sheet}>`;
}

/** Journal how a logged food sat with you. */
export function ReactionSheet({ meal, onClose }) {
  const r0 = meal?.reaction || {};
  const [rating, setRating] = useState(r0.rating || null);
  const [symptoms, setSymptoms] = useState(r0.symptoms || []);
  const [onset, setOnset] = useState(r0.onset || '');
  const [notes, setNotes] = useState(r0.notes || '');
  if (!meal) return html`<${Sheet} open=${false} onClose=${onClose} title="" />`;
  const toggle = (x) => setSymptoms(symptoms.includes(x) ? symptoms.filter((y) => y !== x) : [...symptoms, x]);
  const save = () => {
    actions.patchMeal(meal.id, { reaction: rating ? { rating, symptoms, onset, notes: notes.trim(), at: Date.now() } : null });
    toast(rating ? 'Saved to your gut journal' : 'Reaction cleared');
    onClose();
  };
  return html`<${Sheet} open=${!!meal} onClose=${onClose} title="How did it sit?" footer=${html`<button class="btn primary grow" onClick=${save}>Save</button>`}>
    <div class="muted small" style="margin-bottom:12px">${meal.name}</div>
    <div class="react-choices">
      ${Object.entries(REACTIONS).map(([k, v]) => html`<button class=${'react-choice ' + (rating === k ? 'on ' + k : '')} onClick=${() => setRating(rating === k ? null : k)}>
        <span class="react-big">${v.emoji}</span><span>${v.label}</span></button>`)}
    </div>
    ${rating && rating !== 'good' ? html`
      <div class="field"><div class="field-label">Symptoms</div>
        <div class="chips-row wrap">${SYMPTOMS.map((x) => html`<${Chip} on=${symptoms.includes(x)} onClick=${() => toggle(x)}>${x}</${Chip}>`)}</div></div>
      <div class="field"><div class="field-label">When did it start?</div>
        <${Segmented} options=${[['soon', '< 1 hr'], ['hours', '1–4 hrs'], ['later', 'Later / next day']]} value=${onset} onChange=${setOnset} /></div>` : null}
    <label class="field"><div class="field-label">Notes</div>
      <textarea class="text-input" rows="3" placeholder="Portion size, stress, ate fast, late meal…" value=${notes} onInput=${(e) => setNotes(e.target.value)}></textarea></label>
  </${Sheet}>`;
}
