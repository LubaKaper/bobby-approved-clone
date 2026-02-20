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
      {/* Search bar */}
      <div className="px-4 pt-6 pb-2">
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth={2} className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Search for anything..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white border border-gray-200 text-gray-900 text-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
          />
        </div>
      </div>

      <div className="px-4 py-4">
        {query.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-16">
            {/* Person with magnifying glass illustration */}
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-6">
              {/* Head */}
              <ellipse cx="52" cy="35" rx="18" ry="20" stroke="#4B5563" strokeWidth="2.5" fill="none" />
              {/* Hair */}
              <path d="M34 30c0-12 8-20 18-20s18 8 18 18" stroke="#4B5563" strokeWidth="2.5" fill="none" />
              <path d="M38 22c2-6 8-10 14-10" stroke="#4B5563" strokeWidth="2" fill="none" />
              {/* Eyes */}
              <circle cx="45" cy="36" r="1.5" fill="#4B5563" />
              <circle cx="59" cy="36" r="1.5" fill="#4B5563" />
              {/* Smile */}
              <path d="M47 43c2 2 6 2 8 0" stroke="#4B5563" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              {/* Body/shoulders */}
              <path d="M38 55c-4 2-8 6-10 12v8h48v-8c-2-6-6-10-10-12" stroke="#4B5563" strokeWidth="2.5" fill="none" />
              {/* Collar */}
              <path d="M44 55l8 6 8-6" stroke="#4B5563" strokeWidth="2" fill="none" />
              {/* Magnifying glass */}
              <circle cx="82" cy="52" r="14" stroke="#4B5563" strokeWidth="2.5" fill="none" />
              <circle cx="82" cy="52" r="10" stroke="#4B5563" strokeWidth="1.5" fill="none" />
              <line x1="92" y1="62" x2="102" y2="72" stroke="#4B5563" strokeWidth="3" strokeLinecap="round" />
              {/* Arm holding magnifying glass */}
              <path d="M62 60c4-2 10-4 16-6" stroke="#4B5563" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </svg>
            <p className="text-gray-500 text-center text-[15px] leading-relaxed">
              Search by product names,<br />
              brands, categories, stores,<br />
              ingredients and more.
            </p>
          </div>
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
