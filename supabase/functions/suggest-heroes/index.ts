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
    const { selectedHeroes, targetPosition, heroesData, type, enemyHeroes } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Type can be "suggest", "analyze", or "counter"
    if (type === "analyze") {
      return await analyzeTeam(selectedHeroes, LOVABLE_API_KEY);
    }

    if (type === "counter") {
      return await suggestCounters(enemyHeroes, heroesData, LOVABLE_API_KEY);
    }

    return await suggestHeroes(selectedHeroes, targetPosition, heroesData, LOVABLE_API_KEY);
  } catch (error) {
    console.error("suggest-heroes error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

async function suggestHeroes(
  selectedHeroes: Record<string, any>,
  targetPosition: string,
  heroesData: any[],
  apiKey: string
) {
  const selectedHeroesInfo = Object.entries(selectedHeroes)
    .filter(([_, hero]) => hero !== null)
    .map(([pos, hero]: [string, any]) => `${pos}: ${hero.name} (${hero.role})`)
    .join(", ");

  const systemPrompt = `You are a Dota 2 expert. Suggest heroes that synergize with the team.

RESPOND ONLY WITH A VALID JSON OBJECT in this exact format:
{
  "suggestions": [
    {"hero": "Hero Name", "reason": "کوتاه و فارسی دلیل"},
    {"hero": "Hero Name", "reason": "کوتاه و فارسی دلیل"}
  ]
}

Rules:
- Provide 3-5 hero suggestions
- Reasons must be in Persian (Farsi), max 10 words each
- Use exact hero names from Dota 2
- Consider team synergy, damage types, and combos`;

  const userPrompt = selectedHeroesInfo
    ? `تیم فعلی: ${selectedHeroesInfo}
پوزیشن هدف: ${targetPosition}
هیروهای موجود: ${heroesData.map((h: any) => h.name).join(", ")}`
    : `پوزیشن هدف: ${targetPosition}
هیروهای موجود: ${heroesData.map((h: any) => h.name).join(", ")}`;

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
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
    return handleApiError(response);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || "{}";

  let suggestions: { hero: string; reason: string }[] = [];
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      suggestions = parsed.suggestions || [];
    }
  } catch (parseError) {
    console.error("Failed to parse AI response:", parseError);
  }

  return new Response(JSON.stringify({ suggestions }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function analyzeTeam(selectedHeroes: Record<string, any>, apiKey: string) {
  const heroList = Object.entries(selectedHeroes)
    .filter(([_, hero]) => hero !== null)
    .map(([pos, hero]: [string, any]) => `${pos}: ${hero.name}`)
    .join(", ");

const systemPrompt = `You are a Dota 2 analyst. Analyze the team composition.

RESPOND ONLY WITH A VALID JSON OBJECT:
{
  "playstyle": "نام سبک بازی (مثل: Push، Teamfight، Gank)",
  "description": "توضیح کوتاه فارسی درباره نحوه بازی این ترکیب (۳-۴ جمله)",
  "strengths": ["نقطه قوت ۱", "نقطه قوت ۲"],
  "weaknesses": ["نقطه ضعف ۱", "نقطه ضعف ۲"],
  "timing": "زمان قدرت تیم (early/mid/late game)",
  "replacements": [
    {"currentHero": "Hero Name", "suggestedHero": "Hero Name", "position": "pos1", "reason": "دلیل فارسی کوتاه"},
    {"currentHero": "Hero Name", "suggestedHero": "Hero Name", "position": "pos3", "reason": "دلیل فارسی کوتاه"}
  ]
}

Rules for replacements:
- Suggest 1-3 hero replacements to reduce team weaknesses
- Each replacement should address a specific weakness
- position should be the position key (pos1, pos2, pos3, pos4, pos5)
- reason should explain how this reduces a weakness (max 15 words, in Persian)

All text must be in Persian (Farsi).`;

  const userPrompt = `ترکیب تیم: ${heroList}

این ترکیب رو تحلیل کن و سبک بازی، نقاط قوت و ضعف رو توضیح بده.`;

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
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
    return handleApiError(response);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || "{}";

  let analysis = null;
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      analysis = JSON.parse(jsonMatch[0]);
    }
  } catch (parseError) {
    console.error("Failed to parse AI analysis:", parseError);
  }

  return new Response(JSON.stringify({ analysis }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function suggestCounters(
  enemyHeroes: string[],
  heroesData: any[],
  apiKey: string
) {
  const enemyList = enemyHeroes.join(", ");

  const systemPrompt = `You are a Dota 2 counter-picking expert.

RESPOND ONLY WITH A VALID JSON OBJECT:
{
  "counters": [
    {"hero": "Hero Name", "reason": "کوتاه و فارسی چرا کانتر است", "countersAgainst": ["enemy hero 1", "enemy hero 2"]},
    {"hero": "Hero Name", "reason": "کوتاه و فارسی چرا کانتر است", "countersAgainst": ["enemy hero"]}
  ]
}

Rules:
- Suggest 5-8 heroes that counter the enemy picks
- Reasons must be in Persian (Farsi), max 15 words each
- Use exact hero names from Dota 2
- countersAgainst should list which enemy heroes this pick counters
- Consider hero abilities, items, and playstyles`;

  const userPrompt = `تیم دشمن: ${enemyList}
هیروهای موجود: ${heroesData.map((h: any) => h.name).join(", ")}

چه هیروهایی کانتر این پیک دشمن هستن؟`;

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
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
    return handleApiError(response);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || "{}";

  let counters: { hero: string; reason: string; countersAgainst: string[] }[] = [];
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      counters = parsed.counters || [];
    }
  } catch (parseError) {
    console.error("Failed to parse AI counter response:", parseError);
  }

  return new Response(JSON.stringify({ counters }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function handleApiError(response: Response) {
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
