import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, Check, ArrowRight, Heart, Users, User, Crown,
  Clock, IndianRupee, FileText
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface InsurancePlan {
  id: string;
  name: string;
  description: string;
  type: string;
  coverage_amount: number;
  premium_monthly: number;
  premium_yearly: number;
  benefits: string[];
  waiting_period_days: number;
}

const planTypeIcons: Record<string, React.ElementType> = {
  individual: User,
  family: Users,
  senior: Heart,
  premium: Crown
};

const planTypeColors: Record<string, string> = {
  individual: "bg-primary/10 text-primary",
  family: "bg-teal/10 text-teal",
  senior: "bg-warning/10 text-warning",
  premium: "bg-purple-500/10 text-purple-500"
};

export default function Insurance() {
  const [plans, setPlans] = useState<InsurancePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<InsurancePlan | null>(null);
  const [paymentFrequency, setPaymentFrequency] = useState<'monthly' | 'yearly'>('yearly');
  const [applying, setApplying] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('insurance_plans')
        .select('*')
        .eq('is_active', true)
        .order('premium_monthly', { ascending: true });

      if (error) throw error;
      setPlans(data || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast.error('Failed to load insurance plans');
    } finally {
      setLoading(false);
    }
  };

  const generatePolicyNumber = () => {
    const prefix = 'JR';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  };

  const handleApply = async () => {
    if (!user) {
      toast.error('Please sign in to apply for insurance');
      navigate('/auth');
      return;
    }

    if (!selectedPlan) return;

    setApplying(true);
    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() + 1);

      const premium = paymentFrequency === 'yearly' 
        ? selectedPlan.premium_yearly 
        : selectedPlan.premium_monthly;

      const { error } = await supabase
        .from('user_insurance_policies')
        .insert({
          user_id: user.id,
          plan_id: selectedPlan.id,
          policy_number: generatePolicyNumber(),
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          premium_amount: premium,
          payment_frequency: paymentFrequency,
          status: 'active'
        });

      if (error) throw error;

      toast.success('Insurance policy activated successfully!');
      setSelectedPlan(null);
      navigate('/insurance/dashboard');
    } catch (error) {
      console.error('Error applying for insurance:', error);
      toast.error('Failed to activate policy. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Health Insurance Plans
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Protect yourself and your family with comprehensive health coverage. 
            Choose from our range of plans designed for every need.
          </p>
          {user && (
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate('/insurance/dashboard')}
            >
              <FileText className="h-4 w-4 mr-2" />
              View My Insurance Dashboard
            </Button>
          )}
        </div>

        {/* Plans Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-8 bg-muted rounded mb-4" />
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => {
              const TypeIcon = planTypeIcons[plan.type] || Shield;
              const typeColor = planTypeColors[plan.type] || planTypeColors.individual;

              return (
                <Card key={plan.id} className="flex flex-col hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={typeColor}>
                        <TypeIcon className="h-3 w-3 mr-1" />
                        {plan.type.charAt(0).toUpperCase() + plan.type.slice(1)}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="mb-4">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-primary">₹{plan.premium_monthly}</span>
                        <span className="text-muted-foreground">/month</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        or ₹{plan.premium_yearly}/year (save {Math.round((1 - plan.premium_yearly / (plan.premium_monthly * 12)) * 100)}%)
                      </p>
                    </div>
                    
                    <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Coverage up to</p>
                      <p className="text-xl font-semibold text-foreground">
                        ₹{(plan.coverage_amount / 100000).toFixed(0)} Lakhs
                      </p>
                    </div>

                    <div className="space-y-2">
                      {plan.benefits.slice(0, 4).map((benefit, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{benefit}</span>
                        </div>
                      ))}
                      {plan.benefits.length > 4 && (
                        <p className="text-sm text-primary">
                          +{plan.benefits.length - 4} more benefits
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1 mt-4 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{plan.waiting_period_days} days waiting period</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full gap-2"
                      onClick={() => setSelectedPlan(plan)}
                    >
                      Get This Plan
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}

        {/* Features Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <IndianRupee className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Cashless Claims</h3>
            <p className="text-muted-foreground text-sm">
              Get treated at 10,000+ network hospitals without paying upfront
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-6 w-6 text-success" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Quick Claims</h3>
            <p className="text-muted-foreground text-sm">
              90% of claims settled within 3 working days
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-6 w-6 text-warning" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Lifetime Renewal</h3>
            <p className="text-muted-foreground text-sm">
              Guaranteed renewal for life with no upper age limit
            </p>
          </div>
        </div>
      </main>

      {/* Apply Dialog */}
      <Dialog open={!!selectedPlan} onOpenChange={() => setSelectedPlan(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Apply for {selectedPlan?.name}</DialogTitle>
            <DialogDescription>
              Choose your payment frequency and confirm to activate your policy
            </DialogDescription>
          </DialogHeader>
          
          {selectedPlan && (
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Coverage Amount</p>
                <p className="text-xl font-bold text-primary">
                  ₹{(selectedPlan.coverage_amount / 100000).toFixed(0)} Lakhs
                </p>
              </div>

              <div>
                <Label className="mb-3 block">Payment Frequency</Label>
                <RadioGroup
                  value={paymentFrequency}
                  onValueChange={(v) => setPaymentFrequency(v as 'monthly' | 'yearly')}
                  className="space-y-3"
                >
                  <div className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentFrequency === 'yearly' ? 'border-primary bg-primary/5' : 'border-border'
                  }`}>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="yearly" id="yearly" />
                      <div>
                        <Label htmlFor="yearly" className="font-medium cursor-pointer">Yearly</Label>
                        <p className="text-sm text-muted-foreground">Best value</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">₹{selectedPlan.premium_yearly}</p>
                      <Badge variant="secondary" className="text-xs">
                        Save {Math.round((1 - selectedPlan.premium_yearly / (selectedPlan.premium_monthly * 12)) * 100)}%
                      </Badge>
                    </div>
                  </div>
                  <div className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentFrequency === 'monthly' ? 'border-primary bg-primary/5' : 'border-border'
                  }`}>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="monthly" id="monthly" />
                      <div>
                        <Label htmlFor="monthly" className="font-medium cursor-pointer">Monthly</Label>
                        <p className="text-sm text-muted-foreground">Pay as you go</p>
                      </div>
                    </div>
                    <p className="font-bold">₹{selectedPlan.premium_monthly}/mo</p>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedPlan(null)}>
              Cancel
            </Button>
            <Button onClick={handleApply} disabled={applying}>
              {applying ? 'Activating...' : 'Activate Policy'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
