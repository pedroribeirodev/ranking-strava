import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto py-4">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground"
          >
            ← Voltar para o Ranking
          </Link>
        </div>
      </header>
      {children}
    </div>
  );
}
