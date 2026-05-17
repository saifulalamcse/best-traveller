import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Bell, Search, Sun, Star } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { destinations } from "@/lib/destinations";
import { useState } from "react";

export const Route = createFileRoute("/home")({
  component: HomePage,
});

function HomePage() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const mood = destinations.filter((d) => d.category === "mood");
  const trending = destinations.filter((d) => d.category === "trending");
  const top = destinations.filter((d) => d.category === "top");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/search", search: { q } });
  };

  return (
    <AppShell>
      <header className="px-5 pt-12">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Good morning</p>
            <h1 className="mt-1 font-display text-3xl leading-tight text-foreground">Ada Lovelace</h1>
            <p className="mt-1 text-sm text-muted-foreground">Ready for your next adventure?</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex h-11 items-center gap-1.5 rounded-2xl bg-secondary px-3 text-foreground">
              <Sun size={16} className="text-accent" />
              <span className="text-sm font-semibold">24°</span>
            </button>
            <button className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-foreground">
              <Bell size={18} />
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-accent" />
            </button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="mt-6">
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3.5 shadow-soft">
            <Search size={18} className="text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search cities, resorts, hotels…"
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
            />
          </div>
        </form>
      </header>

      <Section title="Based on your mood" caption="A little reset, on us">
        <HorizontalRow items={mood} large />
      </Section>

      <Section title="Trending resorts" caption="What other wanderers love">
        <HorizontalRow items={trending} />
      </Section>

      <Section title="Top hotels" caption="Editor's picks this week">
        <div className="space-y-3 px-5">
          {top.map((d) => (
            <WideCard key={d.id} d={d} />
          ))}
        </div>
      </Section>
    </AppShell>
  );
}

function Section({ title, caption, children }: { title: string; caption: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <div className="mb-3 flex items-end justify-between px-5">
        <div>
          <h2 className="font-display text-xl text-foreground">{title}</h2>
          <p className="text-xs text-muted-foreground">{caption}</p>
        </div>
        <button className="text-xs font-semibold text-primary">See all</button>
      </div>
      {children}
    </section>
  );
}

function HorizontalRow({ items, large = false }: { items: typeof destinations; large?: boolean }) {
  return (
    <div className="flex gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {items.map((d) => (
        <Card key={d.id} d={d} large={large} />
      ))}
    </div>
  );
}

function Card({ d, large }: { d: typeof destinations[number]; large?: boolean }) {
  return (
    <Link
      to="/search"
      search={{ q: d.location }}
      className={`relative shrink-0 overflow-hidden rounded-3xl shadow-card ${large ? "h-72 w-64" : "h-56 w-44"}`}
    >
      <img src={d.image} alt={d.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      <div className="gradient-overlay absolute inset-0" />
      <div className="absolute left-3 top-3">
        <span className="rounded-full bg-background/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground backdrop-blur">
          {d.mood}
        </span>
      </div>
      <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-background/85 px-2 py-1 text-[10px] font-semibold text-foreground backdrop-blur">
        <Star size={10} className="fill-accent text-accent" />
        {d.rating}
      </div>
      <div className="absolute inset-x-3 bottom-3 text-background">
        <h3 className="font-display text-lg leading-snug">{d.title}</h3>
        <p className="mt-0.5 text-xs opacity-85">{d.location}</p>
      </div>
    </Link>
  );
}

function WideCard({ d }: { d: typeof destinations[number] }) {
  return (
    <Link to="/search" search={{ q: d.location }} className="flex gap-3 rounded-3xl bg-card p-3 shadow-soft">
      <img src={d.image} alt={d.title} loading="lazy" className="h-24 w-24 shrink-0 rounded-2xl object-cover" />
      <div className="flex flex-1 flex-col justify-between py-1">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-accent">{d.mood}</p>
          <h3 className="font-display text-base text-foreground">{d.title}</h3>
          <p className="text-xs text-muted-foreground">{d.location}</p>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">{d.price}</span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star size={12} className="fill-accent text-accent" />
            {d.rating}
          </span>
        </div>
      </div>
    </Link>
  );
}