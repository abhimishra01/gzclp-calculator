// Saved data: load and check, log a session, undo. Pure functions, no DOM, so npm test covers them.
// A store is { state, log }. state = { unit, day, slots, prefs, touched }. log = newest entry first.
import { DAYS, MAX_WEIGHT, defaultState, applySession } from './gzclp.js';
import { PLATES, DEFAULT_PLATES } from './plates.js';

export const STORE_KEY = 'gzclp-v1';
export const LOG_LIMIT = 50;

const isUnit = (u) => u === 'lb' || u === 'kg';
const isWeight = (x, unit) => typeof x === 'number' && Number.isFinite(x) && x >= 1 && x <= MAX_WEIGHT[unit];
const isDay = (d) => Number.isInteger(d) && d >= 0 && d < DAYS.length;
const copySlots = (slots) => Object.fromEntries(Object.entries(slots).map(([k, s]) => [k, { ...s }]));

export function freshStore() {
  const state = defaultState('lb');
  state.prefs = { bar: { lb: 45, kg: 20 }, plates: { lb: [...DEFAULT_PLATES.lb], kg: [...DEFAULT_PLATES.kg] } };
  state.touched = false;
  return { state, log: [] };
}

// True when slots has every program slot with a sane weight, base and stage.
export function slotsOk(slots, unit) {
  for (const k of Object.keys(defaultState(unit).slots)) {
    const x = slots?.[k];
    if (!x || !isWeight(x.weight, unit) || !isWeight(x.base, unit)) return false;
    if (![0, 1, 2].includes(x.stage) || (!k.includes('.') && x.stage !== 0)) return false;
  }
  return true;
}

// True when a saved log entry has every field the page reads. Bad entries are dropped on load.
export function entryOk(e) {
  if (!e || typeof e !== 'object' || typeof e.date !== 'string' || !isDay(e.prevDay) || !isUnit(e.unit)) return false;
  if (!Array.isArray(e.items) || !e.items.length) return false;
  if (!e.items.every((x) => x && typeof x.name === 'string' && ['t1', 't2', 't3'].includes(x.tier) && isWeight(x.weight, e.unit))) return false;
  const b = e.before;
  return !!b && isDay(b.day) && slotsOk(b.slots, isUnit(b.unit) ? b.unit : e.unit);
}

// Read the saved JSON text. Anything wrong falls back to the defaults for that part, and the page keeps working.
export function loadStore(text) {
  const out = freshStore();
  let saved;
  try { saved = JSON.parse(text || 'null'); } catch { return out; }
  const s = saved?.state;
  if (!s || !isUnit(s.unit) || !isDay(s.day) || !slotsOk(s.slots, s.unit)) return out;
  out.state.unit = s.unit; out.state.day = s.day; out.state.slots = copySlots(s.slots); out.state.touched = s.touched === true;
  for (const u of ['lb', 'kg']) {
    const bar = s.prefs?.bar?.[u];
    if (typeof bar === 'number' && bar > 0 && bar <= 100) out.state.prefs.bar[u] = bar;
    if (Array.isArray(s.prefs?.plates?.[u])) out.state.prefs.plates[u] = s.prefs.plates[u].filter((w) => PLATES[u].includes(w));
  }
  if (Array.isArray(saved.log)) out.log = saved.log.filter(entryOk).slice(0, LOG_LIMIT);
  return out;
}

// Apply a session and add it to the log. The entry keeps a full copy of the state before it, with its unit.
export function logSession(store, results, date) {
  const { state } = store;
  const before = { day: state.day, unit: state.unit, touched: state.touched, slots: copySlots(state.slots) };
  const r = applySession(state, results);
  const entry = { date, prevDay: state.day, unit: state.unit, items: r.items, before };
  return { store: { state: { ...r.state, touched: true }, log: [entry, ...store.log].slice(0, LOG_LIMIT) }, items: r.items };
}

// Take back the newest log entry: restore its day, unit and weights.
export function undoSession(store) {
  const last = store.log[0];
  if (!last) return store;
  const { before } = last;
  return {
    state: { ...store.state, unit: before.unit ?? last.unit, day: before.day, slots: copySlots(before.slots), touched: before.touched === true },
    log: store.log.slice(1),
  };
}
