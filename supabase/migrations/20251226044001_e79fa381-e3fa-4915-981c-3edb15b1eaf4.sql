-- Create insurance plans table
CREATE TABLE public.insurance_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL DEFAULT 'individual',
  coverage_amount NUMERIC NOT NULL,
  premium_monthly NUMERIC NOT NULL,
  premium_yearly NUMERIC NOT NULL,
  benefits TEXT[] DEFAULT '{}',
  waiting_period_days INTEGER DEFAULT 30,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user insurance policies table
CREATE TABLE public.user_insurance_policies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  plan_id UUID NOT NULL REFERENCES public.insurance_plans(id),
  policy_number TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'active',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  premium_amount NUMERIC NOT NULL,
  payment_frequency TEXT NOT NULL DEFAULT 'monthly',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create insurance claims table
CREATE TABLE public.insurance_claims (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  policy_id UUID NOT NULL REFERENCES public.user_insurance_policies(id),
  claim_number TEXT NOT NULL UNIQUE,
  claim_type TEXT NOT NULL,
  description TEXT NOT NULL,
  amount_claimed NUMERIC NOT NULL,
  amount_approved NUMERIC,
  status TEXT NOT NULL DEFAULT 'pending',
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  documents TEXT[] DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.insurance_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_insurance_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_claims ENABLE ROW LEVEL SECURITY;

-- RLS Policies for insurance_plans (public read, admin write)
CREATE POLICY "Anyone can view active insurance plans" 
ON public.insurance_plans FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage insurance plans" 
ON public.insurance_plans FOR ALL 
USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for user_insurance_policies
CREATE POLICY "Users can view own policies" 
ON public.user_insurance_policies FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own policies" 
ON public.user_insurance_policies FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own policies" 
ON public.user_insurance_policies FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all policies" 
ON public.user_insurance_policies FOR SELECT 
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all policies" 
ON public.user_insurance_policies FOR UPDATE 
USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for insurance_claims
CREATE POLICY "Users can view own claims" 
ON public.insurance_claims FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own claims" 
ON public.insurance_claims FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update pending claims" 
ON public.insurance_claims FOR UPDATE 
USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Admins can view all claims" 
ON public.insurance_claims FOR SELECT 
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all claims" 
ON public.insurance_claims FOR UPDATE 
USING (has_role(auth.uid(), 'admin'));

-- Create triggers for updated_at
CREATE TRIGGER update_insurance_plans_updated_at
BEFORE UPDATE ON public.insurance_plans
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_insurance_policies_updated_at
BEFORE UPDATE ON public.user_insurance_policies
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_insurance_claims_updated_at
BEFORE UPDATE ON public.insurance_claims
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();