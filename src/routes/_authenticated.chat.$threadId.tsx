import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { GuestGate } from "@/components/GuestGate";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  listThreads,
  createThread,
  deleteThread,
  getThreadMessages,
  type PersistedMessage,
  type ThreadRow,
} from "@/lib/chat.functions";
import { Send, Sparkles, Mic, Plus, Menu, Trash2, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

const suggestions = ["Plan a weekend in Lisbon", "Find a quiet beach", "Best food in Tokyo"];

export const Route = createFileRoute("/_authenticated/chat/$threadId")({
  component: () => (
    <GuestGate
      feature="Chat"
      description="Sign up to chat with our AI travel coach and plan trips together."
    >
      <ChatThread />
    </GuestGate>
  ),
});

function ChatThread() {
  const { threadId } = useParams({ from: "/_authenticated/chat/$threadId" });
  const navigate = useNavigate();
  const qc = useQueryClient();
  const fetchThreads = useServerFn(listThreads);
  const fetchMessages = useServerFn(getThreadMessages);
  const createNew = useServerFn(createThread);
  const removeThread = useServerFn(deleteThread);

  const threadsQuery = useQuery({
    queryKey: ["chat-threads"],
    queryFn: () => fetchThreads(),
  });

  const messagesQuery = useQuery({
    queryKey: ["chat-messages", threadId],
    queryFn: () => fetchMessages({ data: { threadId } }),
  });

  const initialMessages = useMemo<UIMessage[]>(
    () =>
      (messagesQuery.data ?? []).map((m: PersistedMessage) => ({
        id: m.id,
        role: m.role,
        parts: [{ type: "text", text: m.text }],
      })),
    [messagesQuery.data],
  );

  // Token attached lazily so /api/chat can verify the user
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        prepareSendMessagesRequest: async ({ messages, body }) => {
          const { data } = await supabase.auth.getSession();
          const token = data.session?.access_token;
          const headers: Record<string, string> = {};
          if (token) headers.Authorization = `Bearer ${token}`;
          return {
            body: { messages, threadId, ...(body ?? {}) },
            headers,
          };
        },
      }),
    [threadId],
  );

  const { messages, sendMessage, status, error, setMessages } = useChat({
    id: threadId,
    transport,
    onError: (e) => {
      toast.error(e.message || "Chat failed");
    },
    onFinish: () => {
      qc.invalidateQueries({ queryKey: ["chat-threads"] });
    },
  });

  // Hydrate messages when loaded from DB
  useEffect(() => {
    if (messagesQuery.data) setMessages(initialMessages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMessages, threadId]);

  const [input, setInput] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, status]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [threadId]);

  const isLoading = status === "submitted" || status === "streaming";

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;
    setInput("");
    sendMessage({ text: trimmed });
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  async function handleNewChat() {
    try {
      const t = await createNew();
      qc.invalidateQueries({ queryKey: ["chat-threads"] });
      setDrawerOpen(false);
      navigate({ to: "/chat/$threadId", params: { threadId: t.id } });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not create chat");
    }
  }

  async function handleDelete(id: string) {
    try {
      await removeThread({ data: { id } });
      const remaining = (threadsQuery.data ?? []).filter((t) => t.id !== id);
      qc.invalidateQueries({ queryKey: ["chat-threads"] });
      if (id === threadId) {
        if (remaining[0]) {
          navigate({ to: "/chat/$threadId", params: { threadId: remaining[0].id }, replace: true });
        } else {
          navigate({ to: "/chat", replace: true });
        }
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not delete chat");
    }
  }

  return (
    <AppShell>
      <header className="flex items-center justify-between px-5 pt-12">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open chats"
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-card text-foreground transition-all active:scale-95"
        >
          <Menu size={18} />
        </button>
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">AI Coach</p>
          <h1 className="mt-1 font-display text-2xl text-foreground">Wander.</h1>
        </div>
        <button
          type="button"
          onClick={handleNewChat}
          aria-label="New chat"
          className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/20 text-accent transition-all active:scale-95"
        >
          <Plus size={18} />
        </button>
      </header>

      <div className="mt-6 space-y-3 px-5 pb-44">
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center pt-12 text-center">
            <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-accent/20 text-accent">
              <Sparkles size={22} />
            </span>
            <h2 className="font-display text-2xl text-foreground">Hi, I'm Wander</h2>
            <p className="mt-2 max-w-xs text-sm text-muted-foreground">
              Ask me anything about travel — destinations, itineraries, budgets, or hidden spots.
            </p>
          </div>
        )}
        {messages.map((m) => {
          const text = m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
          return (
            <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-3xl px-4 py-3 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "rounded-br-md bg-foreground text-background"
                    : "rounded-bl-md bg-card text-foreground shadow-soft"
                }`}
              >
                {m.role === "user" ? (
                  text
                ) : (
                  <div className="prose prose-sm max-w-none text-foreground [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_a]:text-accent [&_p]:my-1.5 [&_ul]:my-1.5 [&_ol]:my-1.5">
                    <ReactMarkdown>{text || "…"}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1 rounded-3xl rounded-bl-md bg-card px-4 py-3 shadow-soft">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.2s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.1s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" />
            </div>
          </div>
        )}
        {error && (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-xs text-destructive">
            {error.message}
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {messages.length === 0 && (
        <div className="fixed inset-x-0 bottom-36 z-40 mx-auto flex max-w-[480px] gap-2 overflow-x-auto px-5 pb-2 [&::-webkit-scrollbar]:hidden">
          {suggestions.map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => send(s)}
              className="shrink-0 rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-foreground transition-all hover:bg-muted active:scale-95"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="fixed inset-x-0 bottom-20 z-40 mx-auto max-w-[480px] px-5">
        <form
          className="flex items-center gap-2 rounded-3xl border border-border bg-card p-2 shadow-card"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <label htmlFor="chat-input" className="sr-only">Message Wander AI coach</label>
          <input
            id="chat-input"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about travel…"
            disabled={isLoading}
            className="flex-1 bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none disabled:opacity-60"
          />
          <button
            type="button"
            aria-label="Voice input"
            className="flex h-10 w-10 items-center justify-center rounded-2xl text-muted-foreground transition-all hover:bg-muted active:scale-95"
          >
            <Mic size={18} />
          </button>
          <button
            type="submit"
            aria-label="Send message"
            disabled={!input.trim() || isLoading}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-foreground text-background transition-all active:scale-95 disabled:opacity-40"
          >
            <Send size={16} />
          </button>
        </form>
      </div>

      {drawerOpen && (
        <ThreadDrawer
          activeId={threadId}
          threads={threadsQuery.data ?? []}
          onClose={() => setDrawerOpen(false)}
          onNew={handleNewChat}
          onDelete={handleDelete}
        />
      )}
    </AppShell>
  );
}

function ThreadDrawer({
  activeId,
  threads,
  onClose,
  onNew,
  onDelete,
}: {
  activeId: string;
  threads: ThreadRow[];
  onClose: () => void;
  onNew: () => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <aside className="absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-background shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-display text-lg text-foreground">Your chats</h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-4 pt-3">
          <button
            type="button"
            onClick={onNew}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-foreground py-3 text-sm font-semibold text-background transition-all active:scale-[0.98]"
          >
            <Plus size={16} /> New chat
          </button>
        </div>
        <ul className="mt-4 space-y-1 overflow-y-auto px-3 pb-8" style={{ maxHeight: "calc(100% - 130px)" }}>
          {threads.length === 0 && (
            <li className="px-3 py-6 text-center text-xs text-muted-foreground">No chats yet</li>
          )}
          {threads.map((t) => {
            const active = t.id === activeId;
            return (
              <li key={t.id} className="flex items-center gap-1">
                <Link
                  to="/chat/$threadId"
                  params={{ threadId: t.id }}
                  onClick={onClose}
                  className={`flex-1 truncate rounded-xl px-3 py-2.5 text-sm transition-colors ${
                    active
                      ? "bg-accent/20 text-foreground font-medium"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  {t.title || "New chat"}
                </Link>
                <button
                  type="button"
                  aria-label="Delete chat"
                  onClick={() => onDelete(t.id)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 size={15} />
                </button>
              </li>
            );
          })}
        </ul>
      </aside>
    </div>
  );
}