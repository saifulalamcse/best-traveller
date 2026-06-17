import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import type { Database } from "@/integrations/supabase/types";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const SYSTEM_PROMPT = `You are Wander, a warm and knowledgeable AI travel coach inside the Wanderlust Planner app.
Help the user plan trips, suggest destinations, build itineraries, find stays, estimate budgets, and answer travel questions.
Be concise, friendly, and concrete. Use short paragraphs and bullet lists when helpful. Use markdown for structure.
If you don't know something, say so and offer a useful next step.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const auth = request.headers.get("authorization");
          if (!auth?.startsWith("Bearer ")) {
            return new Response("Unauthorized", { status: 401 });
          }
          const token = auth.slice(7);

          const SUPABASE_URL = process.env.SUPABASE_URL;
          const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;
          const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
          if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
            return new Response("Missing Supabase env", { status: 500 });
          }
          if (!LOVABLE_API_KEY) {
            return new Response("Missing LOVABLE_API_KEY", { status: 500 });
          }

          const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
            global: { headers: { Authorization: `Bearer ${token}` } },
            auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
          });

          const { data: userData, error: userErr } = await supabase.auth.getUser(token);
          if (userErr || !userData.user) {
            return new Response("Unauthorized", { status: 401 });
          }
          const userId = userData.user.id;

          const body = (await request.json()) as {
            messages: UIMessage[];
            threadId: string;
          };
          const { messages, threadId } = body;
          if (!threadId || !Array.isArray(messages)) {
            return new Response("Bad request", { status: 400 });
          }

          // Confirm thread belongs to user (RLS will also enforce)
          const { data: thread, error: threadErr } = await supabase
            .from("chat_threads")
            .select("id, title")
            .eq("id", threadId)
            .maybeSingle();
          if (threadErr || !thread) {
            return new Response("Thread not found", { status: 404 });
          }

          // Persist the latest user message (last in messages array)
          const lastUser = [...messages].reverse().find((m) => m.role === "user");
          if (lastUser) {
            await supabase.from("chat_messages_v2").insert({
              thread_id: threadId,
              user_id: userId,
              role: "user",
              parts: lastUser.parts as unknown as Database["public"]["Tables"]["chat_messages_v2"]["Insert"]["parts"],
            });

            // Auto-title from first user message if still default
            if (thread.title === "New chat") {
              const text = lastUser.parts
                .map((p) => (p.type === "text" ? p.text : ""))
                .join(" ")
                .trim();
              if (text) {
                const title = text.length > 60 ? text.slice(0, 60) + "…" : text;
                await supabase.from("chat_threads").update({ title }).eq("id", threadId);
              }
            }
          }

          const gateway = createLovableAiGatewayProvider(LOVABLE_API_KEY);
          const model = gateway("google/gemini-3.1-pro-preview");

          const result = streamText({
            model,
            system: SYSTEM_PROMPT,
            messages: convertToModelMessages(messages),
          });

          return result.toUIMessageStreamResponse({
            originalMessages: messages,
            onFinish: async ({ messages: finalMessages }) => {
              const assistant = [...finalMessages].reverse().find((m) => m.role === "assistant");
              if (assistant) {
                await supabase.from("chat_messages_v2").insert({
                  thread_id: threadId,
                  user_id: userId,
                  role: "assistant",
                  parts: assistant.parts as unknown as Database["public"]["Tables"]["chat_messages_v2"]["Insert"]["parts"],
                });
                await supabase
                  .from("chat_threads")
                  .update({ updated_at: new Date().toISOString() })
                  .eq("id", threadId);
              }
            },
          });
        } catch (err) {
          console.error("[/api/chat] error", err);
          const message = err instanceof Error ? err.message : "Server error";
          return new Response(message, { status: 500 });
        }
      },
    },
  },
});