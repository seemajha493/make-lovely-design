import { Search, MapPin, Clock, Heart, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

export function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/50 to-background/80 dark:from-background/70 dark:via-background/60 dark:to-background/85" />
      </div>

      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
      </div>

      <div className="container relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass text-sm font-semibold mb-8 animate-fade-in shadow-lg">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-success/20">
              <Sparkles className="h-3.5 w-3.5 text-success" />
            </div>
            <span className="text-foreground">{t('common.available247')}</span>
          </div>
          
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-foreground mb-6 leading-[1.1] tracking-tight animate-fade-in-delay-1">
            {t('hero.title')}
            <span className="block text-gradient mt-2">{t('hero.titleHighlight')}</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-delay-2">
            {t('hero.subtitle')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in-delay-3">
            <Button variant="hero" size="xl" className="gap-3 shadow-xl hover:shadow-2xl transition-all duration-300 group" asChild>
              <Link to="/hospitals">
                <MapPin className="h-5 w-5 group-hover:scale-110 transition-transform" />
                {t('hero.findHospitals')}
              </Link>
            </Button>
            <Button variant="outline" size="xl" className="gap-3 glass hover:bg-card/90 transition-all duration-300 group" asChild>
              <Link to="/symptoms">
                <Search className="h-5 w-5 group-hover:scale-110 transition-transform" />
                {t('hero.searchSymptoms')}
              </Link>
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto animate-fade-in-delay-4">
            <div className="glass rounded-2xl p-6 card-hover">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mx-auto mb-3">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">500+</div>
              <div className="text-sm text-muted-foreground font-medium">{t('hero.statHospitals')}</div>
            </div>
            <div className="glass rounded-2xl p-6 card-hover">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-secondary/10 mx-auto mb-3">
                <Clock className="h-6 w-6 text-secondary" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">24/7</div>
              <div className="text-sm text-muted-foreground font-medium">{t('hero.statAvailable')}</div>
            </div>
            <div className="glass rounded-2xl p-6 card-hover">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-success/10 mx-auto mb-3">
                <Shield className="h-6 w-6 text-success" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">10k+</div>
              <div className="text-sm text-muted-foreground font-medium">{t('hero.statLivesHelped')}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
