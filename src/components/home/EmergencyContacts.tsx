import { Phone, Siren, Flame, Shield, Baby, Heart } from "lucide-react";
import { useTranslation } from "react-i18next";

export function EmergencyContacts() {
  const { t } = useTranslation();

  const contacts = [
    { icon: Siren, nameKey: "contacts.ambulance", number: "108", color: "bg-destructive text-destructive-foreground" },
    { icon: Shield, nameKey: "contacts.police", number: "100", color: "bg-primary text-primary-foreground" },
    { icon: Flame, nameKey: "contacts.fire", number: "101", color: "bg-warning text-warning-foreground" },
    { icon: Baby, nameKey: "contacts.childHelpline", number: "1098", color: "bg-teal text-teal-foreground" },
    { icon: Heart, nameKey: "contacts.womenHelpline", number: "1091", color: "bg-pink-500 text-white" },
    { icon: Phone, nameKey: "contacts.disaster", number: "1070", color: "bg-muted-foreground text-background" },
  ];

  return (
    <section className="py-16 bg-muted/50">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('contacts.title')}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t('contacts.subtitle')}
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
                {t(contact.nameKey)}
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
