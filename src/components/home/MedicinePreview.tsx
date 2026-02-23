import { Pill, ShoppingCart, ArrowRight, Star, Truck, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import medicineBg from "@/assets/medicine-bg.jpg";

export function MedicinePreview() {
  const { t, i18n } = useTranslation();

  const features = [
    { 
      icon: Truck, 
      title: i18n.language === "hi" ? "मुफ्त डिलीवरी" : "Free Delivery", 
      desc: i18n.language === "hi" ? "₹500 से ऊपर के ऑर्डर पर" : "On orders above ₹500" 
    },
    { 
      icon: Shield, 
      title: i18n.language === "hi" ? "100% असली" : "100% Genuine", 
      desc: i18n.language === "hi" ? "प्रमाणित दवाइयां" : "Certified medicines" 
    },
    { 
      icon: Star, 
      title: i18n.language === "hi" ? "सर्वश्रेष्ठ कीमत" : "Best Prices", 
      desc: i18n.language === "hi" ? "40% तक की छूट" : "Up to 40% off" 
    },
  ];

  const popularMedicines = [
    { name: "Paracetamol 500mg", price: 25, originalPrice: 35, category: "Pain Relief" },
    { name: "Vitamin D3 1000IU", price: 180, originalPrice: 250, category: "Vitamins" },
    { name: "Azithromycin 500mg", price: 95, originalPrice: 120, category: "Antibiotics" },
    { name: "Omeprazole 20mg", price: 45, originalPrice: 60, category: "Gastro" },
  ];

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-background to-muted/30 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-10 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />

      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left - Content */}
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
                <Pill className="h-4 w-4" />
                {i18n.language === "hi" ? "ऑनलाइन फार्मेसी" : "Online Pharmacy"}
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
                {i18n.language === "hi" ? "दवाइयां ऑर्डर करें" : "Order Medicines"}
                <span className="block text-gradient">
                  {i18n.language === "hi" ? "घर बैठे डिलीवरी पाएं" : "Get Doorstep Delivery"}
                </span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-lg">
                {i18n.language === "hi" 
                  ? "सत्यापित फार्मेसियों से प्रमाणित दवाइयां खरीदें। सर्वश्रेष्ठ कीमतों पर तेज़ और विश्वसनीय डिलीवरी।"
                  : "Buy genuine medicines from verified pharmacies. Fast and reliable delivery at the best prices."}
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="text-center p-4 rounded-xl bg-card border border-border/50">
                  <div className="inline-flex p-2 rounded-lg bg-primary/10 mb-2">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h4 className="text-sm font-semibold text-foreground">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>

            {/* Popular Medicines Preview */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                {i18n.language === "hi" ? "लोकप्रिय दवाइयां" : "Popular Medicines"}
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {popularMedicines.map((med, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-colors">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Pill className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{med.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-primary">₹{med.price}</span>
                        <span className="text-xs text-muted-foreground line-through">₹{med.originalPrice}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button variant="hero" size="lg" className="gap-2 group" asChild>
              <Link to="/medicines">
                <ShoppingCart className="h-5 w-5" />
                {i18n.language === "hi" ? "दवाइयां खरीदें" : "Shop Medicines"}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          {/* Right - Image */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border/50">
              <img 
                src={medicineBg} 
                alt="Online Medicine Ordering" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              
              {/* Floating Badge */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="glass rounded-2xl p-4 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-success/20">
                    <Shield className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {i18n.language === "hi" ? "सत्यापित फार्मेसी" : "Verified Pharmacy"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {i18n.language === "hi" ? "100% असली दवाइयां" : "100% Genuine Medicines"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-secondary/20 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
