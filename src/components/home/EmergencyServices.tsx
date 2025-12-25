import { Building2, Stethoscope, Phone, BookOpen, Droplets, Users, ArrowRight } from "lucide-react";
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
      gradient: "from-primary/20 to-primary/5",
      iconBg: "bg-primary/15",
      iconColor: "text-primary",
      hoverBorder: "hover:border-primary/30",
    },
    {
      icon: BookOpen,
      titleKey: "emergencyServices.firstAidGuide",
      descriptionKey: "emergencyServices.firstAidGuideDesc",
      href: "/first-aid",
      gradient: "from-secondary/20 to-secondary/5",
      iconBg: "bg-secondary/15",
      iconColor: "text-secondary",
      hoverBorder: "hover:border-secondary/30",
    },
    {
      icon: Phone,
      titleKey: "emergencyServices.emergencyContacts",
      descriptionKey: "emergencyServices.emergencyContactsDesc",
      href: "/contacts",
      gradient: "from-destructive/20 to-destructive/5",
      iconBg: "bg-destructive/15",
      iconColor: "text-destructive",
      hoverBorder: "hover:border-destructive/30",
    },
    {
      icon: Stethoscope,
      titleKey: "emergencyServices.symptomChecker",
      descriptionKey: "emergencyServices.symptomCheckerDesc",
      href: "/symptoms",
      gradient: "from-warning/20 to-warning/5",
      iconBg: "bg-warning/15",
      iconColor: "text-warning",
      hoverBorder: "hover:border-warning/30",
    },
    {
      icon: Droplets,
      titleKey: "emergencyServices.bloodBankFinder",
      descriptionKey: "emergencyServices.bloodBankFinderDesc",
      href: "/blood-banks",
      gradient: "from-destructive/20 to-destructive/5",
      iconBg: "bg-destructive/15",
      iconColor: "text-destructive",
      hoverBorder: "hover:border-destructive/30",
    },
    {
      icon: Users,
      titleKey: "emergencyServices.doctorConnect",
      descriptionKey: "emergencyServices.doctorConnectDesc",
      href: "/doctors",
      gradient: "from-success/20 to-success/5",
      iconBg: "bg-success/15",
      iconColor: "text-success",
      hoverBorder: "hover:border-success/30",
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="container">
        <div className="text-center mb-16">
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
            {t('common.quickAccess')}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-5 tracking-tight">
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
              className={`group relative p-7 rounded-2xl bg-gradient-to-br ${service.gradient} border border-border/50 ${service.hoverBorder} shadow-card card-hover overflow-hidden`}
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              {/* Shimmer effect on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 animate-shimmer transition-opacity duration-500" />
              
              <div className="relative">
                <div className={`inline-flex p-4 rounded-2xl ${service.iconBg} mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className={`h-7 w-7 ${service.iconColor}`} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {t(service.titleKey)}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {t(service.descriptionKey)}
                </p>
                <div className="flex items-center text-primary font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {t('common.learnMore')}
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
