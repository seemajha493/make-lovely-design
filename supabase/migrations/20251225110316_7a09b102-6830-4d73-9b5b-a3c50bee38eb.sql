-- Add customer_email to orders table for notification purposes
ALTER TABLE public.orders ADD COLUMN customer_email TEXT;
ALTER TABLE public.orders ADD COLUMN customer_name TEXT;