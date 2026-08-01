// Supabase Edge Function: ai-doctor
//
// Receives the patient's collected intake answers, calls the Anthropic
// Messages API server-side (API key never reaches the browser), and returns
// a structured JSON health assessment.
//
// Deploy:
//   supabase functions deploy ai-doctor
//   supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
//
// Call from the frontend with the Supabase client:
//   const { data, error } = await supabase.functions.invoke('ai-doctor', { body: { answers } });

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
const ANTHROPIC_MODEL = "claude-sonnet-5";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface IntakeAnswers {
  name?: string;
  age?: string;
  gender?: string;
  symptoms?: string;
  duration?: string;
  pain?: string;
  diseases?: string;
  medications?: string;
  allergies?: string;
  lifestyle?: string;
  smoking?: string;
  history?: string;
}

const SYSTEM_PROMPT = `You are a cautious clinical intake assistant inside a healthcare app called MYCARE.
You are NOT a doctor and must never present yourself as one. Given a patient's
self-reported intake answers, produce a short, safe, informational triage
summary. Respond with ONLY valid JSON, no prose before or after, matching
exactly this shape:

{
  "possibleConditions": string[],   // 2-4 plausible, non-diagnostic possibilities
  "riskLevel": "Low" | "Moderate" | "High",
  "recommendedSpecialist": string,  // e.g. "General Physician", "Cardiologist"
  "testsToConsider": string[],      // 1-4 common tests, if relevant
  "generalCare": string[],          // 2-5 general self-care suggestions
  "emergencyWarning": string | null // set ONLY if symptoms suggest a medical emergency
}

Always err toward caution: if symptoms could indicate a medical emergency
(e.g. chest pain, difficulty breathing, stroke signs, severe bleeding,
suicidal ideation), set riskLevel to "High" and fill emergencyWarning with
clear advice to seek immediate emergency care. Never invent a definitive
diagnosis — only possibilities. Keep each string concise (under ~15 words).`;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({ error: "ANTHROPIC_API_KEY is not configured on the server." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { answers } = (await req.json()) as { answers: IntakeAnswers };
    if (!answers?.symptoms) {
      return new Response(JSON.stringify({ error: "Missing symptoms in intake answers." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userPrompt = `Patient intake:
- Name: ${answers.name || "N/A"}
- Age: ${answers.age || "N/A"}
- Gender: ${answers.gender || "N/A"}
- Symptoms: ${answers.symptoms}
- Duration: ${answers.duration || "N/A"}
- Pain level (1-10): ${answers.pain || "N/A"}
- Existing conditions: ${answers.diseases || "None reported"}
- Current medications: ${answers.medications || "None reported"}
- Known allergies: ${answers.allergies || "None reported"}
- Lifestyle: ${answers.lifestyle || "N/A"}
- Smoking/alcohol: ${answers.smoking || "N/A"}
- Family history: ${answers.history || "None reported"}

Return the JSON assessment now.`;

    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text();
      return new Response(JSON.stringify({ error: `Anthropic API error: ${errText}` }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await anthropicRes.json();
    const textBlock = data.content?.find((b: { type: string }) => b.type === "text");
    const raw = textBlock?.text ?? "{}";
    const cleaned = raw.replace(/```json|```/g, "").trim();

    let assessment;
    try {
      assessment = JSON.parse(cleaned);
    } catch {
      return new Response(JSON.stringify({ error: "Model did not return valid JSON.", raw }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ assessment }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
