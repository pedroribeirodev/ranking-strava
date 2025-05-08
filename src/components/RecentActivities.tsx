"use client";
import { useEffect, useRef, useState } from "react";

interface Activity {
  id: string;
  athlete: string;
  name: string;
  distance: number;
  createdAt: number;
}

export function RecentActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [startTimestamp, setStartTimestamp] = useState<number | null>(null);
  const [scroll, setScroll] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/activities/recent")
      .then((res) => res.json())
      .then((data) => {
        setActivities(data.activities || []);
        setStartTimestamp(data.startTimestamp || null);
      });
  }, []);

  // Animação de scroll vertical fluido
  useEffect(() => {
    if (!activities.length) return;
    const interval = setInterval(() => {
      setScroll((prev) => {
        // Altura de cada item (ajuste se necessário)
        const itemHeight = 40;
        const maxScroll = itemHeight * (activities.length - 5);
        if (prev >= maxScroll) return 0;
        return prev + 1;
      });
    }, 20); // Quanto menor, mais rápido
    return () => clearInterval(interval);
  }, [activities]);

  return (
    <div className="overflow-hidden bg-muted rounded-md mb-8 border">
      <div className="px-4 py-2 border-b text-xs text-muted-foreground bg-background">
        <span>Últimas atividades desde </span>
        <span className="font-medium">
          {startTimestamp
            ? new Date(startTimestamp).toLocaleDateString("pt-BR", {
                timeZone: "America/Sao_Paulo",
              })
            : "-"}
        </span>
      </div>
      <div
        className="flex flex-col transition-none"
        ref={listRef}
        style={{ transform: `translateY(-${scroll}px)` }}
      >
        {activities.map((a) => (
          <div
            key={a.id}
            className="flex items-center gap-2 px-4 py-2 border-b last:border-b-0 text-sm h-10"
            style={{ minHeight: 40 }}
          >
            <span className="font-medium text-primary">{a.athlete}</span>
            <span className="text-muted-foreground">-</span>
            <span>{a.name}</span>
            <span className="ml-auto text-xs text-muted-foreground">
              {new Date(a.createdAt).toLocaleString("pt-BR", {
                timeZone: "America/Sao_Paulo",
              })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
