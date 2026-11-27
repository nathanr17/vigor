import { html, useState, useMemo } from '../../vendor/preact-htm.js';
import { S, actions } from '../store.js';
import { recipeReactions, REACTIONS } from '../stats.js';
import { RECIPES, RECIPE_BY_ID, analyze, scaledIngredients, SLOTS, SLOT_BY_ID, VITALITY, FODMAP_GROUPS, FOD_LABEL } from '../nutrition.js';
import { todayISO, weekStart, weekDays, dowShort, fmtMonthDay, dayIndex, fmtNum, fmtQty } from '../util.js';
import { Icon, Header, Chip, Stepper, Sheet, FodBadge, Macro, Empty, toast } from '../ui.js';
import { RecipeRow, LogFoodSheet, guessSlot } from './common.js';

const MEAL_FILTERS = [['all', 'All'], ['breakfast', 'Breakfast'], ['main', 'Lunch & dinner'], ['snack', 'Snacks'], ['saved', '★ Saved']];
const SORTS = [['protein', 'Most protein'], ['kcal', 'Most calories'], ['time', 'Quickest'], ['name', 'A–Z']];

export function RecipesView() {
  const s = S();
  const [q, setQ] = useState('');
  const [meal, setMeal] = useState('all');
  const [flt, setFlt] = useState({ low: false, prep: false, hp: false, vit: false, quick: false });
  const [sort, setSort] = useState('protein');
  const toggle = (k) => setFlt({ ...flt, [k]: !flt[k] });
  const list = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return RECIPES.filter((r) => {
      const a = analyze(r);
      if (meal === 'saved' ? !s.favorites.includes(r.id) : meal !== 'all' && !r.meal.includes(meal)) return false;
      if (flt.low && !a.lowFodmap) return false;
      if (flt.prep && !r.prep) return false;
      if (flt.hp && !a.highProtein) return false;
      if (flt.vit && !a.vitality) return false;
      if (flt.quick && !a.quick) return false;
      if (qq && !(r.name.toLowerCase().includes(qq) || r.ing.some(([k]) => k.replace(/_/g, ' ').includes(qq)))) return false;
      return true;
    }).sort((x, y) => {
      const a = analyze(x), b = analyze(y);
      return sort === 'protein' ? b.p - a.p : sort === 'kcal' ? b.kcal - a.kcal : sort === 'time' ? x.mins - y.mins : x.name.localeCompare(y.name);
    });
  }, [q, meal, flt, sort, s.favorites.length]);

  return html`<div class="page">
    <${Header} title="Recipes" sub=${`${RECIPES.length} recipes · ${RECIPES.filter((r) => analyze(r).lowFodmap).length} low-FODMAP`} />
    <div class="search"><${Icon} name="search" size=${18} /><input placeholder="Search: salmon, oats, steak…" value=${q} onInput=${(e) => setQ(e.target.value)} />
      ${q ? html`<button class="icon-btn sm" onClick=${() => setQ('')} aria-label="Clear"><${Icon} name="x" size=${16} /></button>` : null}</div>
    <div class="chips-row scroll">${MEAL_FILTERS.map(([v, l]) => html`<${Chip} on=${meal === v} onClick=${() => setMeal(v)}>${l}</${Chip}>`)}</div>
    <div class="chips-row scroll">
      <${Chip} cls="outline" on=${flt.low} onClick=${() => toggle('low')}>Low-FODMAP</${Chip}>
      <${Chip} cls="outline" on=${flt.prep} onClick=${() => toggle('prep')}>Meal prep</${Chip}>
      <${Chip} cls="outline" on=${flt.hp} onClick=${() => toggle('hp')}>High protein</${Chip}>
      <${Chip} cls="outline" on=${flt.vit} onClick=${() => toggle('vit')}>Vitality</${Chip}>
      <${Chip} cls="outline" on=${flt.quick} onClick=${() => toggle('quick')}>≤ 15 min</${Chip}>
    </div>
    <div class="sort-row"><span class="muted small">${list.length} recipe${list.length === 1 ? '' : 's'}</span>
      <label class="sort"><span class="muted small">Sort</span>
        <select value=${sort} onChange=${(e) => setSort(e.target.value)}>${SORTS.map(([v, l]) => html`<option value=${v}>${l}</option>`)}</select></label></div>
    <div class="card list-card">
      ${list.length ? list.map((r) => html`<${RecipeRow} key=${r.id} r=${r} onClick=${() => (location.hash = `#/recipes/${r.id}`)} />`)
        : html`<${Empty} icon="search" title="No matches" body="Try removing a filter." />`}
    </div>
  </div>`;
}

export function RecipeDetail({ id }) {
  const s = S();
  const r = RECIPE_BY_ID[id];
  const [servings, setServings] = useState(r ? (r.serves > 1 ? r.serves : 1) : 1);
  const [planOpen, setPlanOpen] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
  if (!r) return html`<div class="page"><${Header} title="Not found" back=${() => (location.hash = '#/recipes')} /></div>`;
  const a = analyze(r);
  const fav = s.favorites.includes(r.id);
  const ings = scaledIngredients(r, servings);
  const reacts = recipeReactions(r.id);
  const back = () => (history.length > 1 ? history.back() : (location.hash = '#/recipes'));
  const mealLabel = r.meal.map((m) => (m === 'main' ? 'Lunch & dinner' : m[0].toUpperCase() + m.slice(1))).join(' · ');

  return html`<div class="page recipe-page">
    <header class="recipe-top">
      <button class="icon-btn back" onClick=${back} aria-label="Back"><${Icon} name="left" size=${26} /></button>
      <button class=${'icon-btn star ' + (fav ? 'on' : '')} onClick=${() => { actions.toggleFavorite(r.id); toast(fav ? 'Removed from saved' : 'Saved ★'); }} aria-label=${fav ? 'Unsave' : 'Save'}>
        <${Icon} name="star" size=${24} /></button>
    </header>
    <div class="recipe-hero">
      <div class="recipe-hero-emoji">${r.emoji}</div>
      <div class="eyebrow">${mealLabel}</div>
      <h1>${r.name}</h1>
      <div class="recipe-meta">
        <span><${Icon} name="clock" size=${15} /> ${r.mins} min</span>
        <span>Makes ${r.serves}</span>
        ${r.prep ? html`<span class="badge sm neutral">Meal prep · 4 days</span>` : null}
      </div>
      <div class="recipe-badges">
        <${FodBadge} level=${a.level} />
        ${a.vitality ? html`<span class="badge vit">Vitality</span>` : null}
        ${a.highProtein ? html`<span class="badge neutral">High protein</span>` : null}
        ${r.tags.includes('gut') ? html`<span class="badge fod-low">Gut-gentle</span>` : null}
      </div>
    </div>

    <div class="card">
      <div class="macro-row">
        <${Macro} label="kcal" value=${a.per.kcal} unit="" strong />
        <${Macro} label="protein" value=${a.per.p} />
        <${Macro} label="carbs" value=${a.per.c} />
        <${Macro} label="fat" value=${a.per.f} />
        <${Macro} label="fiber" value=${a.per.fib} />
      </div>
      <div class="muted small center">Per serving</div>
    </div>

    ${r.note ? html`<p class="recipe-note">${r.note}</p>` : null}

    ${a.vit.length ? html`<div class="card"><div class="card-head"><h2>Why it helps</h2></div>
      ${a.vit.map((v) => html`<div class="vit-row"><span class="badge sm vit">${VITALITY[v].label}</span><span class="small">${VITALITY[v].why}</span></div>`)}
    </div>` : null}

    <div class="card">
      <div class="card-head"><h2>Ingredients</h2><${Stepper} value=${servings} step=${1} min=${1} max=${12} onChange=${setServings} fmt=${(v) => `${v} serv`} label="Servings" /></div>
      <ul class="ing-list">
        ${ings.map((i) => html`<li class=${i.flagged ? 'flagged ' + i.flagged : ''}>
          <span class="ing-qty">${i.qty}</span>
          <span class="ing-name">${i.name}${i.note ? html`<span class="muted">, ${i.note}</span>` : null}</span>
          ${i.flagged ? html`<span class=${'fod-dot ' + i.flagged} title=${FOD_LABEL[i.flagged]}></span>` : null}
        </li>`)}
      </ul>
    </div>

    <div class=${'card fod-card fod-' + a.level}>
      <div class="card-head"><h2>IBS notes</h2><${FodBadge} level=${a.level} small /></div>
      ${a.flags.length ? html`
        ${a.flags.map((f) => html`<div class="fod-flag"><div><b>${f.name}</b> <span class="muted small">· ${f.groups.map((g) => FODMAP_GROUPS[g]).join(', ')}</span></div><div class="small">${f.note}</div></div>`)}
        ${r.swaps ? html`<div class="swap"><${Icon} name="shuffle" size=${16} /><span>${r.swaps}</span></div>` : null}`
        : html`<p class="small">Every ingredient is within low-FODMAP portions per serving. If you're sensitive to fat or spice, keep an eye on portion size and heat.</p>`}
      ${reacts.good + reacts.meh + reacts.bad ? html`<div class="react-summary">
        <span class="small">Your history:</span>
        ${['good', 'meh', 'bad'].map((k) => reacts[k] ? html`<span class="react-pill">${REACTIONS[k].emoji} ${reacts[k]}</span>` : null)}
      </div>` : null}
    </div>

    <div class="card">
      <div class="card-head"><h2>Steps</h2></div>
      <ol class="steps">${r.steps.map((st) => html`<li>${st}</li>`)}</ol>
    </div>

    <div class="recipe-actions">
      <button class="btn secondary grow" onClick=${() => setLogOpen(true)}><${Icon} name="check" size=${18} /> Log it</button>
      <button class="btn primary grow" onClick=${() => setPlanOpen(true)}><${Icon} name="calendar" size=${18} /> Add to plan</button>
    </div>

    <${AddToPlanSheet} open=${planOpen} onClose=${() => setPlanOpen(false)} r=${r} />
    <${QuickLogRecipe} open=${logOpen} onClose=${() => setLogOpen(false)} r=${r} />
  </div>`;
}

function AddToPlanSheet({ open, onClose, r }) {
  const [wkOffset, setWkOffset] = useState(0);
  const wk = weekStart();
  const realWk = wkOffset ? addWeeks(wk, wkOffset) : wk;
  const days = weekDays(realWk);
  const [selDays, setSelDays] = useState([]);
  const allowed = SLOTS.filter((x) => r.meal.includes(x.type));
  const [slot, setSlot] = useState(allowed[0]?.id || 'lunch');
  const [servings, setServings] = useState(1);
  const toggle = (i) => setSelDays(selDays.includes(i) ? selDays.filter((x) => x !== i) : [...selDays, i]);
  const go = () => {
    selDays.forEach((i) => actions.setPlanItem(realWk, i, slot, { id: r.id, servings }));
    toast(`Added to ${selDays.length} day${selDays.length === 1 ? '' : 's'}`);
    setSelDays([]); onClose();
  };
  return html`<${Sheet} open=${open} onClose=${onClose} title="Add to plan" footer=${html`<button class="btn primary grow" disabled=${!selDays.length} onClick=${go}>Add</button>`}>
    <div class="field"><div class="field-label">Week</div>
      <div class="chips-row"><${Chip} on=${wkOffset === 0} onClick=${() => { setWkOffset(0); setSelDays([]); }}>This week</${Chip}><${Chip} on=${wkOffset === 1} onClick=${() => { setWkOffset(1); setSelDays([]); }}>Next week</${Chip}></div></div>
    <div class="field"><div class="field-label">Days</div>
      <div class="chips-row wrap">${days.map((d, i) => html`<${Chip} on=${selDays.includes(i)} onClick=${() => toggle(i)}>${dowShort(d)} ${fmtMonthDay(d).split(' ')[1]}</${Chip}>`)}</div></div>
    <div class="field"><div class="field-label">Meal</div>
      <div class="chips-row wrap">${(allowed.length ? allowed : SLOTS).map((x) => html`<${Chip} on=${slot === x.id} onClick=${() => setSlot(x.id)}>${x.label}</${Chip}>`)}</div></div>
    <div class="field"><div class="field-label">Servings per day</div><${Stepper} value=${servings} step=${0.25} min=${0.25} max=${4} onChange=${setServings} fmt=${fmtQty} /></div>
  </${Sheet}>`;
}
const addWeeks = (wk, n) => { const d = new Date(wk + 'T00:00:00'); d.setDate(d.getDate() + 7 * n); const p = (x) => String(x).padStart(2, '0'); return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`; };

function QuickLogRecipe({ open, onClose, r }) {
  const allowed = SLOTS.filter((x) => r.meal.includes(x.type));
  const g = guessSlot();
  const [slot, setSlot] = useState(allowed.some((x) => x.id === g) ? g : allowed[0]?.id || g);
  const [servings, setServings] = useState(1);
  const a = analyze(r);
  const go = () => {
    actions.logMeal({ date: todayISO(), slot, recipeId: r.id, name: r.name, servings, kcal: Math.round(a.per.kcal * servings), p: Math.round(a.per.p * servings), c: Math.round(a.per.c * servings), f: Math.round(a.per.f * servings), fib: Math.round(a.per.fib * servings) });
    toast(`Logged ${r.name}`);
    onClose();
  };
  return html`<${Sheet} open=${open} onClose=${onClose} title="Log for today" footer=${html`<button class="btn primary grow" onClick=${go}>Log</button>`}>
    <div class="field"><div class="field-label">Servings</div><${Stepper} value=${servings} step=${0.25} min=${0.25} max=${4} onChange=${setServings} fmt=${fmtQty} /></div>
    <div class="macro-strip"><span><b>${fmtNum(a.per.kcal * servings)}</b> kcal</span><span><b>${fmtNum(a.per.p * servings)}</b> g P</span></div>
    <div class="field"><div class="field-label">Meal</div>
      <div class="chips-row wrap">${SLOTS.map((x) => html`<${Chip} on=${slot === x.id} onClick=${() => setSlot(x.id)}>${x.label}</${Chip}>`)}</div></div>
  </${Sheet}>`;
}
