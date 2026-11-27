import { html, useState } from '../../vendor/preact-htm.js';
import { S, actions } from '../store.js';
import { targets, intakeOn, weekSummary, rangeDates, weeklySeries, mealsOn, streak } from '../stats.js';
import { RECIPE_BY_ID, SLOTS, analyze, itemTotals } from '../nutrition.js';
import { todayISO, weekStart, dayIndex, dowLetter, fmtMonthDay, dowLong, greeting, fmtNum, weekDays, addDays, fmtQty } from '../util.js';
import { BarChart, LineChart, Legend, Ring } from '../charts.js';
import { Icon, Card, Progress, Segmented, Empty, toast } from '../ui.js';
import { WEEK_PLAN, TEMPLATE_BY_ID, CARDIO_BY_ID } from '../data/workouts.js';
import { startWorkout } from './workout.js';

const SERIES = { energy: 'var(--series-1)', gut: 'var(--series-2)' };

export function HomeView() {
  const s = S();
  const t = targets();
  const today = todayISO();
  const intake = intakeOn(today);
  const [range, setRange] = useState(7);
  const [installHidden, setInstallHidden] = useState(() => { try { return localStorage.getItem('vigor:hideInstall') === '1'; } catch { return false; } });
  const wk = weekStart();
  const plan = s.plans[wk];
  const todayPlan = plan?.days?.[dayIndex(today)] || {};
  const sum = weekSummary(wk);
  const habit = s.habits[today] || {};
  const water = habit.water || 0;
  const checkin = s.checkins[today];
  const st = streak();
  const suggestion = WEEK_PLAN[dayIndex(today)];
  const standalone = window.navigator.standalone || window.matchMedia?.('(display-mode: standalone)').matches;

  const kcalLeft = Math.round(t.kcal - intake.kcal);
  const loggedToday = mealsOn(today);
  const isLogged = (slot, id) => loggedToday.some((m) => m.slot === slot && m.recipeId === id);
  const logPlanned = (slotId, item) => {
    const r = RECIPE_BY_ID[item.id]; const it = itemTotals(item);
    actions.logMeal({ date: today, slot: slotId, recipeId: r.id, name: r.name, servings: item.servings, kcal: Math.round(it.kcal), p: Math.round(it.p), c: Math.round(it.c), f: Math.round(it.f), fib: Math.round(it.fib), fromPlan: true });
    toast(`Logged ${r.name}`);
  };

  // ---------- chart data
  const dates = rangeDates(range);
  const tick = (d) => (range <= 7 ? dowLetter(d) : fmtMonthDay(d).split(' ')[1]);
  const dayData = (fn) => dates.map((d) => ({ value: fn(d), tick: tick(d), title: `${dowLong(d).slice(0, 3)}, ${fmtMonthDay(d)}`, today: d === today }));
  const kcalData = dayData((d) => intakeOn(d).kcal);
  const proteinData = dayData((d) => intakeOn(d).p);
  const lastIdx = dates.length - 1;
  const energy = dates.map((d) => s.checkins[d]?.energy ?? null);
  const gut = dates.map((d) => s.checkins[d]?.gut ?? null);
  const feelLabels = dates.map((d) => ({ tick: tick(d), title: `${dowLong(d).slice(0, 3)}, ${fmtMonthDay(d)}`, today: d === today }));
  const weights = s.weights.filter((w) => w.date >= addDays(today, -Math.max(range, 30) + 1));
  const liftWeeks = weeklySeries(8, (w) => weekSummary(w).lifts).map((x) => ({ value: x.value, tick: fmtMonthDay(x.wk).split(' ')[1], title: `Week of ${fmtMonthDay(x.wk)}`, today: x.wk === wk }));
  const runWeeks = weeklySeries(8, (w) => weekSummary(w)).map((x) => ({ value: x.value.runs, tick: fmtMonthDay(x.wk).split(' ')[1], title: `Week of ${fmtMonthDay(x.wk)} · ${fmtNum(x.value.miles, 1)} mi`, today: x.wk === wk }));
  const avg = (arr) => { const v = arr.filter((x) => x != null); return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null; };
  const hasIntake = kcalData.some((d) => d.value > 0);
  const hasFeel = energy.some((v) => v != null) || gut.some((v) => v != null);

  return html`<div class="page">
    <header class="page-head home-head">
      <div class="page-head-text">
        <div class="eyebrow">${dowLong(today)}, ${fmtMonthDay(today)}</div>
        <h1>${greeting()}${s.profile.name ? `, ${s.profile.name}` : ''}</h1>
      </div>
      ${st > 0 ? html`<div class="streak" title="Days in a row with something logged"><${Icon} name="flame" size=${18} /> ${st}</div>` : null}
    </header>

    ${!standalone && !installHidden ? html`<div class="install-tip">
      <${Icon} name="share" size=${20} />
      <div><b>Install Vigor:</b> tap the Share button in Safari, then <b>Add to Home Screen</b>.</div>
      <button class="icon-btn" aria-label="Dismiss" onClick=${() => { setInstallHidden(true); try { localStorage.setItem('vigor:hideInstall', '1'); } catch {} }}><${Icon} name="x" size=${18} /></button>
    </div>` : null}

    <!-- Today -->
    <${Card} cls="today">
      <div class="today-grid">
        <${Ring} value=${intake.kcal} max=${t.kcal} size=${128} stroke=${11} color="var(--sky)">
          <div class="ring-num">${fmtNum(Math.abs(kcalLeft))}</div>
          <div class="ring-sub">${kcalLeft >= 0 ? 'kcal left' : 'kcal over'}</div>
        </${Ring}>
        <div class="today-macros">
          <${MacroBar} label="Protein" value=${intake.p} max=${t.protein} color="var(--teal)" plus />
          <${MacroBar} label="Carbs" value=${intake.c} max=${t.carbs} color="var(--sky)" />
          <${MacroBar} label="Fat" value=${intake.f} max=${t.fat} color="var(--amber)" />
          <${MacroBar} label="Fiber" value=${intake.fib} max=${t.fiber} color="var(--slate)" />
        </div>
      </div>
      <div class="today-foot">
        <div class="water">
          <span class="water-label"><${Icon} name="drop" size=${16} /> ${water}/${t.water}</span>
          <div class="water-drops">
            ${Array.from({ length: t.water }, (_, i) => html`<button class=${'drop ' + (i < water ? 'on' : '')} aria-label=${`${i + 1} glasses`}
              onClick=${() => actions.setHabit(today, { water: i < water ? i : i + 1 })}></button>`)}
          </div>
        </div>
        <div class="today-actions">
          <button class=${'pill ' + (habit.kegels ? 'on' : '')} onClick=${() => actions.setHabit(today, { kegels: !habit.kegels })}>
            ${habit.kegels ? html`<${Icon} name="check" size=${14} />` : null} Kegels</button>
          <a class=${'pill ' + (checkin ? 'on' : '')} href="#/log/checkin">${checkin ? html`<${Icon} name="check" size=${14} />` : null} Daily check-in</a>
          <span class="muted small">${fmtNum(intake.kcal)} / ${fmtNum(t.kcal)} kcal</span>
        </div>
      </div>
    </${Card}>

    <!-- Today's menu -->
    <${Card} title="Today's menu" action=${html`<a class="link" href="#/plan">Plan</a>`}>
      ${Object.keys(todayPlan).length ? html`<div class="menu-list">
        ${SLOTS.filter((x) => todayPlan[x.id]).map((x) => {
          const it = todayPlan[x.id]; const r = RECIPE_BY_ID[it.id]; if (!r) return null;
          const done = isLogged(x.id, r.id); const tt = itemTotals(it);
          return html`<div class=${'menu-item ' + (done ? 'done' : '')}>
            <a class="menu-main" href=${`#/recipes/${r.id}`}>
              <span class="menu-slot">${x.label}</span>
              <span class="menu-name">${r.emoji} ${r.name}${it.servings !== 1 ? html` <span class="muted">×${fmtQty(it.servings)}</span>` : null}</span>
              <span class="menu-meta">${fmtNum(tt.kcal)} kcal · ${fmtNum(tt.p)} g protein</span>
            </a>
            <button class=${'check-btn ' + (done ? 'on' : '')} disabled=${done} aria-label=${done ? 'Logged' : 'Log this meal'} onClick=${() => logPlanned(x.id, it)}><${Icon} name="check" size=${18} /></button>
          </div>`;
        })}
      </div>` : html`<${Empty} icon="calendar" title="No meals planned for today" body="Plan your week to get a menu, a prep list and a grocery list." action=${html`<a class="btn primary" href="#/plan">Plan my week</a>`} />`}
    </${Card}>

    <!-- This week -->
    <${Card} title="This week" action=${html`<span class="muted small">Mon–Sun</span>`}>
      <div class="stat-grid">
        <${Stat} label="Lifting sessions" value=${sum.lifts} goal=${s.goals.workouts} />
        <${Stat} label=${`Runs · ${fmtNum(sum.miles, 1)} mi`} value=${sum.runs} goal=${s.goals.runs || 2} />
        <${Stat} label="Protein goal hit" value=${sum.proteinHits} goal=${7} unit="days" />
        <${Stat} label="Pelvic floor" value=${sum.pelvic} goal=${4} unit="sessions" />
      </div>
      ${suggestion ? html`<div class="suggest">
        <div><div class="muted small">${suggestion.rest ? 'Today' : 'Suggested today'}</div><div class="suggest-title">${suggestion.rest ? 'Rest day 😴' : [suggestion.lift && TEMPLATE_BY_ID[suggestion.lift].name, suggestion.cardio && CARDIO_BY_ID[suggestion.cardio].label + (suggestion.optional ? ' (optional)' : '')].filter(Boolean).join(' + ')}</div>
        <div class="muted small">${suggestion.note}</div></div>
        ${s.active ? html`<a class="btn secondary sm" href="#/workout">Resume</a>`
          : suggestion.rest ? html`<a class="btn secondary sm" href="#/plan/prep">Prep list</a>`
          : suggestion.lift ? html`<button class="btn secondary sm" onClick=${() => startWorkout(suggestion.lift)}>Start</button>`
          : html`<a class="btn secondary sm" href="#/log/training">Log</a>`}
      </div>` : null}
    </${Card}>

    <${Card} title="Training" action=${html`<span class="muted small">Last 8 weeks</span>`}>
      <div class="chart-title">Lifting sessions per week</div>
      <${BarChart} data=${liftWeeks} target=${s.goals.workouts} targetLabel=${`Goal ${s.goals.workouts}`} color="var(--teal)" unit=" sessions" height=${130} defaultSel=${7} />
      <div class="chart-title" style="margin-top:14px">Runs per week</div>
      <${BarChart} data=${runWeeks} target=${s.goals.runs || 2} targetLabel=${`Goal ${s.goals.runs || 2}`} color="var(--sky)" unit=" runs" height=${130} defaultSel=${7} />
    </${Card}>

    <!-- Trends: one filter row scopes everything below -->
    <div class="section-row">
      <h2 class="section-title">Trends</h2>
      <${Segmented} cls="seg-sm" options=${[[7, '7 days'], [30, '30 days']]} value=${range} onChange=${setRange} />
    </div>

    <${Card} title="Calories" action=${html`<span class="muted small">avg ${fmtNum(avg(kcalData.map((d) => d.value || null)) || 0)}</span>`}>
      ${hasIntake ? html`<${BarChart} data=${kcalData} target=${t.kcal} color="var(--sky)" unit=" kcal" defaultSel=${lastIdx} />`
        : html`<div class="chart-empty">Log meals to see your calorie trend.</div>`}
    </${Card}>

    <${Card} title="Protein" action=${html`<span class="muted small">avg ${fmtNum(avg(proteinData.map((d) => d.value || null)) || 0)} g</span>`}>
      ${hasIntake ? html`<${BarChart} data=${proteinData} target=${t.protein} targetLabel=${`Goal ${t.protein} g`} color="var(--teal)" unit=" g" defaultSel=${lastIdx} />`
        : html`<div class="chart-empty">Log meals to see your protein trend.</div>`}
    </${Card}>

    <${Card} title="How you feel" action=${html`<a class="link" href="#/log/checkin">Check in</a>`}>
      ${hasFeel ? html`
        <${Legend} items=${[{ label: 'Energy', color: SERIES.energy, line: true, value: avg(energy) != null ? fmtNum(avg(energy), 1) : null }, { label: 'Gut comfort', color: SERIES.gut, line: true, value: avg(gut) != null ? fmtNum(avg(gut), 1) : null }]} />
        <${LineChart} series=${[{ name: 'Energy', color: SERIES.energy, values: energy }, { name: 'Gut', color: SERIES.gut, values: gut }]} labels=${feelLabels} yMin=${1} yMax=${5} />
        <div class="muted small">Scale 1–5, from your daily check-ins. Tap the chart to inspect a day.</div>`
        : html`<div class="chart-empty">Do a daily check-in to track energy and gut comfort.</div>`}
    </${Card}>

    <${Card} title="Body weight" action=${html`<a class="link" href="#/log/body">Log</a>`}>
      ${weights.length >= 2 ? html`
        <${LineChart} series=${[{ name: 'Weight', color: 'var(--series-1)', values: weights.map((w) => w.lb) }]} labels=${weights.map((w) => ({ tick: fmtMonthDay(w.date).split(' ')[1], title: fmtMonthDay(w.date) }))} unit=" lb" />
        <div class="muted small">${fmtNum(weights[0].lb, 1)} → ${fmtNum(weights[weights.length - 1].lb, 1)} lb (${weights[weights.length - 1].lb - weights[0].lb >= 0 ? '+' : ''}${fmtNum(weights[weights.length - 1].lb - weights[0].lb, 1)}). Aim for +0.5 lb a week on a lean bulk.</div>`
        : html`<div class="chart-empty">Weigh in 2–3× a week (mornings, after the bathroom) to see your trend.</div>`}
    </${Card}>
  </div>`;
}

const MacroBar = ({ label, value, max, color, plus }) => html`<div class="macro-bar">
  <div class="macro-bar-top"><span>${label}</span><span><b>${fmtNum(value)}</b><span class="muted"> / ${fmtNum(max)}${plus ? '+' : ''} g</span></span></div>
  <${Progress} value=${value} max=${max} color=${color} height=${6} />
</div>`;

const Stat = ({ label, value, goal, unit }) => html`<div class="stat">
  <div class="stat-val">${fmtNum(value, 1)}<span class="stat-goal"> / ${goal}${unit ? ' ' + unit : ''}</span></div>
  <div class="stat-label">${label}</div>
  <${Progress} value=${value} max=${goal} color=${value >= goal ? 'var(--amber)' : 'var(--teal)'} height=${4} />
</div>`;
