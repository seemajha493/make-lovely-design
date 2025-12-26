import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Shield, FileText, Clock, CheckCircle, XCircle, AlertCircle,
  Plus, ArrowLeft, IndianRupee, Calendar, TrendingUp
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Policy {
  id: string;
  policy_number: string;
  status: string;
  start_date: string;
  end_date: string;
  premium_amount: number;
  payment_frequency: string;
  plan: {
    name: string;
    coverage_amount: number;
    benefits: string[];
  };
}

interface Claim {
  id: string;
  claim_number: string;
  claim_type: string;
  description: string;
  amount_claimed: number;
  amount_approved: number | null;
  status: string;
  submitted_at: string;
  notes: string | null;
}

const claimStatusConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  pending: { icon: Clock, color: "bg-warning text-warning-foreground", label: "Pending" },
  under_review: { icon: AlertCircle, color: "bg-primary text-primary-foreground", label: "Under Review" },
  approved: { icon: CheckCircle, color: "bg-success text-success-foreground", label: "Approved" },
  rejected: { icon: XCircle, color: "bg-destructive text-destructive-foreground", label: "Rejected" },
  settled: { icon: CheckCircle, color: "bg-teal text-teal-foreground", label: "Settled" }
};

const claimTypes = [
  'Hospitalization',
  'Day Care',
  'Pre-hospitalization',
  'Post-hospitalization',
  'Outpatient',
  'Medicine Reimbursement',
  'Diagnostic Tests',
  'Other'
];

export default function InsuranceDashboard() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [showClaimDialog, setShowClaimDialog] = useState(false);
  const [selectedPolicyId, setSelectedPolicyId] = useState<string>('');
  const [submittingClaim, setSubmittingClaim] = useState(false);
  const [claimForm, setClaimForm] = useState({
    claim_type: '',
    description: '',
    amount_claimed: ''
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      // Fetch policies
      const { data: policiesData, error: policiesError } = await supabase
        .from('user_insurance_policies')
        .select(`
          *,
          plan:plan_id (
            name,
            coverage_amount,
            benefits
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (policiesError) throw policiesError;

      // Fetch claims
      const { data: claimsData, error: claimsError } = await supabase
        .from('insurance_claims')
        .select('*')
        .eq('user_id', user?.id)
        .order('submitted_at', { ascending: false });

      if (claimsError) throw claimsError;

      setPolicies(policiesData?.map(p => ({
        ...p,
        plan: p.plan as Policy['plan']
      })) || []);
      setClaims(claimsData || []);
    } catch (error) {
      console.error('Error fetching insurance data:', error);
      toast.error('Failed to load insurance data');
    } finally {
      setLoading(false);
    }
  };

  const generateClaimNumber = () => {
    const prefix = 'CLM';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  };

  const handleSubmitClaim = async () => {
    if (!selectedPolicyId || !claimForm.claim_type || !claimForm.description || !claimForm.amount_claimed) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmittingClaim(true);
    try {
      const { error } = await supabase
        .from('insurance_claims')
        .insert({
          user_id: user?.id,
          policy_id: selectedPolicyId,
          claim_number: generateClaimNumber(),
          claim_type: claimForm.claim_type,
          description: claimForm.description,
          amount_claimed: parseFloat(claimForm.amount_claimed),
          status: 'pending'
        });

      if (error) throw error;

      toast.success('Claim submitted successfully');
      setShowClaimDialog(false);
      setClaimForm({ claim_type: '', description: '', amount_claimed: '' });
      setSelectedPolicyId('');
      fetchData();
    } catch (error) {
      console.error('Error submitting claim:', error);
      toast.error('Failed to submit claim');
    } finally {
      setSubmittingClaim(false);
    }
  };

  // Calculate stats
  const totalCoverage = policies.reduce((sum, p) => sum + (p.plan?.coverage_amount || 0), 0);
  const activePolicies = policies.filter(p => p.status === 'active').length;
  const pendingClaims = claims.filter(c => c.status === 'pending' || c.status === 'under_review').length;
  const totalClaimedAmount = claims.reduce((sum, c) => sum + c.amount_claimed, 0);

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-16 text-center">
          <Shield className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Sign in to view your insurance</h1>
          <p className="text-muted-foreground mb-6">Track your policies and claims</p>
          <Button onClick={() => navigate('/auth')}>Sign In</Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/insurance')}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Browse Insurance Plans
        </Button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Insurance Dashboard</h1>
            <p className="text-muted-foreground">Manage your policies and claims</p>
          </div>
          <Button onClick={() => setShowClaimDialog(true)} disabled={policies.length === 0}>
            <Plus className="h-4 w-4 mr-2" />
            File a Claim
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{activePolicies}</p>
                  <p className="text-sm text-muted-foreground">Active Policies</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">₹{(totalCoverage / 100000).toFixed(0)}L</p>
                  <p className="text-sm text-muted-foreground">Total Coverage</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <FileText className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingClaims}</p>
                  <p className="text-sm text-muted-foreground">Pending Claims</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-teal/10 rounded-lg">
                  <IndianRupee className="h-5 w-5 text-teal" />
                </div>
                <div>
                  <p className="text-2xl font-bold">₹{totalClaimedAmount.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Claimed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded w-1/4 mb-4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Tabs defaultValue="policies" className="space-y-6">
            <TabsList>
              <TabsTrigger value="policies" className="gap-2">
                <Shield className="h-4 w-4" />
                My Policies ({policies.length})
              </TabsTrigger>
              <TabsTrigger value="claims" className="gap-2">
                <FileText className="h-4 w-4" />
                My Claims ({claims.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="policies">
              {policies.length === 0 ? (
                <Card className="p-12 text-center">
                  <Shield className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h2 className="text-xl font-semibold mb-2">No policies yet</h2>
                  <p className="text-muted-foreground mb-6">
                    Browse our insurance plans and get covered today
                  </p>
                  <Button onClick={() => navigate('/insurance')}>
                    Browse Plans
                  </Button>
                </Card>
              ) : (
                <div className="space-y-4">
                  {policies.map((policy) => (
                    <Card key={policy.id}>
                      <CardHeader className="pb-2">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <CardTitle className="text-lg">{policy.plan?.name}</CardTitle>
                              <Badge variant={policy.status === 'active' ? 'default' : 'secondary'}>
                                {policy.status.charAt(0).toUpperCase() + policy.status.slice(1)}
                              </Badge>
                            </div>
                            <CardDescription>Policy #{policy.policy_number}</CardDescription>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-primary">
                              ₹{(policy.plan?.coverage_amount || 0) / 100000}L
                            </p>
                            <p className="text-sm text-muted-foreground">Coverage</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">Valid Until</p>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(policy.end_date), 'PPP')}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <IndianRupee className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">Premium</p>
                              <p className="text-sm text-muted-foreground">
                                ₹{policy.premium_amount} / {policy.payment_frequency}
                              </p>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium mb-1">Benefits</p>
                            <p className="text-sm text-muted-foreground">
                              {policy.plan?.benefits?.slice(0, 2).join(', ')}
                              {(policy.plan?.benefits?.length || 0) > 2 && '...'}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="claims">
              {claims.length === 0 ? (
                <Card className="p-12 text-center">
                  <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h2 className="text-xl font-semibold mb-2">No claims yet</h2>
                  <p className="text-muted-foreground mb-6">
                    File a claim when you need to use your insurance
                  </p>
                  <Button onClick={() => setShowClaimDialog(true)} disabled={policies.length === 0}>
                    <Plus className="h-4 w-4 mr-2" />
                    File a Claim
                  </Button>
                </Card>
              ) : (
                <div className="space-y-4">
                  {claims.map((claim) => {
                    const status = claimStatusConfig[claim.status] || claimStatusConfig.pending;
                    const StatusIcon = status.icon;

                    return (
                      <Card key={claim.id}>
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <p className="font-semibold">Claim #{claim.claim_number}</p>
                                <Badge className={status.color}>
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {status.label}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-1">
                                {claim.claim_type} • Submitted on {format(new Date(claim.submitted_at), 'PPP')}
                              </p>
                              <p className="text-sm">{claim.description}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">Amount Claimed</p>
                              <p className="text-xl font-bold">₹{claim.amount_claimed.toLocaleString()}</p>
                              {claim.amount_approved !== null && (
                                <p className="text-sm text-success">
                                  Approved: ₹{claim.amount_approved.toLocaleString()}
                                </p>
                              )}
                            </div>
                          </div>
                          {claim.notes && (
                            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                              <p className="text-sm"><span className="font-medium">Note:</span> {claim.notes}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </main>

      {/* File Claim Dialog */}
      <Dialog open={showClaimDialog} onOpenChange={setShowClaimDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>File a New Claim</DialogTitle>
            <DialogDescription>
              Submit your claim details for reimbursement
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="policy">Select Policy *</Label>
              <Select value={selectedPolicyId} onValueChange={setSelectedPolicyId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a policy" />
                </SelectTrigger>
                <SelectContent>
                  {policies.filter(p => p.status === 'active').map((policy) => (
                    <SelectItem key={policy.id} value={policy.id}>
                      {policy.plan?.name} - {policy.policy_number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="claim_type">Claim Type *</Label>
              <Select 
                value={claimForm.claim_type} 
                onValueChange={(v) => setClaimForm(prev => ({ ...prev, claim_type: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select claim type" />
                </SelectTrigger>
                <SelectContent>
                  {claimTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount Claimed (₹) *</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={claimForm.amount_claimed}
                onChange={(e) => setClaimForm(prev => ({ ...prev, amount_claimed: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your claim (treatment details, hospital name, etc.)"
                value={claimForm.description}
                onChange={(e) => setClaimForm(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClaimDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitClaim} disabled={submittingClaim}>
              {submittingClaim ? 'Submitting...' : 'Submit Claim'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
