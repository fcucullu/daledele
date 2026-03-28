CREATE TABLE IF NOT EXISTS public.daledele_push_subs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.global_profiles(id) ON DELETE CASCADE,
  endpoint text NOT NULL UNIQUE,
  keys_p256dh text NOT NULL,
  keys_auth text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.daledele_push_subs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert push subs" ON public.daledele_push_subs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own push subs" ON public.daledele_push_subs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role can view all" ON public.daledele_push_subs FOR SELECT USING (true);
CREATE POLICY "Users can delete own push subs" ON public.daledele_push_subs FOR DELETE USING (auth.uid() = user_id);
