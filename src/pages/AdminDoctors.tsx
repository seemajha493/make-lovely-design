import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Stethoscope, CheckCircle, XCircle, Clock, Search, Loader2, Eye } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Doctor = Database["public"]["Tables"]["doctors"]["Row"];

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
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
    filterDoctors();
  }, [doctors, searchQuery, activeTab]);

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
    fetchDoctors();
  };

  const fetchDoctors = async () => {
    try {
      const { data, error } = await supabase
        .from("doctors")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDoctors(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch doctors",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterDoctors = () => {
    let filtered = doctors;

    if (activeTab !== "all") {
      filtered = filtered.filter((d) => d.status === activeTab);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (d) =>
          d.full_name.toLowerCase().includes(query) ||
          d.email.toLowerCase().includes(query) ||
          d.license_number.toLowerCase().includes(query) ||
          d.specialization.toLowerCase().includes(query)
      );
    }

    setFilteredDoctors(filtered);
  };

  const handleVerify = async (doctorId: string) => {
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from("doctors")
        .update({
          status: "verified" as Database["public"]["Enums"]["doctor_status"],
          verified_at: new Date().toISOString(),
          rejection_reason: null,
        })
        .eq("id", doctorId);

      if (error) throw error;

      setDoctors((prev) =>
        prev.map((d) =>
          d.id === doctorId
            ? { ...d, status: "verified" as Database["public"]["Enums"]["doctor_status"], verified_at: new Date().toISOString(), rejection_reason: null }
            : d
        )
      );

      toast({
        title: "Doctor Verified",
        description: "The doctor has been verified successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to verify doctor",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setIsDialogOpen(false);
      setSelectedDoctor(null);
    }
  };

  const handleReject = async () => {
    if (!selectedDoctor) return;
    setIsProcessing(true);

    try {
      const { error } = await supabase
        .from("doctors")
        .update({
          status: "rejected" as Database["public"]["Enums"]["doctor_status"],
          rejection_reason: rejectionReason || "Verification requirements not met",
        })
        .eq("id", selectedDoctor.id);

      if (error) throw error;

      setDoctors((prev) =>
        prev.map((d) =>
          d.id === selectedDoctor.id
            ? { ...d, status: "rejected" as Database["public"]["Enums"]["doctor_status"], rejection_reason: rejectionReason }
            : d
        )
      );

      toast({
        title: "Doctor Rejected",
        description: "The doctor's verification has been rejected.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to reject doctor",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setIsDialogOpen(false);
      setSelectedDoctor(null);
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
    all: doctors.length,
    pending: doctors.filter((d) => d.status === "pending").length,
    verified: doctors.filter((d) => d.status === "verified").length,
    rejected: doctors.filter((d) => d.status === "rejected").length,
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
            <div className="p-3 bg-primary/10 rounded-full">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Doctor Verification</h1>
              <p className="text-muted-foreground">Review and verify doctor registrations</p>
            </div>
          </div>

          {/* Search & Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, license, or specialization..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="pending">
                Pending ({counts.pending})
              </TabsTrigger>
              <TabsTrigger value="verified">
                Verified ({counts.verified})
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejected ({counts.rejected})
              </TabsTrigger>
              <TabsTrigger value="all">
                All ({counts.all})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {filteredDoctors.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center py-12">
                    <Stethoscope className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No doctors found</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredDoctors.map((doctor) => (
                    <Card key={doctor.id}>
                      <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="p-2 bg-primary/10 rounded-full">
                              <Stethoscope className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-foreground">{doctor.full_name}</h3>
                                {getStatusBadge(doctor.status)}
                              </div>
                              <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                              <p className="text-sm text-muted-foreground">{doctor.email}</p>
                              <p className="text-sm text-muted-foreground">
                                License: {doctor.license_number} | {doctor.qualification}
                              </p>
                              {doctor.hospital_clinic && (
                                <p className="text-sm text-muted-foreground">{doctor.hospital_clinic}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedDoctor(doctor);
                                setIsDialogOpen(true);
                              }}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            {doctor.status === "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleVerify(doctor.id)}
                                  disabled={isProcessing}
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Verify
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedDoctor(doctor);
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

      {/* Doctor Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Doctor Details</DialogTitle>
            <DialogDescription>
              Review the doctor's information before verification
            </DialogDescription>
          </DialogHeader>
          {selectedDoctor && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                  <p className="text-foreground">{selectedDoctor.full_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-foreground">{selectedDoctor.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <p className="text-foreground">{selectedDoctor.phone || "Not provided"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Specialization</label>
                  <p className="text-foreground">{selectedDoctor.specialization}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">License Number</label>
                  <p className="text-foreground">{selectedDoctor.license_number}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Qualification</label>
                  <p className="text-foreground">{selectedDoctor.qualification}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Hospital/Clinic</label>
                  <p className="text-foreground">{selectedDoctor.hospital_clinic || "Not provided"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Experience</label>
                  <p className="text-foreground">
                    {selectedDoctor.experience_years ? `${selectedDoctor.experience_years} years` : "Not provided"}
                  </p>
                </div>
              </div>
              {selectedDoctor.bio && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Bio</label>
                  <p className="text-foreground">{selectedDoctor.bio}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Registered</label>
                <p className="text-foreground">{new Date(selectedDoctor.created_at).toLocaleString()}</p>
              </div>

              {selectedDoctor.status === "pending" && (
                <div className="pt-4 border-t">
                  <label className="text-sm font-medium text-muted-foreground">
                    Rejection Reason (optional)
                  </label>
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
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
            {selectedDoctor?.status === "pending" && (
              <>
                <Button
                  onClick={() => handleVerify(selectedDoctor.id)}
                  disabled={isProcessing}
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                  Verify
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleReject}
                  disabled={isProcessing}
                >
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

export default AdminDoctors;
