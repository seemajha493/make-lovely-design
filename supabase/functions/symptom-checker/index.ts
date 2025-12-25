import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symptoms, additionalInfo } = await req.json();
    
    console.log("Analyzing symptoms:", symptoms);
    console.log("Additional info:", additionalInfo);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const symptomList = symptoms.join(", ");
    
    const systemPrompt = `You are a medical symptom analyzer assistant. Your role is to provide helpful health guidance based on reported symptoms. 

IMPORTANT DISCLAIMERS:
- You are NOT a doctor and cannot provide medical diagnoses
- Always recommend consulting a healthcare professional for proper evaluation
- In case of emergency symptoms, immediately advise calling emergency services

When analyzing symptoms, provide:
1. A risk level assessment (low, moderate, high, emergency)
2. Possible conditions to discuss with a doctor (NOT diagnoses)
3. Recommended actions and next steps
4. When to seek immediate medical attention
5. Self-care tips if appropriate

Format your response as JSON with this structure:
{
  "riskLevel": "low" | "moderate" | "high" | "emergency",
  "riskDescription": "Brief explanation of the risk level",
  "possibleConditions": ["Condition 1 to discuss with doctor", "Condition 2"],
  "recommendedActions": ["Action 1", "Action 2", "Action 3"],
  "whenToSeekHelp": "Description of warning signs that require immediate attention",
  "selfCareTips": ["Tip 1", "Tip 2"],
  "disclaimer": "Standard medical disclaimer"
}`;

    const userPrompt = `Patient reports the following symptoms: ${symptomList}
${additionalInfo ? `Additional information: ${additionalInfo}` : ''}

Please analyze these symptoms and provide guidance. Remember to be helpful but cautious, always recommending professional medical consultation.`;

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
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error("Rate limit exceeded");
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        console.error("Payment required");
        return new Response(JSON.stringify({ error: "AI service temporarily unavailable. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    console.log("AI response:", content);

    // Try to parse the JSON response
    let analysis;
    try {
      // Extract JSON from the response (in case it's wrapped in markdown code blocks)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError);
      // Provide a fallback response
      analysis = {
        riskLevel: "moderate",
        riskDescription: "Unable to fully analyze symptoms. Please consult a healthcare professional.",
        possibleConditions: ["Please consult a doctor for proper evaluation"],
        recommendedActions: [
          "Schedule an appointment with your doctor",
          "Keep track of your symptoms",
          "Note any changes or new symptoms"
        ],
        whenToSeekHelp: "Seek immediate medical attention if symptoms worsen or you experience severe pain, difficulty breathing, or chest pain.",
        selfCareTips: ["Rest and stay hydrated", "Monitor your symptoms"],
        disclaimer: "This is not a medical diagnosis. Please consult a healthcare professional for proper evaluation."
      };
    }

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in symptom-checker function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
