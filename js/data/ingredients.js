// Ingredient database.
// Nutrition is per 100 g (raw/uncooked unless noted), approximated from USDA FoodData Central.
// u: grams per kitchen unit. buy: unit used on the grocery list.
// fod: FODMAP info — g = largest per-serving amount (grams) that is still low-FODMAP
//      (0 = any amount flags), lvl = what it becomes above that, groups = FODMAP groups.
//      Thresholds follow published Monash University guidance where known; verify in the Monash FODMAP app.
// vit: "vitality" nutrients this food is a notable source of; vmin = grams per serving to count.

export const CATEGORIES = [
  ['produce', 'Produce'],
  ['meat', 'Meat & Seafood'],
  ['dairy', 'Dairy & Eggs'],
  ['grains', 'Bread, Grains & Pasta'],
  ['pantry', 'Pantry & Canned'],
  ['nuts', 'Nuts & Seeds'],
  ['frozen', 'Frozen'],
  ['supp', 'Supplements'],
  ['staple', 'Pantry Staples (check you have)'],
];

export const FODMAP_GROUPS = {
  fructans: 'Fructans',
  gos: 'GOS',
  lactose: 'Lactose',
  fructose: 'Excess fructose',
  sorbitol: 'Sorbitol',
  mannitol: 'Mannitol',
};

export const VITALITY = {
  nitrates: { label: 'Nitrates', why: 'Dietary nitrates help your body make nitric oxide, which supports blood flow and endurance.' },
  zinc: { label: 'Zinc', why: 'Zinc is essential for testosterone production and sperm health.' },
  omega3: { label: 'Omega-3', why: 'Omega-3 fats support heart and blood-vessel health, which underpins erectile function.' },
  flavonoids: { label: 'Flavonoids', why: 'Higher flavonoid intake (berries, cocoa, citrus) is linked to lower risk of erectile dysfunction.' },
  vitD: { label: 'Vitamin D', why: 'Low vitamin D is linked to lower testosterone and poorer erectile function.' },
  magnesium: { label: 'Magnesium', why: 'Magnesium supports sleep quality, muscle function and healthy testosterone.' },
  selenium: { label: 'Selenium', why: 'Selenium supports sperm health and thyroid function.' },
  citrulline: { label: 'Citrulline', why: 'Citrulline converts to arginine, a building block of nitric oxide.' },
};

export const ING = {};

function I(key, name, cat, n, u = {}, x = {}) {
  const units = { g: 1, oz: 28.35, lb: 453.6, ...u };
  if (units.tbsp && !units.tsp) units.tsp = units.tbsp / 3;
  if (units.tsp && !units.tbsp) units.tbsp = units.tsp * 3;
  if (units.tbsp && !units.cup) units.cup = units.tbsp * 16;
  ING[key] = { key, name, cat, kcal: n[0], p: n[1], c: n[2], f: n[3], fib: n[4], u: units, buy: x.buy || 'g', ...x };
}
const SPICE = [300, 12, 55, 8, 30];

// ---------- Meat & seafood ----------
I('chicken_breast', 'Chicken breast, boneless skinless', 'meat', [120, 22.5, 0, 2.6, 0], {}, { buy: 'lb' });
I('chicken_thigh', 'Chicken thighs, boneless skinless', 'meat', [130, 19.5, 0, 5.5, 0], {}, { buy: 'lb' });
I('ground_turkey', 'Ground turkey, 93% lean', 'meat', [150, 19.5, 0, 7.5, 0], {}, { buy: 'lb' });
I('ground_beef', 'Ground beef, 93% lean', 'meat', [152, 21, 0, 7, 0], {}, { buy: 'lb', vit: ['zinc'], vmin: 85 });
I('sirloin', 'Top sirloin steak', 'meat', [150, 22, 0, 6.5, 0], {}, { buy: 'lb', vit: ['zinc'], vmin: 85 });
I('flank_steak', 'Flank steak', 'meat', [155, 21, 0, 7.5, 0], {}, { buy: 'lb', vit: ['zinc'], vmin: 85 });
I('beef_chuck', 'Beef chuck roast', 'meat', [190, 20, 0, 12, 0], {}, { buy: 'lb', vit: ['zinc'], vmin: 85 });
I('ground_chicken', 'Ground chicken', 'meat', [143, 17.4, 0, 8.1, 0], {}, { buy: 'lb' });
I('pork_chop', 'Boneless pork loin chops', 'meat', [136, 21.5, 0, 5, 0], {}, { buy: 'lb' });
I('pork_tenderloin', 'Pork tenderloin', 'meat', [120, 21, 0, 3.5, 0], {}, { buy: 'lb' });
I('salmon', 'Salmon fillets', 'meat', [190, 20, 0, 12, 0], {}, { buy: 'lb', vit: ['omega3', 'vitD'], vmin: 85 });
I('smoked_salmon', 'Smoked salmon', 'meat', [117, 18.3, 0, 4.3, 0], {}, { buy: 'oz', vit: ['omega3', 'vitD'], vmin: 56 });
I('shrimp', 'Shrimp, peeled & deveined', 'meat', [85, 20, 0, 0.5, 0], {}, { buy: 'lb', vit: ['selenium'], vmin: 85 });
I('cod', 'Cod fillets', 'meat', [82, 18, 0, 0.7, 0], {}, { buy: 'lb' });
I('deli_turkey', 'Deli turkey breast, low sodium', 'meat', [100, 18, 2, 1.5, 0], {}, {
  buy: 'oz', fod: { g: 0, lvl: 'mod', groups: ['fructans'], note: 'Many deli meats are seasoned with onion or garlic powder. Check the label or choose a plain roasted one.' },
});

// ---------- Dairy & eggs ----------
I('eggs', 'Eggs, large', 'dairy', [143, 12.6, 0.7, 9.5, 0], { each: 50 }, { buy: 'each', pack: [12, 'dozen'], vit: ['vitD'], vmin: 100 });
I('egg_whites', 'Liquid egg whites', 'dairy', [52, 10.9, 0.7, 0.2, 0], { cup: 243, tbsp: 15 }, { buy: 'cup', pack: [2, 'carton (16 oz)'] });
I('yogurt_lf', 'Greek yogurt, plain 2% lactose-free', 'dairy', [75, 10, 4, 2, 0], { cup: 227, tbsp: 15 }, { buy: 'oz', pack: [32, 'tub (32 oz)'] });
I('milk_lf', 'Ultra-filtered lactose-free milk (e.g. Fairlife 2%)', 'dairy', [50, 5.4, 2.5, 1.9, 0], { cup: 240, tbsp: 15 }, { buy: 'cup', pack: [6.5, 'bottle (52 oz)'], vit: ['vitD'], vmin: 240 });
I('cheddar', 'Sharp cheddar', 'dairy', [404, 23, 3.1, 33, 0], { cup: 113, tbsp: 7, slice: 28 }, { buy: 'oz' });
I('parmesan', 'Parmesan, grated', 'dairy', [420, 29, 3.2, 28, 0], { cup: 100, tbsp: 5 }, { buy: 'oz' });
I('feta', 'Feta, crumbled', 'dairy', [265, 14, 4, 21, 0], { cup: 150, tbsp: 9 }, { buy: 'oz', fod: { g: 40, lvl: 'mod', groups: ['lactose'], note: 'Low-FODMAP up to about 1/4 cup (40 g).' } });
I('mozzarella', 'Mozzarella, part-skim', 'dairy', [254, 24, 2.8, 16, 0], { cup: 112, tbsp: 7, stick: 28 }, { buy: 'oz', fod: { g: 40, lvl: 'mod', groups: ['lactose'], note: 'Low-FODMAP up to about 40 g; aged/hard cheeses are lowest in lactose.' } });
I('cream_cheese', 'Cream cheese, light', 'dairy', [235, 7, 8, 18, 0], { tbsp: 15 }, { buy: 'oz', fod: { g: 40, lvl: 'mod', groups: ['lactose'], note: 'Low-FODMAP up to 2 tbsp (40 g). Lactose-free versions exist.' } });
I('butter', 'Butter', 'dairy', [717, 0.9, 0.1, 81, 0], { tbsp: 14, tsp: 4.7 }, { buy: 'tbsp' });

// ---------- Produce ----------
I('spinach', 'Baby spinach', 'produce', [23, 2.9, 3.6, 0.4, 2.2], { cup: 30 }, { buy: 'oz', vit: ['nitrates', 'magnesium'], vmin: 30 });
I('arugula', 'Arugula', 'produce', [25, 2.6, 3.7, 0.7, 1.6], { cup: 20 }, { buy: 'oz', vit: ['nitrates'], vmin: 20 });
I('kale', 'Kale', 'produce', [35, 2.9, 4.4, 1.5, 4.1], { cup: 20 }, { buy: 'oz' });
I('romaine', 'Romaine lettuce', 'produce', [17, 1.2, 3.3, 0.3, 2.1], { cup: 47, each: 500 }, { buy: 'each', unitName: 'head' });
I('bok_choy', 'Baby bok choy', 'produce', [13, 1.5, 2.2, 0.2, 1], { cup: 70, each: 100 }, { buy: 'each', vit: ['nitrates'], vmin: 60 });
I('broccoli', 'Broccoli florets', 'produce', [34, 2.8, 6.6, 0.4, 2.6], { cup: 71, each: 300 }, {
  buy: 'lb', fod: { g: 75, lvl: 'mod', groups: ['fructose'], note: 'Heads are low-FODMAP up to about 3/4 cup (75 g); stalks are higher.' },
});
I('cauliflower', 'Cauliflower', 'produce', [25, 1.9, 5, 0.3, 2], { cup: 107 }, {
  buy: 'lb', fod: { g: 15, lvl: 'high', groups: ['mannitol'], note: 'High in mannitol. Swap for broccoli heads, zucchini or potato.' },
});
I('bell_pepper_red', 'Red bell pepper', 'produce', [31, 1, 6, 0.3, 2.1], { each: 120, cup: 149 }, {
  buy: 'each', fod: { g: 45, lvl: 'mod', groups: ['fructose'], note: 'Low-FODMAP up to about 1/3 cup (45 g); green peppers tolerate larger portions.' },
});
I('bell_pepper_green', 'Green bell pepper', 'produce', [20, 0.9, 4.6, 0.2, 1.7], { each: 120, cup: 149 }, {
  buy: 'each', fod: { g: 75, lvl: 'mod', groups: ['sorbitol'], note: 'Low-FODMAP up to 1/2 cup (75 g).' },
});
I('carrot', 'Carrots', 'produce', [41, 0.9, 9.6, 0.2, 2.8], { each: 61, cup: 128 }, { buy: 'each' });
I('zucchini', 'Zucchini', 'produce', [17, 1.2, 3.1, 0.3, 1], { each: 200, cup: 124 }, {
  buy: 'each', fod: { g: 65, lvl: 'mod', groups: ['fructans'], note: 'Low-FODMAP up to about 1/3 cup (65 g).' },
});
I('cucumber', 'Cucumber', 'produce', [15, 0.7, 3.6, 0.1, 0.5], { each: 300, cup: 104 }, { buy: 'each' });
I('tomato', 'Tomatoes', 'produce', [18, 0.9, 3.9, 0.2, 1.2], { each: 123, cup: 180 }, { buy: 'each' });
I('cherry_tomatoes', 'Cherry tomatoes', 'produce', [18, 0.9, 3.9, 0.2, 1.2], { each: 17, cup: 149 }, {
  buy: 'cup', fod: { g: 75, lvl: 'mod', groups: ['fructose'], note: 'Low-FODMAP up to about 5 tomatoes (75 g).' },
});
I('potato', 'Potatoes (russet or Yukon gold)', 'produce', [77, 2.1, 17.5, 0.1, 1.3], { each: 213, cup: 150 }, { buy: 'lb' });
I('baby_potatoes', 'Baby potatoes', 'produce', [70, 1.9, 16, 0.1, 1.5], { cup: 150 }, { buy: 'lb' });
I('sweet_potato', 'Sweet potatoes', 'produce', [86, 1.6, 20, 0.1, 3], { each: 150, cup: 133 }, {
  buy: 'each', fod: { g: 75, lvl: 'mod', groups: ['mannitol'], note: 'Low-FODMAP up to 1/2 cup (75 g); larger portions are moderate in mannitol.' },
});
I('green_beans', 'Green beans', 'produce', [31, 1.8, 7, 0.2, 2.7], { cup: 100 }, {
  buy: 'lb', fod: { g: 75, lvl: 'mod', groups: ['sorbitol'], note: 'Low-FODMAP up to about 15 beans (75 g).' },
});
I('asparagus', 'Asparagus', 'produce', [20, 2.2, 3.9, 0.1, 2.1], { each: 16 }, {
  buy: 'lb', fod: { g: 12, lvl: 'high', groups: ['fructose', 'fructans'], note: 'High in fructose and fructans. Swap for green beans or zucchini.' },
});
I('mushrooms', 'White mushrooms', 'produce', [22, 3.1, 3.3, 0.3, 1], { cup: 70 }, {
  buy: 'oz', fod: { g: 0, lvl: 'high', groups: ['mannitol'], note: 'High in mannitol. Oyster mushrooms or canned champignons are low-FODMAP swaps.' },
});
I('onion', 'Yellow onion', 'produce', [40, 1.1, 9.3, 0.1, 1.7], { each: 150, cup: 160 }, {
  buy: 'each', fod: { g: 0, lvl: 'high', groups: ['fructans'], note: 'High in fructans even in small amounts. Swap: green tops of scallions or leeks, chives, or a pinch of asafoetida.' },
});
I('garlic', 'Garlic', 'produce', [149, 6.4, 33, 0.5, 2.1], { clove: 3, each: 40 }, {
  buy: 'clove', unitName: 'clove', fod: { g: 0, lvl: 'high', groups: ['fructans'], note: 'High in fructans. Swap: garlic-infused oil — fructans are not oil-soluble, so you get the flavor without the trigger.' },
});
I('scallion_greens', 'Scallions (use green tops only)', 'produce', [32, 1.8, 7.3, 0.2, 2.6], { each: 10, tbsp: 6, cup: 100 }, { buy: 'each', pack: [8, 'bunch'] });
I('chives', 'Fresh chives', 'produce', [30, 3.3, 4.4, 0.7, 2.5], { tbsp: 3 }, { buy: 'tbsp' });
I('ginger', 'Fresh ginger', 'produce', [80, 1.8, 18, 0.8, 2], { tbsp: 6, tsp: 2, inch: 10 }, { buy: 'inch', unitName: 'inch knob' });
I('cilantro', 'Cilantro', 'produce', [23, 2.1, 3.7, 0.5, 2.8], { cup: 16, tbsp: 1, each: 50 }, { buy: 'each', unitName: 'bunch' });
I('parsley', 'Flat-leaf parsley', 'produce', [36, 3, 6.3, 0.8, 3.3], { cup: 60, tbsp: 4, each: 60 }, { buy: 'each', unitName: 'bunch' });
I('basil', 'Fresh basil', 'produce', [23, 3.2, 2.7, 0.6, 1.6], { cup: 24, tbsp: 2, each: 30 }, { buy: 'each', unitName: 'bunch' });
I('mint', 'Fresh mint', 'produce', [70, 3.8, 15, 0.9, 8], { tbsp: 2, each: 20 }, { buy: 'each', unitName: 'bunch' });
I('dill', 'Fresh dill', 'produce', [43, 3.5, 7, 1.1, 2.1], { tbsp: 1, each: 20 }, { buy: 'each', unitName: 'bunch' });
I('lemon', 'Lemons', 'produce', [29, 1.1, 9.3, 0.3, 2.8], { each: 84, tbsp: 15 }, { buy: 'each' });
I('lime', 'Limes', 'produce', [30, 0.7, 10.5, 0.2, 2.8], { each: 67, tbsp: 15 }, { buy: 'each' });
I('avocado', 'Avocado', 'produce', [160, 2, 8.5, 14.7, 6.7], { each: 150 }, {
  buy: 'each', fod: { g: 30, lvl: 'mod', groups: ['sorbitol'], note: 'Low-FODMAP at 1/8 avocado (30 g); 1/4 or more is moderate–high in sorbitol.' },
});
I('banana', 'Bananas (firm, just ripe)', 'produce', [89, 1.1, 22.8, 0.3, 2.6], { each: 118 }, {
  buy: 'each', fod: { g: 120, lvl: 'mod', groups: ['fructans'], note: 'Choose firm, just-yellow bananas. Spotty ripe bananas are high in fructans (low only at ~1/3 banana).' },
});
I('blueberries', 'Blueberries', 'produce', [57, 0.7, 14.5, 0.3, 2.4], { cup: 148 }, {
  buy: 'cup', vit: ['flavonoids'], vmin: 50, fod: { g: 125, lvl: 'mod', groups: ['fructans'], note: 'Low-FODMAP up to about 1 cup.' },
});
I('strawberries', 'Strawberries', 'produce', [32, 0.7, 7.7, 0.3, 2], { cup: 166, each: 12 }, {
  buy: 'cup', vit: ['flavonoids'], vmin: 60, fod: { g: 150, lvl: 'mod', groups: ['fructose'], note: 'Low-FODMAP in normal portions.' },
});
I('raspberries', 'Raspberries', 'produce', [52, 1.2, 12, 0.7, 6.5], { cup: 123 }, {
  buy: 'cup', vit: ['flavonoids'], vmin: 50, fod: { g: 60, lvl: 'mod', groups: ['fructose'], note: 'Low-FODMAP up to about 1/2 cup (60 g).' },
});
I('orange', 'Oranges', 'produce', [47, 0.9, 11.8, 0.1, 2.4], { each: 140 }, { buy: 'each', vit: ['flavonoids'], vmin: 100 });
I('kiwi', 'Kiwis', 'produce', [61, 1.1, 14.7, 0.5, 3], { each: 75 }, { buy: 'each' });
I('pineapple', 'Pineapple', 'produce', [50, 0.5, 13, 0.1, 1.4], { cup: 165 }, { buy: 'cup', fod: { g: 140, lvl: 'mod', groups: ['fructans'], note: 'Low-FODMAP up to about 1 cup.' } });
I('grapes', 'Grapes, red', 'produce', [69, 0.7, 18, 0.2, 0.9], { cup: 151 }, { buy: 'cup', vit: ['flavonoids'], vmin: 100 });
I('pomegranate', 'Pomegranate arils', 'produce', [83, 1.7, 18.7, 1.2, 4], { cup: 174, tbsp: 11 }, {
  buy: 'cup', vit: ['flavonoids'], vmin: 30, fod: { g: 45, lvl: 'mod', groups: ['fructans'], note: 'Low-FODMAP up to 1/4 cup (45 g).' },
});
I('watermelon', 'Watermelon', 'produce', [30, 0.6, 7.6, 0.2, 0.4], { cup: 152 }, {
  buy: 'cup', vit: ['citrulline'], vmin: 150, fod: { g: 15, lvl: 'high', groups: ['fructose', 'mannitol', 'fructans'], note: 'High in several FODMAPs. Try a small portion during reintroduction to test your tolerance.' },
});
I('beets', 'Beets, cooked (vacuum-packed is easiest)', 'produce', [44, 1.7, 10, 0.2, 2], { each: 80, cup: 170 }, {
  buy: 'each', vit: ['nitrates'], vmin: 20, fod: { g: 20, lvl: 'mod', groups: ['fructans', 'gos'], note: 'Low-FODMAP at about 2 slices (20 g); larger servings are moderate.' },
});
I('celery', 'Celery', 'produce', [14, 0.7, 3, 0.2, 1.6], { each: 40, cup: 101 }, {
  buy: 'each', unitName: 'stalk', vit: ['nitrates'], vmin: 40, fod: { g: 10, lvl: 'mod', groups: ['mannitol'], note: 'Low-FODMAP only at about 1/4 stalk (10 g).' },
});
I('corn', 'Corn kernels (frozen or canned)', 'frozen', [86, 3.3, 19, 1.4, 2], { cup: 145 }, {
  buy: 'cup', fod: { g: 75, lvl: 'mod', groups: ['sorbitol'], note: 'Low-FODMAP up to about 1/2 cup.' },
});
I('edamame', 'Edamame, shelled (frozen)', 'frozen', [121, 12, 9, 5, 5], { cup: 155 }, {
  buy: 'cup', vit: ['magnesium'], vmin: 60, fod: { g: 90, lvl: 'mod', groups: ['gos'], note: 'Low-FODMAP up to about 1/2 cup shelled (90 g).' },
});
I('cabbage', 'Cabbage, green or red (or coleslaw mix)', 'produce', [25, 1.3, 5.8, 0.1, 2.5], { cup: 70 }, {
  buy: 'cup', fod: { g: 75, lvl: 'mod', groups: ['sorbitol'], note: 'Low-FODMAP up to about 3/4 cup (75 g).' },
});
I('jalapeno', 'Jalapeño', 'produce', [29, 0.9, 6.5, 0.4, 2.8], { each: 14 }, { buy: 'each' });
I('butternut', 'Butternut squash, cubed', 'produce', [45, 1, 11.7, 0.1, 2], { cup: 140 }, {
  buy: 'cup', fod: { g: 45, lvl: 'mod', groups: ['mannitol', 'gos'], note: 'Low-FODMAP up to about 1/3 cup (45 g).' },
});

I('tofu', 'Extra-firm tofu', 'produce', [144, 15.8, 2.8, 8.7, 2.3], { block: 396, each: 396 }, { buy: 'each', unitName: 'block (14 oz)' });

I('mango', 'Mango, diced (fresh or frozen)', 'produce', [60, 0.8, 15, 0.4, 1.6], { cup: 165 }, {
  buy: 'cup', fod: { g: 40, lvl: 'high', groups: ['fructose'], note: 'High in excess fructose above about 1/4 cup. Swap: pineapple (low-FODMAP up to 1 cup).' },
});
I('apple', 'Apples', 'produce', [52, 0.3, 14, 0.2, 2.4], { each: 182, cup: 125 }, {
  buy: 'each', fod: { g: 20, lvl: 'high', groups: ['fructose', 'sorbitol'], note: 'High in fructose and sorbitol. Swap: firm banana, kiwi, orange or strawberries.' },
});
I('bean_sprouts', 'Bean sprouts', 'produce', [30, 3, 6, 0.2, 1.8], { cup: 104 }, { buy: 'cup' });

// ---------- Grains, bread, pasta ----------
I('oats', 'Rolled oats', 'grains', [379, 13, 68, 6.5, 10], { cup: 80, tbsp: 5 }, {
  buy: 'cup', fod: { g: 52, lvl: 'mod', groups: ['gos', 'fructans'], note: 'Low-FODMAP up to 1/2 cup dry (52 g).' },
});
I('rice', 'Jasmine or basmati rice (dry)', 'grains', [365, 7.1, 80, 0.7, 1.3], { cup: 185 }, { buy: 'cup' });
I('brown_rice', 'Brown rice (dry)', 'grains', [367, 7.5, 76, 2.7, 3.4], { cup: 190 }, { buy: 'cup' });
I('quinoa', 'Quinoa (dry)', 'grains', [368, 14, 64, 6, 7], { cup: 170 }, { buy: 'cup', vit: ['magnesium'], vmin: 40 });
I('pasta_gf', 'Gluten-free pasta (rice/corn blend)', 'grains', [360, 7, 78, 2, 3], {}, { buy: 'oz' });
I('pasta', 'Pasta, regular wheat', 'grains', [371, 13, 75, 1.5, 3.2], {}, {
  buy: 'oz', fod: { g: 40, lvl: 'high', groups: ['fructans'], note: 'Wheat pasta is high in fructans at meal-size portions. Swap: gluten-free pasta.' },
});
I('rice_noodles', 'Rice noodles (dry)', 'grains', [364, 6, 80, 0.6, 1.6], {}, { buy: 'oz' });
I('sourdough', 'Sourdough bread (traditional, slow-fermented)', 'grains', [270, 10, 52, 2.4, 2.3], { slice: 50 }, {
  buy: 'slice', pack: [16, 'loaf'], fod: { g: 110, lvl: 'mod', groups: ['fructans'], note: 'Traditional slow-fermented sourdough is low-FODMAP at 2 slices. Supermarket "sourdough-style" bread may not be.' },
});
I('tortilla_corn', 'Corn tortillas (6")', 'grains', [218, 5.7, 44.6, 2.9, 6.3], { each: 26 }, { buy: 'each', pack: [30, 'pack'] });
I('tortilla_flour', 'Flour tortillas (burrito size)', 'grains', [304, 8.1, 50, 7.6, 3.5], { each: 70 }, {
  buy: 'each', pack: [8, 'pack'], fod: { g: 35, lvl: 'high', groups: ['fructans'], note: 'Wheat tortillas are high in fructans. Swap: gluten-free or corn tortillas.' },
});
I('tortilla_gf', 'Gluten-free tortillas / wraps', 'grains', [280, 5, 50, 6, 3], { each: 60 }, { buy: 'each', pack: [6, 'pack'], note: 'Check labels for inulin or chicory root.' });
I('polenta', 'Polenta or corn grits (dry)', 'grains', [370, 8, 79, 1.8, 4], { cup: 157 }, { buy: 'cup' });
I('popcorn', 'Popcorn kernels (1/4 cup ≈ 7 cups popped)', 'grains', [387, 13, 78, 4.5, 15], { cup: 8 }, { buy: 'oz' });
I('rice_cakes', 'Rice cakes, plain', 'grains', [387, 8, 81, 2.8, 4], { each: 9 }, { buy: 'each', pack: [14, 'pack'] });

// ---------- Pantry & canned ----------
I('canned_tomatoes', 'Diced tomatoes, canned (no onion/garlic)', 'pantry', [24, 1.1, 4.4, 0.2, 1.4], { can: 411, cup: 240 }, {
  buy: 'can', fod: { g: 110, lvl: 'mod', groups: ['fructose'], note: 'Low-FODMAP at about 1/2 cup per serving.' },
});
I('tomato_paste', 'Tomato paste', 'pantry', [82, 4.3, 19, 0.5, 4.1], { tbsp: 16 }, { buy: 'tbsp' });
I('pumpkin', 'Pumpkin purée, canned (100% pumpkin)', 'pantry', [34, 1.1, 8, 0.3, 2.9], { cup: 245, can: 425 }, {
  buy: 'cup', pack: [1.75, 'can (15 oz)'], fod: { g: 75, lvl: 'mod', groups: ['gos', 'mannitol'], note: 'Low-FODMAP up to about 1/3 cup (75 g).' },
});
I('hot_sauce', "Cayenne hot sauce (e.g. Frank's RedHot)", 'pantry', [12, 0.5, 0.5, 0.4, 0.5], { tbsp: 15 }, {
  buy: 'tbsp', fod: { g: 15, lvl: 'mod', groups: ['fructans'], note: 'Contains a little garlic powder. Keep it to about 1 tbsp per serving.' },
});
I('salmon_canned', 'Wild salmon, canned', 'pantry', [136, 23, 0, 5, 0], { can: 150 }, { buy: 'can', vit: ['omega3', 'vitD'], vmin: 85 });
I('chickpeas', 'Chickpeas, canned (rinsed)', 'pantry', [139, 7.1, 22.5, 2.6, 6.2], { can: 250, cup: 164 }, {
  buy: 'can', fod: { g: 42, lvl: 'mod', groups: ['gos'], note: 'Canned & rinsed chickpeas are low-FODMAP up to 1/4 cup (42 g).' },
});
I('lentils', 'Lentils, canned (rinsed)', 'pantry', [116, 9, 20, 0.4, 7.9], { can: 260, cup: 198 }, {
  buy: 'can', fod: { g: 46, lvl: 'mod', groups: ['gos'], note: 'Canned & rinsed lentils are low-FODMAP up to about 1/4 cup (46 g).' },
});
I('black_beans', 'Black beans, canned (rinsed)', 'pantry', [132, 8.9, 23.7, 0.5, 8.7], { can: 260, cup: 172 }, {
  buy: 'can', vit: ['magnesium'], vmin: 60, fod: { g: 20, lvl: 'high', groups: ['gos', 'fructans'], note: 'High in GOS. Swap: canned lentils (1/4 cup) or skip.' },
});
I('coconut_milk', 'Light coconut milk, canned', 'pantry', [70, 0.7, 2, 6.5, 0], { can: 400, cup: 240 }, {
  buy: 'can', fod: { g: 125, lvl: 'mod', groups: ['sorbitol'], note: 'Low-FODMAP up to 1/2 cup.' },
});
I('broth_lf', 'Low-FODMAP chicken broth (e.g. Fody, Gourmend)', 'pantry', [5, 1, 0.3, 0.1, 0], { cup: 240 }, { buy: 'cup' });
I('broth', 'Chicken broth, regular', 'pantry', [6, 1, 0.5, 0.2, 0], { cup: 240 }, {
  buy: 'cup', fod: { g: 0, lvl: 'high', groups: ['fructans'], note: 'Most broths contain onion and garlic. Swap: a low-FODMAP broth.' },
});
I('salsa', 'Salsa, jarred', 'pantry', [36, 1.5, 6.6, 0.2, 1.8], { tbsp: 16, cup: 260 }, {
  buy: 'tbsp', fod: { g: 0, lvl: 'high', groups: ['fructans'], note: 'Most salsa contains onion and garlic. Swap: a low-FODMAP salsa (e.g. Fody) or fresh tomato, cilantro and lime.' },
});
I('pesto', 'Basil pesto, jarred', 'pantry', [420, 5, 6, 42, 1.5], { tbsp: 15 }, {
  buy: 'tbsp', fod: { g: 0, lvl: 'high', groups: ['fructans'], note: 'Contains garlic. Swap: blend basil, parmesan, walnuts and garlic-infused oil.' },
});
I('honey', 'Honey', 'pantry', [304, 0.3, 82, 0, 0.2], { tbsp: 21, tsp: 7 }, {
  buy: 'tbsp', fod: { g: 7, lvl: 'high', groups: ['fructose'], note: 'High in excess fructose above 1 tsp. Swap: maple syrup.' },
});
I('olives', 'Kalamata olives', 'pantry', [230, 1.6, 6, 22, 3.2], { each: 4, tbsp: 9 }, { buy: 'each' });
I('pickles', 'Dill pickles', 'pantry', [11, 0.3, 2.3, 0.2, 1.2], { each: 35 }, { buy: 'each' });
I('mayo', 'Mayonnaise (olive oil)', 'pantry', [680, 1, 0.6, 75, 0], { tbsp: 14 }, { buy: 'tbsp' });
I('peanut_butter', 'Natural peanut butter', 'pantry', [588, 25, 20, 50, 6], { tbsp: 16, cup: 256 }, { buy: 'tbsp', pack: [28, 'jar (16 oz)'] });
I('almond_butter', 'Almond butter', 'pantry', [614, 21, 19, 56, 10], { tbsp: 16 }, {
  buy: 'tbsp', vit: ['magnesium'], vmin: 16, fod: { g: 20, lvl: 'mod', groups: ['gos'], note: 'Low-FODMAP at 1 tbsp.' },
});
I('tahini', 'Tahini', 'pantry', [595, 17, 21, 54, 9.3], { tbsp: 15 }, { buy: 'tbsp', pack: [24, 'jar (12 oz)'] });
I('dark_chocolate', 'Dark chocolate, 70–85%', 'pantry', [600, 7.8, 46, 43, 11], { square: 10, tbsp: 10 }, {
  buy: 'oz', vit: ['flavonoids', 'magnesium'], vmin: 10, fod: { g: 30, lvl: 'mod', groups: ['lactose'], note: 'Low-FODMAP up to 30 g.' },
});
I('cocoa', 'Unsweetened cocoa powder', 'pantry', [228, 19.6, 58, 13.7, 37], { tbsp: 5.4 }, {
  buy: 'tbsp', vit: ['flavonoids', 'magnesium'], vmin: 5, fod: { g: 16, lvl: 'mod', groups: ['fructans'], note: 'Low-FODMAP up to about 3 tbsp.' },
});
I('maple', 'Pure maple syrup', 'pantry', [260, 0, 67, 0.1, 0], { tbsp: 20, tsp: 7 }, { buy: 'tbsp', pack: [16, 'bottle (12 oz)'] });
I('rice_vinegar', 'Rice vinegar, unseasoned', 'staple', [18, 0, 0.5, 0, 0], { tbsp: 15 }, { buy: 'tbsp' });
I('balsamic', 'Balsamic vinegar', 'staple', [88, 0.5, 17, 0, 0], { tbsp: 16 }, {
  buy: 'tbsp', fod: { g: 21, lvl: 'mod', groups: ['fructose'], note: 'Low-FODMAP at 1 tbsp.' },
});
I('tamari', 'Tamari / gluten-free soy sauce', 'staple', [60, 10, 5.6, 0.1, 0.8], { tbsp: 16, tsp: 5.3 }, { buy: 'tbsp' });
I('dijon', 'Dijon mustard', 'staple', [66, 4.4, 5.8, 4, 3.3], { tbsp: 15, tsp: 5 }, { buy: 'tbsp' });
I('sriracha', 'Sriracha', 'staple', [93, 1.9, 19, 0.9, 2.2], { tsp: 6, tbsp: 18 }, {
  buy: 'tsp', fod: { g: 6, lvl: 'mod', groups: ['fructans'], note: 'Contains garlic, but is low-FODMAP at 1 tsp.' },
});
I('cornstarch', 'Cornstarch', 'staple', [381, 0.3, 91, 0.1, 0.9], { tbsp: 8, tsp: 2.7 }, { buy: 'tbsp' });
I('baking_powder', 'Baking powder', 'staple', [53, 0, 28, 0, 0.2], { tsp: 4.6 }, { buy: 'tsp' });
I('vanilla', 'Vanilla extract', 'staple', [288, 0, 12.7, 0.1, 0], { tsp: 4.2 }, { buy: 'tsp' });
I('capers', 'Capers', 'staple', [23, 2.4, 4.9, 0.9, 3.2], { tbsp: 9 }, { buy: 'tbsp' });
I('olive_oil', 'Extra-virgin olive oil', 'staple', [884, 0, 0, 100, 0], { tbsp: 13.5, tsp: 4.5 }, { buy: 'tbsp' });
I('garlic_oil', 'Garlic-infused olive oil', 'staple', [884, 0, 0, 100, 0], { tbsp: 13.5, tsp: 4.5 }, { buy: 'tbsp' });
I('sesame_oil', 'Toasted sesame oil', 'staple', [884, 0, 0, 100, 0], { tbsp: 13.6, tsp: 4.5 }, { buy: 'tbsp' });
I('sesame_seeds', 'Sesame seeds', 'staple', [573, 17.7, 23, 50, 11.8], { tbsp: 9, tsp: 3 }, { buy: 'tbsp' });
I('salt', 'Kosher salt', 'staple', [0, 0, 0, 0, 0], { tsp: 5 }, { buy: 'tsp' });
I('pepper', 'Black pepper', 'staple', SPICE, { tsp: 2.3 }, { buy: 'tsp' });
I('cumin', 'Ground cumin', 'staple', SPICE, { tsp: 2, tbsp: 6 }, { buy: 'tsp' });
I('paprika', 'Smoked paprika', 'staple', SPICE, { tsp: 2.3, tbsp: 7 }, { buy: 'tsp' });
I('oregano', 'Dried oregano', 'staple', SPICE, { tsp: 1, tbsp: 3 }, { buy: 'tsp' });
I('italian', 'Italian seasoning (garlic-free)', 'staple', SPICE, { tsp: 1, tbsp: 3 }, { buy: 'tsp' });
I('cinnamon', 'Ground cinnamon', 'staple', SPICE, { tsp: 2.6 }, { buy: 'tsp' });
I('turmeric', 'Ground turmeric', 'staple', SPICE, { tsp: 3 }, { buy: 'tsp' });
I('curry_powder', 'Curry powder', 'staple', SPICE, { tsp: 2, tbsp: 6 }, { buy: 'tsp' });
I('garam_masala', 'Garam masala', 'staple', SPICE, { tsp: 2 }, { buy: 'tsp' });
I('chili_flakes', 'Red pepper flakes', 'staple', SPICE, { tsp: 1.5 }, { buy: 'tsp' });
I('thyme', 'Dried thyme', 'staple', SPICE, { tsp: 1 }, { buy: 'tsp' });
I('rosemary', 'Dried rosemary', 'staple', SPICE, { tsp: 1.2 }, { buy: 'tsp' });
I('cayenne', 'Cayenne pepper', 'staple', SPICE, { tsp: 1.8 }, { buy: 'tsp' });
I('asafoetida', 'Asafoetida (gluten-free)', 'staple', SPICE, { tsp: 2 }, { buy: 'tsp' });
I('chili_powder', 'Chili powder', 'staple', SPICE, { tsp: 2.7, tbsp: 8 }, {
  buy: 'tsp', fod: { g: 0, lvl: 'mod', groups: ['fructans'], note: 'Most blends contain garlic and onion powder. Swap: cumin + smoked paprika + oregano.' },
});

// ---------- Nuts & seeds ----------
I('almonds', 'Almonds', 'nuts', [579, 21, 22, 50, 12.5], { each: 1.2, cup: 143, tbsp: 9 }, {
  buy: 'oz', vit: ['magnesium'], vmin: 14, fod: { g: 12, lvl: 'mod', groups: ['gos'], note: 'Low-FODMAP at 10 almonds; 20+ is moderate in GOS.' },
});
I('walnuts', 'Walnuts', 'nuts', [654, 15, 14, 65, 6.7], { cup: 100, tbsp: 7.5 }, { buy: 'oz', vit: ['omega3'], vmin: 7 });
I('peanuts', 'Peanuts, roasted', 'nuts', [567, 26, 16, 49, 8.5], { cup: 146, tbsp: 9 }, { buy: 'oz' });
I('pumpkin_seeds', 'Pumpkin seeds (pepitas)', 'nuts', [559, 30, 11, 49, 6], { cup: 129, tbsp: 8 }, {
  buy: 'oz', vit: ['zinc', 'magnesium'], vmin: 8, fod: { g: 23, lvl: 'mod', groups: ['fructans'], note: 'Low-FODMAP up to 2 tbsp (23 g).' },
});
I('chia', 'Chia seeds', 'nuts', [486, 17, 42, 31, 34], { tbsp: 12, tsp: 4 }, { buy: 'tbsp', vit: ['omega3', 'magnesium'], vmin: 10 });
I('flax', 'Ground flaxseed', 'nuts', [534, 18, 29, 42, 27], { tbsp: 7 }, {
  buy: 'tbsp', vit: ['omega3'], vmin: 7, fod: { g: 15, lvl: 'mod', groups: ['fructans'], note: 'Low-FODMAP up to 1 tbsp.' },
});
I('hemp', 'Hemp hearts', 'nuts', [553, 32, 8.7, 49, 4], { tbsp: 10 }, { buy: 'tbsp', vit: ['omega3', 'magnesium', 'zinc'], vmin: 15 });
I('brazil_nuts', 'Brazil nuts', 'nuts', [659, 14, 12, 67, 7.5], { each: 5 }, { buy: 'each', vit: ['selenium'], vmin: 4 });

// ---------- Frozen ----------
I('mixed_berries', 'Mixed berries, frozen', 'frozen', [50, 0.7, 12, 0.3, 3], { cup: 140 }, {
  buy: 'cup', vit: ['flavonoids'], vmin: 60, fod: { g: 75, lvl: 'mod', groups: ['fructose'], note: 'Blends with blackberries are higher; low-FODMAP around 1/2 cup.' },
});

// ---------- Supplements ----------
I('whey', 'Whey protein isolate (vanilla or chocolate)', 'supp', [370, 83, 3, 1.7, 0], { scoop: 31 }, {
  buy: 'scoop', note: 'Isolate is nearly lactose-free. Avoid blends with inulin, chicory root or sugar alcohols.',
});
