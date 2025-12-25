import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SOSButton } from "@/components/SOSButton";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Droplets, 
  MapPin, 
  Phone, 
  Clock, 
  Search,
  X,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner";

interface BloodAvailability {
  type: string;
  available: boolean;
  units: number;
}

interface BloodBank {
  id: number;
  name: string;
  address: string;
  distance: string;
  phone: string;
  hours: string;
  isOpen: boolean;
  bloodStock: BloodAvailability[];
}

const bloodBanks: BloodBank[] = [
  {
    id: 1,
    name: "City Blood Bank",
    address: "123 Main Street, Downtown",
    distance: "1.5 km",
    phone: "+91 98765 43210",
    hours: "24/7",
    isOpen: true,
    bloodStock: [
      { type: "A+", available: true, units: 15 },
      { type: "A-", available: true, units: 5 },
      { type: "B+", available: true, units: 12 },
      { type: "B-", available: false, units: 0 },
      { type: "AB+", available: true, units: 8 },
      { type: "AB-", available: true, units: 3 },
      { type: "O+", available: true, units: 20 },
      { type: "O-", available: true, units: 6 },
    ],
  },
  {
    id: 2,
    name: "Red Cross Blood Center",
    address: "456 Health Avenue, Sector 5",
    distance: "2.8 km",
    phone: "+91 98765 43211",
    hours: "8:00 AM - 10:00 PM",
    isOpen: true,
    bloodStock: [
      { type: "A+", available: true, units: 10 },
      { type: "A-", available: false, units: 0 },
      { type: "B+", available: true, units: 8 },
      { type: "B-", available: true, units: 2 },
      { type: "AB+", available: true, units: 5 },
      { type: "AB-", available: false, units: 0 },
      { type: "O+", available: true, units: 15 },
      { type: "O-", available: true, units: 4 },
    ],
  },
  {
    id: 3,
    name: "Apollo Blood Bank",
    address: "789 Care Road, Medical Hub",
    distance: "3.5 km",
    phone: "+91 98765 43212",
    hours: "24/7",
    isOpen: true,
    bloodStock: [
      { type: "A+", available: true, units: 25 },
      { type: "A-", available: true, units: 8 },
      { type: "B+", available: true, units: 18 },
      { type: "B-", available: true, units: 4 },
      { type: "AB+", available: true, units: 12 },
      { type: "AB-", available: true, units: 2 },
      { type: "O+", available: true, units: 30 },
      { type: "O-", available: true, units: 10 },
    ],
  },
  {
    id: 4,
    name: "Government Blood Bank",
    address: "101 Civil Lines, Central District",
    distance: "4.2 km",
    phone: "+91 98765 43213",
    hours: "9:00 AM - 6:00 PM",
    isOpen: false,
    bloodStock: [
      { type: "A+", available: true, units: 8 },
      { type: "A-", available: true, units: 3 },
      { type: "B+", available: true, units: 6 },
      { type: "B-", available: false, units: 0 },
      { type: "AB+", available: true, units: 4 },
      { type: "AB-", available: false, units: 0 },
      { type: "O+", available: true, units: 12 },
      { type: "O-", available: false, units: 0 },
    ],
  },
  {
    id: 5,
    name: "LifeLine Blood Services",
    address: "555 Emergency Lane, Health City",
    distance: "5.1 km",
    phone: "+91 98765 43214",
    hours: "24/7",
    isOpen: true,
    bloodStock: [
      { type: "A+", available: true, units: 20 },
      { type: "A-", available: true, units: 6 },
      { type: "B+", available: true, units: 14 },
      { type: "B-", available: true, units: 3 },
      { type: "AB+", available: true, units: 9 },
      { type: "AB-", available: true, units: 1 },
      { type: "O+", available: true, units: 25 },
      { type: "O-", available: true, units: 8 },
    ],
  },
];

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const BloodBanks = () => {
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedBank, setSelectedBank] = useState<BloodBank | null>(null);
  const [requestBloodGroup, setRequestBloodGroup] = useState("");
  const [requestUnits, setRequestUnits] = useState("1");
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [urgency, setUrgency] = useState<"normal" | "urgent" | "emergency">("normal");
  const [requestConfirmed, setRequestConfirmed] = useState(false);

  const filteredBanks = bloodBanks.filter((bank) => {
    const matchesSearch = bank.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bank.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!selectedBloodGroup) return matchesSearch;
    
    const hasBloodGroup = bank.bloodStock.find(
      (stock) => stock.type === selectedBloodGroup && stock.available
    );
    return matchesSearch && hasBloodGroup;
  });

  const openRequestModal = (bank: BloodBank) => {
    setSelectedBank(bank);
    setShowRequestModal(true);
    if (selectedBloodGroup) {
      setRequestBloodGroup(selectedBloodGroup);
    }
  };

  const handleRequest = () => {
    if (!requestBloodGroup || !patientName.trim() || !patientPhone.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    setRequestConfirmed(true);
    toast.success("Blood request submitted successfully!");
  };

  const resetRequest = () => {
    setShowRequestModal(false);
    setSelectedBank(null);
    setRequestBloodGroup("");
    setRequestUnits("1");
    setPatientName("");
    setPatientPhone("");
    setUrgency("normal");
    setRequestConfirmed(false);
  };

  const getStockColor = (units: number, available: boolean) => {
    if (!available || units === 0) return "bg-destructive/10 text-destructive border-destructive/20";
    if (units <= 3) return "bg-warning/10 text-warning border-warning/20";
    return "bg-success/10 text-success border-success/20";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex p-4 rounded-2xl bg-destructive/10 text-destructive mb-4">
              <Droplets className="h-10 w-10" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Blood Bank Finder
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Find nearby blood banks with real-time blood group availability and request blood for emergencies
            </p>
          </div>

          {/* Blood Group Filter */}
          <div className="mb-6">
            <p className="text-sm font-medium text-foreground mb-3">Filter by Blood Group</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedBloodGroup(null)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  selectedBloodGroup === null
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
              >
                All Groups
              </button>
              {bloodGroups.map((group) => (
                <button
                  key={group}
                  onClick={() => setSelectedBloodGroup(group)}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                    selectedBloodGroup === group
                      ? "bg-destructive text-destructive-foreground"
                      : "bg-muted text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {group}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search blood banks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Blood Banks List */}
          <div className="space-y-6">
            {filteredBanks.map((bank) => (
              <div
                key={bank.id}
                className="p-6 rounded-2xl bg-card border border-border shadow-card"
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-semibold text-foreground">
                            {bank.name}
                          </h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            bank.isOpen 
                              ? "bg-success/10 text-success" 
                              : "bg-muted text-muted-foreground"
                          }`}>
                            {bank.isOpen ? "Open" : "Closed"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <MapPin className="h-4 w-4" />
                          {bank.address} • {bank.distance}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {bank.phone}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {bank.hours}
                      </div>
                    </div>

                    {/* Blood Stock */}
                    <div>
                      <p className="text-sm font-medium text-foreground mb-2">Blood Availability</p>
                      <div className="flex flex-wrap gap-2">
                        {bank.bloodStock.map((stock) => (
                          <div
                            key={stock.type}
                            className={`px-3 py-2 rounded-lg border text-center min-w-[60px] ${getStockColor(stock.units, stock.available)}`}
                          >
                            <div className="text-sm font-bold">{stock.type}</div>
                            <div className="text-xs">
                              {stock.available ? `${stock.units} units` : "N/A"}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 lg:min-w-[150px]">
                    <Button
                      variant="emergency"
                      className="gap-2"
                      onClick={() => openRequestModal(bank)}
                    >
                      <Droplets className="h-4 w-4" />
                      Request Blood
                    </Button>
                    <Button variant="outline" className="gap-2" asChild>
                      <a href={`tel:${bank.phone}`}>
                        <Phone className="h-4 w-4" />
                        Call
                      </a>
                    </Button>
                    <Button variant="default" className="gap-2">
                      <MapPin className="h-4 w-4" />
                      Directions
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {filteredBanks.length === 0 && (
              <div className="text-center py-12">
                <Droplets className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No blood banks found</h3>
                <p className="text-muted-foreground">
                  {selectedBloodGroup 
                    ? `No blood banks with ${selectedBloodGroup} available nearby`
                    : "Try adjusting your search criteria"
                  }
                </p>
              </div>
            )}
          </div>

          {/* Emergency Notice */}
          <div className="mt-8 p-6 rounded-2xl bg-warning/10 border border-warning/20">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-warning shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">Emergency Blood Requirement?</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  For immediate blood requirements, call the 24/7 blood helpline or visit the nearest blood bank directly.
                </p>
                <Button variant="emergency" size="sm" asChild>
                  <a href="tel:104">Call Blood Helpline - 104</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Request Blood Modal */}
      {showRequestModal && selectedBank && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-card border border-border shadow-xl">
            {!requestConfirmed ? (
              <>
                {/* Modal Header */}
                <div className="sticky top-0 bg-card p-6 border-b border-border flex items-center justify-between">
                  <h2 className="text-xl font-bold text-foreground">Request Blood</h2>
                  <button onClick={resetRequest} className="p-2 rounded-lg hover:bg-accent">
                    <X className="h-5 w-5 text-muted-foreground" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Bank Info */}
                  <div className="p-4 rounded-xl bg-muted/50">
                    <h3 className="font-semibold text-foreground">{selectedBank.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedBank.address}</p>
                  </div>

                  {/* Blood Group Selection */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Select Blood Group *
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {bloodGroups.map((group) => {
                        const stock = selectedBank.bloodStock.find(s => s.type === group);
                        const isAvailable = stock?.available;
                        return (
                          <button
                            key={group}
                            onClick={() => isAvailable && setRequestBloodGroup(group)}
                            disabled={!isAvailable}
                            className={`px-3 py-3 rounded-xl text-sm font-bold transition-all ${
                              requestBloodGroup === group
                                ? "bg-destructive text-destructive-foreground"
                                : isAvailable
                                ? "bg-muted text-foreground hover:bg-accent"
                                : "bg-muted/50 text-muted-foreground cursor-not-allowed"
                            }`}
                          >
                            {group}
                            {stock && (
                              <div className="text-xs font-normal mt-1">
                                {isAvailable ? `${stock.units} units` : "N/A"}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Units Required */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Units Required
                    </label>
                    <select
                      value={requestUnits}
                      onChange={(e) => setRequestUnits(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>{num} unit{num > 1 ? "s" : ""}</option>
                      ))}
                    </select>
                  </div>

                  {/* Urgency */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Urgency Level
                    </label>
                    <div className="flex gap-2">
                      {[
                        { value: "normal", label: "Normal", color: "bg-primary" },
                        { value: "urgent", label: "Urgent", color: "bg-warning" },
                        { value: "emergency", label: "Emergency", color: "bg-destructive" },
                      ].map((level) => (
                        <button
                          key={level.value}
                          onClick={() => setUrgency(level.value as typeof urgency)}
                          className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                            urgency === level.value
                              ? `${level.color} text-white`
                              : "bg-muted text-muted-foreground hover:bg-accent"
                          }`}
                        >
                          {level.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Patient Details */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Patient Name *
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
                        Contact Phone *
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

                  {/* Submit Button */}
                  <Button
                    variant="emergency"
                    size="lg"
                    className="w-full gap-2"
                    onClick={handleRequest}
                  >
                    <Droplets className="h-5 w-5" />
                    Submit Blood Request
                  </Button>
                </div>
              </>
            ) : (
              /* Confirmation Screen */
              <div className="p-8 text-center">
                <div className="inline-flex p-4 rounded-full bg-success/10 text-success mb-6">
                  <CheckCircle2 className="h-12 w-12" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Request Submitted!</h2>
                <p className="text-muted-foreground mb-6">
                  Your blood request has been sent to {selectedBank.name}
                </p>

                <div className="p-4 rounded-xl bg-muted/50 text-left mb-6 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Blood Group</span>
                    <span className="font-bold text-destructive">{requestBloodGroup}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Units</span>
                    <span className="font-medium text-foreground">{requestUnits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Urgency</span>
                    <span className={`font-medium capitalize ${
                      urgency === "emergency" ? "text-destructive" : 
                      urgency === "urgent" ? "text-warning" : "text-foreground"
                    }`}>{urgency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Patient</span>
                    <span className="font-medium text-foreground">{patientName}</span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-6">
                  The blood bank will contact you shortly at {patientPhone}.
                  {urgency === "emergency" && " For emergencies, please also call them directly."}
                </p>

                <div className="flex gap-3">
                  <Button variant="outline" size="lg" className="flex-1" onClick={resetRequest}>
                    Done
                  </Button>
                  <Button variant="default" size="lg" className="flex-1 gap-2" asChild>
                    <a href={`tel:${selectedBank.phone}`}>
                      <Phone className="h-4 w-4" />
                      Call Bank
                    </a>
                  </Button>
                </div>
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

export default BloodBanks;
