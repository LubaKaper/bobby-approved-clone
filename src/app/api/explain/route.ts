import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

interface ConflictInput {
  ruleKey: string;
  ruleName: string;
  conflictingIngredients: string[];
}

const SUGGESTION_MAP: Record<string, string> = {
  gluten: "Look for gluten-free alternatives made from rice, corn, or chickpea flour",
  dairy: "Choose dairy-free options like oat milk, coconut yogurt, or vegan cheese",
  eggs: "Try egg-free alternatives or products using flax or chia as binders",
  peanuts: "Look for nut-free options or sunflower seed butter alternatives",
  tree_nuts: "Choose nut-free alternatives like seed-based options",
  soy: "Look for soy-free alternatives using coconut aminos or other substitutes",
  fish: "Choose plant-based omega-3 sources like flaxseed or algae-based supplements",
  shellfish: "Look for plant-based seafood alternatives",
  vegan: "Look for plant-based versions of this product",
  keto: "Consider low-carb alternatives without added sugars or starches",
  no_added_sugar: "Choose products labeled 'no sugar added' or naturally sweetened",
  no_seed_oils: "Look for products made with olive oil, coconut oil, or avocado oil instead",
};

function buildDeterministicConflictAdvice(conflicts: ConflictInput[]) {
  const summaryParts = conflicts.map(
    (c) =>
      `This product conflicts with your ${c.ruleName} profile because it contains ${c.conflictingIngredients.join(", ")}.`
  );
  const summary = summaryParts.join(" ");

  const suggestions: string[] = [];
  for (const c of conflicts) {
    const suggestion = SUGGESTION_MAP[c.ruleKey];
    if (suggestion && !suggestions.includes(suggestion)) {
      suggestions.push(suggestion);
    }
  }
  if (suggestions.length === 0) {
    suggestions.push("Check the label for alternative products that fit your dietary needs");
  }

  return { summary, suggestions, source: "deterministic" as const };
}

function parseAIResponse(text: string): { summary: string; suggestions: string[] } | null {
  const summaryMatch = text.match(/SUMMARY:\s*([\s\S]*?)(?=SUGGESTIONS:|$)/i);
  const suggestionsMatch = text.match(/SUGGESTIONS:\s*([\s\S]*)/i);

  if (!summaryMatch) return null;

  const summary = summaryMatch[1].trim();
  if (!summary) return null;

  const suggestions: string[] = [];
  if (suggestionsMatch) {
    const lines = suggestionsMatch[1].split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("- ")) {
        suggestions.push(trimmed.slice(2).trim());
      }
    }
  }

  if (suggestions.length === 0) return null;

  return { summary, suggestions };
}

function hasValidApiKey(): boolean {
  return !!(
    process.env.OPENAI_API_KEY &&
    process.env.OPENAI_API_KEY !== "your_openai_api_key_here"
  );
}

async function handleApproval(body: {
  productName: string;
  brand: string;
  ingredients: string[];
  approved: boolean;
  flaggedIngredients: string[];
}) {
  const { productName, brand, ingredients, approved, flaggedIngredients } = body;

  if (!hasValidApiKey()) {
    const explanation = approved
      ? `${productName} by ${brand} is Bobby Approved because none of its ingredients appear on Bobby's flagged list. The ingredients in this product do not contain common additives of concern like high fructose corn syrup, seed oils, artificial colors, or preservatives.`
      : `${productName} by ${brand} is Not Bobby Approved because it contains the following flagged ingredients: ${flaggedIngredients.join(", ")}. These ingredients are commonly flagged due to potential health concerns including inflammatory properties, artificial processing, or links to negative health outcomes.`;

    return NextResponse.json({ explanation });
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = approved
    ? `Explain in 2-3 sentences why "${productName}" by ${brand} is Bobby Approved. Its ingredients are: ${ingredients.join(", ")}. None of these contain flagged additives like corn syrup, seed oils, artificial colors, or preservatives.`
    : `Explain in 2-3 sentences why "${productName}" by ${brand} is NOT Bobby Approved. Its ingredients are: ${ingredients.join(", ")}. The flagged ingredients are: ${flaggedIngredients.join(", ")}. Explain what these flagged ingredients are and why they are concerning, in simple language.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful food ingredient expert. Provide clear, factual, brief explanations about food ingredients. Do not give medical advice. Keep responses to 2-3 sentences.",
      },
      { role: "user", content: prompt },
    ],
    max_tokens: 200,
    temperature: 0.7,
  });

  const explanation =
    completion.choices[0]?.message?.content ||
    "Unable to generate explanation.";
  return NextResponse.json({ explanation });
}

async function handleConflictAdvice(body: {
  productName: string;
  brand?: string;
  conflicts: ConflictInput[];
}) {
  const { productName, brand, conflicts } = body;

  if (!hasValidApiKey()) {
    return NextResponse.json(buildDeterministicConflictAdvice(conflicts));
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const conflictDesc = conflicts
      .map(
        (c) =>
          `${c.ruleName}: contains ${c.conflictingIngredients.join(", ")}`
      )
      .join("; ");

    const prompt = `The product "${productName}"${brand ? ` by ${brand}` : ""} has these dietary conflicts for the user: ${conflictDesc}.

Provide a brief, helpful response in this exact format:

SUMMARY: <1-2 sentences explaining what this means for the user in plain language>
SUGGESTIONS:
- <actionable suggestion 1>
- <actionable suggestion 2>
- <actionable suggestion 3>

Keep it short and scannable. Do not give medical advice or use fear language. Focus on practical alternatives.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful food ingredient expert. Provide clear, factual, brief advice about dietary conflicts. Do not give medical advice or diagnosis. Keep responses short and scannable.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const rawText = completion.choices[0]?.message?.content || "";
    const parsed = parseAIResponse(rawText);

    if (parsed) {
      return NextResponse.json({
        summary: parsed.summary,
        suggestions: parsed.suggestions,
        source: "ai",
      });
    }

    return NextResponse.json(buildDeterministicConflictAdvice(conflicts));
  } catch {
    return NextResponse.json(buildDeterministicConflictAdvice(conflicts));
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const mode = body.mode || "approval";

    if (mode === "conflict_advice") {
      return handleConflictAdvice(body);
    }

    return handleApproval(body);
  } catch {
    return NextResponse.json(
      { explanation: "Explanation temporarily unavailable." },
      { status: 500 }
    );
  }
}
