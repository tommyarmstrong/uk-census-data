# NOMIS Census 2021 — Research Note

Status: **connectivity verified** (2026-07-21); app wired through topic charts and `/api/nomis` (see Implementation status). Guest access works; no API key required for current-scale queries.

Official docs: [https://www.nomisweb.co.uk/api](https://www.nomisweb.co.uk/api)  
Census 2021 source hub: [https://www.nomisweb.co.uk/sources/census_2021](https://www.nomisweb.co.uk/sources/census_2021)

---

## Base URL

```
https://www.nomisweb.co.uk/api/v01
```

- Prefer **HTTPS**. `http://` redirects to HTTPS.
- Dataset data (JSON-stat):

```
GET {BASE}/dataset/{DATASET_ID}.jsonstat.json?geography={code}&measures={code}&…
```

- Example (live, verified):

```
https://www.nomisweb.co.uk/api/v01/dataset/NM_2028_1.jsonstat.json?geography=2013265922&measures=20100
```

→ TS008 Sex for North West: `[7417397, 3777256, 3640141]` (All / Female / Male).

CORS: `Access-Control-Allow-Origin: *` is present, so browser-direct calls are possible. A Next.js API-route proxy is still useful for caching, shaping, and hiding any future `uid`.

---

## Auth and rate / size limits

| Item                 | Detail                                                                                                         |
| -------------------- | -------------------------------------------------------------------------------------------------------------- |
| Auth                 | **Optional.** Guest works without a key.                                                                       |
| Guest cell limit     | **25,000** cells per download (JSON-stat and most formats).                                                    |
| Registered (`uid=…`) | Higher limit (docs / community sources cite **100,000** cells). Register at Nomis “my account” → web services. |
| Concurrent requests  | Limited (exact numbers not published). Prefer few parallel calls; contact Nomis helpdesk for specifics.        |
| Caching bust         | Optional `random=` or `_=` query params.                                                                       |

For regional topic-summary charts (tens to hundreds of cells), guest access is enough. Keep queries narrow (one dataset × one region, or `TYPE480` for all regions of a thin table).

---

## Discovery — listing datasets

| Purpose                  | URL                                                         |
| ------------------------ | ----------------------------------------------------------- |
| All datasets (large)     | `/dataset/def.sdmx.json`                                    |
| Search                   | `/dataset/def.sdmx.json?search=…`                           |
| One dataset structure    | `/dataset/{ID}/def.sdmx.json`                               |
| Dimension codes          | `/dataset/{ID}/{concept}.def.sdmx.json`                     |
| Geography under a parent | `/dataset/{ID}/geography/{parentCode}TYPE{n}.def.sdmx.json` |

Useful search patterns:

- `search=name-TS*` — Topic Summary tables (Census 2021 TS001–TS079 family)
- `search=*TS009*` — exact table mnemonic
- Wildcard `*`, case-insensitive; can also use `name-`, `description-`, `keywords-`, `contenttype-`

Dataset IDs look like `NM_2028_1`. The numeric part is **not** the year; e.g. `NM_2021_1` is **TS001**, not “all of 2021”.

---

## Census 2021 coverage note

Nomis Census 2021 Topic Summaries are **England and Wales** (ONS), not Scotland or Northern Ireland. “UK regions” in the product brief should be treated as **English regions + Wales** for these datasets.

---

## Geography codes (primary filter)

Parent (countries / E&W):

| Nomis code   | Name              | GSS         |
| ------------ | ----------------- | ----------- |
| `2092957703` | England and Wales | `K04000001` |
| `2092957699` | England           | `E92000001` |
| `2092957700` | Wales             | `W92000004` |

Regions under England and Wales (`TYPE480`):

| Nomis code   | Name                     | GSS         |
| ------------ | ------------------------ | ----------- |
| `2013265921` | North East               | `E12000001` |
| `2013265922` | North West               | `E12000002` |
| `2013265923` | Yorkshire and The Humber | `E12000003` |
| `2013265924` | East Midlands            | `E12000004` |
| `2013265925` | West Midlands            | `E12000005` |
| `2013265926` | East                     | `E12000006` |
| `2013265927` | London                   | `E12000007` |
| `2013265928` | South East               | `E12000008` |
| `2013265929` | South West               | `E12000009` |
| `2013265930` | Wales                    | `W92000004` |

Shortcuts:

- All regions in one call: `geography=TYPE480`
- Multiple codes: comma-separated (`geography=2013265921,2013265922`)

Suggested default for the app: **England and Wales** (`2092957703`) or a single region (e.g. North West `2013265922`). Local authority and below are out of scope for now.

Codelist source used:

```
/dataset/NM_2021_1/geography/2092957703TYPE480.def.sdmx.json
```

---

## JSON-stat shape (v2.0)

Response is JSON-stat **2.0** (`"version": "2.0"`, `"class": "dataset"`).

Important fields:

- `label` — table title
- `id` — ordered dimension names (e.g. `["time","geography","c_sex","measures"]`)
- `size` — length of each dimension
- `value` — flat array of observations (row-major over `id` order)
- `dimension[dim].category.index` / `.label` — code → position / label
- `extension.warnings` / `extension.metadata` — disclosure notes, about-text

Values are indexed by walking dimensions in `id` order. Category concepts are **lowercase** in JSON-stat (`c_sex`, `c2021_hiqual_8`) even when the KeyFamily uses uppercase (`C_SEX`, `C2021_HIQUAL_8`).

Common measures (verified on Census TS tables):

| Code    | Meaning       |
| ------- | ------------- |
| `20100` | value (count) |
| `20301` | percent       |

`date=latest` / `time=latest` work; for static Census 2021 tables, omitting date often still returns the single available period.

---

## Representative dataset IDs (Topic Summaries)

There are **~83** `TS*` datasets on Nomis. Illustrative mapping to our major topics (full subtopic mapping is a later stage):

| Topic                    | Example tables                                                         | Dataset IDs                                        |
| ------------------------ | ---------------------------------------------------------------------- | -------------------------------------------------- |
| Demographics             | TS007 Age; TS008 Sex; TS009 Sex by age; TS021 Ethnic group             | `NM_2027_1`, `NM_2028_1`, `NM_2029_1`, `NM_2041_1` |
| Housing                  | TS044 Accommodation; TS054 Tenure; TS045 Cars                          | `NM_2062_1`, `NM_2072_1`, `NM_2063_1`              |
| Employment               | TS066 Economic activity; TS060 Industry; TS063 Occupation              | `NM_2083_1`, `NM_2077_1`, `NM_2080_1`              |
| Education                | TS067 Highest qualification; TS068 Students                            | `NM_2084_1`, `NM_2085_1`                           |
| Health and Disability    | TS037 Health; TS038 Disability                                         | `NM_2055_1`, `NM_2056_1`                           |
| Transport                | TS061 Method of travel to work; TS058 Distance                         | `NM_2078_1`, `NM_2075_1`                           |
| Family and Relationships | TS003 Household composition; TS002 Legal partnership                   | `NM_2023_1`, `NM_2022_1`                           |
| Migration                | TS004 Country of birth; TS015 Year of arrival; TS019 Migrant indicator | `NM_2024_1`, `NM_2035_1`, `NM_2039_1`              |

Each table has its own category concept name (e.g. `C2021_HIQUAL_8` for TS067). Discover via `/dataset/{ID}/def.sdmx.json`, then fetch category labels via `/{concept}.def.sdmx.json`.

---

## Connectivity check (this session)

| Check                                      | Result                           |
| ------------------------------------------ | -------------------------------- |
| List/search TS datasets                    | OK (`name-TS*` → 83 tables)      |
| Geography TYPE480 regions                  | OK (10 codes)                    |
| JSON-stat single region (TS008 North West) | OK HTTP 200                      |
| JSON-stat all regions (`TYPE480`)          | OK 30 cells                      |
| JSON-stat + `date=latest` (TS067 London)   | OK HTTP 200                      |
| CORS header                                | `Access-Control-Allow-Origin: *` |
| API key required?                          | **No** for these queries         |

---

## Implementation status

- Constants: `src/lib/nomis/constants.ts`
- Topic / chart map (v3, 20 charts): `docs/topic-map.md`, `src/lib/topic-map.ts`
- Proxy + client: `/api/nomis`, `src/lib/nomis/client.ts` (cache, queue, offline fallback)
- Charts: topic pages via `CensusChartPanel` (live NOMIS + Recharts)
