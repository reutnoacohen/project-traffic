// Mock data for Traffic Reporting System prototype

export interface KPISummary {
  label: string;
  value: string;
  change: number;
  target?: string;
  status: "success" | "warning" | "error" | "neutral";
}

export interface TrafficRow {
  date: string;
  source: string;
  installs: number;
  spend: number;
  cpa: number;
  roas: number;
  retentionD1: number;
  retentionD7: number;
}

export interface UploadRecord {
  id: string;
  fileName: string;
  date: string;
  status: "completed" | "processing" | "failed";
  rowsProcessed?: number;
}

export interface Alert {
  id: string;
  date: string;
  metric: string;
  expected: string;
  actual: string;
  severity: "high" | "medium" | "low";
  source?: string;
}

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

// KPI Summary for dashboard
export const kpiSummary: KPISummary[] = [
  { label: "Install Rate", value: "4.2%", change: 2.3, target: "4.0%", status: "success" },
  { label: "CPA", value: "$12.40", change: -5.1, target: "$13.00", status: "success" },
  { label: "ROAS", value: "2.8x", change: 12.4, target: "2.5x", status: "success" },
  { label: "Retention D1", value: "38%", change: -1.2, target: "40%", status: "warning" },
  { label: "Retention D7", value: "22%", change: 0.8, target: "22%", status: "success" },
  { label: "LTV", value: "$34.20", change: 3.1, target: "$32.00", status: "success" },
];

// Traffic data for tables
export const trafficData: TrafficRow[] = [
  { date: "2025-03-20", source: "Google Ads", installs: 12500, spend: 155000, cpa: 12.4, roas: 2.8, retentionD1: 39, retentionD7: 23 },
  { date: "2025-03-20", source: "Meta Ads", installs: 8200, spend: 98400, cpa: 12.0, roas: 2.9, retentionD1: 38, retentionD7: 21 },
  { date: "2025-03-20", source: "TikTok Ads", installs: 5600, spend: 67200, cpa: 12.0, roas: 2.7, retentionD1: 35, retentionD7: 19 },
  { date: "2025-03-21", source: "Google Ads", installs: 13100, spend: 162440, cpa: 12.4, roas: 2.9, retentionD1: 40, retentionD7: 24 },
  { date: "2025-03-21", source: "Meta Ads", installs: 7800, spend: 93600, cpa: 12.0, roas: 2.8, retentionD1: 37, retentionD7: 20 },
  { date: "2025-03-21", source: "TikTok Ads", installs: 6100, spend: 73200, cpa: 12.0, roas: 2.6, retentionD1: 36, retentionD7: 18 },
  { date: "2025-03-22", source: "Google Ads", installs: 11800, spend: 146320, cpa: 12.4, roas: 2.7, retentionD1: 38, retentionD7: 22 },
  { date: "2025-03-22", source: "Meta Ads", installs: 8900, spend: 106800, cpa: 12.0, roas: 3.0, retentionD1: 39, retentionD7: 21 },
  { date: "2025-03-22", source: "Unity Ads", installs: 2100, spend: 25200, cpa: 12.0, roas: 2.2, retentionD1: 32, retentionD7: 16 },
];

// Chart data
export const installsTrendData: ChartDataPoint[] = [
  { date: "Mar 16", value: 24500 },
  { date: "Mar 17", value: 26100 },
  { date: "Mar 18", value: 23800 },
  { date: "Mar 19", value: 27200 },
  { date: "Mar 20", value: 26300 },
  { date: "Mar 21", value: 27000 },
  { date: "Mar 22", value: 22800 },
  { date: "Mar 23", value: 25100 },
];

export const spendTrendData: ChartDataPoint[] = [
  { date: "Mar 16", value: 294000 },
  { date: "Mar 17", value: 313200 },
  { date: "Mar 18", value: 285600 },
  { date: "Mar 19", value: 326400 },
  { date: "Mar 20", value: 320600 },
  { date: "Mar 21", value: 329240 },
  { date: "Mar 22", value: 278320 },
  { date: "Mar 23", value: 301320 },
];

export const sourcePerformanceData = [
  { name: "Google Ads", installs: 37400, fill: "#3b82f6" },
  { name: "Meta Ads", installs: 24900, fill: "#6366f1" },
  { name: "TikTok Ads", installs: 11700, fill: "#8b5cf6" },
  { name: "Unity Ads", installs: 2100, fill: "#a855f7" },
];

// Upload history
export const uploadHistory: UploadRecord[] = [
  { id: "1", fileName: "appsflyer_report_mar20.xlsx", date: "2025-03-20 14:32", status: "completed", rowsProcessed: 45230 },
  { id: "2", fileName: "organic_raw_data_mar19.csv", date: "2025-03-19 09:15", status: "completed", rowsProcessed: 12800 },
  { id: "3", fileName: "paid_traffic_mar18.xlsx", date: "2025-03-18 16:45", status: "completed", rowsProcessed: 38100 },
  { id: "4", fileName: "combined_report.xlsx", date: "2025-03-17 11:20", status: "processing" },
  { id: "5", fileName: "corrupt_file.csv", date: "2025-03-16 08:00", status: "failed" },
];

// Alerts
export const alerts: Alert[] = [
  { id: "1", date: "2025-03-23 09:00", metric: "CPA", expected: "$12.00", actual: "$14.20", severity: "high", source: "TikTok Ads" },
  { id: "2", date: "2025-03-23 08:30", metric: "Retention D1", expected: "40%", actual: "34%", severity: "medium", source: "Unity Ads" },
  { id: "3", date: "2025-03-22 18:00", metric: "ROAS", expected: "2.5x", actual: "2.1x", severity: "medium", source: "Google Ads" },
  { id: "4", date: "2025-03-22 14:00", metric: "Install Volume", expected: "25k", actual: "18k", severity: "low" },
  { id: "5", date: "2025-03-21 12:00", metric: "Spend", expected: "$300k", actual: "$329k", severity: "low" },
];

// Client data for client report
export const clientReportData = [
  { client: "Acme Corp", installs: 15200, spend: 188400, cpa: 12.4, roas: 2.9 },
  { client: "TechStart Inc", installs: 8400, spend: 100800, cpa: 12.0, roas: 2.7 },
  { client: "Global Media", installs: 21900, spend: 262800, cpa: 12.0, roas: 2.8 },
];

// Publisher data for publisher report
export const publisherReportData = [
  { publisher: "Google Ads", installs: 37400, spend: 463760, cpa: 12.4, roas: 2.8, retentionD1: 39 },
  { publisher: "Meta Ads", installs: 24900, spend: 298800, cpa: 12.0, roas: 2.9, retentionD1: 38 },
  { publisher: "TikTok Ads", installs: 11700, spend: 140400, cpa: 12.0, roas: 2.65, retentionD1: 35 },
  { publisher: "Unity Ads", installs: 2100, spend: 25200, cpa: 12.0, roas: 2.2, retentionD1: 32 },
];

// KPI targets for settings
export const kpiTargets = [
  { metric: "Install Rate", target: "4.0%", threshold: "3.5%", unit: "%" },
  { metric: "CPA", target: "$13.00", threshold: "$15.00", unit: "$" },
  { metric: "ROAS", target: "2.5x", threshold: "2.0x", unit: "x" },
  { metric: "Retention D1", target: "40%", threshold: "35%", unit: "%" },
  { metric: "Retention D7", target: "22%", threshold: "18%", unit: "%" },
  { metric: "LTV", target: "$32.00", threshold: "$28.00", unit: "$" },
];

// Mapping config
export const mappingConfig = [
  { appsflyerColumn: "Install Time", mappedTo: "date", status: "mapped" },
  { appsflyerColumn: "Media Source", mappedTo: "source", status: "mapped" },
  { appsflyerColumn: "Campaign", mappedTo: "campaign", status: "mapped" },
  { appsflyerColumn: "Cost", mappedTo: "spend", status: "mapped" },
  { appsflyerColumn: "D1 Retention", mappedTo: "retention_d1", status: "mapped" },
  { appsflyerColumn: "Revenue", mappedTo: "revenue", status: "pending" },
];
