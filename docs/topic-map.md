# Topic / subtopic / chart map

Census 2021 Topic Summary tables under the eight major topics.
**v3** includes the original v1 charts plus deferred subtopics from NOMIS research (20 charts total).

Constants live in `src/lib/topic-map.ts` and `src/lib/nomis/constants.ts`.

Geography for all charts: England & Wales aggregates and regions; default **England and Wales** (`2092957703`). Charts plot count (`20100`); tooltips also show NOMIS percent (`20301`), e.g. `15,258,981 (61.6%)`.

---

## Chart inventory

| Topic slug               | Chart                                 | Dataset ID  | Category dimension   | Chart type     | Category mode |
| ------------------------ | ------------------------------------- | ----------- | -------------------- | -------------- | ------------- |
| demographics             | Sex                                   | `NM_2028_1` | `c_sex`              | pie            | —             |
| demographics             | Age (five-year bands)                 | `NM_2020_1` | `c2021_age_19`       | bar            | —             |
| demographics             | Ethnic group                          | `NM_2041_1` | `c2021_eth_20`       | horizontal-bar | detail        |
| housing                  | Tenure                                | `NM_2072_1` | `c2021_tenure_9`     | bar            | —             |
| housing                  | Accommodation type                    | `NM_2062_1` | `c2021_acctype_9`    | horizontal-bar | —             |
| housing                  | Car or van availability               | `NM_2063_1` | `c2021_cars_5`       | bar            | —             |
| employment               | Economic activity                     | `NM_2083_1` | `c2021_eastat_20`    | horizontal-bar | detail        |
| employment               | Industry                              | `NM_2077_1` | `c2021_ind_88`       | horizontal-bar | summary       |
| employment               | Occupation                            | `NM_2080_1` | `c2021_occ_10`       | horizontal-bar | —             |
| education                | Highest qualification                 | `NM_2084_1` | `c2021_hiqual_8`     | bar            | —             |
| education                | Schoolchildren and full-time students | `NM_2085_1` | `c2021_student_3`    | pie            | —             |
| health-and-disability    | General health                        | `NM_2055_1` | `c2021_health_6`     | bar            | —             |
| health-and-disability    | Disability                            | `NM_2056_1` | `c2021_disability_5` | horizontal-bar | detail        |
| transport                | Method of travel to work              | `NM_2078_1` | `c2021_ttwmeth_12`   | horizontal-bar | —             |
| transport                | Distance travelled to work            | `NM_2075_1` | `c2021_ttwdist_11`   | horizontal-bar | —             |
| family-and-relationships | Household composition                 | `NM_2023_1` | `c2021_hhcomp_15`    | horizontal-bar | detail        |
| family-and-relationships | Legal partnership status              | `NM_2022_1` | `c2021_lpstat_12`    | horizontal-bar | detail        |
| migration                | Country of birth                      | `NM_2024_1` | `c2021_cob_12`       | bar            | —             |
| migration                | Migrant indicator                     | `NM_2039_1` | `c2021_migind_4`     | pie            | —             |
| migration                | Year of arrival in the UK             | `NM_2035_1` | `c2021_arruk_13`     | bar            | —             |

- **detail** — leaf categories only (exclude rollup codes `≥ 1000`)
- **summary** — section / high-level rollups only (codes `≥ 1000`); used for Industry so charts stay readable
- Universe rows (`Total:…`, `Total`, code `0`) are excluded via `excludeTotals`

---

## v3 additions (from NOMIS research)

| Topic                  | Added charts                          | Tables       |
| ---------------------- | ------------------------------------- | ------------ |
| Demographics           | Ethnic group                          | TS021        |
| Housing                | Car or van availability               | TS045        |
| Employment             | Industry, Occupation                  | TS060, TS063 |
| Education              | Schoolchildren and full-time students | TS068        |
| Health & Disability    | Disability                            | TS038        |
| Transport              | Distance travelled to work            | TS058        |
| Family & Relationships | Legal partnership status              | TS002        |
| Migration              | Year of arrival in the UK             | TS015        |

---

## Still deferred

- Cross-tabs (e.g. TS009 sex by age)
- Local authority / MSOA geography drill-down
