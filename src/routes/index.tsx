import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Plane } from "lucide-react";
import maldives from "@/assets/dest-maldives.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-[480px] flex-col overflow-hidden bg-foreground">
      <img
        src={maldives}
        alt="Maldives turquoise lagoon at sunset"
        className="absolute inset-0 h-full w-full object-cover opacity-80"
        width={1024}
        height={1280}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-foreground/30 via-foreground/40 to-foreground/95" />
      <div className="relative z-10 flex flex-1 flex-col px-6 pb-10 pt-16 text-background">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-background/15 backdrop-blur">
            <Plane size={18} className="-rotate-45" />
          </span>
          <span className="text-sm font-medium tracking-wide">Wander</span>
        </div>

        <div className="mt-auto space-y-6">
          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.25em] opacity-70">For the curious</p>
            <h1 className="font-display text-5xl leading-[1.05]">
              The world is wide.<br />
              <span className="italic opacity-90">Pack lightly.</span>
            </h1>
            <p className="max-w-[18rem] text-sm leading-relaxed opacity-80">
              Mood-matched stays, hand-picked resorts and effortless itineraries — all in one place.
            </p>
          </div>

          <div className="space-y-3">
            <Link
              to="/signup"
              className="flex h-14 w-full items-center justify-center rounded-2xl bg-background text-base font-semibold text-foreground transition-transform active:scale-[0.98]"
            >
              Create account
            </Link>
            <Link
              to="/signin"
              className="flex h-14 w-full items-center justify-center rounded-2xl border border-background/30 bg-background/10 text-base font-medium text-background backdrop-blur transition-colors active:bg-background/20"
            >
              I already have one
            </Link>
            <Link
              to="/home"
              className="flex w-full items-center justify-center pt-1 text-xs font-medium uppercase tracking-[0.2em] text-background/70"
            >
              Continue as guest →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
