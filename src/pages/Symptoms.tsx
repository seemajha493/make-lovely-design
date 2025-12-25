import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SOSButton } from "@/components/SOSButton";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Brain, Check, Loader2, RefreshCw, Shield, Stethoscope } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const symptomCategories = [
  {
    category: "General",
    symptoms: ["Fever", "Fatigue", "Weakness", "Chills", "Night Sweats", "Loss of Appetite", "Unexplained Weight Loss"],
  },
  {
    category: "Head & Neurological",
    symptoms: ["Headache", "Dizziness", "Confusion", "Memory Problems", "Blurred Vision", "Fainting"],
  },
  {
    category: "Respiratory",
    symptoms: ["Cough", "Shortness of Breath", "Chest Pain", "Wheezing", "Sore Throat", "Runny Nose", "Congestion"],
  },
  {
    category: "Digestive",
    symptoms: ["Nausea", "Vomiting", "Diarrhea", "Constipation", "Abdominal Pain", "Bloating", "Loss of Appetite"],
  },
  {
    category: "Musculoskeletal",
    symptoms: ["Back Pain", "Joint Pain", "Muscle Aches", "Stiffness", "Swelling", "Numbness/Tingling"],
  },
  {
    category: "Skin",
    symptoms: ["Rash", "Itching", "Skin Discoloration", "Swelling", "Bruising"],
  },
  {
    category: "Heart & Circulation",
    symptoms: ["Rapid Heartbeat", "Chest Tightness", "Leg Swelling", "Cold Hands/Feet"],
  },
];

interface AnalysisResult {
  riskLevel: "low" | "moderate" | "high" | "emergency";
  riskDescription: string;
  possibleConditions: string[];
  recommendedActions: string[];
  whenToSeekHelp: string;
  selfCareTips: string[];
  disclaimer: string;
}

const riskColors = {
  low: "bg-success/10 text-success border-success/20",
  moderate: "bg-warning/10 text-warning border-warning/20",
  high: "bg-destructive/10 text-destructive border-destructive/20",
  emergency: "bg-destructive text-destructive-foreground",
};

const riskIcons = {
  low: Shield,
  moderate: AlertTriangle,
  high: AlertTriangle,
  emergency: AlertTriangle,
};

const Symptoms = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  const analyzeSymptoms = async () => {
    if (selectedSymptoms.length === 0) {
      toast.error("Please select at least one symptom");
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("symptom-checker", {
        body: {
          symptoms: selectedSymptoms,
          additionalInfo: additionalInfo.trim() || undefined,
        },
      });

      if (error) {
        console.error("Error:", error);
        if (error.message?.includes("429")) {
          toast.error("Service is busy. Please try again in a moment.");
        } else {
          toast.error("Failed to analyze symptoms. Please try again.");
        }
        return;
      }

      if (data.error) {
        toast.error(data.error);
        return;
      }

      setResult(data as AnalysisResult);
    } catch (error) {
      console.error("Error analyzing symptoms:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetChecker = () => {
    setSelectedSymptoms([]);
    setAdditionalInfo("");
    setResult(null);
  };

  const RiskIcon = result ? riskIcons[result.riskLevel] : Shield;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex p-4 rounded-2xl bg-primary/10 text-primary mb-4">
              <Brain className="h-10 w-10" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              AI Symptom Checker
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Select your symptoms and get AI-powered guidance on potential conditions and recommended actions.
            </p>
          </div>

          {/* Warning Banner */}
          <div className="mb-8 p-4 rounded-xl bg-warning/10 border border-warning/20 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground">Medical Disclaimer</p>
              <p className="text-sm text-muted-foreground">
                This tool provides general health guidance only and is not a substitute for professional medical advice. 
                Always consult a healthcare provider for proper diagnosis and treatment.
              </p>
            </div>
          </div>

          {!result ? (
            <>
              {/* Symptom Selection */}
              <div className="space-y-6 mb-8">
                {symptomCategories.map((category) => (
                  <div key={category.category} className="p-6 rounded-2xl bg-card border border-border">
                    <h3 className="font-semibold text-foreground mb-4">{category.category}</h3>
                    <div className="flex flex-wrap gap-2">
                      {category.symptoms.map((symptom) => (
                        <button
                          key={symptom}
                          onClick={() => toggleSymptom(symptom)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            selectedSymptoms.includes(symptom)
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
                          }`}
                        >
                          {selectedSymptoms.includes(symptom) && (
                            <Check className="inline h-4 w-4 mr-1" />
                          )}
                          {symptom}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Selected Symptoms Summary */}
              {selectedSymptoms.length > 0 && (
                <div className="mb-6 p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <p className="text-sm font-medium text-foreground mb-2">
                    Selected Symptoms ({selectedSymptoms.length}):
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedSymptoms.join(", ")}
                  </p>
                </div>
              )}

              {/* Additional Info */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Additional Information (Optional)
                </label>
                <textarea
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  placeholder="Describe your symptoms in more detail, how long you've had them, any medications you're taking, etc."
                  className="w-full h-24 p-4 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              {/* Analyze Button */}
              <Button
                variant="hero"
                size="xl"
                className="w-full gap-2"
                onClick={analyzeSymptoms}
                disabled={isAnalyzing || selectedSymptoms.length === 0}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Analyzing Symptoms...
                  </>
                ) : (
                  <>
                    <Stethoscope className="h-5 w-5" />
                    Analyze Symptoms
                  </>
                )}
              </Button>
            </>
          ) : (
            /* Results */
            <div className="space-y-6">
              {/* Risk Level Card */}
              <div className={`p-6 rounded-2xl border ${riskColors[result.riskLevel]}`}>
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${result.riskLevel === 'emergency' ? 'bg-destructive-foreground/20' : ''}`}>
                    <RiskIcon className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold capitalize">{result.riskLevel} Risk</h3>
                    <p className={result.riskLevel === 'emergency' ? 'text-destructive-foreground/80' : ''}>
                      {result.riskDescription}
                    </p>
                  </div>
                </div>
              </div>

              {/* Emergency Warning */}
              {result.riskLevel === "emergency" && (
                <div className="p-6 rounded-2xl bg-destructive text-destructive-foreground">
                  <h3 className="text-lg font-bold mb-2">⚠️ Seek Immediate Medical Attention</h3>
                  <p className="mb-4">Based on your symptoms, we strongly recommend calling emergency services or visiting the nearest emergency room immediately.</p>
                  <Button variant="outline" size="lg" className="bg-destructive-foreground text-destructive hover:bg-destructive-foreground/90" asChild>
                    <a href="tel:108">Call 108 Now</a>
                  </Button>
                </div>
              )}

              {/* Possible Conditions */}
              <div className="p-6 rounded-2xl bg-card border border-border">
                <h3 className="font-semibold text-foreground mb-4">Possible Conditions to Discuss with Your Doctor</h3>
                <ul className="space-y-2">
                  {result.possibleConditions.map((condition, index) => (
                    <li key={index} className="flex items-start gap-2 text-muted-foreground">
                      <span className="text-primary mt-1">•</span>
                      {condition}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Actions */}
              <div className="p-6 rounded-2xl bg-card border border-border">
                <h3 className="font-semibold text-foreground mb-4">Recommended Actions</h3>
                <ul className="space-y-2">
                  {result.recommendedActions.map((action, index) => (
                    <li key={index} className="flex items-start gap-2 text-muted-foreground">
                      <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                        {index + 1}
                      </span>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>

              {/* When to Seek Help */}
              <div className="p-6 rounded-2xl bg-warning/10 border border-warning/20">
                <h3 className="font-semibold text-foreground mb-2">When to Seek Immediate Help</h3>
                <p className="text-muted-foreground">{result.whenToSeekHelp}</p>
              </div>

              {/* Self-Care Tips */}
              {result.selfCareTips && result.selfCareTips.length > 0 && (
                <div className="p-6 rounded-2xl bg-teal/10 border border-teal/20">
                  <h3 className="font-semibold text-foreground mb-4">Self-Care Tips</h3>
                  <ul className="space-y-2">
                    {result.selfCareTips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2 text-muted-foreground">
                        <Check className="h-5 w-5 text-teal shrink-0 mt-0.5" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Disclaimer */}
              <div className="p-4 rounded-xl bg-muted/50 text-center">
                <p className="text-sm text-muted-foreground">{result.disclaimer}</p>
              </div>

              {/* Start Over Button */}
              <Button
                variant="outline"
                size="lg"
                className="w-full gap-2"
                onClick={resetChecker}
              >
                <RefreshCw className="h-5 w-5" />
                Check Different Symptoms
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <SOSButton />
    </div>
  );
};

export default Symptoms;
