import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const createCampaignSchema = z.object({
  offerName: z.string().min(1),
  afPrt: z.string().optional(),
  previewUrl: z.string().optional(),
  mmp: z.string().optional(),
  os: z.string().optional(),
  excludedStates: z.string().optional(),
  payoutWeGet: z.number().optional(),
  payoutPo: z.number().optional(),
  budget: z.number().optional(),
  payableEvents: z.string().optional(),
  vtaEnabled: z.boolean().optional(),
  dummyAllowed: z.boolean().optional(),
  ctvEnabled: z.boolean().optional(),
  kpiBaseline: z.string().optional(),
  vtaLookbackDays: z.number().optional(),
  ctaMinInstall: z.number().optional(),
  ctaMinClick: z.number().optional(),
  installToSignupMin: z.number().optional(),
  fraudMaxPct: z.number().optional(),
  fraudTool: z.string().optional(),
  trackingParamTemplate: z.string().optional(),
  onelinkTemplate: z.string().optional(),
  creativesLink: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(["draft", "active", "paused"]).optional(),
  caps: z.array(z.object({ capType: z.string(), value: z.number(), unit: z.string().optional() })).optional(),
  kpiRules: z.array(z.object({
    metric: z.string(),
    operator: z.enum(["min", "max"]),
    thresholdValue: z.number(),
    thresholdUnit: z.string().optional(),
  })).optional(),
});

export async function GET() {
  const campaigns = await prisma.campaign.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      caps: true,
      kpiRules: true,
    },
  });
  const withCounts = await Promise.all(
    campaigns.map(async (c) => {
      const [rawCount, alertCount] = await Promise.all([
        prisma.rawDataRow.count({ where: { campaignId: c.id } }),
        prisma.alert.count({ where: { campaignId: c.id } }),
      ]);
      return { ...c, _count: { rawDataRows: rawCount, alerts: alertCount } };
    })
  );
  return NextResponse.json(withCounts);
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = createCampaignSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const { caps, kpiRules, ...data } = parsed.data;
  const campaign = await prisma.campaign.create({
    data: {
      ...data,
      caps: caps?.length
        ? { create: caps.map((c) => ({ capType: c.capType, value: c.value, unit: c.unit ?? "" })) }
        : undefined,
      kpiRules: kpiRules?.length
        ? { create: kpiRules }
        : undefined,
    },
    include: { caps: true, kpiRules: true },
  });
  return NextResponse.json(campaign);
}
