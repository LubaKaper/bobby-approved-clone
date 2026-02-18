# Bobby Approved — Claude Code Context

## Overview

Bobby Approved is a mobile-first Next.js app that scans food product barcodes and checks their ingredients against Bobby's flagged additives list and the user's personal dietary profile. Built with Next.js 16 (App Router), React 19, Tailwind CSS 4, and TypeScript.

## Tech Stack & Conventions

- **App Router** — all pages live under `src/app/`
- **"use client"** — most page and component files are client components (barcode scanning, localStorage, interactive UI)
- **Tailwind custom theme** — custom `bobby-*` color tokens defined as CSS variables in `src/app/globals.css`:
  - `bobby-teal` (primary), `bobby-green` (approved), `bobby-red` (not approved), `bobby-amber` (warnings), `bobby-orange` (CTAs)
- **No database** — product data is a static array in `src/data/products.ts`
- **No auth** — user profile stored in localStorage

## Key File Paths

| File | Purpose |
|------|---------|
| `src/data/products.ts` | Demo product database (barcode, name, brand, ingredients, category) |
| `src/data/flagged-ingredients.ts` | Bobby's 33 flagged additives |
| `src/data/dietary-rules.ts` | 12 dietary rules (8 allergies, 2 restrictions, 2 preferences) |
| `src/lib/approval.ts` | `checkBobbyApproval(product)` — matches ingredients against flagged list |
| `src/lib/dietary.ts` | `checkDietaryConflicts(product, profile)` — matches ingredients against user's dietary rules |
| `src/lib/profile.ts` | `getUserProfile()` / `saveUserProfile()` — localStorage CRUD for user profile |
| `src/types/index.ts` | All TypeScript interfaces: `Product`, `UserProfile`, `ApprovalResult`, `DietaryConflict` |
| `src/app/api/explain/route.ts` | POST endpoint — sends ingredients to OpenAI `gpt-4o-mini`, falls back to templates |
| `src/components/BarcodeScanner.tsx` | Wraps html5-qrcode library for camera-based barcode scanning |
| `src/components/ApprovalBadge.tsx` | Green/red badge for approval status |
| `src/components/ConflictSection.tsx` | Displays dietary conflicts |
| `src/components/ExplanationSection.tsx` | Fetches and displays AI explanation |
| `src/components/IngredientList.tsx` | Lists ingredients, highlights flagged ones |
| `src/components/BottomNav.tsx` | Fixed bottom tab navigation (Home, Search, Scanner, Ingredients, Profile) |

## Data Flow

1. Product scanned or selected → look up in `products.ts` by barcode
2. Run `checkBobbyApproval(product)` → returns `{ approved, flaggedIngredients[] }`
3. Load user profile from localStorage via `getUserProfile()`
4. Run `checkDietaryConflicts(product, userProfile)` → returns `DietaryConflict[]`
5. Display results on `/result/[barcode]` page
6. Optionally fetch AI explanation from `/api/explain`

## User Profile

Stored in localStorage under key `"bobby_user_profile"`:
```typescript
{ allergies: string[], restrictions: string[], preferences: string[] }
```
Managed by `src/lib/profile.ts`. Default is empty arrays.

## Scripts

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Serve production build
npm run lint     # ESLint
```

## Environment

Requires `.env.local` with `OPENAI_API_KEY` for AI explanations. The app works without it — falls back to template-based explanations.
