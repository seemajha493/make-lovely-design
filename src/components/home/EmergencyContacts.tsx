import { Phone, Siren, Flame, Shield, Baby, Heart } from "lucide-react";

const contacts = [
  { icon: Siren, name: "Ambulance", number: "108", color: "bg-destructive text-destructive-foreground" },
  { icon: Shield, name: "Police", number: "100", color: "bg-primary text-primary-foreground" },
  { icon: Flame, name: "Fire", number: "101", color: "bg-warning text-warning-foreground" },
  { icon: Baby, name: "Child Helpline", number: "1098", color: "bg-teal text-teal-foreground" },
  { icon: Heart, name: "Women Helpline", number: "1091", color: "bg-pink-500 text-white" },
  { icon: Phone, name: "Disaster", number: "1070", color: "bg-muted-foreground text-background" },
];

export function EmergencyContacts() {
  return (
    <section className="py-16 bg-muted/50">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Emergency Contacts
          </h2>
          <p className="text-lg text-muted-foreground">
            One tap to call emergency services
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {contacts.map((contact) => (
            <a
              key={contact.number}
              href={`tel:${contact.number}`}
              className="group flex flex-col items-center p-6 rounded-2xl bg-card border border-border shadow-card card-hover"
            >
              <div className={`p-4 rounded-2xl ${contact.color} mb-3 group-hover:scale-110 transition-transform`}>
                <contact.icon className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium text-muted-foreground mb-1">
                {contact.name}
              </span>
              <span className="text-2xl font-bold text-foreground">
                {contact.number}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
