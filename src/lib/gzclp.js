// GZCLP rules. Pure functions, no DOM. Weights are plain numbers in the chosen unit.
// Source for the rules: r/Fitness Wiki "GZCLP" (thefitness.wiki/routines/gzclp/), after Cody LeFever's GZCL method.
export const DAYS = [
  { id: 1, t1: 'squat', t2: 'bench', t3: 'lat' },
  { id: 2, t1: 'ohp', t2: 'deadlift', t3: 'row' },
  { id: 3, t1: 'bench', t2: 'squat', t3: 'lat' },
  { id: 4, t1: 'deadlift', t2: 'ohp', t3: 'row' },
];

export const LIFTS = {
  squat: { name: 'Squat', body: 'lower' },
  bench: { name: 'Bench press', body: 'upper' },
  ohp: { name: 'Overhead press', body: 'upper' },
  deadlift: { name: 'Deadlift', body: 'lower' },
  lat: { name: 'Lat pulldown', body: 'upper' },
  row: { name: 'Dumbbell row', body: 'upper' },
};
export const MAIN = ['squat', 'bench', 'ohp', 'deadlift'];
export const ACCESSORY = ['lat', 'row'];

// Each stage is sets x reps. The last set of a "+" scheme is as many reps as possible (AMRAP).
export const SCHEMES = {
  t1: [{ sets: 5, reps: 3, amrap: true }, { sets: 6, reps: 2, amrap: true }, { sets: 10, reps: 1, amrap: true }],
  t2: [{ sets: 3, reps: 10, amrap: false }, { sets: 3, reps: 8, amrap: false }, { sets: 3, reps: 6, amrap: false }],
  t3: [{ sets: 3, reps: 15, amrap: true }],
};
export const REST = { t1: '3 to 5 min', t2: '2 to 3 min', t3: '1 to 1.5 min' };

export const T1_RESET = 0.85;            // new T1 weight after failing the 10x1+ stage, as a share of the weight used
export const T3_BUMP_REPS = 25;          // reps on the last T3 set that earn a weight increase
export const STEP = { lb: 5, kg: 2.5 }; // rounding step for computed weights
export const MAX_WEIGHT = { lb: 1500, kg: 700 }; // largest weight the tool accepts, per unit
export const LB_PER_KG = 0.45359237; // kilograms in one pound
export const T2_RESET_ADD = { lb: 15, kg: 7.5 }; // added to the last stage 1 weight after failing 3x6 (source says 15 to 20 lb)

export const increment = (lift, unit) => {
  const lower = LIFTS[lift].body === 'lower';
  return unit === 'lb' ? (lower ? 10 : 5) : (lower ? 5 : 2.5);
};

export const roundTo = (w, step) => Math.round(Math.round((w / step) * 1e6) / 1e6) * step;
export const fmt = (n) => String(+Number(n).toFixed(2));

export const slotKey = (tier, lift) => (tier === 't3' ? lift : `${tier}.${lift}`);

export function defaultState(unit = 'lb') {
  const lb = {
    't1.squat': 135, 't1.bench': 95, 't1.ohp': 65, 't1.deadlift': 155,
    't2.squat': 95, 't2.bench': 65, 't2.ohp': 45, 't2.deadlift': 105,
    lat: 70, row: 30,
  };
  const slots = {};
  for (const [k, w] of Object.entries(lb)) {
    const weight = unit === 'lb' ? w : Math.max(STEP.kg, roundTo(w * LB_PER_KG, STEP.kg));
    slots[k] = { weight, stage: 0, base: weight };
  }
  return { unit, day: 0, slots };
}

// Result of one session for one slot. pass: boolean (T1, T2). reps: last-set reps (T3).
// Returns the new slot { weight, stage, base, reset }. reset is true when the cycle restarted.
// base is the last Stage 1 weight. Only T2 reads it: a T2 reset restarts 3 × 10 from base plus a jump.
export function progress(tier, lift, slot, input, unit) {
  const inc = increment(lift, unit);
  const step = STEP[unit];
  if (tier === 't3') {
    const bump = input.reps >= T3_BUMP_REPS;
    const weight = bump ? slot.weight + inc : slot.weight;
    return { weight, stage: 0, base: weight, reset: false };
  }
  if (input.pass) {
    const weight = slot.weight + inc;
    return { weight, stage: slot.stage, base: slot.stage === 0 ? weight : slot.base, reset: false };
  }
  if (slot.stage < 2) return { weight: slot.weight, stage: slot.stage + 1, base: slot.stage === 0 ? slot.weight : slot.base, reset: false };
  if (tier === 't1') {
    const weight = Math.max(step, roundTo(slot.weight * T1_RESET, step));
    return { weight, stage: 0, base: weight, reset: true };
  }
  const weight = roundTo(Math.min(slot.base, slot.weight) + T2_RESET_ADD[unit], step);
  return { weight, stage: 0, base: weight, reset: true };
}

// What to do after a reset, in plain words. The wiki treats T1 and T2 differently.
export const resetHint = (tier, unit) => tier === 't1'
  ? 'reset: test a new 5-rep max, or use 85 percent of this weight'
  : `reset: restart 3 × 10 at your last 3 × 10 weight plus ${T2_RESET_ADD[unit]} ${unit}`;

export function sessionFor(state, dayIndex) {
  const d = DAYS[dayIndex];
  return [['t1', d.t1], ['t2', d.t2], ['t3', d.t3]].map(([tier, lift]) => {
    const key = slotKey(tier, lift);
    const slot = state.slots[key];
    const scheme = SCHEMES[tier][slot.stage] || SCHEMES[tier][0];
    return { key, tier, lift, name: LIFTS[lift].name, weight: slot.weight, stage: slot.stage, ...scheme, rest: REST[tier] };
  });
}

export const schemeText = (s) => `${s.sets} × ${s.reps}${s.amrap ? '+' : ''}`;

// Apply a whole session. results: { [key]: { pass } or { reps } }. Missing T1/T2 result counts as pass; missing T3 reps as 15.
export function applySession(state, results) {
  const slots = { ...state.slots };
  const items = [];
  for (const it of sessionFor(state, state.day)) {
    const r = results[it.key] || {};
    const input = it.tier === 't3' ? { reps: r.reps ?? 15 } : { pass: r.pass !== false };
    const next = progress(it.tier, it.lift, state.slots[it.key], input, state.unit);
    slots[it.key] = { weight: next.weight, stage: next.stage, base: next.base };
    items.push({ key: it.key, tier: it.tier, name: it.name, weight: it.weight, scheme: schemeText(it), ...input, next: next.weight, reset: next.reset });
  }
  return { state: { ...state, slots, day: (state.day + 1) % 4 }, items };
}

// The next `count` sessions from the current day, using today's weights.
export function upcoming(state, count = 3) {
  return Array.from({ length: count }, (_, i) => {
    const day = (state.day + i) % 4;
    return { day, items: sessionFor(state, day) };
  });
}

export const fromFiveRM = (rm, unit) => Math.max(STEP[unit], roundTo(rm * T1_RESET, STEP[unit]));

export function convertState(state, to) {
  if (state.unit === to) return state;
  const f = to === 'kg' ? LB_PER_KG : 1 / LB_PER_KG;
  const slots = {};
  for (const [k, s] of Object.entries(state.slots)) {
    const c = (w) => Math.max(STEP[to], roundTo(w * f, STEP[to]));
    slots[k] = { weight: c(s.weight), stage: s.stage, base: c(s.base) };
  }
  return { ...state, unit: to, slots };
}
