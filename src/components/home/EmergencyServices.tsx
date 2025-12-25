import { Building2, Stethoscope, Phone, BookOpen, Droplets, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function EmergencyServices() {
  const { t } = useTranslation();

  const services = [
    {
      icon: Building2,
      titleKey: "emergencyServices.hospitalFinder",
      descriptionKey: "emergencyServices.hospitalFinderDesc",
      href: "/hospitals",
      color: "bg-primary/10 text-primary",
    },
    {
      icon: BookOpen,
      titleKey: "emergencyServices.firstAidGuide",
      descriptionKey: "emergencyServices.firstAidGuideDesc",
      href: "/first-aid",
      color: "bg-teal/10 text-teal",
    },
    {
      icon: Phone,
      titleKey: "emergencyServices.emergencyContacts",
      descriptionKey: "emergencyServices.emergencyContactsDesc",
      href: "/contacts",
      color: "bg-destructive/10 text-destructive",
    },
    {
      icon: Stethoscope,
      titleKey: "emergencyServices.symptomChecker",
      descriptionKey: "emergencyServices.symptomCheckerDesc",
      href: "/symptoms",
      color: "bg-warning/10 text-warning",
    },
    {
      icon: Droplets,
      titleKey: "emergencyServices.bloodBankFinder",
      descriptionKey: "emergencyServices.bloodBankFinderDesc",
      href: "/blood-banks",
      color: "bg-destructive/10 text-destructive",
    },
    {
      icon: Users,
      titleKey: "emergencyServices.doctorConnect",
      descriptionKey: "emergencyServices.doctorConnectDesc",
      href: "/doctors",
      color: "bg-success/10 text-success",
    },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('emergencyServices.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('emergencyServices.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Link
              key={service.titleKey}
              to={service.href}
              className={`group p-6 rounded-2xl bg-card border border-border shadow-card card-hover animate-fade-in-delay-${Math.min(index + 1, 3)}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`inline-flex p-3 rounded-xl ${service.color} mb-4`}>
                <service.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                {t(service.titleKey)}
              </h3>
              <p className="text-muted-foreground">
                {t(service.descriptionKey)}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
