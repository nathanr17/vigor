import { html, useState } from '../../vendor/preact-htm.js';
import { S, update, exportJSON, importJSON, resetAll, getSaveError } from '../store.js';
import { targets, gutInsights, REACTIONS } from '../stats.js';
import { ACTIVITY, GOALS, computeTargets, RECIPE_BY_ID } from '../nutrition.js';
import { PRODUCT_SECTIONS, EVIDENCE, SNACK_IDEAS, VITALITY_HABITS, IBS_GUIDE } from '../data/products.js';
import { WEEK_PLAN, TEMPLATE_BY_ID, CARDIO_BY_ID, TEMPLATES, EXERCISES } from '../data/workouts.js';
import { Icon, Header, Card, Chip, Segmented, NumInput, Empty, toast, confirmAction } from '../ui.js';
import { BarChart } from '../charts.js';
import { fmtNum, todayISO } from '../util.js';
import { startWorkout } from './workout.js';

const PAGES = [
  ['gut', 'Gut insights', 'leaf', 'Patterns from your food journal'],
  ['vitality', 'Vitality guide', 'heart', 'Evidence-based habits for sexual health'],
  ['training', 'Training plan', 'dumbbell', 'Your weekly lifting + cardio split'],
  ['products', 'Products & snacks', 'bag', 'Supplements, gear and snack ideas'],
  ['settings', 'Profile & targets', 'sliders', 'Body stats, goals, calorie targets'],
  ['backup', 'Backup & data', 'download', 'Export, import, reset'],
];

export function MoreView({ sub }) {
  const back = () => (location.hash = '#/more');
  switch (sub) {
    case 'gut': return html`<${GutInsights} back=${back} />`;
    case 'vitality': return html`<${VitalityGuide} back=${back} />`;
    case 'training': return html`<${TrainingPlan} back=${back} />`;
    case 'products': return html`<${Products} back=${back} />`;
    case 'settings': return html`<${Settings} back=${back} />`;
    case 'backup': return html`<${Backup} back=${back} />`;
  }
  const s = S();
  return html`<div class="page">
    <${Header} title="More" />
    <div class="card list-card">
      ${PAGES.map(([id, title, icon, sub]) => html`<a class="menu-link" href=${`#/more/${id}`}>
        <span class="menu-icon"><${Icon} name=${icon} size=${20} /></span>
        <span class="menu-text"><span class="menu-title">${title}</span><span class="muted small">${sub}</span></span>
        <${Icon} name="right" size=${18} cls="muted" />
      </a>`)}
    </div>
    ${!s.backupAt || Date.now() - s.backupAt > 14 * 864e5 ? html`<a class="card backup-nag" href="#/more/backup">
      <${Icon} name="download" size=${20} /><span><b>Back up your data.</b> Everything is stored only on this phone. Export a backup every couple of weeks.</span></a>` : null}
    <p class="muted small center about">Vigor · offline-first · your data never leaves this device.<br />Nutrition values are estimates from USDA data. This app is not medical advice.</p>
  </div>`;
}

// ---------------------------------------------------------------- gut insights
function GutInsights({ back }) {
  const g = gutInsights();
  const [tab, setTab] = useState('insights');
  return html`<div class="page">
    <${Header} title="Gut insights" back=${back} />
    <${Segmented} options=${[['insights', 'Your patterns'], ['guide', 'IBS guide']]} value=${tab} onChange=${setTab} />
    ${tab === 'guide' ? html`${IBS_GUIDE.map((x) => html`<${Card} title=${x.title}><p class="small">${x.body}</p></${Card}>`)}` : g.total < 3 ? html`
      <${Empty} icon="leaf" title="Keep journaling" body=${`You've rated ${g.total} meal${g.total === 1 ? '' : 's'}. After logging a meal, tap the leaf icon to record how it sat. Patterns appear after a few ratings and get reliable after 2–3 weeks.`} action=${html`<a class="btn primary" href="#/log/food">Go to food log</a>`} />` : html`
      <div class="stat-grid">
        <div class="stat"><div class="stat-val">${g.total}</div><div class="stat-label">Meals rated</div></div>
        <div class="stat"><div class="stat-val">${Math.round(g.baseline * 100)}%</div><div class="stat-label">Had a bad reaction</div></div>
      </div>
      ${g.groups.length ? html`<${Card} title="Reactions by FODMAP group">
        <div class="chart-title">Share of meals with discomfort (bad = 1, some = ½)</div>
        <${BarChart} data=${g.groups.map((x) => ({ value: Math.round(x.rate * 100), tick: SHORT[x.group] || x.group, title: `${x.label} · ${x.n} meal${x.n === 1 ? '' : 's'}` }))} color="var(--amber-mark)" unit="%" height=${150} max=${100} />
        <p class="muted small">Groups appear when a recipe contained them above low-FODMAP portions. Compare against the "Low-FODMAP" bar. A group well above it is worth testing properly during reintroduction.</p>
      </${Card}>` : null}
      ${g.triggers.length ? html`<${Card} title="Possible triggers">
        ${g.triggers.map((f) => html`<${FoodStat} f=${f} />`)}
      </${Card}>` : null}
      ${g.ings.length ? html`<${Card} title="Ingredients to watch">
        ${g.ings.map((x) => html`<div class="mini-row static"><span>${x.name}${x.fod ? html` <span class="badge sm fod-${x.fod}">FODMAP</span>` : null}</span><span class="muted small">${x.bad} bad · ${x.meh} meh / ${x.n}</span></div>`)}
        <p class="muted small">FODMAP-flagged ingredients are listed first. The others simply appeared in the same meals and may be innocent.</p>
      </${Card}>` : null}
      ${g.safe.length ? html`<${Card} title="Sits well with you">
        ${g.safe.map((f) => html`<${FoodStat} f=${f} />`)}
      </${Card}>` : null}
      <p class="muted small">These are correlations from your own logs, not a diagnosis. Stress, sleep and portion size matter too. A FODMAP-trained dietitian can help you run structured reintroductions.</p>
    `}
  </div>`;
}
const SHORT = { none: 'Low-FOD', fructans: 'Fructans', gos: 'GOS', lactose: 'Lactose', fructose: 'Fructose', sorbitol: 'Sorbitol', mannitol: 'Mannitol' };
const FoodStat = ({ f }) => html`<a class="mini-row" href=${f.recipeId ? `#/recipes/${f.recipeId}` : undefined}>
  <span>${f.recipeId && RECIPE_BY_ID[f.recipeId] ? `${RECIPE_BY_ID[f.recipeId].emoji} ${RECIPE_BY_ID[f.recipeId].name}` : f.name}</span>
  <span class="react-counts">${['good', 'meh', 'bad'].map((k) => f[k] ? html`<span>${REACTIONS[k].emoji}${f[k]}</span>` : null)}</span>
</a>`;

// ---------------------------------------------------------------- vitality
function VitalityGuide({ back }) {
  return html`<div class="page">
    <${Header} title="Vitality guide" back=${back} />
    <p class="lede">Sexual health is mostly blood-vessel health, hormones, and nervous-system calm. That means training, sleep and food are the levers with the biggest effect.</p>
    ${VITALITY_HABITS.map((h, i) => html`<${Card}><div class="habit-card"><span class="habit-num">${i + 1}</span><div><h3>${h.title}</h3><p class="small">${h.body}</p></div></div></${Card}>`)}
    <${Card} title="Foods to lean on">
      <div class="food-tags">
        ${[['🥬', 'Arugula & spinach', 'Nitrates'], ['🫐', 'Berries', 'Flavonoids'], ['🍫', 'Dark chocolate / cocoa', 'Flavonoids, magnesium'], ['🐟', 'Salmon', 'Omega-3, vitamin D'], ['🥩', 'Lean beef', 'Zinc'], ['🎃', 'Pumpkin seeds', 'Zinc, magnesium'], ['🌰', 'Brazil nuts (1/day)', 'Selenium'], ['🥚', 'Eggs', 'Vitamin D, choline'], ['🍊', 'Citrus', 'Flavonoids'], ['🫒', 'Olive oil', 'Healthy fats']]
          .map(([e, n, w]) => html`<div class="food-tag"><span>${e}</span><div><b>${n}</b><div class="muted small">${w}</div></div></div>`)}
      </div>
      <a class="btn secondary block" href="#/recipes" onClick=${() => setTimeout(() => {}, 0)}>Browse vitality recipes</a>
    </${Card}>
    <p class="muted small">Persistent changes in erections, drive or energy are worth a doctor visit. They're common and treatable, and can be an early signal of heart or hormone issues.</p>
  </div>`;
}

// ---------------------------------------------------------------- training plan
function TrainingPlan({ back }) {
  const s = S();
  const [open, setOpen] = useState(null);
  return html`<div class="page">
    <${Header} title="Training plan" back=${back} />
    <p class="lede">A 4-day push / pull / legs / upper split for muscle, plus 3 cardio sessions (about 150 min a week) for heart and vascular health.</p>
    <div class="card list-card">
      ${WEEK_PLAN.map((d) => html`<div class="plan-day">
        <span class="plan-dow">${d.day}</span>
        <span class="plan-what"><b>${[d.lift && d.lift !== 'pelvic' ? TEMPLATE_BY_ID[d.lift].name : null, d.cardio ? CARDIO_BY_ID[d.cardio].label : null].filter(Boolean).join(' + ') || 'Rest'}</b>
          ${d.lift === 'pelvic' ? html`<span class="muted small"> + pelvic floor</span>` : null}
          <span class="muted small">${d.note}</span></span>
      </div>`)}
    </div>
    <${Card} title="Progression">
      <p class="small">Work in the listed rep range. When you hit the top of the range on every set, add 5 lb (upper body) or 10 lb (lower body) next session. The logger pre-fills last session's numbers and tells you when to go up.</p>
      <p class="small">Leave 1–3 reps in reserve on most sets. Sleep 7–9 hours and eat at your targets. Muscle is built during recovery.</p>
      <p class="small">At 6'4", long levers make squats and deadlifts harder. Prioritize mobility and bracing, and use straps on heavy pulls if your grip limits you.</p>
    </${Card}>
    <${Card} title="Cardio">
      <p class="small"><b>Zone 2</b> (conversational pace, ~60–70% max HR) builds your aerobic base and vascular health, and is easy to recover from. <b>Intervals</b> once a week raise your VO₂ max. Keep about 80% of your running easy.</p>
      <p class="small">Weekly goal: ${s.goals.cardioMiles} miles. Change it in Profile & targets.</p>
    </${Card}>
    <h2 class="section-title">Workouts</h2>
    ${TEMPLATES.map((t) => html`<div class="card">
      <button class="tpl-row" onClick=${() => setOpen(open === t.id ? null : t.id)}>
        <span><b>${t.name}</b><div class="muted small">${t.sub} · ~${t.mins} min</div></span><${Icon} name="down" size=${18} cls=${open === t.id ? 'flip' : ''} />
      </button>
      ${open === t.id ? html`<ul class="tpl-ex">${t.ex.map(([id, sets, reps]) => html`<li><span>${EXERCISES[id].name}</span><span class="muted">${sets} × ${reps}</span></li>`)}</ul>
        <button class="btn primary block" onClick=${() => startWorkout(t.id)} disabled=${!!s.active}>Start ${t.name}</button>` : null}
    </div>`)}
  </div>`;
}

// ---------------------------------------------------------------- products
function Products({ back }) {
  const [tab, setTab] = useState('supps');
  const [focus, setFocus] = useState('all');
  const sec = PRODUCT_SECTIONS.find((x) => x.id === tab);
  return html`<div class="page">
    <${Header} title="Products & snacks" back=${back} />
    <${Segmented} options=${[['supps', 'Supplements'], ['gear', 'Gear'], ['grocery', 'Staples'], ['snacks', 'Snacks']]} value=${tab} onChange=${setTab} />
    ${tab === 'snacks' ? html`
      <p class="muted small">Grab-and-go snacks for steady energy. Snacks marked "check label" can hide garlic, onion, inulin or sugar alcohols.</p>
      <div class="card list-card">${SNACK_IDEAS.map((x) => html`<div class="mini-row static"><span>${x.name}${!x.low ? html` <span class="badge sm fod-mod">check label</span>` : ''}</span><span class="muted small">${x.kcal} kcal · ${x.p} g</span></div>`)}</div>
      <a class="btn secondary block" href="#/recipes" >See snack recipes</a>` : html`
      ${sec.intro ? html`<p class="muted small">${sec.intro}</p>` : null}
      ${tab === 'supps' ? html`<div class="chips-row scroll">${[['all', 'All'], ['muscle', 'Muscle'], ['vitality', 'Vitality'], ['gut', 'Gut / IBS'], ['cardio', 'Cardio']].map(([v, l]) => html`<${Chip} on=${focus === v} onClick=${() => setFocus(v)}>${l}</${Chip}>`)}</div>` : null}
      ${sec.items.filter((x) => focus === 'all' || tab !== 'supps' || x.for.includes(focus)).map((x) => html`<div class=${'card product ' + (x.ev === 'avoid' ? 'avoid' : '')}>
        <div class="product-head"><h3>${x.name}</h3><span class=${'badge sm ev-' + x.ev}>${EVIDENCE[x.ev].label}</span></div>
        ${x.dose ? html`<div class="product-dose">${x.dose}</div>` : null}
        <p class="small">${x.why}</p>
        ${x.ibs ? html`<p class="small product-ibs"><${Icon} name="leaf" size=${14} /> ${x.ibs}</p>` : null}
        ${x.look ? html`<p class="small muted"><b>Look for:</b> ${x.look}</p>` : null}
      </div>`)}`}
  </div>`;
}

// ---------------------------------------------------------------- settings
function Settings({ back }) {
  const s = S();
  const p = s.profile;
  const t = targets();
  const set = (patch) => update((st) => { st.profile = { ...st.profile, ...patch }; });
  const setGoal = (patch) => update((st) => { st.goals = { ...st.goals, ...patch }; });
  const setO = (patch) => update((st) => { st.profile.overrides = { ...st.profile.overrides, ...patch }; });
  const ft = Math.floor((Number(p.heightIn) || 0) / 12), inch = (Number(p.heightIn) || 0) % 12;
  const auto = computeTargets({ ...p, overrides: {} });
  return html`<div class="page">
    <${Header} title="Profile & targets" back=${back} />
    <${Card} title="You">
      <label class="field"><div class="field-label">Name (optional)</div><input class="text-input" value=${p.name} onInput=${(e) => set({ name: e.target.value })} /></label>
      <div class="grid-3">
        <${NumInput} label="Age" value=${p.age} onInput=${(v) => set({ age: v })} />
        <${NumInput} label="Height" value=${ft || ''} onInput=${(v) => set({ heightIn: (Number(v) || 0) * 12 + inch })} suffix="ft" />
        <${NumInput} label=" " value=${inch} onInput=${(v) => set({ heightIn: ft * 12 + (Number(v) || 0) })} suffix="in" />
      </div>
      <${NumInput} label="Weight" value=${p.weightLb} onInput=${(v) => set({ weightLb: v })} suffix="lb" />
      <div class="field"><div class="field-label">Activity</div>
        ${Object.entries(ACTIVITY).map(([k, a]) => html`<button class=${'option ' + (p.activity === k ? 'on' : '')} onClick=${() => set({ activity: k })}><b>${a.label}</b><span class="muted small">${a.desc}</span></button>`)}</div>
      <div class="field"><div class="field-label">Goal</div>
        ${Object.entries(GOALS).map(([k, g]) => html`<button class=${'option ' + (p.goal === k ? 'on' : '')} onClick=${() => set({ goal: k })}><b>${g.label}</b></button>`)}</div>
    </${Card}>

    <${Card} title="Daily targets">
      <div class="target-grid">
        <div><div class="big-num">${fmtNum(t.kcal)}</div><div class="muted small">kcal</div></div>
        <div><div class="big-num">${t.protein}<small>g</small></div><div class="muted small">protein (min)</div></div>
        <div><div class="big-num">${t.carbs}<small>g</small></div><div class="muted small">carbs</div></div>
        <div><div class="big-num">${t.fat}<small>g</small></div><div class="muted small">fat</div></div>
      </div>
      <p class="muted small">Calculated with the Mifflin–St Jeor equation: BMR ${fmtNum(t.bmr)} × activity = ${fmtNum(t.tdee)} maintenance, ${GOALS[p.goal]?.kcal >= 0 ? '+' : ''}${GOALS[p.goal]?.kcal} for your goal. Protein is ${GOALS[p.goal]?.pPerLb} g per lb. If your weekly average weight isn't moving as intended after 2–3 weeks, adjust by 150–200 kcal.</p>
      <div class="grid-2">
        <${NumInput} label="Override calories" value=${p.overrides?.kcal || ''} placeholder=${String(auto.kcal)} onInput=${(v) => setO({ kcal: v })} suffix="kcal" />
        <${NumInput} label="Override protein" value=${p.overrides?.protein || ''} placeholder=${String(auto.protein)} onInput=${(v) => setO({ protein: v })} suffix="g" />
      </div>
    </${Card}>

    <${Card} title="Weekly goals">
      <div class="grid-2">
        <${NumInput} label="Lifting sessions" value=${s.goals.workouts} onInput=${(v) => setGoal({ workouts: v || 0 })} suffix="/wk" />
        <${NumInput} label="Run miles" value=${s.goals.cardioMiles} onInput=${(v) => setGoal({ cardioMiles: v || 0 })} suffix="mi" />
      </div>
      <${NumInput} label="Rest timer between sets" value=${s.settings.restSec} onInput=${(v) => update((st) => { st.settings.restSec = v || 90; })} suffix="sec" />
    </${Card}>
  </div>`;
}

function Backup({ back }) {
  const s = S();
  const err = getSaveError();
  const doExport = async () => {
    const json = exportJSON();
    const name = `vigor-backup-${todayISO()}.json`;
    try {
      const file = new File([json], name, { type: 'application/json' });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Vigor backup' });
      } else {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(file); a.download = name; a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      }
      update((st) => { st.backupAt = Date.now(); });
      toast('Backup created. Save it to Files or iCloud Drive.');
    } catch (e) { if (e?.name !== 'AbortError') toast('Export failed: ' + e.message); }
  };
  const doImport = (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        if (!confirmAction('Replace all current data with this backup?')) return;
        importJSON(reader.result); toast('Backup restored');
      } catch (er) { toast(er.message); }
    };
    reader.readAsText(f);
    e.target.value = '';
  };
  const count = s.meals.length + s.workouts.length + s.cardio.length + Object.keys(s.checkins).length;
  return html`<div class="page">
    <${Header} title="Backup & data" back=${back} />
    ${err ? html`<div class="card warn">Saving failed on this device: ${String(err.message || err)}. Export a backup now.</div>` : null}
    <${Card} title="Your data">
      <p class="small">Everything (${count} log entries) is stored privately on this iPhone. Nothing is uploaded anywhere. If you delete the app from your home screen or clear Safari website data, it's gone, so export a backup regularly.</p>
      <p class="muted small">Last backup: ${s.backupAt ? new Date(s.backupAt).toLocaleDateString() : 'never'}</p>
      <button class="btn primary block" onClick=${doExport}><${Icon} name="download" size=${18} /> Export backup</button>
      <label class="btn secondary block file-btn"><${Icon} name="upload" size=${18} /> Restore from backup<input type="file" accept="application/json,.json" onChange=${doImport} /></label>
    </${Card}>
    <${Card} title="Start over">
      <p class="small muted">Deletes every log, plan and setting on this device.</p>
      <button class="btn ghost block danger-text" onClick=${() => { if (confirmAction('Delete ALL data? This cannot be undone.') && confirmAction('Really delete everything?')) { resetAll(); location.hash = '#/home'; } }}>Reset all data</button>
    </${Card}>
  </div>`;
}
