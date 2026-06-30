import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ProfileSubHeader } from "@/components/ProfileSubHeader";
import { useLocalStore, PAYMENT_METHODS_KEY } from "@/lib/local-store";
import { CreditCard, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Card = { id: string; brand: string; last4: string; expiry: string; holder: string };

export const Route = createFileRoute("/_authenticated/profile/payment")({ component: PaymentMethods });

const detectBrand = (num: string) => {
  const n = num.replace(/\s/g, "");
  if (/^4/.test(n)) return "Visa";
  if (/^5[1-5]/.test(n)) return "Mastercard";
  if (/^3[47]/.test(n)) return "Amex";
  return "Card";
};

function PaymentMethods() {
  const [cards, setCards] = useLocalStore<Card[]>(PAYMENT_METHODS_KEY, []);
  const [open, setOpen] = useState(false);
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [holder, setHolder] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const digits = number.replace(/\s/g, "");
    if (digits.length < 13) return toast.error("Enter a valid card number");
    if (!/^\d{2}\/\d{2}$/.test(expiry)) return toast.error("Expiry must be MM/YY");
    if (cvv.length < 3) return toast.error("Invalid CVV");
    if (!holder.trim()) return toast.error("Cardholder name required");
    const card: Card = {
      id: crypto.randomUUID(),
      brand: detectBrand(digits),
      last4: digits.slice(-4),
      expiry,
      holder: holder.trim(),
    };
    setCards((p) => [card, ...p]);
    setNumber(""); setExpiry(""); setCvv(""); setHolder(""); setOpen(false);
    toast.success("Card added");
  };

  return (
    <AppShell>
      <ProfileSubHeader title="Payment methods" subtitle="Manage your cards" />
      <div className="space-y-3 px-5 pt-2">
        {cards.length === 0 && !open ? (
          <div className="rounded-3xl bg-card p-6 text-center shadow-soft">
            <CreditCard size={26} className="mx-auto text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">No cards saved yet.</p>
          </div>
        ) : (
          cards.map((c) => (
            <div key={c.id} className="flex items-center gap-3 rounded-3xl bg-foreground p-4 text-background shadow-card">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-background/15">
                <CreditCard size={20} />
              </div>
              <div className="flex-1">
                <p className="text-xs uppercase tracking-widest opacity-70">{c.brand}</p>
                <p className="font-mono text-base">•••• {c.last4}</p>
                <p className="text-[11px] opacity-70">{c.holder} · {c.expiry}</p>
              </div>
              <button
                onClick={() => { setCards((p) => p.filter((x) => x.id !== c.id)); toast.success("Card removed"); }}
                className="rounded-full p-2 text-background/80 hover:bg-background/10"
                aria-label="Delete card"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}

        {open ? (
          <form onSubmit={submit} className="space-y-3 rounded-3xl bg-card p-5 shadow-soft">
            <h2 className="font-display text-lg text-foreground">Add new card</h2>
            <input value={holder} onChange={(e) => setHolder(e.target.value)} placeholder="Cardholder name" className="h-11 w-full rounded-2xl border border-border bg-background px-4 text-sm" />
            <input value={number} onChange={(e) => setNumber(e.target.value.replace(/[^\d ]/g, "").slice(0, 19))} placeholder="Card number" inputMode="numeric" className="h-11 w-full rounded-2xl border border-border bg-background px-4 font-mono text-sm" />
            <div className="grid grid-cols-2 gap-3">
              <input value={expiry} onChange={(e) => setExpiry(e.target.value.replace(/[^\d/]/g, "").slice(0, 5))} placeholder="MM/YY" className="h-11 rounded-2xl border border-border bg-background px-4 text-sm" />
              <input value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="CVV" inputMode="numeric" className="h-11 rounded-2xl border border-border bg-background px-4 text-sm" />
            </div>
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={() => setOpen(false)} className="h-11 flex-1 rounded-2xl border border-border bg-background text-sm font-medium">Cancel</button>
              <button type="submit" className="h-11 flex-1 rounded-2xl bg-foreground text-sm font-semibold text-background">Save card</button>
            </div>
          </form>
        ) : (
          <button onClick={() => setOpen(true)} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-card text-sm font-semibold text-foreground transition-colors hover:bg-secondary">
            <Plus size={16} /> Add new card
          </button>
        )}
      </div>
    </AppShell>
  );
}