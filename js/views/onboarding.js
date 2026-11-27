import { html, useState } from '../../vendor/preact-htm.js';
import { update } from '../store.js';
import { ACTIVITY, GOALS, computeTargets, RECIPES } from '../nutrition.js';
import { NumInput } from '../ui.js';
import { fmtNum, todayISO } from '../util.js';

export function Onboarding() {
  const [step, setStep] = useState(0);
  const [p, setP] = useState({ name: '', age: '', ft: '', inch: '', weightLb: '', activity: 'moderate', goal: 'lean_bulk' });
  const set = (patch) => setP({ ...p, ...patch });
  const heightIn = (Number(p.ft) || 0) * 12 + (Number(p.inch) || 0);
  const valid = Number(p.age) >= 13 && heightIn >= 48 && Number(p.weightLb) >= 70;
  const t = computeTargets({ ...p, heightIn, sex: 'male' });
  const finish = () => {
    update((s) => {
      s.profile = { ...s.profile, name: p.name.trim(), age: Number(p.age), heightIn, weightLb: Number(p.weightLb), sex: 'male', activity: p.activity, goal: p.goal, onboarded: true };
      s.weights = [{ date: todayISO(), lb: Number(p.weightLb) }];
    });
    location.hash = '#/home';
  };

  if (step === 0) return html`<div class="onboard">
    <div class="onboard-hero">
      <img src="icons/icon-192.png" alt="" width="88" height="88" class="onboard-logo" />
      <h1>Vigor</h1>
      <p>Train, eat and feel better. Your workouts, meal prep, gut journal and progress in one place.</p>
    </div>
    <ul class="onboard-list">
      <li><b>${RECIPES.length} recipes</b> for muscle, energy and vitality, each with a FODMAP rating for IBS</li>
      <li><b>Weekly planning:</b> pick 2–3 meals to prep and get a prep list and full grocery list</li>
      <li><b>Workout & run logging</b> with progress charts (Sundays are rest days)</li>
      <li><b>Gut journal</b> that finds your trigger foods</li>
    </ul>
    <button class="btn primary block lg" onClick=${() => setStep(1)}>Get started</button>
    <p class="muted small center">Private by design: your data stays on this phone.</p>
  </div>`;

  return html`<div class="onboard">
    <h1 class="onboard-title">About you</h1>
    <p class="muted">Used to calculate your calorie and protein targets.</p>
    <label class="field"><div class="field-label">First name (optional)</div><input class="text-input" value=${p.name} onInput=${(e) => set({ name: e.target.value })} /></label>
    <div class="grid-3">
      <${NumInput} label="Age" value=${p.age} onInput=${(v) => set({ age: v })} placeholder="22" />
      <${NumInput} label="Height" value=${p.ft} onInput=${(v) => set({ ft: v })} suffix="ft" placeholder="6" />
      <${NumInput} label=" " value=${p.inch} onInput=${(v) => set({ inch: v })} suffix="in" placeholder="4" />
    </div>
    <${NumInput} label="Weight" value=${p.weightLb} onInput=${(v) => set({ weightLb: v })} suffix="lb" placeholder="190" />
    <div class="field"><div class="field-label">Activity</div>
      ${Object.entries(ACTIVITY).map(([k, a]) => html`<button class=${'option ' + (p.activity === k ? 'on' : '')} onClick=${() => set({ activity: k })}><b>${a.label}</b><span class="muted small">${a.desc}</span></button>`)}</div>
    <div class="field"><div class="field-label">Goal</div>
      ${Object.entries(GOALS).map(([k, g]) => html`<button class=${'option ' + (p.goal === k ? 'on' : '')} onClick=${() => set({ goal: k })}><b>${g.label}</b></button>`)}</div>
    ${valid ? html`<div class="card onboard-targets">
      <div class="muted small">Your daily targets</div>
      <div class="target-grid">
        <div><div class="big-num">${fmtNum(t.kcal)}</div><div class="muted small">kcal</div></div>
        <div><div class="big-num">${t.protein}<small>g</small></div><div class="muted small">protein</div></div>
        <div><div class="big-num">${t.carbs}<small>g</small></div><div class="muted small">carbs</div></div>
        <div><div class="big-num">${t.fat}<small>g</small></div><div class="muted small">fat</div></div>
      </div>
    </div>` : null}
    <button class="btn primary block lg" disabled=${!valid} onClick=${finish}>Start using Vigor</button>
  </div>`;
}
