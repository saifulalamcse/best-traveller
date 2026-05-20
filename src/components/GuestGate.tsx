import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Lock, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { AppShell } from "@/components/AppShell";

type Props = {
  /** Short label shown in the header (e.g. "Chat", "Profile"). */
  feature: string;
  /** Sub-message shown under the title. */
  description?: string;
  children: ReactNode;
};

/**
 * Wrap any authenticated route's content with this gate. Signed-in users
 * see the actual children. Guests see a polished CTA prompting sign-up.
 */
export function GuestGate({ feature, description, children }: Props) {
  const { loading, isGuest } = useAuth();

  if (loading) {
    return (
      <AppShell>
        <div className="px-5 pt-24 text-center text-sm text-muted-foreground">Loading…</div>
      </AppShell>
    );
  }

  if (!isGuest) return <>{children}</>;

  return (
    <AppShell>
      <div className="flex min-h-[80dvh] flex-col items-center justify-center px-6 text-center">
        <div
          aria-hidden="true"
          className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-accent/20 text-accent"
        >
          <Lock size={26} />
        </div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          {feature} · members only
        </p>
        <h2 className="mt-2 font-display text-3xl leading-tight text-foreground">
          Join Wanderlust Planner to unlock this feature
        </h2>
        <p className="mt-3 max-w-xs text-sm text-muted-foreground">
          {description ??
            "Create an account to save itineraries, book stays and chat with us."}
        </p>

        <div className="mt-8 w-full max-w-xs space-y-3">
          <Link
            to="/signup"
            className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-foreground text-base font-semibold text-background shadow-card transition-transform active:scale-[0.98]"
          >
            <Sparkles size={16} /> Sign up free
          </Link>
          <Link
            to="/signin"
            className="flex h-14 w-full items-center justify-center rounded-2xl border border-border bg-card text-base font-medium text-foreground"
          >
            Log in
          </Link>
        </div>
      </div>
    </AppShell>
  );
}