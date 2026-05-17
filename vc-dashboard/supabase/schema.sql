-- ============================================
-- VC Office Manager Dashboard - Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- Profiles (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events
CREATE TABLE IF NOT EXISTS public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME,
  attendees TEXT[],
  venue TEXT,
  catering TEXT,
  budget DECIMAL(10,2),
  spent DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'Planning' CHECK (status IN ('Planning', 'Confirmed', 'In Progress', 'Completed', 'Cancelled')),
  notes TEXT,
  run_of_show TEXT,
  calendar_event_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Office Operations
CREATE TABLE IF NOT EXISTS public.office_operations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('Supply', 'Vendor', 'Maintenance')),
  item TEXT NOT NULL,
  status TEXT DEFAULT 'OK' CHECK (status IN ('OK', 'Low Stock', 'Out of Stock', 'Scheduled', 'Overdue', 'Active')),
  vendor TEXT,
  next_service DATE,
  priority TEXT DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High')),
  quantity INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team Members
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  email TEXT,
  phone TEXT,
  location TEXT DEFAULT 'In Office' CHECK (location IN ('In Office', 'Remote', 'Traveling', 'OOO')),
  status TEXT DEFAULT 'Active',
  avatar_url TEXT,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Onboarding Checklist
CREATE TABLE IF NOT EXISTS public.onboarding_checklist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hire_name TEXT NOT NULL,
  hire_role TEXT,
  hire_start_date DATE,
  task TEXT NOT NULL,
  assigned_to TEXT,
  completed BOOLEAN DEFAULT FALSE,
  deadline DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Done')),
  priority TEXT DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High')),
  due_date DATE,
  assigned_to TEXT,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email Mapping
CREATE TABLE IF NOT EXISTS public.email_mapping (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email_id TEXT NOT NULL,
  event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  office_id UUID REFERENCES public.office_operations(id) ON DELETE SET NULL,
  task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Auto-update updated_at on events
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- Row Level Security (RLS)
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.office_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_checklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_mapping ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users full access to all tables
CREATE POLICY "Authenticated users can read profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Authenticated users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE POLICY "Authenticated users can read events" ON public.events FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert events" ON public.events FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update events" ON public.events FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete events" ON public.events FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can read office" ON public.office_operations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert office" ON public.office_operations FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update office" ON public.office_operations FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete office" ON public.office_operations FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can read team" ON public.team_members FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert team" ON public.team_members FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update team" ON public.team_members FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete team" ON public.team_members FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can read onboarding" ON public.onboarding_checklist FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert onboarding" ON public.onboarding_checklist FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update onboarding" ON public.onboarding_checklist FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete onboarding" ON public.onboarding_checklist FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can read tasks" ON public.tasks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert tasks" ON public.tasks FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update tasks" ON public.tasks FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete tasks" ON public.tasks FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can read email_mapping" ON public.email_mapping FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert email_mapping" ON public.email_mapping FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update email_mapping" ON public.email_mapping FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete email_mapping" ON public.email_mapping FOR DELETE TO authenticated USING (true);

-- ============================================
-- Enable Realtime on key tables
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.team_members;
ALTER PUBLICATION supabase_realtime ADD TABLE public.office_operations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.onboarding_checklist;

-- ============================================
-- Auto-create profile on signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
