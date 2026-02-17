"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getUserProfile } from "@/lib/profile";

const STORE_LOGOS = [
  { name: "Aldi", color: "#00447C", textColor: "white" },
  { name: "Costco", color: "#E31837", textColor: "white" },
  { name: "Target", color: "#CC0000", textColor: "white" },
  { name: "Walmart", color: "#0071DC", textColor: "white" },
];

const FAVORITE_STORES = [
  { name: "Whole Foods", color: "#00674B", textColor: "white" },
  { name: "Amazon", color: "#232F3E", textColor: "white" },
  { name: "Costco", color: "#E31837", textColor: "white" },
  { name: "Aldi", color: "#00447C", textColor: "white" },
];

const AISLE_CATEGORIES = [
  { name: "Meat &\nSeafood", emoji: "🥩" },
  { name: "Dairy,\nCheese, Eggs", emoji: "🧀" },
  { name: "Baking &\nCooking", emoji: "🧁" },
  { name: "Bread &\nBaked Goods", emoji: "🍞" },
];

export default function HomePage() {
  const [bannerVisible, setBannerVisible] = useState(true);
  const [profileCount, setProfileCount] = useState(0);

  useEffect(() => {
    const profile = getUserProfile();
    setProfileCount(profile.allergies.length + profile.restrictions.length);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-bobby-teal via-bobby-teal-light to-white">
      {/* Top icon buttons */}
      <div className="flex items-center gap-2 px-4 pt-12 pb-2">
        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth={2} className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth={2} className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </button>
      </div>

      {/* Allergen Banner */}
      {bannerVisible && (
        <div className="mx-4 mt-2 mb-6">
          <Link href="/profile">
            <div className="relative bg-bobby-pink rounded-2xl p-5 overflow-hidden">
              {/* Decorative dots */}
              <div className="absolute left-3 bottom-4 w-3 h-3 rounded-full bg-purple-200 opacity-60" />
              <div className="absolute left-8 bottom-8 w-2 h-2 rounded-full bg-purple-300 opacity-40" />
              <div className="absolute left-1 bottom-12 w-4 h-4 rounded-full bg-purple-100 opacity-50" />

              {/* Close button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setBannerVisible(false);
                }}
                className="absolute top-3 right-3 text-gray-400 text-lg"
              >
                &times;
              </button>

              <div className="flex items-start justify-between">
                <div className="flex-1 pr-2">
                  <h2 className="text-lg font-bold text-gray-900">
                    Have allergens?
                  </h2>
                  <p className="text-gray-600 text-sm mt-1 leading-snug">
                    Select your allergens, and we&apos;ll highlight them on
                    every product page
                  </p>
                  {profileCount > 0 ? (
                    <span className="inline-block mt-3 text-sm font-medium text-bobby-teal-dark bg-bobby-teal-50 px-4 py-1.5 rounded-full">
                      {profileCount} selected
                    </span>
                  ) : (
                    <span className="inline-block mt-3 bg-bobby-orange text-white text-sm font-bold px-6 py-2.5 rounded-full">
                      Select Now
                    </span>
                  )}
                </div>
                {/* Food illustrations */}
                <div className="flex flex-wrap gap-1 w-28 justify-end text-2xl">
                  <span>🦀</span>
                  <span>🫛</span>
                  <span>🥚</span>
                  <span>🥛</span>
                  <span>🌾</span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Bobby's Shopping Lists */}
      <div className="mx-3 mb-4 bg-bobby-teal-50 rounded-2xl px-4 py-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-900 text-base">
            Bobby&apos;s Shopping Lists
          </h3>
          <span className="text-bobby-teal-dark text-sm font-medium">
            See all
          </span>
        </div>
        <div className="flex gap-5 overflow-x-auto hide-scrollbar">
          {STORE_LOGOS.map((store) => (
            <div key={store.name} className="flex flex-col items-center gap-1.5 flex-shrink-0">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: store.color, color: store.textColor }}
              >
                {store.name.slice(0, 2).toUpperCase()}
              </div>
              <span className="text-xs text-gray-700 font-medium">{store.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Shop Your Favorite Stores */}
      <div className="mx-3 mb-4 bg-bobby-teal-50 rounded-2xl px-4 py-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-900 text-base">
            Shop Your Favorite Stores
          </h3>
          <span className="text-bobby-teal-dark text-sm font-medium">
            See all
          </span>
        </div>
        <div className="flex gap-5 overflow-x-auto hide-scrollbar">
          {FAVORITE_STORES.map((store, i) => (
            <div key={`${store.name}-${i}`} className="flex flex-col items-center gap-1.5 flex-shrink-0">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: store.color, color: store.textColor }}
              >
                {store.name.slice(0, 2).toUpperCase()}
              </div>
              <span className="text-xs text-gray-700 font-medium text-center leading-tight w-16">
                {store.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Shop Smart by Aisle */}
      <div className="mb-4">
        <div className="bg-gradient-to-b from-bobby-pink-light to-white px-4 py-5">
          <h3 className="font-bold text-gray-900 text-base mb-3">
            Shop Smart by Aisle
          </h3>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
            {AISLE_CATEGORIES.map((cat) => (
              <Link href="/ingredients" key={cat.name} className="flex-shrink-0">
                <div className="w-28 h-28 rounded-xl border-2 border-bobby-teal-light bg-white flex items-center justify-center text-4xl">
                  {cat.emoji}
                </div>
                <p className="text-xs text-gray-700 mt-1.5 text-center leading-tight whitespace-pre-line">
                  {cat.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Demo Products (for testing) */}
      <div className="mx-4 mb-6 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-900 text-sm mb-2">
          Demo Products
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { name: "Heinz Ketchup", barcode: "013000006408" },
            { name: "Cheez-It Crackers", barcode: "038000138416" },
            { name: "Coca-Cola", barcode: "049000006582" },
            { name: "Doritos", barcode: "028400090971" },
            { name: "Olive Oil", barcode: "041196010107" },
            { name: "Organic Oats", barcode: "021130126026" },
          ].map((item) => (
            <Link
              key={item.barcode}
              href={`/result/${item.barcode}`}
              className="bg-gray-50 rounded-xl px-3 py-2 text-xs text-gray-600 hover:bg-bobby-teal-50 transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
