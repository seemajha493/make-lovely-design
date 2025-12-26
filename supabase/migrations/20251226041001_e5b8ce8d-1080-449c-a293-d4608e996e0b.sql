-- Create appointments table
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  visit_type TEXT NOT NULL DEFAULT 'in_person' CHECK (visit_type IN ('in_person', 'home_visit')),
  reason TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(doctor_id, appointment_date, appointment_time)
);

-- Enable RLS
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Users can view their own appointments
CREATE POLICY "Users can view own appointments"
ON public.appointments
FOR SELECT
USING (auth.uid() = user_id);

-- Users can create appointments
CREATE POLICY "Users can create appointments"
ON public.appointments
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own appointments (cancel)
CREATE POLICY "Users can update own appointments"
ON public.appointments
FOR UPDATE
USING (auth.uid() = user_id);

-- Doctors can view appointments booked with them
CREATE POLICY "Doctors can view their appointments"
ON public.appointments
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.doctors
    WHERE doctors.id = appointments.doctor_id
    AND doctors.user_id = auth.uid()
  )
);

-- Doctors can update appointments (confirm/complete)
CREATE POLICY "Doctors can update their appointments"
ON public.appointments
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.doctors
    WHERE doctors.id = appointments.doctor_id
    AND doctors.user_id = auth.uid()
  )
);

-- Public can view verified doctors for booking
CREATE POLICY "Anyone can view verified doctors"
ON public.doctors
FOR SELECT
USING (status = 'verified');

-- Create trigger for updated_at
CREATE TRIGGER update_appointments_updated_at
BEFORE UPDATE ON public.appointments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for appointments
ALTER PUBLICATION supabase_realtime ADD TABLE public.appointments;