import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SOSButton } from "@/components/SOSButton";
import { Search, MapPin, Clock, Bed, Activity, Filter, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const hospitals = [
  {
    id: 1,
    name: "City General Hospital",
    address: "123 Main Street, Downtown",
    distance: "1.2 km",
    waitTime: "15 min",
    beds: 24,
    icuBeds: 5,
    oxygenBeds: 12,
    ventilators: 8,
    status: "available",
    phone: "+91 98765 43210",
    specialties: ["Emergency", "Cardiology", "Neurology"],
  },
  {
    id: 2,
    name: "Apollo Medical Center",
    address: "456 Health Avenue, Sector 5",
    distance: "2.5 km",
    waitTime: "25 min",
    beds: 18,
    icuBeds: 3,
    oxygenBeds: 8,
    ventilators: 4,
    status: "limited",
    phone: "+91 98765 43211",
    specialties: ["Trauma", "Orthopedics", "Pediatrics"],
  },
  {
    id: 3,
    name: "Max Super Specialty Hospital",
    address: "789 Care Road, Medical Hub",
    distance: "3.8 km",
    waitTime: "10 min",
    beds: 42,
    icuBeds: 8,
    oxygenBeds: 20,
    ventilators: 12,
    status: "available",
    phone: "+91 98765 43212",
    specialties: ["Multi-specialty", "Cancer Care", "Heart Center"],
  },
  {
    id: 4,
    name: "Fortis Healthcare",
    address: "321 Wellness Lane, Tech Park",
    distance: "5.2 km",
    waitTime: "30 min",
    beds: 8,
    icuBeds: 2,
    oxygenBeds: 4,
    ventilators: 2,
    status: "limited",
    phone: "+91 98765 43213",
    specialties: ["General Medicine", "Surgery", "Dermatology"],
  },
];

const statusColors = {
  available: "bg-success/10 text-success border-success/20",
  limited: "bg-warning/10 text-warning border-warning/20",
  full: "bg-destructive/10 text-destructive border-destructive/20",
};

const Hospitals = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useTranslation();

  const filteredHospitals = hospitals.filter(hospital =>
    hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hospital.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "available":
        return t('hospitalsPage.available');
      case "limited":
        return t('hospitalsPage.limited');
      case "full":
        return t('hospitalsPage.full');
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {t('hospitalsPage.title')}
            </h1>
            <p className="text-muted-foreground">
              {t('hospitalsPage.subtitle')}
            </p>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder={t('hospitalsPage.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-12 pr-4 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <Button variant="outline" className="h-12 gap-2">
              <Filter className="h-5 w-5" />
              {t('hospitalsPage.filters')}
            </Button>
          </div>

          {/* Hospital List */}
          <div className="space-y-6">
            {filteredHospitals.map((hospital) => (
              <div
                key={hospital.id}
                className="p-6 rounded-2xl bg-card border border-border shadow-card"
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-foreground mb-1">
                          {hospital.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {hospital.address} • {hospital.distance}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[hospital.status as keyof typeof statusColors]}`}>
                        {getStatusLabel(hospital.status)}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {hospital.specialties.map((specialty) => (
                        <span
                          key={specialty}
                          className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:w-auto">
                    <div className="text-center p-4 rounded-xl bg-muted/50 min-w-[80px]">
                      <Clock className="h-5 w-5 mx-auto mb-1 text-primary" />
                      <div className="text-lg font-semibold text-foreground">{hospital.waitTime}</div>
                      <div className="text-xs text-muted-foreground">{t('common.wait')}</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-muted/50 min-w-[80px]">
                      <Bed className="h-5 w-5 mx-auto mb-1 text-teal" />
                      <div className="text-lg font-semibold text-foreground">{hospital.beds}</div>
                      <div className="text-xs text-muted-foreground">{t('common.beds')}</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-muted/50 min-w-[80px]">
                      <Activity className="h-5 w-5 mx-auto mb-1 text-destructive" />
                      <div className="text-lg font-semibold text-foreground">{hospital.icuBeds}</div>
                      <div className="text-xs text-muted-foreground">{t('common.icu')}</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-muted/50 min-w-[80px]">
                      <Activity className="h-5 w-5 mx-auto mb-1 text-warning" />
                      <div className="text-lg font-semibold text-foreground">{hospital.ventilators}</div>
                      <div className="text-xs text-muted-foreground">{t('common.ventilators')}</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-border">
                  <Button variant="default" className="gap-2">
                    <MapPin className="h-4 w-4" />
                    {t('common.getDirections')}
                  </Button>
                  <Button variant="outline" className="gap-2" asChild>
                    <a href={`tel:${hospital.phone}`}>
                      <Phone className="h-4 w-4" />
                      {t('common.callHospital')}
                    </a>
                  </Button>
                  <Button variant="teal" className="gap-2">
                    {t('common.bookAppointment')}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <SOSButton />
    </div>
  );
};

export default Hospitals;
