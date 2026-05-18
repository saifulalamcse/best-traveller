import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Lock } from "lucide-react";

export const Route = createFileRoute("/reset-password")({ component: ResetPassword });

function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => { if (data.session) setReady(true); });
    return () => sub.subscription.unsubscribe();
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) { setStatus(error.message); return; }
    setStatus("Password updated.");
    setTimeout(() => navigate({ to: "/home" }), 800);
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[480px] flex-col bg-background px-6 pt-16">
      <h1 className="font-display text-4xl">Set a new password</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {ready ? "Enter your new password below." : "Open this page from the email link to continue."}
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3.5">
          <Lock size={16} className="text-muted-foreground" />
          <input
            type="password" required minLength={6} value={password}
            onChange={(e) => setPassword(e.target.value)} placeholder="New password"
            className="flex-1 bg-transparent text-sm focus:outline-none"
          />
        </div>
        <button type="submit" disabled={!ready || loading}
          className="flex h-14 w-full items-center justify-center rounded-2xl bg-foreground text-base font-semibold text-background disabled:opacity-50">
          {loading ? "Updating…" : "Update password"}
        </button>
        {status && <p className="text-center text-sm text-muted-foreground">{status}</p>}
      </form>
    </div>
  );
}
