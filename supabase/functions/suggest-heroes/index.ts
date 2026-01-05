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
    const { selectedHeroes, targetPosition, heroesData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const selectedHeroesInfo = Object.entries(selectedHeroes)
      .filter(([_, hero]) => hero !== null)
      .map(([pos, hero]: [string, any]) => `${pos}: ${hero.name} (${hero.role})`)
      .join(", ");

    const systemPrompt = `You are a Dota 2 expert. Your job is to suggest heroes that synergize well with the current team composition.

Rules:
1. Consider team balance (damage types, crowd control, tankiness)
2. Consider hero synergies (combos, saves, amplifications)
3. Consider lane matchups and power spikes
4. Respond ONLY with a JSON array of hero names (3-5 heroes)
5. Use exact hero names from Dota 2

Example response format:
["Faceless Void", "Invoker", "Enigma"]`;

    const userPrompt = selectedHeroesInfo
      ? `Current team: ${selectedHeroesInfo}
Target position: ${targetPosition}
Available heroes: ${heroesData.map((h: any) => h.name).join(", ")}

Suggest 3-5 heroes that would synergize well with this team for the ${targetPosition} position.`
      : `Target position: ${targetPosition}
Available heroes: ${heroesData.map((h: any) => h.name).join(", ")}

Suggest 3-5 strong heroes for the ${targetPosition} position.`;

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
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "[]";

    // Parse the AI response to extract hero names
    let suggestedHeroes: string[] = [];
    try {
      // Try to extract JSON array from the response
      const jsonMatch = content.match(/\[[\s\S]*?\]/);
      if (jsonMatch) {
        suggestedHeroes = JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      suggestedHeroes = [];
    }

    return new Response(JSON.stringify({ suggestions: suggestedHeroes }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("suggest-heroes error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
