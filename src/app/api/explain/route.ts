import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productName, brand, ingredients, approved, flaggedIngredients } =
      body;

    // If no API key is configured, return a template explanation
    if (
      !process.env.OPENAI_API_KEY ||
      process.env.OPENAI_API_KEY === "your_openai_api_key_here"
    ) {
      const explanation = approved
        ? `${productName} by ${brand} is Bobby Approved because none of its ingredients appear on Bobby's flagged list. The ingredients in this product do not contain common additives of concern like high fructose corn syrup, seed oils, artificial colors, or preservatives.`
        : `${productName} by ${brand} is Not Bobby Approved because it contains the following flagged ingredients: ${flaggedIngredients.join(", ")}. These ingredients are commonly flagged due to potential health concerns including inflammatory properties, artificial processing, or links to negative health outcomes.`;

      return NextResponse.json({ explanation });
    }

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
  } catch {
    return NextResponse.json(
      { explanation: "Explanation temporarily unavailable." },
      { status: 500 }
    );
  }
}
