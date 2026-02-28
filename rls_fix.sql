-- Run this in the Supabase Dashboard SQL Editor
DROP POLICY IF EXISTS "Allow read access for all" ON public.agencies;
CREATE POLICY "Allow read access for all" ON public.agencies FOR SELECT USING (true);
              
DROP POLICY IF EXISTS "Allow read access for all" ON public.team;
CREATE POLICY "Allow read access for all" ON public.team FOR SELECT USING (true);
              
DROP POLICY IF EXISTS "Allow read access for all" ON public.goals;
CREATE POLICY "Allow read access for all" ON public.goals FOR SELECT USING (true);
              
DROP POLICY IF EXISTS "Allow read access for all" ON public.commissions;
CREATE POLICY "Allow read access for all" ON public.commissions FOR SELECT USING (true);
              
DROP POLICY IF EXISTS "Allow read access for all" ON public.daily_lead_volumes;
CREATE POLICY "Allow read access for all" ON public.daily_lead_volumes FOR SELECT USING (true);
