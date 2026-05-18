import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Send, Sparkles, Mic } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/chat")({ component: Chat });

const seed = [
  { from: "ai", text: "Morning, Ada. Want me to sketch a 4-day Lisbon trip under $1,200?" },
  { from: "me", text: "Yes — and include something coastal." },
  { from: "ai", text: "On it. I'll suggest a stay in Cascais, two day-trips, and a sunset spot you'll love." },
];

const suggestions = ["Plan a weekend", "Find a quiet beach", "Best food in Tokyo"];

function Chat() {
  const [input, setInput] = useState("");
  return (
    <AppShell>
      <header className="flex items-center justify-between px-5 pt-12">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">AI Coach</p>
          <h1 className="mt-1 font-display text-3xl text-foreground">Wander.</h1>
        </div>
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/20">
          <Sparkles size={18} className="text-accent" />
        </span>
      </header>
      <div className="mt-6 space-y-3 px-5">
        {seed.map((m, i) => (
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
      </div>
      <div className="mt-6 flex gap-2 overflow-x-auto px-5 pb-2 [&::-webkit-scrollbar]:hidden">
        {suggestions.map((s) => (
          <button key={s} className="shrink-0 rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-foreground">
            {s}
          </button>
        ))}
      </div>
      <div className="fixed inset-x-0 bottom-20 z-40 mx-auto max-w-[480px] px-5">
        <div className="flex items-center gap-2 rounded-3xl border border-border bg-card p-2 shadow-card">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about travel…"
            className="flex-1 bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
          />
          <button className="flex h-10 w-10 items-center justify-center rounded-2xl text-muted-foreground">
            <Mic size={18} />
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-2xl bg-foreground text-background">
            <Send size={16} />
          </button>
        </div>
      </div>
    </AppShell>
  );
}