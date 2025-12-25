import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Pill, User, Clock, CheckCircle, XCircle, AlertCircle, LogOut, Edit2, Save, Loader2, Building2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Pharmacist = Database["public"]["Tables"]["pharmacists"]["Row"];

const PharmacistDashboard = () => {
  const [pharmacist, setPharmacist] = useState<Pharmacist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedPharmacist, setEditedPharmacist] = useState<Partial<Pharmacist>>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/pharmacist-auth");
        return;
      }
      fetchPharmacistProfile(session.user.id);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        navigate("/pharmacist-auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchPharmacistProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("pharmacists")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        toast({
          title: "Profile not found",
          description: "Please register as a pharmacist first.",
          variant: "destructive",
        });
        await supabase.auth.signOut();
        navigate("/pharmacist-auth");
        return;
      }

      setPharmacist(data);
      setEditedPharmacist(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/pharmacist-auth");
  };

  const handleSave = async () => {
    if (!pharmacist) return;
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from("pharmacists")
        .update({
          full_name: editedPharmacist.full_name,
          phone: editedPharmacist.phone,
          pharmacy_name: editedPharmacist.pharmacy_name,
          pharmacy_address: editedPharmacist.pharmacy_address,
          experience_years: editedPharmacist.experience_years,
        })
        .eq("id", pharmacist.id);

      if (error) throw error;

      setPharmacist({ ...pharmacist, ...editedPharmacist });
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">
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
            Pending Verification
          </Badge>
        );
    }
  };

  if (isLoading) {
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

  if (!pharmacist) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-green-500/10 rounded-full">
                <Pill className="w-10 h-10 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  Welcome, {pharmacist.full_name}
                </h1>
                <p className="text-muted-foreground">{pharmacist.pharmacy_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {getStatusBadge(pharmacist.status)}
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>

          {/* Status Alert */}
          {pharmacist.status === "pending" && (
            <Card className="mb-6 border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-800 dark:text-amber-200">Verification Pending</p>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      Your pharmacy is under review. You'll be able to access all features once verified.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {pharmacist.status === "rejected" && (
            <Card className="mb-6 border-destructive/50 bg-destructive/10">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-destructive mt-0.5" />
                  <div>
                    <p className="font-medium text-destructive">Verification Rejected</p>
                    <p className="text-sm text-destructive/80">
                      {pharmacist.rejection_reason || "Your verification was rejected. Please contact support for more information."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Profile Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Pharmacy Information
                </CardTitle>
                <CardDescription>Your pharmacy and professional details</CardDescription>
              </div>
              {!isEditing ? (
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => { setIsEditing(false); setEditedPharmacist(pharmacist); }}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    Save
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                  {isEditing ? (
                    <Input
                      value={editedPharmacist.full_name || ""}
                      onChange={(e) => setEditedPharmacist({ ...editedPharmacist, full_name: e.target.value })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-foreground mt-1">{pharmacist.full_name}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-foreground mt-1">{pharmacist.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  {isEditing ? (
                    <Input
                      value={editedPharmacist.phone || ""}
                      onChange={(e) => setEditedPharmacist({ ...editedPharmacist, phone: e.target.value })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-foreground mt-1">{pharmacist.phone || "Not provided"}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">License Number</label>
                  <p className="text-foreground mt-1">{pharmacist.license_number}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Qualification</label>
                  <p className="text-foreground mt-1">{pharmacist.qualification}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Years of Experience</label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editedPharmacist.experience_years || ""}
                      onChange={(e) => setEditedPharmacist({ ...editedPharmacist, experience_years: parseInt(e.target.value) || null })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-foreground mt-1">{pharmacist.experience_years || "Not provided"}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Pharmacy Name</label>
                  {isEditing ? (
                    <Input
                      value={editedPharmacist.pharmacy_name || ""}
                      onChange={(e) => setEditedPharmacist({ ...editedPharmacist, pharmacy_name: e.target.value })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-foreground mt-1">{pharmacist.pharmacy_name}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Pharmacy Address</label>
                  {isEditing ? (
                    <Input
                      value={editedPharmacist.pharmacy_address || ""}
                      onChange={(e) => setEditedPharmacist({ ...editedPharmacist, pharmacy_address: e.target.value })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-foreground mt-1">{pharmacist.pharmacy_address || "Not provided"}</p>
                  )}
                </div>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Registered on: {new Date(pharmacist.created_at).toLocaleDateString()}
                </p>
                {pharmacist.verified_at && (
                  <p className="text-sm text-muted-foreground">
                    Verified on: {new Date(pharmacist.verified_at).toLocaleDateString()}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PharmacistDashboard;
