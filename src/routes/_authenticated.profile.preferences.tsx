import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ProfileSubHeader } from "@/components/ProfileSubHeader";
import { useLocalStore, TRAVEL_PREFS_KEY } from "@/lib/local-store";
import { toast } from "sonner";

type Prefs = {
  styles: string[];
  pace: string;
  diet: string[];
  notifications: boolean;
  deals: boolean;
};

const STYLES = ["Beach lover", "Mountain hiker", "City explorer", "Cultural", "Desert", "Solo traveler", "Family", "Couple"];
const PACES = ["Relaxed", "Balanced", "Packed"];
const DIETS = ["Vegetarian", "Vegan", "Halal", "Kosher", "Gluten-free", "No restrictions"];

export const Route = createFileRoute("/_authenticated/profile/preferences")({ component: TravelPrefs });

function TravelPrefs() {
  const [prefs, setPrefs] = useLocalStore<Prefs>(TRAVEL_PREFS_KEY, {
    styles: [], pace: "Balanced", diet: [], notifications: true, deals: true,
  });

  const toggleArr = (key: "styles" | "diet", v: string) =>
    setPrefs((p) => ({ ...p, [key]: p[key].includes(v) ? p[key].filter((x) => x !== v) : [...p[key], v] }));

  return (
    <AppShell>
      <ProfileSubHeader title="Travel preferences" subtitle="Tailor your recommendations" />
      <div className="space-y-6 px-5 pt-2 pb-4">
        <Section title="Travel styles">
          <Chips options={STYLES} selected={prefs.styles} onToggle={(v) => toggleArr("styles", v)} />
        </Section>

        <Section title="Trip pace">
          <Chips options={PACES} selected={[prefs.pace]} onToggle={(v) => setPrefs((p) => ({ ...p, pace: v }))} single />
        </Section>

        <Section title="Dietary preferences">
          <Chips options={DIETS} selected={prefs.diet} onToggle={(v) => toggleArr("diet", v)} />
        </Section>

        <Section title="Notifications">
          <Toggle label="Trip reminders" checked={prefs.notifications} onChange={(v) => setPrefs((p) => ({ ...p, notifications: v }))} />
          <Toggle label="Deals & inspiration" checked={prefs.deals} onChange={(v) => setPrefs((p) => ({ ...p, deals: v }))} />
        </Section>

        <button
          onClick={() => toast.success("Preferences saved")}
          className="h-12 w-full rounded-2xl bg-foreground text-sm font-semibold text-background"
        >
          Save preferences
        </button>
      </div>
    </AppShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl bg-card p-5 shadow-soft">
      <h2 className="mb-3 font-display text-base text-foreground">{title}</h2>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

function Chips({ options, selected, onToggle, single }: { options: string[]; selected: string[]; onToggle: (v: string) => void; single?: boolean }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = selected.includes(o);
        return (
          <button
            key={o}
            type="button"
            onClick={() => onToggle(o)}
            aria-pressed={active}
            className={`rounded-full px-4 py-2 text-xs font-medium transition-colors ${
              active ? "bg-foreground text-background" : "bg-secondary text-foreground hover:bg-secondary/80"
            } ${single ? "" : ""}`}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-2xl px-1 py-2">
      <span className="text-sm text-foreground">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition-colors ${checked ? "bg-foreground" : "bg-muted"}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-background shadow transition-all ${checked ? "left-5" : "left-0.5"}`} />
      </button>
    </label>
  );
}