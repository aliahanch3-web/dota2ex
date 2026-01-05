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

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "You are a Dota 2 expert. Always respond in Persian/Farsi language."
          },
          {
            role: "user",
            content: `Provide a detailed guide for the Dota 2 hero "${heroName}" in Persian/Farsi language. Include information about the hero's facets (the new hero customization system in Dota 2).`
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "hero_guide",
              description: "Return a complete hero guide with abilities, items, facets and playstyle",
              parameters: {
                type: "object",
                properties: {
                  abilities: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string", description: "Ability name in English" },
                        description: { type: "string", description: "Short description in Persian" },
                        tips: { 
                          type: "array", 
                          items: { type: "string" },
                          description: "Tips for using this ability in Persian"
                        }
                      },
                      required: ["name", "description", "tips"]
                    }
                  },
                  facets: {
                    type: "array",
                    description: "Hero facets - the new customization options in Dota 2",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string", description: "Facet name in English" },
                        description: { type: "string", description: "What this facet does in Persian" },
                        recommendation: { type: "string", description: "When to pick this facet in Persian" }
                      },
                      required: ["name", "description", "recommendation"]
                    }
                  },
                  skillBuild: {
                    type: "object",
                    properties: {
                      early: { type: "string", description: "Skill order for levels 1-6 in Persian" },
                      priority: { type: "string", description: "Skill priority in Persian" },
                      ultimate: { type: "string", description: "When to get ultimate in Persian" }
                    },
                    required: ["early", "priority", "ultimate"]
                  },
                  items: {
                    type: "object",
                    properties: {
                      starting: { type: "array", items: { type: "string" } },
                      early: { type: "array", items: { type: "string" } },
                      core: { type: "array", items: { type: "string" } },
                      luxury: { type: "array", items: { type: "string" } }
                    },
                    required: ["starting", "early", "core", "luxury"]
                  },
                  playstyle: {
                    type: "object",
                    properties: {
                      laning: { type: "string", description: "Laning phase tips in Persian" },
                      midGame: { type: "string", description: "Mid game tips in Persian" },
                      lateGame: { type: "string", description: "Late game tips in Persian" },
                      tips: { type: "array", items: { type: "string" }, description: "General tips in Persian" }
                    },
                    required: ["laning", "midGame", "lateGame", "tips"]
                  }
                },
                required: ["abilities", "facets", "skillBuild", "items", "playstyle"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "hero_guide" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "محدودیت درخواست، لطفا کمی صبر کنید." }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "اعتبار ناکافی، لطفا اعتبار خود را افزایش دهید." }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    console.log("API Response received");

    // Extract the tool call result
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== "hero_guide") {
      throw new Error("Invalid response structure from AI");
    }

    const guide = JSON.parse(toolCall.function.arguments);

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
