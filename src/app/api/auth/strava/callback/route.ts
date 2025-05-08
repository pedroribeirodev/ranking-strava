// app/api/auth/strava/callback/route.ts
import { setStravaToken } from "@/lib/kv";
import { NextRequest, NextResponse } from "next/server";

// Definição da interface StravaTokenData (idealmente, importe de '@/types')
interface StravaTokenData {
  token_type: string;
  expires_at: number; // Timestamp UNIX em segundos
  expires_in: number; // Segundos a partir de agora até a expiração
  refresh_token: string;
  access_token: string;
  athlete?: {
    // O Strava pode retornar informações do atleta
    id: number;
    username: string | null;
    resource_state: number;
    firstname: string;
    lastname: string;
    // ... outros campos do atleta
  };
}

const STRAVA_TOKEN_URL = "https://www.strava.com/oauth/token";
const CLIENT_ID = process.env.STRAVA_CLIENT_ID!;
const CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET!;
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/strava/callback`;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const appURL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (error) {
    console.error("Strava OAuth Callback Error:", error);
    return NextResponse.redirect(
      new URL(
        `/?error=strava_auth_failed&message=${encodeURIComponent(error)}`,
        appURL
      )
    );
  }

  if (!code) {
    console.error("Strava OAuth Callback Error: No code provided.");
    return NextResponse.redirect(
      new URL("/?error=strava_auth_no_code", appURL)
    );
  }

  try {
    const response = await fetch(STRAVA_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: REDIRECT_URI,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to get access token");
    }

    const tokenData = await response.json();
    await setStravaToken(tokenData);

    return NextResponse.redirect(
      new URL("/admin?success=strava_auth_complete", appURL)
    );
  } catch (err: unknown) {
    console.error("Error in Strava callback processing:", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.redirect(
      new URL(
        `/?error=strava_callback_processing_failed&message=${encodeURIComponent(
          errorMessage
        )}`,
        appURL
      )
    );
  }
}
