-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "offer_name" TEXT NOT NULL,
    "af_prt" TEXT,
    "preview_url" TEXT,
    "mmp" TEXT,
    "os" TEXT,
    "excluded_states" TEXT,
    "payout_we_get" REAL,
    "payout_po" REAL,
    "budget" REAL,
    "payable_events" TEXT,
    "vta_enabled" BOOLEAN NOT NULL DEFAULT false,
    "dummy_allowed" BOOLEAN NOT NULL DEFAULT false,
    "ctv_enabled" BOOLEAN NOT NULL DEFAULT false,
    "kpi_baseline" TEXT,
    "vta_lookback_days" INTEGER,
    "cta_min_install" INTEGER,
    "cta_min_click" INTEGER,
    "install_to_signup_min" REAL,
    "fraud_max_pct" REAL,
    "fraud_tool" TEXT,
    "tracking_param_template" TEXT,
    "onelink_template" TEXT,
    "creatives_link" TEXT,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CampaignCap" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campaign_id" TEXT NOT NULL,
    "cap_type" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "unit" TEXT DEFAULT '',
    CONSTRAINT "CampaignCap_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "Campaign" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CampaignKpiRule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campaign_id" TEXT NOT NULL,
    "metric" TEXT NOT NULL,
    "operator" TEXT NOT NULL,
    "threshold_value" REAL NOT NULL,
    "threshold_unit" TEXT,
    CONSTRAINT "CampaignKpiRule_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "Campaign" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RawDataUpload" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campaign_id" TEXT,
    "file_name" TEXT,
    "source_type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "rows_count" INTEGER,
    "raw_text" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RawDataUpload_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "Campaign" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RawDataRow" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "upload_id" TEXT NOT NULL,
    "campaign_id" TEXT,
    "date" TEXT NOT NULL,
    "source" TEXT,
    "campaign_name" TEXT,
    "installs" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "spend" REAL NOT NULL DEFAULT 0,
    "revenue" REAL NOT NULL DEFAULT 0,
    "signups" INTEGER NOT NULL DEFAULT 0,
    "fraud_count" INTEGER NOT NULL DEFAULT 0,
    "extra" TEXT,
    CONSTRAINT "RawDataRow_upload_id_fkey" FOREIGN KEY ("upload_id") REFERENCES "RawDataUpload" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "RawDataRow_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "Campaign" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ColumnMapping" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "appsflyer_column" TEXT NOT NULL,
    "internal_field" TEXT NOT NULL,
    "campaign_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Alert" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campaign_id" TEXT,
    "type" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "metric" TEXT,
    "expected" TEXT,
    "actual" TEXT,
    "details" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Alert_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "Campaign" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
