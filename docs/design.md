# Design (v2)

Stylish **minimalist** visual pass for the existing Census explorer. IA, routes, charts, and data behaviour stay as in [ia.md](./ia.md) and [topic-map.md](./topic-map.md). No new topics or datasets in this sprint.

Reference (feel, not pixel-copy): [original app](https://ukcensus.tommyarmstrong.uk).

---

## Goal

Make the product feel intentional and calm on **mobile and desktop**: clear hierarchy, restrained colour, readable charts, no dashboard clutter. Generic shadcn defaults → a coherent census-data identity.

---

## Planning required (before coding)

Do these as a short **design brief approval** step. Do not restyle the whole app until the brief is locked.

### 1. Design brief (human + agent, approve once)

| Decision      | Options / guidance                                     | Locked choice                                                                                     |
| ------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| Mood          | Calm institutional / editorial data / soft product     | **Calm institutional**: quiet, official-adjacent, not SaaS marketing                              |
| Light / dark  | Light only / both / dark only                          | **Light only** for v2                                                                             |
| Brand signal  | Wordmark only vs wordmark + short mark                 | **Wordmark** “UK Census Data” as primary chrome                                                   |
| Typography    | Keep Geist / swap display + body                       | **Source Serif 4** (headings) + **Source Sans 3** (body)                                          |
| Colour        | Neutrals + one accent                                  | **Cool neutrals + deep teal accent** (ink teal / navy family)                                     |
| Chart palette | Greyscale ramp / accent-led sequential / categorical   | **Cool blue–green categorical**: light blue, teal, navy, seafoam, cool grays (not greyscale-only) |
| Density       | Airy / compact                                         | **Airy**: generous page padding, tight chart chrome                                               |
| Surfaces      | Borders only / soft fill / cards                       | **Borders + whitespace**; soft cool wash on page; cards only for chart panels                     |
| Motion        | None / CSS only                                        | **2–3 CSS motions**: nav active, sheet, chart/skeleton fade — no library                          |
| Out of scope  | New routes, more charts, share-on-mobile, PWA icon art | Deferred                                                                                          |

### 2. Surface inventory (what gets restyled)

| Surface                       | Files (approx.)                                               | Notes                            |
| ----------------------------- | ------------------------------------------------------------- | -------------------------------- |
| Tokens / fonts                | `globals.css`, `app/layout.tsx`                               | Foundation; everything inherits  |
| Shell (header, footer, frame) | `site-header`, `site-footer`, `site-shell`                    | Sticky header; mobile sheet      |
| Home                          | `app/page.tsx`                                                | Intro + topic grid               |
| Topic page                    | `app/topics/[slug]/page.tsx`, `chart-slot`                    | Title, region line, chart panels |
| Chart chrome + Recharts       | `census-chart-panel`, `census-chart-view`                     | Axes, tooltips, legend, colours  |
| Data states                   | `data-loading`, `data-error`, `data-unavailable`, stale badge | Match new quiet visual language  |
| About                         | `app/about/page.tsx`                                          | Same type/spacing as home        |
| Controls                      | `button`, `select`, `sheet`, `region-filter`                  | Touch targets ≥ 44px on mobile   |

### 3. Responsive rules (lock with brief)

| Breakpoint (Tailwind) | Behaviour                                                            |
| --------------------- | -------------------------------------------------------------------- |
| `< sm`                | Compact region control; hamburger sheet; single-column topics/charts |
| `sm`–`lg`             | Header region filter; sheet for topic nav; charts full width         |
| `≥ lg`                | Full topic nav in header; max content width unchanged (`max-w-6xl`)  |

Charts:

- No horizontal page scroll.
- Prefer **horizontal-bar** readability on narrow viewports for long category labels (orientation polish allowed in this sprint where it serves design).
- Tooltips/legends must not overflow the viewport; truncate or wrap labels.

### 4. Acceptance checks (v2)

- [x] Home, one topic page, About: readable and on-brand at ~375px and ~1280px
- [x] Region filter usable with thumb; sheet nav reaches all topics + About
- [x] Charts remain legible (labels, contrast); export actions still obvious
- [x] Loading / error / stale states match the new look (no mock data)
- [x] Colour contrast meets WCAG AA for text and key UI chrome
- [x] Existing unit tests still pass; update snapshots/selectors only if copy/structure changes

---

## Brief (locked)

_Status: **approved** (2026-07-22)._

- Mood: Calm institutional
- Theme: Light only
- Fonts: Source Serif 4 (headings) + Source Sans 3 (body)
- Accent: Deep teal (`oklch` cool teal / navy family)
- Chart palette: Cool blue–green categorical — light blue, teal, navy, seafoam, cool slate/gray (cycles beyond 5 via extended tokens)
- Motion: Nav active state, skeleton pulse, chart fade-in (CSS only)

---

## Implementation order

Work **foundation → chrome → pages → charts → states → verify**. Do not restyle pages before tokens exist.

| Step  | Deliverable                        | Why this order                                  | Prompt shape                                             |
| ----- | ---------------------------------- | ----------------------------------------------- | -------------------------------------------------------- |
| **0** | Lock brief above                   | Prevents rework                                 | Approve table defaults or edit once                      |
| **1** | Design tokens + typography         | Single source of truth for colour, radius, type | Update `globals.css` + `layout.tsx` fonts only           |
| **2** | Shell (header / footer / frame)    | Every page inherits chrome                      | Restyle layout components; keep IA/nav behaviour         |
| **3** | Home + About                       | Low data risk; set page rhythm                  | Spacing, hierarchy, topic grid — no IA changes           |
| **4** | Topic page + chart slots           | Chart panels sit in page rhythm                 | Titles, anchors, panel borders/padding                   |
| **5** | Chart visuals + mobile orientation | Data must stay correct; only presentation       | Recharts theme, axes, legend, narrow-viewport behaviour  |
| **6** | Data states + light motion         | Last paint pass                                 | Skeleton/error/unavailable + 2–3 CSS transitions         |
| **7** | Responsive QA + doc touch-up       | Close the sprint                                | Check acceptance list; mark brief locked; note leftovers |

### Explicit non-goals for v2

- No new NOMIS datasets or deferred topic-map charts
- No IA / route changes
- No dark-mode productization
- No large illustration/hero photography (minimalist data UI)
- Share-on-mobile and acceptance-checks doc remain post-v2 unless they fall out of chart polish for free

---

## Suggested agent cadence

1. **Plan/approve**: brief + this order (this doc).
2. **One implementation shot for steps 1–2** (tokens + shell).
3. **One shot for steps 3–4** (pages + slots).
4. **One shot for steps 5–6** (charts + states).
5. **Human QA** on phone + desktop against the acceptance list; small fix pass.

Prefer approving the brief once over multishotting token debates mid-build.
