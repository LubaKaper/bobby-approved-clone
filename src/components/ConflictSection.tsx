"use client";

import { useEffect, useState } from "react";
import { DietaryConflict } from "@/types";

interface ConflictAdvice {
  summary: string;
  suggestions: string[];
  source: "ai" | "deterministic";
}

interface ConflictSectionProps {
  conflicts: DietaryConflict[];
  productName: string;
  brand?: string;
}

export default function ConflictSection({
  conflicts,
  productName,
  brand,
}: ConflictSectionProps) {
  const [advice, setAdvice] = useState<ConflictAdvice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (conflicts.length === 0) {
      setLoading(false);
      return;
    }

    const cacheKey = `conflict_advice_${JSON.stringify({ productName, conflicts })}`;

    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        setAdvice(JSON.parse(cached));
        setLoading(false);
        return;
      }
    } catch {
      // sessionStorage unavailable, continue with fetch
    }

    fetch("/api/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "conflict_advice",
        productName,
        brand,
        conflicts: conflicts.map((c) => ({
          ruleKey: c.ruleKey,
          ruleName: c.ruleName,
          conflictingIngredients: c.conflictingIngredients,
        })),
      }),
    })
      .then((res) => res.json())
      .then((data: ConflictAdvice) => {
        setAdvice(data);
        try {
          sessionStorage.setItem(cacheKey, JSON.stringify(data));
        } catch {
          // sessionStorage full or unavailable
        }
      })
      .catch(() => {
        // Local fallback if fetch itself fails
        const summaryParts = conflicts.map(
          (c) =>
            `This product conflicts with your ${c.ruleName} profile because it contains ${c.conflictingIngredients.join(", ")}.`
        );
        setAdvice({
          summary: summaryParts.join(" "),
          suggestions: [
            "Check the label for alternative products that fit your dietary needs",
          ],
          source: "deterministic",
        });
      })
      .finally(() => setLoading(false));
  }, [productName, brand, conflicts]);

  if (conflicts.length === 0) return null;

  return (
    <div className="bg-bobby-amber-light border border-bobby-amber/30 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="#FF8F00"
          className="w-6 h-6"
        >
          <path
            fillRule="evenodd"
            d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
            clipRule="evenodd"
          />
        </svg>
        <h3 className="font-semibold text-gray-900">
          Conflicts With Your Profile
        </h3>
        {advice && (
          <span
            className={`ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              advice.source === "ai"
                ? "bg-bobby-teal-50 text-bobby-teal-dark"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {advice.source === "ai" ? "AI Assist" : "Demo mode"}
          </span>
        )}
      </div>

      <div className="space-y-3">
        {conflicts.map((conflict) => (
          <div key={conflict.ruleKey} className="bg-white/70 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-semibold text-bobby-amber">
                {conflict.ruleName}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {conflict.conflictingIngredients.map((ingredient, i) => (
                <span
                  key={i}
                  className="text-xs bg-bobby-amber/10 text-amber-800 px-2 py-1 rounded-full"
                >
                  {ingredient}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-bobby-amber/20">
        {loading ? (
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-amber-200/50 rounded w-full" />
            <div className="h-4 bg-amber-200/50 rounded w-5/6" />
            <div className="h-4 bg-amber-200/50 rounded w-3/4 mt-3" />
            <div className="h-4 bg-amber-200/50 rounded w-4/5" />
          </div>
        ) : advice ? (
          <>
            <h4 className="text-sm font-semibold text-gray-900 mb-1">
              What this means
            </h4>
            <p className="text-sm text-gray-600 mb-3">{advice.summary}</p>
            <h4 className="text-sm font-semibold text-gray-900 mb-1">
              Suggestions
            </h4>
            <ul className="space-y-1">
              {advice.suggestions.map((s, i) => (
                <li key={i} className="text-sm text-gray-600 flex gap-2">
                  <span>•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </div>
    </div>
  );
}
