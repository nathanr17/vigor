import { html, render, useState, useEffect, useReducer } from '../vendor/preact-htm.js';
import { S, subscribe, requestPersistence } from './store.js';
import { Icon, Toasts, toast } from './ui.js';
import { HomeView } from './views/home.js';
import { PlanView } from './views/plan.js';
import { LogView } from './views/log.js';
import { RecipesView, RecipeDetail } from './views/recipes.js';
import { MoreView } from './views/more.js';
import { WorkoutSession } from './views/workout.js';
import { Onboarding } from './views/onboarding.js';
import { fmtDuration } from './util.js';

const TABS = [
  ['home', 'Home', 'home'],
  ['plan', 'Plan', 'calendar'],
  ['log', 'Log', 'plus'],
  ['recipes', 'Recipes', 'book'],
  ['more', 'More', 'more'],
];

function useRoute() {
  const get = () => (location.hash || '#/home').replace(/^#\/?/, '').split('/');
  const [r, setR] = useState(get);
  useEffect(() => {
    const f = () => { setR(get()); window.scrollTo(0, 0); };
    addEventListener('hashchange', f);
    return () => removeEventListener('hashchange', f);
  }, []);
  return r;
}

function TabBar({ tab }) {
  return html`<nav class="tabbar" aria-label="Main">
    ${TABS.map(([id, label, icon]) => html`<a href=${`#/${id}`} class=${'tab ' + (tab === id ? 'on ' : '') + (id === 'log' ? 'tab-log' : '')} aria-current=${tab === id ? 'page' : undefined}>
      <span class="tab-icon"><${Icon} name=${icon} size=${id === 'log' ? 26 : 23} stroke=${id === 'log' ? 2.4 : 2} /></span>
      <span class="tab-label">${label}</span>
    </a>`)}
  </nav>`;
}

function ActiveBar() {
  const w = S().active;
  const [, tick] = useReducer((x) => x + 1, 0);
  useEffect(() => { const h = setInterval(tick, 1000); return () => clearInterval(h); }, []);
  if (!w) return null;
  return html`<a class="active-bar" href="#/workout"><span class="pulse"></span><span><b>${w.name}</b> in progress · ${fmtDuration((Date.now() - w.startedAt) / 1000)}</span><span class="active-resume">Resume</span></a>`;
}

function App() {
  const [, force] = useReducer((x) => x + 1, 0);
  useEffect(() => subscribe(force), []);
  useEffect(() => { requestPersistence(); }, []);
  const [tab = 'home', sub, extra] = useRoute();
  const s = S();
  if (!s.profile.onboarded) return html`<${Onboarding} /><${Toasts} />`;

  let view;
  switch (tab) {
    case 'plan': view = html`<${PlanView} sub=${sub} extra=${extra} />`; break;
    case 'log': view = html`<${LogView} sub=${sub} />`; break;
    case 'recipes': view = sub ? html`<${RecipeDetail} id=${sub} key=${sub} />` : html`<${RecipesView} />`; break;
    case 'more': view = html`<${MoreView} sub=${sub} />`; break;
    case 'workout': view = html`<${WorkoutSession} />`; break;
    default: view = html`<${HomeView} />`;
  }
  const inWorkout = tab === 'workout';
  return html`<div class=${'app' + (inWorkout ? ' no-tabs' : '')}>
    <main class="view">${view}</main>
    ${!inWorkout && s.active ? html`<${ActiveBar} />` : null}
    ${!inWorkout ? html`<${TabBar} tab=${tab} />` : null}
    <${Toasts} />
  </div>`;
}

render(html`<${App} />`, document.getElementById('app'));

// ---------------------------------------------------------------- service worker (offline + updates)
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').then((reg) => {
      reg.addEventListener('updatefound', () => {
        const nw = reg.installing;
        nw?.addEventListener('statechange', () => {
          if (nw.state === 'installed' && navigator.serviceWorker.controller) {
            toast('A new version is ready', { label: 'Update', fn: () => nw.postMessage('skipWaiting') });
          }
        });
      });
    }).catch((e) => console.warn('SW registration failed', e));
    // Reload only when an *update* takes over (not on the very first install).
    const hadController = !!navigator.serviceWorker.controller;
    let reloaded = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => { if (hadController && !reloaded) { reloaded = true; location.reload(); } });
  });
}
