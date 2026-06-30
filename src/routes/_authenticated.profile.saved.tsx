import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ProfileSubHeader } from "@/components/ProfileSubHeader";
import { useLocalStore, SAVED_STAYS_KEY } from "@/lib/local-store";
import { destinations } from "@/lib/destinations";
import { Heart, Star } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/profile/saved")({ component: SavedStays });

function SavedStays() {
  const [saved, setSaved] = useLocalStore<string[]>(SAVED_STAYS_KEY, []);
  const items = destinations.filter((d) => saved.includes(d.id));

  const remove = (id: string) => {
    setSaved((prev) => prev.filter((x) => x !== id));
    toast.success("Removed from saved");
  };

  return (
    <AppShell>
      <ProfileSubHeader title="Saved stays" subtitle={`${items.length} bookmarked`} />
      <div className="px-5 pt-2">
        {items.length === 0 ? (
          <div className="mt-10 rounded-3xl bg-card p-8 text-center shadow-soft">
            <Heart size={28} className="mx-auto text-muted-foreground" />
            <p className="mt-3 font-display text-lg text-foreground">No saved stays yet</p>
            <p className="mt-1 text-xs text-muted-foreground">Tap the heart on any destination to save it here.</p>
            <Link to="/explore" className="mt-5 inline-flex h-11 items-center justify-center rounded-2xl bg-foreground px-6 text-sm font-semibold text-background">
              Explore destinations
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {items.map((d) => (
              <li key={d.id} className="overflow-hidden rounded-3xl bg-card shadow-soft">
                <Link to="/destinations/$id" params={{ id: d.id }} className="flex gap-3">
                  <img src={d.image} alt={d.location} className="h-24 w-28 object-cover" />
                  <div className="flex flex-1 flex-col justify-center py-2 pr-2">
                    <p className="text-xs text-muted-foreground">{d.tag}</p>
                    <p className="font-display text-base text-foreground">{d.location}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <Star size={12} className="fill-accent text-accent" /> {d.rating} · {d.price}
                    </p>
                  </div>
                </Link>
                <button
                  onClick={() => remove(d.id)}
                  className="absolute right-7 mt-[-72px] flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-destructive shadow-soft"
                  aria-label="Remove"
                >
                  <Heart size={16} className="fill-destructive" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AppShell>
  );
}