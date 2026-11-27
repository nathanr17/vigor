// Recipe library. Macros, FODMAP flags and vitality highlights are computed from ingredients (see nutrition.js).
// ing: [ingredientKey, quantity, unit, optionalNote]  — quantities are for the whole recipe (all servings).
// meal: breakfast | main (lunch/dinner) | snack.   prep: holds well for 3–4 days of meal prep.

export const RECIPES = [];
const R = (r) => RECIPES.push({ tags: [], prep: false, ...r });

// =====================================================================
// BREAKFAST
// =====================================================================
R({
  id: 'pb-protein-oats', name: 'PB Protein Overnight Oats', emoji: '🥣', meal: ['breakfast'], serves: 1, mins: 5, prep: true,
  ing: [['oats', 0.5, 'cup'], ['milk_lf', 0.75, 'cup'], ['whey', 1, 'scoop'], ['chia', 1, 'tbsp'], ['peanut_butter', 1.5, 'tbsp'], ['strawberries', 0.5, 'cup', 'sliced'], ['cinnamon', 0.25, 'tsp']],
  steps: ['In a jar, stir oats, milk, protein powder, chia and cinnamon until no clumps remain.', 'Swirl in the peanut butter, seal and refrigerate overnight (or at least 4 hours).', 'Top with strawberries in the morning. Make 4–5 jars on Sunday for the work week.'],
  note: 'Slow carbs plus 45+ g protein to start the day. Oats are kept at the low-FODMAP portion.',
});
R({
  id: 'berry-crunch-bowl', name: 'Greek Yogurt Berry Crunch Bowl', emoji: '🫐', meal: ['breakfast', 'snack'], serves: 1, mins: 5,
  ing: [['yogurt_lf', 1.5, 'cup'], ['blueberries', 0.5, 'cup'], ['walnuts', 2, 'tbsp'], ['pumpkin_seeds', 1, 'tbsp'], ['chia', 1, 'tsp'], ['maple', 1, 'tsp']],
  steps: ['Spoon yogurt into a bowl.', 'Top with blueberries, walnuts, pumpkin seeds and chia.', 'Drizzle with maple syrup.'],
  note: 'Berries (flavonoids), walnuts (omega-3) and pepitas (zinc) in one bowl.',
});
R({
  id: 'spinach-feta-egg-muffins', name: 'Spinach Feta Egg Muffins + Toast', emoji: '🧁', meal: ['breakfast'], serves: 4, mins: 30, prep: true,
  ing: [['eggs', 12, 'each'], ['egg_whites', 1.5, 'cup'], ['spinach', 2, 'cup', 'chopped'], ['bell_pepper_red', 1, 'each', 'diced'], ['feta', 0.75, 'cup'], ['scallion_greens', 3, 'each', 'green tops, sliced'], ['salt', 0.5, 'tsp'], ['pepper', 0.25, 'tsp'], ['olive_oil', 1, 'tsp', 'for the pan'], ['sourdough', 4, 'slice']],
  steps: ['Heat oven to 350°F and oil a 12-cup muffin tin.', 'Whisk eggs, egg whites, salt and pepper.', 'Divide spinach, pepper, feta and scallion greens among the cups, then pour in the egg mixture.', 'Bake 20–22 minutes until set. Cool and refrigerate up to 4 days.', 'Serve 3 muffins with a slice of toasted sourdough.'],
  note: 'Grab-and-go protein. Reheat 30–45 seconds in the microwave.',
});
R({
  id: 'banana-oat-pancakes', name: 'Banana Oat Protein Pancakes', emoji: '🥞', meal: ['breakfast'], serves: 1, mins: 15,
  ing: [['oats', 0.5, 'cup'], ['egg_whites', 0.5, 'cup'], ['eggs', 1, 'each'], ['whey', 1, 'scoop'], ['banana', 0.5, 'each'], ['baking_powder', 1, 'tsp'], ['cinnamon', 0.5, 'tsp'], ['butter', 1, 'tsp', 'for the pan'], ['blueberries', 0.5, 'cup'], ['maple', 1, 'tbsp']],
  steps: ['Blend oats into a flour, then add egg whites, egg, protein powder, banana, baking powder and cinnamon. Blend until smooth.', 'Rest 2 minutes. Heat a buttered nonstick pan over medium-low.', 'Cook 1/4-cup pancakes until bubbles form, flip and cook 1 more minute.', 'Top with blueberries and maple syrup.'],
});
R({
  id: 'steak-eggs-hash', name: 'Steak, Eggs & Potato Hash', emoji: '🥩', meal: ['breakfast', 'main'], serves: 2, mins: 30,
  ing: [['sirloin', 8, 'oz'], ['eggs', 4, 'each'], ['potato', 400, 'g', 'diced small'], ['bell_pepper_green', 1, 'each', 'diced'], ['scallion_greens', 3, 'each', 'green tops'], ['olive_oil', 1, 'tbsp'], ['garlic_oil', 1, 'tbsp'], ['paprika', 1, 'tsp'], ['salt', 0.75, 'tsp'], ['pepper', 0.5, 'tsp']],
  steps: ['Microwave the diced potatoes 4 minutes to par-cook.', 'Sear seasoned steak in olive oil, 3–4 minutes per side. Rest, then slice.', 'In the same pan add garlic oil, potatoes, pepper and paprika. Cook until crispy, about 10 minutes.', 'Push hash aside and fry the eggs. Serve with steak and scallion greens.'],
  note: 'Red meat is one of the best sources of zinc for testosterone support.',
});
R({
  id: 'breakfast-burritos', name: 'Meal-Prep Breakfast Burritos', emoji: '🌯', meal: ['breakfast'], serves: 6, mins: 40, prep: true,
  ing: [['tortilla_flour', 6, 'each'], ['eggs', 10, 'each'], ['egg_whites', 1, 'cup'], ['ground_turkey', 1, 'lb'], ['potato', 1, 'lb', 'diced'], ['cheddar', 1.5, 'cup', 'shredded'], ['salsa', 6, 'tbsp'], ['spinach', 2, 'cup'], ['cumin', 1, 'tsp'], ['paprika', 1, 'tsp'], ['olive_oil', 1, 'tbsp'], ['salt', 1, 'tsp']],
  steps: ['Roast diced potatoes with oil and salt at 425°F for 25 minutes.', 'Brown turkey with cumin and paprika. Add spinach to wilt.', 'Scramble eggs and egg whites softly.', 'Fill tortillas with potatoes, turkey, eggs, cheddar and salsa. Roll tightly.', 'Wrap each in foil. Refrigerate 4 days or freeze 2 months. Reheat 2 minutes in the microwave (remove foil).'],
  swaps: 'Low-FODMAP version: use gluten-free tortillas and a low-FODMAP salsa (or fresh tomato + cilantro).',
});
R({
  id: 'smoked-salmon-toast', name: 'Smoked Salmon Sourdough Toast', emoji: '🐟', meal: ['breakfast'], serves: 1, mins: 10,
  ing: [['sourdough', 2, 'slice'], ['smoked_salmon', 3, 'oz'], ['cream_cheese', 2, 'tbsp'], ['eggs', 2, 'each', 'scrambled'], ['cucumber', 0.25, 'each', 'thinly sliced'], ['arugula', 1, 'cup'], ['capers', 1, 'tsp'], ['dill', 1, 'tbsp']],
  steps: ['Toast the sourdough and spread with cream cheese.', 'Scramble the eggs softly.', 'Layer arugula, cucumber, smoked salmon and eggs on the toast.', 'Finish with capers and dill.'],
  note: 'Omega-3s and vitamin D from salmon, nitrates from arugula.',
});
R({
  id: 'shakshuka', name: 'Garlic-Oil Shakshuka', emoji: '🍳', meal: ['breakfast', 'main'], serves: 2, mins: 25,
  ing: [['canned_tomatoes', 1, 'can'], ['eggs', 6, 'each'], ['bell_pepper_green', 1, 'each', 'diced'], ['garlic_oil', 1, 'tbsp'], ['cumin', 1, 'tsp'], ['paprika', 1, 'tsp'], ['spinach', 2, 'cup'], ['feta', 0.25, 'cup'], ['parsley', 2, 'tbsp'], ['sourdough', 2, 'slice'], ['salt', 0.5, 'tsp']],
  steps: ['Warm garlic oil in a skillet. Cook the pepper 5 minutes.', 'Add cumin and paprika for 30 seconds, then tomatoes and salt. Simmer 8 minutes.', 'Stir in spinach. Make 6 wells and crack in the eggs.', 'Cover and cook 5–7 minutes until whites set.', 'Top with feta and parsley. Serve with toasted sourdough.'],
});
R({
  id: 'choc-pb-shake', name: 'Chocolate PB Recovery Shake', emoji: '🥤', meal: ['breakfast', 'snack'], serves: 1, mins: 5, tags: ['smoothie'],
  ing: [['milk_lf', 1.5, 'cup'], ['whey', 1, 'scoop', 'chocolate'], ['peanut_butter', 1.5, 'tbsp'], ['banana', 1, 'each', 'firm, frozen'], ['cocoa', 1, 'tbsp'], ['oats', 0.25, 'cup']],
  steps: ['Add everything to a blender with a handful of ice.', 'Blend 45–60 seconds until thick and smooth.'],
  note: 'A great post-workout option with roughly a 2:1 carb-to-protein ratio.',
});
R({
  id: 'berry-beet-smoothie', name: 'Berry Beet Pump Smoothie', emoji: '🍓', meal: ['breakfast', 'snack'], serves: 1, mins: 5, tags: ['smoothie'],
  ing: [['mixed_berries', 0.75, 'cup'], ['beets', 20, 'g', 'about 2 slices'], ['spinach', 1, 'cup'], ['yogurt_lf', 0.75, 'cup'], ['whey', 1, 'scoop', 'vanilla'], ['milk_lf', 1, 'cup'], ['chia', 1, 'tbsp']],
  steps: ['Blend milk, spinach and beet first until smooth.', 'Add berries, yogurt, protein and chia. Blend until thick.'],
  note: 'Nitrates (beets, spinach) plus flavonoids (berries). Have it 1–2 hours before cardio.',
});
R({
  id: 'turkey-sweet-potato-hash', name: 'Turkey & Sweet Potato Hash', emoji: '🍠', meal: ['breakfast', 'main'], serves: 4, mins: 35, prep: true,
  ing: [['ground_turkey', 1.5, 'lb'], ['sweet_potato', 2, 'each', 'diced'], ['potato', 300, 'g', 'diced'], ['spinach', 4, 'cup'], ['bell_pepper_green', 1, 'each', 'diced'], ['garlic_oil', 2, 'tbsp'], ['paprika', 2, 'tsp'], ['cumin', 1, 'tsp'], ['eggs', 8, 'each'], ['salt', 1, 'tsp'], ['pepper', 0.5, 'tsp']],
  steps: ['Toss potatoes and sweet potatoes with 1 tbsp garlic oil and salt. Roast at 425°F for 25 minutes.', 'Brown turkey in the remaining oil with paprika, cumin and pepper.', 'Add bell pepper and spinach until wilted. Fold in the potatoes.', 'Portion into 4 containers. Fry or soft-boil 2 eggs per serving fresh each morning.'],
});
R({
  id: 'avocado-egg-toast', name: 'Loaded Avocado Egg Toast', emoji: '🥑', meal: ['breakfast'], serves: 1, mins: 10,
  ing: [['sourdough', 2, 'slice'], ['avocado', 0.25, 'each'], ['eggs', 3, 'each'], ['cherry_tomatoes', 5, 'each', 'halved'], ['pumpkin_seeds', 1, 'tbsp'], ['arugula', 1, 'cup'], ['chili_flakes', 0.25, 'tsp'], ['lemon', 0.25, 'each']],
  steps: ['Toast bread. Mash avocado with lemon juice and a pinch of salt.', 'Fry or poach the eggs.', 'Spread avocado, top with arugula, eggs, tomatoes, pepitas and chili flakes.'],
  swaps: 'For strict low-FODMAP, use 1/8 avocado (30 g) and add a second egg.',
});
R({
  id: 'vanilla-chia-pudding', name: 'Vanilla Protein Chia Pudding', emoji: '🍮', meal: ['breakfast', 'snack'], serves: 1, mins: 5, prep: true,
  ing: [['milk_lf', 1, 'cup'], ['chia', 3, 'tbsp'], ['whey', 1, 'scoop', 'vanilla'], ['maple', 1, 'tsp'], ['vanilla', 0.25, 'tsp'], ['raspberries', 0.5, 'cup'], ['walnuts', 1, 'tbsp']],
  steps: ['Whisk milk, protein powder, maple and vanilla until smooth.', 'Whisk in chia. Rest 5 minutes, whisk again to break up clumps.', 'Refrigerate at least 3 hours. Top with raspberries and walnuts.'],
});
R({
  id: 'breakfast-tacos', name: 'Egg & Cheddar Breakfast Tacos', emoji: '🌮', meal: ['breakfast'], serves: 1, mins: 10,
  ing: [['tortilla_corn', 3, 'each'], ['eggs', 3, 'each'], ['egg_whites', 0.25, 'cup'], ['cheddar', 1, 'oz'], ['tomato', 0.5, 'each', 'diced'], ['cilantro', 1, 'tbsp'], ['lime', 0.25, 'each'], ['spinach', 0.5, 'cup'], ['butter', 1, 'tsp']],
  steps: ['Warm tortillas in a dry skillet.', 'Melt butter, wilt spinach, then softly scramble eggs and egg whites.', 'Fill tortillas with eggs and cheddar, then top with tomato, cilantro and a squeeze of lime.'],
});
R({
  id: 'protein-french-toast', name: 'Protein French Toast', emoji: '🍞', meal: ['breakfast'], serves: 1, mins: 15,
  ing: [['sourdough', 2, 'slice'], ['eggs', 2, 'each'], ['egg_whites', 0.5, 'cup'], ['milk_lf', 0.25, 'cup'], ['cinnamon', 0.5, 'tsp'], ['vanilla', 0.5, 'tsp'], ['butter', 1, 'tsp'], ['yogurt_lf', 0.5, 'cup'], ['strawberries', 0.5, 'cup'], ['maple', 1, 'tbsp']],
  steps: ['Whisk eggs, egg whites, milk, cinnamon and vanilla in a shallow dish.', 'Soak bread 30 seconds per side.', 'Cook in buttered pan over medium heat, 3 minutes per side.', 'Top with Greek yogurt, strawberries and maple syrup.'],
});

// =====================================================================
// MAINS (lunch & dinner)
// =====================================================================
R({
  id: 'lemon-herb-chicken-rice', name: 'Lemon Herb Chicken & Rice Bowls', emoji: '🍋', meal: ['main'], serves: 4, mins: 40, prep: true, tags: ['gut'],
  ing: [['chicken_breast', 2, 'lb'], ['rice', 1.5, 'cup'], ['broccoli', 3, 'cup'], ['carrot', 2, 'each', 'sliced'], ['olive_oil', 2, 'tbsp'], ['garlic_oil', 1, 'tbsp'], ['lemon', 2, 'each', 'zest + juice'], ['oregano', 2, 'tsp'], ['parsley', 0.25, 'cup'], ['salt', 1.5, 'tsp'], ['pepper', 0.5, 'tsp']],
  steps: ['Marinate chicken in garlic oil, lemon zest and juice, oregano, salt and pepper (15 minutes to overnight).', 'Cook rice according to the package.', 'Roast chicken at 425°F for 18–22 minutes (165°F inside). Roast broccoli and carrots tossed in olive oil on a second tray for 18 minutes.', 'Slice chicken, divide everything into 4 containers and top with parsley.'],
  note: 'A dependable, gut-gentle base meal. About 55 g protein per bowl.',
});
R({
  id: 'turkey-taco-bowls', name: 'Turkey Taco Bowls', emoji: '🌮', meal: ['main'], serves: 4, mins: 30, prep: true,
  ing: [['ground_turkey', 2, 'lb'], ['rice', 1.25, 'cup'], ['cumin', 1, 'tbsp'], ['paprika', 2, 'tsp'], ['oregano', 1, 'tsp'], ['garlic_oil', 1, 'tbsp'], ['romaine', 4, 'cup', 'shredded'], ['cherry_tomatoes', 1, 'cup'], ['cheddar', 1, 'cup', 'shredded'], ['corn', 0.5, 'cup'], ['avocado', 0.5, 'each'], ['lime', 2, 'each'], ['cilantro', 0.25, 'cup'], ['salt', 1, 'tsp']],
  steps: ['Cook the rice.', 'Brown turkey in garlic oil. Add cumin, paprika, oregano, salt and 1/4 cup water. Simmer 3 minutes.', 'Divide rice, turkey and corn among containers. Pack lettuce, tomatoes, cheese and avocado separately to keep them fresh.', 'Finish with lime juice and cilantro.'],
  note: 'Homemade taco seasoning skips the onion and garlic powder found in packets.',
});
R({
  id: 'steak-burrito-bowls', name: 'Classic Steak Burrito Bowls', emoji: '🥙', meal: ['main'], serves: 4, mins: 35, prep: true,
  ing: [['flank_steak', 1.5, 'lb'], ['brown_rice', 1, 'cup'], ['black_beans', 1, 'can'], ['onion', 1, 'each', 'sliced'], ['garlic', 3, 'clove', 'minced'], ['bell_pepper_red', 2, 'each', 'sliced'], ['salsa', 0.5, 'cup'], ['cheddar', 0.5, 'cup'], ['chili_powder', 1, 'tbsp'], ['cumin', 1, 'tsp'], ['olive_oil', 1, 'tbsp'], ['lime', 2, 'each'], ['cilantro', 0.25, 'cup'], ['salt', 1, 'tsp']],
  steps: ['Rub steak with chili powder, cumin, garlic and salt. Cook rice.', 'Sear steak 4–5 minutes per side. Rest 10 minutes and slice against the grain.', 'Sauté onion and peppers in oil until soft. Warm the beans.', 'Build bowls with rice, beans, peppers, steak, salsa, cheddar, lime and cilantro.'],
  swaps: 'Low-FODMAP version: garlic oil instead of garlic, scallion greens instead of onion, cumin + paprika instead of chili powder, 1/4 cup lentils per bowl instead of black beans, low-FODMAP salsa.',
});
R({
  id: 'maple-dijon-salmon', name: 'Maple-Dijon Salmon & Quinoa', emoji: '🐟', meal: ['main'], serves: 2, mins: 30,
  ing: [['salmon', 1, 'lb'], ['quinoa', 0.5, 'cup'], ['sweet_potato', 1, 'each', 'cubed'], ['green_beans', 150, 'g'], ['dijon', 1, 'tbsp'], ['maple', 1, 'tbsp'], ['olive_oil', 1, 'tbsp'], ['lemon', 0.5, 'each'], ['salt', 0.75, 'tsp'], ['pepper', 0.25, 'tsp']],
  steps: ['Heat oven to 425°F. Toss sweet potato with half the oil and salt; roast 10 minutes.', 'Cook quinoa (1 cup water, 15 minutes).', 'Add green beans to the tray. Place salmon on the tray, brush with dijon and maple mixed together.', 'Roast 12–14 minutes until salmon flakes. Finish with lemon.'],
  note: 'Omega-3s and vitamin D support vascular health, which underpins sexual function.',
});
R({
  id: 'ginger-beef-broccoli', name: 'Ginger Beef & Broccoli', emoji: '🥦', meal: ['main'], serves: 4, mins: 25, prep: true,
  ing: [['flank_steak', 1.5, 'lb', 'thinly sliced'], ['broccoli', 4, 'cup'], ['rice', 1.5, 'cup'], ['tamari', 0.25, 'cup'], ['maple', 1, 'tbsp'], ['ginger', 2, 'tbsp', 'grated'], ['garlic_oil', 1, 'tbsp'], ['sesame_oil', 1, 'tbsp'], ['cornstarch', 1, 'tbsp'], ['scallion_greens', 4, 'each'], ['sesame_seeds', 1, 'tbsp']],
  steps: ['Cook rice. Toss beef with cornstarch and a pinch of salt.', 'Whisk tamari, maple, ginger and 1/4 cup water.', 'Sear beef in garlic oil over high heat in two batches. Remove.', 'Stir-fry broccoli with 2 tbsp water for 3 minutes. Return beef, add sauce and toss until glossy.', 'Finish with sesame oil, scallion greens and sesame seeds. Serve over rice.'],
});
R({
  id: 'thai-peanut-noodles', name: 'Thai Peanut Chicken Noodles', emoji: '🥜', meal: ['main'], serves: 4, mins: 30, prep: true,
  ing: [['chicken_breast', 1.5, 'lb'], ['rice_noodles', 8, 'oz'], ['peanut_butter', 5, 'tbsp'], ['tamari', 3, 'tbsp'], ['lime', 2, 'each'], ['maple', 1, 'tbsp'], ['sriracha', 2, 'tsp'], ['ginger', 1, 'tbsp'], ['bell_pepper_red', 1, 'each', 'sliced'], ['carrot', 2, 'each', 'julienned'], ['cabbage', 2, 'cup', 'shredded'], ['peanuts', 0.25, 'cup', 'chopped'], ['cilantro', 0.25, 'cup'], ['garlic_oil', 1, 'tbsp']],
  steps: ['Cook noodles, rinse in cold water.', 'Whisk peanut butter, tamari, lime juice, maple, sriracha, ginger and 1/4 cup warm water.', 'Cook diced chicken in garlic oil 6–8 minutes.', 'Toss noodles, chicken, vegetables and sauce. Top with peanuts and cilantro. Good warm or cold.'],
});
R({
  id: 'greek-chicken-quinoa', name: 'Greek Chicken Quinoa Bowls', emoji: '🫒', meal: ['main'], serves: 4, mins: 35, prep: true,
  ing: [['chicken_thigh', 2, 'lb'], ['quinoa', 1, 'cup'], ['cucumber', 1, 'each', 'diced'], ['cherry_tomatoes', 1, 'cup', 'halved'], ['feta', 0.5, 'cup'], ['olives', 12, 'each'], ['yogurt_lf', 1, 'cup'], ['lemon', 2, 'each'], ['dill', 2, 'tbsp'], ['oregano', 2, 'tsp'], ['garlic_oil', 2, 'tbsp'], ['salt', 1.5, 'tsp']],
  steps: ['Marinate chicken in garlic oil, juice of 1 lemon, oregano and salt.', 'Cook quinoa. Grill or roast chicken at 425°F for 20 minutes.', 'Tzatziki: yogurt, 1/4 of the cucumber (grated and squeezed), dill, lemon juice and salt.', 'Bowl up quinoa, chicken, cucumber, tomatoes, olives and feta with tzatziki on the side.'],
  note: 'Mediterranean-style eating is associated with better erectile function.',
});
R({
  id: 'turkey-meatballs-marinara', name: 'Turkey Meatballs & Marinara', emoji: '🍝', meal: ['main'], serves: 4, mins: 40, prep: true,
  ing: [['ground_turkey', 2, 'lb'], ['eggs', 1, 'each'], ['oats', 0.33, 'cup', 'blitzed'], ['parmesan', 0.5, 'cup'], ['basil', 0.25, 'cup'], ['italian', 2, 'tsp'], ['garlic_oil', 2, 'tbsp'], ['canned_tomatoes', 1, 'can'], ['pasta_gf', 8, 'oz'], ['spinach', 2, 'cup'], ['salt', 1, 'tsp']],
  steps: ['Heat oven to 400°F. Mix turkey, egg, oats, half the parmesan, Italian seasoning and salt. Roll 20 meatballs.', 'Bake 18 minutes.', 'Meanwhile simmer tomatoes with garlic oil, basil and a pinch of salt for 15 minutes. Stir in spinach.', 'Cook pasta. Add meatballs to the sauce and serve over pasta with the remaining parmesan.'],
});
R({
  id: 'spaghetti-bolognese', name: 'Classic Spaghetti Bolognese', emoji: '🍝', meal: ['main'], serves: 4, mins: 45, prep: true,
  ing: [['ground_beef', 1.5, 'lb'], ['pasta', 12, 'oz'], ['onion', 1, 'each', 'finely diced'], ['garlic', 3, 'clove'], ['carrot', 1, 'each', 'finely diced'], ['celery', 1, 'each', 'finely diced'], ['canned_tomatoes', 1, 'can'], ['tomato_paste', 2, 'tbsp'], ['parmesan', 0.25, 'cup'], ['olive_oil', 1, 'tbsp'], ['italian', 2, 'tsp'], ['salt', 1, 'tsp']],
  steps: ['Sauté onion, carrot and celery in oil for 8 minutes. Add garlic for 1 minute.', 'Add beef and brown, breaking it up.', 'Stir in tomato paste, tomatoes, Italian seasoning and salt. Simmer 20 minutes.', 'Cook pasta, toss with sauce and top with parmesan.'],
  swaps: 'Low-FODMAP version: gluten-free pasta, garlic oil instead of garlic, scallion greens instead of onion, and skip the celery.',
});
R({
  id: 'shrimp-fried-rice', name: 'Shrimp & Egg Fried Rice', emoji: '🍤', meal: ['main'], serves: 4, mins: 25, prep: true,
  ing: [['shrimp', 1.5, 'lb'], ['rice', 1.5, 'cup', 'cooked a day ahead, chilled'], ['eggs', 4, 'each'], ['carrot', 2, 'each', 'diced'], ['edamame', 1, 'cup'], ['scallion_greens', 5, 'each'], ['tamari', 3, 'tbsp'], ['sesame_oil', 1, 'tbsp'], ['garlic_oil', 1, 'tbsp'], ['ginger', 1, 'tbsp']],
  steps: ['Cook shrimp in garlic oil over high heat, 2 minutes per side. Remove.', 'Scramble eggs in the pan. Remove.', 'Stir-fry carrots, edamame and ginger 3 minutes. Add cold rice and press it into the pan to crisp.', 'Return shrimp and eggs. Add tamari, sesame oil and scallion greens and toss.'],
});
R({
  id: 'coconut-chicken-curry', name: 'Coconut Chicken Curry', emoji: '🍛', meal: ['main'], serves: 4, mins: 35, prep: true,
  ing: [['chicken_thigh', 2, 'lb', 'cubed'], ['coconut_milk', 1, 'can'], ['canned_tomatoes', 1, 'cup'], ['curry_powder', 2, 'tbsp'], ['garam_masala', 1, 'tsp'], ['turmeric', 1, 'tsp'], ['ginger', 1, 'tbsp'], ['garlic_oil', 2, 'tbsp'], ['spinach', 4, 'cup'], ['rice', 1.25, 'cup'], ['cilantro', 0.25, 'cup'], ['lime', 1, 'each'], ['salt', 1, 'tsp']],
  steps: ['Cook rice.', 'Brown chicken in garlic oil. Add ginger, curry powder, garam masala and turmeric for 1 minute.', 'Add coconut milk, tomatoes and salt. Simmer 15 minutes.', 'Stir in spinach until wilted. Finish with lime and cilantro.'],
  note: 'Check that your curry powder is garlic- and onion-free. Most pure blends are.',
});
R({
  id: 'sheet-pan-steak-potatoes', name: 'Sheet-Pan Steak, Potatoes & Green Beans', emoji: '🥔', meal: ['main'], serves: 2, mins: 35,
  ing: [['sirloin', 1, 'lb'], ['baby_potatoes', 1, 'lb', 'halved'], ['green_beans', 150, 'g'], ['olive_oil', 1.5, 'tbsp'], ['garlic_oil', 1, 'tbsp'], ['butter', 1, 'tbsp'], ['rosemary', 1, 'tsp'], ['salt', 1, 'tsp'], ['pepper', 0.5, 'tsp']],
  steps: ['Roast potatoes with olive oil, rosemary and salt at 425°F for 20 minutes.', 'Add green beans tossed in garlic oil. Push to the edges.', 'Add seasoned steak and broil 4–5 minutes per side for medium-rare.', 'Rest steak 5 minutes, slice and top with butter.'],
});
R({
  id: 'teriyaki-salmon-bowls', name: 'Teriyaki Salmon Rice Bowls', emoji: '🍣', meal: ['main'], serves: 4, mins: 30, prep: true,
  ing: [['salmon', 1.5, 'lb'], ['rice', 1.25, 'cup'], ['tamari', 0.25, 'cup'], ['maple', 2, 'tbsp'], ['rice_vinegar', 1, 'tbsp'], ['ginger', 1, 'tbsp'], ['cornstarch', 1, 'tsp'], ['cucumber', 1, 'each'], ['edamame', 1, 'cup'], ['carrot', 1, 'each', 'shredded'], ['sesame_seeds', 1, 'tbsp'], ['scallion_greens', 3, 'each']],
  steps: ['Cook rice. Simmer tamari, maple, vinegar, ginger and cornstarch slurry until thick (2 minutes).', 'Bake salmon at 400°F for 12 minutes, brushing with half the sauce.', 'Bowl up rice, salmon, cucumber, edamame and carrot. Drizzle with the remaining sauce and add sesame and scallion greens.'],
});
R({
  id: 'turkey-chili', name: 'Low-FODMAP Turkey Chili & Rice', emoji: '🌶️', meal: ['main'], serves: 6, mins: 45, prep: true,
  ing: [['ground_turkey', 2, 'lb'], ['canned_tomatoes', 2, 'can'], ['bell_pepper_red', 2, 'each'], ['zucchini', 1, 'each'], ['lentils', 1, 'can'], ['cumin', 2, 'tbsp'], ['paprika', 1, 'tbsp'], ['oregano', 2, 'tsp'], ['cocoa', 1, 'tbsp'], ['garlic_oil', 2, 'tbsp'], ['cheddar', 0.75, 'cup'], ['scallion_greens', 4, 'each'], ['rice', 1.5, 'cup'], ['salt', 1.5, 'tsp']],
  steps: ['Brown turkey in garlic oil. Add peppers and zucchini for 5 minutes.', 'Add spices and cocoa for 1 minute, then tomatoes, lentils, salt and 1 cup water.', 'Simmer 25 minutes. Cook rice.', 'Serve over rice with cheddar and scallion greens. Freezes well.'],
  note: 'If tomatoes bother you, use 1 can instead of 2.',
});
R({
  id: 'chicken-pesto-pasta', name: 'Chicken Pesto Pasta', emoji: '🌿', meal: ['main'], serves: 4, mins: 25, prep: true,
  ing: [['chicken_breast', 1.5, 'lb'], ['pasta', 12, 'oz'], ['pesto', 0.5, 'cup'], ['cherry_tomatoes', 1, 'cup'], ['spinach', 2, 'cup'], ['parmesan', 0.25, 'cup'], ['olive_oil', 1, 'tbsp'], ['salt', 1, 'tsp']],
  steps: ['Cook pasta; reserve 1/2 cup pasta water.', 'Season and cook chicken in oil 6–7 minutes per side. Slice.', 'Toss pasta with pesto, spinach, tomatoes and a splash of pasta water.', 'Top with chicken and parmesan.'],
  swaps: 'Low-FODMAP version: gluten-free pasta plus homemade pesto (basil, parmesan, walnuts, garlic-infused oil).',
});
R({
  id: 'cod-tacos', name: 'Crispy Cod Tacos & Lime Slaw', emoji: '🐠', meal: ['main'], serves: 2, mins: 25,
  ing: [['cod', 1, 'lb'], ['tortilla_corn', 8, 'each'], ['cabbage', 2, 'cup'], ['yogurt_lf', 0.5, 'cup'], ['lime', 2, 'each'], ['cilantro', 0.25, 'cup'], ['cumin', 1, 'tsp'], ['paprika', 1, 'tsp'], ['cornstarch', 1, 'tbsp'], ['olive_oil', 1, 'tbsp'], ['avocado', 0.25, 'each'], ['salt', 0.75, 'tsp']],
  steps: ['Toss cabbage with juice of 1 lime and a pinch of salt.', 'Mix yogurt with lime juice and salt for crema.', 'Pat cod dry, dust with cornstarch, cumin, paprika and salt. Pan-fry in oil 3 minutes per side.', 'Fill warm tortillas with cod, slaw, crema, avocado and cilantro.'],
});
R({
  id: 'herb-pork-tenderloin', name: 'Herb Pork Tenderloin & Roasted Veg', emoji: '🐖', meal: ['main'], serves: 4, mins: 40, prep: true,
  ing: [['pork_tenderloin', 2, 'lb'], ['potato', 1.5, 'lb', 'cubed'], ['carrot', 4, 'each'], ['olive_oil', 2, 'tbsp'], ['garlic_oil', 1, 'tbsp'], ['dijon', 2, 'tbsp'], ['maple', 1, 'tbsp'], ['thyme', 1, 'tsp'], ['rosemary', 1, 'tsp'], ['salt', 1.5, 'tsp'], ['pepper', 0.5, 'tsp']],
  steps: ['Toss potatoes and carrots with olive oil and salt. Roast at 425°F for 15 minutes.', 'Rub pork with garlic oil, dijon, maple, herbs, salt and pepper.', 'Nestle pork among the vegetables and roast 20–25 minutes to 145°F inside.', 'Rest 10 minutes and slice.'],
});
R({
  id: 'chicken-fajitas', name: 'Sheet-Pan Chicken Fajitas', emoji: '🫑', meal: ['main'], serves: 4, mins: 30,
  ing: [['chicken_breast', 2, 'lb', 'sliced'], ['bell_pepper_red', 2, 'each'], ['bell_pepper_green', 1, 'each'], ['onion', 1, 'each'], ['chili_powder', 1, 'tbsp'], ['cumin', 1, 'tsp'], ['olive_oil', 2, 'tbsp'], ['tortilla_flour', 8, 'each'], ['cheddar', 0.5, 'cup'], ['yogurt_lf', 0.5, 'cup'], ['lime', 2, 'each'], ['salt', 1, 'tsp']],
  steps: ['Heat oven to 425°F. Toss chicken, peppers and onion with oil, chili powder, cumin and salt.', 'Spread on 2 sheet pans and roast 18–20 minutes.', 'Warm tortillas. Serve with cheddar, yogurt and lime.'],
  swaps: 'Low-FODMAP version: skip the onion, use cumin + paprika instead of chili powder, green peppers only, and corn tortillas.',
});
R({
  id: 'crispy-tofu-bok-choy', name: 'Crispy Tofu & Bok Choy Stir-Fry', emoji: '🥬', meal: ['main'], serves: 3, mins: 30,
  ing: [['tofu', 2, 'block', 'extra-firm, pressed'], ['bok_choy', 4, 'each', 'halved'], ['bell_pepper_red', 1, 'each'], ['tamari', 3, 'tbsp'], ['maple', 1, 'tbsp'], ['ginger', 1, 'tbsp'], ['garlic_oil', 2, 'tbsp'], ['cornstarch', 2, 'tbsp'], ['rice', 1, 'cup'], ['sesame_seeds', 1, 'tbsp'], ['sesame_oil', 1, 'tsp']],
  steps: ['Cook rice. Cube tofu and toss with cornstarch.', 'Pan-fry tofu in garlic oil until golden on all sides, about 10 minutes. Remove.', 'Stir-fry bok choy and pepper for 3 minutes.', 'Add tamari, maple and ginger, return tofu and toss. Finish with sesame oil and seeds.'],
});
R({
  id: 'tuna-salad-sandwich', name: 'Lemon-Dill Tuna Sandwich', emoji: '🥪', meal: ['main'], serves: 1, mins: 10,
  ing: [['tuna', 1, 'can'], ['yogurt_lf', 0.25, 'cup'], ['mayo', 1, 'tbsp'], ['dijon', 1, 'tsp'], ['lemon', 0.25, 'each'], ['dill', 1, 'tbsp'], ['sourdough', 2, 'slice'], ['spinach', 1, 'cup'], ['cucumber', 0.25, 'each']],
  steps: ['Mix tuna, yogurt, mayo, dijon, lemon juice and dill.', 'Toast sourdough. Layer spinach, cucumber and tuna salad.'],
});
R({
  id: 'yogurt-caesar-wrap', name: 'Greek Yogurt Chicken Caesar Wrap', emoji: '🥗', meal: ['main'], serves: 2, mins: 20,
  ing: [['chicken_breast', 14, 'oz'], ['tortilla_flour', 2, 'each'], ['romaine', 3, 'cup'], ['parmesan', 0.25, 'cup'], ['yogurt_lf', 0.33, 'cup'], ['dijon', 1, 'tsp'], ['lemon', 0.5, 'each'], ['garlic_oil', 1, 'tbsp'], ['olive_oil', 1, 'tsp'], ['pepper', 0.5, 'tsp'], ['salt', 0.5, 'tsp']],
  steps: ['Season and cook chicken in olive oil, 6–7 minutes per side. Slice.', 'Whisk yogurt, garlic oil, dijon, lemon juice, half the parmesan, pepper and salt.', 'Toss romaine with the dressing. Fill tortillas with romaine, chicken and remaining parmesan. Roll tightly.'],
  swaps: 'Low-FODMAP version: use gluten-free wraps or serve as a salad with sourdough croutons.',
});
R({
  id: 'beef-potato-stew', name: 'Slow-Cooker Beef & Potato Stew', emoji: '🍲', meal: ['main'], serves: 6, mins: 25, prep: true,
  ing: [['beef_chuck', 2.5, 'lb', 'cubed'], ['potato', 1.5, 'lb'], ['carrot', 4, 'each'], ['onion', 1, 'each'], ['garlic', 3, 'clove'], ['broth', 3, 'cup'], ['tomato_paste', 2, 'tbsp'], ['thyme', 1, 'tsp'], ['cornstarch', 2, 'tbsp'], ['salt', 1.5, 'tsp'], ['pepper', 0.5, 'tsp']],
  steps: ['Add everything except cornstarch to a slow cooker.', 'Cook 8 hours on low or 5 hours on high.', 'Stir cornstarch into 1/4 cup cold water and stir into the stew. Cook 15 more minutes to thicken.'],
  swaps: 'Low-FODMAP version: low-FODMAP broth, 2 tbsp garlic oil instead of garlic, leek greens instead of onion.',
});
R({
  id: 'honey-garlic-chicken', name: 'Honey Garlic Chicken Thighs', emoji: '🍯', meal: ['main'], serves: 4, mins: 35, prep: true,
  ing: [['chicken_thigh', 2, 'lb'], ['honey', 3, 'tbsp'], ['garlic', 4, 'clove'], ['tamari', 0.25, 'cup'], ['rice', 1.25, 'cup'], ['green_beans', 300, 'g'], ['olive_oil', 1, 'tbsp'], ['ginger', 1, 'tsp'], ['sesame_seeds', 1, 'tsp']],
  steps: ['Cook rice.', 'Sear chicken in oil 5 minutes per side.', 'Add honey, garlic, tamari and ginger. Simmer 5 minutes until sticky.', 'Steam green beans and serve with chicken, rice and sesame seeds.'],
  swaps: 'Low-FODMAP version: maple syrup instead of honey, garlic-infused oil instead of garlic.',
});
R({
  id: 'chili-lime-shrimp-bowls', name: 'Chili-Lime Shrimp & Cilantro Rice', emoji: '🦐', meal: ['main'], serves: 4, mins: 25, prep: true,
  ing: [['shrimp', 2, 'lb'], ['rice', 1.25, 'cup'], ['lime', 3, 'each'], ['cilantro', 0.5, 'cup'], ['corn', 1, 'cup'], ['cherry_tomatoes', 1, 'cup'], ['avocado', 0.5, 'each'], ['paprika', 2, 'tsp'], ['cumin', 1, 'tsp'], ['garlic_oil', 2, 'tbsp'], ['romaine', 2, 'cup'], ['salt', 1, 'tsp']],
  steps: ['Cook rice and stir in lime zest, juice of 1 lime and half the cilantro.', 'Toss shrimp with paprika, cumin, salt and 1 tbsp garlic oil. Sear 2 minutes per side.', 'Char corn in the remaining oil.', 'Bowl up rice, shrimp, corn, tomatoes, romaine and avocado. Finish with lime and cilantro.'],
});
R({
  id: 'smash-burger-bowls', name: 'Smash Burger Bowls', emoji: '🍔', meal: ['main'], serves: 4, mins: 35, prep: true,
  ing: [['ground_beef', 2, 'lb'], ['potato', 1.5, 'lb', 'cut into fries'], ['romaine', 4, 'cup'], ['cherry_tomatoes', 1, 'cup'], ['pickles', 4, 'each', 'chopped'], ['cheddar', 4, 'slice'], ['yogurt_lf', 0.5, 'cup'], ['dijon', 1, 'tbsp'], ['paprika', 1, 'tsp'], ['olive_oil', 1, 'tbsp'], ['salt', 1.5, 'tsp']],
  steps: ['Toss potato fries with oil and salt. Bake at 425°F for 30 minutes, flipping halfway.', 'Divide beef into 8 balls. Smash thin onto a very hot skillet and cook 2 minutes per side. Top with cheddar.', 'Burger sauce: yogurt, dijon, paprika, a little chopped pickle and pickle juice.', 'Bowl up lettuce, fries, patties, tomatoes and pickles with the sauce.'],
});
R({
  id: 'ginger-chicken-rice-soup', name: 'Ginger Chicken & Rice Soup', emoji: '🍜', meal: ['main'], serves: 6, mins: 40, prep: true, tags: ['gut'],
  ing: [['chicken_breast', 2, 'lb'], ['rice', 0.75, 'cup'], ['carrot', 3, 'each'], ['zucchini', 1, 'each'], ['spinach', 3, 'cup'], ['ginger', 2, 'tbsp'], ['garlic_oil', 2, 'tbsp'], ['broth_lf', 8, 'cup'], ['parsley', 0.25, 'cup'], ['lemon', 1, 'each'], ['salt', 1, 'tsp']],
  steps: ['Warm garlic oil in a large pot. Cook carrots and ginger 4 minutes.', 'Add broth and whole chicken breasts. Simmer 18 minutes, then remove and shred the chicken.', 'Add rice and zucchini and simmer 15 minutes.', 'Return chicken, stir in spinach, lemon juice, parsley and salt.'],
  note: 'A soothing, easy-to-digest meal for days your gut is flaring.',
});
R({
  id: 'korean-beef-bowls', name: 'Korean-Style Beef Bowls', emoji: '🍚', meal: ['main'], serves: 4, mins: 25, prep: true,
  ing: [['ground_beef', 2, 'lb'], ['rice', 1.25, 'cup'], ['tamari', 0.25, 'cup'], ['maple', 2, 'tbsp'], ['sesame_oil', 1, 'tbsp'], ['garlic', 4, 'clove'], ['ginger', 1, 'tbsp'], ['chili_flakes', 0.5, 'tsp'], ['cucumber', 1, 'each'], ['carrot', 2, 'each'], ['scallion_greens', 4, 'each'], ['sesame_seeds', 1, 'tbsp']],
  steps: ['Cook rice.', 'Brown beef. Add garlic, ginger and chili flakes for 1 minute.', 'Add tamari, maple and sesame oil. Simmer 2 minutes.', 'Serve over rice with cucumber, carrot, scallion greens and sesame.'],
  swaps: 'Low-FODMAP version: 1 tbsp garlic-infused oil instead of garlic.',
});
R({
  id: 'stuffed-peppers', name: 'Turkey & Rice Stuffed Peppers', emoji: '🫑', meal: ['main'], serves: 4, mins: 50, prep: true,
  ing: [['bell_pepper_green', 4, 'each'], ['ground_turkey', 1.5, 'lb'], ['rice', 0.75, 'cup'], ['canned_tomatoes', 1, 'can'], ['cheddar', 1, 'cup'], ['cumin', 2, 'tsp'], ['oregano', 1, 'tsp'], ['garlic_oil', 1, 'tbsp'], ['spinach', 2, 'cup'], ['salt', 1, 'tsp']],
  steps: ['Cook rice. Halve and seed peppers.', 'Brown turkey in garlic oil with cumin, oregano and salt. Stir in tomatoes, spinach and rice.', 'Stuff peppers, top with cheddar and bake covered at 375°F for 25 minutes, then uncovered 10 minutes.'],
});
R({
  id: 'pork-pineapple-bowls', name: 'Sweet & Spicy Pork Pineapple Bowls', emoji: '🍍', meal: ['main'], serves: 4, mins: 30, prep: true,
  ing: [['pork_tenderloin', 2, 'lb', 'cubed'], ['pineapple', 2, 'cup'], ['bell_pepper_red', 1, 'each'], ['rice', 1.25, 'cup'], ['tamari', 3, 'tbsp'], ['maple', 2, 'tbsp'], ['sriracha', 2, 'tsp'], ['ginger', 1, 'tbsp'], ['garlic_oil', 1, 'tbsp'], ['cornstarch', 1, 'tsp'], ['scallion_greens', 4, 'each']],
  steps: ['Cook rice. Whisk tamari, maple, sriracha, ginger, cornstarch and 2 tbsp water.', 'Sear pork in garlic oil 6–8 minutes.', 'Add pepper and pineapple for 3 minutes, then the sauce. Toss until glossy.', 'Serve over rice with scallion greens.'],
});
R({
  id: 'salmon-cakes', name: 'Salmon Cakes & Lemon Yogurt', emoji: '🍥', meal: ['main'], serves: 3, mins: 30,
  ing: [['salmon_canned', 3, 'can'], ['eggs', 2, 'each'], ['oats', 0.5, 'cup', 'blitzed'], ['dijon', 1, 'tbsp'], ['lemon', 1, 'each'], ['parsley', 0.25, 'cup'], ['scallion_greens', 3, 'each'], ['yogurt_lf', 0.5, 'cup'], ['olive_oil', 2, 'tbsp'], ['baby_potatoes', 1, 'lb'], ['salt', 0.75, 'tsp']],
  steps: ['Roast halved potatoes with half the oil and salt at 425°F for 25 minutes.', 'Mix salmon, eggs, oats, dijon, lemon zest, parsley and scallion greens. Form 6 patties.', 'Pan-fry in the remaining oil 3–4 minutes per side.', 'Serve with yogurt mixed with lemon juice.'],
});
R({
  id: 'steak-arugula-salad', name: 'Steak & Arugula Power Salad', emoji: '🥗', meal: ['main'], serves: 2, mins: 25,
  ing: [['sirloin', 12, 'oz'], ['arugula', 4, 'cup'], ['spinach', 2, 'cup'], ['quinoa', 0.5, 'cup'], ['beets', 40, 'g', 'sliced'], ['walnuts', 0.25, 'cup'], ['feta', 0.25, 'cup'], ['olive_oil', 2, 'tbsp'], ['balsamic', 1, 'tbsp'], ['dijon', 1, 'tsp'], ['salt', 0.75, 'tsp'], ['pepper', 0.5, 'tsp']],
  steps: ['Cook quinoa and cool slightly.', 'Season and sear steak 4 minutes per side. Rest and slice.', 'Whisk oil, balsamic, dijon, salt and pepper.', 'Toss greens and quinoa with dressing. Top with steak, beets, walnuts and feta.'],
  note: 'The vitality all-star: nitrate-rich greens and beets, zinc from steak, omega-3s from walnuts.',
});
R({
  id: 'tahini-chicken-power-bowl', name: 'Tahini Chicken Power Bowls', emoji: '🥙', meal: ['main'], serves: 4, mins: 40, prep: true,
  ing: [['chicken_breast', 2, 'lb'], ['quinoa', 1, 'cup'], ['kale', 4, 'cup'], ['chickpeas', 1, 'cup'], ['sweet_potato', 1, 'each'], ['tahini', 0.25, 'cup'], ['lemon', 2, 'each'], ['maple', 1, 'tsp'], ['garlic_oil', 1, 'tbsp'], ['olive_oil', 1, 'tbsp'], ['pumpkin_seeds', 0.25, 'cup'], ['paprika', 1, 'tsp'], ['salt', 1.5, 'tsp']],
  steps: ['Roast cubed sweet potato and chickpeas with olive oil, paprika and salt at 425°F for 25 minutes.', 'Cook quinoa. Season and roast or grill chicken.', 'Massage kale with a squeeze of lemon and a pinch of salt.', 'Dressing: tahini, lemon juice, maple, garlic oil and water to thin.', 'Bowl up and top with pepitas.'],
});
R({
  id: 'smoky-beef-street-tacos', name: 'Smoky Steak Street Tacos', emoji: '🌮', meal: ['main'], serves: 4, mins: 25,
  ing: [['flank_steak', 1.5, 'lb'], ['tortilla_corn', 12, 'each'], ['cumin', 2, 'tsp'], ['paprika', 2, 'tsp'], ['oregano', 1, 'tsp'], ['garlic_oil', 2, 'tbsp'], ['lime', 3, 'each'], ['cilantro', 0.5, 'cup'], ['cabbage', 2, 'cup'], ['cheddar', 2, 'oz'], ['yogurt_lf', 0.5, 'cup'], ['salt', 1, 'tsp']],
  steps: ['Rub steak with garlic oil, spices, salt and juice of 1 lime. Marinate 20 minutes.', 'Sear over high heat 4–5 minutes per side. Rest and dice.', 'Mix yogurt with lime juice and salt for crema.', 'Serve on warm tortillas with cabbage, cheddar, crema and cilantro.'],
});
R({
  id: 'mediterranean-cod-potatoes', name: 'Mediterranean Baked Cod & Potatoes', emoji: '🐟', meal: ['main'], serves: 2, mins: 35, tags: ['gut'],
  ing: [['cod', 1, 'lb'], ['baby_potatoes', 1, 'lb'], ['cherry_tomatoes', 1, 'cup'], ['olives', 10, 'each'], ['capers', 1, 'tbsp'], ['lemon', 1, 'each'], ['garlic_oil', 1, 'tbsp'], ['olive_oil', 1, 'tbsp'], ['parsley', 2, 'tbsp'], ['oregano', 1, 'tsp'], ['salt', 0.75, 'tsp']],
  steps: ['Roast halved potatoes with olive oil and salt at 425°F for 20 minutes.', 'Add cod, tomatoes, olives and capers to the pan. Drizzle with garlic oil, lemon juice and oregano.', 'Roast 12 minutes until the fish flakes. Finish with parsley.'],
});

// =====================================================================
// SNACKS
// =====================================================================
R({
  id: 'vitality-trail-mix', name: 'Vitality Trail Mix', emoji: '🥜', meal: ['snack'], serves: 8, mins: 5, prep: true,
  ing: [['walnuts', 1, 'cup'], ['pumpkin_seeds', 1, 'cup'], ['dark_chocolate', 3, 'oz', 'chopped'], ['brazil_nuts', 8, 'each'], ['peanuts', 0.5, 'cup']],
  steps: ['Mix everything and divide into 8 small bags or jars (about 1/3 cup each).', 'Eat one Brazil nut a day. One a day covers your selenium needs; more than a few daily is too much.'],
  note: 'Zinc, magnesium, selenium, omega-3s and cocoa flavonoids in one handful.',
});
R({
  id: 'vanilla-protein-shake', name: 'Simple Vanilla Protein Shake', emoji: '🥛', meal: ['snack'], serves: 1, mins: 2, tags: ['smoothie'],
  ing: [['whey', 1, 'scoop', 'vanilla'], ['milk_lf', 1, 'cup']],
  steps: ['Shake or blend with ice.'],
  note: 'The fastest way to close a protein gap at the end of the day.',
});
R({
  id: 'raspberry-yogurt-bowl', name: 'Raspberry Pepita Yogurt Cup', emoji: '🍇', meal: ['snack'], serves: 1, mins: 3,
  ing: [['yogurt_lf', 1, 'cup'], ['raspberries', 0.5, 'cup'], ['pumpkin_seeds', 1, 'tbsp'], ['maple', 1, 'tsp']],
  steps: ['Top yogurt with raspberries, pepitas and maple.'],
});
R({
  id: 'pb-banana-rice-cakes', name: 'PB Banana Rice Cakes', emoji: '🍌', meal: ['snack'], serves: 1, mins: 3,
  ing: [['rice_cakes', 2, 'each'], ['peanut_butter', 2, 'tbsp'], ['banana', 0.5, 'each', 'firm'], ['cinnamon', 0.25, 'tsp']],
  steps: ['Spread peanut butter on the rice cakes, top with banana slices and cinnamon.'],
  note: 'Quick-digesting carbs 30–60 minutes before a workout or run.',
});
R({
  id: 'egg-cheddar-box', name: 'Egg & Cheddar Snack Box', emoji: '🥚', meal: ['snack'], serves: 1, mins: 15, prep: true,
  ing: [['eggs', 3, 'each', 'hard-boiled'], ['cheddar', 1, 'oz'], ['carrot', 1, 'each', 'sticks'], ['cucumber', 0.25, 'each']],
  steps: ['Hard-boil eggs (10 minutes, then into ice water). Peel.', 'Pack with cheddar cubes and veggie sticks. Keeps 4 days.'],
});
R({
  id: 'choc-pb-protein-bites', name: 'Chocolate PB Protein Bites', emoji: '🍫', meal: ['snack'], serves: 6, mins: 15, prep: true,
  ing: [['oats', 1, 'cup'], ['peanut_butter', 0.5, 'cup'], ['whey', 2, 'scoop', 'chocolate'], ['maple', 3, 'tbsp'], ['chia', 2, 'tbsp'], ['dark_chocolate', 1.5, 'oz', 'chopped']],
  steps: ['Mix everything in a bowl. Add a splash of milk if it\'s too dry to hold together.', 'Roll into 12 balls. Refrigerate up to a week. 2 bites = 1 serving.'],
});
R({
  id: 'garlic-oil-hummus', name: 'Garlic-Oil Hummus & Veggies', emoji: '🥕', meal: ['snack'], serves: 6, mins: 10, prep: true,
  ing: [['chickpeas', 1, 'can'], ['tahini', 0.25, 'cup'], ['lemon', 1, 'each'], ['garlic_oil', 2, 'tbsp'], ['cumin', 0.5, 'tsp'], ['salt', 0.5, 'tsp'], ['carrot', 3, 'each'], ['cucumber', 1, 'each'], ['bell_pepper_green', 1, 'each']],
  steps: ['Blend chickpeas, tahini, lemon juice, garlic oil, cumin, salt and 3–4 tbsp ice water until very smooth.', 'Cut vegetables into sticks. Portion hummus into 6 small containers.'],
  note: 'Garlic-infused oil gives you the garlic flavor without the fructans.',
});
R({
  id: 'turkey-cheese-rollups', name: 'Turkey & Cheddar Roll-Ups', emoji: '🧀', meal: ['snack'], serves: 1, mins: 5,
  ing: [['deli_turkey', 4, 'oz'], ['cheddar', 1, 'oz'], ['cucumber', 0.25, 'each', 'spears'], ['dijon', 1, 'tsp']],
  steps: ['Spread turkey slices with a little dijon, roll around cheese strips and cucumber spears.'],
});
R({
  id: 'spicy-tuna-rice-cakes', name: 'Spicy Tuna Rice Cakes', emoji: '🍙', meal: ['snack'], serves: 1, mins: 5,
  ing: [['tuna', 1, 'can'], ['yogurt_lf', 2, 'tbsp'], ['sriracha', 1, 'tsp'], ['rice_cakes', 3, 'each'], ['cucumber', 0.25, 'each'], ['scallion_greens', 1, 'each']],
  steps: ['Mix tuna, yogurt and sriracha.', 'Pile onto rice cakes with cucumber slices and scallion greens.'],
});
R({
  id: 'kiwi-gut-bowl', name: 'Kiwi Chia Gut Bowl', emoji: '🥝', meal: ['snack', 'breakfast'], serves: 1, mins: 3, tags: ['gut'],
  ing: [['yogurt_lf', 0.75, 'cup'], ['kiwi', 2, 'each'], ['chia', 1, 'tbsp'], ['maple', 1, 'tsp']],
  steps: ['Top yogurt with sliced kiwi, chia and maple.'],
  note: 'Two kiwis a day has clinical evidence for easing IBS-related constipation.',
});
R({
  id: 'choc-yogurt-mousse', name: 'Chocolate Protein Yogurt Mousse', emoji: '🍫', meal: ['snack'], serves: 1, mins: 3,
  ing: [['yogurt_lf', 1, 'cup'], ['whey', 0.5, 'scoop', 'chocolate'], ['cocoa', 1, 'tbsp'], ['maple', 1, 'tsp'], ['raspberries', 0.25, 'cup']],
  steps: ['Whisk yogurt, protein, cocoa and maple until fluffy.', 'Top with raspberries. Great as an evening snack.'],
});
R({
  id: 'watermelon-feta-cup', name: 'Watermelon, Feta & Mint Cup', emoji: '🍉', meal: ['snack'], serves: 1, mins: 5,
  ing: [['watermelon', 2, 'cup'], ['feta', 1, 'oz'], ['mint', 1, 'tbsp'], ['lime', 0.25, 'each'], ['pumpkin_seeds', 1, 'tbsp']],
  steps: ['Toss watermelon with lime juice. Top with feta, mint and pepitas.'],
  note: 'Watermelon is the richest food source of citrulline, but it is high-FODMAP. Test your tolerance with a small portion.',
});
R({
  id: 'pomegranate-choc-yogurt', name: 'Pomegranate Dark Chocolate Yogurt', emoji: '🍒', meal: ['snack'], serves: 1, mins: 3,
  ing: [['yogurt_lf', 1, 'cup'], ['pomegranate', 0.25, 'cup'], ['dark_chocolate', 10, 'g', 'shaved'], ['maple', 1, 'tsp']],
  steps: ['Top yogurt with pomegranate arils, shaved chocolate and maple.'],
  note: 'Pomegranate and cocoa are both rich in polyphenols that support blood flow.',
});
R({
  id: 'salmon-cucumber-bites', name: 'Smoked Salmon Cucumber Bites', emoji: '🥒', meal: ['snack'], serves: 1, mins: 5,
  ing: [['smoked_salmon', 3, 'oz'], ['cucumber', 0.5, 'each'], ['cream_cheese', 2, 'tbsp'], ['dill', 1, 'tsp'], ['capers', 1, 'tsp']],
  steps: ['Slice cucumber into thick rounds. Top each with cream cheese, salmon, dill and a caper.'],
});
R({
  id: 'beet-ginger-shot', name: 'Beet-Orange Pre-Cardio Shot', emoji: '🧃', meal: ['snack'], serves: 1, mins: 5, tags: ['smoothie'],
  ing: [['beets', 1, 'each'], ['orange', 1, 'each', 'peeled'], ['ginger', 1, 'tsp'], ['lemon', 0.25, 'each']],
  steps: ['Blend with 1/2 cup cold water until smooth. Strain if you like.', 'Drink 2–3 hours before a run for the nitrate benefit.'],
  note: 'Dietary nitrate has good evidence for endurance and blood flow. A whole beet is moderate-FODMAP, so try it on a good gut day first.',
});
R({
  id: 'pre-workout-toast', name: 'Maple PB Pre-Workout Toast', emoji: '🍞', meal: ['snack'], serves: 1, mins: 3,
  ing: [['sourdough', 1, 'slice'], ['peanut_butter', 1, 'tbsp'], ['banana', 0.5, 'each', 'firm'], ['maple', 1, 'tsp']],
  steps: ['Toast bread, spread peanut butter, top with banana and a drizzle of maple.'],
});
R({
  id: 'edamame-sea-salt', name: 'Chili-Lime Edamame', emoji: '🫛', meal: ['snack'], serves: 1, mins: 5,
  ing: [['edamame', 0.5, 'cup'], ['lime', 0.25, 'each'], ['chili_flakes', 0.25, 'tsp'], ['salt', 0.25, 'tsp'], ['eggs', 1, 'each', 'hard-boiled']],
  steps: ['Microwave edamame 2 minutes. Toss with lime, chili flakes and salt.', 'Enjoy with a hard-boiled egg for extra protein.'],
});
