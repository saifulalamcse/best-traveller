import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Settings, Heart, CreditCard, Globe, LogOut, ChevronRight, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/profile")({ component: Profile });

const stats = [
  { label: "Trips", value: "0" },
  { label: "Countries", value: "0" },
  { label: "Saved", value: "0" },
];

const rows = [
  { icon: Heart, label: "Saved stays", to: "/profile/saved" },
  { icon: CreditCard, label: "Payment methods", to: "/profile/payment" },
  { icon: Globe, label: "Travel preferences", to: "/profile/preferences" },
  { icon: Settings, label: "Account settings", to: "/profile/settings" },
] as const;

function Profile() {
  const navigate = useNavigate();
  const { isGuest, displayName: name, email, loading } = useAuth();
  const initial = name.charAt(0).toUpperCase();
  const [tierOpen, setTierOpen] = useState(false);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) return toast.error(error.message);
    toast.success("Signed out — see you soon!");
    navigate({ to: "/", replace: true });
  };

  if (loading) {
    return (
      <AppShell>
        <div className="px-5 pt-24 text-center text-sm text-muted-foreground">Loading…</div>
      </AppShell>
    );
  }

  if (isGuest) {
    return (
      <AppShell>
        <header className="px-5 pt-12">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary font-display text-2xl text-muted-foreground">
              ?
            </div>
            <div>
              <h1 className="font-display text-2xl text-foreground">Guest traveller</h1>
              <p className="text-xs text-muted-foreground">Browsing without an account</p>
            </div>
          </div>

          <div className="mt-6 rounded-3xl bg-card p-6 text-center shadow-soft">
            <h2 className="font-display text-2xl leading-tight text-foreground">
              Save trips, sync devices, unlock chat.
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Create a free account to keep your itineraries and member rates.
            </p>
            <div className="mt-5 space-y-2">
              <Link
                to="/signup"
                className="flex h-12 w-full items-center justify-center rounded-2xl bg-foreground text-sm font-semibold text-background"
              >
                Sign up
              </Link>
              <Link
                to="/signin"
                className="flex h-12 w-full items-center justify-center rounded-2xl border border-border bg-card text-sm font-medium text-foreground"
              >
                Log in
              </Link>
            </div>
          </div>
        </header>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <header className="px-5 pt-12">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/30 font-display text-2xl text-foreground">{initial}</div>
          <div>
            <h1 className="font-display text-2xl text-foreground">{name}</h1>
            <p className="text-xs text-muted-foreground">{email} · Gold member</p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-2 rounded-3xl bg-card p-4 shadow-soft">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-2xl text-foreground">{s.value}</p>
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
        <button
          onClick={() => setTierOpen(true)}
          className="mt-4 flex w-full items-center gap-3 rounded-3xl bg-foreground p-4 text-left text-background shadow-card transition-transform active:scale-[0.98] hover:brightness-110"
        >
          <Award size={22} className="text-accent" />
          <div className="flex-1">
            <p className="text-sm font-semibold">2 trips until Platinum</p>
            <p className="text-xs opacity-70">Unlock late check-outs and free upgrades</p>
          </div>
          <ChevronRight size={16} className="opacity-70" />
        </button>
      </header>
      <ul className="mt-6 space-y-1 px-5">
        {rows.map(({ icon: Icon, label, to }) => (
          <li key={label}>
            <Link
              to={to}
              className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors hover:bg-secondary active:bg-secondary/80"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary text-foreground">
                <Icon size={16} />
              </span>
              <span className="flex-1 text-sm font-medium text-foreground">{label}</span>
              <ChevronRight size={16} className="text-muted-foreground" />
            </Link>
          </li>
        ))}
        <li className="pt-2">
          <button onClick={signOut} className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-destructive transition-colors hover:bg-destructive/10">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-destructive/10">
              <LogOut size={16} />
            </span>
            <span className="flex-1 text-sm font-medium">Sign out</span>
          </button>
        </li>
      </ul>

      <Dialog open={tierOpen} onOpenChange={setTierOpen}>
        <DialogContent className="max-w-[90vw] rounded-3xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Loyalty tier benefits</DialogTitle>
            <DialogDescription>You're 2 trips away from Platinum. Here's what's waiting.</DialogDescription>
          </DialogHeader>
          <ul className="space-y-3 text-sm">
            <Tier name="Silver" perks="Member rates · Early check-in (subject to availability)" active />
            <Tier name="Gold" perks="Free Wi-Fi upgrades · Welcome amenity · 2pm late check-out" active />
            <Tier name="Platinum" perks="Guaranteed late check-out · Room upgrades · Daily breakfast" />
            <Tier name="Diamond" perks="Suite upgrades · Lounge access · Personal concierge" />
          </ul>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

function Tier({ name, perks, active }: { name: string; perks: string; active?: boolean }) {
  return (
    <li className={`rounded-2xl border p-3 ${active ? "border-foreground/20 bg-secondary" : "border-border bg-card"}`}>
      <p className="font-display text-base text-foreground">{name} {active ? <span className="ml-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">unlocked</span> : null}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{perks}</p>
    </li>
  );
}
