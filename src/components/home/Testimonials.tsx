import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";

export function Testimonials() {
  const { i18n } = useTranslation();

  const testimonials = [
    {
      name: i18n.language === "hi" ? "राजेश कुमार" : "Rajesh Kumar",
      location: i18n.language === "hi" ? "दिल्ली" : "Delhi",
      text: i18n.language === "hi" 
        ? "JeevanRaksha ने मेरी माँ की आपातकालीन स्थिति में जान बचाई।"
        : "JeevanRaksha saved my mother's life in an emergency.",
      avatar: "RK",
    },
    {
      name: i18n.language === "hi" ? "प्रिया शर्मा" : "Priya Sharma",
      location: i18n.language === "hi" ? "मुंबई" : "Mumbai",
      text: i18n.language === "hi" 
        ? "AI प्रिस्क्रिप्शन रीडर अद्भुत है! सब कुछ स्पष्ट हो गया।"
        : "The AI Prescription Reader is amazing! Everything is clear now.",
      avatar: "PS",
    },
    {
      name: i18n.language === "hi" ? "अमित पटेल" : "Amit Patel",
      location: i18n.language === "hi" ? "अहमदाबाद" : "Ahmedabad",
      text: i18n.language === "hi" 
        ? "दवाइयां घर बैठे मिल जाती हैं। बहुत सुविधाजनक है।"
        : "Medicines delivered at home. Very convenient.",
      avatar: "AP",
    },
  ];

  const stats = [
    { value: "4.9", label: i18n.language === "hi" ? "रेटिंग" : "Rating" },
    { value: "1M+", label: i18n.language === "hi" ? "डाउनलोड" : "Downloads" },
    { value: "99%", label: i18n.language === "hi" ? "संतुष्टि" : "Satisfaction" },
  ];

  return (
    <section className="py-12 md:py-16 bg-muted/30">
      <div className="container">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            {i18n.language === "hi" ? "उपयोगकर्ता क्या कहते हैं" : "What Users Say"}
          </h2>
          <p className="text-muted-foreground text-sm">
            {i18n.language === "hi" 
              ? "लाखों भारतीय परिवार JeevanRaksha पर भरोसा करते हैं"
              : "Trusted by millions of Indian families"}
          </p>
        </div>

        {/* Testimonials Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-4 rounded-xl bg-card border border-border/50 shadow-sm"
            >
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-3 w-3 fill-warning text-warning" />
                ))}
              </div>
              <p className="text-foreground/80 text-sm mb-3">"{testimonial.text}"</p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Row */}
        <div className="flex justify-center gap-8 md:gap-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
