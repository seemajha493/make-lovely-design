-- Create enum for doctor verification status
CREATE TYPE public.doctor_status AS ENUM ('pending', 'verified', 'rejected');

-- Create doctors table
CREATE TABLE public.doctors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  specialization TEXT NOT NULL,
  license_number TEXT NOT NULL,
  qualification TEXT NOT NULL,
  hospital_clinic TEXT,
  experience_years INTEGER,
  bio TEXT,
  status doctor_status NOT NULL DEFAULT 'pending',
  rejection_reason TEXT,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id),
  UNIQUE(license_number),
  UNIQUE(email)
);

-- Enable RLS
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;

-- Doctors can view their own profile
CREATE POLICY "Doctors can view own profile"
ON public.doctors
FOR SELECT
USING (auth.uid() = user_id);

-- Doctors can insert their own profile
CREATE POLICY "Doctors can insert own profile"
ON public.doctors
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Doctors can update their own profile (except status)
CREATE POLICY "Doctors can update own profile"
ON public.doctors
FOR UPDATE
USING (auth.uid() = user_id);

-- Create user_roles table for admin management
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to check if user is a doctor
CREATE OR REPLACE FUNCTION public.is_verified_doctor(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.doctors
    WHERE user_id = _user_id
      AND status = 'verified'
  )
$$;

-- Admins can view all doctors
CREATE POLICY "Admins can view all doctors"
ON public.doctors
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update all doctors (for verification)
CREATE POLICY "Admins can update all doctors"
ON public.doctors
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Users can view their own roles
CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Admins can manage roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_doctors_updated_at
BEFORE UPDATE ON public.doctors
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();