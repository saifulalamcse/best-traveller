import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto min-h-screen w-full max-w-[480px] bg-background pb-28">
      {children}
      <BottomNav />
    </div>
  );
}