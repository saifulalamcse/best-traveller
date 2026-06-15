import { useEffect, useState, useSyncExternalStore } from "react";
import { destinations } from "@/lib/destinations";

export type TripStatus = "Upcoming" | "Planning" | "Past" | "Shared";

export type Trip = {
  id: string;
  destination: string;
  coverSlug: string;
  startDate: string; // ISO
  endDate: string; // ISO
  status: TripStatus;
  stops: number;
  notes?: string;
};

const STORAGE_KEY = "wanderlust.trips.v1";

const seed: Trip[] = [
  {
    id: "seed-maldives",
    destination: "Maldives",
    coverSlug: "maldives",
    startDate: "2026-06-14",
    endDate: "2026-06-19",
    status: "Upcoming",
    stops: 5,
  },
  {
    id: "seed-santorini",
    destination: "Santorini, Greece",
    coverSlug: "santorini",
    startDate: "2026-08-02",
    endDate: "2026-08-10",
    status: "Planning",
    stops: 6,
  },
  {
    id: "seed-kyoto",
    destination: "Kyoto, Japan",
    coverSlug: "kyoto",
    startDate: "2026-03-20",
    endDate: "2026-03-27",
    status: "Past",
    stops: 7,
  },
];

let cache: Trip[] | null = null;
const listeners = new Set<() => void>();

function read(): Trip[] {
  if (cache) return cache;
  if (typeof window === "undefined") return seed;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    cache = raw ? (JSON.parse(raw) as Trip[]) : seed;
  } catch {
    cache = seed;
  }
  return cache!;
}

function write(next: Trip[]) {
  cache = next;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }
  listeners.forEach((l) => l());
}

export function useTrips() {
  const trips = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => read(),
    () => seed,
  );

  return {
    trips,
    addTrip: (t: Omit<Trip, "id" | "stops"> & { stops?: number }) => {
      const next: Trip = {
        id: `trip-${Date.now()}`,
        stops: t.stops ?? 5,
        ...t,
      };
      write([next, ...read()]);
      return next;
    },
    updateTrip: (id: string, patch: Partial<Trip>) => {
      write(read().map((t) => (t.id === id ? { ...t, ...patch } : t)));
    },
    deleteTrip: (id: string) => {
      write(read().filter((t) => t.id !== id));
    },
    getTrip: (id: string) => read().find((t) => t.id === id),
  };
}

export function coverImage(slug: string): string {
  const d = destinations.find((x) => x.id === slug);
  return d?.image ?? destinations[0].image;
}

export function formatRange(start: string, end: string) {
  const fmt = (s: string) =>
    new Date(s).toLocaleDateString("en-US", { month: "short", day: "2-digit" });
  return `${fmt(start)} — ${fmt(end)}`;
}

export function daysBetween(start: string, end: string): string[] {
  const out: string[] = [];
  const s = new Date(start);
  const e = new Date(end);
  for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
    out.push(new Date(d).toISOString().slice(0, 10));
  }
  return out;
}

// Avoid unused-import warning in some bundlers
export const __keepReact = { useEffect, useState };