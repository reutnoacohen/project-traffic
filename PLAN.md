# Traffic Reporting System — Product & Visual Planning

## STEP 1 — PRODUCT + VISUAL PLANNING

---

## 1. App Pages Overview

| Page | Purpose |
|------|---------|
| **Login** | Authentication (placeholder for future backend) |
| **Main Dashboard** | KPI overview, quick insights, traffic health snapshot |
| **Upload Reports** | Drag-and-drop or file picker for Excel/CSV upload |
| **Upload History** | List of past uploads with status, date, file names |
| **Client Report** | Filtered view for clients—traffic, KPIs, trends |
| **Publisher Report** | Filtered view for publishers—performance by source |
| **Alerts & Anomalies** | Warnings, anomalies, threshold breaches |
| **KPI Targets/Settings** | Configure KPI goals, targets, thresholds |
| **Mapping/Settings** | Column mapping, data source config, integrations |

---

## 2. Main User Roles

| Role | Access |
|------|--------|
| **Admin** | Full access—uploads, settings, all reports, mapping |
| **Analyst** | Dashboard, reports, upload, view alerts |
| **Client** | Client report view only (filtered) |
| **Publisher** | Publisher report view only (filtered) |

---

## 3. User Flow

```
Login → Main Dashboard
         ├── Upload Reports → Upload History
         ├── Client Report (filter by client)
         ├── Publisher Report (filter by publisher)
         ├── Alerts & Anomalies
         └── Settings
              ├── KPI Targets
              └── Mapping
```

**Primary flows:**
1. **Upload flow:** Login → Upload Reports → Select file → Process → Upload History
2. **Report flow:** Login → Dashboard → Client/Publisher Report → Filter → Export
3. **Alert flow:** Login → Alerts → Review anomalies → Drill down

---

## 4. Dashboard Sections

| Section | Content |
|---------|---------|
| **KPI Summary Cards** | Install rate, CPA, ROAS, Retention D1/D7, LTV |
| **Traffic Overview** | Total installs, spend, impressions by period |
| **Top Sources Table** | Best/worst publishers by KPI |
| **Trend Charts** | Line/bar charts for installs, spend, CPA over time |
| **Recent Alerts** | Latest 5 anomalies with status badges |
| **Quick Actions** | Upload report, View alerts, Settings |

---

## 5. Tables, Cards & Charts

| Component | Purpose |
|-----------|---------|
| **KPI Cards** | Single metric + trend arrow + comparison to target |
| **Traffic Table** | Date, Source, Installs, Spend, CPA, ROAS, Retention |
| **Publisher Ranking** | Sortable by any KPI |
| **Client Summary** | Per-client aggregated KPIs |
| **Line Chart** | Trend over time (installs, spend, CPA) |
| **Bar Chart** | Compare sources/campaigns |
| **Status Badges** | Success, Warning, Error, Pending |
| **Anomaly List** | Date, metric, expected vs actual, severity |

---

## 6. Navigation / Sidebar

```
┌─────────────────────────┐
│  Traffic Reporter       │
├─────────────────────────┤
│  Dashboard              │
│  Upload Reports         │
│  Upload History         │
├─────────────────────────┤
│  Reports                │
│  ├─ Client Report       │
│  └─ Publisher Report    │
├─────────────────────────┤
│  Alerts & Anomalies     │
├─────────────────────────┤
│  Settings               │
│  ├─ KPI Targets         │
│  └─ Mapping             │
└─────────────────────────┘
```

---

## 7. Visual Hierarchy

- **Primary:** Main metrics, alerts, main actions
- **Secondary:** Tables, filters, date range
- **Tertiary:** Settings, help, footer

**Color system:**
- Success: green
- Warning: amber
- Error: red
- Neutral: slate/gray
- Accent: blue/indigo for primary actions

---

## 8. Component List

| Component | Reusable |
|-----------|----------|
| `Sidebar` | Yes |
| `Header` | Yes |
| `KPICard` | Yes |
| `DataTable` | Yes |
| `LineChart` | Yes |
| `BarChart` | Yes |
| `StatusBadge` | Yes |
| `FilterBar` | Yes |
| `FileUpload` | Yes |
| `DateRangePicker` | Yes |
| `AnomalyCard` | Yes |

---

## 9. UX Recommendations

**Upload:**
- Drag-and-drop zone
- Supported formats: XLSX, CSV
- Progress indicator
- Success/error toast

**Reporting:**
- Date range filter
- Client/Publisher dropdown
- Export button (placeholder)
- Pagination for large tables

**Alerts:**
- Severity filter (All, High, Medium, Low)
- Date filter
- Click to drill down

---

## 10. Tech Stack (Frontend Prototype)

- **Next.js** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Mock data** (JSON/constants)
- **Recharts** or **Chart.js** for charts (lightweight)

---

## Next: STEP 2 — Frontend Prototype

See the implemented Next.js app in `/app` and `/components`.
