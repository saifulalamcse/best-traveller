import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { destinations } from "@/lib/destinations";
import { MapPin } from "lucide-react";

export const Route = createFileRoute("/explore")({ component: Explore });

const categories = ["All", "Beach", "Mountain", "City", "Desert", "Cultural"];

function Explore() {
  return (
    <AppShell>
      <header className="px-5 pt-12">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Explore</p>
        <h1 className="mt-1 font-display text-3xl text-foreground">Discover unexpected corners.</h1>
      </header>

      <div className="mt-5 flex gap-2 overflow-x-auto px-5 pb-2 [&::-webkit-scrollbar]:hidden">
        {categories.map((c, i) => (
          <button
            key={c}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
              i === 0 ? "bg-foreground text-background" : "bg-secondary text-foreground"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 px-5">
        {destinations.map((d, i) => (
          <Link
            key={d.id}
            to="/search"
            search={{ q: d.location }}
            className={`relative overflow-hidden rounded-3xl shadow-soft ${i % 3 === 0 ? "row-span-2 h-[28rem]" : "h-52"}`}
          >
            <img src={d.image} alt={d.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
            <div className="gradient-overlay absolute inset-0" />
            <div className="absolute inset-x-3 bottom-3 text-background">
              <p className="flex items-center gap-1 text-[10px] opacity-85">
                <MapPin size={10} /> {d.location}
              </p>
              <h3 className="font-display text-base leading-tight">{d.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}