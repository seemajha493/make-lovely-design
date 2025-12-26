import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, User, MapPin, Phone, Building2, Stethoscope, CalendarCheck, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

interface Doctor {
  id: string;
  full_name: string;
  specialization: string;
  qualification: string;
  experience_years: number | null;
  hospital_clinic: string | null;
  phone: string | null;
  bio: string | null;
}

interface Appointment {
  id: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  visit_type: string;
  reason: string | null;
  notes: string | null;
  created_at: string;
  doctors?: {
    id: string;
    full_name: string;
    specialization: string;
    hospital_clinic: string | null;
    phone: string | null;
  };
}

const Appointments = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Form state
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [visitType, setVisitType] = useState("in_person");
  const [reason, setReason] = useState("");

  useEffect(() => {
    checkAuth();
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);

    supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
  };

  const fetchDoctors = async () => {
    try {
      const { data, error } = await supabase
        .from("doctors")
        .select("*")
        .eq("status", "verified");

      if (error) throw error;
      setDoctors(data || []);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from("appointments")
        .select(`
          *,
          doctors (
            id,
            full_name,
            specialization,
            hospital_clinic,
            phone
          )
        `)
        .order("appointment_date", { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const handleBookAppointment = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to book an appointment",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (!selectedDoctor || !appointmentDate || !appointmentTime) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsBooking(true);
    try {
      const { error } = await supabase.from("appointments").insert({
        user_id: user.id,
        doctor_id: selectedDoctor.id,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        visit_type: visitType,
        reason: reason || null,
      });

      if (error) {
        if (error.code === "23505") {
          throw new Error("This time slot is already booked. Please choose another time.");
        }
        throw error;
      }

      toast({
        title: "Appointment Booked!",
        description: `Your appointment with Dr. ${selectedDoctor.full_name} has been scheduled.`,
      });

      // Reset form
      setSelectedDoctor(null);
      setAppointmentDate("");
      setAppointmentTime("");
      setVisitType("in_person");
      setReason("");
      fetchAppointments();
    } catch (error: any) {
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to book appointment",
        variant: "destructive",
      });
    } finally {
      setIsBooking(false);
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      const { error } = await supabase
        .from("appointments")
        .update({ status: "cancelled" })
        .eq("id", appointmentId);

      if (error) throw error;

      toast({
        title: "Appointment Cancelled",
        description: "Your appointment has been cancelled.",
      });
      fetchAppointments();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel appointment",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "secondary",
      confirmed: "default",
      cancelled: "destructive",
      completed: "outline",
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <CalendarCheck className="w-8 h-8 text-primary" />
            Doctor Appointments
          </h1>
          <p className="text-muted-foreground mt-2">
            Book appointments with verified doctors for in-person or home visits
          </p>
        </div>

        <Tabs defaultValue="book" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="book">Book Appointment</TabsTrigger>
            <TabsTrigger value="my-appointments">My Appointments</TabsTrigger>
          </TabsList>

          <TabsContent value="book" className="space-y-6">
            {/* Doctor Selection */}
            {!selectedDoctor ? (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Select a Doctor</h2>
                {isLoading ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className="animate-pulse">
                        <CardContent className="p-6">
                          <div className="h-24 bg-muted rounded" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : doctors.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Stethoscope className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No verified doctors available at the moment.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {doctors.map((doctor) => (
                      <Card
                        key={doctor.id}
                        className="cursor-pointer hover:border-primary transition-colors"
                        onClick={() => setSelectedDoctor(doctor)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-foreground truncate">
                                Dr. {doctor.full_name}
                              </h3>
                              <p className="text-sm text-primary">{doctor.specialization}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {doctor.qualification}
                              </p>
                              {doctor.experience_years && (
                                <p className="text-xs text-muted-foreground">
                                  {doctor.experience_years} years experience
                                </p>
                              )}
                              {doctor.hospital_clinic && (
                                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                  <Building2 className="w-3 h-3" />
                                  {doctor.hospital_clinic}
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Booking Form */
              <div className="max-w-2xl mx-auto space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" />
                        Dr. {selectedDoctor.full_name}
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedDoctor(null)}
                      >
                        Change Doctor
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {selectedDoctor.specialization} • {selectedDoctor.qualification}
                    </p>
                    {selectedDoctor.hospital_clinic && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {selectedDoctor.hospital_clinic}
                      </p>
                    )}
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Appointment Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date" className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Date *
                        </Label>
                        <Input
                          id="date"
                          type="date"
                          value={appointmentDate}
                          onChange={(e) => setAppointmentDate(e.target.value)}
                          min={new Date().toISOString().split("T")[0]}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="time" className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Time Slot *
                        </Label>
                        <Select value={appointmentTime} onValueChange={setAppointmentTime}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map((slot) => (
                              <SelectItem key={slot} value={slot}>
                                {slot}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="visitType" className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Visit Type
                      </Label>
                      <Select value={visitType} onValueChange={setVisitType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="in_person">In-Person Visit (Clinic)</SelectItem>
                          <SelectItem value="home_visit">Home Visit</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reason">Reason for Visit</Label>
                      <Textarea
                        id="reason"
                        placeholder="Briefly describe your symptoms or reason for appointment..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        rows={3}
                      />
                    </div>

                    <Button
                      onClick={handleBookAppointment}
                      disabled={isBooking || !appointmentDate || !appointmentTime}
                      className="w-full"
                      size="lg"
                    >
                      {isBooking ? "Booking..." : "Confirm Appointment"}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="my-appointments" className="space-y-4">
            {!user ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <User className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">Please login to view your appointments</p>
                  <Button onClick={() => navigate("/auth")}>Login</Button>
                </CardContent>
              </Card>
            ) : appointments.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <CalendarCheck className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No appointments found</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <Card key={appointment.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Stethoscope className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">
                              Dr. {appointment.doctors?.full_name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {appointment.doctors?.specialization}
                            </p>
                            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {format(new Date(appointment.appointment_date), "PPP")}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {appointment.appointment_time}
                              </span>
                              <Badge variant="outline">
                                {appointment.visit_type === "in_person" ? "Clinic Visit" : "Home Visit"}
                              </Badge>
                            </div>
                            {appointment.reason && (
                              <p className="text-sm text-muted-foreground mt-2">
                                Reason: {appointment.reason}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {getStatusBadge(appointment.status)}
                          {appointment.status === "pending" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCancelAppointment(appointment.id)}
                            >
                              <X className="w-4 h-4 mr-1" />
                              Cancel
                            </Button>
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
      </main>
      <Footer />
    </div>
  );
};

export default Appointments;
