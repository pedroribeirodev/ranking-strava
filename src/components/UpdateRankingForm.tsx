"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export function UpdateRankingForm() {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const response = await fetch("/api/ranking/update", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Falha ao atualizar o ranking");
      }

      // Recarrega a página para mostrar o novo ranking
      window.location.reload();
    } catch (error) {
      console.error("Erro ao atualizar ranking:", error);
      alert("Erro ao atualizar o ranking. Tente novamente.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="p-6 bg-card rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold mb-4">Atualizar Ranking</h2>
      <p className="text-muted-foreground mb-4">
        Clique no botão abaixo para atualizar o ranking com as atividades mais
        recentes.
      </p>
      <form onSubmit={handleSubmit}>
        <Button type="submit" disabled={isUpdating}>
          {isUpdating ? "Atualizando..." : "Atualizar Ranking"}
        </Button>
      </form>
    </div>
  );
}
