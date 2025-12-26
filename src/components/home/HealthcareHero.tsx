import { useTranslation } from "react-i18next";
import healthcareHero from "@/assets/healthcare-hero.jpg";

export function HealthcareHero() {
  const { i18n } = useTranslation();

  return (
    <section className="py-16 md:py-24 bg-background relative overflow-hidden">
      <div className="container">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl">
          <img 
            src={healthcareHero} 
            alt="Healthcare Professionals" 
            className="w-full h-64 md:h-96 object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />
          
          <div className="absolute inset-0 flex items-center">
            <div className="container">
              <div className="max-w-lg space-y-4">
                <h2 className="text-2xl md:text-4xl font-bold text-foreground">
                  {i18n.language === "hi" 
                    ? "विशेषज्ञ डॉक्टरों की टीम" 
                    : "Expert Medical Team"}
                </h2>
                <p className="text-muted-foreground">
                  {i18n.language === "hi" 
                    ? "भारत के सर्वश्रेष्ठ डॉक्टरों और स्वास्थ्य पेशेवरों से जुड़ें। 24/7 परामर्श उपलब्ध।"
                    : "Connect with India's best doctors and healthcare professionals. 24/7 consultations available."}
                </p>
                <div className="flex items-center gap-4 pt-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center text-xs font-bold text-primary">
                        Dr
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">500+</p>
                    <p className="text-xs text-muted-foreground">
                      {i18n.language === "hi" ? "सत्यापित डॉक्टर" : "Verified Doctors"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
