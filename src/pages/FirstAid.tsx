import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SOSButton } from "@/components/SOSButton";
import { Heart, Flame, Wind, Bone, Droplet, AlertTriangle, ChevronRight, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const FirstAid = () => {
  const [expandedGuide, setExpandedGuide] = useState<string | null>("cpr");
  const { t } = useTranslation();

  const firstAidGuides = [
    {
      id: "cpr",
      icon: Heart,
      titleKey: "firstAidPage.cprTitle",
      color: "bg-destructive/10 text-destructive",
      urgencyKey: "common.critical",
      stepsKey: "firstAidPage.cprSteps",
    },
    {
      id: "burns",
      icon: Flame,
      titleKey: "firstAidPage.burnsTitle",
      color: "bg-warning/10 text-warning",
      urgencyKey: "common.important",
      stepsKey: "firstAidPage.burnsSteps",
    },
    {
      id: "choking",
      icon: Wind,
      titleKey: "firstAidPage.chokingTitle",
      color: "bg-primary/10 text-primary",
      urgencyKey: "common.critical",
      stepsKey: "firstAidPage.chokingSteps",
    },
    {
      id: "fractures",
      icon: Bone,
      titleKey: "firstAidPage.fracturesTitle",
      color: "bg-teal/10 text-teal",
      urgencyKey: "common.important",
      stepsKey: "firstAidPage.fracturesSteps",
    },
    {
      id: "bleeding",
      icon: Droplet,
      titleKey: "firstAidPage.bleedingTitle",
      color: "bg-destructive/10 text-destructive",
      urgencyKey: "common.critical",
      stepsKey: "firstAidPage.bleedingSteps",
    },
    {
      id: "shock",
      icon: AlertTriangle,
      titleKey: "firstAidPage.shockTitle",
      color: "bg-warning/10 text-warning",
      urgencyKey: "common.critical",
      stepsKey: "firstAidPage.shockSteps",
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
              {t('firstAidPage.title')}
            </h1>
            <p className="text-muted-foreground">
              {t('firstAidPage.subtitle')}
            </p>
          </div>

          {/* Warning Banner */}
          <div className="mb-8 p-4 rounded-xl bg-warning/10 border border-warning/20 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground">{t('firstAidPage.importantNotice')}</p>
              <p className="text-sm text-muted-foreground">
                {t('firstAidPage.warningText')}
              </p>
            </div>
          </div>

          {/* Guides List */}
          <div className="space-y-4">
            {firstAidGuides.map((guide) => {
              const steps = t(guide.stepsKey, { returnObjects: true }) as string[];
              const urgency = t(guide.urgencyKey);
              const isCritical = guide.urgencyKey === 'common.critical';

              return (
                <div
                  key={guide.id}
                  className="rounded-2xl bg-card border border-border shadow-card overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedGuide(expandedGuide === guide.id ? null : guide.id)}
                    className="w-full p-6 flex items-center gap-4 text-left hover:bg-accent/50 transition-colors"
                  >
                    <div className={`p-3 rounded-xl ${guide.color}`}>
                      <guide.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground">
                        {t(guide.titleKey)}
                      </h3>
                      <span className={`text-sm ${isCritical ? 'text-destructive' : 'text-warning'}`}>
                        {urgency}
                      </span>
                    </div>
                    {expandedGuide === guide.id ? (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>

                  {expandedGuide === guide.id && (
                    <div className="px-6 pb-6 border-t border-border">
                      <ol className="mt-4 space-y-3">
                        {Array.isArray(steps) && steps.map((step, index) => (
                          <li key={index} className="flex gap-4">
                            <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                              {index + 1}
                            </span>
                            <p className="text-muted-foreground pt-0.5">{step}</p>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
      <SOSButton />
    </div>
  );
};

export default FirstAid;
