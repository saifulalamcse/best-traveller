import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";

export function ProfileSubHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="sticky top-0 z-10 bg-background/85 px-5 pb-3 pt-10 backdrop-blur-xl">
      <Link
        to="/profile"
        className="-ml-2 inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary"
        aria-label="Back to profile"
      >
        <ChevronLeft size={20} />
      </Link>
      <h1 className="mt-2 font-display text-2xl text-foreground">{title}</h1>
      {subtitle ? <p className="text-xs text-muted-foreground">{subtitle}</p> : null}
    </header>
  );
}