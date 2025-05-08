// types/index.ts
export interface StravaTokenData {
  token_type: string;
  expires_at: number;
  expires_in: number;
  refresh_token: string;
  access_token: string;
  athlete?: {
    id: number;
    username: string | null;
    resource_state: number;
    firstname: string;
    lastname: string;
  };
}

export interface ClubActivity {
  id: number;
  name: string;
  distance: number;
  start_date: string;
  start_date_local: string;
  type: string;
  moving_time: number;
  total_elevation_gain: number;
  athlete: {
    id: number;
    firstname: string;
    lastname: string;
  };
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
