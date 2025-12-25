import { Building2, Stethoscope, Phone, BookOpen, Droplets, Users } from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    icon: Building2,
    title: "Hospital Finder",
    description: "Find nearby hospitals with real-time bed availability and wait times",
    href: "/hospitals",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: BookOpen,
    title: "First Aid Guide",
    description: "Step-by-step emergency first aid instructions for common situations",
    href: "/first-aid",
    color: "bg-teal/10 text-teal",
  },
  {
    icon: Phone,
    title: "Emergency Contacts",
    description: "Quick access to ambulance, police, fire, and other emergency numbers",
    href: "/contacts",
    color: "bg-destructive/10 text-destructive",
  },
  {
    icon: Stethoscope,
    title: "AI Symptom Checker",
    description: "AI-powered symptom analysis with risk assessment and recommended actions",
    href: "/symptoms",
    color: "bg-warning/10 text-warning",
  },
  {
    icon: Droplets,
    title: "Blood Bank Finder",
    description: "Locate nearby blood banks with real-time blood group availability",
    href: "/blood-banks",
    color: "bg-destructive/10 text-destructive",
  },
  {
    icon: Users,
    title: "Doctor Video Connect",
    description: "24/7 video consultations with verified medical professionals",
    href: "/doctors",
    color: "bg-success/10 text-success",
  },
];

export function EmergencyServices() {
  return (
    <section className="py-16 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Emergency Services
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Quick access to all the help you need during medical emergencies
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Link
              key={service.title}
              to={service.href}
              className={`group p-6 rounded-2xl bg-card border border-border shadow-card card-hover animate-fade-in-delay-${Math.min(index + 1, 3)}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`inline-flex p-3 rounded-xl ${service.color} mb-4`}>
                <service.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                {service.title}
              </h3>
              <p className="text-muted-foreground">
                {service.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
