---
name: change-colors
description: Instructions to modify and customize AstroPaper's light and dark color schemes.
---

# Change Colors

Use this skill to update or replace the site's color scheme parameters on AstroPaper.

## Modifying Colors

1. All color tokens are defined inside `src/styles/global.css`.
2. AstroPaper applies variables for 5 main colors:
   - `--background`: Main site background
   - `--foreground`: Main text color
   - `--accent`: Links, buttons, accents
   - `--muted`: Scrollbars, cards, hovers
   - `--border`: Borders and visual dividers

You can customize to any hex color by editing these blocks in `src/styles/global.css`:

### Light Theme
Update the selectors `:root, html[data-theme="light"] { ... }`

### Dark Theme
Update the selector `html[data-theme="dark"] { ... }`

## Disabling Light/Dark Toggle

If you prefer to lock the site to a specific theme without allowing the user to switch:
1. In `src/config.ts`, set `lightAndDarkMode: false`.
2. In `src/scripts/theme.ts`, you can force the `initialColorScheme` variable to either `"light"` or `"dark"`.

## Predefined Themes
You have access to several predefined AstroPaper palettes, including:
- **Light:** Lobster, Leaf Blue, Pinky light.
- **Dark:** AstroPaper 1/2/3/4 defaults, Deep Oyster, Pikky dark, Astro dark (High Contrast).
Simply swap the CSS hex values to replicate them.
