import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const updateSchema = z.object({
  offerName: z.string().min(1).optional(),
  afPrt: z.string().optional().nullable(),
  previewUrl: z.string().optional().nullable(),
  mmp: z.string().optional().nullable(),
  os: z.string().optional().nullable(),
  excludedStates: z.string().optional().nullable(),
  payoutWeGet: z.number().optional().nullable(),
  payoutPo: z.number().optional().nullable(),
  budget: z.number().optional().nullable(),
  payableEvents: z.string().optional().nullable(),
  vtaEnabled: z.boolean().optional(),
  dummyAllowed: z.boolean().optional(),
  ctvEnabled: z.boolean().optional(),
  kpiBaseline: z.string().optional().nullable(),
  vtaLookbackDays: z.number().optional().nullable(),
  ctaMinInstall: z.number().optional().nullable(),
  ctaMinClick: z.number().optional().nullable(),
  installToSignupMin: z.number().optional().nullable(),
  fraudMaxPct: z.number().optional().nullable(),
  fraudTool: z.string().optional().nullable(),
  trackingParamTemplate: z.string().optional().nullable(),
  onelinkTemplate: z.string().optional().nullable(),
  creativesLink: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  status: z.enum(["draft", "active", "paused"]).optional(),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const campaign = await prisma.campaign.findUnique({
    where: { id },
    include: {
      caps: true,
      kpiRules: true,
      rawDataRows: { take: 100, orderBy: { date: "desc" } },
      alerts: { orderBy: { createdAt: "desc" }, take: 20 },
    },
  });
  if (!campaign) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  }
  return NextResponse.json(campaign);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const campaign = await prisma.campaign.update({
    where: { id },
    data: parsed.data,
    include: { caps: true, kpiRules: true },
  });
  return NextResponse.json(campaign);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.campaign.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
