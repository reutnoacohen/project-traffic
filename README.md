# Traffic Reporter — AppsFlyer Internal Reporting System

Internal traffic reporting system that replaces sending screenshots of AppsFlyer Excel reports with a real web application.

## Quick Start

```bash
# Install dependencies
npm install

# Set up database (SQLite)
# .env already has DATABASE_URL="file:./dev.db"

# Run migrations
npx prisma migrate dev

# Seed sample data (optional)
npx tsx prisma/seed.ts

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## What's Included

### Pages
- **Login** (`/login`) — Demo login (any credentials work)
- **Dashboard** (`/`) — KPI summary, trend charts, recent alerts
- **Campaigns** (`/campaigns`) — List all campaigns, create new
- **Campaign Setup** (`/campaigns/new`) — Full form + AI Brief Parser (paste unstructured text)
- **Campaign Details** (`/campaigns/[id]`) — Overview, KPIs, AI Copilot panel
- **Raw Data** (`/campaigns/[id]/raw-data`) — Upload CSV/Excel or paste data
- **Mapping** (`/campaigns/[id]/mapping`) — Column mapping per campaign
- **KPI Evaluation** (`/campaigns/[id]/kpi`) — Calculated KPIs vs rules
- **Upload Reports** (`/upload`) — Legacy upload (or use per-campaign)
- **Upload History** (`/upload-history`) — List of past uploads
- **Client Report** (`/client-report`) — Filtered client performance
- **Publisher Report** (`/publisher-report`) — Publisher performance
- **Alerts & Anomalies** (`/alerts`) — Alerts from DB with campaign links
- **KPI Targets** (`/settings/kpi`) — Global KPI targets
- **Mapping** (`/settings/mapping`) — Global column mapping

### UI Components
- Sidebar navigation
- KPI summary cards with trend indicators
- Status badges (Completed, Processing, Failed, High, Medium, Low)
- Data tables with hover states
- Line and bar charts (Recharts)
- File upload drop zone
- Filter dropdowns

### Mock Data
All data is static and defined in `src/data/mockData.ts`. No backend or database.

---

## What's Still Mock / Demo Only

| Feature | Status |
|---------|--------|
| Login | No real auth — any credentials work |
| File upload | UI only — files not processed or stored |
| Export buttons | Placeholder — no export functionality |
| KPI Settings save | UI only — changes not persisted |
| Mapping save | UI only — changes not persisted |
| Alerts | Static list — no real threshold detection |
| Date filters | Not connected to data |
| Client/Publisher filters | UI only — data not filtered |

---

## What Needs to Be Built Next

1. **Backend**
   - API routes (Next.js API or separate service)
   - Database (PostgreSQL, etc.) for reports, uploads, users

2. **File Processing**
   - Parse Excel/CSV using xlsx or similar
   - Map columns using mapping config
   - Store processed data

3. **KPI Engine**
   - Calculate KPIs from raw traffic data
   - Compare against targets
   - Generate alerts when thresholds are breached

4. **Authentication**
   - Real login (e.g. NextAuth, Auth0)
   - User roles (Admin, Analyst, Client, Publisher)

5. **Permissions**
   - Restrict Client/Publisher reports by user

6. **AI Insights**
   - Future: Integrate AI for anomaly detection and insights

---

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Recharts** (charts)

---

## Phase 2 Additions (Current)

- **Database**: SQLite + Prisma (Campaign, RawDataRow, Alert, etc.)
- **Campaign Setup Form**: All required fields (af_prt, payout, caps, KPI rules, etc.)
- **AI Brief Parser**: Paste unstructured text → extracted fields with confidence
- **Raw Data Ingestion**: Upload CSV/Excel or paste tab/comma-separated data
- **KPI Engine**: Computes CTI, ITS, CPA, ROAS, fraud % from raw data
- **Alerts API**: Fetches from DB, links to campaigns
- **AI Copilot**: Placeholder service with mock responses (summarize, scale, KPI)
- **AppsFlyer API**: Stub for future integration

---

## Project Structure

```
src/
├── app/
│   ├── (dashboard)/
│   │   ├── page.tsx
│   │   ├── campaigns/          # NEW: campaign list, new, [id]
│   │   │   ├── [id]/raw-data/
│   │   │   ├── [id]/mapping/
│   │   │   └── [id]/kpi/
│   │   ├── upload/, alerts/, settings/
│   │   └── ...
│   └── login/
├── app/api/
│   ├── campaigns/              # NEW: CRUD, parse-brief, raw-data, kpi, copilot
│   ├── alerts/                 # NEW
│   └── upload/parse/           # NEW: parse CSV/Excel
├── components/
│   ├── CampaignSetupForm.tsx   # NEW
│   ├── BriefParserPanel.tsx    # NEW
│   └── AICopilotPanel.tsx      # NEW
├── lib/
│   ├── db.ts
│   ├── campaign-brief-parser.ts  # NEW
│   ├── ai-copilot.ts            # NEW (placeholder)
│   └── appsflyer-api.ts         # NEW (stub)
└── data/mockData.ts
```
