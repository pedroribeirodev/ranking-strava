// app/api/auth/strava/route.ts
import { NextResponse } from "next/server";

const STRAVA_AUTH_URL = "https://www.strava.com/oauth/authorize";
const CLIENT_ID = process.env.STRAVA_CLIENT_ID!;
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/strava/callback`;
const SCOPE = "activity:read_all,read";

export async function GET() {
  const authUrl = new URL(STRAVA_AUTH_URL);
  authUrl.searchParams.append("client_id", CLIENT_ID);
  authUrl.searchParams.append("redirect_uri", REDIRECT_URI);
  authUrl.searchParams.append("response_type", "code");
  authUrl.searchParams.append("scope", SCOPE);
  authUrl.searchParams.append("approval_prompt", "force");

  return NextResponse.redirect(authUrl.toString());
}
