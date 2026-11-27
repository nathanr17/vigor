// Product, snack and habit recommendations. Evidence ratings: strong | moderate | limited | avoid.
// Generic product types with what to look for. Brand names are only examples, not endorsements.

export const EVIDENCE = {
  strong: { label: 'Strong evidence', rank: 0 },
  moderate: { label: 'Moderate evidence', rank: 1 },
  limited: { label: 'Limited evidence', rank: 2 },
  avoid: { label: 'Skip', rank: 3 },
};

export const PRODUCT_SECTIONS = [
  {
    id: 'supps', title: 'Supplements worth considering',
    intro: 'Food comes first. These fill specific gaps. Talk to your doctor before starting anything new, especially if you take medication.',
    items: [
      {
        name: 'Creatine monohydrate', dose: '3–5 g daily, any time', ev: 'strong', for: ['muscle'],
        why: 'The most researched supplement for strength and muscle gain. It also supports high-intensity running.',
        ibs: 'Skip "loading" phases. Big doses cause GI upset for some people. Mix with plenty of water.',
        look: 'Plain monohydrate (Creapure® is a quality mark). NSF Certified for Sport or Informed Sport tested.',
      },
      {
        name: 'Whey protein isolate', dose: '1–2 scoops as needed to hit protein', ev: 'strong', for: ['muscle'],
        why: 'A convenient way to reach your protein target. Isolate is filtered to be nearly lactose-free.',
        ibs: 'Choose isolate over concentrate. Avoid formulas with inulin, chicory root, sorbitol, xylitol, maltitol or "gut blends".',
        look: 'Third-party tested (NSF / Informed Choice). Short ingredient list.',
      },
      {
        name: 'Vitamin D3', dose: '1,000–2,000 IU daily with a meal (or per your blood test)', ev: 'moderate', for: ['vitality'],
        why: 'One of the most common deficiencies. Low levels are linked to lower testosterone and erectile dysfunction.',
        ibs: 'Generally well tolerated.',
        look: 'Ask for a 25-OH vitamin D blood test to dose correctly. D3 (cholecalciferol) is better absorbed than D2.',
      },
      {
        name: 'Omega-3 fish oil', dose: '1–2 g EPA + DHA daily (if you eat fish less than twice a week)', ev: 'moderate', for: ['vitality', 'muscle'],
        why: 'Supports heart and blood-vessel health and recovery.',
        ibs: 'Take with food to avoid fishy burps. Some people find enteric-coated capsules easier on the stomach.',
        look: 'IFOS or USP certified for purity and freshness.',
      },
      {
        name: 'Magnesium glycinate', dose: '200–400 mg in the evening', ev: 'moderate', for: ['vitality', 'gut'],
        why: 'Supports sleep quality and recovery, and many active people are low in it.',
        ibs: 'Glycinate is gentle. Citrate and oxide act as laxatives: they can help IBS-C but worsen IBS-D.',
        look: 'Chelated "glycinate" or "bisglycinate" on the label.',
      },
      {
        name: 'Psyllium husk', dose: 'Start with 1 tsp daily in water, build slowly to 1 tbsp', ev: 'strong', for: ['gut'],
        why: 'Soluble fiber with the best evidence of any fiber for IBS symptoms. It helps both constipation and loose stools.',
        ibs: 'Low-FODMAP. Increase slowly and drink extra water. Avoid inulin- or wheat-bran-based fiber products.',
        look: 'Plain, unflavored psyllium (e.g. Metamucil plain or generic psyllium husk powder).',
      },
      {
        name: 'Enteric-coated peppermint oil', dose: 'As directed, 30–60 min before meals', ev: 'moderate', for: ['gut'],
        why: 'Clinical trials show it can relieve IBS abdominal pain and bloating.',
        ibs: 'Enteric coating helps prevent heartburn. Skip it if you have reflux.',
        look: 'Enteric-coated or "targeted release" capsules (e.g. IBgard).',
      },
      {
        name: 'Beetroot juice or nitrate shots', dose: '~400 mg nitrate, 2–3 h before cardio', ev: 'moderate', for: ['vitality'],
        why: 'Dietary nitrate improves endurance and blood flow.',
        ibs: 'Beets are moderate-FODMAP. Concentrated 70 ml shots are a small volume, but test them on a good gut day.',
        look: 'Standardized nitrate content on the label (e.g. Beet It Sport). Avoid antiseptic mouthwash, which blunts the effect.',
      },
      {
        name: 'L-citrulline', dose: '3–6 g daily', ev: 'limited', for: ['vitality'],
        why: 'Raises arginine and nitric oxide. Small studies suggest it helps blood flow and mild erectile issues.',
        ibs: 'Usually well tolerated.',
        look: 'Pure L-citrulline powder, not "citrulline malate" blends with proprietary extras.',
      },
      {
        name: 'Zinc', dose: '15–25 mg, only if your diet is low in it or bloodwork shows a deficiency', ev: 'limited', for: ['vitality'],
        why: 'Correcting a zinc deficiency restores testosterone. Extra zinc above normal levels does not boost it further.',
        ibs: 'Take with food. It can cause nausea on an empty stomach.',
        look: 'Don\'t exceed 40 mg a day; high doses deplete copper. Beef and pumpkin seeds usually cover your needs.',
      },
      {
        name: 'Probiotics', dose: '4-week trial of one specific strain', ev: 'limited', for: ['gut'],
        why: 'Results for IBS are mixed and strain-specific. Some people improve, many don\'t.',
        ibs: 'Try one at a time and track symptoms in your gut journal. Stop if no change after 4 weeks.',
        look: 'Products naming a studied strain (e.g. Bifidobacterium infantis 35624).',
      },
      {
        name: '"Testosterone boosters" & "male enhancement" pills', dose: '—', ev: 'avoid', for: ['vitality'],
        why: 'There is little evidence they work, and the FDA has repeatedly found hidden prescription drugs (like sildenafil) in "enhancement" supplements. That\'s dangerous with some medications.',
        ibs: 'Many contain high-FODMAP fillers and herbal extracts.',
        look: 'If you have concerns about performance or drive, see a doctor. ED can be an early sign of heart or blood-vessel issues worth checking.',
      },
    ],
  },
  {
    id: 'gear', title: 'Tools & gear',
    items: [
      { name: 'Monash University FODMAP Diet app', ev: 'strong', for: ['gut'], why: 'The authoritative lab-tested FODMAP database, made by the researchers who developed the diet. Use it to double-check any food.', look: 'One-time purchase on the App Store.' },
      { name: 'Digital kitchen scale', ev: 'strong', for: ['muscle'], why: 'Weighing meat, rice and oats for a couple of weeks calibrates your eye and makes your calorie tracking accurate.', look: 'Any scale with a tare button and 1 g accuracy.' },
      { name: 'Glass meal-prep containers', ev: 'strong', for: ['muscle'], why: 'Makes Sunday prep sustainable. Glass reheats evenly and doesn\'t stain.', look: 'Oven- and microwave-safe, snap-lock lids. Get 10–15 of them.' },
      { name: 'Heart-rate chest strap', ev: 'moderate', for: ['cardio'], why: 'Keeps easy runs truly easy (Zone 2), which builds your aerobic base and vascular health.', look: 'Bluetooth chest strap compatible with Apple Watch / iPhone (e.g. Polar H10, Garmin HRM).' },
      { name: 'Properly fitted running shoes', ev: 'moderate', for: ['cardio'], why: 'At 6\'4", the right shoe matters for your knees and shins.', look: 'Get fitted at a run specialty store. Replace every 300–500 miles.' },
      { name: 'Lifting belt & chalk', ev: 'moderate', for: ['muscle'], why: 'Helps bracing on heavy squats and deadlifts. Chalk improves your grip on pulls.', look: '10 mm lever or prong belt.' },
      { name: 'Foam roller', ev: 'limited', for: ['muscle'], why: 'Feels good and helps you warm up. Evidence for recovery is modest.', look: 'Medium-density, 36" long.' },
      { name: '1-liter water bottle', ev: 'strong', for: ['gut', 'muscle'], why: 'Extra fiber, creatine and training all need extra water. Aim for 3+ refills a day.', look: 'Insulated, easy to clean.' },
      { name: 'Sleep mask or blackout curtains', ev: 'moderate', for: ['vitality'], why: 'Deep, consistent sleep is when testosterone is produced and muscle recovers.', look: 'Contoured mask that doesn\'t press on your eyes.' },
    ],
  },
  {
    id: 'grocery', title: 'IBS-friendly grocery staples',
    items: [
      { name: 'Garlic-infused olive oil', ev: 'strong', for: ['gut'], why: 'All the garlic flavor with none of the fructans. The single most useful swap.', look: 'Store-bought infused oil (don\'t make it at home and store it; that carries a botulism risk).' },
      { name: 'Ultra-filtered lactose-free milk', ev: 'strong', for: ['gut', 'muscle'], why: 'Around 13 g protein per cup with no lactose.', look: 'e.g. Fairlife. Also great in shakes and overnight oats.' },
      { name: 'Lactose-free Greek yogurt', ev: 'strong', for: ['gut', 'muscle'], why: 'High-protein base for bowls, sauces and tzatziki.', look: 'Plain, unsweetened (e.g. Fage BestSelf, Green Valley).' },
      { name: 'Low-FODMAP certified sauces & broth', ev: 'moderate', for: ['gut'], why: 'Saves you from reading every label for hidden onion and garlic.', look: 'Look for the Monash "Low FODMAP Certified" or FODMAP Friendly logo (e.g. Fody, Gourmend).' },
      { name: 'Ready-to-drink protein shakes', ev: 'moderate', for: ['muscle'], why: 'Zero-prep protein for busy days.', look: 'Lactose-free milk-based ones (e.g. Fairlife Core Power). Avoid ones with inulin or sugar alcohols.' },
    ],
  },
];

export const SNACK_IDEAS = [
  { name: 'Lactose-free Greek yogurt cup', p: 15, kcal: 130, low: true },
  { name: 'Ready-to-drink protein shake (lactose-free)', p: 26, kcal: 170, low: true },
  { name: 'Hard-boiled eggs (2)', p: 13, kcal: 140, low: true },
  { name: 'String cheese + 1 orange', p: 7, kcal: 150, low: true },
  { name: 'Rice cakes (2) + 2 tbsp peanut butter', p: 9, kcal: 260, low: true },
  { name: 'Firm banana + 10 almonds', p: 4, kcal: 175, low: true },
  { name: 'Walnuts, 1 oz (omega-3)', p: 4, kcal: 185, low: true },
  { name: 'Pumpkin seeds, 1 oz (zinc + magnesium)', p: 8, kcal: 160, low: true },
  { name: '1–2 Brazil nuts (daily selenium)', p: 1, kcal: 35, low: true },
  { name: 'Dark chocolate 85%, 1 oz (flavonoids)', p: 3, kcal: 170, low: true },
  { name: 'Two kiwis (helps IBS-C)', p: 2, kcal: 90, low: true },
  { name: 'Tuna pouch + rice crackers', p: 17, kcal: 180, low: true },
  { name: 'Popcorn, 7 cups air-popped', p: 7, kcal: 220, low: true },
  { name: 'Beef or turkey jerky (check label for garlic/onion)', p: 12, kcal: 110, low: false },
  { name: 'Protein bar without inulin, chicory root or sugar alcohols', p: 20, kcal: 220, low: false },
  { name: 'Grapes or pineapple, 1 cup', p: 1, kcal: 75, low: true },
];

export const VITALITY_HABITS = [
  { title: 'Cardio is your #1 lever', body: 'Regular aerobic exercise is one of the best-proven ways to improve erectile function, because erections depend on healthy blood vessels. Aim for 150+ minutes of cardio a week (your Zone 2 runs and intervals count).' },
  { title: 'Protect your sleep', body: 'Most testosterone is released during sleep. Even one week of 5-hour nights measurably lowers testosterone in young men. Aim for 7–9 hours on a consistent schedule.' },
  { title: 'Train your pelvic floor', body: 'Pelvic floor exercises (Kegels) have clinical evidence for improving erectile strength and ejaculatory control. Use the 10-minute Pelvic Floor & Core workout 3–5× a week. Learn to relax the muscles, not just squeeze.' },
  { title: 'Eat Mediterranean-style', body: 'Diets rich in vegetables, fruit, fish, olive oil and nuts are linked to better erectile function. Leafy greens and beets (nitrates), berries and cocoa (flavonoids) and fatty fish (omega-3) are especially useful.' },
  { title: 'Lift heavy, stay lean', body: 'Strength training supports healthy testosterone, and excess body fat converts testosterone to estrogen. Your lean-bulk plan is designed to add muscle without much fat.' },
  { title: 'Go easy on alcohol & skip nicotine', body: 'Alcohol blunts performance and testosterone and is a common IBS trigger. Nicotine (including vaping) constricts blood vessels.' },
  { title: 'Manage stress', body: 'Chronic stress raises cortisol, lowers drive, and worsens IBS through the gut–brain axis. Walks, breathing exercises and time off screens all help.' },
  { title: 'Get annual bloodwork', body: 'Ask for testosterone (morning), vitamin D, lipids, glucose/A1c, iron/ferritin and a CBC. See a doctor about persistent changes in drive or performance. It\'s common, treatable, and can be an early heart-health signal.' },
];

export const IBS_GUIDE = [
  { title: 'How FODMAPs work', body: 'FODMAPs are fermentable carbs that draw water into the gut and are fermented by bacteria, which causes gas, bloating, pain and changes in stool for people with IBS. Portion size matters: many foods are fine in small amounts.' },
  { title: 'The 3-phase approach', body: '1) Eliminate: 2–6 weeks of mostly low-FODMAP recipes. 2) Reintroduce: test one FODMAP group at a time over 3 days, logging reactions here. 3) Personalize: bring back everything you tolerate. Ideally work with a registered dietitian trained in FODMAPs.' },
  { title: 'Log reactions consistently', body: 'After meals, tap the reaction button on a logged food. Insights get meaningful after 2–3 weeks of logging and highlight FODMAP groups and ingredients that line up with bad days.' },
  { title: 'Non-FODMAP triggers', body: 'Large fatty meals, coffee, alcohol, spicy food, eating fast and stress can all trigger symptoms. Use the notes field to capture these.' },
];
