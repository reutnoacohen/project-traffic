# Traffic Reporter — Phase 2: Architecture & Implementation Plan

## Overview

Phase 2 turns the visual prototype into a real working internal application with:
- Campaign Intake / Offer Setup
- Raw Data Ingestion (upload + manual + paste notes)
- Mapping + KPI Engine
- Alerts and Rules Engine
- AI Copilot (placeholder + abstraction)
- AI-assisted Campaign Brief Parser

---

## 1. Product Architecture

### High-Level Flow

```
Campaign Setup (form / brief parser)
        ↓
    Campaign Config (DB)
        ↓
Raw Data Ingestion (upload / manual / paste)
        ↓
    Raw Data (DB) + Column Mapping
        ↓
   KPI Engine (calculate vs campaign rules)
        ↓
Alerts Engine (compare actual vs thresholds)
        ↓
  AI Copilot (query config + data + alerts)
```

### Data Flow

1. **Campaign Creation** → User fills form or pastes brief → Parser extracts fields → User reviews → Save
2. **Raw Data** → Upload CSV/Excel or paste notes → Parse → Map columns → Store
3. **Linking** → Associate raw data to campaign (by af_prt, offer_name, date range, etc.)
4. **KPI Calc** → For each campaign, aggregate raw data, compute KPIs vs baseline
5. **Alerts** → Rules engine compares KPIs to thresholds → Create alert records

---

## 2. Database Schema

### Entities

| Entity | Purpose |
|--------|---------|
| `Campaign` | Campaign/offer configuration with all setup fields |
| `CampaignCap` | Caps (daily impressions, clicks, etc.) — 1:N per campaign |
| `CampaignKpiRule` | VTA KPI rules — 1:N per campaign |
| `RawDataUpload` | Upload metadata (file name, status, campaign link) |
| `RawDataRow` | Individual performance rows (date, source, installs, etc.) |
| `ColumnMapping` | Global mapping: AppsFlyer column → internal field |
| `CampaignColumnMapping` | Campaign-specific overrides (optional) |
| `Alert` | Generated alerts (campaign, type, severity, details) |
| `AIConversation` | AI Copilot chat sessions (future) |

### Campaign Fields (Core)

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| offer_name | string | Required |
| af_prt | string | AppsFlyer partner ID |
| preview_url | string | |
| mmp | string | MMP (AppsFlyer, Adjust, etc.) |
| os | string[] | iOS, Android, etc. |
| excluded_states | string[] | Geo exclusions |
| payout_we_get | decimal | |
| payout_po | decimal | PO payout |
| budget | decimal | |
| payable_events | string[] | Install, signup, etc. |
| vta_enabled | boolean | |
| dummy_allowed | boolean | |
| ctv_enabled | boolean | |
| kpi_baseline | JSON | Baseline KPIs |
| vta_lookback_days | int | |
| cta_min_install | int | CTA minimum |
| cta_min_click | int | |
| install_to_signup_min | decimal | % |
| fraud_max_pct | decimal | Max tolerated fraud % |
| fraud_tool | string | |
| tracking_param_template | text | |
| onelink_template | text | |
| creatives_link | string | URL |
| notes | text | |
| status | enum | draft, active, paused |
| created_at, updated_at | datetime | |

### Caps (1:N)

| Field | Type |
|-------|------|
| campaign_id | FK |
| cap_type | enum (impressions_daily, clicks_daily, installs_daily, spend_daily) |
| value | decimal |
| unit | string |

### KPI Rules (1:N)

| Field | Type |
|-------|------|
| campaign_id | FK |
| metric | string (cti, its, cpa, roas, retention_d1, fraud_pct, etc.) |
| operator | enum (min, max) |
| threshold_value | decimal |
| threshold_unit | string |

### RawDataRow

| Field | Type |
|-------|------|
| upload_id | FK |
| campaign_id | FK (nullable until linked) |
| date | date |
| source | string |
| campaign_name | string |
| installs | int |
| clicks | int |
| spend | decimal |
| revenue | decimal |
| signups | int |
| fraud_count | int |
| ... (extensible JSON for extra cols) |

### Alert

| Field | Type |
|-------|------|
| campaign_id | FK |
| type | enum (kpi_below_min, fraud_above_max, excluded_geo, cap_near_limit, zero_conversion, performance_drop) |
| severity | enum (high, medium, low) |
| metric | string |
| expected | string |
| actual | string |
| details | JSON |
| created_at | datetime |

---

## 3. New Pages & Navigation

| Page | Route | Purpose |
|------|-------|---------|
| Campaign List | /campaigns | List all campaigns, create new |
| Campaign Setup | /campaigns/new | Form + Brief Parser tab |
| Campaign Details | /campaigns/[id] | Overview, KPIs, raw data, AI Copilot panel |
| Raw Data Upload | /campaigns/[id]/raw-data | Upload/manual/paste for campaign |
| Data Mapping | /campaigns/[id]/mapping | Map columns for this campaign's uploads |
| KPI Evaluation | /campaigns/[id]/kpi | KPI vs rules, pass/fail |
| Alerts | /alerts | All alerts (existing, enhanced) |

### Sidebar Update

```
Campaigns
  ├─ All Campaigns
  └─ New Campaign
Dashboard
Upload Reports
Upload History
...
Alerts
...
Settings
```

---

## 4. AI Copilot Architecture

### Service Abstraction

```typescript
// src/lib/ai-copilot.ts
interface AICopilotContext {
  campaign: Campaign;
  rawDataSummary?: object;
  alerts?: Alert[];
  kpiResults?: object;
}
interface AICopilotResponse {
  message: string;
  suggestions?: string[];
}
// Placeholder: returns mock response
// Future: call OpenAI/Claude with context
```

### Copilot Panel (Campaign Details)

- Chat input
- Message history (mock for now)
- Context: campaign config, KPI summary, alerts
- Example prompts: "Summarize this campaign", "Why is CPA failing?", "Safe to scale?"

---

## 5. Campaign Brief Parser

### Input

Unstructured text: offer terms, KPI defs, caps, payouts, exclusions, fraud rules, tracking params.

### Output

- Extracted fields with confidence (0-1)
- Missing required fields list
- Editable form pre-filled
- Validation before save

### Implementation (MVP)

- Regex + keyword extraction for common patterns
- Pattern examples: "CPA min $12", "excluded: CA, TX", "cap: 10k installs/day"
- Extensible: later swap for LLM API

---

## 6. Alerts Rules Engine

| Rule Type | Condition | Alert |
|-----------|-----------|-------|
| kpi_below_min | actual < threshold | KPI below minimum |
| fraud_above_max | fraud_pct > max | Fraud above tolerated |
| excluded_geo | state in excluded_states | Excluded geo in traffic |
| cap_near_limit | consumption > 80% of cap | Cap near limit |
| zero_conversion | signups = 0, installs > 0 | Zero downstream conversion |
| performance_drop | metric drop > X% vs baseline | Unusual performance drop |

---

## 7. AppsFlyer API Preparation

- `src/lib/appsflyer-api.ts` — interface + stub
- Env: `APPSFLYER_API_KEY`, `APPSFLYER_APP_ID`
- Methods: `fetchReport()`, `syncCampaigns()` — return "not implemented" for MVP

---

## 8. Tech Stack Additions

- **Prisma** — ORM, SQLite for MVP
- **xlsx** — Excel parsing
- **papaparse** — CSV parsing
- **zod** — Validation

---

## 9. Assumptions & Notes

| Item | Assumption |
|------|------------|
| af_prt | AppsFlyer partner/Media Source ID |
| MMP | Mobile Measurement Partner (AppsFlyer, Adjust, etc.) |
| VTA | View-Through Attribution |
| CTA | Click-Through Attribution |
| PO | Partner/Publisher payout |
| KPI baseline | JSON object with metric: value pairs |
| Caps | Stored as separate records (type + value) |
| Multi-OS | Stored as JSON array or comma-separated |
