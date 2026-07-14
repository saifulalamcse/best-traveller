## Add Gemini + ChatGPT model selection to Chat

Good news — your chat is already wired to Lovable AI, which routes to both Google Gemini and OpenAI GPT models through one gateway. No API keys needed (the `LOVABLE_API_KEY` is already provisioned). Today it's hardcoded to `google/gemini-3.1-pro-preview`. I'll expose a picker so you can switch models per chat.

### What you'll get

- A model dropdown in the chat header (next to "Wander") with these choices:
  - **Gemini 3 Flash** (`google/gemini-3-flash-preview`) — fast default
  - **Gemini 3.1 Pro** (`google/gemini-3.1-pro-preview`) — current, deeper reasoning
  - **Gemini 2.5 Flash** (`google/gemini-2.5-flash`) — balanced
  - **GPT-5** (`openai/gpt-5`) — OpenAI flagship
  - **GPT-5 mini** (`openai/gpt-5-mini`) — cheaper OpenAI
  - **GPT-5 nano** (`openai/gpt-5-nano`) — fastest OpenAI
- Selection persists per thread (saved on `chat_threads.model`), so each conversation remembers its model.
- New chats default to Gemini 3 Flash.
- Server validates the model against an allowlist before calling the gateway.

### Plan

1. **DB migration** — add `model text` column to `chat_threads` (nullable, defaults to `google/gemini-3-flash-preview`).
2. **`src/routes/api/chat.ts`** — accept `model` in the request body, validate against the allowlist, and pass it to `gateway(model)`. Persist it back to the thread.
3. **`src/lib/chat.functions.ts`** — add `updateThreadModel({ id, model })` server fn; include `model` in `listThreads` / `getThreadMessages` returns.
4. **`src/routes/_authenticated.chat.$threadId.tsx`** — add a compact model dropdown in the header. On change: update local state, persist via `updateThreadModel`, and include `model` in the transport body.
5. Keep the existing system prompt, streaming, markdown rendering, and thread drawer unchanged.

### Notes

- No new secrets, no new packages.
- Billing: all model usage goes through your Lovable AI credits (free monthly allowance, then paid). GPT-5 costs more per request than Gemini Flash.
- If you'd rather have a global default (set once in Profile) instead of per-chat, tell me and I'll adjust step 4.

Want me to proceed?
