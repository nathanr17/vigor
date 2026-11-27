import { html, useState } from '../../vendor/preact-htm.js';
import { S, actions, update } from '../store.js';
import { targets, avoidSet } from '../stats.js';
import { SLOTS, SLOT_BY_ID, RECIPE_BY_ID, analyze, dayTotals, itemTotals, generateWeek, buildGrocery, prepList } from '../nutrition.js';
import { todayISO, weekStart, weekDays, addDays, dowShort, fmtMonthDay, fmtWeekRange, fmtNum, fmtQty, dayIndex } from '../util.js';
import { Icon, Header, Card, Segmented, Sheet, Stepper, Chip, Progress, Empty, FodBadge, toast, confirmAction } from '../ui.js';
import { RecipePicker } from './common.js';

export function PlanView({ sub }) {
  const tab = ['week', 'prep', 'grocery'].includes(sub) ? sub : 'week';
  const [wk, setWk] = useState(weekStart());
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
  const [genOpen, setGenOpen] = useState(false);
  const [copyFrom, setCopyFrom] = useState(null);
  const filled = plan && Object.values(plan.days || {}).some((d) => Object.keys(d).length);

  const weekAvg = (() => {
    if (!filled) return null;
    const tot = days.map((_, i) => dayTotals(plan.days?.[i]));
    const n = tot.filter((x) => x.kcal > 0).length || 1;
    return { kcal: tot.reduce((a, x) => a + x.kcal, 0) / n, p: tot.reduce((a, x) => a + x.p, 0) / n };
  })();

  return html`<div>
    <div class="plan-actions">
      <button class="btn primary grow" onClick=${() => setGenOpen(true)}><${Icon} name="shuffle" size=${18} /> ${filled ? 'Re-plan week' : 'Auto-plan my week'}</button>
      ${filled ? html`<button class="btn ghost" onClick=${() => { if (confirmAction('Clear every meal planned for this week?')) actions.setPlanDays(wk, {}); }}>Clear</button>` : null}
    </div>
    ${weekAvg ? html`<div class="plan-summary">
      <span>Daily average</span>
      <span><b>${fmtNum(weekAvg.kcal)}</b> / ${fmtNum(t.kcal)} kcal</span>
      <span><b>${fmtNum(weekAvg.p)}</b> / ${t.protein}+ g protein</span>
    </div>` : html`<p class="muted small">Tap <b>Auto-plan</b> to build a week from a few meal-prep-friendly recipes, or fill each slot yourself. Snacks are included to keep your energy steady.</p>`}

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
    <${GenerateSheet} open=${genOpen} onClose=${() => setGenOpen(false)} wk=${wk} hasPlan=${filled} />
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

function GenerateSheet({ open, onClose, wk, hasPlan }) {
  const s = S();
  const [low, setLow] = useState(s.settings.planLowFodmap);
  const [b, setB] = useState(2);
  const [m, setM] = useState(3);
  const [sn, setSn] = useState(3);
  const go = () => {
    if (hasPlan && !confirmAction('Replace the meals already planned for this week?')) return;
    const res = generateWeek({ targets: targets(), lowFodmap: low, counts: { breakfast: b, main: m, snack: sn }, avoid: avoidSet(), favorites: new Set(s.favorites) });
    actions.setPlanDays(wk, res.days);
    update((st) => { st.settings.planLowFodmap = low; });
    toast('Week planned. Check the Prep and Groceries tabs.');
    onClose();
  };
  return html`<${Sheet} open=${open} onClose=${onClose} title="Auto-plan this week" footer=${html`<button class="btn primary grow" onClick=${go}><${Icon} name="shuffle" size=${18} /> Generate</button>`}>
    <p class="muted small">Picks a few recipes and rotates them through the week, so you only cook a couple of batches. Servings are scaled to hit about ${fmtNum(targets().kcal)} kcal a day, and an extra snack is added when you need it.</p>
    <div class="habit-row"><span>Low-FODMAP recipes only</span>
      <button class=${'toggle ' + (low ? 'on' : '')} role="switch" aria-checked=${low} onClick=${() => setLow(!low)}><span></span></button></div>
    <div class="habit-row"><span>Breakfast recipes</span><${Stepper} value=${b} min=${1} max=${4} onChange=${setB} /></div>
    <div class="habit-row"><span>Lunch & dinner recipes</span><${Stepper} value=${m} min=${1} max=${6} onChange=${setM} /></div>
    <div class="habit-row"><span>Snack recipes</span><${Stepper} value=${sn} min=${1} max=${5} onChange=${setSn} /></div>
    <p class="muted small">Recipes you've rated as a bad gut reaction more often than a good one are skipped automatically. Saved ★ recipes are favored.</p>
  </${Sheet}>`;
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
  const totalMins = batch.reduce((a, x) => a + x.r.mins * Math.max(1, Math.ceil(x.batches)) * 0.75, 0);
  const row = (x) => html`<div class=${'prep-row ' + (prepped[x.r.id] ? 'done' : '')}>
    <button class=${'check-btn ' + (prepped[x.r.id] ? 'on' : '')} onClick=${() => actions.togglePrepped(wk, x.r.id)} aria-label="Mark prepped"><${Icon} name="check" size=${18} /></button>
    <a class="prep-main" href=${`#/recipes/${x.r.id}`}>
      <span class="prep-name">${x.r.emoji} ${x.r.name}</span>
      <span class="muted small">${fmtQty(x.servings)} servings · make ${fmtQty(Math.round(x.batches * 4) / 4)}× the recipe · ${x.r.mins} min</span>
    </a>
  </div>`;
  return html`<div>
    ${batch.length ? html`<${Card} title="Batch cook" action=${html`<span class="muted small">~${Math.round(totalMins / 15) * 15} min</span>`}>
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
