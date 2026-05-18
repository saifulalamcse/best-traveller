import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { destinations } from "@/lib/destinations";
import { Calendar, MapPin, Plus } from "lucide-react";

export const Route = createFileRoute("/_authenticated/itineraries")({ component: Itineraries });

const trips = [
  { d: destinations[0], dates: "Jun 14 — Jun 19", status: "Upcoming" },
  { d: destinations[2], dates: "Aug 02 — Aug 10", status: "Planning" },
  { d: destinations[3], dates: "Mar 20 — Mar 27", status: "Past" },
];

function Itineraries() {
  return (
    <AppShell>
      <header className="flex items-start justify-between px-5 pt-12">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Itineraries</p>
          <h1 className="mt-1 font-display text-3xl text-foreground">Your trips, mapped.</h1>
        </div>
        <button className="flex h-11 w-11 items-center justify-center rounded-2xl bg-foreground text-background shadow-card">
          <Plus size={20} />
        </button>
      </header>

      <div className="mt-6 flex gap-2 px-5">
        {["Upcoming", "Planning", "Past", "Shared"].map((t, i) => (
          <button
            key={t}
            className={`rounded-full px-4 py-2 text-xs font-semibold ${
              i === 0 ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-4 px-5">
        {trips.map((t, i) => (
          <article key={i} className="overflow-hidden rounded-3xl bg-card shadow-soft">
            <div className="relative h-40">
              <img src={t.d.image} alt={t.d.location} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
              <div className="gradient-overlay absolute inset-0" />
              <span className="absolute right-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground">
                {t.status}
              </span>
              <div className="absolute inset-x-4 bottom-3 text-background">
                <h3 className="font-display text-xl">{t.d.location}</h3>
              </div>
            </div>
            <div className="flex items-center justify-between px-4 py-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><Calendar size={12} /> {t.dates}</span>
              <span className="flex items-center gap-1.5"><MapPin size={12} /> 5 stops</span>
            </div>
          </article>
        ))}
      </div>
    </AppShell>
  );
}