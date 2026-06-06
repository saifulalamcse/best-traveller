import { createFileRoute, Link, useNavigate, notFound } from "@tanstack/react-router";
import { ArrowLeft, Heart, Star, MapPin, Wifi, Coffee, Waves, UtensilsCrossed } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { destinations } from "@/lib/destinations";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/destinations/$id")({
  component: DestinationPage,
  notFoundComponent: () => (
    <AppShell>
      <div className="px-5 pt-24 text-center">
        <h1 className="font-display text-2xl text-foreground">Destination not found</h1>
        <Link to="/home" className="mt-4 inline-block text-sm font-medium text-accent">Back to home</Link>
      </div>
    </AppShell>
  ),
  errorComponent: ({ error }) => (
    <AppShell>
      <div className="px-5 pt-24 text-center text-sm text-muted-foreground">{error.message}</div>
    </AppShell>
  ),
  loader: ({ params }) => {
    const d = destinations.find((x) => x.id === params.id);
    if (!d) throw notFound();
    return d;
  },
});

const amenities = [
  { icon: Wifi, label: "Free Wi-Fi" },
  { icon: Coffee, label: "Breakfast" },
  { icon: Waves, label: "Beach access" },
  { icon: UtensilsCrossed, label: "Restaurant" },
];

function DestinationPage() {
  const d = Route.useLoaderData();
  const navigate = useNavigate();

  return (
    <AppShell>
      <div className="relative h-[58vh] w-full overflow-hidden">
        <img src={d.image} alt={d.title} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-5 pt-12">
          <button
            type="button"
            aria-label="Back"
            onClick={() => navigate({ to: "/home" })}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-background/90 text-foreground shadow-soft transition-transform active:scale-95"
          >
            <ArrowLeft size={18} />
          </button>
          <button
            type="button"
            aria-label="Save destination"
            onClick={() => toast.success("Saved to your wishlist")}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-background/90 text-foreground shadow-soft transition-transform active:scale-95"
          >
            <Heart size={18} />
          </button>
        </div>
      </div>

      <section className="-mt-10 rounded-t-[2.5rem] bg-background px-5 pt-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">{d.mood}</p>
        <div className="mt-1 flex items-start justify-between gap-3">
          <h1 className="font-display text-3xl leading-tight text-foreground">{d.title}</h1>
          <span className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-foreground">
            <Star size={12} className="fill-accent text-accent" aria-hidden="true" /> {d.rating}
          </span>
        </div>
        <p className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin size={14} aria-hidden="true" /> {d.location}
        </p>

        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
          Escape the everyday at {d.location}. Spend slow mornings, sun-soaked afternoons, and golden-hour
          evenings in a stay curated for a {d.mood.toLowerCase()} mood. Every detail is shaped around comfort,
          calm, and unforgettable views.
        </p>

        <h2 className="mt-6 font-display text-lg text-foreground">Amenities</h2>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {amenities.map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-1 rounded-2xl bg-secondary p-3 text-center">
              <Icon size={18} className="text-foreground" aria-hidden="true" />
              <span className="text-[10px] font-medium text-foreground">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-20 z-40 mx-auto max-w-[480px] px-5">
        <div className="flex items-center gap-3 rounded-3xl border border-border bg-card p-3 shadow-card">
          <div className="flex-1">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">From</p>
            <p className="font-display text-xl text-foreground">{d.price}</p>
          </div>
          <button
            type="button"
            onClick={() => toast.success(`Booking request sent for ${d.title}`)}
            className="flex-1 rounded-2xl bg-foreground py-3 text-sm font-semibold text-background transition-transform active:scale-95 hover:opacity-90"
          >
            Book Now
          </button>
        </div>
      </div>
    </AppShell>
  );
}