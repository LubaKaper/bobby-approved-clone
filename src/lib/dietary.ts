import { Product, UserProfile, DietaryConflict } from "@/types";
import { DIETARY_RULES } from "@/data/dietary-rules";

export function checkDietaryConflicts(
  product: Product,
  profile: UserProfile
): DietaryConflict[] {
  const activeKeys = new Set([
    ...profile.allergies,
    ...profile.restrictions,
    ...profile.preferences,
  ]);

  const conflicts: DietaryConflict[] = [];

  for (const rule of DIETARY_RULES) {
    if (!activeKeys.has(rule.key)) continue;

    const conflictingIngredients: string[] = [];

    for (const ingredient of product.ingredients) {
      const normalized = ingredient.toLowerCase().trim();
      for (const ruleIngredient of rule.ingredients) {
        if (normalized.includes(ruleIngredient)) {
          conflictingIngredients.push(ingredient);
          break;
        }
      }
    }

    if (conflictingIngredients.length > 0) {
      conflicts.push({
        ruleName: rule.name,
        ruleKey: rule.key,
        conflictingIngredients,
      });
    }
  }

  return conflicts;
}
