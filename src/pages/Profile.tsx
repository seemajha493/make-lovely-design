import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  User,
  Phone,
  Droplets,
  Heart,
  Plus,
  Trash2,
  Calendar,
  Building2,
  Loader2,
  AlertCircle,
  Users
} from "lucide-react";

interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  date_of_birth: string | null;
  blood_group: string | null;
  allergies: string[] | null;
  chronic_conditions: string[] | null;
}

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  is_primary: boolean;
}

interface MedicalHistory {
  id: string;
  condition_name: string;
  diagnosis_date: string | null;
  status: string;
  notes: string | null;
}

interface BloodDonation {
  id: string;
  donation_date: string;
  blood_bank_name: string;
  units_donated: number;
  notes: string | null;
}

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistory[]>([]);
  const [donations, setDonations] = useState<BloodDonation[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    full_name: "",
    phone: "",
    date_of_birth: "",
    blood_group: "",
    allergies: "",
    chronic_conditions: "",
  });

  // Modal states
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [donationModalOpen, setDonationModalOpen] = useState(false);

  // New item forms
  const [newContact, setNewContact] = useState({ name: "", relationship: "", phone: "", is_primary: false });
  const [newHistory, setNewHistory] = useState({ condition_name: "", diagnosis_date: "", status: "ongoing", notes: "" });
  const [newDonation, setNewDonation] = useState({ donation_date: "", blood_bank_name: "", units_donated: 1, notes: "" });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [user]);

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([
      fetchProfile(),
      fetchEmergencyContacts(),
      fetchMedicalHistory(),
      fetchDonations(),
    ]);
    setLoading(false);
  };

  const fetchProfile = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user!.id)
      .maybeSingle();
    
    if (data) {
      setProfile(data);
      setProfileForm({
        full_name: data.full_name || "",
        phone: data.phone || "",
        date_of_birth: data.date_of_birth || "",
        blood_group: data.blood_group || "",
        allergies: data.allergies?.join(", ") || "",
        chronic_conditions: data.chronic_conditions?.join(", ") || "",
      });
    }
  };

  const fetchEmergencyContacts = async () => {
    const { data } = await supabase
      .from("emergency_contacts")
      .select("*")
      .eq("user_id", user!.id)
      .order("is_primary", { ascending: false });
    
    if (data) setEmergencyContacts(data);
  };

  const fetchMedicalHistory = async () => {
    const { data } = await supabase
      .from("medical_history")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });
    
    if (data) setMedicalHistory(data);
  };

  const fetchDonations = async () => {
    const { data } = await supabase
      .from("blood_donation_records")
      .select("*")
      .eq("user_id", user!.id)
      .order("donation_date", { ascending: false });
    
    if (data) setDonations(data);
  };

  const saveProfile = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: profileForm.full_name || null,
        phone: profileForm.phone || null,
        date_of_birth: profileForm.date_of_birth || null,
        blood_group: profileForm.blood_group || null,
        allergies: profileForm.allergies ? profileForm.allergies.split(",").map(s => s.trim()) : null,
        chronic_conditions: profileForm.chronic_conditions ? profileForm.chronic_conditions.split(",").map(s => s.trim()) : null,
      })
      .eq("user_id", user!.id);

    if (error) {
      toast({ title: "Error", description: "Failed to save profile", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Profile updated successfully" });
      setEditingProfile(false);
      fetchProfile();
    }
    setSaving(false);
  };

  const addEmergencyContact = async () => {
    if (!newContact.name || !newContact.phone || !newContact.relationship) {
      toast({ title: "Error", description: "Please fill all fields", variant: "destructive" });
      return;
    }

    const { error } = await supabase.from("emergency_contacts").insert({
      user_id: user!.id,
      ...newContact,
    });

    if (error) {
      toast({ title: "Error", description: "Failed to add contact", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Emergency contact added" });
      setNewContact({ name: "", relationship: "", phone: "", is_primary: false });
      setContactModalOpen(false);
      fetchEmergencyContacts();
    }
  };

  const deleteEmergencyContact = async (id: string) => {
    const { error } = await supabase.from("emergency_contacts").delete().eq("id", id);
    if (!error) {
      toast({ title: "Deleted", description: "Contact removed" });
      fetchEmergencyContacts();
    }
  };

  const addMedicalHistory = async () => {
    if (!newHistory.condition_name) {
      toast({ title: "Error", description: "Please enter condition name", variant: "destructive" });
      return;
    }

    const { error } = await supabase.from("medical_history").insert({
      user_id: user!.id,
      condition_name: newHistory.condition_name,
      diagnosis_date: newHistory.diagnosis_date || null,
      status: newHistory.status,
      notes: newHistory.notes || null,
    });

    if (error) {
      toast({ title: "Error", description: "Failed to add medical history", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Medical history added" });
      setNewHistory({ condition_name: "", diagnosis_date: "", status: "ongoing", notes: "" });
      setHistoryModalOpen(false);
      fetchMedicalHistory();
    }
  };

  const deleteMedicalHistory = async (id: string) => {
    const { error } = await supabase.from("medical_history").delete().eq("id", id);
    if (!error) {
      toast({ title: "Deleted", description: "Medical history removed" });
      fetchMedicalHistory();
    }
  };

  const addDonation = async () => {
    if (!newDonation.donation_date || !newDonation.blood_bank_name) {
      toast({ title: "Error", description: "Please fill required fields", variant: "destructive" });
      return;
    }

    const { error } = await supabase.from("blood_donation_records").insert({
      user_id: user!.id,
      ...newDonation,
      notes: newDonation.notes || null,
    });

    if (error) {
      toast({ title: "Error", description: "Failed to add donation record", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Donation record added" });
      setNewDonation({ donation_date: "", blood_bank_name: "", units_donated: 1, notes: "" });
      setDonationModalOpen(false);
      fetchDonations();
    }
  };

  const deleteDonation = async (id: string) => {
    const { error } = await supabase.from("blood_donation_records").delete().eq("id", id);
    if (!error) {
      toast({ title: "Deleted", description: "Donation record removed" });
      fetchDonations();
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Health Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your medical information and emergency contacts</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="contacts" className="gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Contacts</span>
            </TabsTrigger>
            <TabsTrigger value="medical" className="gap-2">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Medical</span>
            </TabsTrigger>
            <TabsTrigger value="donations" className="gap-2">
              <Droplets className="h-4 w-4" />
              <span className="hidden sm:inline">Donations</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Your basic health profile details</CardDescription>
                </div>
                {!editingProfile && (
                  <Button variant="outline" onClick={() => setEditingProfile(true)}>
                    Edit Profile
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {editingProfile ? (
                  <>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Full Name</Label>
                        <Input
                          value={profileForm.full_name}
                          onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Date of Birth</Label>
                        <Input
                          type="date"
                          value={profileForm.date_of_birth}
                          onChange={(e) => setProfileForm({ ...profileForm, date_of_birth: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Blood Group</Label>
                        <Select
                          value={profileForm.blood_group}
                          onValueChange={(value) => setProfileForm({ ...profileForm, blood_group: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select blood group" />
                          </SelectTrigger>
                          <SelectContent>
                            {bloodGroups.map((bg) => (
                              <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Allergies (comma-separated)</Label>
                        <Input
                          value={profileForm.allergies}
                          onChange={(e) => setProfileForm({ ...profileForm, allergies: e.target.value })}
                          placeholder="Penicillin, Peanuts"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Chronic Conditions (comma-separated)</Label>
                        <Input
                          value={profileForm.chronic_conditions}
                          onChange={(e) => setProfileForm({ ...profileForm, chronic_conditions: e.target.value })}
                          placeholder="Diabetes, Hypertension"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button onClick={saveProfile} disabled={saving}>
                        {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={() => setEditingProfile(false)}>Cancel</Button>
                    </div>
                  </>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Full Name</p>
                      <p className="font-medium">{profile?.full_name || "Not set"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{profile?.phone || "Not set"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Date of Birth</p>
                      <p className="font-medium">{profile?.date_of_birth || "Not set"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Blood Group</p>
                      <p className="font-medium">{profile?.blood_group || "Not set"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Allergies</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {profile?.allergies?.length ? (
                          profile.allergies.map((a, i) => (
                            <Badge key={i} variant="secondary">{a}</Badge>
                          ))
                        ) : (
                          <p className="text-muted-foreground">None recorded</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Chronic Conditions</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {profile?.chronic_conditions?.length ? (
                          profile.chronic_conditions.map((c, i) => (
                            <Badge key={i} variant="outline">{c}</Badge>
                          ))
                        ) : (
                          <p className="text-muted-foreground">None recorded</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Emergency Contacts Tab */}
          <TabsContent value="contacts">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Emergency Contacts</CardTitle>
                  <CardDescription>People to contact in case of emergency</CardDescription>
                </div>
                <Dialog open={contactModalOpen} onOpenChange={setContactModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" /> Add Contact
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Emergency Contact</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input
                          value={newContact.name}
                          onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Relationship</Label>
                        <Input
                          value={newContact.relationship}
                          onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                          placeholder="Spouse, Parent, Sibling"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input
                          value={newContact.phone}
                          onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                        />
                      </div>
                      <Button onClick={addEmergencyContact} className="w-full">Add Contact</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {emergencyContacts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No emergency contacts added yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {emergencyContacts.map((contact) => (
                      <div
                        key={contact.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-border"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{contact.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {contact.relationship} • {contact.phone}
                            </p>
                          </div>
                          {contact.is_primary && <Badge>Primary</Badge>}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteEmergencyContact(contact.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Medical History Tab */}
          <TabsContent value="medical">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Medical History</CardTitle>
                  <CardDescription>Your past and ongoing medical conditions</CardDescription>
                </div>
                <Dialog open={historyModalOpen} onOpenChange={setHistoryModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" /> Add Condition
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Medical Condition</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Condition Name</Label>
                        <Input
                          value={newHistory.condition_name}
                          onChange={(e) => setNewHistory({ ...newHistory, condition_name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Diagnosis Date</Label>
                        <Input
                          type="date"
                          value={newHistory.diagnosis_date}
                          onChange={(e) => setNewHistory({ ...newHistory, diagnosis_date: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Status</Label>
                        <Select
                          value={newHistory.status}
                          onValueChange={(value) => setNewHistory({ ...newHistory, status: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ongoing">Ongoing</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                            <SelectItem value="managed">Managed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Notes</Label>
                        <Input
                          value={newHistory.notes}
                          onChange={(e) => setNewHistory({ ...newHistory, notes: e.target.value })}
                        />
                      </div>
                      <Button onClick={addMedicalHistory} className="w-full">Add Condition</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {medicalHistory.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No medical history recorded</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {medicalHistory.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-border"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Heart className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{item.condition_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.diagnosis_date && `Diagnosed: ${item.diagnosis_date}`}
                              {item.notes && ` • ${item.notes}`}
                            </p>
                          </div>
                          <Badge variant={item.status === "ongoing" ? "destructive" : item.status === "managed" ? "secondary" : "outline"}>
                            {item.status}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteMedicalHistory(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Blood Donations Tab */}
          <TabsContent value="donations">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Blood Donation Records</CardTitle>
                  <CardDescription>Track your blood donation history</CardDescription>
                </div>
                <Dialog open={donationModalOpen} onOpenChange={setDonationModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" /> Add Donation
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Donation Record</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Donation Date</Label>
                        <Input
                          type="date"
                          value={newDonation.donation_date}
                          onChange={(e) => setNewDonation({ ...newDonation, donation_date: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Blood Bank Name</Label>
                        <Input
                          value={newDonation.blood_bank_name}
                          onChange={(e) => setNewDonation({ ...newDonation, blood_bank_name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Units Donated</Label>
                        <Input
                          type="number"
                          min="1"
                          value={newDonation.units_donated}
                          onChange={(e) => setNewDonation({ ...newDonation, units_donated: parseInt(e.target.value) || 1 })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Notes</Label>
                        <Input
                          value={newDonation.notes}
                          onChange={(e) => setNewDonation({ ...newDonation, notes: e.target.value })}
                        />
                      </div>
                      <Button onClick={addDonation} className="w-full">Add Record</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {donations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Droplets className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No donation records yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {donations.map((donation) => (
                      <div
                        key={donation.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-border"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                            <Droplets className="h-5 w-5 text-destructive" />
                          </div>
                          <div>
                            <p className="font-medium">{donation.blood_bank_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {donation.donation_date} • {donation.units_donated} unit(s)
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteDonation(donation.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
