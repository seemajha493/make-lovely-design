import { FileImage, Sparkles, ArrowRight, CheckCircle, Brain, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import prescriptionAi from "@/assets/prescription-ai.jpg";

export function PrescriptionPreview() {
  const { i18n } = useTranslation();

  const features = [
    {
      icon: Brain,
      title: i18n.language === "hi" ? "AI विश्लेषण" : "AI Analysis",
      desc: i18n.language === "hi" ? "उन्नत AI तकनीक" : "Advanced AI technology",
    },
    {
      icon: Zap,
      title: i18n.language === "hi" ? "तुरंत परिणाम" : "Instant Results",
      desc: i18n.language === "hi" ? "सेकंडों में विश्लेषण" : "Analysis in seconds",
    },
    {
      icon: CheckCircle,
      title: i18n.language === "hi" ? "सटीक जानकारी" : "Accurate Info",
      desc: i18n.language === "hi" ? "विस्तृत दवा विवरण" : "Detailed medicine details",
    },
  ];

  const capabilities = [
    i18n.language === "hi" ? "दवा का नाम और खुराक" : "Medicine name & dosage",
    i18n.language === "hi" ? "सेवन निर्देश" : "Usage instructions",
    i18n.language === "hi" ? "दुष्प्रभाव और सावधानियां" : "Side effects & precautions",
    i18n.language === "hi" ? "जेनेरिक विकल्प" : "Generic alternatives",
  ];

  return (
    <section className="py-20 md:py-28 bg-muted/30 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Image */}
          <div className="relative order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border/50">
              <img 
                src={prescriptionAi} 
                alt="AI Prescription Reader" 
                className="w-full h-auto object-cover"
              />
              
              {/* Floating Animation Badge */}
              <div className="absolute top-6 right-6">
                <div className="glass rounded-full p-3 animate-pulse">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-secondary/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />
          </div>

          {/* Right - Content */}
          <div className="space-y-8 order-1 lg:order-2">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-semibold mb-4">
                <Sparkles className="h-4 w-4" />
                {i18n.language === "hi" ? "AI संचालित" : "AI Powered"}
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
                {i18n.language === "hi" ? "प्रिस्क्रिप्शन रीडर" : "Prescription Reader"}
                <span className="block text-gradient">
                  {i18n.language === "hi" ? "AI द्वारा संचालित" : "Powered by AI"}
                </span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-lg">
                {i18n.language === "hi" 
                  ? "अपने प्रिस्क्रिप्शन की फोटो अपलोड करें और हमारा AI तुरंत दवा का नाम, खुराक और निर्देश निकाल लेगा।"
                  : "Upload a photo of your prescription and our AI will instantly extract medicine names, dosages, and instructions."}
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="text-center p-4 rounded-xl bg-card border border-border/50">
                  <div className="inline-flex p-2 rounded-lg bg-secondary/10 mb-2">
                    <feature.icon className="h-5 w-5 text-secondary" />
                  </div>
                  <h4 className="text-sm font-semibold text-foreground">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>

            {/* Capabilities List */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                {i18n.language === "hi" ? "AI क्या निकालता है" : "What AI Extracts"}
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {capabilities.map((cap, index) => (
                  <div key={index} className="flex items-center gap-2 p-2">
                    <CheckCircle className="h-4 w-4 text-success shrink-0" />
                    <span className="text-sm text-foreground">{cap}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button variant="secondary" size="lg" className="gap-2 group" asChild>
              <Link to="/prescription">
                <FileImage className="h-5 w-5" />
                {i18n.language === "hi" ? "प्रिस्क्रिप्शन स्कैन करें" : "Scan Prescription"}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
