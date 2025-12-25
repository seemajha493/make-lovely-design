-- Create enum for pharmacist verification status
CREATE TYPE public.pharmacist_status AS ENUM ('pending', 'verified', 'rejected');

-- Create pharmacists table
CREATE TABLE public.pharmacists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  license_number TEXT NOT NULL,
  qualification TEXT NOT NULL,
  pharmacy_name TEXT NOT NULL,
  pharmacy_address TEXT,
  experience_years INTEGER,
  status pharmacist_status NOT NULL DEFAULT 'pending',
  rejection_reason TEXT,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id),
  UNIQUE(license_number),
  UNIQUE(email)
);

-- Enable RLS
ALTER TABLE public.pharmacists ENABLE ROW LEVEL SECURITY;

-- Pharmacists can view their own profile
CREATE POLICY "Pharmacists can view own profile"
ON public.pharmacists
FOR SELECT
USING (auth.uid() = user_id);

-- Pharmacists can insert their own profile
CREATE POLICY "Pharmacists can insert own profile"
ON public.pharmacists
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Pharmacists can update their own profile
CREATE POLICY "Pharmacists can update own profile"
ON public.pharmacists
FOR UPDATE
USING (auth.uid() = user_id);

-- Admins can view all pharmacists
CREATE POLICY "Admins can view all pharmacists"
ON public.pharmacists
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update all pharmacists (for verification)
CREATE POLICY "Admins can update all pharmacists"
ON public.pharmacists
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_pharmacists_updated_at
BEFORE UPDATE ON public.pharmacists
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();