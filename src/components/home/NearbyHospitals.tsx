import { MapPin, Clock, Bed, Activity, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

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
  available: "bg-success/10 text-success border-success/20",
  limited: "bg-warning/10 text-warning border-warning/20",
  full: "bg-destructive/10 text-destructive border-destructive/20",
};

export function NearbyHospitals() {
  return (
    <section className="py-16 bg-muted/50">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Nearby Hospitals
            </h2>
            <p className="text-muted-foreground">
              Real-time availability of hospitals near you
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/hospitals" className="gap-2">
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {hospitals.map((hospital) => (
            <div
              key={hospital.id}
              className="p-6 rounded-2xl bg-card border border-border shadow-card card-hover"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {hospital.name}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {hospital.distance}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[hospital.status as keyof typeof statusColors]}`}>
                  {hospital.status === "available" ? "Available" : hospital.status === "limited" ? "Limited" : "Full"}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 rounded-xl bg-muted/50">
                  <Clock className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                  <div className="text-sm font-semibold text-foreground">{hospital.waitTime}</div>
                  <div className="text-xs text-muted-foreground">Wait Time</div>
                </div>
                <div className="text-center p-3 rounded-xl bg-muted/50">
                  <Bed className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                  <div className="text-sm font-semibold text-foreground">{hospital.beds}</div>
                  <div className="text-xs text-muted-foreground">Beds</div>
                </div>
                <div className="text-center p-3 rounded-xl bg-muted/50">
                  <Activity className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                  <div className="text-sm font-semibold text-foreground">{hospital.icuBeds}</div>
                  <div className="text-xs text-muted-foreground">ICU</div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="default" className="flex-1" size="sm">
                  Get Directions
                </Button>
                <Button variant="outline" size="sm">
                  Call
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
