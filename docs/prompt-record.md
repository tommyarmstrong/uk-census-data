# Record of prompts

NEVER EDIT THIS FILE WITHOUT EXPLICIT PERMISSION. THIS IS IMPORTANT.

## Prompt 1

Model: Cursor Auto 

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
