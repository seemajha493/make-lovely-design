import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Bot, Send, Phone, AlertCircle, CheckCircle, XCircle, Loader2, Sparkles, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface EmergencyAnalysis {
  urgency: "critical" | "high" | "medium" | "low";
  primaryService: {
    number: string;
    name: string;
    reason: string;
  };
  secondaryService: {
    number: string;
    name: string;
  } | null;
  immediateActions: string[];
  doNot: string[];
  safetyTips: string[];
  summary: string;
}

export function EmergencyAIAssistant() {
  const { t, i18n } = useTranslation();
  const [situation, setSituation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<EmergencyAnalysis | null>(null);

  const handleAnalyze = async () => {
    if (!situation.trim()) {
      toast({
        title: i18n.language === "hi" ? "कृपया स्थिति बताएं" : "Please describe the situation",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setAnalysis(null);

    try {
      const { data, error } = await supabase.functions.invoke("emergency-assistant", {
        body: { situation, language: i18n.language },
      });

      if (error) throw error;
      setAnalysis(data);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: i18n.language === "hi" ? "त्रुटि" : "Error",
        description: i18n.language === "hi" ? "विश्लेषण विफल। कृपया पुनः प्रयास करें।" : "Analysis failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return "bg-destructive text-destructive-foreground";
      case "high":
        return "bg-warning text-warning-foreground";
      case "medium":
        return "bg-secondary text-secondary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getUrgencyLabel = (urgency: string) => {
    const labels = {
      critical: i18n.language === "hi" ? "गंभीर" : "Critical",
      high: i18n.language === "hi" ? "उच्च" : "High",
      medium: i18n.language === "hi" ? "मध्यम" : "Medium",
      low: i18n.language === "hi" ? "कम" : "Low",
    };
    return labels[urgency as keyof typeof labels] || urgency;
  };

  const placeholderExamples = i18n.language === "hi"
    ? "उदाहरण: 'मेरे पड़ोसी के घर में आग लग गई है' या 'किसी को सांस लेने में तकलीफ हो रही है'"
    : "Examples: 'There is a fire in my neighbor's house' or 'Someone is having difficulty breathing'";

  return (
    <div className="rounded-2xl bg-card border border-border shadow-card overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-destructive/10 to-primary/10 border-b border-border flex items-center gap-3">
        <div className="p-2 rounded-xl bg-destructive/10">
          <Bot className="h-5 w-5 text-destructive" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            {i18n.language === "hi" ? "AI आपातकालीन सहायक" : "AI Emergency Assistant"}
            <Sparkles className="h-4 w-4 text-primary" />
          </h3>
          <p className="text-xs text-muted-foreground">
            {i18n.language === "hi" ? "अपनी स्थिति बताएं और तुरंत मार्गदर्शन पाएं" : "Describe your situation and get instant guidance"}
          </p>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <Textarea
            placeholder={i18n.language === "hi" ? "आपातकालीन स्थिति का वर्णन करें..." : "Describe the emergency situation..."}
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            className="min-h-[100px] resize-none"
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground">{placeholderExamples}</p>
        </div>

        <Button
          onClick={handleAnalyze}
          disabled={isLoading || !situation.trim()}
          className="w-full bg-destructive hover:bg-destructive/90"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {i18n.language === "hi" ? "विश्लेषण हो रहा है..." : "Analyzing..."}
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              {i18n.language === "hi" ? "विश्लेषण करें" : "Analyze Situation"}
            </>
          )}
        </Button>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="p-4 border-t border-border space-y-4 animate-fade-in">
          {/* Urgency Badge & Summary */}
          <div className="flex items-start gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getUrgencyColor(analysis.urgency)}`}>
              {getUrgencyLabel(analysis.urgency)}
            </span>
            <p className="text-sm text-foreground flex-1">{analysis.summary}</p>
          </div>

          {/* Primary Service */}
          <a
            href={`tel:${analysis.primaryService.number}`}
            className="flex items-center gap-4 p-4 rounded-xl bg-destructive/10 border border-destructive/20 hover:bg-destructive/20 transition-colors"
          >
            <div className="p-3 rounded-full bg-destructive text-destructive-foreground">
              <Phone className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="text-2xl font-bold text-destructive">{analysis.primaryService.number}</div>
              <div className="text-sm font-medium text-foreground">{analysis.primaryService.name}</div>
              <div className="text-xs text-muted-foreground">{analysis.primaryService.reason}</div>
            </div>
            <Shield className="h-5 w-5 text-destructive" />
          </a>

          {/* Secondary Service */}
          {analysis.secondaryService && (
            <a
              href={`tel:${analysis.secondaryService.number}`}
              className="flex items-center gap-4 p-3 rounded-xl bg-muted/50 border border-border hover:bg-muted transition-colors"
            >
              <div className="p-2 rounded-full bg-primary/10 text-primary">
                <Phone className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="text-lg font-bold text-foreground">{analysis.secondaryService.number}</div>
                <div className="text-xs text-muted-foreground">{analysis.secondaryService.name}</div>
              </div>
            </a>
          )}

          {/* Immediate Actions */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              {i18n.language === "hi" ? "तुरंत करें" : "Do Immediately"}
            </h4>
            <ul className="space-y-1.5">
              {analysis.immediateActions.map((action, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600 text-xs font-bold shrink-0">
                    {index + 1}
                  </span>
                  {action}
                </li>
              ))}
            </ul>
          </div>

          {/* Do Not */}
          {analysis.doNot.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <XCircle className="h-4 w-4 text-destructive" />
                {i18n.language === "hi" ? "यह न करें" : "Do NOT"}
              </h4>
              <ul className="space-y-1">
                {analysis.doNot.map((item, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-destructive">✗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Safety Tips */}
          {analysis.safetyTips.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-warning" />
                {i18n.language === "hi" ? "सुरक्षा सुझाव" : "Safety Tips"}
              </h4>
              <ul className="space-y-1">
                {analysis.safetyTips.map((tip, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-warning">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Disclaimer */}
          <p className="text-xs text-muted-foreground bg-muted/30 p-2 rounded-lg">
            {i18n.language === "hi"
              ? "⚠️ यह AI मार्गदर्शन है। गंभीर आपात स्थिति में तुरंत 112 पर कॉल करें।"
              : "⚠️ This is AI guidance. For serious emergencies, call 112 immediately."}
          </p>
        </div>
      )}
    </div>
  );
}
