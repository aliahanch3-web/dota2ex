import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const { heroName } = await req.json();

    console.log(`Generating guide for hero: ${heroName}`);

    const response = await fetch("https://api.langdock.com/anthropic/eu/v1/messages", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("LANGDOCK_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        messages: [
          {
            role: "user",
            content: `You are a Dota 2 expert. Provide a detailed guide for the hero "${heroName}" in Persian/Farsi language.

Return ONLY a valid JSON object with this exact structure (no markdown, no extra text):
{
  "abilities": [
    {
      "name": "نام اسکیل به انگلیسی",
      "description": "توضیح کوتاه درباره اسکیل و نحوه استفاده",
      "tips": ["نکته 1", "نکته 2"]
    }
  ],
  "skillBuild": {
    "early": "ترتیب اسکیل گیری در لول‌های اولیه (1-6)",
    "priority": "اولویت اسکیل گیری",
    "ultimate": "زمان گرفتن اولتیمیت"
  },
  "items": {
    "starting": ["آیتم شروع 1", "آیتم شروع 2"],
    "early": ["آیتم‌های اوایل بازی"],
    "core": ["آیتم‌های اصلی"],
    "luxury": ["آیتم‌های لوکس"]
  },
  "playstyle": {
    "laning": "نحوه بازی در لین",
    "midGame": "نحوه بازی در میدگیم",
    "lateGame": "نحوه بازی در لیت‌گیم",
    "tips": ["نکته کلی 1", "نکته کلی 2", "نکته کلی 3"]
  }
}`
          }
        ],
      }),
    });

    const data = await response.json();
    console.log("API Response received");

    if (!data.content || !data.content[0]) {
      throw new Error("Invalid API response structure");
    }

    const text = data.content[0].text;
    
    // Parse the JSON response
    let guide;
    try {
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        guide = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.log("Raw text:", text);
      throw new Error("Failed to parse AI response as JSON");
    }

    return new Response(JSON.stringify({ guide }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in hero-guide function:', error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
