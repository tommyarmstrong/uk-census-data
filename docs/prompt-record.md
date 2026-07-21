# Record of prompts

NEVER EDIT THIS FILE WITHOUT EXPLICIT PERMISSION. THIS IS IMPORTANT.

## Prompt 1

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

## Prompt 2

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

## Prompt 3

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

## Prompt 4

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

## Prompt 5

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

## Manual Step

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

## Prompt 6

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

## Prompt 7

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

## Prompt 8

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

## Prompt 9

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

## Prompt 10

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

## Prompt 11

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

## Prompt 11

Model: Cursor Auto (Plan)

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

## Prompt 12

Model: Cursor Auto (Plan)

Context window: **EXISTING**

Prompt: