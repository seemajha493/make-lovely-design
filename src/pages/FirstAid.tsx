import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SOSButton } from "@/components/SOSButton";
import { Heart, Flame, Wind, Bone, Droplet, AlertTriangle, ChevronRight, ChevronDown } from "lucide-react";
import { useState } from "react";

const firstAidGuides = [
  {
    id: "cpr",
    icon: Heart,
    title: "CPR (Cardiopulmonary Resuscitation)",
    color: "bg-destructive/10 text-destructive",
    urgency: "Critical",
    steps: [
      "Check for responsiveness - tap the person and shout 'Are you okay?'",
      "Call emergency services (108) or ask someone nearby to call",
      "Place the person on their back on a firm, flat surface",
      "Kneel beside the person's chest",
      "Place the heel of one hand on the center of the chest, other hand on top",
      "Push hard and fast - at least 2 inches deep, 100-120 compressions per minute",
      "If trained, give 2 rescue breaths after every 30 compressions",
      "Continue until emergency help arrives or the person starts breathing",
    ],
  },
  {
    id: "burns",
    icon: Flame,
    title: "Burns Treatment",
    color: "bg-warning/10 text-warning",
    urgency: "Important",
    steps: [
      "Remove the person from the source of the burn if safe to do so",
      "Cool the burn under cool (not cold) running water for at least 10 minutes",
      "Do NOT use ice, butter, or toothpaste on burns",
      "Remove any jewelry or tight clothing near the burned area before swelling",
      "Cover the burn loosely with a sterile, non-stick bandage",
      "Take over-the-counter pain relievers if needed",
      "Seek medical help for large burns, burns on face/hands, or deep burns",
    ],
  },
  {
    id: "choking",
    icon: Wind,
    title: "Choking (Heimlich Maneuver)",
    color: "bg-primary/10 text-primary",
    urgency: "Critical",
    steps: [
      "Ask 'Are you choking?' - if they can't speak, cough, or breathe, act immediately",
      "Stand behind the person and wrap your arms around their waist",
      "Make a fist with one hand and place it just above the navel",
      "Grasp the fist with your other hand",
      "Give 5 quick, upward abdominal thrusts",
      "Repeat until the object is expelled or the person becomes unconscious",
      "If unconscious, begin CPR and call emergency services",
    ],
  },
  {
    id: "fractures",
    icon: Bone,
    title: "Fractures & Bone Injuries",
    color: "bg-teal/10 text-teal",
    urgency: "Important",
    steps: [
      "Keep the injured person still and calm - do not try to move them",
      "Call emergency services for serious fractures",
      "Do NOT try to straighten or realign the bone",
      "Immobilize the area above and below the suspected fracture",
      "Apply ice wrapped in cloth to reduce swelling (20 minutes on, 20 off)",
      "Check for circulation beyond the injury (pulse, skin color)",
      "Treat for shock if needed - keep person warm and lying down",
    ],
  },
  {
    id: "bleeding",
    icon: Droplet,
    title: "Severe Bleeding",
    color: "bg-destructive/10 text-destructive",
    urgency: "Critical",
    steps: [
      "Call emergency services immediately for severe bleeding",
      "Apply direct pressure to the wound using a clean cloth or bandage",
      "If possible, elevate the injured area above the heart",
      "Maintain pressure for at least 15 minutes without removing the cloth",
      "If blood soaks through, add more cloth on top - don't remove the first layer",
      "Apply a pressure bandage to hold the cloth in place",
      "Monitor for signs of shock - pale skin, rapid breathing, confusion",
    ],
  },
  {
    id: "shock",
    icon: AlertTriangle,
    title: "Shock Treatment",
    color: "bg-warning/10 text-warning",
    urgency: "Critical",
    steps: [
      "Call emergency services immediately",
      "Have the person lie down on their back",
      "Elevate the legs about 12 inches if no suspected spinal injury",
      "Keep the person warm with blankets or coats",
      "Do not give food or water",
      "Monitor breathing and pulse regularly",
      "Be prepared to perform CPR if needed",
      "Keep the person calm and still until help arrives",
    ],
  },
];

const FirstAid = () => {
  const [expandedGuide, setExpandedGuide] = useState<string | null>("cpr");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              First Aid Guides
            </h1>
            <p className="text-muted-foreground">
              Step-by-step emergency first aid instructions
            </p>
          </div>

          {/* Warning Banner */}
          <div className="mb-8 p-4 rounded-xl bg-warning/10 border border-warning/20 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground">Important Notice</p>
              <p className="text-sm text-muted-foreground">
                These guides are for educational purposes. Always call emergency services (108) for serious injuries. 
                Professional medical help should be sought as soon as possible.
              </p>
            </div>
          </div>

          {/* Guides List */}
          <div className="space-y-4">
            {firstAidGuides.map((guide) => (
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
                      {guide.title}
                    </h3>
                    <span className={`text-sm ${guide.urgency === 'Critical' ? 'text-destructive' : 'text-warning'}`}>
                      {guide.urgency}
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
                      {guide.steps.map((step, index) => (
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
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <SOSButton />
    </div>
  );
};

export default FirstAid;
