
-- Create app_users table for phone-based authentication (no passwords, disaster-friendly)
CREATE TABLE public.app_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  city TEXT,
  emergency_contact TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.app_users ENABLE ROW LEVEL SECURITY;

-- Public read/write for disaster app (no auth required)
CREATE POLICY "Anyone can read app_users by phone" ON public.app_users FOR SELECT USING (true);
CREATE POLICY "Anyone can insert app_users" ON public.app_users FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update app_users" ON public.app_users FOR UPDATE USING (true);

-- Timestamp trigger
CREATE TRIGGER update_app_users_updated_at
BEFORE UPDATE ON public.app_users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
