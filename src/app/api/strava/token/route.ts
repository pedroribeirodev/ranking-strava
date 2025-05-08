import { getStravaToken } from "@/lib/kv";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const token = await getStravaToken();
    return NextResponse.json(token);
  } catch (error) {
    console.error("Error getting Strava token:", error);
    return NextResponse.json(
      { error: "Failed to get Strava token" },
      { status: 500 }
    );
  }
}
