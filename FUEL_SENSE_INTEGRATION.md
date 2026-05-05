# Fuel Sense Journey — Integration Notes

This document describes how the **Fuel Sense Journey** project was merged into **ARGPS Nutritious Lifestyle**.

## What was added

### New Folders Created
| Folder | Contents |
|--------|----------|
| `src/components/course/` | CourseLayout, ProgressBar |
| `src/components/ui/` | Full shadcn/ui component library (40+ components) |
| `src/hooks/` | use-mobile hook |
| `src/lib/` | auth, course-data, progress, utils |
| `src/integrations/supabase/` | Supabase client, server client, auth middleware, types |
| `src/integrations/lovable/` | Lovable integration |
| `src/routes/` | All FSJ routes (TanStack Router) |
| `src/assets/` | hero-nutrition.jpg |
| `src/styles/` | fuel-sense.css (design system) |
| `supabase/` | Supabase config + migrations |

### Files Placed from Fuel Sense Journey
| Original File | Destination | Notes |
|--------------|-------------|-------|
| `src/assets/hero-nutrition.jpg` | `src/assets/` | |
| `src/styles.css` | `src/styles/fuel-sense.css` | Import paths fixed |
| `src/components/course/CourseLayout.tsx` | `src/components/course/` | |
| `src/components/course/ProgressBar.tsx` | `src/components/course/` | |
| `src/components/ui/*.tsx` (40 files) | `src/components/ui/` | |
| `src/hooks/use-mobile.tsx` | `src/hooks/` | |
| `src/lib/auth.tsx` | `src/lib/` | |
| `src/lib/course-data.ts` | `src/lib/` | |
| `src/lib/progress.ts` | `src/lib/` | |
| `src/lib/utils.ts` | `src/lib/` | |
| `src/integrations/supabase/*` | `src/integrations/supabase/` | |
| `src/integrations/lovable/index.ts` | `src/integrations/lovable/` | |
| `src/routes/__root.tsx` | `src/routes/` | |
| `src/routes/about.tsx` | `src/routes/about_v2.tsx` | **Renamed** (ARGPS has `pages/About.tsx`) |
| `src/routes/index.tsx` | `src/routes/index_v2.tsx` | **Renamed** (ARGPS has `pages/Home.tsx`) |
| `src/routes/auth.tsx` | `src/routes/` | |
| `src/routes/dashboard.tsx` | `src/routes/` | |
| `src/routes/meal-builder.tsx` | `src/routes/` | |
| `src/routes/modules.*.tsx` (3 files) | `src/routes/` | |
| `src/routes/progress.tsx` | `src/routes/` | |
| `src/routes/api/public/hooks/cleanup-old-users.ts` | `src/routes/api/` | |
| `src/router.tsx` | `src/` | |
| `src/routeTree.gen.ts` | `src/` | Updated for _v2 renames |
| `supabase/config.toml` | `supabase/` | |
| `supabase/migrations/*.sql` | `supabase/migrations/` | |
| `components.json` | root | shadcn/ui config |
| `eslint.config.js` | root | |
| `.prettierrc` | root | |
| `.prettierignore` | root | |
| `bunfig.toml` | root | |
| `bun.lockb` | root | |
| `wrangler.jsonc` | root | Cloudflare Workers config |

### Files Renamed (Conflict Avoidance)
| FSJ File | Saved As | Reason |
|----------|----------|--------|
| `tsconfig.json` | `tsconfig.fuelsense.json` | ARGPS already has tsconfig.json |
| `vite.config.ts` | `vite.config.fuelsense.ts` | ARGPS already has vite.config.ts |
| `.gitignore` | `.gitignore.fuelsense` | ARGPS already has .gitignore |
| `.env` | `.env.fuelsense` | ARGPS already has .env.local |
| `package-lock.json` | `package-lock.fuelsense.json` | ARGPS already has package.json |

## Import Path Updates
All FSJ files using `@/components/`, `@/lib/`, `@/hooks/`, `@/integrations/` were updated to `@/src/components/`, etc., because ARGPS maps the `@` alias to the project root (not `src/`).

## New Features Added
- **Tamil Nadu Nutrition Course** with 8 modules and lesson system
- **Meal Builder** tool
- **Progress tracking** (local + Supabase sync)
- **Authentication** (Supabase auth)
- **Dashboard** for logged-in users
- **Full shadcn/ui component library**
- **TanStack Router** integration

## Supabase Setup Required
Copy `.env.fuelsense` to `.env.local` and fill in your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## Original ARGPS Files — Unchanged
All original files in `components/`, `pages/`, `App.tsx`, `index.tsx`, `index.html`, `logo.jpg`, `rithanya-profile.jpg`, `metadata.json`, `types.ts` remain completely intact.
