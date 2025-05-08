// app/page.tsx
import { RankingTable } from "@/components/RankingTable";

// Para forçar a página a ser dinâmica e buscar dados frescos a cada requisição (ou com revalidate)
export const dynamic = "force-dynamic";
// export const revalidate = 300; // Ou revalida a cada 5 minutos

async function getRanking() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/ranking`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.ranking;
}

export default async function Home() {
  const ranking = await getRanking();

  return (
    <main className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Ranking Semanal</h1>

        <div className="mb-8 p-4 bg-muted rounded-md text-muted-foreground text-sm max-w-2xl mx-auto">
          <strong>Como funciona a pontuação do ranking?</strong>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>
              A pontuação de cada atividade é calculada assim:
              <br />
              <span className="italic">
                Tempo em movimento (em minutos) × multiplicador do tipo de
                atividade
              </span>
            </li>
            <li>
              Cada tipo de atividade tem um multiplicador diferente para
              garantir equilíbrio entre corrida, pedalada, natação, caminhada,
              etc.
            </li>
            <li>
              Exemplos de multiplicadores: Corrida (1.2), Pedalada (0.5),
              Natação (2.5), Caminhada (0.8), entre outros.
            </li>
            <li>
              O objetivo é tornar o ranking mais justo para todos os esportes!
            </li>
          </ul>
        </div>

        {ranking && ranking.length > 0 ? (
          <RankingTable data={ranking} lastUpdated={Date.now()} />
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Nenhum dado de ranking disponível ainda.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Acesse a página de administração para atualizar o ranking.
            </p>
          </div>
        )}
      </div>

      <footer className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
        <p>Powered by Strava API, Next.js & Vercel</p>
      </footer>
    </main>
  );
}
