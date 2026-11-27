import { html, useState, useEffect } from '../../vendor/preact-htm.js';
import { S, update } from '../store.js';
import { lastPerformance, bestSet, workoutVolume } from '../stats.js';
import { EXERCISES, EXERCISE_GROUPS, TEMPLATE_BY_ID } from '../data/workouts.js';
import { Icon, Sheet, toast, confirmAction } from '../ui.js';
import { todayISO, uid, fmtDuration, fmtNum } from '../util.js';

function newExercise(exId, target = '', setCount = 3) {
  const last = lastPerformance(exId);
  const sets = Array.from({ length: setCount }, (_, i) => {
    const ls = last?.sets[Math.min(i, last.sets.length - 1)];
    return { w: ls?.w ?? '', r: ls?.r ?? '', done: false };
  });
  return { exId, target, sets };
}

export function startWorkout(templateId) {
  const s = S();
  if (s.active) { location.hash = '#/workout'; return; }
  const tpl = TEMPLATE_BY_ID[templateId];
  update((st) => {
    st.active = {
      id: uid(), templateId: tpl?.id || 'custom', name: tpl?.name || 'Workout', date: todayISO(), startedAt: Date.now(),
      exercises: (tpl?.ex || []).map(([exId, sets, reps]) => newExercise(exId, reps, sets)),
    };
  });
  location.hash = '#/workout';
}

function useTick(ms = 1000) {
  const [, set] = useState(0);
  useEffect(() => { const h = setInterval(() => set((x) => x + 1), ms); return () => clearInterval(h); }, [ms]);
}

export function WorkoutSession() {
  const s = S();
  const w = s.active;
  useTick(1000);
  const [rest, setRest] = useState(null); // { until }
  const [adding, setAdding] = useState(false);
  const [info, setInfo] = useState(null);
  if (!w) {
    return html`<div class="page"><div class="empty"><div class="empty-title">No workout in progress</div><a class="btn primary" href="#/log/training">Start one</a></div></div>`;
  }
  const elapsed = (Date.now() - w.startedAt) / 1000;
  const restLeft = rest ? Math.max(0, Math.round((rest.until - Date.now()) / 1000)) : 0;
  if (rest && restLeft === 0 && !rest.done) { rest.done = true; try { navigator.vibrate?.(300); } catch {} }

  const edit = (fn) => update((st) => fn(st.active));
  const setField = (ei, si, k, v) => edit((a) => { a.exercises[ei].sets[si][k] = v; });
  const toggleDone = (ei, si) => {
    const wasDone = w.exercises[ei].sets[si].done;
    edit((a) => {
      const st = a.exercises[ei].sets[si];
      st.done = !st.done;
      if (st.done && (st.w === '' || st.r === '')) {
        const prev = a.exercises[ei].sets[si - 1];
        if (prev) { if (st.w === '') st.w = prev.w; if (st.r === '') st.r = prev.r; }
      }
    });
    if (!wasDone) setRest({ until: Date.now() + (s.settings.restSec || 90) * 1000 });
  };
  const addSet = (ei) => edit((a) => { const sets = a.exercises[ei].sets; const l = sets[sets.length - 1] || { w: '', r: '' }; sets.push({ w: l.w, r: l.r, done: false }); });
  const removeSet = (ei, si) => edit((a) => { a.exercises[ei].sets.splice(si, 1); });
  const removeEx = (ei) => { if (confirmAction('Remove this exercise?')) edit((a) => { a.exercises.splice(ei, 1); }); };
  const addEx = (exId) => { edit((a) => { a.exercises.push(newExercise(exId, '', 3)); }); setAdding(false); };
  const moveEx = (ei, dir) => edit((a) => { const j = ei + dir; if (j < 0 || j >= a.exercises.length) return; [a.exercises[ei], a.exercises[j]] = [a.exercises[j], a.exercises[ei]]; });

  const finish = () => {
    const done = w.exercises.map((e) => ({ ...e, sets: e.sets.filter((x) => x.done) })).filter((e) => e.sets.length);
    if (!done.length) { if (confirmAction('No sets are checked off. Discard this workout?')) discard(true); return; }
    const record = { id: w.id, date: w.date, templateId: w.templateId, name: w.name, startedAt: w.startedAt, durationMin: Math.round(elapsed / 60), exercises: done };
    const prs = done.filter((e) => { const prev = lastPerformance(e.exId, w.startedAt); const b = bestSet(e.sets); const pb = prev && bestSet(prev.sets); return b && pb && b.e1rm > pb.e1rm; }).length;
    update((st) => { st.workouts.push(record); st.active = null; });
    toast(`Saved · ${done.reduce((a, e) => a + e.sets.length, 0)} sets · ${fmtNum(workoutVolume(record))} lb volume${prs ? ` · ${prs} PR${prs > 1 ? 's' : ''} 🎉` : ''}`);
    location.hash = '#/log/training';
  };
  const discard = (skipConfirm) => {
    if (!skipConfirm && !confirmAction('Discard this workout? Nothing will be saved.')) return;
    update((st) => { st.active = null; });
    location.hash = '#/log/training';
  };

  const totalSets = w.exercises.reduce((a, e) => a + e.sets.length, 0);
  const doneSets = w.exercises.reduce((a, e) => a + e.sets.filter((x) => x.done).length, 0);

  return html`<div class="page workout-page">
    <header class="workout-head">
      <button class="icon-btn" onClick=${() => (location.hash = '#/log/training')} aria-label="Minimize"><${Icon} name="down" size=${26} /></button>
      <div class="workout-head-mid">
        <div class="workout-title">${w.name}</div>
        <div class="muted small"><${Icon} name="clock" size=${13} /> ${fmtDuration(elapsed)} · ${doneSets}/${totalSets} sets</div>
      </div>
      <button class="btn primary sm" onClick=${finish}>Finish</button>
    </header>

    ${w.exercises.map((e, ei) => {
      const ex = EXERCISES[e.exId] || { name: e.exId, kind: 'weight' };
      const last = lastPerformance(e.exId, w.startedAt);
      const allHit = e.sets.length && e.sets.every((x) => x.done) && e.target && topOfRange(e.target) && e.sets.every((x) => Number(x.r) >= topOfRange(e.target));
      const weighted = ex.kind === 'weight' || ex.kind === 'bodyweight';
      return html`<section class="card ex-card" key=${ei}>
        <div class="ex-head">
          <div>
            <div class="ex-name">${ex.name}</div>
            <div class="muted small">${e.target ? `${e.sets.length} × ${e.target}` : ex.group}${last ? ` · Last: ${last.sets.slice(0, 3).map((x) => (x.w ? `${x.w}×${x.r}` : `${x.r}`)).join(', ')}` : ''}</div>
          </div>
          <div class="ex-tools">
            ${ex.tip ? html`<button class="icon-btn sm" aria-label="Tips" onClick=${() => setInfo(ex)}><${Icon} name="info" size=${18} /></button>` : null}
            <button class="icon-btn sm" aria-label="Move up" onClick=${() => moveEx(ei, -1)}><${Icon} name="down" size=${18} cls="flip" /></button>
            <button class="icon-btn sm" aria-label="Remove exercise" onClick=${() => removeEx(ei)}><${Icon} name="trash" size=${17} /></button>
          </div>
        </div>
        <div class="set-table">
          <div class="set-row set-head"><span>Set</span><span>${ex.kind === 'time' ? '' : ex.kind === 'bodyweight' ? '+lb' : weighted ? 'lb' : ''}</span><span>${ex.kind === 'time' ? 'sec' : 'reps'}</span><span></span></div>
          ${e.sets.map((st, si) => html`<div class=${'set-row ' + (st.done ? 'done' : '')} key=${si}>
            <button class="set-num" onClick=${() => e.sets.length > 1 && confirmAction(`Delete set ${si + 1}?`) && removeSet(ei, si)} aria-label=${`Set ${si + 1}`}>${si + 1}</button>
            ${weighted ? html`<input type="number" inputmode="decimal" placeholder=${ex.kind === 'bodyweight' ? 'BW' : 'lb'} value=${st.w} onInput=${(ev) => setField(ei, si, 'w', ev.target.value === '' ? '' : Number(ev.target.value))} />` : html`<span></span>`}
            <input type="number" inputmode="numeric" placeholder=${String(topOfRange(e.target) || (ex.kind === 'time' ? 45 : 10))} value=${st.r} onInput=${(ev) => setField(ei, si, 'r', ev.target.value === '' ? '' : Number(ev.target.value))} />
            <button class=${'check-btn ' + (st.done ? 'on' : '')} onClick=${() => toggleDone(ei, si)} aria-label=${st.done ? 'Mark not done' : 'Mark set done'}><${Icon} name="check" size=${18} /></button>
          </div>`)}
        </div>
        <div class="ex-foot">
          <button class="link-btn" onClick=${() => addSet(ei)}><${Icon} name="plus" size=${16} /> Add set</button>
          ${allHit ? html`<span class="hint-up">All sets at the top of the range. Add 5 lb next time.</span>` : null}
        </div>
      </section>`;
    })}

    <button class="btn secondary block" onClick=${() => setAdding(true)}><${Icon} name="plus" size=${18} /> Add exercise</button>
    <button class="btn ghost block danger-text" onClick=${() => discard(false)}>Discard workout</button>

    ${rest && restLeft > 0 ? html`<div class="rest-bar">
      <div><div class="muted small">Rest</div><div class="rest-time">${fmtDuration(restLeft)}</div></div>
      <div class="rest-actions">
        <button class="btn ghost sm" onClick=${() => setRest({ until: rest.until - 15000 })}>−15</button>
        <button class="btn ghost sm" onClick=${() => setRest({ until: rest.until + 15000 })}>+15</button>
        <button class="btn secondary sm" onClick=${() => setRest(null)}>Skip</button>
      </div>
    </div>` : null}

    <${Sheet} open=${adding} onClose=${() => setAdding(false)} title="Add exercise" full>
      ${EXERCISE_GROUPS.map((g) => html`<div class="ex-group">
        <div class="field-label">${g}</div>
        ${Object.values(EXERCISES).filter((x) => x.group === g).map((x) => html`<button class="mini-row" onClick=${() => addEx(x.id)}><span>${x.name}</span><${Icon} name="plus" size=${18} cls="muted" /></button>`)}
      </div>`)}
    </${Sheet}>
    <${Sheet} open=${!!info} onClose=${() => setInfo(null)} title=${info?.name || ''}>
      <p>${info?.tip}</p>
    </${Sheet}>
  </div>`;
}

function topOfRange(t) {
  if (!t) return 0;
  const m = String(t).match(/(\d+)(?!.*\d)/);
  return m ? Number(m[1]) : 0;
}
