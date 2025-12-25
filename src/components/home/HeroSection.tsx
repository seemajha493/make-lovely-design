import { Search, MapPin, Clock, Heart, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden py-20 md:py-32" style={{ background: "var(--gradient-hero)" }}>
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-40 -left-40 w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-40 left-1/2 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Mesh Gradient Overlay */}
      <div className="absolute inset-0 gradient-mesh opacity-60" />

      {/* Glow Effect */}
      <div className="absolute inset-0 gradient-glow" />

      {/* Subtle Pattern */}
      <div className="absolute inset-0 opacity-[0.015]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
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
