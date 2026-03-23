import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const uploads = await prisma.rawDataUpload.findMany({
    where: { campaignId: id },
    orderBy: { createdAt: "desc" },
    include: {
      rawDataRows: { take: 500 },
    },
  });
  return NextResponse.json(uploads);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { sourceType, fileName, rawText, rows } = body;

  const upload = await prisma.rawDataUpload.create({
    data: {
      campaignId: id,
      fileName: fileName ?? null,
      sourceType: sourceType ?? "manual",
      status: "processing",
    },
  });

  if (rows && Array.isArray(rows) && rows.length > 0) {
    await prisma.rawDataRow.createMany({
      data: rows.map((r: Record<string, unknown>) => ({
        uploadId: upload.id,
        campaignId: id,
        date: String(r.date ?? ""),
        source: r.source ? String(r.source) : null,
        campaignName: r.campaignName ? String(r.campaignName) : null,
        installs: Number(r.installs ?? 0),
        clicks: Number(r.clicks ?? 0),
        spend: Number(r.spend ?? 0),
        revenue: Number(r.revenue ?? 0),
        signups: Number(r.signups ?? 0),
        fraudCount: Number(r.fraudCount ?? r.fraud_count ?? 0),
      })),
    });
  }

  await prisma.rawDataUpload.update({
    where: { id: upload.id },
    data: {
      status: "completed",
      rowsCount: rows?.length ?? 0,
      rawText: rawText ?? null,
    },
  });

  return NextResponse.json(upload);
}
