// Hand-rolled SVG charts (no dependencies). Thin marks, 4px rounded data-ends,
// hairline grid, one axis, tap-to-inspect tooltips. Text always uses text tokens.
import { html, useState } from '../vendor/preact-htm.js';
import { fmtNum } from './util.js';

const W = 340;

function niceMax(v) {
  if (!v || v <= 0) return 1;
  const exp = Math.pow(10, Math.floor(Math.log10(v)));
  const f = v / exp;
  const n = f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10;
  return n * exp;
}
const compact = (v) => (v >= 10000 ? `${Math.round(v / 1000)}K` : fmtNum(v));

function barPath(x, y, w, h, r) {
  if (h <= 0) return '';
  r = Math.min(r, w / 2, h);
  return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`;
}

function Tip({ x, y, lines, minX = 0, maxX = W }) {
  const width = Math.max(...lines.map((l) => l.text.length * 6.4 + (l.color ? 14 : 0))) + 16;
  const h = lines.length * 16 + 10;
  let tx = Math.min(Math.max(x - width / 2, minX), maxX - width);
  let ty = y - h - 8;
  if (ty < 0) ty = 0;
  return html`<g class="chart-tip" pointer-events="none">
    <rect x=${tx} y=${ty} width=${width} height=${h} rx="8" />
    ${lines.map((l, i) => html`
      ${l.color ? html`<line x1=${tx + 8} x2=${tx + 18} y1=${ty + 17 + i * 16 - 4} y2=${ty + 17 + i * 16 - 4} stroke=${l.color} stroke-width="2.5" stroke-linecap="round" />` : null}
      <text x=${tx + (l.color ? 22 : 8)} y=${ty + 17 + i * 16} class=${l.strong ? 'tip-strong' : 'tip-text'}>${l.text}</text>`)}
  </g>`;
}

/**
 * Single-series column chart with optional target line.
 * data: [{ label, tick, value, title }]
 */
export function BarChart({ data, target, targetLabel, color = 'var(--sky)', unit = '', height = 160, fmt = fmtNum, defaultSel, max: fixedMax }) {
  const [sel, setSel] = useState(null);
  const padL = 34, padR = 6, padT = 16, padB = 22;
  const H = height;
  const vals = data.map((d) => d.value || 0);
  const max = fixedMax || niceMax(Math.max(target || 0, ...vals, 1) * 1.08);
  const y = (v) => padT + (H - padT - padB) * (1 - v / max);
  const slot = (W - padL - padR) / data.length;
  const bw = Math.max(3, Math.min(24, slot * 0.62));
  const ticks = [0, max / 2, max];
  const active = sel ?? defaultSel ?? null;
  const showEvery = data.length > 14 ? Math.ceil(data.length / 6) : 1;
  return html`<svg class="chart" viewBox=${`0 0 ${W} ${H}`} role="img" aria-label=${`Bar chart, ${data.length} values`}>
    ${ticks.map((t) => html`
      <line class="grid" x1=${padL} x2=${W - padR} y1=${y(t)} y2=${y(t)} />
      <text class="axis" x=${padL - 6} y=${y(t) + 3.5} text-anchor="end">${compact(t)}</text>`)}
    ${data.map((d, i) => {
      const x = padL + slot * i + (slot - bw) / 2;
      const v = d.value || 0;
      const isSel = active === i;
      return html`<g>
        <path d=${barPath(x, y(v), bw, y(0) - y(v), 4)} fill=${color} opacity=${active == null || isSel ? 1 : 0.45} />
        ${(i % showEvery === 0 || isSel) ? html`<text class=${'axis' + (d.today ? ' axis-strong' : '')} x=${x + bw / 2} y=${H - 6} text-anchor="middle">${d.tick}</text>` : null}
        <rect class="hit" x=${padL + slot * i} y=${padT} width=${slot} height=${H - padT - padB} onClick=${() => setSel(isSel ? null : i)} />
      </g>`;
    })}
    ${target ? html`
      <line class="target" x1=${padL} x2=${W - padR} y1=${y(target)} y2=${y(target)} />
      <text class="axis target-label" x=${padL + 4} y=${y(target) - 5} text-anchor="start">${targetLabel || `Goal ${fmt(target)}`}</text>` : null}
    ${active != null && data[active] ? html`<${Tip}
      x=${padL + slot * active + slot / 2} y=${y(data[active].value || 0)}
      lines=${[{ text: `${fmt(data[active].value || 0)}${unit}`, strong: true }, { text: data[active].title || data[active].label }]} />` : null}
  </svg>`;
}

/**
 * Multi-series line chart sharing one y-axis.
 * series: [{ name, color, values: [number|null] }], labels: [{ tick, title }]
 */
export function LineChart({ series, labels, height = 160, yMin, yMax, fmt = (v) => fmtNum(v, 1), unit = '' }) {
  const [sel, setSel] = useState(null);
  const padL = 34, padR = 10, padT = 16, padB = 22;
  const H = height;
  const all = series.flatMap((s) => s.values).filter((v) => v != null);
  if (!all.length) return null;
  let lo = yMin ?? Math.min(...all), hi = yMax ?? Math.max(...all);
  if (yMin == null || yMax == null) {
    const pad = Math.max((hi - lo) * 0.15, 1);
    if (yMin == null) lo = Math.floor(lo - pad);
    if (yMax == null) hi = Math.ceil(hi + pad);
  }
  const n = labels.length;
  const x = (i) => padL + (n === 1 ? (W - padL - padR) / 2 : ((W - padL - padR) * i) / (n - 1));
  const y = (v) => padT + (H - padT - padB) * (1 - (v - lo) / (hi - lo || 1));
  const ticks = [lo, (lo + hi) / 2, hi];
  const showEvery = n > 14 ? Math.ceil(n / 6) : 1;
  const pathFor = (vals) => {
    let d = '', pen = false;
    vals.forEach((v, i) => {
      if (v == null) { pen = false; return; }
      d += `${pen ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`;
      pen = true;
    });
    return d;
  };
  const onMove = (e) => {
    const svg = e.currentTarget.ownerSVGElement || e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    let best = 0, bd = Infinity;
    for (let i = 0; i < n; i++) { const dd = Math.abs(x(i) - px); if (dd < bd) { bd = dd; best = i; } }
    setSel(best);
  };
  return html`<svg class="chart" viewBox=${`0 0 ${W} ${H}`} role="img" aria-label=${series.map((s) => s.name).join(' and ') + ' over time'}>
    ${ticks.map((t) => html`
      <line class="grid" x1=${padL} x2=${W - padR} y1=${y(t)} y2=${y(t)} />
      <text class="axis" x=${padL - 6} y=${y(t) + 3.5} text-anchor="end">${fmtNum(t, hi - lo < 6 ? 1 : 0)}</text>`)}
    ${labels.map((l, i) => (i % showEvery === 0 || i === n - 1) ? html`<text class=${'axis' + (l.today ? ' axis-strong' : '')} x=${x(i)} y=${H - 6} text-anchor="middle">${l.tick}</text>` : null)}
    ${series.map((s) => html`<path d=${pathFor(s.values)} fill="none" stroke=${s.color} stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />`)}
    ${series.map((s) => s.values.map((v, i) => v == null ? null : (n <= 14 || i === lastIdx(s.values) || i === sel)
      ? html`<circle class="dot-ring" cx=${x(i)} cy=${y(v)} r=${i === sel ? 5 : 4} fill=${s.color} />` : null))}
    ${sel != null ? html`<line class="crosshair" x1=${x(sel)} x2=${x(sel)} y1=${padT} y2=${H - padB} />` : null}
    <rect class="hit" x=${padL - 10} y="0" width=${W - padL - padR + 20} height=${H - padB}
      onPointerDown=${onMove} onPointerMove=${(e) => e.buttons || e.pointerType !== 'mouse' ? onMove(e) : onMove(e)} onPointerLeave=${() => setSel(null)} />
    ${sel != null ? html`<${Tip} x=${x(sel)} y=${padT + 30} lines=${[
      ...series.map((s) => ({ text: s.values[sel] == null ? `${s.name}: –` : `${fmt(s.values[sel])}${unit}  ${s.name}`, color: s.color, strong: series.length === 1 })),
      { text: labels[sel].title || labels[sel].tick },
    ]} />` : null}
  </svg>`;
}
const lastIdx = (vals) => { for (let i = vals.length - 1; i >= 0; i--) if (vals[i] != null) return i; return -1; };

export const Legend = ({ items }) => html`<div class="legend">
  ${items.map((it) => html`<span class="legend-item"><span class=${'legend-key ' + (it.line ? 'line' : 'box')} style=${`background:${it.color}`}></span>${it.label}${it.value != null ? html` <b>${it.value}</b>` : null}</span>`)}
</div>`;

/** Circular progress ring for the "today" hero. */
export function Ring({ value, max, size = 120, stroke = 10, color = 'var(--sky)', children }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = max > 0 ? Math.min(1, value / max) : 0;
  return html`<div class="ring" style=${`width:${size}px;height:${size}px`}>
    <svg width=${size} height=${size} viewBox=${`0 0 ${size} ${size}`}>
      <circle cx=${size / 2} cy=${size / 2} r=${r} fill="none" class="ring-track" stroke-width=${stroke} />
      <circle cx=${size / 2} cy=${size / 2} r=${r} fill="none" stroke=${color} stroke-width=${stroke} stroke-linecap="round"
        stroke-dasharray=${`${c * pct} ${c}`} transform=${`rotate(-90 ${size / 2} ${size / 2})`} />
    </svg>
    <div class="ring-center">${children}</div>
  </div>`;
}
