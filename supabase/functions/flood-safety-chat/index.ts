import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const SYSTEM_PROMPT = `You are FloodGuard AI, an expert assistant specialized in flood safety, disaster management, environmental science, GIS analysis, and machine learning for risk prediction. You serve India's National Flood Intelligence Grid.

Your knowledge includes:
- Flood warning signs, prediction models, and how ML models like RandomForest work
- Evacuation procedures and emergency response protocols (India-specific: NDRF, SDRF)
- GIS and remote sensing for flood monitoring (DEM, LiDAR, satellite imagery)
- Hydrology, river systems, monsoon patterns, and climate science
- Urban flood management, drainage systems, and infrastructure vulnerability
- Emergency kit preparation and community resilience
- Post-flood recovery, health hazards, and rehabilitation
- India's flood-prone regions, dam systems, and CWC warnings

Response format guidelines:
- Use **markdown headings** (## and ###) for sections
- Use **bullet points** for lists
- Use **bold** for key terms and critical warnings
- Use tables (| header | header |) for data comparisons when useful
- Use > blockquotes for important safety warnings
- Be comprehensive but structured — judges should see formatted, professional responses
- Always include emergency numbers for India (NDRF: 011-24363260, Police: 100, Ambulance: 108)
- Reference scientific methodology when discussing predictions
- Mention real Indian river systems, states, and geographic features

Keep responses detailed, structured, and authoritative. You represent a national-level flood intelligence system.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Received chat request with", messages?.length || 0, "messages");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please wait a moment and try again." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "AI service error. Please try again." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat function error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
