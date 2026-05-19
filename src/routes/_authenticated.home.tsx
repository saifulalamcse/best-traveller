import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import maldives from "@/assets/dest-maldives.jpg";
import adventure from "@/assets/dest-adventure.jpg";
import cultural from "@/assets/dest-cultural.jpg";

export const Route = createFileRoute("/_authenticated/home")({
  component: HomePage,
});

const moodCards = [
  { id: "relaxed", mood: "Relaxed", title: "Weekend Relaxation", query: "Maldives", image: maldives },
  { id: "excited", mood: "Excited", title: "Adventure Awaits", query: "Adventure", image: adventure },
  { id: "curious", mood: "Curious", title: "Cultural Experience", query: "London", image: cultural },
];

function HomePage() {
  return (
    <AppShell>
      <header className="px-5 pt-12">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-foreground">
              Good Morning
            </h1>
            <p className="mt-2 text-base text-muted-foreground">
              Ready for your next adventure?
            </p>
          </div>
          <button className="shrink-0 rounded-2xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-soft">
            Weather
          </button>
        </div>
      </header>

      <section className="mt-8 px-5">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Based on your mood
          </h2>
          <button className="text-sm font-medium text-foreground/80">See all</button>
        </div>

        <div className="space-y-4">
          {moodCards.map((c) => (
            <Link
              key={c.id}
              to="/search"
              search={{ q: c.query }}
              className="relative block aspect-[16/10] overflow-hidden rounded-3xl shadow-card"
            >
              <img
                src={c.image}
                alt={c.title}
                loading="lazy"
                width={1024}
                height={768}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="gradient-overlay absolute inset-0" />
              <div className="absolute inset-x-5 bottom-5 text-white">
                <p className="text-sm font-medium opacity-95">{c.mood}</p>
                <h3 className="mt-1 text-2xl font-bold tracking-tight">{c.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </AppShell>
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