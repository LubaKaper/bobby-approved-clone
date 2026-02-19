"use client";

import { useState } from "react";
import IngredientIntelligencePanel from "./IngredientIntelligencePanel";

interface IngredientListProps {
  ingredients: string[];
  flaggedIngredients: string[];
  product?: any;
  approval?: any;
  conflicts?: any;
}

export default function IngredientList({
  ingredients,
  flaggedIngredients,
  product,
  approval,
  conflicts,
}: IngredientListProps) {
  const flaggedSet = new Set(flaggedIngredients);
  const [showIntelligence, setShowIntelligence] = useState(false);

  return (
    <div className="px-1">
      <div className="flex items-center justify-between mb-1.5">
        <h3 className="font-bold text-gray-900">Ingredients</h3>
        <button
          className="bg-white border border-gray-200 rounded-full px-3 py-1 text-xs font-semibold text-bobby-teal-dark shadow hover:bg-gray-50 transition"
          onClick={() => setShowIntelligence((v) => !v)}
        >
          🧪 Ingredient Intelligence
        </button>
      </div>
      {showIntelligence && product && approval && conflicts && (
        <div className="mb-2">
          <IngredientIntelligencePanel product={product} approval={approval} conflicts={conflicts} />
        </div>
      )}
      <p className="text-sm leading-relaxed">
        {ingredients.map((ingredient, i) => {
          const isFlagged = flaggedSet.has(ingredient);
          return (
            <span key={i}>
              <span
                className={
                  isFlagged
                    ? "text-bobby-teal-dark font-semibold"
                    : "text-gray-500"
                }
              >
                {ingredient}
              </span>
              {i < ingredients.length - 1 && (
                <span className="text-gray-400">, </span>
              )}
            </span>
          );
        })}
      </p>
    </div>
  );
}
