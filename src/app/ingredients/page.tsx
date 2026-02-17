"use client";

import Link from "next/link";
import { products } from "@/data/products";

const CATEGORY_EMOJI: Record<string, string> = {
  "Sauces": "🫙",
  "Snacks": "🍿",
  "Beverages": "🥤",
  "Oils & Vinegars": "🫒",
  "Baking & Cooking": "🧁",
  "Dairy": "🥛",
  "Sweeteners": "🍯",
};

export default function IngredientsPage() {
  const categories = Array.from(new Set(products.map((p) => p.category)));

  const grouped = categories.map((cat) => ({
    name: cat,
    emoji: CATEGORY_EMOJI[cat] || "🛒",
    products: products.filter((p) => p.category === cat),
  }));

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-bobby-teal to-bobby-teal-dark px-4 pt-14 pb-6">
        <h1 className="text-white text-xl font-bold">All Products</h1>
      </div>

      <div className="px-4 py-4 space-y-6">
        {grouped.map((group) => (
          <div key={group.name}>
            <h2 className="font-semibold text-gray-900 mb-2">{group.name}</h2>
            <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
              {group.products.map((p) => (
                <Link
                  key={p.barcode}
                  href={`/result/${p.barcode}`}
                  className="flex-shrink-0 w-28"
                >
                  <div className="w-28 h-28 rounded-xl border-2 border-bobby-teal-light bg-gray-50 flex items-center justify-center text-4xl">
                    {group.emoji}
                  </div>
                  <p className="text-xs text-gray-700 mt-1 text-center leading-tight">
                    {p.product_name}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
