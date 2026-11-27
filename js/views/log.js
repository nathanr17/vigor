import { html, useState } from '../../vendor/preact-htm.js';
import { S, actions } from '../store.js';
import { targets, intakeOn, mealsOn, workoutsOn, cardioOn, workoutVolume, REACTIONS, SYMPTOMS, isRun } from '../stats.js';
import { SLOTS, SLOT_BY_ID, RECIPE_BY_ID, itemTotals } from '../nutrition.js';
import { todayISO, addDays, fmtDayLabel, weekStart, dayIndex, fmtNum, fmtQty, fmtDuration, fmtPace, fmtMonthDay } from '../util.js';
import { Icon, Header, Card, Segmented, Progress, Sheet, Stepper, Chip, Rating, Empty, NumInput, toast, confirmAction } from '../ui.js';
import { LineChart } from '../charts.js';
import { LogFoodSheet, ReactionSheet } from './common.js';
import { TEMPLATES, CARDIO_TYPES, CARDIO_BY_ID, WEEK_PLAN, TEMPLATE_BY_ID, EXERCISES } from '../data/workouts.js';
import { startWorkout } from './workout.js';

export function LogView({ sub }) {
  const tab = ['food', 'training', 'checkin', 'body'].includes(sub) ? sub : 'food';
  const [date, setDate] = useState(todayISO());
  const today = todayISO();
  return html`<div class="page">
    <${Header} title="Log" />
    <${Segmented} options=${[['food', 'Food'], ['training', 'Training'], ['checkin', 'Check-in'], ['body', 'Body']]} value=${tab} onChange=${(v) => (location.hash = `#/log/${v}`)} />
    ${tab !== 'body' ? html`<div class="date-nav">
      <button class="icon-btn" onClick=${() => setDate(addDays(date, -1))} aria-label="Previous day"><${Icon} name="left" /></button>
      <button class="date-label" onClick=${() => setDate(today)}>${fmtDayLabel(date)}</button>
      <button class="icon-btn" onClick=${() => setDate(addDays(date, 1))} disabled=${date >= today} aria-label="Next day"><${Icon} name="right" /></button>
    </div>` : null}
    ${tab === 'food' ? html`<${FoodLog} date=${date} />` : tab === 'training' ? html`<${TrainingLog} date=${date} />` : tab === 'checkin' ? html`<${CheckIn} date=${date} />` : html`<${BodyLog} />`}
  </div>`;
}

// ---------------------------------------------------------------- food
function FoodLog({ date }) {
  const s = S();
  const t = targets();
  const intake = intakeOn(date);
  const meals = mealsOn(date);
  const [adding, setAdding] = useState(null); // slot or true
  const [reacting, setReacting] = useState(null);
  const [editing, setEditing] = useState(null);
  const wk = weekStart(date);
  const planned = s.plans[wk]?.days?.[dayIndex(date)] || {};
  const pending = SLOTS.filter((x) => planned[x.id] && !meals.some((m) => m.slot === x.id && m.recipeId === planned[x.id].id));
  const logPlanned = (slotId) => {
    const it = planned[slotId]; const r = RECIPE_BY_ID[it.id]; const tt = itemTotals(it);
    actions.logMeal({ date, slot: slotId, recipeId: r.id, name: r.name, servings: it.servings, kcal: Math.round(tt.kcal), p: Math.round(tt.p), c: Math.round(tt.c), f: Math.round(tt.f), fib: Math.round(tt.fib), fromPlan: true });
    toast(`Logged ${r.name}`, { label: 'How did it sit?', fn: () => setReacting(S().meals[S().meals.length - 1]) });
  };

  return html`<div>
    <${Card} cls="totals">
      <div class="totals-row">
        <div><div class="big-num">${fmtNum(intake.kcal)}</div><div class="muted small">of ${fmtNum(t.kcal)} kcal</div></div>
        <div><div class="big-num">${fmtNum(intake.p)}<small>g</small></div><div class="muted small">of ${t.protein}+ g protein</div></div>
      </div>
      <${Progress} value=${intake.kcal} max=${t.kcal} color="var(--sky)" />
      <div class="spacer-6"></div>
      <${Progress} value=${intake.p} max=${t.protein} color="var(--teal)" />
      <div class="macro-strip muted"><span>${fmtNum(intake.c)} g carbs</span><span>${fmtNum(intake.f)} g fat</span><span>${fmtNum(intake.fib)} g fiber</span></div>
    </${Card}>

    ${pending.length ? html`<${Card} title="From your plan">
      ${pending.map((x) => { const it = planned[x.id]; const r = RECIPE_BY_ID[it.id]; const tt = itemTotals(it); return html`<div class="menu-item">
        <div class="menu-main"><span class="menu-slot">${x.label}</span><span class="menu-name">${r.emoji} ${r.name}${it.servings !== 1 ? ` ×${fmtQty(it.servings)}` : ''}</span><span class="menu-meta">${fmtNum(tt.kcal)} kcal · ${fmtNum(tt.p)} g</span></div>
        <button class="check-btn" onClick=${() => logPlanned(x.id)} aria-label="Log it"><${Icon} name="check" size=${18} /></button>
      </div>`; })}
    </${Card}>` : null}

    ${SLOTS.map((x) => {
      const items = meals.filter((m) => m.slot === x.id);
      if (!items.length) return null;
      return html`<div class="slot-group">
        <div class="slot-group-head"><span>${x.label}</span><span class="muted">${fmtNum(items.reduce((a, m) => a + m.kcal, 0))} kcal</span></div>
        <div class="card list-card">
          ${items.map((m) => html`<div class="log-row">
            <button class="log-main" onClick=${() => setEditing(m)}>
              <span class="log-name">${m.name}${m.servings && m.servings !== 1 ? html` <span class="muted">×${fmtQty(m.servings)}</span>` : null}</span>
              <span class="muted small">${fmtNum(m.kcal)} kcal · ${fmtNum(m.p)} g P · ${fmtNum(m.c)} g C · ${fmtNum(m.f)} g F</span>
            </button>
            <button class=${'react-btn ' + (m.reaction?.rating || '')} onClick=${() => setReacting(m)} aria-label="How did it sit?">
              ${m.reaction?.rating ? REACTIONS[m.reaction.rating].emoji : html`<${Icon} name="leaf" size=${18} />`}
            </button>
          </div>`)}
        </div>
      </div>`;
    })}

    ${!meals.length && !pending.length ? html`<${Empty} icon="bowl" title="Nothing logged yet" body="Log meals from your plan, a recipe, or quick-add anything." />` : null}

    <button class="btn primary block" onClick=${() => setAdding(true)}><${Icon} name="plus" size=${18} /> Add food</button>
    <p class="muted small center">Tap the <${Icon} name="leaf" size=${13} /> next to a meal to journal how it sat with your gut.</p>

    <${LogFoodSheet} open=${!!adding} onClose=${() => setAdding(null)} date=${date} slot=${typeof adding === 'string' ? adding : undefined} />
    <${ReactionSheet} meal=${reacting} onClose=${() => setReacting(null)} key=${reacting?.id || 'none'} />
    <${EditMealSheet} meal=${editing} onClose=${() => setEditing(null)} key=${'e' + (editing?.id || 'none')} />
  </div>`;
}

function EditMealSheet({ meal, onClose }) {
  const [servings, setServings] = useState(meal?.servings || 1);
  const [slot, setSlot] = useState(meal?.slot || 'lunch');
  if (!meal) return html`<${Sheet} open=${false} onClose=${onClose} title="" />`;
  const ratio = servings / (meal.servings || 1);
  const save = () => {
    actions.patchMeal(meal.id, { slot, servings, kcal: Math.round(meal.kcal * ratio), p: Math.round(meal.p * ratio), c: Math.round(meal.c * ratio), f: Math.round(meal.f * ratio), fib: Math.round((meal.fib || 0) * ratio) });
    onClose();
  };
  const del = () => { if (confirmAction(`Remove ${meal.name}?`)) { actions.removeMeal(meal.id); onClose(); } };
  return html`<${Sheet} open=${!!meal} onClose=${onClose} title=${meal.name} footer=${html`<button class="btn ghost danger-text" onClick=${del}><${Icon} name="trash" size=${18} /></button><button class="btn primary grow" onClick=${save}>Save</button>`}>
    <div class="field"><div class="field-label">Servings</div><${Stepper} value=${servings} step=${0.25} min=${0.25} max=${5} onChange=${setServings} fmt=${fmtQty} /></div>
    <div class="macro-strip"><span><b>${fmtNum(meal.kcal * ratio)}</b> kcal</span><span><b>${fmtNum(meal.p * ratio)}</b> g P</span><span><b>${fmtNum(meal.c * ratio)}</b> g C</span><span><b>${fmtNum(meal.f * ratio)}</b> g F</span></div>
    <div class="field"><div class="field-label">Meal</div><div class="chips-row wrap">${SLOTS.map((x) => html`<${Chip} on=${slot === x.id} onClick=${() => setSlot(x.id)}>${x.label}</${Chip}>`)}</div></div>
    ${meal.recipeId ? html`<a class="link" href=${`#/recipes/${meal.recipeId}`} onClick=${onClose}>View recipe</a>` : null}
  </${Sheet}>`;
}

// ---------------------------------------------------------------- training
function TrainingLog({ date }) {
  const s = S();
  const [cardioOpen, setCardioOpen] = useState(false);
  const [view, setView] = useState(null);
  const ws = workoutsOn(date);
  const cs = cardioOn(date);
  const suggestion = WEEK_PLAN[dayIndex(date)];
  const recent = [...s.workouts].sort((a, b) => b.startedAt - a.startedAt).slice(0, 6);
  return html`<div>
    ${s.active ? html`<a class="card resume-card" href="#/workout">
      <div><div class="eyebrow">In progress</div><div class="resume-title">${s.active.name}</div></div>
      <span class="btn primary sm">Resume</span></a>` : null}

    ${suggestion?.rest ? html`<div class="card rest-card"><span class="rest-emoji">😴</span><div><b>Sunday is your rest day.</b><div class="muted small">Muscle is built during recovery. Sleep in, walk if you feel like it, and prep meals for the week.</div></div></div>` : null}
    <${Card} title="Start a workout" action=${suggestion?.lift ? html`<span class="muted small">Today: ${TEMPLATE_BY_ID[suggestion.lift].name}</span>` : null}>
      <div class="tpl-grid">
        ${TEMPLATES.map((tp) => html`<button class=${'tpl ' + (suggestion?.lift === tp.id ? 'suggested' : '')} onClick=${() => startWorkout(tp.id)} disabled=${!!s.active}>
          <span class="tpl-name">${tp.name}</span><span class="tpl-sub">${tp.sub}</span><span class="tpl-sub">~${tp.mins} min</span>
        </button>`)}
        <button class="tpl" onClick=${() => startWorkout(null)} disabled=${!!s.active}><span class="tpl-name">Empty</span><span class="tpl-sub">Build as you go</span></button>
      </div>
    </${Card}>

    <button class="btn secondary block" onClick=${() => setCardioOpen(true)}><${Icon} name="run" size=${18} /> Log a run or cardio</button>

    <div class="section-row"><h2 class="section-title">${fmtDayLabel(date)}</h2></div>
    ${!ws.length && !cs.length ? html`<div class="muted small pad">No sessions logged for this day.</div>` : null}
    ${ws.map((w) => html`<button class="card session" onClick=${() => setView(w)}>
      <span class="session-icon"><${Icon} name="dumbbell" /></span>
      <span class="session-main"><span class="session-name">${w.name}</span>
      <span class="muted small">${w.durationMin} min · ${w.exercises.reduce((a, e) => a + e.sets.length, 0)} sets · ${fmtNum(workoutVolume(w))} lb</span></span>
      <${Icon} name="right" size=${18} cls="muted" />
    </button>`)}
    ${cs.map((c) => html`<div class="card session">
      <span class="session-icon run"><${Icon} name="run" /></span>
      <span class="session-main"><span class="session-name">${CARDIO_BY_ID[c.type]?.label || 'Cardio'}</span>
      <span class="muted small">${c.miles ? `${fmtNum(c.miles, 2)} mi · ` : ''}${fmtDuration(c.sec)}${isRun(c) && c.miles ? ` · ${fmtPace(c.sec, c.miles)}` : ''}${c.effort ? ` · ${c.effort}` : ''}</span>
      ${c.notes ? html`<span class="muted small">${c.notes}</span>` : null}</span>
      <button class="icon-btn sm" aria-label="Delete" onClick=${() => confirmAction('Delete this session?') && actions.removeCardio(c.id)}><${Icon} name="trash" size=${17} /></button>
    </div>`)}

    ${recent.length ? html`<div class="section-row"><h2 class="section-title">Recent workouts</h2></div>
      <div class="card list-card">${recent.map((w) => html`<button class="mini-row" onClick=${() => setView(w)}>
        <span>${w.name} <span class="muted">· ${fmtMonthDay(w.date)}</span></span><span class="muted">${fmtNum(workoutVolume(w))} lb</span></button>`)}</div>` : null}

    <${CardioSheet} open=${cardioOpen} onClose=${() => setCardioOpen(false)} date=${date} />
    <${WorkoutDetailSheet} w=${view} onClose=${() => setView(null)} />
  </div>`;
}

function WorkoutDetailSheet({ w, onClose }) {
  if (!w) return html`<${Sheet} open=${false} onClose=${onClose} title="" />`;
  const del = () => { if (confirmAction('Delete this workout?')) { actions.removeWorkout(w.id); onClose(); } };
  return html`<${Sheet} open=${!!w} onClose=${onClose} title=${`${w.name} · ${fmtMonthDay(w.date)}`} footer=${html`<button class="btn ghost danger-text grow" onClick=${del}>Delete workout</button>`}>
    <div class="muted small" style="margin-bottom:10px">${w.durationMin} min · ${fmtNum(workoutVolume(w))} lb total volume</div>
    ${w.exercises.map((e) => html`<div class="detail-ex"><div class="detail-ex-name">${EXERCISES[e.exId]?.name || e.exId}</div>
      <div class="muted small">${e.sets.map((x) => (x.w ? `${x.w}×${x.r}` : `${x.r}`)).join('  ·  ')}</div></div>`)}
  </${Sheet}>`;
}

function CardioSheet({ open, onClose, date }) {
  const [type, setType] = useState('easy');
  const [miles, setMiles] = useState('');
  const [h, setH] = useState('');
  const [m, setM] = useState('');
  const [sec, setSec] = useState('');
  const [effort, setEffort] = useState('Easy');
  const [notes, setNotes] = useState('');
  const total = (Number(h) || 0) * 3600 + (Number(m) || 0) * 60 + (Number(sec) || 0);
  const run = CARDIO_BY_ID[type].run;
  const save = () => {
    if (!total) return toast('Add a duration');
    actions.addCardio({ date, type, miles: Number(miles) || 0, sec: total, effort, notes: notes.trim() });
    toast('Cardio logged');
    setMiles(''); setH(''); setM(''); setSec(''); setNotes('');
    onClose();
  };
  return html`<${Sheet} open=${open} onClose=${onClose} title="Log cardio" footer=${html`<button class="btn primary grow" onClick=${save}>Save</button>`}>
    <div class="chips-row wrap">${CARDIO_TYPES.map((c) => html`<${Chip} on=${type === c.id} onClick=${() => setType(c.id)}>${c.icon} ${c.label}</${Chip}>`)}</div>
    <div class="grid-2">
      <${NumInput} label="Distance" value=${miles} onInput=${setMiles} suffix="mi" placeholder=${run ? '3.1' : 'optional'} />
      <div class="field"><div class="num-label">Pace</div><div class="pace-out">${fmtPace(total, Number(miles))}</div></div>
    </div>
    <div class="field"><div class="num-label">Duration</div>
      <div class="dur-row">
        <${NumInput} value=${h} onInput=${setH} suffix="h" placeholder="0" />
        <${NumInput} value=${m} onInput=${setM} suffix="m" placeholder="30" />
        <${NumInput} value=${sec} onInput=${setSec} suffix="s" placeholder="0" />
      </div>
    </div>
    <div class="field"><div class="field-label">Effort</div><${Segmented} options=${[['Easy', 'Easy'], ['Moderate', 'Moderate'], ['Hard', 'Hard']]} value=${effort} onChange=${setEffort} /></div>
    <label class="field"><div class="field-label">Notes</div><input class="text-input" placeholder="Route, how you felt, shoes…" value=${notes} onInput=${(e) => setNotes(e.target.value)} /></label>
    <p class="muted small">Keep it easy enough to talk in full sentences. New to running? Alternate 1 minute running with 2 minutes walking. That counts as a run.</p>
  </${Sheet}>`;
}

// ---------------------------------------------------------------- check-in
const BRISTOL = [
  [1, 'Hard lumps'], [2, 'Lumpy sausage'], [3, 'Cracked sausage'], [4, 'Smooth & soft'], [5, 'Soft blobs'], [6, 'Mushy'], [7, 'Watery'],
];
function CheckIn({ date }) {
  const s = S();
  const c = s.checkins[date] || {};
  const habit = s.habits[date] || {};
  const set = (patch) => actions.saveCheckin(date, patch);
  const sym = c.symptoms || [];
  return html`<div>
    <${Card} title="How are you feeling?">
      <div class="field"><div class="field-label">Energy</div><${Rating} value=${c.energy} onChange=${(v) => set({ energy: v })} labels=${['Drained', '', '', '', 'Charged']} /></div>
      <div class="field"><div class="field-label">Mood</div><${Rating} value=${c.mood} onChange=${(v) => set({ mood: v })} labels=${['Low', '', '', '', 'Great']} /></div>
      <div class="field"><div class="field-label">Sex drive / vitality</div><${Rating} value=${c.libido} onChange=${(v) => set({ libido: v })} labels=${['Low', '', '', '', 'High']} /></div>
      <div class="field"><div class="field-label">Stress</div><${Rating} value=${c.stress} onChange=${(v) => set({ stress: v })} labels=${['Calm', '', '', '', 'Very stressed']} /></div>
      <div class="field"><div class="field-label">Sleep last night</div>
        <${Stepper} value=${c.sleep ?? 7.5} step=${0.5} min=${0} max=${14} onChange=${(v) => set({ sleep: v })} fmt=${(v) => `${v} h`} /></div>
    </${Card}>

    <${Card} title="Gut">
      <div class="field"><div class="field-label">Gut comfort</div><${Rating} value=${c.gut} onChange=${(v) => set({ gut: v })} labels=${['Rough', '', '', '', 'Perfect']} /></div>
      <div class="field"><div class="field-label">Symptoms today</div>
        <div class="chips-row wrap">${SYMPTOMS.map((x) => html`<${Chip} on=${sym.includes(x)} onClick=${() => set({ symptoms: sym.includes(x) ? sym.filter((y) => y !== x) : [...sym, x] })}>${x}</${Chip}>`)}</div></div>
      <div class="field"><div class="field-label">Stool type (Bristol scale)</div>
        <div class="bristol">${BRISTOL.map(([n, l]) => html`<button class=${c.bristol === n ? 'on' : ''} onClick=${() => set({ bristol: c.bristol === n ? null : n })}><b>${n}</b><span>${l}</span></button>`)}</div>
        <div class="muted small">Types 3–4 are ideal. 1–2 lean constipated, 6–7 lean loose.</div></div>
    </${Card}>

    <${Card} title="Habits">
      <div class="habit-row">
        <span>Pelvic floor exercises</span>
        <button class=${'toggle ' + (habit.kegels ? 'on' : '')} role="switch" aria-checked=${!!habit.kegels} onClick=${() => actions.setHabit(date, { kegels: !habit.kegels })}><span></span></button>
      </div>
      <div class="habit-row">
        <span>Water (8 oz glasses)</span>
        <${Stepper} value=${habit.water || 0} min=${0} max=${20} onChange=${(v) => actions.setHabit(date, { water: v })} />
      </div>
    </${Card}>

    <${Card} title="Journal">
      <textarea class="text-input" rows="5" placeholder="How did today go? Foods that bothered you, stress, workouts, sleep…" value=${c.notes || ''}
        onChange=${(e) => set({ notes: e.target.value })}></textarea>
      <div class="muted small">Saves automatically.</div>
    </${Card}>
  </div>`;
}

// ---------------------------------------------------------------- body weight
function BodyLog() {
  const s = S();
  const today = todayISO();
  const [lb, setLb] = useState('');
  const ws = s.weights;
  const save = () => {
    if (!lb || lb < 60 || lb > 600) return toast('Enter your weight in lb');
    actions.addWeight(today, Number(lb));
    setLb('');
    toast('Weight saved. Targets updated.');
  };
  const recent = [...ws].reverse().slice(0, 30);
  const weekAvg = (end) => { const v = ws.filter((w) => w.date > addDays(end, -7) && w.date <= end).map((w) => w.lb); return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null; };
  const thisAvg = weekAvg(today), lastAvg = weekAvg(addDays(today, -7));
  return html`<div>
    <${Card} title="Weigh-in">
      <div class="weigh-row">
        <${NumInput} value=${lb} onInput=${setLb} suffix="lb" placeholder=${ws.length ? String(ws[ws.length - 1].lb) : '190'} cls="grow" />
        <button class="btn primary" onClick=${save}>Save</button>
      </div>
      <p class="muted small">Weigh in the morning after the bathroom, before eating. Daily weight swings of 2–4 lb are normal; the weekly average is what matters.</p>
      ${thisAvg ? html`<div class="totals-row">
        <div><div class="big-num">${fmtNum(thisAvg, 1)}</div><div class="muted small">7-day average</div></div>
        ${lastAvg ? html`<div><div class="big-num">${thisAvg - lastAvg >= 0 ? '+' : ''}${fmtNum(thisAvg - lastAvg, 1)}</div><div class="muted small">vs previous week</div></div>` : null}
      </div>` : null}
    </${Card}>
    ${ws.length >= 2 ? html`<${Card} title="Trend">
      <${LineChart} series=${[{ name: 'Weight', color: 'var(--series-1)', values: ws.slice(-60).map((w) => w.lb) }]} labels=${ws.slice(-60).map((w) => ({ tick: fmtMonthDay(w.date).split(' ')[1], title: fmtMonthDay(w.date) }))} unit=" lb" />
    </${Card}>` : null}
    ${recent.length ? html`<div class="card list-card">${recent.map((w) => html`<div class="mini-row">
      <span>${fmtDayLabel(w.date)}</span><span><b>${fmtNum(w.lb, 1)}</b> lb <button class="icon-btn sm" aria-label="Delete" onClick=${() => confirmAction('Delete this weigh-in?') && actions.removeWeight(w.date)}><${Icon} name="x" size=${16} /></button></span>
    </div>`)}</div>` : null}
  </div>`;
}
