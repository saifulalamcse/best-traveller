import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

export type PersistedMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  text: string;
};

export type ThreadRow = {
  id: string;
  title: string;
  updated_at: string;
  created_at: string;
};

export const listThreads = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<ThreadRow[]> => {
    const { data, error } = await context.supabase
      .from("chat_threads")
      .select("id, title, updated_at, created_at")
      .order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const createThread = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<ThreadRow> => {
    const { data, error } = await context.supabase
      .from("chat_threads")
      .insert({ user_id: context.userId, title: "New chat" })
      .select("id, title, updated_at, created_at")
      .single();
    if (error) throw new Error(error.message);
    return data;
  });

export const deleteThread = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("chat_threads")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getThreadMessages = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ threadId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: rows, error } = await context.supabase
      .from("chat_messages_v2")
      .select("id, role, parts, created_at")
      .eq("thread_id", data.threadId)
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    const msgs: PersistedMessage[] = (rows ?? []).map((r) => {
      const parts = Array.isArray(r.parts) ? (r.parts as Array<{ type: string; text?: string }>) : [];
      const text = parts
        .filter((p) => p && p.type === "text" && typeof p.text === "string")
        .map((p) => p.text as string)
        .join("");
      return {
        id: r.id,
        role: r.role as PersistedMessage["role"],
        text,
      };
    });
    return msgs;
  });