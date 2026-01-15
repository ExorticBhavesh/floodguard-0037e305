import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AlertRequest {
  phoneNumbers?: string[];
  riskLevel: "low" | "medium" | "high" | "critical";
  location: string;
  message?: string;
  alertId?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const request: AlertRequest = await req.json();
    
    console.log("SMS Alert request:", JSON.stringify(request));

    const TWILIO_ACCOUNT_SID = Deno.env.get("TWILIO_ACCOUNT_SID");
    const TWILIO_AUTH_TOKEN = Deno.env.get("TWILIO_AUTH_TOKEN");
    const TWILIO_PHONE_NUMBER = Deno.env.get("TWILIO_PHONE_NUMBER");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    // Build alert message
    const riskEmoji = {
      low: "🟢",
      medium: "🟡", 
      high: "🟠",
      critical: "🔴",
    };

    const defaultMessage = `${riskEmoji[request.riskLevel]} FloodGuard Alert

Risk Level: ${request.riskLevel.toUpperCase()}
Location: ${request.location}

${request.message || getDefaultMessage(request.riskLevel)}

Stay safe. For emergencies call 911.
- FloodGuard System`;

    // Log the alert to database
    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      
      // Log SMS attempt (would need a table for this in production)
      console.log("Logging SMS alert to database");
    }

    // Check if Twilio is configured
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
      console.log("Twilio not configured - returning mock response");
      
      // Return mock success for demo purposes
      return new Response(
        JSON.stringify({
          success: true,
          mode: "demo",
          message: "SMS alert simulated (Twilio not configured)",
          alertContent: defaultMessage,
          recipients: request.phoneNumbers?.length || 0,
          timestamp: new Date().toISOString(),
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Send real SMS via Twilio
    const phoneNumbers = request.phoneNumbers || [];
    const results = [];

    for (const phone of phoneNumbers) {
      try {
        const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
        
        const twilioResponse = await fetch(twilioUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic " + btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`),
          },
          body: new URLSearchParams({
            To: phone,
            From: TWILIO_PHONE_NUMBER,
            Body: defaultMessage,
          }),
        });

        const twilioResult = await twilioResponse.json();
        
        results.push({
          phone,
          success: twilioResponse.ok,
          messageId: twilioResult.sid,
          error: twilioResponse.ok ? null : twilioResult.message,
        });

        console.log(`SMS to ${phone}: ${twilioResponse.ok ? "sent" : "failed"}`);
      } catch (error) {
        results.push({
          phone,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        mode: "live",
        results,
        totalSent: results.filter(r => r.success).length,
        totalFailed: results.filter(r => !r.success).length,
        timestamp: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("SMS Alert error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Failed to send alert" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function getDefaultMessage(riskLevel: string): string {
  switch (riskLevel) {
    case "critical":
      return "IMMEDIATE ACTION REQUIRED. Evacuate to higher ground immediately. Flooding is imminent or occurring.";
    case "high":
      return "Prepare for possible evacuation. Secure valuables and be ready to move to higher ground.";
    case "medium":
      return "Monitor conditions closely. Avoid low-lying areas and waterways.";
    default:
      return "Current conditions are stable. Stay informed of weather updates.";
  }
}
