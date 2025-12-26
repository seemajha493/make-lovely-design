import { Phone, Siren, Flame, Shield, Baby, Heart, AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { EmergencyAIAssistant } from "./EmergencyAIAssistant";

export function EmergencyContacts() {
  const { t } = useTranslation();

  const contacts = [
    { icon: Siren, nameKey: "contacts.ambulance", number: "108", gradient: "from-destructive to-destructive/80", ringColor: "ring-destructive/30" },
    { icon: Shield, nameKey: "contacts.police", number: "100", gradient: "from-primary to-primary/80", ringColor: "ring-primary/30" },
    { icon: Flame, nameKey: "contacts.fire", number: "101", gradient: "from-warning to-warning/80", ringColor: "ring-warning/30" },
    { icon: Baby, nameKey: "contacts.childHelpline", number: "1098", gradient: "from-secondary to-secondary/80", ringColor: "ring-secondary/30" },
    { icon: Heart, nameKey: "contacts.womenHelpline", number: "1091", gradient: "from-pink-500 to-pink-400", ringColor: "ring-pink-500/30" },
    { icon: Phone, nameKey: "contacts.disaster", number: "1070", gradient: "from-muted-foreground to-muted-foreground/80", ringColor: "ring-muted-foreground/30" },
  ];

  return (
    <section className="py-20 md:py-28 bg-muted/30 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-destructive/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container relative">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 text-destructive text-sm font-semibold mb-4">
            <AlertTriangle className="h-4 w-4" />
            {t('common.critical')}
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            {t('contacts.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            {t('contacts.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 mb-12">
          {contacts.map((contact, index) => (
            <a
              key={contact.number}
              href={`tel:${contact.number}`}
              className="group flex flex-col items-center p-6 rounded-2xl bg-card border border-border/50 shadow-card card-hover"
              style={{ animationDelay: `${index * 0.06}s` }}
            >
              <div className={`p-4 rounded-2xl bg-gradient-to-br ${contact.gradient} mb-4 group-hover:scale-110 group-hover:ring-4 ${contact.ringColor} transition-all duration-300 shadow-lg`}>
                <contact.icon className="h-7 w-7 text-white" />
              </div>
              <span className="text-sm font-semibold text-muted-foreground mb-2">
                {t(contact.nameKey)}
              </span>
              <span className="text-3xl font-bold text-foreground tracking-tight">
                {contact.number}
              </span>
            </a>
          ))}
        </div>

        {/* AI Emergency Assistant */}
        <div className="max-w-2xl mx-auto">
          <EmergencyAIAssistant />
        </div>
      </div>
    </section>
  );
}