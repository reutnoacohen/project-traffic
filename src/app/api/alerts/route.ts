import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const severity = searchParams.get("severity");
  const campaignId = searchParams.get("campaignId");

  const where: { severity?: string; campaignId?: string } = {};
  if (severity && severity !== "all") where.severity = severity;
  if (campaignId) where.campaignId = campaignId;

  const alerts = await prisma.alert.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      campaign: { select: { id: true, offerName: true } },
    },
  });
  return NextResponse.json(alerts);
}
