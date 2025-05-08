// types/index.ts
export interface StravaTokenData {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  expires_in: number;
}

export interface ClubActivity {
  id: number;
  athlete: {
    id: number;
    firstname: string;
    lastname: string;
  };
  type: string;
  moving_time: number;
  distance: number;
  total_elevation_gain: number;
  start_date: string;
}

export interface RankingEntry {
  id: string;
  name: string;
  score: number;
  activities: number;
}

export interface ProcessedActivity {
  id: number;
  processedAt: number;
}

export interface RankingData {
  lastUpdated: number;
  period: {
    start: number;
    end: number;
  };
  entries: RankingEntry[];
}
