"use client";

import { DietaryConflict } from "@/types";

interface ConflictSectionProps {
  conflicts: DietaryConflict[];
}

export default function ConflictSection({ conflicts }: ConflictSectionProps) {
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
    </div>
  );
}
