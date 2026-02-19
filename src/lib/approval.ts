import { Product, ApprovalResult, HeuristicFlag } from "@/types";
import { BOBBY_FLAGGED_INGREDIENTS } from "@/data/flagged-ingredients";

const ENRICHMENT_MARKERS = [
  "niacin", "thiamin", "riboflavin", "folic acid", "ferrous sulfate",
];

const WHEAT_TERMS = ["semolina", "durum", "wheat flour"];

export function checkBobbyApproval(product: Product): ApprovalResult {
  const flaggedIngredients: string[] = [];

  for (const ingredient of product.ingredients) {
    const normalized = ingredient.toLowerCase().trim();
    for (const flagged of BOBBY_FLAGGED_INGREDIENTS) {
      if (normalized.includes(flagged)) {
        flaggedIngredients.push(ingredient);
        break;
      }
    }
  }

  const heuristicFlags: HeuristicFlag[] = [];
  const normalizedIngredients = product.ingredients.map((i) => i.toLowerCase());

  // Rule 1 (deterministic): enriched_grain
  // Fires when 2+ enrichment markers are present anywhere in the ingredients.
  const enrichmentMatches = ENRICHMENT_MARKERS.filter((marker) =>
    normalizedIngredients.some((i) => i.includes(marker))
  );
  if (enrichmentMatches.length >= 2) {
    heuristicFlags.push({
      ruleId: "enriched_grain",
      reason: "Enriched grain/pasta (added vitamins/minerals like niacin/folic acid).",
      ingredients: product.ingredients.filter((i) =>
        ENRICHMENT_MARKERS.some((marker) => i.toLowerCase().includes(marker))
      ),
    });
  }

  // Rule 2 (heuristic): non_organic_wheat
  // Fires only for Pasta/Grains category when product is not labeled organic.
  const isGrainCategory =
    product.category === "Pasta" || product.category === "Grains";
  const isOrganic = product.product_name.toLowerCase().includes("organic");
  if (isGrainCategory && !isOrganic) {
    const wheatMatches = product.ingredients.filter((ing) =>
      WHEAT_TERMS.some((term) => ing.toLowerCase().includes(term))
    );
    if (wheatMatches.length > 0) {
      heuristicFlags.push({
        ruleId: "non_organic_wheat_heuristic",
        reason:
          "Contains wheat but product is not labeled organic (best-effort heuristic).",
        ingredients: wheatMatches,
      });
    }
  }

  return {
    approved: flaggedIngredients.length === 0 && heuristicFlags.length === 0,
    flaggedIngredients,
    heuristicFlags,
  };
}
