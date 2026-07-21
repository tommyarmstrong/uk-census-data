# Topic / subtopic / chart map (v1)

Proposal for Census 2021 Topic Summary tables under the eight major topics.
Trimmed to a **v1 set of 1–2 charts per topic** (11 charts total).

Constants live in `src/lib/topic-map.ts` and `src/lib/nomis/constants.ts`.

Geography for all charts: England & Wales aggregates and regions; default **England and Wales** (`2092957703`). Measure: count (`20100`).

---

## Candidates considered → v1 choice

| Topic                  | Candidates                                               | v1 charts                                               | Chart type          | Why                                                              |
| ---------------------- | -------------------------------------------------------- | ------------------------------------------------------- | ------------------- | ---------------------------------------------------------------- |
| Demographics           | TS007/A/B age, TS008 sex, TS009 sex×age, TS021 ethnicity | **TS008 Sex**, **TS007A Age (5yr)**                     | pie, bar            | Clear composition + age structure without a huge cross-tab       |
| Housing                | TS044 accommodation, TS054 tenure, TS045 cars            | **TS054 Tenure**, **TS044 Accommodation**               | bar, horizontal-bar | Core housing questions; tenure is the classic split              |
| Employment             | TS066 activity, TS060 industry, TS063 occupation         | **TS066 Economic activity**                             | horizontal-bar      | One chart for v1; industry/occupation deferred (many categories) |
| Education              | TS067 qualification, TS068 students                      | **TS067 Highest qualification**                         | bar                 | Primary education outcome for adults 16+                         |
| Health & Disability    | TS037 health, TS038 disability                           | **TS037 General health**                                | bar                 | Single ordinal scale; disability deferred to v1.1                |
| Transport              | TS061 method, TS058 distance                             | **TS061 Method of travel to work**                      | horizontal-bar      | Most readable transport chart                                    |
| Family & Relationships | TS003 household composition, TS002 partnership           | **TS003 Household composition**                         | horizontal-bar      | Broader household picture than partnership alone                 |
| Migration              | TS004 birth, TS015 arrival, TS019 migrant indicator      | **TS004 Country of birth**, **TS019 Migrant indicator** | bar, pie            | Birthplace + migrant status without long arrival series          |

---

## v1 chart inventory

| Topic slug               | Chart                    | Dataset ID  | Category dimension | Chart type     |
| ------------------------ | ------------------------ | ----------- | ------------------ | -------------- |
| demographics             | Sex                      | `NM_2028_1` | `c_sex`            | pie            |
| demographics             | Age (five-year bands)    | `NM_2020_1` | `c2021_age_19`     | bar            |
| housing                  | Tenure                   | `NM_2072_1` | `c2021_tenure_9`   | bar            |
| housing                  | Accommodation type       | `NM_2062_1` | `c2021_acctype_9`  | horizontal-bar |
| employment               | Economic activity        | `NM_2083_1` | `c2021_eastat_20`  | horizontal-bar |
| education                | Highest qualification    | `NM_2084_1` | `c2021_hiqual_8`   | bar            |
| health-and-disability    | General health           | `NM_2055_1` | `c2021_health_6`   | bar            |
| transport                | Method of travel to work | `NM_2078_1` | `c2021_ttwmeth_12` | horizontal-bar |
| family-and-relationships | Household composition    | `NM_2023_1` | `c2021_hhcomp_15`  | horizontal-bar |
| migration                | Country of birth         | `NM_2024_1` | `c2021_cob_12`     | bar            |
| migration                | Migrant indicator        | `NM_2039_1` | `c2021_migind_4`   | pie            |

Rows labelled `Total:…` should be excluded from charts (`excludeTotals: true` in code).

---

## Deferred (post-v1)

- Ethnicity (TS021), disability (TS038), industry/occupation, cars/vans, year of arrival, legal partnership, students.
- Cross-tabs (e.g. TS009 sex by age) and percent measure (`20301`).

Approve or trim further before the vertical-slice stage wires charts.
