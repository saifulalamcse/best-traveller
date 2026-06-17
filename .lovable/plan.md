## Make the Chat fully functional with real AI + threaded history

Right now the chat replies with hardcoded mock text (same message for every input), and conversations aren't saved. I'll replace it with a real AI-powered chat using Lovable AI (Gemini 3 Pro), with threaded conversations persisted in the database per user.

### What you'll get
- Real AI travel coach (Gemini 3 Pro) that actually understands your messages
- Streaming responses (text appears word-by-word, not after a long wait)
- Multiple chat threads with a sidebar/list (New Chat button, switch between past chats, delete)
- Each thread lives at its own URL (`/chat/:threadId`) and reloads correctly
- All messages saved to your account in the database — survives refresh and works across devices
- Polished chat UI built on AI Elements (proper bubbles, auto-scroll, typing/shimmer state, markdown rendering)
- Friendly errors for rate limits / out-of-credits

### Plan

1. **Database** — add two tables:
   - `chat_threads` (id, user_id, title, updated_at) — RLS scoped to `auth.uid()`
   - `chat_messages_v2` (id, thread_id, role, parts jsonb, created_at) — RLS via thread ownership
   - (Existing `chat_messages` table stays untouched.)

2. **Server route** `src/routes/api/chat.ts` — streaming endpoint using AI SDK + Lovable AI Gateway (`google/gemini-3.1-pro-preview`), with a travel-coach system prompt. Verifies the user, loads the thread, streams the reply, and saves the assistant message in `onFinish`.

3. **Server functions** (`src/lib/chat.functions.ts`) — `listThreads`, `createThread`, `deleteThread`, `getThreadMessages`, all auth-gated.

4. **Routes**:
   - `/_authenticated/chat/index.tsx` — redirects to the latest thread or creates a new one
   - `/_authenticated/chat/$threadId.tsx` — the chat screen, keyed by threadId
   - Sidebar/drawer with thread list, "New chat" button, delete action

5. **UI** — install AI Elements (`conversation`, `message`, `prompt-input`, `shimmer`, `response`) and rebuild the chat screen using them. Keep the existing visual style (rounded bubbles, bottom nav, suggestion pills). Render markdown in AI replies.

6. **Guest flow** — guests still hit the existing `GuestGate` (sign up to chat). No changes there.

### Technical notes
- Uses Lovable AI (no API key setup needed — `LOVABLE_API_KEY` is already provisioned)
- Model: `google/gemini-3.1-pro-preview`
- `useChat` from `@ai-sdk/react` with `DefaultChatTransport` pointed at `/api/chat`
- Bearer auth attached automatically via existing `attachSupabaseAuth` middleware

Want me to proceed?
