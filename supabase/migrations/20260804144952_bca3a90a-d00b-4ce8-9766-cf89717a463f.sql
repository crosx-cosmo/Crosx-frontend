-- 1. Remove the overly permissive anonymous insert policy
DROP POLICY IF EXISTS profiles_insert_signup ON public.profiles;

-- 2. Create profile rows server-side on signup from auth metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
begin
  if meta ? 'full_name' and meta ? 'mobile' and meta ? 'company_name' then
    insert into public.profiles (
      id, full_name, email, mobile, company_name, website, role,
      traffic_sources, gst_number, country, state, city, pincode, account_type
    ) values (
      new.id,
      meta->>'full_name',
      coalesce(meta->>'email', new.email),
      meta->>'mobile',
      meta->>'company_name',
      nullif(meta->>'website', ''),
      coalesce(meta->>'role', 'publisher'),
      coalesce(
        (select array_agg(value::text) from jsonb_array_elements_text(
           case when jsonb_typeof(meta->'traffic_sources') = 'array'
                then meta->'traffic_sources' else '[]'::jsonb end) as value),
        '{}'::text[]
      ),
      nullif(meta->>'gst_number', ''),
      coalesce(meta->>'country', ''),
      coalesce(meta->>'state', ''),
      coalesce(meta->>'city', ''),
      coalesce(meta->>'pincode', ''),
      coalesce((meta->>'account_type')::public.account_type, 'publisher')
    )
    on conflict (id) do nothing;
  end if;
  return new;
end $$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();