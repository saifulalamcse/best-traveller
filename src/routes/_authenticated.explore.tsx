import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { destinations } from "@/lib/destinations";
import { MapPin } from "lucide-react";

export const Route = createFileRoute("/_authenticated/explore")({ component: Explore });

const categories = ["All", "Beach", "Mountain", "City", "Desert", "Cultural"] as const;
type Category = (typeof categories)[number];

function Explore() {
  const [active, setActive] = useState<Category>("All");
  const list = active === "All" ? destinations : destinations.filter((d) => d.tag === active);

  return (
    <AppShell>
      <header className="px-5 pt-12">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Explore</p>
        <h1 className="mt-1 font-display text-3xl text-foreground">Discover unexpected corners.</h1>
      </header>

      <div className="mt-5 flex gap-2 overflow-x-auto px-5 pb-2 [&::-webkit-scrollbar]:hidden">
        {categories.map((c) => {
          const on = c === active;
          return (
            <button
              type="button"
              key={c}
              aria-pressed={on}
              onClick={() => setActive(c)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all active:scale-95 ${
                on ? "bg-foreground text-background shadow-soft" : "bg-secondary text-foreground hover:bg-secondary/70"
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>

      {list.length === 0 ? (
        <div className="px-5 py-16 text-center text-sm text-muted-foreground">
          No destinations match “{active}” yet. Try another category.
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3 px-5">
          {list.map((d, i) => (
            <Link
              key={d.id}
              to="/destinations/$id"
              params={{ id: d.id }}
              className={`group relative overflow-hidden rounded-3xl shadow-soft transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                i % 3 === 0 ? "row-span-2 h-[28rem]" : "h-52"
              }`}
            >
              <img src={d.image} alt={d.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="gradient-overlay absolute inset-0" aria-hidden="true" />
              <div className="absolute inset-x-3 bottom-3 text-background">
                <p className="flex items-center gap-1 text-[10px] opacity-85">
                  <MapPin size={10} aria-hidden="true" /> {d.location}
                </p>
                <h3 className="font-display text-base leading-tight">{d.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      )}
    </AppShell>
  );
}