"use client";

import { DietaryRule } from "@/data/dietary-rules";

interface AllergenChecklistProps {
  title: string;
  description: string;
  options: DietaryRule[];
  selected: string[];
  onToggle: (key: string) => void;
}

export default function AllergenChecklist({
  title,
  description,
  options,
  selected,
  onToggle,
}: AllergenChecklistProps) {
  const selectedOptions = options.filter((o) => selected.includes(o.key));
  const unselectedOptions = options.filter((o) => !selected.includes(o.key));

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <p className="text-sm text-gray-500 mb-3">{description}</p>

      {selectedOptions.length > 0 && (
        <div className="mb-2">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
            Selected
          </p>
          {selectedOptions.map((option) => (
            <button
              key={option.key}
              onClick={() => onToggle(option.key)}
              className="flex items-center w-full py-3 border-b border-gray-100"
            >
              <div className="w-6 h-6 rounded bg-bobby-teal flex items-center justify-center mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="white"
                  className="w-4 h-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-gray-900 font-medium">{option.name}</span>
            </button>
          ))}
        </div>
      )}

      {unselectedOptions.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
            {selectedOptions.length > 0 ? "Unselected" : "Options"}
          </p>
          {unselectedOptions.map((option) => (
            <button
              key={option.key}
              onClick={() => onToggle(option.key)}
              className="flex items-center w-full py-3 border-b border-gray-100"
            >
              <div className="w-6 h-6 rounded border-2 border-gray-300 mr-3" />
              <span className="text-gray-700">{option.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
