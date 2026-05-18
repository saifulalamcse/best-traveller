import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Search as SearchIcon, Star, MapPin } from "lucide-react";
import { useState } from "react";
import { destinations } from "@/lib/destinations";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";

const schema = z.object({
  q: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/_authenticated/search")({
  validateSearch: zodValidator(schema),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const navigate = useNavigate();
  const [query, setQuery] = useState(q);

  const results = destinations.filter((d) => {
    const t = query.toLowerCase().trim();
    if (!t) return true;
    return d.title.toLowerCase().includes(t) || d.location.toLowerCase().includes(t) || d.mood.toLowerCase().includes(t);
  });

  return (
    <div className="mx-auto min-h-screen w-full max-w-[480px] bg-background pb-10">
      <header className="sticky top-0 z-20 bg-background/90 px-5 pb-3 pt-12 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate({ to: "/home" })}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex flex-1 items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-soft">
            <SearchIcon size={16} className="text-muted-foreground" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Where to next?"
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
            />
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          {results.length} {results.length === 1 ? "stay" : "stays"} found
          {query ? ` for "${query}"` : ""}
        </p>
      </header>

      <div className="space-y-3 px-5 pt-2">
        {results.map((d) => (
          <Link
            key={d.id}
            to="/search"
            search={{ q: d.location }}
            className="block overflow-hidden rounded-3xl bg-card shadow-soft"
          >
            <div className="relative h-44 w-full">
              <img src={d.image} alt={d.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-background/90 px-2 py-1 text-xs font-semibold text-foreground">
                <Star size={12} className="fill-accent text-accent" /> {d.rating}
              </div>
            </div>
            <div className="space-y-1 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-accent">{d.mood}</p>
              <h3 className="font-display text-lg text-foreground">{d.title}</h3>
              <div className="flex items-center justify-between pt-1">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin size={12} /> {d.location}
                </span>
                <span className="text-sm font-semibold text-foreground">{d.price}</span>
              </div>
            </div>
          </Link>
        ))}
        {results.length === 0 && (
          <div className="rounded-3xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No stays match "{query}" yet. Try another city or mood.
          </div>
        )}
      </div>
    </div>
  );
}