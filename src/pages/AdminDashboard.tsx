import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Stethoscope, Pill, Clock, CheckCircle, XCircle, ArrowRight, Shield } from "lucide-react";

interface DashboardStats {
  doctors: { pending: number; verified: number; rejected: number };
  pharmacists: { pending: number; verified: number; rejected: number };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    doctors: { pending: 0, verified: 0, rejected: 0 },
    pharmacists: { pending: 0, verified: 0, rejected: 0 },
  });
  const [recentDoctors, setRecentDoctors] = useState<any[]>([]);
  const [recentPharmacists, setRecentPharmacists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const checkAdminAndFetchData = async () => {
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: adminCheck } = await supabase.rpc('has_role', { _user_id: user.id, _role: 'admin' });
      
      if (!adminCheck) {
        navigate("/");
        return;
      }

      setIsAdmin(true);
      await fetchDashboardData();
    };

    checkAdminAndFetchData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    try {
      // Fetch doctors stats
      const { data: doctors } = await supabase.from('doctors').select('status, full_name, specialization, created_at, id');
      
      // Fetch pharmacists stats
      const { data: pharmacists } = await supabase.from('pharmacists').select('status, full_name, pharmacy_name, created_at, id');

      if (doctors) {
        const doctorStats = {
          pending: doctors.filter(d => d.status === 'pending').length,
          verified: doctors.filter(d => d.status === 'verified').length,
          rejected: doctors.filter(d => d.status === 'rejected').length,
        };
        setStats(prev => ({ ...prev, doctors: doctorStats }));
        
        // Get recent pending doctors
        const pendingDoctors = doctors
          .filter(d => d.status === 'pending')
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5);
        setRecentDoctors(pendingDoctors);
      }

      if (pharmacists) {
        const pharmacistStats = {
          pending: pharmacists.filter(p => p.status === 'pending').length,
          verified: pharmacists.filter(p => p.status === 'verified').length,
          rejected: pharmacists.filter(p => p.status === 'rejected').length,
        };
        setStats(prev => ({ ...prev, pharmacists: pharmacistStats }));
        
        // Get recent pending pharmacists
        const pendingPharmacists = pharmacists
          .filter(p => p.status === 'pending')
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5);
        setRecentPharmacists(pendingPharmacists);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin || loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container py-8 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </main>
        <Footer />
      </div>
    );
  }

  const totalPending = stats.doctors.pending + stats.pharmacists.pending;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-xl bg-primary/10">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage doctor and pharmacist verifications</p>
          </div>
        </div>

        {/* Alert for pending verifications */}
        {totalPending > 0 && (
          <Card className="mb-8 border-warning bg-warning/5">
            <CardContent className="flex items-center gap-4 py-4">
              <Clock className="h-6 w-6 text-warning" />
              <div className="flex-1">
                <p className="font-medium text-foreground">
                  {totalPending} pending verification{totalPending > 1 ? 's' : ''} require your attention
                </p>
                <p className="text-sm text-muted-foreground">
                  {stats.doctors.pending} doctor{stats.doctors.pending !== 1 ? 's' : ''} and {stats.pharmacists.pending} pharmacist{stats.pharmacists.pending !== 1 ? 's' : ''} awaiting review
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Overview */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Doctors Stats */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Stethoscope className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <CardTitle className="text-lg">Doctors</CardTitle>
                  <CardDescription>Verification overview</CardDescription>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate("/admin/doctors")}>
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center p-4 rounded-lg bg-warning/10">
                  <Clock className="h-5 w-5 text-warning mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{stats.doctors.pending}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-green-500/10">
                  <CheckCircle className="h-5 w-5 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{stats.doctors.verified}</p>
                  <p className="text-xs text-muted-foreground">Verified</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-destructive/10">
                  <XCircle className="h-5 w-5 text-destructive mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{stats.doctors.rejected}</p>
                  <p className="text-xs text-muted-foreground">Rejected</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pharmacists Stats */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Pill className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <CardTitle className="text-lg">Pharmacists</CardTitle>
                  <CardDescription>Verification overview</CardDescription>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate("/admin/pharmacists")}>
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center p-4 rounded-lg bg-warning/10">
                  <Clock className="h-5 w-5 text-warning mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{stats.pharmacists.pending}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-green-500/10">
                  <CheckCircle className="h-5 w-5 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{stats.pharmacists.verified}</p>
                  <p className="text-xs text-muted-foreground">Verified</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-destructive/10">
                  <XCircle className="h-5 w-5 text-destructive mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{stats.pharmacists.rejected}</p>
                  <p className="text-xs text-muted-foreground">Rejected</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Pending */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent Pending Doctors */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-warning" />
                Recent Pending Doctors
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentDoctors.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-4">No pending doctor verifications</p>
              ) : (
                <div className="space-y-3">
                  {recentDoctors.map((doctor) => (
                    <div key={doctor.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium text-foreground">{doctor.full_name}</p>
                        <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                      </div>
                      <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                        Pending
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
              {recentDoctors.length > 0 && (
                <Button variant="ghost" className="w-full mt-4" onClick={() => navigate("/admin/doctors")}>
                  View all pending doctors
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Recent Pending Pharmacists */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-warning" />
                Recent Pending Pharmacists
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentPharmacists.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-4">No pending pharmacist verifications</p>
              ) : (
                <div className="space-y-3">
                  {recentPharmacists.map((pharmacist) => (
                    <div key={pharmacist.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium text-foreground">{pharmacist.full_name}</p>
                        <p className="text-sm text-muted-foreground">{pharmacist.pharmacy_name}</p>
                      </div>
                      <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                        Pending
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
              {recentPharmacists.length > 0 && (
                <Button variant="ghost" className="w-full mt-4" onClick={() => navigate("/admin/pharmacists")}>
                  View all pending pharmacists
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
