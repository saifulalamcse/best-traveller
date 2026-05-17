import { Link, useLocation } from "@tanstack/react-router";
import { Home, Compass, MapPin, MessageCircle, User } from "lucide-react";

const tabs = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/itineraries", label: "Trips", icon: MapPin },
  { to: "/chat", label: "Chat", icon: MessageCircle },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-[480px] -translate-x-1/2 border-t border-border/60 bg-background/85 px-2 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur-xl">
      <ul className="flex items-center justify-between">
        {tabs.map(({ to, label, icon: Icon }) => {
          const active = pathname === to || (to === "/home" && pathname === "/");
          return (
            <li key={to} className="flex-1">
              <Link
                to={to}
                className="group flex flex-col items-center gap-1 rounded-2xl px-2 py-2 transition-colors"
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-2xl transition-all ${
                    active ? "bg-primary text-primary-foreground shadow-soft" : "text-muted-foreground"
                  }`}
                >
                  <Icon size={18} strokeWidth={2.2} />
                </span>
                <span className={`text-[10px] font-medium tracking-wide ${active ? "text-foreground" : "text-muted-foreground"}`}>
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}