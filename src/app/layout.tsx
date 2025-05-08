// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ranking Strava",
  description: "Ranking semanal de atividades do clube Strava",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <div className="min-h-screen bg-background">
          <header className="border-b">
            <div className="container mx-auto py-4 flex justify-between items-center">
              <h1 className="text-xl font-bold">Ranking Strava</h1>
              <Link
                href="/admin"
                className="text-muted-foreground hover:text-foreground"
              >
                Administração
              </Link>
            </div>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
