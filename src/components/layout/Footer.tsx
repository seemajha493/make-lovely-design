import { Heart, Phone, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();

  const quickLinks = [
    { nameKey: "common.hospitals", path: "/hospitals" },
    { nameKey: "common.firstAid", path: "/first-aid" },
    { nameKey: "contacts.title", path: "/contacts" },
    { nameKey: "common.about", path: "/about" },
  ];

  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
                <Heart className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">
                Medi<span className="text-primary">Bridge</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              {t('footer.description')}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2">
              {quickLinks.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {t(item.nameKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">{t('footer.emergencyNumbers')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-destructive" />
                {t('contacts.ambulance')}: 108
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                {t('contacts.police')}: 100
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-warning" />
                {t('contacts.fire')}: 101
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">{t('footer.contactUs')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                support@medibridge.com
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {t('footer.available247')}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 MediBridge. {t('footer.allRightsReserved')}
          </p>
          <p className="text-sm text-muted-foreground">
            {t('footer.madeWith')} <Heart className="inline h-4 w-4 text-destructive" /> {t('footer.forSavingLives')}
          </p>
        </div>
      </div>
    </footer>
  );
}
