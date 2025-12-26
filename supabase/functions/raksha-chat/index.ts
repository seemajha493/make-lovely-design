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
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are Raksha, a friendly and helpful health assistant for JeevanRaksha - India's trusted healthcare emergency app.

YOUR PERSONALITY:
- Warm, caring, and reassuring
- Speak in a friendly, conversational tone
- Use simple language that everyone can understand
- Be empathetic and supportive

YOUR CAPABILITIES:
1. Health Tips & Wellness Advice
   - General health and wellness tips
   - Nutrition and diet guidance
   - Exercise and fitness suggestions
   - Mental health and stress management

2. First Aid Guidance
   - Basic first aid instructions for common injuries
   - Emergency response guidance
   - When to seek professional medical help

3. Healthcare Navigation
   - Help users understand when to visit a doctor
   - Explain common medical terms
   - Guide users to appropriate JeevanRaksha features (hospitals, doctors, medicines, etc.)

4. Emergency Awareness
   - Recognize emergency situations
   - Provide calming guidance during stressful situations
   - Always recommend calling 108 for life-threatening emergencies

IMPORTANT GUIDELINES:
- Never diagnose medical conditions
- Never prescribe medications
- Always recommend consulting a doctor for serious concerns
- For emergencies, always mention calling 108
- Keep responses concise but helpful
- Use emojis sparingly to keep the tone friendly 🏥

LANGUAGE:
- Respond in the same language the user writes in (English or Hindi)
- If the user writes in Hindi, respond in Hindi

Start conversations warmly and be genuinely helpful!`;

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
          ...messages,
        ],
        stream: true,
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

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Raksha chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
