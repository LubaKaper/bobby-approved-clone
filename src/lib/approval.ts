import { Product, ApprovalResult } from "@/types";
import { BOBBY_FLAGGED_INGREDIENTS } from "@/data/flagged-ingredients";

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

  return {
    approved: flaggedIngredients.length === 0,
    flaggedIngredients,
  };
}
