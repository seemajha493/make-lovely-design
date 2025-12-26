-- Allow users to update their own pending orders (for cancellation)
CREATE POLICY "Users can update own pending orders" 
ON public.orders 
FOR UPDATE 
USING (auth.uid() = user_id AND status = 'pending')
WITH CHECK (auth.uid() = user_id);