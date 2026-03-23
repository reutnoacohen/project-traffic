import { NextResponse } from "next/server";
import { parseCampaignBrief, mapToCampaignForm } from "@/lib/campaign-brief-parser";

export async function POST(request: Request) {
  const { text } = await request.json();
  if (!text || typeof text !== "string") {
    return NextResponse.json({ error: "Text is required" }, { status: 400 });
  }
  const result = parseCampaignBrief(text);
  const formData = mapToCampaignForm(result.extracted);
  return NextResponse.json({
    ...result,
    formData,
  });
}
