# Topic / subtopic / chart map

Census 2021 Topic Summary tables under the eight major topics.
**v3** added deferred subtopics from NOMIS research; **Stage 4** and follow-on alternates bring the inventory to **34** univariate charts.

Constants live in `src/lib/topic-map.ts` and `src/lib/nomis/constants.ts`.

Geography for all charts: England & Wales aggregates and regions; default **England and Wales** (`2092957703`). Charts plot count (`20100`); tooltips also show NOMIS percent (`20301`), e.g. `15,258,981 (61.6%)`.

---

## Chart inventory

| Topic slug               | Chart                                 | Dataset ID  | Category dimension        | Chart type     | Category mode |
| ------------------------ | ------------------------------------- | ----------- | ------------------------- | -------------- | ------------- |
| demographics             | Sex                                   | `NM_2028_1` | `c_sex`                   | pie            | —             |
| demographics             | Age (five-year bands)                 | `NM_2020_1` | `c2021_age_19`            | bar            | —             |
| demographics             | Ethnic group                          | `NM_2041_1` | `c2021_eth_20`            | horizontal-bar | detail        |
| demographics             | Religion                              | `NM_2049_1` | `c2021_religion_10`       | horizontal-bar | —             |
| demographics             | Sexual orientation                    | `NM_2060_1` | `c2021_sexor_6`           | pie            | —             |
| demographics             | Gender identity                       | `NM_2061_1` | `c2021_genderid_7`        | horizontal-bar | —             |
| housing                  | Tenure                                | `NM_2072_1` | `c2021_tenure_9`          | bar            | —             |
| housing                  | Accommodation type                    | `NM_2062_1` | `c2021_acctype_9`         | horizontal-bar | —             |
| housing                  | Car or van availability               | `NM_2063_1` | `c2021_cars_5`            | bar            | —             |
| housing                  | Central heating                       | `NM_2064_1` | `c2021_heating_13`        | horizontal-bar | —             |
| housing                  | Number of bedrooms                    | `NM_2068_1` | `c2021_bedrooms_5`        | bar            | —             |
| housing                  | Occupancy rating for bedrooms         | `NM_2070_1` | `c2021_occrat_bedrooms_6` | bar            | —             |
| housing                  | Households by deprivation dimensions  | `NM_2031_1` | `c2021_dep_6`             | bar            | —             |
| employment               | Economic activity                     | `NM_2083_1` | `c2021_eastat_20`         | horizontal-bar | detail        |
| employment               | Industry                              | `NM_2077_1` | `c2021_ind_88`            | horizontal-bar | summary       |
| employment               | Occupation                            | `NM_2080_1` | `c2021_occ_10`            | horizontal-bar | —             |
| employment               | Hours worked                          | `NM_2076_1` | `c2021_hours_5`           | bar            | detail        |
| employment               | NS-SeC                                | `NM_2079_1` | `c2021_nssec_10`          | horizontal-bar | —             |
| education                | Highest qualification                 | `NM_2084_1` | `c2021_hiqual_8`          | bar            | —             |
| education                | Schoolchildren and full-time students | `NM_2085_1` | `c2021_student_3`         | pie            | —             |
| health-and-disability    | General health                        | `NM_2055_1` | `c2021_health_6`          | bar            | —             |
| health-and-disability    | Disability                            | `NM_2056_1` | `c2021_disability_5`      | horizontal-bar | detail        |
| health-and-disability    | Provision of unpaid care              | `NM_2057_1` | `c2021_carer_7`           | horizontal-bar | detail        |
| transport                | Method of travel to work              | `NM_2078_1` | `c2021_ttwmeth_12`        | horizontal-bar | —             |
| transport                | Distance travelled to work            | `NM_2075_1` | `c2021_ttwdist_11`        | horizontal-bar | —             |
| family-and-relationships | Household composition                 | `NM_2023_1` | `c2021_hhcomp_15`         | horizontal-bar | detail        |
| family-and-relationships | Legal partnership status              | `NM_2022_1` | `c2021_lpstat_12`         | horizontal-bar | detail        |
| family-and-relationships | Living arrangements                   | `NM_2030_1` | `c2021_living_11`         | horizontal-bar | detail        |
| family-and-relationships | Household size                        | `NM_2037_1` | `c2021_hhsize_10`         | bar            | —             |
| migration                | Country of birth                      | `NM_2024_1` | `c2021_cob_12`            | bar            | —             |
| migration                | Migrant indicator                     | `NM_2039_1` | `c2021_migind_4`          | pie            | —             |
| migration                | Year of arrival in the UK             | `NM_2035_1` | `c2021_arruk_13`          | bar            | —             |
| migration                | Length of residence in the UK         | `NM_2036_1` | `c2021_resuk_6`           | bar            | —             |
| migration                | Proficiency in English                | `NM_2048_1` | `c2021_engprf_6`          | horizontal-bar | detail        |

- **detail** — leaf categories only (exclude mid-level codes `100–999` and section rollups `≥ 1000`)
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

## Stage 4 additions

| Topic                  | Added charts                                  | Tables              |
| ---------------------- | --------------------------------------------- | ------------------- |
| Demographics           | Religion, Sexual orientation, Gender identity | TS030, TS077, TS078 |
| Housing                | Central heating, Number of bedrooms           | TS046, TS050        |
| Employment             | Hours worked                                  | TS059               |
| Health & Disability    | Provision of unpaid care                      | TS039               |
| Family & Relationships | Living arrangements                           | TS010               |
| Migration              | Length of residence in the UK                 | TS016               |

---

## Stage 4 follow-on (approved alternates)

| Topic                  | Added charts                               | Tables       |
| ---------------------- | ------------------------------------------ | ------------ |
| Housing                | Occupancy rating for bedrooms, Deprivation | TS052, TS011 |
| Employment             | NS-SeC                                     | TS062        |
| Family & Relationships | Household size                             | TS017        |
| Migration              | Proficiency in English                     | TS029        |

---

## Still deferred

- Cross-tabs (e.g. TS009 sex by age)
- Local authority / MSOA geography drill-down
