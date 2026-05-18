## Plan: Connect Lovable Cloud for Auth & Database

Enable Lovable Cloud (managed Supabase) and wire it into the existing Wander app for real authentication and persistent data.

### 1. Enable Lovable Cloud
- Provision the backend (Postgres, Auth, Storage, server runtime).
- Auto-generates `src/integrations/supabase/client.ts`, `client.server.ts`, `auth-middleware.ts`, and env vars (`VITE_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, etc.).

### 2. Authentication
- Replace the mock `AuthForm` submit with real Supabase calls:
  - Sign up: `supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + '/home', data: { full_name } } })`
  - Sign in: `supabase.auth.signInWithPassword`
  - Google OAuth via Lovable broker (`lovable.auth.signInWithOAuth('google')`) + `configure_social_auth`
- Add `useAuth` hook with `onAuthStateChange` listener (set up before `getSession`).
- Add `/reset-password` route + "Forgot password" flow using `resetPasswordForEmail`.
- Add `src/routes/_authenticated.tsx` pathless layout that redirects unauthenticated users to `/signin`. Move `home`, `explore`, `itineraries`, `chat`, `profile`, `search` under it.
- Sign-out button in profile.

### 3. Database Schema (migrations)
- `profiles` table (id FK → auth.users, full_name, avatar_url, created_at) with RLS: users read/update own row. Auto-create via `handle_new_user` trigger on `auth.users`.
- `user_roles` table + `app_role` enum + `has_role()` SECURITY DEFINER function (per security guidelines — roles never on profiles).
- `trips` table (id, user_id, destination, start_date, end_date, budget, status, notes, created_at) with RLS: owner CRUD.
- `saved_destinations` table (user_id, destination_slug, created_at) for favorites.
- `chat_messages` table (id, user_id, role, content, created_at) for AI travel coach history.

### 4. Profile screen integration
- Load real profile from `profiles` table via `createServerFn` + `requireSupabaseAuth`.
- Edit name / avatar; saved trip stats from `trips` count.

### 5. Trips integration
- `itineraries.tsx` reads user's trips via server function.
- Add "Create trip" action persisting to `trips`.

### Technical notes
- Use TanStack `createServerFn` for all DB access (not Edge Functions).
- Ensure `attachSupabaseAuth` is registered in `src/start.ts` `functionMiddleware`.
- Add auth state hook at `__root.tsx` that calls `router.invalidate()` + `queryClient.invalidateQueries()` on `onAuthStateChange`.
- Keep public routes (`/`, `/signin`, `/signup`, `/reset-password`) outside `_authenticated`.

### Out of scope (ask if wanted)
- Real hotel booking / payments
- Storage bucket for user-uploaded trip photos
- Email templates customization
