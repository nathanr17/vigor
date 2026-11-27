// Exercise library + full-gym templates.
// kind: 'weight' (lb × reps) | 'bodyweight' (reps, optional added lb) | 'time' (seconds) | 'reps' (reps only)

export const EXERCISES = {};
const E = (id, name, group, kind = 'weight', tip = '') => (EXERCISES[id] = { id, name, group, kind, tip });

// Chest
E('bench', 'Barbell Bench Press', 'Chest', 'weight', 'Shoulder blades pinned back, feet driving into the floor, bar to mid-chest.');
E('incline_db', 'Incline Dumbbell Press', 'Chest', 'weight', 'Bench at 30°. Control the stretch at the bottom.');
E('db_bench', 'Dumbbell Bench Press', 'Chest');
E('cable_fly', 'Cable Fly', 'Chest', 'weight', 'Slight elbow bend; squeeze at the middle.');
E('pec_deck', 'Pec Deck', 'Chest');
E('dips', 'Dips', 'Chest', 'bodyweight', 'Lean forward slightly to bias the chest.');
E('pushup', 'Push-Up', 'Chest', 'bodyweight');
// Back
E('pullup', 'Pull-Up', 'Back', 'bodyweight', 'Full hang at the bottom, chest to bar at the top.');
E('lat_pulldown', 'Lat Pulldown', 'Back', 'weight', 'Pull elbows down to your back pockets.');
E('bb_row', 'Barbell Row', 'Back', 'weight', 'Hinge to about 45°, pull to your lower ribs.');
E('cable_row', 'Seated Cable Row', 'Back');
E('db_row', 'One-Arm Dumbbell Row', 'Back');
E('chest_row', 'Chest-Supported Row', 'Back');
E('face_pull', 'Face Pull', 'Shoulders', 'weight', 'Rope to forehead, thumbs back. Great for shoulder health.');
E('deadlift', 'Deadlift', 'Back', 'weight', 'Brace hard, bar close to your shins, push the floor away.');
// Shoulders
E('ohp', 'Overhead Press', 'Shoulders', 'weight', 'Squeeze glutes, press up and slightly back.');
E('db_shoulder', 'Seated Dumbbell Shoulder Press', 'Shoulders');
E('lateral_raise', 'Lateral Raise', 'Shoulders', 'weight', 'Lead with the elbows; stop at shoulder height.');
E('cable_lateral', 'Cable Lateral Raise', 'Shoulders');
E('rear_delt', 'Rear Delt Fly', 'Shoulders');
// Arms
E('db_curl', 'Dumbbell Curl', 'Arms');
E('hammer_curl', 'Hammer Curl', 'Arms');
E('ez_curl', 'EZ-Bar Curl', 'Arms');
E('incline_curl', 'Incline Dumbbell Curl', 'Arms');
E('rope_pushdown', 'Rope Triceps Pushdown', 'Arms');
E('oh_triceps', 'Overhead Cable Triceps Extension', 'Arms');
E('skullcrusher', 'EZ-Bar Skull Crusher', 'Arms');
// Legs
E('squat', 'Back Squat', 'Legs', 'weight', 'Brace, sit between your hips, knees track over toes.');
E('front_squat', 'Front Squat', 'Legs');
E('hack_squat', 'Hack Squat', 'Legs');
E('leg_press', 'Leg Press', 'Legs', 'weight', 'Full range without your lower back peeling off the pad.');
E('rdl', 'Romanian Deadlift', 'Legs', 'weight', 'Push hips back with soft knees until you feel a deep hamstring stretch.');
E('bulgarian', 'Bulgarian Split Squat', 'Legs', 'weight', 'Weight is per dumbbell. Log reps per leg.');
E('walking_lunge', 'Walking Lunge', 'Legs');
E('leg_curl', 'Lying Leg Curl', 'Legs');
E('leg_ext', 'Leg Extension', 'Legs');
E('hip_thrust', 'Barbell Hip Thrust', 'Legs', 'weight', 'Chin tucked, ribs down, squeeze glutes hard at the top.');
E('calf_raise', 'Standing Calf Raise', 'Legs', 'weight', 'Pause 1 second in the stretch at the bottom.');
E('seated_calf', 'Seated Calf Raise', 'Legs');
// Core
E('hanging_leg_raise', 'Hanging Leg Raise', 'Core', 'reps');
E('cable_crunch', 'Cable Crunch', 'Core');
E('plank', 'Plank', 'Core', 'time');
E('dead_bug', 'Dead Bug', 'Core', 'reps');
E('pallof', 'Pallof Press', 'Core');
E('ab_wheel', 'Ab Wheel Rollout', 'Core', 'reps');
// Pelvic floor & mobility
E('kegel_hold', 'Kegel Holds (5–10 s)', 'Pelvic floor', 'reps', 'Squeeze as if stopping urine flow. Hold 5–10 seconds, relax fully for the same time. Don\'t hold your breath or squeeze your glutes.');
E('kegel_quick', 'Quick Kegel Flicks', 'Pelvic floor', 'reps', 'Fast 1-second squeeze, 1-second release.');
E('glute_bridge', 'Glute Bridge', 'Pelvic floor', 'reps', 'Add a gentle pelvic-floor squeeze at the top.');
E('reverse_kegel', 'Diaphragmatic Breathing / Reverse Kegel', 'Pelvic floor', 'reps', 'Slow belly breaths. Let the pelvic floor drop and relax on each inhale. Relaxation matters as much as strength.');
E('hip_flexor', 'Half-Kneeling Hip Flexor Stretch', 'Mobility', 'time');

export const EXERCISE_GROUPS = ['Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core', 'Pelvic floor', 'Mobility'];

// Templates: [exerciseId, sets, repTarget]
export const TEMPLATES = [
  {
    id: 'push', name: 'Push', sub: 'Chest · Shoulders · Triceps', mins: 65,
    ex: [['bench', 4, '6–8'], ['incline_db', 3, '8–10'], ['db_shoulder', 3, '8–10'], ['cable_lateral', 3, '12–15'], ['cable_fly', 3, '12–15'], ['rope_pushdown', 3, '10–12'], ['oh_triceps', 2, '12–15']],
  },
  {
    id: 'pull', name: 'Pull', sub: 'Back · Rear delts · Biceps', mins: 60,
    ex: [['pullup', 4, '6–10'], ['bb_row', 4, '6–8'], ['cable_row', 3, '10–12'], ['face_pull', 3, '15'], ['rear_delt', 2, '15'], ['incline_curl', 3, '10–12'], ['hammer_curl', 2, '12']],
  },
  {
    id: 'legs', name: 'Legs', sub: 'Quads · Hamstrings · Glutes · Calves', mins: 70,
    ex: [['squat', 4, '5–8'], ['rdl', 3, '8'], ['leg_press', 3, '10–12'], ['walking_lunge', 2, '12/leg'], ['leg_curl', 3, '12'], ['calf_raise', 4, '10–12'], ['hanging_leg_raise', 3, '12']],
  },
  {
    id: 'upper', name: 'Upper', sub: 'Strength-focused upper body', mins: 65,
    ex: [['ohp', 4, '5–6'], ['lat_pulldown', 4, '8–10'], ['db_bench', 3, '8–10'], ['chest_row', 3, '10'], ['lateral_raise', 3, '15'], ['ez_curl', 3, '10'], ['skullcrusher', 3, '10']],
  },
  {
    id: 'lower', name: 'Lower', sub: 'Posterior chain + core', mins: 60,
    ex: [['deadlift', 3, '4–6'], ['front_squat', 3, '6–8'], ['bulgarian', 3, '8–10/leg'], ['hip_thrust', 3, '10'], ['leg_ext', 2, '15'], ['seated_calf', 3, '15'], ['cable_crunch', 3, '12']],
  },
  {
    id: 'full', name: 'Full Body', sub: 'When you only have 1 hour', mins: 60,
    ex: [['squat', 3, '6–8'], ['bench', 3, '6–8'], ['bb_row', 3, '8'], ['rdl', 3, '8'], ['db_shoulder', 2, '10'], ['db_curl', 2, '12'], ['plank', 3, '45s']],
  },
  {
    id: 'pelvic', name: 'Pelvic Floor & Core', sub: '10 minutes · daily-friendly', mins: 10,
    ex: [['reverse_kegel', 1, '10 breaths'], ['kegel_hold', 3, '10'], ['kegel_quick', 3, '10'], ['glute_bridge', 3, '15'], ['dead_bug', 3, '10'], ['hip_flexor', 2, '45s/side']],
  },
];

export const TEMPLATE_BY_ID = Object.fromEntries(TEMPLATES.map((t) => [t.id, t]));

export const CARDIO_TYPES = [
  { id: 'easy', label: 'Easy run', icon: '🏃', run: true },
  { id: 'long', label: 'Long run', icon: '🏃', run: true },
  { id: 'tempo', label: 'Tempo run', icon: '⚡', run: true },
  { id: 'intervals', label: 'Intervals', icon: '⏱️', run: true },
  { id: 'walk', label: 'Walk / hike', icon: '🚶', run: false },
  { id: 'bike', label: 'Bike', icon: '🚴', run: false },
  { id: 'row', label: 'Row / other', icon: '🚣', run: false },
];
export const CARDIO_BY_ID = Object.fromEntries(CARDIO_TYPES.map((c) => [c.id, c]));

// Suggested training week (shown on Home + Training guide)
// Sundays are always rest. 4 lifting days + 1–2 easy runs.
export const WEEK_PLAN = [
  { day: 'Mon', lift: 'push', cardio: null, note: 'Push day' },
  { day: 'Tue', lift: 'pelvic', cardio: 'easy', note: 'Easy run 20–30 min. Run/walk is perfectly fine.' },
  { day: 'Wed', lift: 'pull', cardio: null, note: 'Pull day' },
  { day: 'Thu', lift: 'legs', cardio: null, note: 'Leg day' },
  { day: 'Fri', lift: 'pelvic', cardio: 'easy', optional: true, note: 'Optional 2nd easy run, or a brisk 30-min walk' },
  { day: 'Sat', lift: 'upper', cardio: null, note: 'Upper day' },
  { day: 'Sun', lift: null, cardio: null, rest: true, note: 'Rest day: recover, sleep in, prep meals for the week' },
];

export const BEGINNER_RUNNING = [
  'Go slow enough to talk in full sentences. If you can\'t, walk until you can.',
  'Weeks 1–2: alternate 1 min running / 2 min walking, 8 rounds (24 min).',
  'Weeks 3–4: 2 min run / 1 min walk, 8 rounds.',
  'Weeks 5–6: 4 min run / 1 min walk, 5 rounds.',
  'Weeks 7–8: run 20–30 min continuously at an easy pace.',
  'Run the day after an upper-body day, not before legs. Get fitted for shoes; at 6\'4" it matters.',
];
