// lib/kv.ts
import type { RankingEntry } from "@/types";
import { Redis } from "@upstash/redis";

interface StravaTokenData {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  token_type: string;
}

interface ProcessedActivity {
  id: string; // identificador único
  athlete: string;
  name: string;
  distance: number;
  createdAt: number; // timestamp local
}

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

const KEYS = {
  STRAVA_TOKEN: "strava:token",
  RANKING_DATA: "ranking:data",
  ACTIVITIES: "club:activities", // nova chave para atividades processadas
  RANKING_PERIOD_DAYS: 7,
  RANKING_START_TIMESTAMP: "ranking:start_timestamp",
};

export async function getStravaToken(): Promise<StravaTokenData | null> {
  const data = await redis.get<string>(KEYS.STRAVA_TOKEN);
  if (!data) return null;
  try {
    return typeof data === "string" ? JSON.parse(data) : data;
  } catch (error) {
    console.error("Error parsing Strava token:", error);
    return null;
  }
}

export async function setStravaToken(token: StravaTokenData): Promise<void> {
  await redis.set(KEYS.STRAVA_TOKEN, JSON.stringify(token));
}

export async function getRankingData(): Promise<RankingEntry[] | null> {
  const data = await redis.get<string>(KEYS.RANKING_DATA);
  if (!data) return null;
  try {
    return typeof data === "string" ? JSON.parse(data) : data;
  } catch (error) {
    console.error("Error parsing ranking data:", error);
    return null;
  }
}

export async function setRankingData(data: RankingEntry[]): Promise<void> {
  await redis.set(KEYS.RANKING_DATA, JSON.stringify(data));
}

export async function saveProcessedActivity(activity: ProcessedActivity) {
  // Salva atividade como hash no Redis (id como chave)
  await redis.hset(KEYS.ACTIVITIES, {
    [activity.id]: JSON.stringify(activity),
  });
}

export async function getAllProcessedActivities(): Promise<
  ProcessedActivity[]
> {
  const all = await redis.hgetall(KEYS.ACTIVITIES);
  if (!all) return [];
  return Object.values(all)
    .map((v) => {
      if (typeof v === "string") {
        try {
          return JSON.parse(v);
        } catch {
          return null;
        }
      }
      if (typeof v === "object" && v !== null) {
        return v;
      }
      return null;
    })
    .filter(Boolean);
}

export async function getRecentProcessedActivities(
  days: number
): Promise<ProcessedActivity[]> {
  const all = await getAllProcessedActivities();
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return all.filter((a) => a.createdAt >= cutoff);
}

export async function setRankingStartTimestamp(ts: number) {
  await redis.set(KEYS.RANKING_START_TIMESTAMP, ts.toString());
}

export async function getRankingStartTimestamp(): Promise<number | null> {
  const value = await redis.get(KEYS.RANKING_START_TIMESTAMP);
  if (!value) return null;
  return Number(value);
}
