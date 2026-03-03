import { useState, useCallback } from "react";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/flood-safety-chat`;

// Intelligent fallback responses when AI is unavailable
const FALLBACK_RESPONSES: Record<string, string> = {
  evacuate: `## 🚨 Flood Evacuation Procedure

**Immediate Steps:**
1. **Move to higher ground** — Do NOT wait for official orders if water is rising
2. **Avoid walking in moving water** — 6 inches can knock you down
3. **Do NOT drive through flooded roads** — "Turn Around, Don't Drown"

**Emergency Kit Essentials:**
- Water (1 gallon per person per day)
- First aid kit & medications
- Important documents in waterproof bag
- Phone charger & flashlight
- Cash in small denominations

**Emergency Numbers:**
- India NDRF: **011-24363260**
- Police: **100** | Ambulance: **108**`,
  
  safety: `## 🛡️ Flood Safety Guidelines

**Before a Flood:**
- Know your area's flood risk
- Prepare an emergency kit
- Have an evacuation plan
- Monitor weather alerts

**During a Flood:**
- Move to higher ground immediately
- Avoid flooded areas
- Do not touch electrical equipment
- Stay away from rivers and drains

**After a Flood:**
- Return home only when declared safe
- Avoid contaminated water
- Document damage for insurance
- Check for structural damage before entering buildings`,

  prediction: `## 📊 Understanding Flood Predictions

FloodGuard uses a **weighted scoring ML model** that analyzes:

| Factor | Weight | Description |
|--------|--------|-------------|
| River Level | 30% | Most critical indicator |
| Rainfall | 25% | Current precipitation |
| Elevation | 15% | Ground height above sea level |
| Soil Moisture | 10% | Ground saturation |
| Humidity | 10% | Atmospheric moisture |
| Previous Rain | 10% | Last 24h accumulated |

**Risk Levels:**
- 🟢 **Low** (0-25%) — Normal conditions
- 🟡 **Medium** (25-50%) — Monitor closely
- 🟠 **High** (50-75%) — Prepare to evacuate
- 🔴 **Critical** (75-100%) — Immediate danger`,

  default: `## 💡 FloodGuard Assistant

I can help you with:

- **Evacuation procedures** — What to do when water rises
- **Safety tips** — Before, during, and after floods
- **Prediction explanation** — How our ML model works
- **Emergency contacts** — Key numbers for help
- **Flood preparedness** — How to prepare your household

Please ask me a specific question about flood safety, and I'll provide detailed guidance.

> 🚨 **For life-threatening emergencies, call 112 (India) or 911 immediately.**`,
};

function getFallbackResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();
  if (lower.includes("evacuate") || lower.includes("evacuation") || lower.includes("escape") || lower.includes("leave")) {
    return FALLBACK_RESPONSES.evacuate;
  }
  if (lower.includes("safe") || lower.includes("protect") || lower.includes("prepare") || lower.includes("guideline")) {
    return FALLBACK_RESPONSES.safety;
  }
  if (lower.includes("predict") || lower.includes("model") || lower.includes("ml") || lower.includes("risk") || lower.includes("how")) {
    return FALLBACK_RESPONSES.prediction;
  }
  return FALLBACK_RESPONSES.default;
}

export function useFloodChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (input: string) => {
    const userMsg: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    let assistantContent = "";

    const updateAssistant = (chunk: string) => {
      assistantContent += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, content: assistantContent } : m
          );
        }
        return [...prev, { role: "assistant", content: assistantContent }];
      });
    };

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) updateAssistant(content);
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // If no content was streamed, use fallback
      if (!assistantContent.trim()) {
        updateAssistant(getFallbackResponse(input));
      }
    } catch (error) {
      console.warn("Chat API unavailable, using fallback:", error);
      // Use intelligent fallback instead of showing error
      updateAssistant(getFallbackResponse(input));
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return { messages, isLoading, sendMessage, clearMessages };
}
