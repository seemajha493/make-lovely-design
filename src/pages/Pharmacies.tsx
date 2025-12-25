import { useState } from "react";
import { Search, MapPin, Phone, Clock, Navigation, Pill, ExternalLink } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Sample pharmacy data - in production this would come from an API
const samplePharmacies = [
  {
    id: 1,
    name: "Apollo Pharmacy",
    address: "123 Main Road, Sector 15, Gurgaon",
    phone: "+91 9876543210",
    distance: "0.5 km",
    hours: "24 Hours",
    isOpen: true,
    rating: 4.5,
    services: ["Prescription", "OTC", "Home Delivery"],
  },
  {
    id: 2,
    name: "MedPlus Pharmacy",
    address: "45 Park Street, DLF Phase 2, Gurgaon",
    phone: "+91 9876543211",
    distance: "1.2 km",
    hours: "8:00 AM - 10:00 PM",
    isOpen: true,
    rating: 4.3,
    services: ["Prescription", "OTC", "Health Products"],
  },
  {
    id: 3,
    name: "Netmeds Store",
    address: "78 Market Complex, Sector 14, Gurgaon",
    phone: "+91 9876543212",
    distance: "1.8 km",
    hours: "9:00 AM - 9:00 PM",
    isOpen: true,
    rating: 4.2,
    services: ["Prescription", "OTC", "Lab Tests"],
  },
  {
    id: 4,
    name: "Wellness Forever",
    address: "Block C, Shopping Mall, MG Road, Gurgaon",
    phone: "+91 9876543213",
    distance: "2.3 km",
    hours: "10:00 AM - 8:00 PM",
    isOpen: false,
    rating: 4.4,
    services: ["Prescription", "OTC", "Cosmetics"],
  },
  {
    id: 5,
    name: "Frank Ross Pharmacy",
    address: "Near City Hospital, Sector 22, Gurgaon",
    phone: "+91 9876543214",
    distance: "3.1 km",
    hours: "24 Hours",
    isOpen: true,
    rating: 4.6,
    services: ["Prescription", "OTC", "Emergency"],
  },
];

const Pharmacies = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLocating, setIsLocating] = useState(false);

  const filteredPharmacies = samplePharmacies.filter(
    (pharmacy) =>
      pharmacy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pharmacy.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGetLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Location:", position.coords.latitude, position.coords.longitude);
          setIsLocating(false);
          // In production, this would fetch nearby pharmacies based on location
        },
        (error) => {
          console.error("Location error:", error);
          setIsLocating(false);
        }
      );
    } else {
      setIsLocating(false);
    }
  };

  const openDirections = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Pill className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Nearby Pharmacies
              </h1>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find pharmacies near you for medicines, prescriptions, and health products.
              Get directions and contact information instantly.
            </p>
          </div>

          {/* Search Section */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by pharmacy name or area..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button onClick={handleGetLocation} disabled={isLocating} className="gap-2">
                  <Navigation className="h-4 w-4" />
                  {isLocating ? "Locating..." : "Use My Location"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results Count */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-muted-foreground">
              Found {filteredPharmacies.length} pharmacies near you
            </p>
            <Badge variant="secondary" className="gap-1">
              <MapPin className="h-3 w-3" />
              Gurgaon, Haryana
            </Badge>
          </div>

          {/* Pharmacy List */}
          <div className="space-y-4">
            {filteredPharmacies.map((pharmacy) => (
              <Card key={pharmacy.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-full flex-shrink-0">
                        <Pill className="w-6 h-6 text-primary" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-lg text-foreground">{pharmacy.name}</h3>
                          {pharmacy.isOpen ? (
                            <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">
                              Open Now
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Closed</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{pharmacy.address}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            {pharmacy.phone}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {pharmacy.hours}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {pharmacy.services.map((service) => (
                            <Badge key={service} variant="outline" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant="secondary" className="text-primary font-medium">
                        {pharmacy.distance}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-amber-500">
                        {"★".repeat(Math.floor(pharmacy.rating))}
                        <span className="text-muted-foreground ml-1">{pharmacy.rating}</span>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="outline" asChild>
                          <a href={`tel:${pharmacy.phone}`}>
                            <Phone className="h-4 w-4 mr-1" />
                            Call
                          </a>
                        </Button>
                        <Button size="sm" onClick={() => openDirections(pharmacy.address)}>
                          <Navigation className="h-4 w-4 mr-1" />
                          Directions
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPharmacies.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <Pill className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No pharmacies found matching your search</p>
              </CardContent>
            </Card>
          )}

          {/* Info Card */}
          <Card className="mt-6 bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Pill className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Need Medicine Urgently?</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Look for 24-hour pharmacies marked above. You can also upload your prescription 
                    in the Prescription Reader to get medicine details before visiting.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Pharmacies;
