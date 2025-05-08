import type { ClubActivity } from "@/types";

const ACTIVITY_MULTIPLIERS: Record<string, number> = {
  Run: 1.0,
  Ride: 0.8,
  Swim: 1.5,
  Hike: 0.7,
  Walk: 0.5,
  // Adicione mais tipos de atividade conforme necessário
};

const DEFAULT_MULTIPLIER = 0.5;

export function calculateActivityScore(activity: ClubActivity): number {
  const multiplier = ACTIVITY_MULTIPLIERS[activity.type] || DEFAULT_MULTIPLIER;
  const minutes = activity.moving_time / 60;
  const baseScore = minutes * multiplier;

  // Bônus por elevação (1 ponto a cada 100m de elevação)
  const elevationBonus = activity.total_elevation_gain / 100;

  return Math.round(baseScore + elevationBonus);
}

export function calculateAthleteScore(activities: ClubActivity[]): {
  totalScore: number;
  activityCount: number;
  activities: {
    id: number;
    type: string;
    score: number;
    date: string;
  }[];
} {
  const scoredActivities = activities.map((activity) => ({
    id: activity.id,
    type: activity.type,
    score: calculateActivityScore(activity),
    date: activity.start_date,
  }));

  const totalScore = scoredActivities.reduce(
    (sum, activity) => sum + activity.score,
    0
  );

  return {
    totalScore,
    activityCount: activities.length,
    activities: scoredActivities,
  };
}
