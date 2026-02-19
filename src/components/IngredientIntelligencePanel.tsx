import { useState } from "react";
import { ApprovalResult, DietaryConflict, Product } from "@/types";

interface IngredientIntelligencePanelProps {
  product: Product;
  approval: ApprovalResult;
  conflicts: DietaryConflict[];
}

const DIET_RULES = [
  { key: "general", label: "General" },
  { key: "vegan", label: "Vegan" },
  { key: "keto", label: "Keto" },
  { key: "glutenFree", label: "Gluten-Free" },
  { key: "dairyFree", label: "Dairy-Free" },
];

export default function IngredientIntelligencePanel({}: IngredientIntelligencePanelProps) {
  const [expanded, setExpanded] = useState(false);
  const [selectedDiet, setSelectedDiet] = useState("general");

  // Placeholder for score calculation and breakdown logic
  const score = 80; // TODO: Calculate based on selectedDiet and product
  const breakdown = [
    { label: "Approved", value: 70, color: "#22c55e" },
    { label: "Flagged", value: 30, color: "#ef4444" },
  ];

  return (
    <div className="absolute top-2 right-2 z-10">
      <button
        className="bg-white border border-gray-200 rounded-full px-4 py-2 shadow flex items-center gap-2 font-semibold text-bobby-teal-dark hover:bg-gray-50 transition"
        onClick={() => setExpanded((e) => !e)}
        aria-expanded={expanded}
      >
        🧪 Ingredient Intelligence
        <span className="ml-2 text-xs">{expanded ? "▲" : "▼"}</span>
      </button>
      {expanded && (
        <div className="mt-3 w-80 bg-white rounded-xl shadow-lg p-4 space-y-4 border border-gray-100">
          {/* Diet Switcher */}
          <div className="flex gap-2 justify-center mb-2">
            {DIET_RULES.map((diet) => (
              <button
                key={diet.key}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition ${selectedDiet === diet.key ? "bg-bobby-teal text-white border-bobby-teal" : "bg-gray-50 text-gray-700 border-gray-200"}`}
                onClick={() => setSelectedDiet(diet.key)}
              >
                {diet.label}
              </button>
            ))}
          </div>
          {/* Score Wheel (placeholder) */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full border-8 border-bobby-teal flex items-center justify-center text-2xl font-bold text-bobby-teal mb-2">
              {score}
            </div>
            <div className="text-xs text-gray-500">Score ({selectedDiet})</div>
          </div>
          {/* Breakdown (placeholder) */}
          <div>
            <div className="font-semibold text-sm mb-1">Breakdown</div>
            <ul className="space-y-1">
              {breakdown.map((item) => (
                <li key={item.label} className="flex items-center gap-2 text-xs">
                  <span className="inline-block w-3 h-3 rounded-full" style={{ background: item.color }}></span>
                  {item.label}: {item.value}%
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
