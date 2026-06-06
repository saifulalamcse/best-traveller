import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Star, MapPin } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { destinations } from "@/lib/destinations";

export const Route = createFileRoute("/_authenticated/stays")({
  component: StaysPage,
});

const moods = ["All", ...Array.from(new Set(destinations.map((d) => d.mood)))];

function StaysPage() {
  const navigate = useNavigate();
  const [active, setActive] = useState("All");
  const list = active === "All" ? destinations : destinations.filter((d) => d.mood === active);

  return (
    <AppShell>
      <header className="px-5 pt-12">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Back"
            onClick={() => navigate({ to: "/home" })}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground transition-transform active:scale-95"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Browse</p>
            <h1 className="font-display text-2xl text-foreground">All mood-based stays</h1>
          </div>
        </div>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden">
          {moods.map((m) => {
            const on = m === active;
            return (
              <button
                key={m}
                type="button"
                aria-pressed={on}
                onClick={() => setActive(m)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all active:scale-95 ${
                  on ? "bg-foreground text-background" : "border border-border bg-card text-foreground hover:bg-secondary"
                }`}
              >
                {m}
              </button>
            );
          })}
        </div>
      </header>

      <section className="mt-2 grid grid-cols-2 gap-3 px-5">
        {list.map((d) => (
          <Link
            key={d.id}
            to="/destinations/$id"
            params={{ id: d.id }}
            className="block overflow-hidden rounded-3xl bg-card shadow-soft transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="relative h-36 w-full">
              <img src={d.image} alt={d.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-background/90 px-2 py-0.5 text-[10px] font-semibold text-foreground">
                <Star size={10} className="fill-accent text-accent" aria-hidden="true" /> {d.rating}
              </div>
            </div>
            <div className="space-y-1 p-3">
              <p className="text-[9px] font-semibold uppercase tracking-wider text-accent">{d.mood}</p>
              <h3 className="font-display text-sm leading-tight text-foreground">{d.title}</h3>
              <div className="flex items-center justify-between pt-1">
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <MapPin size={10} aria-hidden="true" /> {d.location}
                </span>
              </div>
              <p className="text-xs font-semibold text-foreground">{d.price}</p>
            </div>
          </Link>
        ))}
      </section>
    </AppShell>
  );
}