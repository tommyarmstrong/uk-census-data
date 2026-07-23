**INTRO**

This project is to test how agentic AI coding has improved by July 2026. 

This is in comparison with a similar project to test "Vibe Coding", mostly using GPT-4.1, carried out in June 2025 ([project code](https://github.com/tommyarmstrong/UKCensus) and [app](https://ukcensus-v1.tommyarmstrong.uk))

This project was built by Cursor, using the "Auto" model, which was not available in June 2025. All of the code, configuration and documentation in this project was written by Cursor and the models, except:
- This Intro section to the README
- [docs/requirements.md](docs/requirements.md), initial version was AI-assisted, but I wanted to ensure a similar tech stack and scope to the 2025 project.
- [docs/prompt-record.md](docs/prompt-record.md), a record of the prompts that were given to Cursor.

The updated app is deployed to [ukcensus.tommyarmstrong.uk](https://ukcensus.tommyarmstrong.uk).

---

# UK Census Data

A modern web application for exploring and visualising official **UK Census 2021** statistics for England and Wales. Interactive charts load live from the [NOMIS](https://www.nomisweb.co.uk/) API (Office for National Statistics), with region filtering, chart export, and a lightweight Progressive Web App shell.

## Features

- **Eight Census topics** — Demographics, Housing, Employment, Education, Health and Disability, Transport, Family and Relationships, and Migration
- **Live NOMIS data** — Topic Summary tables fetched on demand (no mock data); cached in the browser with stale indicators
- **Region filter** — England and Wales, England, Wales, and English regions via shareable `?geography=` URLs (topic pages)
- **Interactive charts** — Pie, bar, and horizontal-bar views powered by Recharts (34 charts across eight topics); tooltips show count and percent
- **Export & share** — Download chart data as CSV or JSON, or share the current chart URL
- **PWA** — Installable shell with a service worker for offline-friendly static assets
- **Quality gates** — ESLint, Prettier, Vitest, Husky, and GitHub Actions CI

## Tech stack

| Layer     | Technology                              |
| --------- | --------------------------------------- |
| Framework | Next.js (App Router), React, TypeScript |
| UI        | Tailwind CSS, shadcn/ui, Lucide React   |
| Charts    | Recharts                                |
| Data      | NOMIS API via Next.js route proxy       |
| Testing   | Vitest, Testing Library, coverage       |
| Tooling   | ESLint, Prettier, Husky, lint-staged    |
| Hosting   | Vercel                                  |

## Getting started

**Requirements:** Node.js 22+ and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script                  | Purpose                        |
| ----------------------- | ------------------------------ |
| `npm run dev`           | Start the development server   |
| `npm run build`         | Production build               |
| `npm run start`         | Serve the production build     |
| `npm run lint`          | Run ESLint                     |
| `npm run format`        | Format with Prettier           |
| `npm run format:check`  | Check Prettier formatting      |
| `npm test`              | Run Vitest in watch mode       |
| `npm run test:run`      | Run tests once                 |
| `npm run test:coverage` | Run tests with coverage report |

## Project structure

```text
uk-census-data/
├── .github/
│   └── workflows/
│       └── ci.yml                 # Lint, test, and production build on push/PR
├── docs/                          # Product and research documentation
│   ├── requirements.md
│   ├── ia.md
│   ├── design.md
│   ├── topic-map.md
│   ├── nomis-research.md
│   └── …
├── public/                        # Static assets, icons, service worker
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── page.tsx               # Home — topic index
│   │   ├── layout.tsx
│   │   ├── about/                 # About, data source, licence
│   │   ├── topics/[slug]/        # Topic pages with charts
│   │   ├── api/nomis/             # Thin NOMIS proxy (cache, rate limit)
│   │   └── manifest.ts            # PWA web app manifest
│   ├── components/
│   │   ├── charts/                # Recharts chart views
│   │   ├── data/                  # Chart panels, loading/error/stale states, export
│   │   ├── layout/                # Shell, header, footer, region filters
│   │   ├── pwa/                   # Service worker registration
│   │   └── ui/                    # shadcn/ui primitives
│   ├── lib/
│   │   ├── topics.ts              # Topic catalogue
│   │   ├── topic-map.ts           # Chart inventory per topic
│   │   ├── geography-url.ts       # Geography URL helpers
│   │   ├── charts/                # Axis/label formatting helpers
│   │   ├── export/                # CSV/JSON download helpers
│   │   └── nomis/                 # Client, cache, JSON-stat parse, constants
│   └── test/                      # Shared fixtures and Vitest setup
├── package.json
├── next.config.ts
├── vitest.config.ts
└── vercel.json
```

### Key directories

| Path                   | Role                                                            |
| ---------------------- | --------------------------------------------------------------- |
| `src/app`              | Routes and the `/api/nomis` proxy                               |
| `src/components`       | UI composition (layout, data states, charts)                    |
| `src/lib/nomis`        | NOMIS integration: fetch, parse JSON-stat, cache, rate limiting |
| `src/lib/topic-map.ts` | Maps each topic slug to its Census datasets and chart types     |
| `docs/`                | Requirements, IA, design notes, and NOMIS research              |

## Application routes

| Route            | Description                                                            |
| ---------------- | ---------------------------------------------------------------------- |
| `/`              | Home — topic index (emoji tiles)                                       |
| `/topics/[slug]` | Topic page with region filter, subtopic switcher, and live chart panel |
| `/about`         | About the app, data source, and Open Government Licence                |
| `/api/nomis`     | Server proxy to NOMIS (rate limiting and response cache)               |

Region selection is stored in the URL as `?geography=<code>` so views are shareable.

## Architecture

```text
Browser → Next.js app → /api/nomis → NOMIS API
                ↓
         JSON-stat parse → chart models → Recharts
```

The app is frontend-first: Next.js API routes act only as a thin proxy for shaping responses and protecting against rate limits. Chart configuration and geography codes live in `src/lib/nomis/constants.ts` and `src/lib/topic-map.ts`.

## Documentation

| Document                                         | Contents                                       |
| ------------------------------------------------ | ---------------------------------------------- |
| [docs/requirements.md](docs/requirements.md)     | Product brief and stack requirements           |
| [docs/ia.md](docs/ia.md)                         | Information architecture and navigation        |
| [docs/topic-map.md](docs/topic-map.md)           | Chart inventory (34 charts) and dataset IDs    |
| [docs/nomis-research.md](docs/nomis-research.md) | NOMIS API research notes                       |
| [docs/design.md](docs/design.md)                 | UI / design notes                              |
| [docs/roadmap.md](docs/roadmap.md)               | Staged post-v3 work and agent prompt templates |

## Licence

This project’s source code is licensed under the [MIT License](LICENSE).

## Data source and licence

Statistics are Census 2021 Topic Summary tables published via [NOMIS](https://www.nomisweb.co.uk/) (ONS). Coverage is England and Wales (including English regions). Scotland and Northern Ireland use separate statistical systems and are out of scope.

Census / NOMIS statistics are Crown copyright and available under the [Open Government Licence](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/). That licence covers the data, not this application’s source code.

## Deployment

Configured for [Vercel](https://vercel.com/). `vercel.json` runs unit tests before the production build. CI (`.github/workflows/ci.yml`) runs lint, tests, and `next build` on pushes and pull requests to `main`.
