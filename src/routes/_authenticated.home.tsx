import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/hooks/use-auth";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Sun, CloudSun, Wind, Droplets, MapPin } from "lucide-react";
import maldives from "@/assets/dest-maldives.jpg";
import adventure from "@/assets/dest-adventure.jpg";
import cultural from "@/assets/dest-cultural.jpg";

export const Route = createFileRoute("/_authenticated/home")({
  component: HomePage,
});

const moodCards = [
  { id: "relaxed", destId: "maldives", mood: "Relaxed", title: "Weekend Relaxation", image: maldives },
  { id: "excited", destId: "alps", mood: "Excited", title: "Adventure Awaits", image: adventure },
  { id: "curious", destId: "kyoto", mood: "Curious", title: "Cultural Experience", image: cultural },
];

function HomePage() {
  const { displayName, isGuest } = useAuth();
  const [weatherOpen, setWeatherOpen] = useState(false);
  const hour = new Date().getHours();
  const partOfDay =
    hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";
  const firstName = displayName.split(" ")[0];
  const greeting = isGuest ? partOfDay : `${partOfDay}, ${firstName}`;

  return (
    <AppShell>
      <header className="px-5 pt-12">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-foreground">
              {greeting}
            </h1>
            <p className="mt-2 text-base text-muted-foreground">
              {isGuest ? "Browsing as a guest — ready to explore?" : "Ready for your next adventure?"}
            </p>
          </div>
          <button
            type="button"
            aria-label="Open weather forecast"
            onClick={() => setWeatherOpen(true)}
            className="shrink-0 rounded-2xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-soft transition-all active:scale-95 hover:bg-secondary"
          >
            Weather
          </button>
        </div>
      </header>

      <section className="mt-8 px-5">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Based on your mood
          </h2>
          <Link
            to="/stays"
            className="text-sm font-medium text-foreground/80 transition-opacity hover:opacity-70"
          >
            See all
          </Link>
        </div>

        <div className="space-y-4">
          {moodCards.map((c) => (
            <Link
              key={c.id}
              to="/destinations/$id"
              params={{ id: c.destId }}
              className="relative block aspect-[16/10] overflow-hidden rounded-3xl shadow-card transition-transform duration-200 hover:scale-[1.02] active:scale-[0.99]"
            >
              <img
                src={c.image}
                alt={c.title}
                loading="lazy"
                width={1024}
                height={768}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="gradient-overlay absolute inset-0" aria-hidden="true" />
              <div className="absolute inset-x-5 bottom-5 text-background">
                <p className="text-sm font-medium opacity-95">{c.mood}</p>
                <h3 className="mt-1 text-2xl font-bold tracking-tight">{c.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Dialog open={weatherOpen} onOpenChange={setWeatherOpen}>
        <DialogContent className="max-w-sm rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Maldives</DialogTitle>
            <DialogDescription className="flex items-center gap-1 text-xs">
              <MapPin size={12} aria-hidden="true" /> Your next destination
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-3xl bg-gradient-to-br from-accent/30 to-primary/20 p-6 text-center">
            <Sun size={56} className="mx-auto text-accent" aria-hidden="true" />
            <p className="mt-3 font-display text-5xl text-foreground">29°</p>
            <p className="mt-1 text-sm font-medium text-foreground">Sunny · Light breeze</p>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-2">
            <div className="rounded-2xl bg-secondary p-3 text-center">
              <Wind size={16} className="mx-auto text-muted-foreground" aria-hidden="true" />
              <p className="mt-1 text-xs font-semibold text-foreground">12 km/h</p>
              <p className="text-[10px] text-muted-foreground">Wind</p>
            </div>
            <div className="rounded-2xl bg-secondary p-3 text-center">
              <Droplets size={16} className="mx-auto text-muted-foreground" aria-hidden="true" />
              <p className="mt-1 text-xs font-semibold text-foreground">68%</p>
              <p className="text-[10px] text-muted-foreground">Humidity</p>
            </div>
            <div className="rounded-2xl bg-secondary p-3 text-center">
              <CloudSun size={16} className="mx-auto text-muted-foreground" aria-hidden="true" />
              <p className="mt-1 text-xs font-semibold text-foreground">31° / 25°</p>
              <p className="text-[10px] text-muted-foreground">High / Low</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}