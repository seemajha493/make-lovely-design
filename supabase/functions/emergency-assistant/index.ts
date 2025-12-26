import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { situation, language = "en" } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an AI Emergency Assistant for JeevanRaksha, India's healthcare emergency app.

YOUR ROLE:
- Quickly analyze emergency situations
- Provide immediate, actionable guidance
- Recommend the appropriate emergency service to call
- Give step-by-step first aid instructions when applicable

EMERGENCY SERVICES IN INDIA:
- 108: Medical Emergency / Ambulance
- 100: Police
- 101: Fire Brigade
- 112: National Emergency (all services)
- 1098: Child Helpline
- 1091: Women Helpline
- 1070: Disaster Management
- 1066: Anti-Poison

RESPONSE FORMAT (JSON):
{
  "urgency": "critical" | "high" | "medium" | "low",
  "primaryService": {
    "number": "emergency number",
    "name": "service name",
    "reason": "why this service"
  },
  "secondaryService": {
    "number": "optional secondary number",
    "name": "service name"
  } | null,
  "immediateActions": ["step 1", "step 2", "step 3"],
  "doNot": ["what not to do 1", "what not to do 2"],
  "safetyTips": ["safety tip 1", "safety tip 2"],
  "summary": "brief 1-2 sentence summary of the situation and recommended action"
}

GUIDELINES:
- Always prioritize life-saving actions
- Be calm and clear in your guidance
- If unsure, recommend calling 112 (national emergency)
- Provide culturally appropriate advice for India
- ${language === "hi" ? "Respond in Hindi" : "Respond in English"}

Analyze the situation and respond with the JSON format above.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Emergency situation: ${situation}` },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Failed to get AI response" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    
    // Try to parse JSON from the response
    let analysis;
    try {
      // Extract JSON from potential markdown code blocks
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/```\n?([\s\S]*?)\n?```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      analysis = JSON.parse(jsonStr.trim());
    } catch {
      // Fallback response if parsing fails
      analysis = {
        urgency: "high",
        primaryService: {
          number: "112",
          name: "National Emergency",
          reason: "Unable to analyze situation - calling national emergency is recommended"
        },
        secondaryService: null,
        immediateActions: ["Stay calm", "Call 112 for immediate assistance", "Stay safe"],
        doNot: ["Do not panic"],
        safetyTips: ["Keep your phone charged", "Know your location"],
        summary: "For any emergency, call 112 - India's unified emergency number."
      };
    }

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Emergency assistant error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
