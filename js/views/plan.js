import { html, useState, useEffect, useMemo } from '../../vendor/preact-htm.js';
import { S, actions, update } from '../store.js';
import { targets, avoidSet, isExcluded } from '../stats.js';
import { RECIPES, SLOTS, SLOT_BY_ID, RECIPE_BY_ID, analyze, dayTotals, itemTotals, buildWeek, poolFor, suggestRecipes, buildGrocery, prepList } from '../nutrition.js';
import { todayISO, weekStart, weekDays, addDays, dowShort, fmtMonthDay, fmtWeekRange, fmtNum, fmtQty, dayIndex } from '../util.js';
import { Icon, Header, Card, Segmented, Sheet, Stepper, Chip, Progress, Empty, FodBadge, toast, confirmAction } from '../ui.js';
import { RecipePicker, RecipeRow } from './common.js';

export function PlanView({ sub, extra }) {
  const tab = ['week', 'prep', 'grocery'].includes(sub) ? sub : 'week';
  const [wk, setWk] = useState(extra === 'next' ? addDays(weekStart(), 7) : weekStart());
  useEffect(() => { if (extra === 'next') setWk(addDays(weekStart(), 7)); }, [extra]);
  const thisWk = weekStart();
  return html`<div class="page">
    <${Header} title="Plan" />
    <div class="week-nav">
      <button class="icon-btn" onClick=${() => setWk(addDays(wk, -7))} aria-label="Previous week"><${Icon} name="left" /></button>
      <button class="date-label" onClick=${() => setWk(thisWk)}>
        <span>${fmtWeekRange(wk)}</span>
        <span class="muted small">${wk === thisWk ? 'This week' : wk === addDays(thisWk, 7) ? 'Next week' : wk < thisWk ? 'Past week' : 'Upcoming'}</span>
      </button>
      <button class="icon-btn" onClick=${() => setWk(addDays(wk, 7))} aria-label="Next week"><${Icon} name="right" /></button>
    </div>
    <${Segmented} options=${[['week', 'Meals'], ['prep', 'Prep'], ['grocery', 'Groceries']]} value=${tab} onChange=${(v) => (location.hash = `#/plan/${v}`)} />
    ${tab === 'week' ? html`<${WeekPlan} wk=${wk} />` : tab === 'prep' ? html`<${PrepTab} wk=${wk} />` : html`<${GroceryTab} wk=${wk} />`}
  </div>`;
}

// ---------------------------------------------------------------- meals
function WeekPlan({ wk }) {
  const s = S();
  const t = targets();
  const plan = s.plans[wk];
  const days = weekDays(wk);
  const today = todayISO();
  const [slotSheet, setSlotSheet] = useState(null); // { d, slot }
  const [picking, setPicking] = useState(null); // { d, slot }
  const [setupOpen, setSetupOpen] = useState(false);
  const [copyFrom, setCopyFrom] = useState(null);
  const filled = plan && Object.values(plan.days || {}).some((d) => Object.keys(d).length);
  // Start of a new week: open "Set up your week" automatically (once per week, unless dismissed).
  useEffect(() => {
    const dismissed = (S().settings.setupDismissed || []).includes(wk);
    if (!filled && wk >= weekStart() && !dismissed) setSetupOpen(true);
  }, [wk]);
  const closeSetup = (saved) => {
    setSetupOpen(false);
    if (!saved && !filled) update((st) => { st.settings.setupDismissed = [...new Set([...(st.settings.setupDismissed || []), wk])].slice(-26); });
  };
  const picks = plan?.picks;

  const weekAvg = (() => {
    if (!filled) return null;
    const tot = days.map((_, i) => dayTotals(plan.days?.[i]));
    const n = tot.filter((x) => x.kcal > 0).length || 1;
    return { kcal: tot.reduce((a, x) => a + x.kcal, 0) / n, p: tot.reduce((a, x) => a + x.p, 0) / n };
  })();

  return html`<div>
    ${!filled ? html`<div class="card setup-hero">
      <div class="setup-hero-emoji">🥡</div>
      <h2>Set up your week</h2>
      <p class="muted">Pick 2–3 meals to cook at the start of the week. They're spread across your lunches and dinners, portioned to your goals, and turned into a prep list and grocery list.</p>
      <button class="btn primary block" onClick=${() => setSetupOpen(true)}>Pick my meals</button>
      <div class="muted small center">or fill in the days yourself below</div>
    </div>` : html`
      ${picks?.mains?.length ? html`<div class="card prepping">
        <div class="prepping-head"><span class="eyebrow">Prepping this week</span>
          <button class="link-btn" onClick=${() => setSetupOpen(true)}><${Icon} name="edit" size=${15} /> Change</button></div>
        <div class="prepping-list">${picks.mains.map((id) => RECIPE_BY_ID[id] && html`<a class="prep-chip" href=${`#/recipes/${id}`}>${RECIPE_BY_ID[id].emoji} ${RECIPE_BY_ID[id].name}</a>`)}</div>
      </div>` : null}
      <div class="plan-actions">
        <button class="btn secondary grow" onClick=${() => setSetupOpen(true)}><${Icon} name="shuffle" size=${18} /> ${picks?.mains?.length ? 'Change meals' : 'Set up week'}</button>
        <button class="btn ghost" onClick=${() => { if (confirmAction('Clear every meal planned for this week?')) actions.setPlanDays(wk, {}); }}>Clear</button>
      </div>
      <div class="plan-summary">
        <span>Daily average</span>
        <span><b>${fmtNum(weekAvg.kcal)}</b> / ${fmtNum(t.kcal)} kcal</span>
        <span><b>${fmtNum(weekAvg.p)}</b> / ${t.protein}+ g protein</span>
      </div>`}

    ${days.map((d, i) => {
      const day = plan?.days?.[i] || {};
      const tot = dayTotals(day);
      const has = Object.keys(day).length;
      return html`<section class=${'card day-card ' + (d === today ? 'is-today' : '')} key=${d}>
        <div class="day-head">
          <div class="day-title"><span class="day-dow">${dowShort(d)}</span> <span class="muted">${fmtMonthDay(d)}</span>${d === today ? html` <span class="badge sm today-badge">Today</span>` : null}</div>
          ${has ? html`<button class="icon-btn sm" aria-label="Copy day" onClick=${() => setCopyFrom(i)}><${Icon} name="copy" size=${17} /></button>` : null}
        </div>
        ${has ? html`<div class="day-totals">
          <span>${fmtNum(tot.kcal)} kcal</span><span>${fmtNum(tot.p)} g protein</span>
          <${Progress} value=${tot.kcal} max=${t.kcal} height=${4} color=${tot.kcal > t.kcal * 1.1 ? 'var(--amber)' : 'var(--sky)'} />
        </div>` : null}
        <div class="slots">
          ${SLOTS.map((x) => {
            const it = day[x.id]; const r = it && RECIPE_BY_ID[it.id];
            if (!r && x.id === 'snack3' && !has) return null;
            return r ? html`<button class="slot filled" onClick=${() => setSlotSheet({ d: i, slot: x.id })}>
                <span class="slot-label">${x.label}</span>
                <span class="slot-meta">${it.servings !== 1 ? html`<b>×${fmtQty(it.servings)}</b> · ` : ''}${fmtNum(itemTotals(it).kcal)} kcal</span>
                <span class="slot-name">${r.emoji} ${r.name}</span>
              </button>`
              : html`<button class="slot empty" onClick=${() => setPicking({ d: i, slot: x.id })}><span class="slot-label">${x.label}</span><span class="slot-add"><${Icon} name="plus" size=${15} /> Add</span></button>`;
          })}
        </div>
      </section>`;
    })}

    <${SlotSheet} wk=${wk} state=${slotSheet} onClose=${() => setSlotSheet(null)} onSwap=${(st) => { setSlotSheet(null); setPicking(st); }} />
    <${Sheet} open=${!!picking} onClose=${() => setPicking(null)} title=${picking ? `${dowShort(days[picking.d])} · ${SLOT_BY_ID[picking.slot].label}` : ''} full>
      ${picking ? html`<${RecipePicker} type=${SLOT_BY_ID[picking.slot].type} onPick=${(r) => { actions.setPlanItem(wk, picking.d, picking.slot, { id: r.id, servings: 1 }); setPicking(null); }} />` : null}
    </${Sheet}>
    <${SetupSheet} open=${setupOpen} onClose=${closeSetup} wk=${wk} hasPlan=${filled} />
    <${CopySheet} wk=${wk} from=${copyFrom} onClose=${() => setCopyFrom(null)} />
  </div>`;
}

function SlotSheet({ wk, state, onClose, onSwap }) {
  const s = S();
  const it = state && s.plans[wk]?.days?.[state.d]?.[state.slot];
  const r = it && RECIPE_BY_ID[it.id];
  if (!r) return html`<${Sheet} open=${false} onClose=${onClose} title="" />`;
  const a = analyze(r);
  const tt = itemTotals(it);
  const setServ = (v) => actions.setPlanItem(wk, state.d, state.slot, { ...it, servings: v });
  return html`<${Sheet} open=${true} onClose=${onClose} title=${SLOT_BY_ID[state.slot].label}
    footer=${html`<button class="btn ghost danger-text" onClick=${() => { actions.setPlanItem(wk, state.d, state.slot, null); onClose(); }}>Remove</button>
      <button class="btn secondary grow" onClick=${() => onSwap(state)}>Swap</button>`}>
    <div class="picked-head"><span class="recipe-emoji lg">${r.emoji}</span><div><div class="picked-name">${r.name}</div><${FodBadge} level=${a.level} small /></div></div>
    <div class="field"><div class="field-label">Servings</div><${Stepper} value=${it.servings} step=${0.25} min=${0.25} max=${4} onChange=${setServ} fmt=${fmtQty} /></div>
    <div class="macro-strip"><span><b>${fmtNum(tt.kcal)}</b> kcal</span><span><b>${fmtNum(tt.p)}</b> g P</span><span><b>${fmtNum(tt.c)}</b> g C</span><span><b>${fmtNum(tt.f)}</b> g F</span></div>
    <a class="btn ghost block" href=${`#/recipes/${r.id}`} onClick=${onClose}>View recipe</a>
  </${Sheet}>`;
}

const STEPS = [
  { key: 'mains', type: 'main', title: 'Pick 2–3 meals to prep', sub: 'These become your lunches and dinners all week. Cook them in one session. Sunday, your rest day, is perfect for it.', min: 2, max: 3, rec: 3 },
  { key: 'breakfasts', type: 'breakfast', title: 'Pick 1–2 breakfasts', sub: 'Rotated through the week. Overnight oats, baked oats, muffins and sausage patties can all be prepped ahead. Skip this to plan breakfast yourself.', min: 0, max: 2, rec: 2 },
  { key: 'snacks', type: 'snack', title: 'Pick 2–3 snacks', sub: 'Snacks keep your energy steady between meals. Skip this to handle snacks yourself.', min: 0, max: 3, rec: 3 },
];

/** "Set up your week": pick 2–3 meals to prep (+ optional breakfasts & snacks), review, save. */
function SetupSheet({ open, onClose, wk, hasPlan }) {
  const s = S();
  const [step, setStep] = useState(0);
  const [picks, setPicks] = useState({ mains: [], breakfasts: [], snacks: [] });
  const [low, setLow] = useState(!!s.settings.planLowFodmap);
  const [q, setQ] = useState('');
  useEffect(() => {
    if (!open) return;
    const p = S().plans[wk]?.picks || {};
    setPicks({ mains: p.mains || [], breakfasts: p.breakfasts || [], snacks: p.snacks || [] });
    setStep(0); setQ(''); setLow(!!S().settings.planLowFodmap);
  }, [open, wk]);

  const excluded = useMemo(() => new Set(RECIPES.filter(isExcluded).map((r) => r.id)), [open]);
  const cfg = STEPS[step];
  const allPicked = [...picks.mains, ...picks.breakfasts, ...picks.snacks];
  const list = cfg ? poolFor(cfg.type, { lowFodmap: low, avoid: excluded })
    .filter((r) => picks[cfg.key].includes(r.id) || !allPicked.includes(r.id))
    .filter((r) => !q.trim() || r.name.toLowerCase().includes(q.trim().toLowerCase()) || r.ing.some(([k]) => k.replace(/_/g, ' ').includes(q.trim().toLowerCase())))
    .sort((a, b) => (cfg.type === 'main' ? b.prep - a.prep : 0) || (s.favorites.includes(b.id) - s.favorites.includes(a.id)) || analyze(b).p - analyze(a).p) : [];

  const toggle = (id) => {
    const cur = picks[cfg.key];
    if (cur.includes(id)) return setPicks({ ...picks, [cfg.key]: cur.filter((x) => x !== id) });
    if (cur.length >= cfg.max) return toast(`You can pick up to ${cfg.max}. Tap one to remove it first.`);
    setPicks({ ...picks, [cfg.key]: [...cur, id] });
  };
  const chooseForMe = () => {
    const avoid = new Set([...avoidSet(), ...allPicked.filter((id) => !picks[cfg.key].includes(id))]);
    setPicks({ ...picks, [cfg.key]: suggestRecipes(cfg.type, cfg.rec, { lowFodmap: low, avoid, favorites: new Set(s.favorites), keep: picks[cfg.key] }) });
  };
  const preview = useMemo(() => (step === 3 ? buildWeek({ ...picks, targets: targets(), avoid: avoidSet() }) : null), [step, picks]);
  const save = () => {
    if (hasPlan && !confirmAction('Replace the meals already planned for this week?')) return;
    actions.setPlanWeek(wk, preview.days, preview.picks);
    update((st) => { st.settings.planLowFodmap = low; });
    toast('Week set! Your prep list and groceries are ready.');
    onClose(true);
  };

  const count = cfg ? picks[cfg.key].length : 0;
  const footer = step < 3 ? html`
    ${step > 0 ? html`<button class="btn ghost" onClick=${() => { setStep(step - 1); setQ(''); }}>Back</button>` : null}
    <button class="btn secondary" onClick=${chooseForMe}><${Icon} name="shuffle" size=${16} /> Choose for me</button>
    <button class="btn primary grow" disabled=${count < cfg.min} onClick=${() => { setStep(step + 1); setQ(''); }}>
      ${count === 0 && cfg.min === 0 ? 'Skip' : count < cfg.min ? `Pick ${cfg.min - count} more` : 'Next'}</button>`
    : html`<button class="btn ghost" onClick=${() => setStep(2)}>Back</button><button class="btn primary grow" onClick=${save}>Save my week</button>`;

  return html`<${Sheet} open=${open} onClose=${() => onClose(false)} title=${`Set up ${wk === weekStart() ? 'this' : 'the'} week`} full footer=${footer}>
    <div class="setup-steps">${['Meals', 'Breakfast', 'Snacks', 'Review'].map((l, i) => html`<span class=${'setup-step ' + (i === step ? 'on' : i < step ? 'done' : '')}>${l}</span>`)}</div>
    ${step < 3 ? html`
      <h2 class="setup-title">${cfg.title}</h2>
      <p class="muted small">${cfg.sub}</p>
      ${count ? html`<div class="picked-chips">${picks[cfg.key].map((id, i) => html`<button class="prep-chip on" onClick=${() => toggle(id)}><b>${i + 1}</b> ${RECIPE_BY_ID[id].name} ✕</button>`)}</div>` : null}
      <div class="search"><${Icon} name="search" size=${18} /><input placeholder="Search recipes or ingredients" value=${q} onInput=${(e) => setQ(e.target.value)} /></div>
      <div class="chips-row"><${Chip} on=${low} onClick=${() => setLow(!low)}>Low-FODMAP only</${Chip}></div>
      <div class="list">
        ${list.map((r) => {
          const i = picks[cfg.key].indexOf(r.id);
          return html`<${RecipeRow} key=${r.id} r=${r} onClick=${() => toggle(r.id)}
            right=${html`<span class=${'pick-dot ' + (i >= 0 ? 'on' : '')}>${i >= 0 ? i + 1 : html`<${Icon} name="plus" size=${16} />`}</span>`} />`;
        })}
        ${!list.length ? html`<div class="muted pad">No recipes match. Try turning off Low-FODMAP only.</div>` : null}
      </div>` : html`<${SetupReview} res=${preview} />`}
  </${Sheet}>`;
}

function SetupReview({ res }) {
  const t = targets();
  const avg = Object.values(res.days).reduce((a, d) => { const x = dayTotals(d); return { kcal: a.kcal + x.kcal / 7, p: a.p + x.p / 7 }; }, { kcal: 0, p: 0 });
  const items = prepList(res);
  const partial = res.share < 0.99;
  return html`<div>
    <h2 class="setup-title">Your week</h2>
    <div class="target-grid two">
      <div><div class="big-num">${fmtNum(avg.kcal)}</div><div class="muted small">kcal / day${partial ? ' planned' : ''}</div></div>
      <div><div class="big-num">${fmtNum(avg.p)}<small>g</small></div><div class="muted small">protein / day</div></div>
    </div>
    ${partial ? html`<p class="muted small">${!res.picks.breakfasts.length && !res.picks.snacks.length ? 'This covers lunch and dinner.' : !res.picks.breakfasts.length ? 'Breakfast is up to you.' : 'Snacks are up to you.'} Aim for about ${fmtNum(t.kcal)} kcal and ${t.protein} g protein across the whole day.</p>`
      : html`<p class="muted small">Target: ${fmtNum(t.kcal)} kcal and ${t.protein}+ g protein.${res.eveningSnack ? ` An evening snack (${res.eveningSnack}) was added to help you hit your calories.` : ''}</p>`}
    <div class="card list-card">
      ${items.map((x) => html`<div class="cook-row">
        <span class="recipe-emoji">${x.r.emoji}</span>
        <span class="cook-main"><b>${x.r.name}</b>
          <span class="muted small">${x.count} meal${x.count === 1 ? '' : 's'}${x.portion ? ` × ${fmtQty(x.portion)} serving${x.portion === 1 ? '' : 's'}` : ''}${x.r.prep ? ` · cook ${fmtQty(Math.round(x.batches * 4) / 4)}× the recipe` : ' · make fresh'}</span></span>
      </div>`)}
    </div>
    <p class="muted small">Cooked food keeps 3–4 days in the fridge. Freeze the Thursday–Saturday containers, or do a quick second cook midweek.</p>
  </div>`;
}

function CopySheet({ wk, from, onClose }) {
  const [to, setTo] = useState([]);
  const days = weekDays(wk);
  if (from == null) return html`<${Sheet} open=${false} onClose=${onClose} title="" />`;
  const toggle = (i) => setTo(to.includes(i) ? to.filter((x) => x !== i) : [...to, i]);
  const go = () => { actions.copyDay(wk, from, to); toast(`Copied to ${to.length} day${to.length === 1 ? '' : 's'}`); setTo([]); onClose(); };
  return html`<${Sheet} open=${true} onClose=${() => { setTo([]); onClose(); }} title=${`Copy ${dowShort(days[from])} to…`} footer=${html`<button class="btn primary grow" disabled=${!to.length} onClick=${go}>Copy</button>`}>
    <div class="chips-row wrap">${days.map((d, i) => i === from ? null : html`<${Chip} on=${to.includes(i)} onClick=${() => toggle(i)}>${dowShort(d)} ${fmtMonthDay(d).split(' ')[1]}</${Chip}>`)}</div>
    <p class="muted small">Handy for meal prep: plan Monday, then copy it to the rest of the work week.</p>
  </${Sheet}>`;
}

// ---------------------------------------------------------------- prep
function PrepTab({ wk }) {
  const s = S();
  const plan = s.plans[wk];
  const list = prepList(plan);
  if (!list.length) return html`<${Empty} icon="bowl" title="Nothing to prep yet" body="Plan your meals first. Your batch-cooking list will appear here." action=${html`<a class="btn primary" href="#/plan/week">Plan meals</a>`} />`;
  const prepped = plan?.prepped || {};
  const batch = list.filter((x) => x.r.prep);
  const fresh = list.filter((x) => !x.r.prep);
  // Recipes overlap in the oven/on the stove; bigger batches add a little hands-on time, not a full repeat.
  const totalMins = batch.reduce((a, x) => a + x.r.mins * 0.8 + Math.max(0, Math.ceil(x.batches) - 1) * 4, 0);
  const fmtMins = (m) => { m = Math.max(15, Math.round(m / 15) * 15); return m < 60 ? `${m} min` : `${Math.floor(m / 60)} hr${m % 60 ? ` ${m % 60} min` : ''}`; };
  const row = (x) => html`<div class=${'prep-row ' + (prepped[x.r.id] ? 'done' : '')}>
    <button class=${'check-btn ' + (prepped[x.r.id] ? 'on' : '')} onClick=${() => actions.togglePrepped(wk, x.r.id)} aria-label="Mark prepped"><${Icon} name="check" size=${18} /></button>
    <a class="prep-main" href=${`#/recipes/${x.r.id}`}>
      <span class="prep-name">${x.r.emoji} ${x.r.name}</span>
      <span class="muted small">${x.portion ? `${x.count} containers × ${fmtQty(x.portion)} serving${x.portion === 1 ? '' : 's'}` : `${fmtQty(x.servings)} servings`} · make ${fmtQty(Math.round(x.batches * 4) / 4)}× the recipe · ${x.r.mins} min</span>
    </a>
  </div>`;
  return html`<div>
    ${batch.length ? html`<${Card} title="Batch cook" action=${html`<span class="muted small">~${fmtMins(totalMins)}</span>`}>
      ${batch.map(row)}
      <p class="muted small">Sunday is your rest day, which makes it a natural prep day. Start the rice and roasting trays first, then cook proteins while they go. Cool food before lidding. It keeps 4 days in the fridge, so freeze the Thursday–Sunday portions or do a second mini-prep midweek.</p>
    </${Card}>` : null}
    ${fresh.length ? html`<${Card} title="Make fresh">${fresh.map(row)}</${Card}>` : null}
  </div>`;
}

// ---------------------------------------------------------------- grocery
function GroceryTab({ wk }) {
  const s = S();
  const plan = s.plans[wk];
  const g = s.grocery[wk] || { checked: {}, extras: [] };
  const { groups } = buildGrocery(plan);
  const [extra, setExtra] = useState('');
  const [hideDone, setHideDone] = useState(false);
  const [openStaples, setOpenStaples] = useState(false);
  if (!groups.length && !g.extras.length) return html`<${Empty} icon="cart" title="Your list is empty" body="Plan meals for this week and every ingredient is totaled here automatically." action=${html`<a class="btn primary" href="#/plan/week">Plan meals</a>`} />`;
  const total = groups.reduce((a, x) => a + x.items.length, 0) + g.extras.length;
  const done = groups.reduce((a, x) => a + x.items.filter((i) => g.checked[i.key]).length, 0) + g.extras.filter((e) => e.checked).length;

  const share = async () => {
    const lines = [`Grocery list · ${fmtWeekRange(wk)}`, ''];
    for (const grp of groups) {
      const items = grp.items.filter((i) => !g.checked[i.key]);
      if (!items.length) continue;
      lines.push(grp.label.toUpperCase());
      for (const i of items) lines.push(`☐ ${i.name} — ${i.text}`);
      lines.push('');
    }
    const ex = g.extras.filter((e) => !e.checked);
    if (ex.length) { lines.push('EXTRAS'); ex.forEach((e) => lines.push(`☐ ${e.name}`)); }
    const text = lines.join('\n');
    try {
      if (navigator.share) await navigator.share({ title: 'Grocery list', text });
      else { await navigator.clipboard.writeText(text); toast('Copied. Paste it into Notes or Reminders.'); }
    } catch (e) { if (e?.name !== 'AbortError') { try { await navigator.clipboard.writeText(text); toast('Copied to clipboard'); } catch { toast('Could not share'); } } }
  };
  const addExtra = (e) => { e.preventDefault(); if (!extra.trim()) return; actions.addGroceryExtra(wk, extra.trim()); setExtra(''); };

  return html`<div>
    <div class="grocery-top">
      <div><b>${done}</b> of ${total} items</div>
      <div class="grocery-btns">
        <button class="btn ghost sm" onClick=${() => setHideDone(!hideDone)}>${hideDone ? 'Show all' : 'Hide checked'}</button>
        <button class="btn secondary sm" onClick=${share}><${Icon} name="share" size=${16} /> Share</button>
      </div>
    </div>
    <${Progress} value=${done} max=${total} color="var(--amber)" height=${5} />

    ${groups.map((grp) => {
      const staple = grp.cat === 'staple';
      let items = [...grp.items].sort((a, b) => (!!g.checked[a.key]) - (!!g.checked[b.key]));
      if (hideDone) items = items.filter((i) => !g.checked[i.key]);
      if (!items.length) return null;
      return html`<div class="grocery-group">
        <button class="grocery-cat" onClick=${() => staple && setOpenStaples(!openStaples)}>
          <span>${grp.label}</span>${staple ? html`<${Icon} name="down" size=${16} cls=${openStaples ? 'flip' : ''} />` : html`<span class="muted small">${grp.items.length}</span>`}
        </button>
        ${!staple || openStaples ? html`<div class="card list-card">
          ${items.map((i) => html`<button class=${'grocery-item ' + (g.checked[i.key] ? 'done' : '')} onClick=${() => actions.toggleGrocery(wk, i.key)}>
            <span class=${'box ' + (g.checked[i.key] ? 'on' : '')}>${g.checked[i.key] ? html`<${Icon} name="check" size=${14} stroke=${3} />` : null}</span>
            <span class="grocery-main">
              <span class="grocery-name">${i.name}</span>
              <span class="muted small">${i.recipes.slice(0, 2).join(', ')}${i.recipes.length > 2 ? ` +${i.recipes.length - 2}` : ''}</span>
            </span>
            <span class="grocery-qty"><b>${i.text}</b>${i.hint ? html`<span class="muted small">${i.hint}</span>` : null}</span>
          </button>`)}
        </div>` : null}
      </div>`;
    })}

    <div class="grocery-group">
      <div class="grocery-cat"><span>Extras</span></div>
      <div class="card list-card">
        ${g.extras.filter((e) => !hideDone || !e.checked).map((e) => html`<div class=${'grocery-item ' + (e.checked ? 'done' : '')}>
          <button class=${'box ' + (e.checked ? 'on' : '')} onClick=${() => actions.toggleGroceryExtra(wk, e.id)} aria-label="Toggle">${e.checked ? html`<${Icon} name="check" size=${14} stroke=${3} />` : null}</button>
          <span class="grocery-main"><span class="grocery-name">${e.name}</span></span>
          <button class="icon-btn sm" onClick=${() => actions.removeGroceryExtra(wk, e.id)} aria-label="Remove"><${Icon} name="x" size=${16} /></button>
        </div>`)}
        <form class="extra-form" onSubmit=${addExtra}>
          <input class="text-input" placeholder="Add an item (paper towels, foil…)" value=${extra} onInput=${(e) => setExtra(e.target.value)} />
          <button class="btn secondary sm" type="submit">Add</button>
        </form>
      </div>
    </div>
    ${done ? html`<button class="btn ghost block" onClick=${() => confirmAction('Uncheck every item?') && actions.clearGroceryChecks(wk)}>Uncheck all</button>` : null}
  </div>`;
}
