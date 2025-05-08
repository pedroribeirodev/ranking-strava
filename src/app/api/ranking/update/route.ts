import {
  getAllProcessedActivities,
  getRankingStartTimestamp,
  getRecentProcessedActivities,
  saveProcessedActivity,
  setRankingData,
} from "@/lib/kv";
import { getClubActivities } from "@/lib/strava";
import type { ClubActivity } from "@/types";
import { NextResponse } from "next/server";

interface ProcessedActivity {
  id: string;
  athlete: string;
  name: string;
  distance: number;
  createdAt: number;
}

function generateActivityId(activity: ClubActivity) {
  // Gera um id simples baseado no nome, distância e atleta
  return `${activity.name}|${activity.distance}|${
    activity.athlete
      ? activity.athlete.firstname + " " + activity.athlete.lastname
      : "Desconhecido"
  }`;
}

export async function POST() {
  try {
    // Busca as atividades do clube (apenas os dados disponíveis)
    const activities = await getClubActivities(100, 1);
    if (!activities) {
      return NextResponse.json(
        { error: "Não foi possível buscar as atividades" },
        { status: 500 }
      );
    }

    // Busca todas as atividades já processadas
    const processed = await getAllProcessedActivities();
    const processedIds = new Set(processed.map((a: ProcessedActivity) => a.id));

    // Salva cada atividade processada no Redis com data local, só se não existir
    for (const activity of activities) {
      const id = generateActivityId(activity);
      if (!processedIds.has(id)) {
        const processedActivity: ProcessedActivity = {
          id,
          athlete: activity.athlete
            ? `${activity.athlete.firstname} ${activity.athlete.lastname}`
            : "Desconhecido",
          name: activity.name,
          distance: activity.distance,
          createdAt: new Date(activity.start_date_local).getTime(),
        };
        await saveProcessedActivity(processedActivity);
      }
    }

    // Busca o timestamp de início do ranking
    const startTimestamp = await getRankingStartTimestamp();

    // Busca apenas as atividades cadastradas nos últimos 30 dias E após o marco zero
    let recentActivities = await getRecentProcessedActivities(30);
    if (startTimestamp) {
      recentActivities = recentActivities.filter(
        (a) => a.createdAt > startTimestamp
      );
    }

    // Calcula a pontuação para cada atleta
    const athleteScores = new Map<
      string,
      { name: string; score: number; activities: number }
    >();
    recentActivities.forEach((activity) => {
      const athleteId = activity.athlete;
      const athleteName = activity.athlete;
      const score = Math.round(activity.distance / 1000);
      const current = athleteScores.get(athleteId) || {
        name: athleteName,
        score: 0,
        activities: 0,
      };
      athleteScores.set(athleteId, {
        name: athleteName,
        score: current.score + score,
        activities: current.activities + 1,
      });
    });

    // Converte para array e ordena por pontuação
    const ranking = Array.from(athleteScores.entries())
      .map(([id, data]) => ({
        id,
        name: data.name,
        score: data.score,
        activities: data.activities,
      }))
      .sort((a, b) => b.score - a.score);

    // Salva o ranking no Redis
    await setRankingData(ranking);

    return NextResponse.json({ success: true, ranking });
  } catch (error) {
    console.error("Erro ao atualizar ranking:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar o ranking" },
      { status: 500 }
    );
  }
}
