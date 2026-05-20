import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Settings, Heart, CreditCard, Globe, LogOut, ChevronRight, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/profile")({ component: Profile });

const stats = [
  { label: "Trips", value: "0" },
  { label: "Countries", value: "0" },
  { label: "Saved", value: "0" },
];

const rows = [
  { icon: Heart, label: "Saved stays" },
  { icon: CreditCard, label: "Payment methods" },
  { icon: Globe, label: "Travel preferences" },
  { icon: Settings, label: "Account settings" },
];

function Profile() {
  const navigate = useNavigate();
  const { isGuest, displayName: name, email, loading } = useAuth();
  const initial = name.charAt(0).toUpperCase();

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/" });
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
        <div className="mt-4 flex items-center gap-3 rounded-3xl bg-foreground p-4 text-background shadow-card">
          <Award size={22} className="text-accent" />
          <div className="flex-1">
            <p className="text-sm font-semibold">2 trips until Platinum</p>
            <p className="text-xs opacity-70">Unlock late check-outs and free upgrades</p>
          </div>
        </div>
      </header>
      <ul className="mt-6 space-y-1 px-5">
        {rows.map(({ icon: Icon, label }) => (
          <li key={label}>
            <button className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors hover:bg-secondary">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary text-foreground">
                <Icon size={16} />
              </span>
              <span className="flex-1 text-sm font-medium text-foreground">{label}</span>
              <ChevronRight size={16} className="text-muted-foreground" />
            </button>
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
    </AppShell>
  );
}
