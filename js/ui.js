import { html, useState, useEffect, useRef } from '../vendor/preact-htm.js';
import { FOD_LABEL } from './nutrition.js';
import { fmtNum } from './util.js';

// ---------------------------------------------------------------- icons (24px stroke icons)
const P = {
  home: 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  calendar: 'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
  plus: 'M12 5v14M5 12h14',
  book: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5zM4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5',
  more: 'M4 6h16M4 12h16M4 18h16',
  left: 'm15 18-6-6 6-6',
  right: 'm9 18 6-6-6-6',
  down: 'm6 9 6 6 6-6',
  check: 'M20 6 9 17l-5-5',
  x: 'M18 6 6 18M6 6l12 12',
  star: 'M12 2.5l2.9 5.9 6.6 1-4.8 4.6 1.1 6.5L12 17.4l-5.8 3.1 1.1-6.5-4.8-4.6 6.6-1z',
  flame: 'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z',
  dumbbell: 'M6.5 6.5v11M17.5 6.5v11M3 9v6M21 9v6M6.5 12h11',
  run: 'M22 12h-4l-3 9L9 3l-3 9H2',
  drop: 'M12 2.7l5.66 5.66a8 8 0 1 1-11.31 0z',
  clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2',
  trash: 'M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6',
  edit: 'M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z',
  cart: 'M6 6h15l-1.5 9h-12zM6 6 5 3H2M9 20h.01M18 20h.01',
  share: 'M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3',
  leaf: 'M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10zM2 21c0-3 1.85-5.36 5.08-6',
  heart: 'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7z',
  sliders: 'M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6',
  bag: 'M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0',
  trend: 'M22 7 13.5 15.5 8.5 10.5 2 17M16 7h6v6',
  info: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 16v-4M12 8h.01',
  download: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3',
  upload: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12',
  copy: 'M9 9h11v11H9zM5 15H4V4h11v1',
  shuffle: 'M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5',
  bowl: 'M3 11h18a9 9 0 0 1-18 0zM7 7c0-1.5 1-2 1-3.5M12 7c0-1.5 1-2 1-3.5',
  note: 'M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9zM14 3v6h6M8 13h8M8 17h5',
  timer: 'M10 2h4M12 14l3-3M12 22a8 8 0 1 0 0-16 8 8 0 0 0 0 16z',
  play: 'M6 4l14 8-14 8z',
  scale: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2',
};
export const Icon = ({ name, size = 22, stroke = 2, cls = '' }) => html`
  <svg class=${'icon ' + cls} width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width=${stroke} stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d=${P[name] || ''} />
  </svg>`;

// ---------------------------------------------------------------- layout
export const Header = ({ title, sub, right, back }) => html`
  <header class="page-head">
    ${back ? html`<button class="icon-btn back" onClick=${back} aria-label="Back"><${Icon} name="left" size=${26} /></button>` : null}
    <div class="page-head-text">
      ${sub ? html`<div class="eyebrow">${sub}</div>` : null}
      <h1>${title}</h1>
    </div>
    ${right ? html`<div class="page-head-right">${right}</div>` : null}
  </header>`;

export const Card = ({ children, cls = '', onClick, title, action }) => html`
  <section class=${'card ' + cls} onClick=${onClick}>
    ${title ? html`<div class="card-head"><h2>${title}</h2>${action || null}</div>` : null}
    ${children}
  </section>`;

export const Empty = ({ icon = 'info', title, body, action }) => html`
  <div class="empty">
    <div class="empty-icon"><${Icon} name=${icon} size=${26} /></div>
    <div class="empty-title">${title}</div>
    ${body ? html`<div class="empty-body">${body}</div>` : null}
    ${action || null}
  </div>`;

// ---------------------------------------------------------------- controls
export function Segmented({ options, value, onChange, cls = '' }) {
  return html`<div class=${'seg ' + cls} role="tablist">
    ${options.map(([v, label]) => html`<button role="tab" aria-selected=${v === value} class=${v === value ? 'on' : ''} onClick=${() => onChange(v)}>${label}</button>`)}
  </div>`;
}

export function Chip({ on, onClick, children, cls = '' }) {
  return html`<button class=${'chip ' + (on ? 'on ' : '') + cls} aria-pressed=${!!on} onClick=${onClick}>${children}</button>`;
}

export function Stepper({ value, onChange, step = 1, min = 0, max = 999, fmt = (v) => v, label }) {
  const dec = () => onChange(Math.max(min, +(value - step).toFixed(2)));
  const inc = () => onChange(Math.min(max, +(value + step).toFixed(2)));
  return html`<div class="stepper" aria-label=${label}>
    <button onClick=${dec} disabled=${value <= min} aria-label="Decrease">−</button>
    <span class="stepper-val">${fmt(value)}</span>
    <button onClick=${inc} disabled=${value >= max} aria-label="Increase">+</button>
  </div>`;
}

export function Rating({ value, onChange, labels, max = 5 }) {
  return html`<div class="rating">
    ${Array.from({ length: max }, (_, i) => i + 1).map((n) => html`
      <button class=${value === n ? 'on' : ''} onClick=${() => onChange(value === n ? null : n)} aria-label=${labels?.[n - 1] || String(n)}>${n}</button>`)}
  </div>
  ${labels ? html`<div class="rating-labels"><span>${labels[0]}</span><span>${labels[max - 1]}</span></div>` : null}`;
}

export function Progress({ value, max, color = 'var(--sky)', height = 8 }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return html`<div class="progress" style=${`height:${height}px`} role="progressbar" aria-valuenow=${Math.round(value)} aria-valuemax=${Math.round(max)}>
    <div class="progress-fill" style=${`width:${pct}%;background:${color}`}></div>
  </div>`;
}

export function FodBadge({ level, small }) {
  const t = { low: 'Low FODMAP', mod: 'Moderate', high: 'High FODMAP' }[level];
  return html`<span class=${'badge fod-' + level + (small ? ' sm' : '')} title=${FOD_LABEL[level]}>
    <span class="dot"></span>${t}</span>`;
}

export const Macro = ({ label, value, unit = 'g', strong }) => html`
  <div class=${'macro' + (strong ? ' strong' : '')}><div class="macro-val">${fmtNum(value)}<small>${unit}</small></div><div class="macro-label">${label}</div></div>`;

// ---------------------------------------------------------------- bottom sheet
export function Sheet({ open, onClose, title, children, full, footer }) {
  const [shown, setShown] = useState(open);
  const ref = useRef();
  useEffect(() => {
    if (open) { setShown(true); document.body.classList.add('locked'); }
    else { const t = setTimeout(() => setShown(false), 220); document.body.classList.remove('locked'); return () => clearTimeout(t); }
  }, [open]);
  useEffect(() => () => document.body.classList.remove('locked'), []);
  if (!shown && !open) return null;
  return html`
    <div class=${'sheet-wrap ' + (open ? 'open' : 'closing')} onClick=${(e) => e.target === e.currentTarget && onClose?.()}>
      <div class=${'sheet' + (full ? ' full' : '')} ref=${ref} role="dialog" aria-modal="true" aria-label=${title}>
        <div class="sheet-grabber"></div>
        <div class="sheet-head">
          <h3>${title}</h3>
          <button class="icon-btn" onClick=${onClose} aria-label="Close"><${Icon} name="x" /></button>
        </div>
        <div class="sheet-body">${children}</div>
        ${footer ? html`<div class="sheet-foot">${footer}</div>` : null}
      </div>
    </div>`;
}

// ---------------------------------------------------------------- toasts
let toastSet = null;
export function toast(msg, action) { toastSet?.({ msg, action, id: Date.now() }); }
export function Toasts() {
  const [t, setT] = useState(null);
  toastSet = setT;
  useEffect(() => { if (!t) return; const h = setTimeout(() => setT(null), t.action ? 5000 : 2600); return () => clearTimeout(h); }, [t]);
  if (!t) return null;
  return html`<div class="toast" role="status" key=${t.id}>
    <span>${t.msg}</span>
    ${t.action ? html`<button onClick=${() => { t.action.fn(); setT(null); }}>${t.action.label}</button>` : null}
  </div>`;
}

export function confirmAction(msg) { return window.confirm(msg); }

export const NumInput = ({ value, onInput, placeholder, step = 'any', suffix, cls = '', label }) => html`
  <label class=${'num-input ' + cls}>
    ${label ? html`<span class="num-label">${label}</span>` : null}
    <span class="num-field">
      <input type="number" inputmode="decimal" step=${step} value=${value ?? ''} placeholder=${placeholder}
        onInput=${(e) => onInput(e.target.value === '' ? '' : Number(e.target.value))} />
      ${suffix ? html`<span class="num-suffix">${suffix}</span>` : null}
    </span>
  </label>`;
