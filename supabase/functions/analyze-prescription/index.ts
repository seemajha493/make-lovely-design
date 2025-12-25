import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64 } = await req.json();
    
    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: 'No image provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are a medical prescription analyzer. Analyze the prescription image and extract the following information in a structured format:

1. **Doctor Information**: Name, qualification, registration number, clinic/hospital name, contact details
2. **Patient Information**: Name, age, gender (if visible)
3. **Date**: Prescription date
4. **Medications**: For each medication, extract:
   - Medicine name
   - Dosage (e.g., 500mg)
   - Frequency (e.g., twice daily, morning-evening)
   - Duration (e.g., 5 days, 1 week)
   - Special instructions (e.g., after food, before sleep)
5. **Diagnosis**: If mentioned
6. **Additional Instructions**: Any other advice or follow-up instructions
7. **Warnings**: Any important warnings or contraindications mentioned

Format your response as a clear, organized summary. If any information is not legible or not present, indicate that clearly. Always remind that this analysis is for informational purposes only and should be verified with a healthcare professional.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            content: [
              { type: 'text', text: 'Please analyze this prescription image and extract all relevant medical information.' },
              { 
                type: 'image_url', 
                image_url: { url: imageBase64 } 
              }
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Service temporarily unavailable. Please try again later.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error('Failed to analyze prescription');
    }

    const data = await response.json();
    const analysis = data.choices?.[0]?.message?.content;

    if (!analysis) {
      throw new Error('No analysis received from AI');
    }

    return new Response(
      JSON.stringify({ analysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error analyzing prescription:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Failed to analyze prescription' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
