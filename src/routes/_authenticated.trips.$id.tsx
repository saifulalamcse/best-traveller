import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Trash2, MapPin, Calendar as CalIcon, Compass } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useTrips, coverImage, formatRange, daysBetween } from "@/lib/trips";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/trips/$id")({
  component: TripDetail,
  notFoundComponent: () => (
    <AppShell>
      <div className="px-5 pt-24 text-center">
        <h1 className="font-display text-2xl">Trip not found</h1>
        <Link to="/itineraries" className="mt-3 inline-block text-sm font-medium text-accent">
          Back to trips
        </Link>
      </div>
    </AppShell>
  ),
  errorComponent: ({ error }) => (
    <AppShell>
      <div className="px-5 pt-24 text-center text-sm text-muted-foreground">{error.message}</div>
    </AppShell>
  ),
});

const activityIdeas = [
  "Arrival & sunset stroll",
  "Local breakfast tour",
  "Guided cultural visit",
  "Beach / nature day",
  "Hidden-gem dinner",
  "Adventure excursion",
  "Slow morning + departure",
];

function TripDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { getTrip, deleteTrip, updateTrip } = useTrips();
  const trip = getTrip(id);
  const [editing, setEditing] = useState(false);
  const [destination, setDestination] = useState(trip?.destination ?? "");

  if (!trip) {
    return (
      <AppShell>
        <div className="px-5 pt-24 text-center">
          <h1 className="font-display text-2xl">Trip not found</h1>
          <Link to="/itineraries" className="mt-3 inline-block text-sm font-medium text-accent">
            Back to trips
          </Link>
        </div>
      </AppShell>
    );
  }

  const days = daysBetween(trip.startDate, trip.endDate);

  function handleDelete() {
    deleteTrip(trip!.id);
    toast.success("Itinerary deleted");
    navigate({ to: "/itineraries" });
  }

  function handleSaveEdit() {
    updateTrip(trip!.id, { destination: destination.trim() || trip!.destination });
    setEditing(false);
    toast.success("Itinerary updated");
  }

  return (
    <AppShell>
      <div className="relative h-[40vh] w-full overflow-hidden">
        <img
          src={coverImage(trip.coverSlug)}
          alt={trip.destination}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-5 pt-12">
          <button
            type="button"
            aria-label="Back"
            onClick={() => navigate({ to: "/itineraries" })}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-background/90 text-foreground shadow-soft transition-transform active:scale-95"
          >
            <ArrowLeft size={18} />
          </button>
          <button
            type="button"
            aria-label="Delete trip"
            onClick={handleDelete}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-background/90 text-destructive shadow-soft transition-transform active:scale-95"
          >
            <Trash2 size={18} />
          </button>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-5 text-background">
          <span className="rounded-full bg-background/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground">
            {trip.status}
          </span>
        </div>
      </div>

      <section className="-mt-8 rounded-t-[2rem] bg-background px-5 pt-6 pb-32">
        {editing ? (
          <div className="space-y-2">
            <input
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full rounded-2xl border border-input bg-background px-3 py-2 font-display text-2xl"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveEdit}
                className="flex-1 rounded-2xl bg-foreground py-2 text-sm font-semibold text-background active:scale-95"
              >
                Save
              </button>
              <button
                onClick={() => setEditing(false)}
                className="flex-1 rounded-2xl bg-secondary py-2 text-sm font-semibold text-muted-foreground active:scale-95"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between gap-3">
            <h1 className="font-display text-3xl text-foreground">{trip.destination}</h1>
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-foreground active:scale-95"
            >
              Edit
            </button>
          </div>
        )}

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CalIcon size={12} /> {formatRange(trip.startDate, trip.endDate)}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin size={12} /> {trip.stops} stops
          </span>
          <span className="flex items-center gap-1.5">
            <Compass size={12} /> {days.length} days
          </span>
        </div>

        <h2 className="mt-7 font-display text-lg">Map</h2>
        <div className="mt-3 overflow-hidden rounded-3xl border border-border">
          <iframe
            title={`Map of ${trip.destination}`}
            className="h-48 w-full"
            loading="lazy"
            src={`https://www.google.com/maps?q=${encodeURIComponent(trip.destination)}&output=embed`}
          />
        </div>

        <h2 className="mt-7 font-display text-lg">Day-by-day</h2>
        <ol className="mt-3 space-y-3">
          {days.map((d, i) => (
            <li key={d} className="flex gap-3 rounded-3xl bg-card p-4 shadow-soft">
              <div className="flex h-12 w-12 flex-col items-center justify-center rounded-2xl bg-foreground text-background">
                <span className="text-[9px] uppercase tracking-wider">Day</span>
                <span className="font-display text-lg leading-none">{i + 1}</span>
              </div>
              <div className="flex-1">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  {new Date(d).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
                </p>
                <p className="mt-0.5 text-sm font-medium text-foreground">
                  {activityIdeas[i % activityIdeas.length]}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <h2 className="mt-7 font-display text-lg">Stops</h2>
        <ul className="mt-3 space-y-2">
          {Array.from({ length: trip.stops }).map((_, i) => (
            <li
              key={i}
              className="flex items-center gap-3 rounded-2xl bg-secondary px-4 py-3 text-sm text-foreground"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-background text-xs font-semibold">
                {i + 1}
              </span>
              Stop {i + 1} · {trip.destination}
            </li>
          ))}
        </ul>
      </section>
    </AppShell>
  );
}