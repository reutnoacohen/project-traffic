import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.campaign.findFirst({ where: { offerName: "Demo App Install Campaign" } });
  if (existing) {
    console.log("Seed already run. Skipping.");
    return;
  }

  const campaign = await prisma.campaign.create({
    data: {
      offerName: "Demo App Install Campaign",
      afPrt: "demo_partner",
      mmp: "AppsFlyer",
      os: JSON.stringify(["iOS", "Android"]),
      excludedStates: JSON.stringify(["CA", "TX"]),
      payoutWeGet: 12,
      payoutPo: 10,
      budget: 50000,
      vtaEnabled: true,
      installToSignupMin: 35,
      fraudMaxPct: 5,
      status: "active",
    },
  });

  await prisma.campaignKpiRule.createMany({
    data: [
      { campaignId: campaign.id, metric: "cti", operator: "min", thresholdValue: 3, thresholdUnit: "%" },
      { campaignId: campaign.id, metric: "cpa", operator: "max", thresholdValue: 13, thresholdUnit: "$" },
      { campaignId: campaign.id, metric: "roas", operator: "min", thresholdValue: 2.5, thresholdUnit: "x" },
    ],
  });

  const upload = await prisma.rawDataUpload.create({
    data: {
      campaignId: campaign.id,
      fileName: "demo_import.csv",
      sourceType: "upload",
      status: "completed",
      rowsCount: 9,
    },
  });

  await prisma.rawDataRow.createMany({
    data: [
      { uploadId: upload.id, campaignId: campaign.id, date: "2025-03-20", source: "Google Ads", installs: 1250, clicks: 45000, spend: 15500, revenue: 43400, signups: 1200 },
      { uploadId: upload.id, campaignId: campaign.id, date: "2025-03-20", source: "Meta Ads", installs: 820, clicks: 28000, spend: 9840, revenue: 28536, signups: 780 },
      { uploadId: upload.id, campaignId: campaign.id, date: "2025-03-21", source: "Google Ads", installs: 1310, clicks: 47000, spend: 16244, revenue: 47108, signups: 1250 },
      { uploadId: upload.id, campaignId: campaign.id, date: "2025-03-21", source: "Meta Ads", installs: 780, clicks: 26500, spend: 9360, revenue: 27144, signups: 742 },
      { uploadId: upload.id, campaignId: campaign.id, date: "2025-03-22", source: "Google Ads", installs: 1180, clicks: 42000, spend: 14632, revenue: 42428, signups: 1130 },
      { uploadId: upload.id, campaignId: campaign.id, date: "2025-03-22", source: "Meta Ads", installs: 890, clicks: 30000, spend: 10680, revenue: 30972, signups: 845 },
      { uploadId: upload.id, campaignId: campaign.id, date: "2025-03-22", source: "TikTok Ads", installs: 560, clicks: 18000, spend: 6720, revenue: 18144, signups: 510, fraudCount: 5 },
    ],
  });

  await prisma.alert.createMany({
    data: [
      { campaignId: campaign.id, type: "kpi_below_min", severity: "medium", metric: "CTI", expected: "3%", actual: "2.8%" },
      { campaignId: campaign.id, type: "fraud_above_max", severity: "low", metric: "Fraud %", expected: "5%", actual: "0.5%", details: JSON.stringify({ source: "TikTok Ads" }) },
    ],
  });

  console.log("Seed completed. Campaign ID:", campaign.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
