import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ProfileSubHeader } from "@/components/ProfileSubHeader";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/profile/settings")({ component: AccountSettings });

function AccountSettings() {
  const { user, email, displayName } = useAuth();
  const [name, setName] = useState(displayName);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => { setName(displayName); }, [displayName]);
  useEffect(() => {
    if (!user?.id) return;
    supabase.from("profiles").select("phone").eq("id", user.id).maybeSingle().then(({ data }) => {
      if (data && (data as { phone?: string }).phone) setPhone((data as { phone: string }).phone);
    });
  }, [user?.id]);

  const saveProfile = async () => {
    if (!user?.id) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({ full_name: name }).eq("id", user.id);
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Profile updated");
  };

  const changePassword = async () => {
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    const { error } = await supabase.auth.updateUser({ password });
    if (error) return toast.error(error.message);
    setPassword("");
    toast.success("Password updated");
  };

  return (
    <AppShell>
      <ProfileSubHeader title="Account settings" subtitle="Personal information" />
      <div className="space-y-5 px-5 pt-2">
        <section className="space-y-3 rounded-3xl bg-card p-5 shadow-soft">
          <Field label="Full name" value={name} onChange={setName} />
          <Field label="Email" value={email} onChange={() => {}} disabled />
          <Field label="Phone" value={phone} onChange={setPhone} placeholder="+1 555 000 0000" />
          <button onClick={saveProfile} disabled={saving} className="h-11 w-full rounded-2xl bg-foreground text-sm font-semibold text-background disabled:opacity-60">
            {saving ? "Saving…" : "Save changes"}
          </button>
        </section>

        <section className="space-y-3 rounded-3xl bg-card p-5 shadow-soft">
          <h2 className="font-display text-base text-foreground">Change password</h2>
          <Field label="New password" value={password} onChange={setPassword} type="password" placeholder="••••••••" />
          <button onClick={changePassword} className="h-11 w-full rounded-2xl border border-border bg-background text-sm font-semibold text-foreground">
            Update password
          </button>
        </section>
      </div>
    </AppShell>
  );
}

function Field({ label, value, onChange, type = "text", placeholder, disabled }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; disabled?: boolean }) {
  return (
    <label className="block">
      <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      <input
        value={value}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 h-11 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground disabled:opacity-60"
      />
    </label>
  );
}