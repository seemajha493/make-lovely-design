import { MapPin, Clock, Bed, Activity, ChevronRight, Navigation, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const hospitals = [
  {
    id: 1,
    name: "City General Hospital",
    distance: "1.2 km",
    waitTime: "15 min",
    beds: 24,
    icuBeds: 5,
    status: "available",
  },
  {
    id: 2,
    name: "Apollo Medical Center",
    distance: "2.5 km",
    waitTime: "25 min",
    beds: 18,
    icuBeds: 3,
    status: "limited",
  },
  {
    id: 3,
    name: "Max Super Specialty",
    distance: "3.8 km",
    waitTime: "10 min",
    beds: 42,
    icuBeds: 8,
    status: "available",
  },
];

const statusColors = {
  available: "bg-success/15 text-success border-success/30",
  limited: "bg-warning/15 text-warning border-warning/30",
  full: "bg-destructive/15 text-destructive border-destructive/30",
};

export function NearbyHospitals() {
  const { t } = useTranslation();

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "available":
        return t('hospitals.available');
      case "limited":
        return t('common.limited');
      case "full":
        return t('hospitals.full');
      default:
        return status;
    }
  };

  return (
    <section className="py-20 md:py-28 bg-muted/30 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      
      <div className="container relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
              {t('common.nearYou')}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-3 tracking-tight">
              {t('hospitals.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-md">
              {t('hospitals.subtitle')}
            </p>
          </div>
          <Button variant="outline" size="lg" className="glass hover:bg-card/90 group" asChild>
            <Link to="/hospitals" className="gap-2">
              {t('common.viewAll')} 
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {hospitals.map((hospital, index) => (
            <div
              key={hospital.id}
              className="group p-6 rounded-2xl bg-card border border-border/50 shadow-card card-hover"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {hospital.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="font-medium">{hospital.distance}</span>
                  </div>
                </div>
                <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${statusColors[hospital.status as keyof typeof statusColors]}`}>
                  {getStatusLabel(hospital.status)}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="text-center p-4 rounded-xl bg-muted/50 border border-border/30 group-hover:border-primary/20 transition-colors">
                  <Clock className="h-5 w-5 mx-auto mb-2 text-primary" />
                  <div className="text-base font-bold text-foreground">{hospital.waitTime}</div>
                  <div className="text-xs text-muted-foreground font-medium">{t('hospitals.waitTime')}</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-muted/50 border border-border/30 group-hover:border-secondary/20 transition-colors">
                  <Bed className="h-5 w-5 mx-auto mb-2 text-secondary" />
                  <div className="text-base font-bold text-foreground">{hospital.beds}</div>
                  <div className="text-xs text-muted-foreground font-medium">{t('common.beds')}</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-muted/50 border border-border/30 group-hover:border-warning/20 transition-colors">
                  <Activity className="h-5 w-5 mx-auto mb-2 text-warning" />
                  <div className="text-base font-bold text-foreground">{hospital.icuBeds}</div>
                  <div className="text-xs text-muted-foreground font-medium">{t('common.icu')}</div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="default" className="flex-1 gap-2 group/btn" size="default">
                  <Navigation className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                  {t('common.getDirections')}
                </Button>
                <Button variant="outline" size="icon" className="glass hover:bg-card/90">
                  <Phone className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
