import type { ClubActivity } from "@/types";

// Multiplicadores de pontos por minuto para cada tipo de atividade
// Edite estes valores conforme necessário para balancear o ranking
export const SCORE_MULTIPLIERS: Record<string, number> = {
  Run: 1.2,
  Ride: 0.5,
  Swim: 2.5,
  Walk: 0.8,
  Hike: 1.0,
  WeightTraining: 0.7,
  Yoga: 0.6,
  VirtualRide: 0.45,
  Elliptical: 0.9,
  Workout: 0.8,
  Crossfit: 1.1,
  RockClimbing: 1.0,
  Rowing: 1.0,
  Default: 0.7, // Multiplicador padrão para tipos não listados
};

// (Opcional) Multiplicadores de pontos por quilômetro para cada tipo de atividade
// Edite estes valores conforme necessário
export const KM_SCORE_MULTIPLIERS: Record<string, number> = {
  Run: 1.0,
  Ride: 0.3,
  Swim: 3.0,
  Walk: 0.5,
  Hike: 0.7,
  WeightTraining: 0.0,
  Yoga: 0.0,
  VirtualRide: 0.25,
  Elliptical: 0.4,
  Workout: 0.0,
  Crossfit: 0.0,
  RockClimbing: 0.0,
  Rowing: 0.8,
  Default: 0.3,
};

/**
 * Calcula a pontuação de uma atividade do Strava para uso em ranking balanceado.
 * A pontuação principal é baseada no tempo em movimento multiplicado por um fator do tipo de atividade.
 *
 * @param activity Objeto ClubActivity contendo pelo menos moving_time (segundos), type (string) e distance (metros)
 * @returns Pontuação inteira calculada para a atividade
 */
export function calculateActivityScore(activity: ClubActivity): number {
  // Converte o tempo em movimento de segundos para minutos
  const minutes = activity.moving_time / 60;

  // Busca o multiplicador para o tipo de atividade, ou usa o padrão
  const multiplier =
    SCORE_MULTIPLIERS[activity.type] ?? SCORE_MULTIPLIERS.Default;

  // Pontuação baseada no tempo
  const timeScore = minutes * multiplier;

  // (Opcional) Pontuação baseada na distância
  // const km = activity.distance / 1000;
  // const kmMultiplier = KM_SCORE_MULTIPLIERS[activity.type] ?? KM_SCORE_MULTIPLIERS.Default;
  // const distanceScore = km * kmMultiplier;

  // Para usar a pontuação de distância junto, some: Math.round(timeScore + distanceScore)
  return Math.round(timeScore);
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
