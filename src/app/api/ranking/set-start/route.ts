import { setRankingStartTimestamp } from "@/lib/kv";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { timestamp } = await request.json();
  if (!timestamp) {
    return NextResponse.json(
      { error: "timestamp é obrigatório" },
      { status: 400 }
    );
  }
  await setRankingStartTimestamp(Number(timestamp));
  return NextResponse.json({ success: true, timestamp });
}
