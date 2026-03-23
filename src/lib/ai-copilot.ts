/**
 * AI Copilot Service - Placeholder / Abstraction
 * Future: Integrate with OpenAI, Claude, or internal LLM.
 */

import type { Campaign, Alert } from "@prisma/client";
import { escapeHtml } from "./sanitize";

export interface AICopilotContext {
  campaign: Campaign;
  alerts?: Alert[];
  rawDataSummary?: {
    totalInstalls: number;
    totalSpend: number;
    totalSignups: number;
    dateRange: string;
  };
  kpiResults?: Record<string, { actual: number; target: number; pass: boolean }>;
}

export interface AICopilotMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AICopilotResponse {
  message: string;
  suggestions?: string[];
}

/**
 * Placeholder: Returns mock response based on context.
 * Replace with actual AI API call when ready.
 */
export async function getAICopilotResponse(
  userMessage: string,
  context: AICopilotContext
): Promise<AICopilotResponse> {
  // Simulate API delay
  await new Promise((r) => setTimeout(r, 500));

  const lower = userMessage.toLowerCase();

  // Mock responses based on common queries
  if (lower.includes("summarize") || lower.includes("summary")) {
    return {
      message: `**Campaign Summary: ${escapeHtml(context.campaign.offerName)}**\n\n` +
        `Status: ${escapeHtml(context.campaign.status)}\n` +
        `Payout: $${context.campaign.payoutWeGet ?? "—"}\n` +
        `Budget: ${context.campaign.budget ? `$${context.campaign.budget}` : "—"}\n` +
        (context.rawDataSummary
          ? `\nPerformance: ${context.rawDataSummary.totalInstalls.toLocaleString()} installs, $${context.rawDataSummary.totalSpend.toLocaleString()} spend`
          : "\nNo raw data linked yet."),
    };
  }

  if (lower.includes("scale") || lower.includes("safe")) {
    const hasAlerts = (context.alerts?.length ?? 0) > 0;
    return {
      message: hasAlerts
        ? `⚠️ **Not recommended to scale yet.** There are ${context.alerts?.length ?? 0} active alert(s). Review the Alerts tab and address KPI/threshold issues before scaling.`
        : `✅ **Campaign appears safe to scale.** No critical alerts. Ensure you have sufficient budget and cap headroom.`,
    };
  }

  if (lower.includes("kpi") && lower.includes("fail")) {
    const failing = context.kpiResults
      ? Object.entries(context.kpiResults).filter(([, r]) => !r.pass)
      : [];
    return {
      message: failing.length
        ? `**Failing KPIs:**\n${failing.map(([k, r]) => `- ${escapeHtml(k)}: actual ${r.actual} vs target ${r.target}`).join("\n")}`
        : `No failing KPIs detected. All metrics are within target.`,
    };
  }

  if (lower.includes("cap")) {
    return {
      message: "Cap status: Run the KPI Evaluation to see cap consumption. Caps are defined in Campaign Setup.",
    };
  }

  if (lower.includes("client") && lower.includes("summary")) {
    return {
      message: `**Client-friendly summary (draft):**\nCampaign "${escapeHtml(context.campaign.offerName)}" is ${escapeHtml(context.campaign.status)}. ` +
        (context.rawDataSummary
          ? `Delivered ${context.rawDataSummary.totalInstalls.toLocaleString()} installs with $${context.rawDataSummary.totalSpend.toLocaleString()} spend.`
          : "Awaiting performance data."),
    };
  }

  // Default
  return {
    message: `I can help you with: summarizing the campaign, checking if it's safe to scale, identifying failing KPIs, cap status, and creating client-friendly summaries. Try asking one of those questions.`,
    suggestions: [
      "Summarize this campaign",
      "Is it safe to scale?",
      "Which KPI is failing?",
      "Explain cap status",
    ],
  };
}
