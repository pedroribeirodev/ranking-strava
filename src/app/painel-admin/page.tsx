// app/admin/page.tsx
import { Button } from "@/components/ui/button";
import { getStravaToken } from "@/lib/kv";

export default async function AdminPage() {
  const tokenData = await getStravaToken();
  const isAuthenticated = !!tokenData;

  return (
    <main className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Administração</h1>

      <div className="max-w-md mx-auto space-y-6">
        <div className="p-6 bg-card rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Autenticação Strava</h2>

          {isAuthenticated ? (
            <div className="space-y-4">
              <p className="text-green-600">✓ Autenticado com o Strava</p>
              <p className="text-sm text-muted-foreground">
                Token válido até:{" "}
                {new Date(tokenData.expires_at * 1000).toLocaleString("pt-BR")}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Você precisa autenticar com o Strava para gerenciar o ranking.
              </p>
              <Button asChild>
                <a href="/api/auth/strava">Autenticar com Strava</a>
              </Button>
            </div>
          )}
        </div>

        {isAuthenticated && (
          <div className="p-6 bg-card rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Atualizar Ranking</h2>
            <p className="text-muted-foreground mb-4">
              Clique no botão abaixo para atualizar o ranking com as atividades
              mais recentes.
            </p>
            <form action="/api/ranking/update" method="POST">
              <Button type="submit">Atualizar Ranking</Button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
