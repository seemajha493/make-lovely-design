import { Star, Quote } from "lucide-react";
import { useTranslation } from "react-i18next";

export function Testimonials() {
  const { i18n } = useTranslation();

  const testimonials = [
    {
      name: i18n.language === "hi" ? "राजेश कुमार" : "Rajesh Kumar",
      location: i18n.language === "hi" ? "दिल्ली" : "Delhi",
      rating: 5,
      text: i18n.language === "hi" 
        ? "JeevanRaksha ने मेरी माँ की आपातकालीन स्थिति में जान बचाई। एम्बुलेंस 10 मिनट में पहुंच गई। बेहतरीन सेवा!"
        : "JeevanRaksha saved my mother's life in an emergency. The ambulance arrived within 10 minutes. Excellent service!",
      service: i18n.language === "hi" ? "आपातकालीन सेवा" : "Emergency Service",
      avatar: "RK",
    },
    {
      name: i18n.language === "hi" ? "प्रिया शर्मा" : "Priya Sharma",
      location: i18n.language === "hi" ? "मुंबई" : "Mumbai",
      rating: 5,
      text: i18n.language === "hi" 
        ? "AI प्रिस्क्रिप्शन रीडर अद्भुत है! मेरे डॉक्टर की हैंडराइटिंग समझ में नहीं आती थी, अब सब स्पष्ट है।"
        : "The AI Prescription Reader is amazing! I couldn't understand my doctor's handwriting, now everything is clear.",
      service: i18n.language === "hi" ? "AI प्रिस्क्रिप्शन" : "AI Prescription",
      avatar: "PS",
    },
    {
      name: i18n.language === "hi" ? "अमित पटेल" : "Amit Patel",
      location: i18n.language === "hi" ? "अहमदाबाद" : "Ahmedabad",
      rating: 5,
      text: i18n.language === "hi" 
        ? "दवाइयां घर बैठे मिल जाती हैं और वो भी सस्ते दामों में। बहुत सुविधाजनक है।"
        : "Medicines delivered at home at affordable prices. Very convenient for my elderly parents.",
      service: i18n.language === "hi" ? "दवाई डिलीवरी" : "Medicine Delivery",
      avatar: "AP",
    },
    {
      name: i18n.language === "hi" ? "सुनीता देवी" : "Sunita Devi",
      location: i18n.language === "hi" ? "पटना" : "Patna",
      rating: 5,
      text: i18n.language === "hi" 
        ? "प्राथमिक चिकित्सा गाइड ने मेरे बच्चे को जलने पर तुरंत मदद की। हर माँ को यह ऐप इस्तेमाल करना चाहिए।"
        : "The First Aid guide helped my child immediately after a burn. Every parent should use this app.",
      service: i18n.language === "hi" ? "प्राथमिक चिकित्सा" : "First Aid",
      avatar: "SD",
    },
    {
      name: i18n.language === "hi" ? "विकास सिंह" : "Vikas Singh",
      location: i18n.language === "hi" ? "लखनऊ" : "Lucknow",
      rating: 5,
      text: i18n.language === "hi" 
        ? "डॉक्टर से वीडियो कॉल पर परामर्श लिया। बहुत अच्छा अनुभव रहा और पैसे भी बचे।"
        : "Had a video consultation with a doctor. Great experience and saved money on travel.",
      service: i18n.language === "hi" ? "वीडियो परामर्श" : "Video Consultation",
      avatar: "VS",
    },
    {
      name: i18n.language === "hi" ? "अनीता गुप्ता" : "Anita Gupta",
      location: i18n.language === "hi" ? "कोलकाता" : "Kolkata",
      rating: 5,
      text: i18n.language === "hi" 
        ? "ब्लड बैंक फाइंडर से तुरंत नजदीकी ब्लड बैंक मिल गया। समय पर खून मिलने से जान बची।"
        : "Found the nearest blood bank instantly. Getting blood on time saved a life.",
      service: i18n.language === "hi" ? "ब्लड बैंक" : "Blood Bank",
      avatar: "AG",
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

      <div className="container relative">
        <div className="text-center mb-14">
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
            {i18n.language === "hi" ? "प्रशंसापत्र" : "Testimonials"}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-5 tracking-tight">
            {i18n.language === "hi" ? "हमारे उपयोगकर्ता क्या कहते हैं" : "What Our Users Say"}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {i18n.language === "hi" 
              ? "लाखों भारतीय परिवार JeevanRaksha पर भरोसा करते हैं। पढ़ें उनके अनुभव।"
              : "Millions of Indian families trust JeevanRaksha. Read their experiences."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative p-6 rounded-2xl bg-card border border-border/50 shadow-card hover:shadow-lg hover:border-primary/20 transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Quote Icon */}
              <div className="absolute -top-3 -left-3 p-2 rounded-full bg-primary/10">
                <Quote className="h-4 w-4 text-primary" />
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-foreground/80 mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Service Badge */}
              <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
                {testimonial.service}
              </div>

              {/* User Info */}
              <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-bold">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: "4.9", label: i18n.language === "hi" ? "ऐप रेटिंग" : "App Rating", icon: "⭐" },
            { value: "1M+", label: i18n.language === "hi" ? "डाउनलोड" : "Downloads", icon: "📱" },
            { value: "50K+", label: i18n.language === "hi" ? "समीक्षाएं" : "Reviews", icon: "💬" },
            { value: "99%", label: i18n.language === "hi" ? "संतुष्टि दर" : "Satisfaction", icon: "💯" },
          ].map((stat, index) => (
            <div key={index} className="text-center p-6 rounded-2xl bg-muted/50 border border-border/50">
              <span className="text-2xl mb-2 block">{stat.icon}</span>
              <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
