import { getAllProcessedActivities, getRankingStartTimestamp } from "@/lib/kv";
import { NextResponse } from "next/server";

export async function GET() {
  const all = await getAllProcessedActivities();
  const startTimestamp = await getRankingStartTimestamp();
  let filtered = all;
  if (startTimestamp) {
    filtered = all.filter((a) => a.createdAt >= startTimestamp);
  }
  // Ordena por data decrescente e pega as 10 mais recentes
  const recent = filtered
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 10);
  return NextResponse.json({ activities: recent, startTimestamp });
}
