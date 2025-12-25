import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SOSButton } from "@/components/SOSButton";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Video, 
  Star, 
  Clock, 
  Calendar, 
  MapPin, 
  BadgeCheck, 
  Phone, 
  X,
  CheckCircle2
} from "lucide-react";
import { toast } from "sonner";

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  reviews: number;
  image: string;
  available: boolean;
  nextSlot: string;
  languages: string[];
  consultationFee: number;
  hospital: string;
}

const doctors: Doctor[] = [
  {
    id: 1,
    name: "Dr. Priya Sharma",
    specialty: "General Physician",
    experience: "15 years",
    rating: 4.9,
    reviews: 2450,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face",
    available: true,
    nextSlot: "Available Now",
    languages: ["English", "Hindi"],
    consultationFee: 500,
    hospital: "Apollo Hospital",
  },
  {
    id: 2,
    name: "Dr. Rajesh Kumar",
    specialty: "Cardiologist",
    experience: "20 years",
    rating: 4.8,
    reviews: 1890,
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face",
    available: true,
    nextSlot: "In 15 mins",
    languages: ["English", "Hindi", "Tamil"],
    consultationFee: 800,
    hospital: "Max Healthcare",
  },
  {
    id: 3,
    name: "Dr. Anjali Desai",
    specialty: "Pediatrician",
    experience: "12 years",
    rating: 4.9,
    reviews: 3200,
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop&crop=face",
    available: true,
    nextSlot: "In 30 mins",
    languages: ["English", "Hindi", "Marathi"],
    consultationFee: 600,
    hospital: "Fortis Hospital",
  },
  {
    id: 4,
    name: "Dr. Mohammed Ali",
    specialty: "Dermatologist",
    experience: "10 years",
    rating: 4.7,
    reviews: 1560,
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&h=200&fit=crop&crop=face",
    available: false,
    nextSlot: "Tomorrow 10:00 AM",
    languages: ["English", "Hindi", "Urdu"],
    consultationFee: 700,
    hospital: "City General Hospital",
  },
  {
    id: 5,
    name: "Dr. Sneha Patel",
    specialty: "Gynecologist",
    experience: "18 years",
    rating: 4.9,
    reviews: 2100,
    image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=200&h=200&fit=crop&crop=face",
    available: true,
    nextSlot: "In 45 mins",
    languages: ["English", "Hindi", "Gujarati"],
    consultationFee: 750,
    hospital: "Apollo Hospital",
  },
  {
    id: 6,
    name: "Dr. Vikram Singh",
    specialty: "Orthopedic",
    experience: "22 years",
    rating: 4.8,
    reviews: 1780,
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&h=200&fit=crop&crop=face",
    available: true,
    nextSlot: "Available Now",
    languages: ["English", "Hindi", "Punjabi"],
    consultationFee: 850,
    hospital: "Max Super Specialty",
  },
];

const timeSlots = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
  "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM", "08:00 PM"
];

const Doctors = () => {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [filterSpecialty, setFilterSpecialty] = useState<string>("all");

  const specialties = ["all", ...new Set(doctors.map(d => d.specialty))];

  const filteredDoctors = filterSpecialty === "all" 
    ? doctors 
    : doctors.filter(d => d.specialty === filterSpecialty);

  const handleBooking = () => {
    if (!patientName.trim() || !patientPhone.trim() || !selectedDate || !selectedTime) {
      toast.error("Please fill in all fields");
      return;
    }
    setBookingConfirmed(true);
    toast.success("Consultation booked successfully!");
  };

  const resetBooking = () => {
    setSelectedDoctor(null);
    setSelectedDate("");
    setSelectedTime("");
    setPatientName("");
    setPatientPhone("");
    setBookingConfirmed(false);
  };

  // Generate next 7 days for date selection
  const getNextDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push({
        date: date.toISOString().split("T")[0],
        display: date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
        isToday: i === 0
      });
    }
    return days;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex p-4 rounded-2xl bg-success/10 text-success mb-4">
              <Video className="h-10 w-10" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Doctor Video Connect
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Consult with verified doctors 24/7 from the comfort of your home via secure video calls
            </p>
          </div>

          {/* Features Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: BadgeCheck, text: "Verified Doctors" },
              { icon: Clock, text: "24/7 Available" },
              { icon: Video, text: "HD Video Calls" },
              { icon: Phone, text: "Instant Connect" },
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
                <feature.icon className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-foreground">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Filter */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {specialties.map((specialty) => (
                <button
                  key={specialty}
                  onClick={() => setFilterSpecialty(specialty)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    filterSpecialty === specialty
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {specialty === "all" ? "All Specialties" : specialty}
                </button>
              ))}
            </div>
          </div>

          {/* Doctor List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className="p-6 rounded-2xl bg-card border border-border shadow-card card-hover"
              >
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground truncate">{doctor.name}</h3>
                      <BadgeCheck className="h-4 w-4 text-primary shrink-0" />
                    </div>
                    <p className="text-sm text-primary font-medium">{doctor.specialty}</p>
                    <p className="text-xs text-muted-foreground">{doctor.experience} experience</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-warning fill-warning" />
                    <span className="text-sm font-medium text-foreground">{doctor.rating}</span>
                    <span className="text-xs text-muted-foreground">({doctor.reviews})</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {doctor.hospital}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {doctor.languages.map((lang) => (
                    <span key={lang} className="px-2 py-0.5 rounded-full bg-muted text-xs text-muted-foreground">
                      {lang}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <p className="text-lg font-bold text-foreground">₹{doctor.consultationFee}</p>
                    <p className={`text-xs ${doctor.available ? "text-success" : "text-muted-foreground"}`}>
                      {doctor.nextSlot}
                    </p>
                  </div>
                  <Button
                    variant={doctor.available ? "hero" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDoctor(doctor)}
                    className="gap-2"
                  >
                    <Video className="h-4 w-4" />
                    {doctor.available ? "Consult Now" : "Book"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Booking Modal */}
      {selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-card border border-border shadow-xl">
            {!bookingConfirmed ? (
              <>
                {/* Modal Header */}
                <div className="sticky top-0 bg-card p-6 border-b border-border flex items-center justify-between">
                  <h2 className="text-xl font-bold text-foreground">Book Consultation</h2>
                  <button onClick={resetBooking} className="p-2 rounded-lg hover:bg-accent">
                    <X className="h-5 w-5 text-muted-foreground" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Doctor Info */}
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
                    <img
                      src={selectedDoctor.image}
                      alt={selectedDoctor.name}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-foreground">{selectedDoctor.name}</h3>
                      <p className="text-sm text-primary">{selectedDoctor.specialty}</p>
                      <p className="text-sm font-medium text-foreground">₹{selectedDoctor.consultationFee}</p>
                    </div>
                  </div>

                  {/* Date Selection */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      <Calendar className="inline h-4 w-4 mr-2" />
                      Select Date
                    </label>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {getNextDays().map((day) => (
                        <button
                          key={day.date}
                          onClick={() => setSelectedDate(day.date)}
                          className={`flex-shrink-0 px-4 py-3 rounded-xl text-center transition-all ${
                            selectedDate === day.date
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground hover:bg-accent"
                          }`}
                        >
                          <div className="text-xs font-medium">
                            {day.isToday ? "Today" : day.display.split(" ")[0]}
                          </div>
                          <div className="text-sm font-semibold">
                            {day.display.split(" ").slice(1).join(" ")}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Slot Selection */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      <Clock className="inline h-4 w-4 mr-2" />
                      Select Time Slot
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setSelectedTime(slot)}
                          className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                            selectedTime === slot
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground hover:bg-accent"
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Patient Details */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Patient Name
                      </label>
                      <input
                        type="text"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        placeholder="Enter patient name"
                        className="w-full h-11 px-4 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={patientPhone}
                        onChange={(e) => setPatientPhone(e.target.value)}
                        placeholder="Enter phone number"
                        className="w-full h-11 px-4 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  {/* Confirm Button */}
                  <Button
                    variant="hero"
                    size="lg"
                    className="w-full gap-2"
                    onClick={handleBooking}
                  >
                    <Video className="h-5 w-5" />
                    Confirm Booking - ₹{selectedDoctor.consultationFee}
                  </Button>
                </div>
              </>
            ) : (
              /* Confirmation Screen */
              <div className="p-8 text-center">
                <div className="inline-flex p-4 rounded-full bg-success/10 text-success mb-6">
                  <CheckCircle2 className="h-12 w-12" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Booking Confirmed!</h2>
                <p className="text-muted-foreground mb-6">
                  Your video consultation has been scheduled
                </p>

                <div className="p-4 rounded-xl bg-muted/50 text-left mb-6 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Doctor</span>
                    <span className="font-medium text-foreground">{selectedDoctor.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-medium text-foreground">{selectedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time</span>
                    <span className="font-medium text-foreground">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Patient</span>
                    <span className="font-medium text-foreground">{patientName}</span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-6">
                  You will receive a video call link on your phone before the consultation.
                </p>

                <Button variant="default" size="lg" className="w-full" onClick={resetBooking}>
                  Done
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
      <SOSButton />
    </div>
  );
};

export default Doctors;
