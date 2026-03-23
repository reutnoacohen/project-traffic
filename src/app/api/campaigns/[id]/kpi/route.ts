import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * Calculate KPIs from raw data and compare to campaign rules.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const campaign = await prisma.campaign.findUnique({
    where: { id },
    include: { kpiRules: true, rawDataRows: true },
  });
  if (!campaign) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  }

  const rows = campaign.rawDataRows;
  const totalInstalls = rows.reduce((s, r) => s + r.installs, 0);
  const totalClicks = rows.reduce((s, r) => s + r.clicks, 0);
  const totalSpend = rows.reduce((s, r) => s + r.spend, 0);
  const totalRevenue = rows.reduce((s, r) => s + r.revenue, 0);
  const totalSignups = rows.reduce((s, r) => s + r.signups, 0);
  const totalFraud = rows.reduce((s, r) => s + r.fraudCount, 0);

  const cti = totalClicks > 0 ? (totalInstalls / totalClicks) * 100 : 0;
  const its = totalInstalls > 0 ? (totalSignups / totalInstalls) * 100 : 0;
  const cpa = totalSignups > 0 ? totalSpend / totalSignups : 0;
  const roas = totalSpend > 0 ? totalRevenue / totalSpend : 0;
  const fraudPct = totalInstalls > 0 ? (totalFraud / totalInstalls) * 100 : 0;

  const metrics = {
    cti: { actual: cti, unit: "%", label: "Click-to-Install Rate" },
    its: { actual: its, unit: "%", label: "Install-to-Signup Rate" },
    cpa: { actual: cpa, unit: "$", label: "CPA" },
    roas: { actual: roas, unit: "x", label: "ROAS" },
    fraud_pct: { actual: fraudPct, unit: "%", label: "Fraud %" },
  };

  const results: Array<{
    metric: string;
    label: string;
    actual: number;
    target: number;
    operator: string;
    pass: boolean;
  }> = [];

  for (const rule of campaign.kpiRules) {
    const m = (metrics as Record<string, { actual: number; unit: string; label: string }>)[rule.metric] ?? { actual: 0, unit: "", label: rule.metric };
    const actual = m.actual;
    const target = rule.thresholdValue;
    const pass =
      rule.operator === "min" ? actual >= target : actual <= target;
    results.push({
      metric: rule.metric,
      label: m.label,
      actual,
      target,
      operator: rule.operator,
      pass,
    });
  }

  return NextResponse.json({
    summary: {
      totalInstalls,
      totalClicks,
      totalSpend,
      totalRevenue,
      totalSignups,
      totalFraud,
    },
    computed: metrics,
    evaluation: results,
  });
}
