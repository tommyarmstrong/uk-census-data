# Record of prompts

NEVER EDIT THIS FILE WITHOUT EXPLICIT PERMISSION. THIS IS IMPORTANT.

## Sprint 1

Deliverables:

1. Scaffold the project
2. Build initial app layout
3. Set top-level topics and example subtopics
4. Research and implement NOMIS API
5. Wire NOMIS to every topic
6. Deploy to Vercel
7. Implement unit tests

### Prompt 1

Model: Cursor Auto

Context window: **NEW**

Prompt:

Review this requirements doc. I will be asking an AI coding agent to develop this software, but first I want you to review the requirements document. Please make only minimal improvements or corrections to the requirements document. Do not create or modify any other files. Then give me your feedback on whether ths document will be sufficiant for a modern LLM enabled agent to develop the application.

Outcome:

**Verdict: not sufficient on its own.**

An agent could scaffold the stack and wire a NOMIS fetch, but it would have to invent too much of the product. Expect inconsistent scope, topic coverage, and UX unless you add more concrete constraints.

**What works well**

- Stack is clear and modern (Next.js, TypeScript, Tailwind, shadcn, Recharts, Vercel).
- Hard constraints are useful: no mock data, NOMIS only, caching, export, mobile/desktop expectations.
- Explicit non-goals (auth, permanent store) help prevent over-building.
- Call-pattern example points the agent at the right API shape.

**Gaps that will block or derail an agent**

1. Scope of “all major topic areas” — undefined. Without a named list (e.g. population, ethnicity, housing, education, employment, health, religion, language, …) and preferred dataset IDs, the agent will either under-deliver or sprawl forever.
2. Information architecture — no pages, navigation, filters, geography picker UX, or default views. Agents need at least a short IA sketch.
3. Geography & filters — one England/Wales code isn’t enough. Which levels (country, region, LA, MSOA)? How does the user select them?
4. Acceptance criteria — “complete coverage” and “professional UI/UX” aren’t testable. Prefer “topic X shows chart Y for geography Z with CSV export.”
5. NOMIS specifics — base URL, rate-limit behaviour, and how to discover datasets/categories are left as research. Agents can do that, but you’ll get uneven results without a small starter dictionary or doc links.
6. PWA + offline conflicts with “data on page load from NOMIS” and “no permanent store.” Clarify whether offline means cached last-fetch only, or drop PWA for v1.
7. Design direction — stack only; no layout, brand, or reference UI. Visual quality will be generic unless you add a short design brief or mockups.

**Recommendation before handing to an agent**: add (1) a closed list of Census 2021 topics/datasets for v1, (2) a one-screen IA / user flow, (3) geography levels + defaults, (4) 5–10 acceptance checks, and (5) a PWA/offline decision. With those, this doc becomes a solid build prompt; without them, treat it as a direction brief, not a complete requirements package.

### Prompt 2

Model: Cursor Auto

Context window: **EXISTING**

Prompt:

I do not intend the AI to build the entire app from the requirements docuement in one go. I want to lead it through scaffolding, researching NOMIS specifics, identifying, subtopics and graph types, etc.

1. The major topic areas will be:

- Demographics (e.g. age, gender)
- Housing (types, occupation)
- Employment (
- Education
- Health and Disability
- Transport
- Family and Relationships
- Miogration

I do not yet know all of the subtopics.

2. I do not have this. I want the AI to help develop it.

3. Regional level filters (e.g. North West, North East).

4. AI will have to help build these.

5. AI will help research this as a step.

6. Offline can use last cached. If the cache is unavailable it should report that data cannot be fetched and not use "invented test data"

7. Can this start generic and be improved later.

Please add to the requirements document and then advise on steps to use the AI to build the app in stages.

Outcome:

Updated docs/requirements-prompt.md with your topics, regional filters, cache/offline rules, “generic UI first,” and a note that IA / subtopics / acceptance criteria / NOMIS details are developed in stages—not invented in one pass.

**Staged build plan**

Work one stage at a time. After each, review the AI’s proposals, update the requirements (or a small docs/ note), then prompt the next stage. Do not ask it to “build the app” from the full requirements in one go.

1. Scaffold
   Next.js + TypeScript + Tailwind + shadcn + ESLint/Prettier/Husky + basic layout shell. No real charts yet. Confirm it runs and deploys to Vercel.

2. NOMIS research (docs only)
   Ask the AI to research NOMIS Census 2021: base URL, rate limits, JSON-stat shape, how to list datasets, and geography codes for UK regions. Output a short research note (dataset IDs, region codes). You approve before coding against it.

3. Data layer spike
   One API route proxy + typed fetch + cache (localStorage) + error UI for one known dataset and one region. Prove: live data, cache hit when offline, clear failure when no cache. Still no mock numbers.

4. Topic / subtopic / chart mapping
   Using the research note, propose subtopics under your 8 topics and a chart type per subtopic. You trim the list to a v1 set (e.g. 1–2 charts per topic).

5. IA + shell UI
   Propose nav, topic pages, region filter, loading/error/empty states. Generic look is fine. Implement the shell with placeholders that say “data unavailable” until wired—not fake stats.

6. Vertical slice
   Fully wire one topic (e.g. Demographics → age) end-to-end: region filter, chart, export, cache, errors. Treat this as the template for the rest.

7. Roll out topics
   Add remaining agreed subtopics one topic (or one chart) at a time, reusing the slice pattern. Acceptance checks can be drafted by the AI as each chart lands.

8. Cross-cutting polish
   Rate limiting, PWA “add to home screen,” mobile chart orientation, label formatting, animations. Then optional visual/brand pass.

Prompt habit: each stage prompt should say what to deliver, what not to invent (especially data and full IA), and to update or propose doc changes for your approval. Point it at docs/requirements-prompt.md plus any research note from stage 2.

With this approach, the requirements doc is enough as a north star; the staged prompts supply the missing detail as you go.

### Prompt 3

Model: Cursor Auto

Context window: **NEW**

Prompt:

You and I are developing an app together.

Take the following steps:

1. Read but do not comment on the requirements-prompt.md file

2. Scaffold Next.js + TypeScript + Tailwind + shadcn + ESLint/Prettier/Husky + basic layout shell. Do not implement real charts or NOMIS integration yet.

3. Confirm it runs.

Your scope is to generate the basic app layput. When I am happy with that we will proceed to build the rest iof the functionality togeather.

Outcome:

Basic file layouts were created but the agent possibly on installing packages with node.

### Prompt 4

Model: Cursor Auto

Context window: **EXISTING**

Prompt:

Your process seemed to hang for a long time. I manually cancelled it. What activity were you trying to complete that could have created an agent to hang?

Outcome:

It was stuck on npx create-next-app’s dependency install (npm install for Next, React, Tailwind, ESLint, etc.).

What happened:

Project files were written successfully (package.json, src/, configs).
Install started, printed one Node engine warning, then stopped producing output.
I kept waiting on that background command to finish, so the agent looked hung.
After the cancel, there is no package-lock.json and next is not installed — the install never completed. Scaffolding itself is fine; the hang was the package install step, not layout or app code.

Want me to finish from here (run npm install, then add shadcn / Prettier / Husky and the layout shell)?

### Prompt 5

Model: Cursor Auto

Context window: **EXISTING**

Prompt:

Should these be installed inside a virtual enviornment and should I install them manually or allow the agent to install them?

Outcome:

No virtual environment. This is a Node/npm project, not Python. Isolation comes from the project’s own node_modules + package-lock.json. You don’t need (or want) a venv for this.

Optional but useful: pin Node with nvm / fnm (your machine is on 20.11.1; some packages prefer ≥20.19). That’s version management, not a venv.

Who should install

| Approach                            | When                                                                                |
| ----------------------------------- | ----------------------------------------------------------------------------------- |
| You run npm install in the terminal | Best when installs have been slow/hanging — you see progress and can cancel cleanly |
| Agent runs it                       | Fine for normal work; ask it to use a long wait and report if it stalls             |

Given the earlier hang, I’d run `npm install` yourself once in this repo, then let the agent continue with shadcn / Prettier / Husky / layout. After that, smaller `npm install <pkg>` steps are usually fine for the agent.

### Manual Step

Executed `npm install` to install packages. This added 362 packages, and audited 363 packages in 2m. There were 2 moderate severity vulnerabilities.

Executed `npm audit fix --force` which reported 92 vulnerabilities (10 low, 56 moderate, 25 high, 1 critical).

Executed `npm audit fix` which showed dependency errors.

```
npm audit fix
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
npm ERR!
npm ERR! While resolving: uk-census-data@0.1.0
npm ERR! Found: react@19.2.4
npm ERR! node_modules/react
npm ERR!   react@"19.2.4" from the root project
npm ERR!
npm ERR! Could not resolve dependency:
npm ERR! peer react@"^16.6.0" from next@9.5.5
npm ERR! node_modules/next
npm ERR!   next@"^9.3.3" from the root project
npm ERR!
npm ERR! Fix the upstream dependency conflict, or retry
npm ERR! this command with --force or --legacy-peer-deps
npm ERR! to accept an incorrect (and potentially broken) dependency resolution.
```

### Prompt 6

Model: Cursor Auto

Context window: **EXISTING**

Prompt:

I ran "npm install" manually followed by "npm audit fix" which gave dependenct errors. How do I fix them. <plus the error output>

Outcome:

The problem isn’t peer-deps in general — next is wrong in package.json.

You currently have:

```
next: ^9.3.3 (from ~2020, expects React 16)
react / react-dom: 19.2.4
eslint-config-next: 16.2.11
```

That mismatch is almost certainly from the interrupted scaffold. npm audit fix then tried to resolve that broken tree and failed.

Fix: pin modern Next, reinstall clean. Skip audit fix for now.

```
# From the project root
# 1. Set Next to match the rest of the stack
npm install next@16.2.11

# If that still fails because of the bad lockfile, do a clean reinstall:
rm -rf node_modules package-lock.json
```

Then edit package.json so dependencies look like:

```
"dependencies": {
  "next": "16.2.11",
  "react": "19.2.4",
  "react-dom": "19.2.4"
}
```

Then:

```
npm install
npm run dev
```

About npm audit fix: on a fresh Next app, ignore it unless you’re shipping something security-critical. It often “fixes” by changing major versions and creates exactly this kind of conflict. Revisit audits later once the app is stable.

### Prompt 7

Model: Cursor Auto

Context window: **EXISTING**

Prompt:

The server runs but with the error:

```
[browser] A tree hydrated but some attributes of the server rendered HTML didn't match the client properties.
```

Outcome:

Hydration mismatches usually come from the layout/page or a browser extension — I'll inspect the current app shell.

That warning is almost certainly not a bug in your page code. The default Next template is static; nothing there should mismatch on its own.

Most common cause: a browser extension (Grammarly, Dark Reader, password managers, ad blockers) injects attributes onto `<html>` or `<body>` before React hydrates. Server HTML ≠ client DOM → hydration warning.

How to confirm

Open the browser console and expand the warning — it usually lists the differing attribute (e.g. cz-shortcut-listen, data-gr-ext-installed).
Or open the app in a private window with extensions disabled. If the warning disappears, it’s the extension.
If it’s extensions (safe to ignore / silence)

In `src/app/layout.tsx`, add `suppressHydrationWarning` on `<html>` (and optionally `<body>`):

```tsx
<html
  lang="en"
  suppressHydrationWarning
  className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
>
  <body className="flex min-h-full flex-col" suppressHydrationWarning>
    {children}
  </body>
</html>
```

That only silences known, unavoidable mismatches on those tags — it doesn’t hide real app bugs elsewhere.

Bottom line: the app can run fine with this. Fix only if the console points at your own code attributes; otherwise treat it as extension noise (or add suppressHydrationWarning).

Want me to apply that layout change as part of finishing the scaffold?

### Prompt 8

Model: Cursor Auto

Context window: **EXISTING**

Prompt:

Complete all of the remaining scaffolding tasks from earlier and tell me the final status.

Outcome:

Scaffold is complete and running. Dev server is up at http://localhost:3000 (home and topic pages return 200). Lint and production build both pass.

What’s in place

| Item                                  | Status                                         |
| ------------------------------------- | ---------------------------------------------- |
| Next.js 16 + TypeScript + Tailwind 4  | Done                                           |
| shadcn/ui (button, separator, sheet)  | Done                                           |
| ESLint + Prettier (+ Tailwind plugin) | Done                                           |
| Husky + lint-staged (pre-commit)      | Done                                           |
| Layout shell (header / nav / footer)  | Done                                           |
| Topic placeholder pages (8 topics)    | Done — “Data unavailable”, no charts/mock data |
| NOMIS / Recharts                      | Not started (by design)                        |

**How to run**

```
npm run dev      # already running on :3000
npm run lint
npm run build
```

**Optional note**
Your Node is 20.11.1; some packages prefer ≥20.19. Things work now, but upgrading Node later will clear the engine warnings.

When you’re happy with the shell, we can move on to NOMIS research next.

### Prompt 9

Model: Cursor Auto

Context window: **NEW**

Prompt:

We are building an app together to display UK Census data based on data from from the NOMIS API. The next stage is to research the NOMIS API.

I want you to:

1. Read the requirements-prompt.md file, but do not comment on it.

2. Research NOMIS Census 2021: base URL, rate limits, JSON-stat shape, how to list datasets, and geography codes for UK regions.

3. Output a short research note, including base urls, dataset IDs, region codes, etc.

4. Confirm that you can connect to data based on your research, but DO NOT modify any application code -- just update the research note if necessary.

DO NOT implement any wiring in code at this stage

5. Give me a summary of your findings, so that we can agree togeather how to approach the next stages.

If you cannot work out how to locate the API or need access credentials then ask me for help and stop processing.

Output:

**Verdict**: NOMIS Census 2021 is reachable as a guest (no API key). Full write-up is in docs/nomis-research.md. No app code was changed.

**Key findings**

| Item              | Finding                                                                                                                |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Base URL          | `https://www.nomisweb.co.uk/api/v01`                                                                                   |
| Data format       | Append `.jsonstat.json` → JSON-stat 2.0 (`id` / `size` / flat `value` + `dimension.*.category.label`)                  |
| Limits            | Guest 25k cells/query; concurrent requests limited (exact caps unpublished). Optional free `uid` raises the cell limit |
| CORS              | `Access-Control-Allow-Origin: *` — browser-direct is possible; a Next.js proxy is still useful                         |
| Coverage          | Topic Summaries are England & Wales only (not Scotland/NI)                                                             |
| Regions (TYPE480) | 9 English regions + Wales (e.g. North West `2013265922`). E&W aggregate: `2092957703`                                  |
| Datasets          | ~83 TS* tables (`NM_2021_1` = TS001, `NM_2028_1` = TS008 Sex, etc.)                                                    |

**Live check:** TS008 Sex for North West returned `[7417397, 3777256, 3640141]` (All / Female / Male).

**Suggested next-stage approach (for agreement)**

1. Data-layer spike — one API route + typed JSON-stat parser + cache/error UI for one table (e.g. TS008) and one region.
2. Topic mapping — pick 1–2 TS tables per major topic from the research note, then trim to a v1 set.
3. Constants — bake in base URL, region codes, dataset IDs, and measure 20100.
4. Defer a Nomis API key unless we hit size/concurrency limits.

If that sequencing looks right, we can move to the data-layer spike next.

### Prompt 10

Model: Cursor Auto

Context window: **EXISTING**

Prompt:

Implement:

1. Data-layer spike
   Prove: live data, cache hit when offline, clear failure when no cache. Still no mock numbers.

2. Topic mapping
   propose subtopics under the 8 topics and a chart type per subtopic. Trim the list to a v1 set (e.g. 1–2 charts per topic).

3. Constants

Output:

Data layer, v1 topic map, and constants are in place. Build passes; the proxy returned live TS008 North West figures (7417397 / 3777256 / 3640141).

1. Data-layer spike

- Proxy: GET /api/nomis?dataset=NM_2028_1&geography=2013265922&measures=20100
- Client: typed JSON-stat parse → localStorage cache → clear error if offline/cache-only with no entry
- UI: /spike — Fetch live · Read cache only · Clear cache

How to prove the three paths:

- Open /spike → live table (Source: Live network)
- Click Read cache only → same numbers (Source: Browser cache)
- Clear cache → Read cache only → “Data cannot be fetched” (no invented numbers)

2. Topic mapping (v1 — please confirm)
   11 charts in docs/topic-map.md / src/lib/topic-map.ts:

| Topic        | Charts                                          |
| ------------ | ----------------------------------------------- |
| Demographics | Sex (pie), Age 5yr (bar)                        |
| Housing      | Tenure (bar), Accommodation (h-bar)             |
| Employment   | Economic activity (h-bar)                       |
| Education    | Highest qualification (bar)                     |
| Health       | General health (bar)                            |
| Transport    | Travel to work (h-bar)                          |
| Family       | Household composition (h-bar)                   |
| Migration    | Country of birth (bar), Migrant indicator (pie) |

3. Constants
   `src/lib/nomis/constants.ts` — base URL, measures (20100/20301), E&W + 10 regions, default North West.

Topic pages list planned charts as “data unavailable” placeholders (not fake stats).

If the v1 set looks right, next stage is IA + shell (region filter, loading/error states), then a vertical slice wiring one chart end-to-end.

### Prompt 11

Model: Cursor Auto (Plan)

Context window: **NEW**

Prompt:

You and I are developing an app together. We have built the basic scaffolding, researched the data connections and wired a data spike as an example of data integration with NOMIS.

Take the following steps:

1. Read but do not comment on the requirements-prompt.md file.

2. Plan an Information Architecture + shell UI. Propose nav, topic pages, region filter, loading/error/empty states. Generic look is fine. Implement the shell with placeholders that say “data unavailable” until wired—not fake stats.

3. Record the IA plan in docs/

Do not update any code until we review togeather, but do propose the next steps.

Outcome:

The `docs/ia.md` was created, with the plan. Cursor offered a "Build locally" option which was selected.

This added the basic Information Architecture.

### Prompt 12

Model: Cursor Auto

Context window: **EXISTING**

Prompt:

Based on the requirements, wire Demographics → Sex for the selected region end-to-end (Recharts pie + existing NOMIS client/cache + shared loading/error/stale), then roll out the rest of the v1 chart set.

Outcomes:

**What landed**

- Recharts pie / bar / horizontal-bar via CensusChartView
- CensusChartPanel — loadCensusSeries + cache, Loading / Error / Stale, respects ?geography=
- Topic pages pass geography into every chart slot (Sex first, then the rest of the v1 set)
- Totals filtered with excludeTotals

**Try it**

Open `/topics/demographics?geography=2013265922` — Sex pie + Age bar should load live from NOMIS. Change region in the header to refetch.

Export (CSV/JSON) and PWA polish are still later stages.

### Prompt 13

Model: Cursor Auto

Context window: **EXISTING**

Prompt:

What are the next steps?

Outcome:

Core v1 is in place (scaffold → NOMIS → IA/shell → all 11 charts). Sensible next stages:

1. **Export** — CSV / JSON on every chart; Share on mobile where supported
2. **Acceptance checks** — short per-chart checks (e.g. “Demographics → Sex for North West loads and exports”) in docs
3. **Rate limiting / fetch hygiene** — throttle or serialize NOMIS calls when a topic loads multiple charts
4. **Responsive chart polish** — mobile label/orientation tweaks called out in requirements
5. **PWA** — installability; offline = last cache only (already partly covered by the data layer)
6. **UI polish** — micro-interactions, branding pass (requirements say generic first)

Optional later: deferred topic-map charts (ethnicity, disability, etc.), drop or fold `/spike` once you’re happy charts are proven.

## Prompt 14

Model: Cursor Auto

Context window: **EXISTING**

Prompt:

Implement:

- Export — CSV / JSON on every chart
- Rate limiting / fetch hygiene
- PWA — installability

Outcome:

All three are in. Lint and build pass.

**Export**

Every chart has CSV and JSON download buttons (readable category labels, geography/dataset metadata). No invented values.

**Rate limiting / fetch hygiene**

- Client: max 2 concurrent NOMIS calls, 300ms spacing, in-flight dedupe per query key
- Server: 30 requests / minute / IP on `/api/nomis` (429 + Retry-After)

**PWA**

- Web app manifest (/manifest.webmanifest) + icons
- App-shell service worker (production only) — caches shell, not API data
- Offline charts still use last localStorage cache only

Install from the browser on HTTPS (e.g. Vercel). Service worker does not register in next dev.

### Prompt 15

Model: Cursor Auto

Context window: **EXISTING**

Prompt:

Remove the data spike if it is not required.

Outcome:

It still existed at /spike, but it wasn’t needed anymore — topic charts already cover live NOMIS, cache, and error/stale states.

Removed:

- /spike route and DataLayerSpike component
- Home/footer links and SPIKE_CHART
- Spike references in docs/ia.md and docs/nomis-research.md

Historical mentions in prompt-record.md / observations.md are left as-is.

### Prompt 16

Model: Cursor Auto

Context window: **EXISTING**

Prompt:

Make the following changes:

1. Default region is "England and Wales"

2. Value displayed in the "Region" dropdown filter should be the region name (i.e. "England and Wales") not the code (i.e. 2092.....).

3. The order of the dropdown, from the top, should be:

- England & Wales (the default)
- England
- Wales
- the other regions in alphabetical order

4. Add an "About" page. Add it to the menu. Include a license.

Outcome:

Done. Here’s what changed:

1. Default region — England and Wales (2092957703)
2. Dropdown labels — shows names via Base UI items (not NOMIS codes)
3. Order — England and Wales → England → Wales → English regions A–Z
4. About — /about in desktop + mobile menus, with Open Government Licence v3.0 attribution for the Census/NOMIS data

### Prompt 17

Model: Cursor Auto

Context window: **EXISTING**

Prompt:

Scaffold unit tests using a runner and React helpers (using Vitest)

Outcome:

Vitest is scaffolded and 15 tests pass.

**Setup**

- Deps: vitest, @vitejs/plugin-react@4, jsdom, Testing Library (react, jest-dom, user-event), vite-tsconfig-paths
- Config: vitest.config.ts (jsdom + @/ path aliases)
- Setup: src/test/setup.ts (@testing-library/jest-dom)
- Scripts: npm test (watch) · npm run test:run (CI)

**Seed tests**

| File                      | Covers                          |
| ------------------------- | ------------------------------- |
| geography-url.test.ts     | URL geography resolution        |
| parse-jsonstat.test.ts    | NOMIS JSON-stat parsing         |
| chart-data.test.ts        | Total filtering / chart mapping |
| download.test.ts          | CSV/JSON export helpers         |
| data-stale-badge.test.tsx | Sample React component test     |

Add new tests as *.test.ts / *.test.tsx next to the code under src/.

### Prompt 18

Model: Cursor Auto

Context window: **EXISTING**

Prompt:

Implement full test coverage for the existing code. then run all of the tests.

Output:

97 tests passed across 24 files — 99.21% statement coverage on app code.

**Commands**

- npm test — watch mode
- npm run test:run — single run
- npm run test:coverage — run + coverage report

**What’s covered**

Lib (NOMIS client/cache/queue/rate-limit/parse/constants, geography, topics, export, utils), API route, pages (home/about/topic/manifest), data/layout/chart/PWA components. shadcn UI primitives and `layout.tsx` (Next fonts) are excluded from coverage targets.

**Remaining gaps (~0.8%)**

Mostly hard-to-hit branches: effect cancel races in CensusChartPanel, a rare AsyncQueue timer race, and a few defensive fallbacks.

## Sprint 2

Deliverables:

1.

### Prompt 1

Model: Cursor Auto

Context window: **NEW**

Prompt:

Define v2 as design and styling.

What planning is required to build a stylish minimalist app design that renders on mobile and desktop? Define the steps and the order to implement.

Outputs:

The full plan is in docs/design.md.

**Planning required (before code)**

1. Lock a short design brief — mood, light-only vs dark, fonts, one accent, chart palette, density, motion budget. Without this, restyling thrashs.
2. Surface inventory — tokens, shell, home/about, topic pages, charts, data states, controls (already listed in the doc).
3. Responsive rules — what changes at sm / lg; no horizontal scroll; chart label behaviour on narrow screens.
4. Acceptance checks — 375px + 1280px on home, one topic, About; AA contrast; tests still green.

**Implement in this order**

Step What
0
Approve the brief
1
Tokens + typography (globals.css, fonts)
2
Shell (header / footer / frame)
3
Home + About
4
Topic page + chart slots
5
Chart visuals + mobile orientation
6
Data states + light CSS motion
7
Responsive QA
Foundation first so pages and charts inherit one look. No new datasets or IA changes in v2.

Next action: approve or edit the default brief table in docs/design.md (mood, accent, fonts). Once that section is locked, implementation can start at step 1.

### Prompt 2

Model: Cursor Auto

Context window: **EXISTING**

Prompt:

Update so that charts use cool blue and green color scales (light blue, teal, navy, grays, etc) not just grey scale. Then approve the design brief.

Then implement.

Output:

**Brief (locked)**

Calm institutional · light only · Source Serif 4 + Source Sans 3 · deep teal accent · cool blue–green chart scale (light blue, teal, navy, seafoam, cool grays, plus 3 more for longer series)

**What changed**

- Tokens / type — cool wash background, teal primary, 8-colour chart palette
- Shell — clearer wordmark, teal active nav, larger touch targets
- Pages — airier home / about / topic rhythm; soft chart panels
- Charts — blue/teal/navy/green fills; vertical bars flip to horizontal under 640px
- States — loading / error / stale aligned with the new look + light fade-in

Details live in `docs/design.md`. Worth a quick look on phone + desktop against the live deploy when you’re ready.

### Prompt 3

Model: Cursor Auto

Context window: **EXISTING**

Prompt:

Implement these layout changes:

1. In desktop view the tiles on the home page should be square in shape, in 4 columns and 2 rows. Mobile should remain rectangular in a single column of 8 rows.

2. In desktop view the Region filter should siut below the header. The header should be "UK Census Data", the topics and About.

3. Do not display every subtopic chart. Only display one. Maintain the subtopic buttons (e.g. Sex, Age) display the chart for th first subtopic as the default but replace that chart when a different button is selected.

4. The tiles on the home page should each have graphics, these can be emojis.

Output:

All four layout changes are in. 100 tests pass.

1. Home tiles — emoji on each topic; desktop lg:grid-cols-4 with aspect-square (4×2); mobile single-column rectangular cards
2. Region filter — sticky bar below the header; header is brand + topics + About only
3. Topic charts — TopicCharts switcher shows one chart at a time; first subtopic is default; buttons replace the chart
4. Emojis — same set as the original app (👥 🏠 💼 🎓 🏥 🚗 👨‍👩‍👧‍👦 🌍)

### Prompt 4

Model: Cursor Auto

Context window: **EXISTING**

Prompt:

In the home page tiles, make the follwoing changes:

- Make the emojis bigger - they are the focus not the text
- center align the emojis and the text
- remove the text describing the subtopics (e.g. "Sex · Age (five-year bands)")
- The emoji and the text should fill the tile
- a hover over should subtley change the background color of the tile - perhaps even subtely increasing the size of the tile or highlighting the tile border

Output:

Home tiles updated:

- Large centered emoji (text-6xl / lg:text-7xl) with topic name only
- Subtopic labels and descriptions removed
- Content centered and filling the tile
- Hover: soft accent background, stronger teal border, slight scale-up (1.02) and shadow

### Prompt 5

Model: Cursor Auto

Context window: **EXISTING**

Prompt:

In the home page make these edits:

1. Remove "Topics
   Charts per topic, filtered by the selected region."

2. Remove "Charts load live from NOMIS for the selected geography."

3. On desktop, ensure all 8 tile appear on the page without scrolling down. Scroll is acceptable on mobile screens.

Outputs:

Done.

1. Removed the Topics heading and subtitle
2. Shortened the intro (dropped the NOMIS sentence)
3. Desktop: home uses a viewport-height layout with a 4×2 grid that fills remaining space so all 8 tiles fit without scrolling; mobile still scrolls as a single column

### Prompt 6

Model: Cursor Auto

Context window: **EXISTING**

Prompt:

1. Remove the "Region" filter from the Home page -- it adds nothing there.

2. Move the region filter to the topic pages. It should replace the section that states, for example, "Showing: England and Wales".

3. Remove the "Charts" subheading on the topic pages.

Output:

Done.

1. Home — no region filter (global bar removed); “Showing: …” copy removed too
2. Topic pages — region filter sits where “Showing: …” was
3. Charts subheading removed; subtopic buttons remain as before

### Prompt 7

Model: Cursor Auto

Context window: **EXISTING**

Prompt:

Implement the following:

1. The Region filter box should be shorter. It only needs to fir "Yorkshire and The Humber".

2. Move unecessary text from the chart boxes:

- Move "Live network · England and Wales · fetched 22/07/2026, 03:02:08" to small grey text outside and underneath of the chart
- Remove "Usual residents by sex." and similar from all charts.
- Remove "(TS008 · pie)" and similar text.

3. Place the CSV and JSON buttons in the top right of the chart.

4. Remove "Installable as an app; offline uses last cached chart data only." from the footer.

### Prompt 8

Model: Cursor Auto

Context window: **EXISTING**

Prompt:

1. Remove "UK Census Data" from the body of the home page. this is already in the header, so adds no value.

2. Make tke the emojis and the text fill the tiles on the home page in desktop view. This is already ok on mobile.

3. Add a share button for alongside the chart export buttons, to share with connected apps.

Output:

Done.

1. Home — removed the body “UK Census Data” heading; kept the short intro line
   2.Desktop tiles — emoji scales with viewport height (clamp) and fills the tile with flex-1 / justify-evenly
2. Share — button beside CSV/JSON; uses the system share sheet when available, otherwise copies the page URL (label briefly shows “Copied”)

## Sprint 3

Deliverables:

1.

### Prompt 1

Model: Cursor Auto (Plan)

Context window: **NEW**

Prompt:

What should be the next steps for the uk-census-data app?

Remaining steps include:

- Adding additional subtopics
- Improving the design
- Tidying the graphs, where text is overlapping or unreadable

What other areas should be improved and how should these steps be staged for an AI agent to develop?

Plan this put fo rme without making any code changes yet.

Outputs:

Staged roadmap documented in [docs/roadmap.md](./roadmap.md) (Stages 1–6: chart readability → design polish → percent → more charts → cross-tabs → geography). Stage 1 agent prompt included in that doc.

### Prompt 2 (Stage 1 — chart readability)

Model: Cursor Auto

Context window: **NEW**

Prompt:

Implement Stage 1 from docs/roadmap.md: chart readability for the existing 20 Census charts.

Context:

- Charts render in src/components/charts/census-chart-view.tsx (pie / bar / horizontal-bar).
- Inventory is docs/topic-map.md and src/lib/topic-map.ts.
- Design tokens and chart colours stay as in docs/design.md — this is presentation polish only.

Goals:

- Make every existing chart readable at ~375px and ~1280px widths.
- Fix overlapping, crushed, or truncated-to-useless axis/legend labels.
- Prefer horizontal-bar (or equivalent) on narrow viewports where vertical angled ticks fail.
- Truncate long category labels on axes; show the full NOMIS label in the tooltip (and keep exports using clear labels).
- Fix pie legend overflow/clipping where needed.
- Add or extend a small shared label-formatting helper if that keeps the chart component clean.

Constraints:

- No new datasets, topics, routes, or IA changes.
- No mock/invented data.
- No full visual redesign — only chart label/layout readability.
- Keep existing unit tests passing; add/adjust tests for any new label helpers.

Process:

1. Briefly list the worst offenders you will fix (from code + fixtures if useful).
2. Implement the fixes.
3. Run npm run test:run.
4. Summarise what changed, which charts remain imperfect, and any follow-ups for Stage 2.

Do not start Stages 2–6.

Outcome:

Stage 1 is done. All unit tests pass (npm run test:run).

**Worst offenders targeted**

- Ethnic group, household composition, disability, legal partnership — long Parent: Child Y-axis labels
- Industry, economic activity, travel method/distance — many horizontal rows, squeezed axes
- Age, country of birth, year of arrival — dense vertical bars with crushed angled ticks
- Migrant-indicator pie — legend clipped by fixed 36px height

**What changed**

- Added src/lib/charts/format-label.ts: leaf-after-colon shortening, truncation, axis width estimate, dense-bar threshold (≥9 categories)
- Horizontal bars: truncated Y ticks, dynamic axis width, slightly taller rows; full NOMIS label still in tooltip
- Vertical bars: same truncation; auto-flip to horizontal on narrow viewports or when dense
- Pies: wrapping custom legend, dynamic height, more room for the donut; full label via tooltip/title
- Exports unchanged (still use full observation labels)

### Prompt 3

Model: Cursor Auto

Context window: **EXISTING**

Prompt:

Ensure there is high test coverage for these changes.

Then, if the tests run pass, commit and push the code.

Outcome:

