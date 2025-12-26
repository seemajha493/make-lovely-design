import { useTranslation } from "react-i18next";
import healthcareHero from "@/assets/healthcare-hero.jpg";

export function HealthcareHero() {
  const { i18n } = useTranslation();

  return (
    <section className="py-10 md:py-14 bg-background">
      <div className="container">
        <div className="relative rounded-2xl overflow-hidden shadow-lg">
          <img 
            src={healthcareHero} 
            alt="Healthcare Professionals" 
            className="w-full h-48 md:h-64 object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/60 to-transparent" />
          
          <div className="absolute inset-0 flex items-center px-6 md:px-10">
            <div className="max-w-md space-y-2">
              <h2 className="text-xl md:text-2xl font-bold text-foreground">
                {i18n.language === "hi" ? "विशेषज्ञ डॉक्टरों की टीम" : "Expert Medical Team"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {i18n.language === "hi" 
                  ? "भारत के सर्वश्रेष्ठ डॉक्टरों से 24/7 परामर्श।"
                  : "Connect with India's best doctors. 24/7 consultations."}
              </p>
              <div className="flex items-center gap-3 pt-1">
                <div className="flex -space-x-1.5">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-7 h-7 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center text-[10px] font-bold text-primary">
                      Dr
                    </div>
                  ))}
                </div>
                <span className="text-sm font-semibold text-foreground">
                  500+ {i18n.language === "hi" ? "डॉक्टर" : "Doctors"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
