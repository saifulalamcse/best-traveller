import { useEffect, useState } from "react";

export function useLocalStore<T>(key: string, initial: T): [T, (v: T | ((p: T) => T)) => void] {
  const [value, setValue] = useState<T>(initial);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setValue(JSON.parse(raw) as T);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  const update = (v: T | ((p: T) => T)) => {
    setValue((prev) => {
      const next = typeof v === "function" ? (v as (p: T) => T)(prev) : v;
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {}
      return next;
    });
  };
  return [value, update];
}

export const SAVED_STAYS_KEY = "bt.savedStays";
export const PAYMENT_METHODS_KEY = "bt.paymentMethods";
export const TRAVEL_PREFS_KEY = "bt.travelPrefs";