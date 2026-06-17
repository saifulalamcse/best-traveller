import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Send, Sparkles, Mic } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { GuestGate } from "@/components/GuestGate";

export const Route = createFileRoute("/_authenticated/chat")({
  component: () => (
    <GuestGate
      feature="Chat"
      description="Sign up to chat with our AI travel coach and plan trips together."
    >
      <Chat />
    </GuestGate>
  ),
});

type Msg = { from: "ai" | "me"; text: string };

const seed: Msg[] = [
  { from: "ai", text: "Morning, Ada. Want me to sketch a 4-day Lisbon trip under $1,200?" },
  { from: "me", text: "Yes — and include something coastal." },
  { from: "ai", text: "On it. I'll suggest a stay in Cascais, two day-trips, and a sunset spot you'll love." },
];

const suggestions = ["Plan a weekend", "Find a quiet beach", "Best food in Tokyo"];

function mockReply(text: string): string {
  const q = text.toLowerCase();
  if (q.includes("lisbon")) {
    return "Here's a 4-day Lisbon sketch: nights at Memmo Alfama, a day-trip to Cascais for cliffside lunch at Furnas do Guincho, sunset at Miradouro da Graça, and a pastel de nata crawl in Belém. Want me to lock in dates?";
  }
  if (q.includes("weekend") || q.includes("plan a weekend")) {
    return "Cozy 2-day getaway idea: check into Six Senses Douro Valley on Fri at 3pm, vineyard tour Sat morning, river cruise Sat sunset, slow brunch Sun before 12pm checkout. Shall I price it out?";
  }
  if (q.includes("beach") || q.includes("quiet beach")) {
    return "Try Nihiwatu (Sumba, Indonesia) — secluded cliffside villas, private surf break, and a 3-night package from $1,180pp including transfers. Want alternatives under $800?";
  }
  if (q.includes("tokyo") || q.includes("food")) {
    return "Tokyo food shortlist: Sushi Saito (omakase, book months out), Ichiran Shibuya for tonkotsu ramen, Afuri for yuzu shio, Tsukiji Outer Market for tamago & uni, and Omoide Yokocho for late-night yakitori.";
  }
  return "That sounds amazing! I can help you find resorts, calculate trip costs, or plan activities there. What's your estimated budget?";
}

function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>(seed);
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, typing]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((m) => [...m, { from: "me", text: trimmed }]);
    setInput("");
    setTyping(true);
    window.setTimeout(() => {
      setMessages((m) => [...m, { from: "ai", text: mockReply(trimmed) }]);
      setTyping(false);
      inputRef.current?.focus();
    }, 1000);
  }

  return (
    <AppShell>
      <header className="flex items-center justify-between px-5 pt-12">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">AI Coach</p>
          <h1 className="mt-1 font-display text-3xl text-foreground">Wander.</h1>
        </div>
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/20" aria-hidden="true">
          <Sparkles size={18} className="text-accent" />
        </span>
      </header>
      <div className="mt-6 space-y-3 px-5 pb-44">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-3xl px-4 py-3 text-sm leading-relaxed ${
                m.from === "me"
                  ? "rounded-br-md bg-foreground text-background"
                  : "rounded-bl-md bg-card text-foreground shadow-soft"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1 rounded-3xl rounded-bl-md bg-card px-4 py-3 shadow-soft">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.2s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.1s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" />
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>
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
      <div className="fixed inset-x-0 bottom-20 z-40 mx-auto max-w-[480px] px-5">
        <form
          className="flex items-center gap-2 rounded-3xl border border-border bg-card p-2 shadow-card"
          onSubmit={(e) => { e.preventDefault(); send(input); }}
        >
          <label htmlFor="chat-input" className="sr-only">Message Wander AI coach</label>
          <input
            id="chat-input"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about travel…"
            className="flex-1 bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
          />
          <button type="button" aria-label="Voice input" className="flex h-10 w-10 items-center justify-center rounded-2xl text-muted-foreground transition-all hover:bg-muted active:scale-95">
            <Mic size={18} />
          </button>
          <button type="submit" aria-label="Send message" disabled={!input.trim()} className="flex h-10 w-10 items-center justify-center rounded-2xl bg-foreground text-background transition-all active:scale-95 disabled:opacity-40">
            <Send size={16} />
          </button>
        </form>
      </div>
    </AppShell>
  );
}