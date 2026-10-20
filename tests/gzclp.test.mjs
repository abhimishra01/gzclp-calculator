import test from 'node:test';
import assert from 'node:assert/strict';
import { progress, applySession, sessionFor, upcoming, defaultState, convertState, fromFiveRM, increment, roundTo, schemeText, resetHint, DAYS } from '../src/lib/gzclp.js';
import { solve, parseNumber } from '../src/lib/plates.js';
import { freshStore, loadStore, logSession, undoSession, entryOk } from '../src/lib/store.js';

const slot = (weight, stage = 0, base = weight) => ({ weight, stage, base });

test('T1 pass adds 10 lb to a lower lift and 5 lb to an upper lift', () => {
  assert.equal(progress('t1', 'squat', slot(135), { pass: true }, 'lb').weight, 145);
  assert.equal(progress('t1', 'bench', slot(95), { pass: true }, 'lb').weight, 100);
});
test('T1 pass in kg adds 5 kg lower and 2.5 kg upper', () => {
  assert.equal(progress('t1', 'deadlift', slot(60), { pass: true }, 'kg').weight, 65);
  assert.equal(progress('t1', 'ohp', slot(30), { pass: true }, 'kg').weight, 32.5);
});
test('T1 pass keeps the stage', () => {
  assert.equal(progress('t1', 'squat', slot(135, 1), { pass: true }, 'lb').stage, 1);
});
test('T1 fail moves 5x3+ to 6x2+ to 10x1+ at the same weight', () => {
  const a = progress('t1', 'squat', slot(200), { pass: false }, 'lb');
  assert.deepEqual([a.weight, a.stage, a.reset], [200, 1, false]);
  const b = progress('t1', 'squat', a, { pass: false }, 'lb');
  assert.deepEqual([b.weight, b.stage, b.reset], [200, 2, false]);
});
test('T1 fail at 10x1+ resets to stage 1 at 85 percent, rounded to 5 lb', () => {
  const r = progress('t1', 'squat', slot(200, 2), { pass: false }, 'lb');
  assert.deepEqual([r.weight, r.stage, r.reset], [170, 0, true]); // 170 exactly
  const r2 = progress('t1', 'bench', slot(135, 2), { pass: false }, 'lb');
  assert.equal(r2.weight, 115); // 114.75 rounds to 115
});
test('T1 reset in kg rounds to 2.5 kg', () => {
  const r = progress('t1', 'squat', slot(100, 2), { pass: false }, 'kg');
  assert.equal(r.weight, 85);
  assert.equal(progress('t1', 'squat', slot(92.5, 2), { pass: false }, 'kg').weight, 77.5); // 78.625 rounds to 77.5
});
test('T2 fail walks 3x10, 3x8, 3x6 and remembers the stage 1 weight', () => {
  const a = progress('t2', 'bench', slot(65), { pass: false }, 'lb');
  assert.deepEqual([a.weight, a.stage, a.base], [65, 1, 65]);
  const b = progress('t2', 'bench', a, { pass: false }, 'lb');
  assert.deepEqual([b.weight, b.stage, b.base], [65, 2, 65]);
});
test('T2 fail at 3x6 restarts 3x10 at the last stage 1 weight plus 15 lb', () => {
  const r = progress('t2', 'bench', slot(80, 2, 65), { pass: false }, 'lb');
  assert.deepEqual([r.weight, r.stage, r.base, r.reset], [80, 0, 80, true]);
});
test('T2 pass in stage 2 raises the weight but not the stage 1 base', () => {
  const r = progress('t2', 'squat', slot(100, 1, 95), { pass: true }, 'lb');
  assert.deepEqual([r.weight, r.stage, r.base], [110, 1, 95]);
});
test('T2 pass in stage 1 moves the base up with the weight', () => {
  assert.equal(progress('t2', 'squat', slot(95), { pass: true }, 'lb').base, 105);
});
test('T3 adds weight only at 25 or more reps on the last set', () => {
  assert.equal(progress('t3', 'lat', slot(70), { reps: 24 }, 'lb').weight, 70);
  assert.equal(progress('t3', 'lat', slot(70), { reps: 25 }, 'lb').weight, 75);
  assert.equal(progress('t3', 'row', slot(30), { reps: 30 }, 'kg').weight, 32.5);
});
test('day layout matches the published program', () => {
  assert.deepEqual(DAYS.map((d) => [d.t1, d.t2, d.t3]), [
    ['squat', 'bench', 'lat'], ['ohp', 'deadlift', 'row'], ['bench', 'squat', 'lat'], ['deadlift', 'ohp', 'row'],
  ]);
});
test('session shows the scheme for the current stage', () => {
  const st = defaultState('lb');
  st.slots['t1.squat'].stage = 2;
  const [t1, t2, t3] = sessionFor(st, 0);
  assert.equal(schemeText(t1), '10 × 1+');
  assert.equal(schemeText(t2), '3 × 10');
  assert.equal(schemeText(t3), '3 × 15+');
});
test('applySession advances the day, wraps after day 4, and updates every slot', () => {
  let st = defaultState('lb');
  const r = applySession(st, { 't1.squat': { pass: true }, 't2.bench': { pass: false }, lat: { reps: 27 } });
  assert.equal(r.state.day, 1);
  assert.equal(r.state.slots['t1.squat'].weight, 145);
  assert.deepEqual([r.state.slots['t2.bench'].weight, r.state.slots['t2.bench'].stage], [65, 1]);
  assert.equal(r.state.slots.lat.weight, 75);
  assert.equal(r.items.length, 3);
  st = { ...st, day: 3 };
  assert.equal(applySession(st, {}).state.day, 0);
});
test('applySession does not change the input state', () => {
  const st = defaultState('lb');
  const before = JSON.stringify(st);
  applySession(st, {});
  assert.equal(JSON.stringify(st), before);
});
test('upcoming lists three sessions in rotation', () => {
  const st = { ...defaultState('lb'), day: 3 };
  assert.deepEqual(upcoming(st, 3).map((s) => s.day), [3, 0, 1]);
});
test('5RM to T1 start is 85 percent rounded to the step', () => {
  assert.equal(fromFiveRM(200, 'lb'), 170);
  assert.equal(fromFiveRM(100, 'kg'), 85);
});
test('unit change converts and rounds to the step', () => {
  const k = convertState(defaultState('lb'), 'kg');
  assert.equal(k.unit, 'kg');
  assert.equal(k.slots['t1.squat'].weight, 60); // 135 lb = 61.2 kg -> 60
  assert.equal(convertState(k, 'kg'), k);
});
test('increments and rounding', () => {
  assert.equal(increment('squat', 'lb'), 10);
  assert.equal(increment('ohp', 'kg'), 2.5);
  assert.equal(roundTo(114.75, 5), 115);
  assert.equal(roundTo(78.625, 2.5), 77.5);
});

// ---- review fixes ----
test('T1 reset never drops below one step', () => {
  assert.equal(progress('t1', 'ohp', slot(5, 2), { pass: false }, 'lb').weight, 5);
});
test('T2 reset in kg adds 7.5 kg to the last stage 1 weight (20 -> 27.5)', () => {
  const r = progress('t2', 'bench', slot(30, 2, 20), { pass: false }, 'kg');
  assert.equal(r.weight, 27.5);
});
test('T2 reset ignores a stage 1 weight above the current weight', () => {
  // Starting mid-program with a stale base must not give a wrong jump.
  const r = progress('t2', 'bench', slot(120, 2, 200), { pass: false }, 'lb');
  assert.equal(r.weight, 135); // 120 + 15
});
test('T2 reset uses a typed stage 1 weight, not the sample base', () => {
  const r = progress('t2', 'bench', slot(120, 2, 105), { pass: false }, 'lb');
  assert.equal(r.weight, 120); // 105 + 15
});
test('reset hint differs by tier', () => {
  assert.match(resetHint('t1', 'lb'), /5-rep max/);
  assert.match(resetHint('t2', 'lb'), /last 3 × 10 weight plus 15 lb/);
  assert.match(resetHint('t2', 'kg'), /plus 7.5 kg/);
  assert.doesNotMatch(resetHint('t2', 'lb'), /5-rep max/);
});
test('missing results count as pass, and T3 defaults to 15 reps', () => {
  const r = applySession(defaultState('lb'), {});
  assert.equal(r.state.slots['t1.squat'].weight, 145);
  assert.equal(r.state.slots.lat.weight, 70);
});
test('5RM in kg rounds to 2.5 kg and lb to kg and back moves by at most one step', () => {
  assert.equal(fromFiveRM(102, 'kg'), 87.5);
  const back = convertState(convertState(defaultState('lb'), 'kg'), 'lb');
  assert.ok(Math.abs(back.slots['t1.squat'].weight - 135) <= 5);
  assert.equal(convertState(defaultState('kg'), 'lb').unit, 'lb');
});
test('upcoming(4) lists the whole cycle', () => {
  assert.deepEqual(upcoming(defaultState('lb'), 4).map((s) => s.day), [0, 1, 2, 3]);
});

// plates
const P = [45, 35, 25, 10, 5, 2.5];
test('plates: 135 lb is one 45 per side, 100 lb is 25 + 2.5', () => {
  assert.deepEqual(solve({ target: 135, bar: 45, plates: P }).list, [{ w: 45, n: 1 }]);
  assert.deepEqual(solve({ target: 100, bar: 45, plates: P }).list, [{ w: 25, n: 1 }, { w: 2.5, n: 1 }]);
});
test('plates: 315 lb is three 45s, bar only, below the bar, closest load', () => {
  assert.deepEqual(solve({ target: 315, bar: 45, plates: P }).list, [{ w: 45, n: 3 }]);
  assert.equal(solve({ target: 45, bar: 45, plates: P }).status, 'bar');
  assert.equal(solve({ target: 40, bar: 45, plates: P }).status, 'below');
  const c = solve({ target: 52.5, bar: 45, plates: [45, 35, 25, 10, 5] });
  assert.equal(c.status, 'closest');
});
test('parseNumber accepts a decimal comma and rejects letters', () => {
  assert.equal(parseNumber('62,5'), 62.5);
  assert.ok(Number.isNaN(parseNumber('abc')));
});

// store: load, log, undo
test('loadStore falls back to defaults for empty or broken text', () => {
  assert.equal(loadStore(null).state.unit, 'lb');
  assert.equal(loadStore('{not json').log.length, 0);
});
test('loadStore drops a bad log entry and keeps the good one (corrupt storage)', () => {
  const good = logSession(freshStore(), {}, 'Oct 20').store;
  const text = JSON.stringify({ state: good.state, log: [{ date: 'x' }, good.log[0], null] });
  const loaded = loadStore(text);
  assert.equal(loaded.log.length, 1);
  assert.equal(loaded.log[0].date, 'Oct 20');
  assert.equal(entryOk({ date: 'x' }), false);
});
test('loadStore rejects out-of-range weights', () => {
  const st = freshStore().state;
  st.slots['t1.squat'].weight = 0.001;
  assert.equal(loadStore(JSON.stringify({ state: st, log: [] })).state.slots['t1.squat'].weight, 135);
  st.slots['t1.squat'].weight = 5000;
  assert.equal(loadStore(JSON.stringify({ state: st, log: [] })).state.slots['t1.squat'].weight, 135);
});
test('log then undo restores day and weights', () => {
  const s0 = freshStore();
  const { store } = logSession(s0, { 't1.squat': { pass: true } }, 'Oct 20');
  assert.equal(store.state.slots['t1.squat'].weight, 145);
  const back = undoSession(store);
  assert.equal(back.state.slots['t1.squat'].weight, 135);
  assert.equal(back.state.day, 0);
  assert.equal(back.log.length, 0);
});
test('unit switch then undo restores the unit and the weights together', () => {
  const { store } = logSession(freshStore(), {}, 'Oct 20');
  const switched = { ...store, state: convertState(store.state, 'kg') };
  const back = undoSession(switched);
  assert.equal(back.state.unit, 'lb');
  assert.equal(back.state.slots['t1.squat'].weight, 135);
});
test('undo snapshot is a deep copy: later edits do not change the log', () => {
  const { store } = logSession(freshStore(), {}, 'Oct 20');
  store.state.slots['t1.ohp'].weight = 999;
  assert.equal(store.log[0].before.slots['t1.ohp'].weight, 65);
});
test('stage edit then fail uses the typed base (T2 at stage 3, base 105, weight 120)', () => {
  const s = freshStore();
  s.state.slots['t2.bench'] = { weight: 120, stage: 2, base: 105 };
  s.state.day = 0;
  const r = logSession(s, { 't2.bench': { pass: false } }, 'Oct 20');
  assert.equal(r.store.state.slots['t2.bench'].weight, 120);
});
