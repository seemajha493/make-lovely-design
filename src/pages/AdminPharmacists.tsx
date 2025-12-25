import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Pill, CheckCircle, XCircle, Clock, Search, Loader2, Eye } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Pharmacist = Database["public"]["Tables"]["pharmacists"]["Row"];

const AdminPharmacists = () => {
  const [pharmacists, setPharmacists] = useState<Pharmacist[]>([]);
  const [filteredPharmacists, setFilteredPharmacists] = useState<Pharmacist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPharmacist, setSelectedPharmacist] = useState<Pharmacist | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  useEffect(() => {
    filterPharmacists();
  }, [pharmacists, searchQuery, activeTab]);

  const checkAdminAccess = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }

    const { data: roles, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id);

    if (error) {
      toast({
        title: "Access Error",
        description: "Failed to verify admin access.",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    const hasAdminRole = roles?.some((r) => r.role === "admin");
    if (!hasAdminRole) {
      toast({
        title: "Access Denied",
        description: "You don't have admin privileges.",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    setIsAdmin(true);
    fetchPharmacists();
  };

  const fetchPharmacists = async () => {
    try {
      const { data, error } = await supabase
        .from("pharmacists")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPharmacists(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch pharmacists",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterPharmacists = () => {
    let filtered = pharmacists;

    if (activeTab !== "all") {
      filtered = filtered.filter((p) => p.status === activeTab);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.full_name.toLowerCase().includes(query) ||
          p.email.toLowerCase().includes(query) ||
          p.license_number.toLowerCase().includes(query) ||
          p.pharmacy_name.toLowerCase().includes(query)
      );
    }

    setFilteredPharmacists(filtered);
  };

  const handleVerify = async (pharmacistId: string) => {
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from("pharmacists")
        .update({
          status: "verified" as Database["public"]["Enums"]["pharmacist_status"],
          verified_at: new Date().toISOString(),
          rejection_reason: null,
        })
        .eq("id", pharmacistId);

      if (error) throw error;

      setPharmacists((prev) =>
        prev.map((p) =>
          p.id === pharmacistId
            ? { ...p, status: "verified" as Database["public"]["Enums"]["pharmacist_status"], verified_at: new Date().toISOString(), rejection_reason: null }
            : p
        )
      );

      toast({
        title: "Pharmacist Verified",
        description: "The pharmacist has been verified successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to verify pharmacist",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setIsDialogOpen(false);
      setSelectedPharmacist(null);
    }
  };

  const handleReject = async () => {
    if (!selectedPharmacist) return;
    setIsProcessing(true);

    try {
      const { error } = await supabase
        .from("pharmacists")
        .update({
          status: "rejected" as Database["public"]["Enums"]["pharmacist_status"],
          rejection_reason: rejectionReason || "Verification requirements not met",
        })
        .eq("id", selectedPharmacist.id);

      if (error) throw error;

      setPharmacists((prev) =>
        prev.map((p) =>
          p.id === selectedPharmacist.id
            ? { ...p, status: "rejected" as Database["public"]["Enums"]["pharmacist_status"], rejection_reason: rejectionReason }
            : p
        )
      );

      toast({
        title: "Pharmacist Rejected",
        description: "The pharmacist's verification has been rejected.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to reject pharmacist",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setIsDialogOpen(false);
      setSelectedPharmacist(null);
      setRejectionReason("");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge className="bg-green-500/10 text-green-600">
            <CheckCircle className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  const getCounts = () => ({
    all: pharmacists.length,
    pending: pharmacists.filter((p) => p.status === "pending").length,
    verified: pharmacists.filter((p) => p.status === "verified").length,
    rejected: pharmacists.filter((p) => p.status === "rejected").length,
  });

  if (!isAdmin || isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  const counts = getCounts();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-green-500/10 rounded-full">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Pharmacist Verification</h1>
              <p className="text-muted-foreground">Review and verify pharmacist registrations</p>
            </div>
          </div>

          {/* Search */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, license, or pharmacy..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="pending">Pending ({counts.pending})</TabsTrigger>
              <TabsTrigger value="verified">Verified ({counts.verified})</TabsTrigger>
              <TabsTrigger value="rejected">Rejected ({counts.rejected})</TabsTrigger>
              <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {filteredPharmacists.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center py-12">
                    <Pill className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No pharmacists found</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredPharmacists.map((pharmacist) => (
                    <Card key={pharmacist.id}>
                      <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="p-2 bg-green-500/10 rounded-full">
                              <Pill className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-foreground">{pharmacist.full_name}</h3>
                                {getStatusBadge(pharmacist.status)}
                              </div>
                              <p className="text-sm text-muted-foreground">{pharmacist.pharmacy_name}</p>
                              <p className="text-sm text-muted-foreground">{pharmacist.email}</p>
                              <p className="text-sm text-muted-foreground">
                                License: {pharmacist.license_number} | {pharmacist.qualification}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedPharmacist(pharmacist);
                                setIsDialogOpen(true);
                              }}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            {pharmacist.status === "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleVerify(pharmacist.id)}
                                  disabled={isProcessing}
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Verify
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedPharmacist(pharmacist);
                                    setIsDialogOpen(true);
                                  }}
                                  disabled={isProcessing}
                                >
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Pharmacist Details</DialogTitle>
            <DialogDescription>Review the pharmacist's information before verification</DialogDescription>
          </DialogHeader>
          {selectedPharmacist && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                  <p className="text-foreground">{selectedPharmacist.full_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-foreground">{selectedPharmacist.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <p className="text-foreground">{selectedPharmacist.phone || "Not provided"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">License Number</label>
                  <p className="text-foreground">{selectedPharmacist.license_number}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Qualification</label>
                  <p className="text-foreground">{selectedPharmacist.qualification}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Experience</label>
                  <p className="text-foreground">
                    {selectedPharmacist.experience_years ? `${selectedPharmacist.experience_years} years` : "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Pharmacy Name</label>
                  <p className="text-foreground">{selectedPharmacist.pharmacy_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Pharmacy Address</label>
                  <p className="text-foreground">{selectedPharmacist.pharmacy_address || "Not provided"}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Registered</label>
                <p className="text-foreground">{new Date(selectedPharmacist.created_at).toLocaleString()}</p>
              </div>

              {selectedPharmacist.status === "pending" && (
                <div className="pt-4 border-t">
                  <label className="text-sm font-medium text-muted-foreground">Rejection Reason (optional)</label>
                  <Textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Provide a reason if rejecting..."
                    className="mt-1"
                  />
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Close</Button>
            {selectedPharmacist?.status === "pending" && (
              <>
                <Button onClick={() => handleVerify(selectedPharmacist.id)} disabled={isProcessing}>
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                  Verify
                </Button>
                <Button variant="destructive" onClick={handleReject} disabled={isProcessing}>
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <XCircle className="w-4 h-4 mr-2" />}
                  Reject
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default AdminPharmacists;
