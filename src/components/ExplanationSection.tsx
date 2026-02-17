"use client";

import { useEffect, useState } from "react";

interface ExplanationSectionProps {
  productName: string;
  brand: string;
  ingredients: string[];
  approved: boolean;
  flaggedIngredients: string[];
}

export default function ExplanationSection({
  productName,
  brand,
  ingredients,
  approved,
  flaggedIngredients,
}: ExplanationSectionProps) {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productName,
        brand,
        ingredients,
        approved,
        flaggedIngredients,
      }),
    })
      .then((res) => res.json())
      .then((data) => setExplanation(data.explanation))
      .catch(() => setExplanation("Explanation temporarily unavailable."))
      .finally(() => setLoading(false));
  }, [productName, brand, ingredients, approved, flaggedIngredients]);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 bg-bobby-teal-50 rounded-full flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="#00897B"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97zM6.75 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h3 className="font-semibold text-gray-900">
          {approved ? 'Why "Bobby Approved"?' : 'Why "Not Bobby Approved"?'}
        </h3>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </div>
      ) : (
        <p className="text-gray-600 text-sm leading-relaxed">{explanation}</p>
      )}
    </div>
  );
}
