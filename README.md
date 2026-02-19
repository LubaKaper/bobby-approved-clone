# Bobby Approved

A mobile-first food product scanner that checks ingredients against Bobby's flagged additives list and your personal dietary profile.

## Tech Stack

- **Next.js 16** (App Router) + **React 19**
- **Tailwind CSS 4** with custom `bobby-*` color theme
- **TypeScript 5**
- **html5-qrcode** for barcode scanning via device camera
- **OpenAI API** (`gpt-4o-mini`) for AI-powered ingredient explanations

## Features

- **Barcode scanning** — scan products with your phone camera
- **Bobby approval ratings** — flags common processed additives including seed oils (soybean, canola, corn, vegetable oil), artificial/natural flavors, caramel color, preservatives, sweeteners, and dyes; also detects enriched grain products and applies a best-effort non-organic wheat flag for pasta/grain category items
- **Dietary conflict detection** — checks products against your allergies, restrictions, and preferences
- **Allergen profiles** — set up allergies (gluten, dairy, nuts, etc.), restrictions (vegan, keto), and preferences (no seed oils, no added sugar) stored in localStorage
- **AI explanations** — get natural-language breakdowns of why a product passes or fails

## Project Structure

```
src/
├── app/                          # Next.js App Router pages & API
│   ├── api/explain/route.ts      # OpenAI explanation endpoint
│   ├── page.tsx                  # Home — categories & demo products
│   ├── scanner/page.tsx          # Barcode scanner
│   ├── result/[barcode]/page.tsx # Product approval result
│   ├── search/page.tsx           # Search products by name/brand/ingredient
│   ├── ingredients/page.tsx      # Browse products by category
│   └── profile/page.tsx          # Dietary profile setup wizard
├── components/                   # Reusable React components
├── data/                         # Product database, flagged ingredients, dietary rules
├── lib/                          # Business logic (approval checks, dietary checks, profile storage)
└── types/                        # TypeScript type definitions
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.env.local` file in the project root:

```
OPENAI_API_KEY=your_key_here
```

The AI explanation feature falls back to template responses if no key is provided.

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Testing

Unit tests cover the core approval and dietary conflict logic. No browser or UI required.

```bash
npx vitest run    # single run, exits with results
npm test          # watch mode — re-runs on file save
```

Tests live in `src/lib/__tests__/`. They are deterministic, use no mocks, and run in under 1 second.

## Available Routes

| Route | Description |
|-------|-------------|
| `/` | Home — shopping lists, categories, demo products |
| `/scanner` | Full-screen barcode scanner |
| `/result/[barcode]` | Product approval details |
| `/search` | Search products by name, brand, or ingredient |
| `/ingredients` | Browse all products by category |
| `/profile` | Multi-step dietary profile setup |
| `/api/explain` | POST — AI ingredient explanation |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm test` | Run unit tests (Vitest watch mode) |
| `npm run lint` | Run ESLint |
