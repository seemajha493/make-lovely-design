-- Remove unique constraint on user_id to allow demo doctors
ALTER TABLE public.doctors DROP CONSTRAINT IF EXISTS doctors_user_id_key;

-- Insert demo verified doctors
INSERT INTO public.doctors (
  user_id,
  full_name,
  email,
  specialization,
  qualification,
  license_number,
  experience_years,
  hospital_clinic,
  phone,
  bio,
  status,
  verified_at
) VALUES (
  '93816181-1bee-47f0-9426-6461cd6c01b0',
  'Rajesh Kumar',
  'dr.rajesh@example.com',
  'General Physician',
  'MBBS, MD',
  'MCI-12345',
  12,
  'City Care Hospital, Delhi',
  '+91 9876543210',
  'Experienced general physician specializing in preventive care and chronic disease management.',
  'verified',
  now()
),
(
  '93816181-1bee-47f0-9426-6461cd6c01b0',
  'Priya Sharma',
  'dr.priya@example.com',
  'Cardiologist',
  'MBBS, DM Cardiology',
  'MCI-67890',
  8,
  'Heart Care Centre, Mumbai',
  '+91 9876543211',
  'Specialist in cardiac care with expertise in interventional cardiology.',
  'verified',
  now()
),
(
  '93816181-1bee-47f0-9426-6461cd6c01b0',
  'Amit Patel',
  'dr.amit@example.com',
  'Pediatrician',
  'MBBS, DCH',
  'MCI-11223',
  15,
  'Children''s Wellness Clinic, Bangalore',
  '+91 9876543212',
  'Dedicated pediatrician caring for children from newborns to adolescents.',
  'verified',
  now()
);