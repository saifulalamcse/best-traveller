import { createFileRoute, Outlet } from "@tanstack/react-router";

// Guests are allowed through. Per-feature gates (Chat, Profile, bookings)
// are enforced with <GuestGate /> inside the relevant route components.
export const Route = createFileRoute("/_authenticated")({
  component: () => <Outlet />,
});
