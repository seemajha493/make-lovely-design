import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SOSButton } from "@/components/SOSButton";
import { Phone, Siren, Flame, Shield, Baby, Heart, Car, Zap, Plus, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const Contacts = () => {
  const { t } = useTranslation();

  const emergencyContacts = [
    {
      icon: Siren,
      nameKey: "contactsPage.nationalEmergency",
      number: "112",
      descriptionKey: "contactsPage.nationalEmergencyDesc",
      color: "bg-destructive text-destructive-foreground",
      priority: true,
    },
    {
      icon: Plus,
      nameKey: "contacts.ambulance",
      number: "108",
      descriptionKey: "contactsPage.ambulanceDesc",
      color: "bg-destructive text-destructive-foreground",
      priority: true,
    },
    {
      icon: Shield,
      nameKey: "contacts.police",
      number: "100",
      descriptionKey: "contactsPage.policeDesc",
      color: "bg-primary text-primary-foreground",
      priority: true,
    },
    {
      icon: Flame,
      nameKey: "contactsPage.fireBrigade",
      number: "101",
      descriptionKey: "contactsPage.fireBrigadeDesc",
      color: "bg-warning text-warning-foreground",
      priority: true,
    },
  ];

  const additionalContacts = [
    {
      icon: Heart,
      nameKey: "contacts.womenHelpline",
      number: "1091",
      descriptionKey: "contactsPage.womenHelplineDesc",
      color: "bg-pink-500 text-white",
    },
    {
      icon: Baby,
      nameKey: "contacts.childHelpline",
      number: "1098",
      descriptionKey: "contactsPage.childHelplineDesc",
      color: "bg-teal text-teal-foreground",
    },
    {
      icon: Car,
      nameKey: "contactsPage.roadAccident",
      number: "1073",
      descriptionKey: "contactsPage.roadAccidentDesc",
      color: "bg-muted-foreground text-muted",
    },
    {
      icon: Zap,
      nameKey: "contactsPage.disasterManagement",
      number: "1070",
      descriptionKey: "contactsPage.disasterManagementDesc",
      color: "bg-warning text-warning-foreground",
    },
    {
      icon: AlertTriangle,
      nameKey: "contactsPage.antiPoison",
      number: "1066",
      descriptionKey: "contactsPage.antiPoisonDesc",
      color: "bg-destructive/80 text-destructive-foreground",
    },
    {
      icon: Heart,
      nameKey: "contactsPage.seniorCitizen",
      number: "14567",
      descriptionKey: "contactsPage.seniorCitizenDesc",
      color: "bg-primary/80 text-primary-foreground",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {t('contactsPage.title')}
            </h1>
            <p className="text-muted-foreground">
              {t('contactsPage.subtitle')}
            </p>
          </div>

          {/* Priority Contacts */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              {t('contactsPage.primaryEmergency')}
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
                    {t(contact.nameKey)}
                  </h3>
                  <p className="text-3xl font-bold text-primary mb-2">
                    {contact.number}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t(contact.descriptionKey)}
                  </p>
                  <Button variant="default" className="w-full mt-4 gap-2">
                    <Phone className="h-4 w-4" />
                    {t('common.callNow')}
                  </Button>
                </a>
              ))}
            </div>
          </div>

          {/* Additional Contacts */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              {t('contactsPage.additionalHelplines')}
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
                      {t(contact.nameKey)}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {t(contact.descriptionKey)}
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
              {t('contactsPage.whenToCall')}
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• {t('contactsPage.lifeThreatening')}</li>
              <li>• {t('contactsPage.chestPain')}</li>
              <li>• {t('contactsPage.unconscious')}</li>
              <li>• {t('contactsPage.severeBleedingBurns')}</li>
              <li>• {t('contactsPage.poisoning')}</li>
              <li>• {t('contactsPage.feelInDanger')}</li>
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
