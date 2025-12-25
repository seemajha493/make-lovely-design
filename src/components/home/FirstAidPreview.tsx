import { Heart, Flame, Wind, Bone, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function FirstAidPreview() {
  const { t } = useTranslation();

  const firstAidTopics = [
    {
      icon: Heart,
      titleKey: "firstAid.cpr",
      descriptionKey: "firstAid.cprDesc",
      gradient: "from-destructive/20 to-destructive/5",
      iconBg: "bg-destructive/15",
      iconColor: "text-destructive",
    },
    {
      icon: Flame,
      titleKey: "firstAid.burns",
      descriptionKey: "firstAid.burnsDesc",
      gradient: "from-warning/20 to-warning/5",
      iconBg: "bg-warning/15",
      iconColor: "text-warning",
    },
    {
      icon: Wind,
      titleKey: "firstAid.choking",
      descriptionKey: "firstAid.chokingDesc",
      gradient: "from-primary/20 to-primary/5",
      iconBg: "bg-primary/15",
      iconColor: "text-primary",
    },
    {
      icon: Bone,
      titleKey: "firstAid.fractures",
      descriptionKey: "firstAid.fracturesDesc",
      gradient: "from-secondary/20 to-secondary/5",
      iconBg: "bg-secondary/15",
      iconColor: "text-secondary",
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 text-destructive text-sm font-semibold mb-4">
              <Sparkles className="h-4 w-4" />
              {t('common.important')}
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-3 tracking-tight">
              {t('firstAid.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-md">
              {t('firstAid.subtitle')}
            </p>
          </div>
          <Button variant="outline" size="lg" className="glass hover:bg-card/90 group" asChild>
            <Link to="/first-aid" className="gap-2">
              {t('firstAid.viewAllGuides')} 
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {firstAidTopics.map((topic, index) => (
            <Link
              key={topic.titleKey}
              to="/first-aid"
              className={`group relative p-6 rounded-2xl bg-gradient-to-br ${topic.gradient} border border-border/50 shadow-card card-hover text-center overflow-hidden`}
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 animate-shimmer transition-opacity duration-500" />
              
              <div className="relative">
                <div className={`inline-flex p-5 rounded-2xl ${topic.iconBg} mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <topic.icon className={`h-8 w-8 ${topic.iconColor}`} />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {t(topic.titleKey)}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(topic.descriptionKey)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
