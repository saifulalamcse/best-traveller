CREATE TABLE public.chat_threads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL DEFAULT 'New chat',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_threads TO authenticated;
GRANT ALL ON public.chat_threads TO service_role;
ALTER TABLE public.chat_threads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Threads select own" ON public.chat_threads FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Threads insert own" ON public.chat_threads FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Threads update own" ON public.chat_threads FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Threads delete own" ON public.chat_threads FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER chat_threads_updated_at BEFORE UPDATE ON public.chat_threads FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.chat_messages_v2 (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  thread_id UUID NOT NULL REFERENCES public.chat_threads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL,
  parts JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_messages_v2 TO authenticated;
GRANT ALL ON public.chat_messages_v2 TO service_role;
ALTER TABLE public.chat_messages_v2 ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Messages select own" ON public.chat_messages_v2 FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Messages insert own" ON public.chat_messages_v2 FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Messages delete own" ON public.chat_messages_v2 FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE INDEX chat_messages_v2_thread_idx ON public.chat_messages_v2(thread_id, created_at);