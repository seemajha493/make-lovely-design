import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SOSButton } from "@/components/SOSButton";
import { Phone, Siren, Flame, Shield, Baby, Heart, Car, Zap, Plus, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const emergencyContacts = [
  {
    icon: Siren,
    name: "National Emergency",
    number: "112",
    description: "Single emergency number for all services",
    color: "bg-destructive text-destructive-foreground",
    priority: true,
  },
  {
    icon: Plus,
    name: "Ambulance",
    number: "108",
    description: "Medical emergencies and ambulance services",
    color: "bg-destructive text-destructive-foreground",
    priority: true,
  },
  {
    icon: Shield,
    name: "Police",
    number: "100",
    description: "Crime, violence, and law enforcement",
    color: "bg-primary text-primary-foreground",
    priority: true,
  },
  {
    icon: Flame,
    name: "Fire Brigade",
    number: "101",
    description: "Fire emergencies and rescue operations",
    color: "bg-warning text-warning-foreground",
    priority: true,
  },
];

const additionalContacts = [
  {
    icon: Heart,
    name: "Women Helpline",
    number: "1091",
    description: "Women in distress or facing domestic violence",
    color: "bg-pink-500 text-white",
  },
  {
    icon: Baby,
    name: "Child Helpline",
    number: "1098",
    description: "Children in need of care and protection",
    color: "bg-teal text-teal-foreground",
  },
  {
    icon: Car,
    name: "Road Accident",
    number: "1073",
    description: "Road accident and highway emergencies",
    color: "bg-muted-foreground text-muted",
  },
  {
    icon: Zap,
    name: "Disaster Management",
    number: "1070",
    description: "Natural disasters and calamities",
    color: "bg-warning text-warning-foreground",
  },
  {
    icon: AlertTriangle,
    name: "Anti-Poison",
    number: "1066",
    description: "Poisoning emergencies and guidance",
    color: "bg-destructive/80 text-destructive-foreground",
  },
  {
    icon: Heart,
    name: "Senior Citizen",
    number: "14567",
    description: "Elderly citizens in need of assistance",
    color: "bg-primary/80 text-primary-foreground",
  },
];

const Contacts = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Emergency Contacts
            </h1>
            <p className="text-muted-foreground">
              Quick access to all emergency services - tap to call
            </p>
          </div>

          {/* Priority Contacts */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Primary Emergency Numbers
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {emergencyContacts.map((contact) => (
                <a
                  key={contact.number}
                  href={`tel:${contact.number}`}
                  className="group p-6 rounded-2xl bg-card border border-border shadow-card card-hover"
                >
                  <div className={`inline-flex p-4 rounded-2xl ${contact.color} mb-4 group-hover:scale-110 transition-transform`}>
                    <contact.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {contact.name}
                  </h3>
                  <p className="text-3xl font-bold text-primary mb-2">
                    {contact.number}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {contact.description}
                  </p>
                  <Button variant="default" className="w-full mt-4 gap-2">
                    <Phone className="h-4 w-4" />
                    Call Now
                  </Button>
                </a>
              ))}
            </div>
          </div>

          {/* Additional Contacts */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Additional Helplines
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {additionalContacts.map((contact) => (
                <a
                  key={contact.number}
                  href={`tel:${contact.number}`}
                  className="group flex items-center gap-4 p-4 rounded-xl bg-card border border-border shadow-card card-hover"
                >
                  <div className={`p-3 rounded-xl ${contact.color} group-hover:scale-110 transition-transform`}>
                    <contact.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">
                      {contact.name}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {contact.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold text-primary">
                      {contact.number}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-10 p-6 rounded-2xl bg-primary/5 border border-primary/20">
            <h3 className="font-semibold text-foreground mb-2">
              When to Call Emergency Services
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Life-threatening situations or serious injuries</li>
              <li>• Chest pain, difficulty breathing, or signs of stroke</li>
              <li>• Unconsciousness or unresponsiveness</li>
              <li>• Severe bleeding or burns</li>
              <li>• Suspected poisoning or overdose</li>
              <li>• Any situation where you feel in danger</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
      <SOSButton />
    </div>
  );
};

export default Contacts;
