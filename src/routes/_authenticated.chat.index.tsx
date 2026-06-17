import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AppShell } from "@/components/AppShell";
import { GuestGate } from "@/components/GuestGate";
import { useAuth } from "@/hooks/use-auth";
import { listThreads, createThread } from "@/lib/chat.functions";

export const Route = createFileRoute("/_authenticated/chat/")({
  component: () => (
    <GuestGate
      feature="Chat"
      description="Sign up to chat with our AI travel coach and plan trips together."
    >
      <ChatIndex />
    </GuestGate>
  ),
});

function ChatIndex() {
  const navigate = useNavigate();
  const { isGuest, loading } = useAuth();
  const list = useServerFn(listThreads);
  const create = useServerFn(createThread);
  const started = useRef(false);

  useEffect(() => {
    if (loading || isGuest || started.current) return;
    started.current = true;
    (async () => {
      try {
        const threads = await list();
        const target = threads[0] ?? (await create());
        navigate({ to: "/chat/$threadId", params: { threadId: target.id }, replace: true });
      } catch (e) {
        console.error(e);
      }
    })();
  }, [loading, isGuest, list, create, navigate]);

  return (
    <AppShell>
      <div className="px-5 pt-24 text-center text-sm text-muted-foreground">Opening your chat…</div>
    </AppShell>
  );
}