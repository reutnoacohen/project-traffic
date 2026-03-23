/**
 * AppsFlyer API - Placeholder for future integration.
 * MVP: Upload-based ingestion only.
 */

export interface AppsFlyerReportConfig {
  appId: string;
  reportType: string;
  dateFrom: string;
  dateTo: string;
}

export interface AppsFlyerReportRow {
  [key: string]: string | number;
}

/**
 * Fetch report from AppsFlyer API.
 * NOT IMPLEMENTED for MVP - returns error.
 */
export async function fetchAppsFlyerReport(
  _config: AppsFlyerReportConfig
): Promise<AppsFlyerReportRow[]> {
  throw new Error(
    "AppsFlyer API integration is not yet implemented. Use file upload for now."
  );
}

/**
 * Sync campaign data from AppsFlyer.
 * NOT IMPLEMENTED for MVP.
 */
export async function syncCampaignsFromAppsFlyer(): Promise<void> {
  throw new Error(
    "AppsFlyer API sync is not yet implemented. Create campaigns manually."
  );
}
