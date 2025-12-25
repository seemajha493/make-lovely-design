import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Stethoscope, User, Clock, CheckCircle, XCircle, AlertCircle, LogOut, Edit2, Save, Loader2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Doctor = Database["public"]["Tables"]["doctors"]["Row"];

const DoctorDashboard = () => {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedDoctor, setEditedDoctor] = useState<Partial<Doctor>>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/doctor-auth");
        return;
      }
      fetchDoctorProfile(session.user.id);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        navigate("/doctor-auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchDoctorProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("doctors")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        toast({
          title: "Profile not found",
          description: "Please register as a doctor first.",
          variant: "destructive",
        });
        await supabase.auth.signOut();
        navigate("/doctor-auth");
        return;
      }

      setDoctor(data);
      setEditedDoctor(data);
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
    navigate("/doctor-auth");
  };

  const handleSave = async () => {
    if (!doctor) return;
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from("doctors")
        .update({
          full_name: editedDoctor.full_name,
          phone: editedDoctor.phone,
          hospital_clinic: editedDoctor.hospital_clinic,
          experience_years: editedDoctor.experience_years,
          bio: editedDoctor.bio,
        })
        .eq("id", doctor.id);

      if (error) throw error;

      setDoctor({ ...doctor, ...editedDoctor });
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

  if (!doctor) {
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
              <div className="p-4 bg-primary/10 rounded-full">
                <Stethoscope className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  Welcome, Dr. {doctor.full_name}
                </h1>
                <p className="text-muted-foreground">{doctor.specialization}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {getStatusBadge(doctor.status)}
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>

          {/* Status Alert */}
          {doctor.status === "pending" && (
            <Card className="mb-6 border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-800 dark:text-amber-200">Verification Pending</p>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      Your account is under review. You'll be able to access all features once verified.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {doctor.status === "rejected" && (
            <Card className="mb-6 border-destructive/50 bg-destructive/10">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-destructive mt-0.5" />
                  <div>
                    <p className="font-medium text-destructive">Verification Rejected</p>
                    <p className="text-sm text-destructive/80">
                      {doctor.rejection_reason || "Your verification was rejected. Please contact support for more information."}
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
                  <User className="w-5 h-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>Your professional details</CardDescription>
              </div>
              {!isEditing ? (
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => { setIsEditing(false); setEditedDoctor(doctor); }}>
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
                      value={editedDoctor.full_name || ""}
                      onChange={(e) => setEditedDoctor({ ...editedDoctor, full_name: e.target.value })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-foreground mt-1">{doctor.full_name}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-foreground mt-1">{doctor.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  {isEditing ? (
                    <Input
                      value={editedDoctor.phone || ""}
                      onChange={(e) => setEditedDoctor({ ...editedDoctor, phone: e.target.value })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-foreground mt-1">{doctor.phone || "Not provided"}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Specialization</label>
                  <p className="text-foreground mt-1">{doctor.specialization}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Medical License Number</label>
                  <p className="text-foreground mt-1">{doctor.license_number}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Qualification</label>
                  <p className="text-foreground mt-1">{doctor.qualification}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Hospital/Clinic</label>
                  {isEditing ? (
                    <Input
                      value={editedDoctor.hospital_clinic || ""}
                      onChange={(e) => setEditedDoctor({ ...editedDoctor, hospital_clinic: e.target.value })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-foreground mt-1">{doctor.hospital_clinic || "Not provided"}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Years of Experience</label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editedDoctor.experience_years || ""}
                      onChange={(e) => setEditedDoctor({ ...editedDoctor, experience_years: parseInt(e.target.value) || null })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-foreground mt-1">{doctor.experience_years || "Not provided"}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Bio</label>
                {isEditing ? (
                  <Textarea
                    value={editedDoctor.bio || ""}
                    onChange={(e) => setEditedDoctor({ ...editedDoctor, bio: e.target.value })}
                    className="mt-1"
                    rows={3}
                  />
                ) : (
                  <p className="text-foreground mt-1">{doctor.bio || "Not provided"}</p>
                )}
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Registered on: {new Date(doctor.created_at).toLocaleDateString()}
                </p>
                {doctor.verified_at && (
                  <p className="text-sm text-muted-foreground">
                    Verified on: {new Date(doctor.verified_at).toLocaleDateString()}
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

export default DoctorDashboard;
