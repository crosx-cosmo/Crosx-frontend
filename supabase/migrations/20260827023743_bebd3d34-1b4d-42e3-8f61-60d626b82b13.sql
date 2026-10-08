CREATE TYPE public.withdrawal_status AS ENUM ('pending','under_review','approved','processing','paid','rejected');

CREATE SEQUENCE IF NOT EXISTS public.withdrawal_request_seq;

CREATE TABLE public.withdrawal_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  request_ref text NOT NULL UNIQUE DEFAULT ('WDR-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.withdrawal_request_seq')::text, 4, '0')),
  amount numeric(12,2) NOT NULL CHECK (amount > 0),
  payment_method text NOT NULL,
  invoice_path text,
  invoice_name text,
  status public.withdrawal_status NOT NULL DEFAULT 'pending',
  rejection_reason text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX withdrawal_requests_user_id_idx ON public.withdrawal_requests (user_id, created_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.withdrawal_requests TO authenticated;
GRANT USAGE ON SEQUENCE public.withdrawal_request_seq TO authenticated;
GRANT ALL ON public.withdrawal_requests TO service_role;
GRANT ALL ON SEQUENCE public.withdrawal_request_seq TO service_role;

ALTER TABLE public.withdrawal_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "withdrawals_select_own" ON public.withdrawal_requests
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "withdrawals_insert_own" ON public.withdrawal_requests
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND status = 'pending' AND rejection_reason IS NULL);

CREATE POLICY "withdrawals_update_own_pending" ON public.withdrawal_requests
  FOR UPDATE TO authenticated USING (auth.uid() = user_id AND status = 'pending') WITH CHECK (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "withdrawals_delete_own_pending" ON public.withdrawal_requests
  FOR DELETE TO authenticated USING (auth.uid() = user_id AND status = 'pending');

CREATE TRIGGER withdrawal_requests_set_updated_at
  BEFORE UPDATE ON public.withdrawal_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();