import { Building2, Stethoscope, Phone, BookOpen, Droplets, Users, ArrowRight, Siren, Flame, Shield, Baby, Heart, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function EmergencyHub() {
  const { t } = useTranslation();

  const services = [
    {
      icon: Building2,
      titleKey: "emergencyServices.hospitalFinder",
      href: "/hospitals",
      iconBg: "bg-primary/15",
      iconColor: "text-primary",
    },
    {
      icon: BookOpen,
      titleKey: "emergencyServices.firstAidGuide",
      href: "/first-aid",
      iconBg: "bg-secondary/15",
      iconColor: "text-secondary",
    },
    {
      icon: Stethoscope,
      titleKey: "emergencyServices.symptomChecker",
      href: "/symptoms",
      iconBg: "bg-warning/15",
      iconColor: "text-warning",
    },
    {
      icon: Droplets,
      titleKey: "emergencyServices.bloodBankFinder",
      href: "/blood-banks",
      iconBg: "bg-destructive/15",
      iconColor: "text-destructive",
    },
    {
      icon: Users,
      titleKey: "emergencyServices.doctorConnect",
      href: "/doctors",
      iconBg: "bg-success/15",
      iconColor: "text-success",
    },
    {
      icon: Phone,
      titleKey: "emergencyServices.emergencyContacts",
      href: "/contacts",
      iconBg: "bg-destructive/15",
      iconColor: "text-destructive",
    },
  ];

  const contacts = [
    { icon: Siren, nameKey: "contacts.ambulance", number: "108", gradient: "from-destructive to-destructive/80" },
    { icon: Shield, nameKey: "contacts.police", number: "100", gradient: "from-primary to-primary/80" },
    { icon: Flame, nameKey: "contacts.fire", number: "101", gradient: "from-warning to-warning/80" },
    { icon: Baby, nameKey: "contacts.childHelpline", number: "1098", gradient: "from-secondary to-secondary/80" },
    { icon: Heart, nameKey: "contacts.womenHelpline", number: "1091", gradient: "from-pink-500 to-pink-400" },
  ];

  return (
    <section className="py-16 md:py-20 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="container">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-2">
            {t('common.quickAccess')}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3 tracking-tight">
            {t('emergencyServices.title')}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t('emergencyServices.subtitle')}
          </p>
        </div>

        {/* Services Grid - Compact */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          {services.map((service) => (
            <Link
              key={service.titleKey}
              to={service.href}
              className="group flex flex-col items-center p-5 rounded-xl bg-card border border-border/50 hover:border-primary/30 shadow-card card-hover text-center"
            >
              <div className={`p-3 rounded-xl ${service.iconBg} mb-3 group-hover:scale-110 transition-transform duration-300`}>
                <service.icon className={`h-6 w-6 ${service.iconColor}`} />
              </div>
              <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">
                {t(service.titleKey)}
              </h3>
            </Link>
          ))}
        </div>

        {/* Emergency Contacts - Compact Row */}
        <div className="bg-muted/50 rounded-2xl p-6 border border-border/50">
          <div className="flex items-center justify-center gap-2 mb-5">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <span className="text-sm font-semibold text-destructive uppercase tracking-wider">
              {t('contacts.title')}
            </span>
          </div>
          
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {contacts.map((contact) => (
              <a
                key={contact.number}
                href={`tel:${contact.number}`}
                className="group flex flex-col items-center p-3 rounded-xl bg-card border border-border/50 hover:shadow-lg transition-all duration-300"
              >
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${contact.gradient} mb-2 group-hover:scale-110 transition-transform duration-300`}>
                  <contact.icon className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs text-muted-foreground mb-1">{t(contact.nameKey)}</span>
                <span className="text-lg font-bold text-foreground">{contact.number}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
