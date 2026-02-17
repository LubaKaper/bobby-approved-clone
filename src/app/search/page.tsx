"use client";

import { useState } from "react";
import Link from "next/link";
import { products } from "@/data/products";

export default function SearchPage() {
  const [query, setQuery] = useState("");

  const filtered = query.length > 0
    ? products.filter(
        (p) =>
          p.product_name.toLowerCase().includes(query.toLowerCase()) ||
          p.brand.toLowerCase().includes(query.toLowerCase()) ||
          p.ingredients.some((i) => i.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-bobby-teal to-bobby-teal-dark px-4 pt-14 pb-6">
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth={2} className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-full bg-white text-gray-900 text-sm placeholder-gray-400 outline-none"
          />
        </div>
      </div>

      <div className="px-4 py-4">
        {query.length === 0 ? (
          <p className="text-gray-400 text-center text-sm mt-8">
            Search for products by name, brand, or ingredient
          </p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-400 text-center text-sm mt-8">
            No products found for &ldquo;{query}&rdquo;
          </p>
        ) : (
          <div className="space-y-2">
            {filtered.map((p) => (
              <Link
                key={p.barcode}
                href={`/result/${p.barcode}`}
                className="block bg-gray-50 rounded-xl px-4 py-3"
              >
                <p className="font-medium text-gray-900">{p.product_name}</p>
                <p className="text-xs text-gray-500">{p.brand} &middot; {p.category}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
