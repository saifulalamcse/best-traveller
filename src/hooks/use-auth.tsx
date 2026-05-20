import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AuthInfo = {
  loading: boolean;
  session: Session | null;
  user: User | null;
  isGuest: boolean;
  displayName: string;
  email: string;
};

export function useAuth(): AuthInfo {
  const [session, setSession] = useState<Session | null>(null);
  const [profileName, setProfileName] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const uid = session?.user?.id;
    if (!uid) {
      setProfileName("");
      return;
    }
    supabase
      .from("profiles")
      .select("full_name")
      .eq("id", uid)
      .maybeSingle()
      .then(({ data }) => setProfileName(data?.full_name ?? ""));
  }, [session?.user?.id]);

  const user = session?.user ?? null;
  const fallback =
    (user?.user_metadata as { full_name?: string } | undefined)?.full_name ||
    user?.email?.split("@")[0] ||
    "";
  return {
    loading,
    session,
    user,
    isGuest: !session,
    displayName: profileName || fallback || "Traveller",
    email: user?.email ?? "",
  };
}