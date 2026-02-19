"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { findProductByBarcode } from "@/data/products";
import { checkBobbyApproval } from "@/lib/approval";
import { checkDietaryConflicts } from "@/lib/dietary";
import { getUserProfile } from "@/lib/profile";
import { Product, ApprovalResult, DietaryConflict } from "@/types";
import ApprovalBadge from "@/components/ApprovalBadge";
import IngredientList from "@/components/IngredientList";
import ConflictSection from "@/components/ConflictSection";
import ExplanationSection from "@/components/ExplanationSection";
import IngredientIntelligencePanel from "@/components/IngredientIntelligencePanel";
import Link from "next/link";

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();
  const barcode = params.barcode as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [approval, setApproval] = useState<ApprovalResult | null>(null);
  const [conflicts, setConflicts] = useState<DietaryConflict[]>([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const found = findProductByBarcode(barcode);
    if (!found) {
      setNotFound(true);
      return;
    }
    setProduct(found);
    setApproval(checkBobbyApproval(found));
    const profile = getUserProfile();
    setConflicts(checkDietaryConflicts(found, profile));
  }, [barcode]);

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#9CA3AF" className="w-10 h-10">
            <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Product Not Found</h2>
        <p className="text-gray-500 mb-1">This barcode is not in our demo dataset.</p>
        <p className="text-gray-400 text-xs font-mono mb-6">{barcode}</p>
        <div className="flex gap-3">
          <Link href="/scanner" className="bg-gradient-to-r from-bobby-teal to-bobby-teal-dark text-white px-6 py-3 rounded-full font-semibold">
            Scan Again
          </Link>
          <Link href="/" className="bg-gray-100 text-gray-700 px-6 py-3 rounded-full font-semibold">
            Home
          </Link>
        </div>
      </div>
    );
  }

  if (!product || !approval) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-8">
      {/* Header */}
      <div
        className={`px-4 pt-12 pb-4 ${
          approval.approved
            ? "bg-gradient-to-b from-green-50 to-white"
            : "bg-gradient-to-b from-red-50 to-white"
        }`}
      >
        {/* Top nav */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth={2} className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
          <div className="flex gap-2">
            <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth={2} className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </button>
            <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth={2} className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </button>
          </div>
        </div>

        {/* Product info */}
        <p className="text-gray-500 text-sm">
          {product.category} by{" "}
          <span className="font-semibold text-gray-700 underline">{product.brand}</span>
        </p>
        <h1 className="text-xl font-bold text-gray-900 mb-1">
          {product.product_name}
        </h1>
        <div className="flex items-center gap-2 text-xs text-bobby-teal-dark">
          <span className="underline">No ratings yet</span>
          <span className="bg-white border border-gray-200 rounded-full px-2.5 py-1 text-xs font-medium flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFB800" className="w-3.5 h-3.5">
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
            </svg>
            Rate
          </span>
        </div>
      </div>

      {/* Product image card */}
      <div className="px-4 mb-4 relative">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center justify-center relative">
          <div className="w-48 h-48 bg-gray-50 rounded-xl flex items-center justify-center text-6xl">
            {product.category === "Sauces" ? "🫙" :
             product.category === "Snacks" ? "🍿" :
             product.category === "Beverages" ? "🥤" :
             product.category === "Oils & Vinegars" ? "🫒" :
             product.category === "Dairy" ? "🥛" :
             product.category === "Sweeteners" ? "🍯" :
             product.category === "Baking & Cooking" ? "🧁" : "🛒"}
          </div>
          {/* Bobby logo overlay */}
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-2xl font-black shadow-lg ${
              approval.approved ? "bg-bobby-green" : "bg-bobby-red"
            }`}>
              B
            </div>
          </div>
          {/* 🧪 Ingredient Intelligence Panel Button */}
          <IngredientIntelligencePanel product={product} approval={approval} conflicts={conflicts} />
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-4 space-y-4">
        {/* Approval */}
        <ApprovalBadge approved={approval.approved} />

        {/* Ingredients */}
        <IngredientList
          ingredients={product.ingredients}
          flaggedIngredients={approval.flaggedIngredients}
          product={product}
          approval={approval}
          conflicts={conflicts}
        />

        {/* Report Issue */}
        <div className="flex justify-center">
          <button className="border border-gray-300 text-gray-600 px-6 py-2 rounded-full text-sm font-medium">
            Report Issue
          </button>
        </div>

        {/* Dietary Conflicts */}
        <ConflictSection
          conflicts={conflicts}
          productName={product.product_name}
          brand={product.brand}
        />

        {/* AI Explanation */}
        <ExplanationSection
          productName={product.product_name}
          brand={product.brand}
          ingredients={product.ingredients}
          approved={approval.approved}
          flaggedIngredients={approval.flaggedIngredients}
        />

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Link
            href="/scanner"
            className="flex-1 bg-gradient-to-r from-bobby-teal to-bobby-teal-dark text-white py-3 rounded-full font-semibold text-center text-sm"
          >
            Scan Another
          </Link>
          <Link
            href="/"
            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-full font-semibold text-center text-sm"
          >
            Home
          </Link>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-gray-400 text-center px-4 pb-2">
          For educational purposes only. Always consult product labels and healthcare providers.
        </p>
      </div>
    </div>
  );
}
