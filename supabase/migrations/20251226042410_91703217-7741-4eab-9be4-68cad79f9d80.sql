-- Add payment_method column to orders table
ALTER TABLE public.orders 
ADD COLUMN payment_method text NOT NULL DEFAULT 'cod';

-- Add payment_status column to track payment for COD orders
ALTER TABLE public.orders 
ADD COLUMN payment_status text NOT NULL DEFAULT 'pending';

COMMENT ON COLUMN public.orders.payment_method IS 'Payment method: cod (Cash on Delivery)';
COMMENT ON COLUMN public.orders.payment_status IS 'Payment status: pending, paid, failed';