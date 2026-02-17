"use client";

interface IngredientListProps {
  ingredients: string[];
  flaggedIngredients: string[];
}

export default function IngredientList({
  ingredients,
  flaggedIngredients,
}: IngredientListProps) {
  const flaggedSet = new Set(flaggedIngredients);

  return (
    <div className="px-1">
      <h3 className="font-bold text-gray-900 mb-1.5">Ingredients</h3>
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
