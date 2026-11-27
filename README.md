# Vigor

A personal fitness, nutrition and gut-health app for iPhone. It's an installable web app (PWA): it opens full-screen from your home screen, works offline, and keeps all data on the device.

## Features

- **Home dashboard:** today's calories and macros, water and pelvic-floor habits, today's menu with one-tap logging, weekly goals, and charts for training, run miles, calories, protein, energy/gut comfort and body weight.
- **Weekly planning:** auto-plan a week from a few meal-prep-friendly recipes (servings are scaled to your targets), or fill each slot yourself. There are 6 slots a day: breakfast, three snacks, lunch and dinner. You can also copy a day across the week.
- **Prep list:** what to batch-cook, how many servings, and the batch multiplier.
- **Grocery list:** every planned ingredient totaled, converted to store units and grouped by aisle, with checkboxes, extras and Share (to Notes or Reminders).
- **66 recipes:** breakfasts, lunches/dinners, snacks and shakes. Macros are computed from an ingredient database (USDA-based). Each recipe has a FODMAP rating (Low / Moderate / High) based on per-serving portion thresholds, the flagged ingredients, low-FODMAP swaps, and "vitality" highlights (nitrates, zinc, omega-3, flavonoids, vitamin D, magnesium, selenium, citrulline).
- **Logging:** meals (recipe, quick add or recent), workouts (full-gym templates, sets pre-filled from last session, rest timer, progressive-overload hints, PR detection), runs/cardio with pace, daily check-ins (energy, mood, drive, stress, sleep, gut comfort, symptoms, Bristol scale, journal) and body weight.
- **Gut journal and insights:** rate how each meal sat with you. Insights rank possible trigger foods, FODMAP groups and ingredients against your baseline, and the auto-planner skips recipes that keep causing problems.
- **Guides:** an evidence-rated product and supplement guide, snack ideas, a vitality habits guide, an IBS/FODMAP guide, and a training plan.

## Install on iPhone

1. Open the site in **Safari**.
2. Tap **Share**, then **Add to Home Screen**.
3. Launch Vigor from the home screen icon.

## Your data

Everything is stored in the app's local storage on your phone. Nothing is sent anywhere. Use **More → Backup & data → Export backup** every couple of weeks and save the file to iCloud Drive. Restore from the same screen.

## Development

There is no build step. It's plain ES modules with [Preact + htm](https://github.com/developit/htm) vendored in `vendor/`.

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

After changing any file, regenerate the offline cache manifest so installed copies pick up the update:

```bash
node tools/build-sw.mjs
```

| Path | What's there |
|---|---|
| `js/data/ingredients.js` | Nutrition per 100 g, kitchen units, grocery units, FODMAP thresholds, vitality tags |
| `js/data/recipes.js` | Recipes (add your own here; macros and flags compute automatically) |
| `js/data/workouts.js` | Exercise library, workout templates, weekly training plan |
| `js/data/products.js` | Supplements, gear, snack ideas, guides |
| `js/nutrition.js` | Targets (Mifflin–St Jeor), recipe analysis, auto-planner, grocery aggregation |
| `js/views/` | Screens |

## Deploy to GitHub Pages

Push this folder to a GitHub repository, then go to **Settings → Pages → Deploy from a branch → `main` / root**. The site will be served at `https://<user>.github.io/<repo>/`.

*Nutrition values are estimates. This app is not medical advice. Check FODMAP portions in the Monash University FODMAP app and talk to a doctor or dietitian about supplements and IBS management.*
