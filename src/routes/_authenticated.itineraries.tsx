import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Calendar as CalIcon, MapPin, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { useTrips, coverImage, formatRange, type TripStatus } from "@/lib/trips";

export const Route = createFileRoute("/_authenticated/itineraries")({ component: Itineraries });

const filters: TripStatus[] = ["Upcoming", "Planning", "Past", "Shared"];

function Itineraries() {
  const { trips, addTrip } = useTrips();
  const [active, setActive] = useState<TripStatus>("Upcoming");
  const [open, setOpen] = useState(false);
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [status, setStatus] = useState<TripStatus>("Planning");

  const visible = trips.filter((t) => t.status === active);

  function submit() {
    if (!destination.trim() || !startDate || !endDate) {
      toast.error("Add a destination and both dates");
      return;
    }
    addTrip({
      destination: destination.trim(),
      coverSlug: "maldives",
      startDate: startDate.toISOString().slice(0, 10),
      endDate: endDate.toISOString().slice(0, 10),
      status,
    });
    toast.success("Itinerary created");
    setOpen(false);
    setDestination("");
    setStartDate(undefined);
    setEndDate(undefined);
    setActive(status);
    setStatus("Planning");
  }

  return (
    <AppShell>
      <header className="flex items-start justify-between px-5 pt-12">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Itineraries</p>
          <h1 className="mt-1 font-display text-3xl text-foreground">Your trips, mapped.</h1>
        </div>
        <button
          type="button"
          aria-label="Create new trip"
          onClick={() => setOpen(true)}
          className="flex h-11 w-11 items-center justify-center rounded-2xl bg-foreground text-background shadow-card transition-transform active:scale-95 hover:opacity-90"
        >
          <Plus size={20} />
        </button>
      </header>

      <div className="mt-6 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {filters.map((t) => {
          const isActive = t === active;
          return (
            <button
              type="button"
              key={t}
              aria-pressed={isActive}
              onClick={() => setActive(t)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all active:scale-95 ${
                isActive ? "bg-foreground text-background shadow-soft" : "bg-secondary text-muted-foreground"
              }`}
            >
              {t}
            </button>
          );
        })}
      </div>

      <div className="mt-4 space-y-4 px-5 pb-28">
        {visible.length === 0 ? (
          <p className="rounded-3xl bg-secondary px-4 py-10 text-center text-sm text-muted-foreground">
            No {active.toLowerCase()} trips yet.
          </p>
        ) : (
          visible.map((t) => (
            <Link
              key={t.id}
              to="/trips/$id"
              params={{ id: t.id }}
              className="block overflow-hidden rounded-3xl bg-card shadow-soft transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <div className="relative h-40">
                <img
                  src={coverImage(t.coverSlug)}
                  alt={t.destination}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="gradient-overlay absolute inset-0" aria-hidden="true" />
                <span className="absolute right-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground">
                  {t.status}
                </span>
                <div className="absolute inset-x-4 bottom-3 text-background">
                  <h3 className="font-display text-xl">{t.destination}</h3>
                </div>
              </div>
              <div className="flex items-center justify-between px-4 py-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <CalIcon size={12} /> {formatRange(t.startDate, t.endDate)}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin size={12} /> {t.stops} stops
                </span>
              </div>
            </Link>
          ))
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[420px] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Create new itinerary</DialogTitle>
            <DialogDescription>Plan your next escape in a few taps.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="dest">Destination</Label>
              <Input
                id="dest"
                placeholder="e.g. Lisbon, Portugal"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <DatePick label="Start" value={startDate} onChange={setStartDate} />
              <DatePick label="End" value={endDate} onChange={setEndDate} />
            </div>

            <div className="space-y-1.5">
              <Label>Status</Label>
              <div className="flex gap-2">
                {(["Planning", "Upcoming"] as TripStatus[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    className={`flex-1 rounded-2xl px-3 py-2 text-xs font-semibold transition-all active:scale-95 ${
                      status === s ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <button
              type="button"
              onClick={submit}
              className="w-full rounded-2xl bg-foreground py-3 text-sm font-semibold text-background transition-transform active:scale-95 hover:opacity-90"
            >
              Save itinerary
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

function DatePick({
  label,
  value,
  onChange,
}: {
  label: string;
  value: Date | undefined;
  onChange: (d: Date | undefined) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-left text-sm"
          >
            <span className={value ? "text-foreground" : "text-muted-foreground"}>
              {value ? value.toLocaleDateString() : "Pick date"}
            </span>
            <CalIcon size={14} className="text-muted-foreground" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar mode="single" selected={value} onSelect={onChange} />
        </PopoverContent>
      </Popover>
    </div>
  );
}