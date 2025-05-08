import { getRankingData } from "@/lib/kv";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const ranking = await getRankingData();
    console.log("Ranking data retrieved:", ranking);

    if (!ranking) {
      console.log("No ranking data found");
      return NextResponse.json({ ranking: [] });
    }

    return NextResponse.json({ ranking });
  } catch (error) {
    console.error("Error getting ranking:", error);
    return NextResponse.json(
      { error: "Failed to get ranking" },
      { status: 500 }
    );
  }
}
