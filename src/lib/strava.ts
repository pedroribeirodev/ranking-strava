import type { ClubActivity, StravaTokenData } from "@/types";
import { getStravaToken, setStravaToken } from "./kv";

const STRAVA_API_URL = "https://www.strava.com/api/v3";
const CLUB_ID = process.env.STRAVA_CLUB_ID!;

export async function getValidAccessToken(): Promise<string> {
  const tokenData = await getStravaToken();
  if (!tokenData) {
    throw new Error("No Strava token found. Please authenticate first.");
  }

  // Se o token ainda é válido, retorna ele
  if (Date.now() < tokenData.expires_at * 1000) {
    return tokenData.access_token;
  }

  // Se o token expirou, usa o refresh token para obter um novo
  const response = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      refresh_token: tokenData.refresh_token,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh Strava token");
  }

  const newTokenData: StravaTokenData = await response.json();
  await setStravaToken(newTokenData);

  return newTokenData.access_token;
}

export async function getClubActivities(
  perPage = 30,
  page = 1
): Promise<ClubActivity[]> {
  const accessToken = await getValidAccessToken();
  const response = await fetch(
    `${STRAVA_API_URL}/clubs/${CLUB_ID}/activities?per_page=${perPage}&page=${page}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    console.error("Erro ao buscar atividades do clube:", await response.text());
    throw new Error("Failed to fetch club activities");
  }

  const data = await response.json();
  console.log(
    `[Strava] Página ${page} de atividades retornou:`,
    data.length,
    "atividades"
  );
  return data;
}

export async function getActivityDetails(
  id: number
): Promise<ClubActivity | null> {
  const accessToken = await getValidAccessToken();
  const response = await fetch(`${STRAVA_API_URL}/activities/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) {
    console.warn(
      `[Strava] Falha ao buscar detalhes da atividade ${id}:`,
      await response.text()
    );
    return null;
  }
  return response.json();
}

export async function getAllRecentClubActivities(
  days = 7
): Promise<ClubActivity[]> {
  const activities: ClubActivity[] = [];
  const page = 1;
  const perPage = 30; // Limite para evitar rate limit
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  console.log("[Strava] Data de corte:", cutoffDate.toISOString());

  // Buscar atividades do clube (resumidas)
  const clubActivities = await getClubActivities(perPage, page);
  console.log(
    `[Strava] Atividades resumidas recebidas:`,
    clubActivities.length
  );
  if (clubActivities.length > 0) {
    console.log("[Strava] Exemplo de atividade retornada:", clubActivities[0]);
  }

  // Buscar detalhes de cada atividade (ainda usando activity.id)
  for (const activity of clubActivities) {
    const details = await getActivityDetails(activity.id);
    if (!details) continue;
    const dateRaw = details.start_date_local || details.start_date;
    const activityDate = dateRaw ? new Date(dateRaw) : null;
    if (!activityDate || isNaN(activityDate.getTime())) {
      console.warn(
        "[Strava] Atividade com data inválida:",
        details.name,
        "| Valor:",
        dateRaw
      );
      continue;
    }
    console.log(
      "[Strava] Atividade:",
      details.name,
      "| Data:",
      activityDate.toISOString()
    );
    if (activityDate >= cutoffDate) {
      activities.push(details);
    }
  }

  console.log(
    `[Strava] Total de atividades recentes encontradas:`,
    activities.length
  );
  return activities;
}
