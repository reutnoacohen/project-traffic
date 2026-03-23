import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAICopilotResponse } from "@/lib/ai-copilot";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { message } = await request.json();
  if (!message || typeof message !== "string") {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  const campaign = await prisma.campaign.findUnique({
    where: { id },
    include: {
      alerts: { orderBy: { createdAt: "desc" }, take: 10 },
      rawDataRows: true,
    },
  });
  if (!campaign) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  }

  const rows = campaign.rawDataRows;
  const totalInstalls = rows.reduce((s, r) => s + r.installs, 0);
  const totalSpend = rows.reduce((s, r) => s + r.spend, 0);
  const totalSignups = rows.reduce((s, r) => s + r.signups, 0);
  const dates = rows.map((r) => r.date).filter(Boolean) as string[];
  const sorted = [...dates].sort();
  const dateRange = sorted.length > 0 ? `${sorted[0]} to ${sorted[sorted.length - 1]}` : "N/A";

  const response = await getAICopilotResponse(message, {
    campaign,
    alerts: campaign.alerts,
    rawDataSummary:
      rows.length > 0
        ? {
            totalInstalls,
            totalSpend,
            totalSignups,
            dateRange,
          }
        : undefined,
  });

  return NextResponse.json(response);
}
