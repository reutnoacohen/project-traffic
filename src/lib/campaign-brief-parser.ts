/**
 * AI-Assisted Campaign Brief Parser
 * Extracts structured fields from unstructured campaign text.
 * MVP: Regex + keyword extraction. Future: Swap for LLM API.
 */

export interface ExtractedField {
  key: string;
  value: string | number | boolean | string[];
  confidence: number; // 0-1
  rawMatch?: string;
}

export interface ParserResult {
  extracted: ExtractedField[];
  missingRequired: string[];
  suggestions: string[];
}

const REQUIRED_FIELDS = ["offer_name"];

// Patterns for common field extractions
const PATTERNS: Array<{
  key: string;
  regex: RegExp;
  transform?: (m: RegExpMatchArray) => string | number | boolean | string[];
  confidence: number;
}> = [
  { key: "offer_name", regex: /offer[:\s]+([^\n,]+)/i, confidence: 0.9 },
  { key: "af_prt", regex: /af[_\s]?prt[:\s]+([a-zA-Z0-9_-]+)/i, confidence: 0.95 },
  { key: "af_prt", regex: /partner[:\s]+([a-zA-Z0-9_-]+)/i, confidence: 0.8 },
  { key: "preview_url", regex: /preview[:\s]+(https?:\/\/[^\s\n]+)/i, confidence: 0.9 },
  { key: "mmp", regex: /mmp[:\s]+(appsflyer|adjust|branch|kochava)/i, transform: (m) => m[1].toLowerCase(), confidence: 0.9 },
  { key: "os", regex: /(?:os|platform)[:\s]+(?:iOS|Android|ios|android)(?:\s*(?:,|and)\s*(?:iOS|Android|ios|android))?/i, transform: (m) => m[0].split(/[,&]|\s+and\s+/i).map((s) => s.replace(/^[^:]+:\s*/i, "").trim()), confidence: 0.85 },
  { key: "excluded_states", regex: /excluded[:\s]+([A-Za-z,\s]+?)(?=\n|$|cap|payout|budget)/i, transform: (m) => m[1].split(",").map((s) => s.trim()).filter(Boolean), confidence: 0.85 },
  { key: "excluded_states", regex: /(?:no|exclude)\s+(?:traffic\s+from\s+)?([A-Z]{2}(?:\s*,\s*[A-Z]{2})*)/i, transform: (m) => m[1].split(",").map((s) => s.trim()), confidence: 0.8 },
  { key: "payout_we_get", regex: /payout[:\s]+\$?([\d.]+)/i, transform: (m) => parseFloat(m[1]), confidence: 0.9 },
  { key: "payout_we_get", regex: /we\s+get[:\s]+\$?([\d.]+)/i, transform: (m) => parseFloat(m[1]), confidence: 0.85 },
  { key: "payout_po", regex: /(?:po|publisher)\s+payout[:\s]+\$?([\d.]+)/i, transform: (m) => parseFloat(m[1]), confidence: 0.85 },
  { key: "budget", regex: /budget[:\s]+\$?([\d,]+(?:\.[\d]+)?)/i, transform: (m) => parseFloat(m[1].replace(/,/g, "")), confidence: 0.9 },
  { key: "vta_enabled", regex: /vta\s+(?:enabled|on|yes)/i, transform: () => true, confidence: 0.9 },
  { key: "vta_enabled", regex: /vta\s+disabled/i, transform: () => false, confidence: 0.9 },
  { key: "dummy_allowed", regex: /dummy\s+(?:allowed|on|yes)/i, transform: () => true, confidence: 0.9 },
  { key: "ctv_enabled", regex: /ctv\s+(?:enabled|on|yes)/i, transform: () => true, confidence: 0.9 },
  { key: "vta_lookback_days", regex: /vta\s+lookback[:\s]+(\d+)/i, transform: (m) => parseInt(m[1], 10), confidence: 0.9 },
  { key: "cta_min_install", regex: /cta\s+min\s+(?:install|installs)[:\s]+(\d+)/i, transform: (m) => parseInt(m[1], 10), confidence: 0.85 },
  { key: "cta_min_click", regex: /cta\s+min\s+(?:click|clicks)[:\s]+(\d+)/i, transform: (m) => parseInt(m[1], 10), confidence: 0.85 },
  { key: "install_to_signup_min", regex: /(?:install.to.signup|its)[:\s]+(\d+(?:\.\d+)?)\s*%?/i, transform: (m) => parseFloat(m[1]), confidence: 0.9 },
  { key: "fraud_max_pct", regex: /fraud[:\s]+(?:max\s+)?(\d+(?:\.\d+)?)\s*%?/i, transform: (m) => parseFloat(m[1]), confidence: 0.85 },
  { key: "fraud_tool", regex: /fraud\s+tool[:\s]+([^\n,]+)/i, confidence: 0.85 },
  // Caps
  { key: "cap_impressions_daily", regex: /(?:daily\s+)?(?:impressions?\s+)?cap[:\s]+(\d+(?:,\d+)*)/i, transform: (m) => parseInt(m[1].replace(/,/g, ""), 10), confidence: 0.85 },
  { key: "cap_clicks_daily", regex: /(?:daily\s+)?(?:click\s+)?cap[:\s]+(\d+(?:,\d+)*)/i, transform: (m) => parseInt(m[1].replace(/,/g, ""), 10), confidence: 0.8 },
  { key: "cap_installs_daily", regex: /(?:daily\s+)?(?:install\s+)?cap[:\s]+(\d+(?:,\d+)*)/i, transform: (m) => parseInt(m[1].replace(/,/g, ""), 10), confidence: 0.85 },
  { key: "cap_spend_daily", regex: /(?:daily\s+)?(?:spend\s+)?cap[:\s]+\$?([\d,]+)/i, transform: (m) => parseFloat(m[1].replace(/,/g, "")), confidence: 0.85 },
  // KPI rules
  { key: "cti_min", regex: /(?:cti|click.to.install)[:\s]+(\d+(?:\.\d+)?)\s*%?/i, transform: (m) => parseFloat(m[1]), confidence: 0.85 },
  { key: "cpa_max", regex: /cpa[:\s]+(?:max\s+)?\$?([\d.]+)/i, transform: (m) => parseFloat(m[1]), confidence: 0.9 },
  { key: "roas_min", regex: /roas[:\s]+(?:min\s+)?([\d.]+)x?/i, transform: (m) => parseFloat(m[1]), confidence: 0.9 },
  { key: "retention_d1_min", regex: /(?:retention\s+d1|d1)[:\s]+(\d+(?:\.\d+)?)\s*%?/i, transform: (m) => parseFloat(m[1]), confidence: 0.85 },
];

export function parseCampaignBrief(text: string): ParserResult {
  const extracted: ExtractedField[] = [];
  const seen = new Set<string>();

  for (const { key, regex, transform, confidence } of PATTERNS) {
    const m = text.match(regex);
    if (m && !seen.has(key)) {
      const value = transform ? transform(m) : m[1]?.trim() ?? "";
      if (value !== undefined && value !== "") {
        extracted.push({
          key,
          value,
          confidence,
          rawMatch: m[0],
        });
        seen.add(key);
      }
    }
  }

  const missingRequired = REQUIRED_FIELDS.filter(
    (f) => !extracted.some((e) => e.key === f)
  );

  const suggestions: string[] = [];
  if (missingRequired.includes("offer_name")) {
    suggestions.push("Add offer name, e.g. 'Offer: My App Install Campaign'");
  }
  if (!extracted.some((e) => e.key === "payout_we_get" || e.key === "payout_po")) {
    suggestions.push("Add payout info, e.g. 'Payout: $12' or 'PO payout: $10'");
  }
  if (!extracted.some((e) => e.key.startsWith("cap_"))) {
    suggestions.push("Add caps if applicable, e.g. 'Daily install cap: 10000'");
  }

  return {
    extracted,
    missingRequired,
    suggestions,
  };
}

/**
 * Map parser output to campaign form fields
 */
export function mapToCampaignForm(extracted: ExtractedField[]): Record<string, unknown> {
  const form: Record<string, unknown> = {};
  const caps: Array<{ capType: string; value: number }> = [];

  for (const e of extracted) {
    if (e.key.startsWith("cap_")) {
      const type = e.key.replace("cap_", "");
      caps.push({ capType: `${type}_daily`, value: e.value as number });
    } else if (e.key === "cti_min" || e.key === "cpa_max" || e.key === "roas_min" || e.key === "retention_d1_min") {
      // KPI rules - map to kpiRules array
      const metricMap: Record<string, string> = {
        cti_min: "cti",
        cpa_max: "cpa",
        roas_min: "roas",
        retention_d1_min: "retention_d1",
      };
      const metric = metricMap[e.key];
      const op = e.key.includes("_min") ? "min" : "max";
      if (!form.kpiRules) form.kpiRules = [];
      (form.kpiRules as Array<{ metric: string; operator: string; thresholdValue: number }>).push({
        metric,
        operator: op,
        thresholdValue: e.value as number,
      });
    } else {
      form[e.key] = e.value;
    }
  }
  if (caps.length) form.caps = caps;
  return form;
}
