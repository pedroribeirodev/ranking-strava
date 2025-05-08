// app/components/RankingTable.tsx
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Gerado pelo shadcn/ui
import type { RankingEntry } from "@/types"; // Corrigido o caminho de importação

interface RankingTableProps {
  data: RankingEntry[];
  lastUpdated: number;
}

export function RankingTable({ data, lastUpdated }: RankingTableProps) {
  if (!data || data.length === 0) {
    return (
      <p className="text-center text-muted-foreground">
        Nenhum dado no ranking para exibir.
      </p>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableCaption>
          Ranking atualizado em {new Date(lastUpdated).toLocaleString("pt-BR")}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Posição</TableHead>
            <TableHead>Atleta</TableHead>
            <TableHead className="text-right">Pontuação</TableHead>
            <TableHead className="text-right">Atividades</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((entry, index) => (
            <TableRow key={entry.id}>
              <TableCell className="font-medium">{index + 1}º</TableCell>
              <TableCell>{entry.name}</TableCell>
              <TableCell className="text-right">{entry.score}</TableCell>
              <TableCell className="text-right">{entry.activities}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
