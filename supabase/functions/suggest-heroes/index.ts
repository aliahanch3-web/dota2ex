import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Type can be "suggest", "analyze", or "counter"
    if (type === "analyze") {
      return await analyzeTeam(selectedHeroes, LOVABLE_API_KEY, supabase);
    }

    if (type === "counter") {
      return await suggestCounters(enemyHeroes, heroesData, LOVABLE_API_KEY, supabase);
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

async function analyzeTeam(selectedHeroes: Record<string, any>, apiKey: string, supabase: any) {
  const heroList = Object.entries(selectedHeroes)
    .filter(([_, hero]) => hero !== null)
    .map(([pos, hero]: [string, any]) => `${pos}: ${hero.name}`)
    .join(", ");

  // Create a unique cache key from sorted heroes with positions
  const heroEntries = Object.entries(selectedHeroes)
    .filter(([_, hero]) => hero !== null)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([pos, hero]: [string, any]) => `${pos}:${hero.name.toLowerCase()}`);
  const cacheKey = heroEntries.join(",");

  // Check cache first
  const { data: cachedData, error: cacheError } = await supabase
    .from('team_analysis_cache')
    .select('analysis_data')
    .eq('team_heroes_key', cacheKey)
    .maybeSingle();

  if (cacheError) {
    console.error("Cache lookup error:", cacheError);
  }

  if (cachedData) {
    console.log(`Returning cached team analysis for: ${cacheKey}`);
    return new Response(JSON.stringify({ analysis: cachedData.analysis_data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  console.log(`No cache found, generating analysis for: ${cacheKey}`);

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

  // Save to cache
  if (analysis) {
    const { error: insertError } = await supabase
      .from('team_analysis_cache')
      .insert({
        team_heroes_key: cacheKey,
        analysis_data: analysis
      });

    if (insertError) {
      console.error("Failed to cache team analysis:", insertError);
    } else {
      console.log(`Team analysis cached for: ${cacheKey}`);
    }
  }

  return new Response(JSON.stringify({ analysis }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function suggestCounters(
  enemyHeroes: string[],
  heroesData: any[],
  apiKey: string,
  supabase: any
) {
  // Create a unique cache key from sorted enemy heroes
  const cacheKey = [...enemyHeroes].sort().join(",").toLowerCase();
  
  // Check cache first
  const { data: cachedData, error: cacheError } = await supabase
    .from('counter_suggestions_cache')
    .select('suggestions_data')
    .eq('enemy_heroes_key', cacheKey)
    .maybeSingle();

  if (cacheError) {
    console.error("Cache lookup error:", cacheError);
  }

  if (cachedData) {
    console.log(`Returning cached counter suggestions for: ${cacheKey}`);
    const cached = cachedData.suggestions_data as any;
    // Handle both old format (array) and new format (object with counters and teamSuggestions)
    if (Array.isArray(cached)) {
      return new Response(JSON.stringify({ counters: cached, teamSuggestions: [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ counters: cached.counters || [], teamSuggestions: cached.teamSuggestions || [] }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  console.log(`No cache found, generating counters for: ${cacheKey}`);

  const enemyList = enemyHeroes.join(", ");

  const systemPrompt = `You are a Dota 2 counter-picking expert.

RESPOND ONLY WITH A VALID JSON OBJECT:
{
  "counters": [
    {"hero": "Hero Name", "reason": "کوتاه و فارسی چرا کانتر است", "countersAgainst": ["enemy hero 1", "enemy hero 2"]},
    {"hero": "Hero Name", "reason": "کوتاه و فارسی چرا کانتر است", "countersAgainst": ["enemy hero"]}
  ],
  "teamSuggestions": [
    {
      "name": "نام ترکیب (مثل: Push Strategy)",
      "description": "توضیح کوتاه فارسی درباره این ترکیب",
      "pos1": "Hero Name",
      "pos2": "Hero Name", 
      "pos3": "Hero Name",
      "pos4": "Hero Name",
      "pos5": "Hero Name"
    }
  ]
}

Rules:
- Suggest 5-8 individual heroes that counter the enemy picks
- Suggest 2-3 complete 5-hero team compositions that counter the enemy picks
- Reasons must be in Persian (Farsi), max 15 words each
- Use exact hero names from Dota 2
- countersAgainst should list which enemy heroes this pick counters
- For teamSuggestions, each team must have exactly 5 heroes for pos1-pos5
- Team descriptions should explain why this composition counters the enemy (in Persian)
- Consider hero abilities, items, and playstyles`;

  const userPrompt = `تیم دشمن: ${enemyList}
هیروهای موجود: ${heroesData.map((h: any) => h.name).join(", ")}

چه هیروهایی و چه ترکیب تیم‌هایی کانتر این پیک دشمن هستن؟`;

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
  let teamSuggestions: { name: string; description: string; pos1: string; pos2: string; pos3: string; pos4: string; pos5: string }[] = [];
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      counters = parsed.counters || [];
      teamSuggestions = parsed.teamSuggestions || [];
    }
  } catch (parseError) {
    console.error("Failed to parse AI counter response:", parseError);
  }

  const cacheData = { counters, teamSuggestions };

  // Save to cache
  if (counters.length > 0 || teamSuggestions.length > 0) {
    const { error: insertError } = await supabase
      .from('counter_suggestions_cache')
      .insert({
        enemy_heroes_key: cacheKey,
        suggestions_data: cacheData
      });

    if (insertError) {
      console.error("Failed to cache counter suggestions:", insertError);
    } else {
      console.log(`Counter suggestions cached for: ${cacheKey}`);
    }
  }

  return new Response(JSON.stringify({ counters, teamSuggestions }), {
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
