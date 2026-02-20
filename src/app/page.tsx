"use client";

import Link from "next/link";
import React, { useEffect, useState, useMemo } from "react";
import { getUserProfile } from "@/lib/profile";

/* ═══════════════════════════════════════════
   DATA — All images reference local /public/images/
   Run download-images.sh first to populate these.
   ═══════════════════════════════════════════ */

const STORE_LOGOS = [
  { name: "Aldi", bg: "#E8601C", logo: "/images/stores/aldi.png" },
  { name: "Costco", bg: "#003DA5", logo: "/images/stores/costco.png" },
  { name: "Target", bg: "#CC0000", logo: "/images/stores/target.png" },
  { name: "Sprouts\nFarmers Mkt", bg: "#4B7B3B", logo: "/images/stores/sprouts.png" },
];

const FAVORITE_STORES = [
  { name: "Amazon &\nOnline Only", bg: "#232F3E", logo: "/images/stores/amazon.png" },
  { name: "Costco", bg: "#003DA5", logo: "/images/stores/costco.png" },
  { name: "Whole Foods", bg: "#00674B", logo: "/images/stores/wholefoods.png" },
  { name: "Aldi", bg: "#E8601C", logo: "/images/stores/aldi.png" },
  { name: "Walmart", bg: "#0071DC", logo: "/images/stores/walmart.png" },
  { name: "Target", bg: "#CC0000", logo: "/images/stores/target.png" },
  { name: "Sprouts", bg: "#4B7B3B", logo: "/images/stores/sprouts.png" },
  { name: "Kroger", bg: "#003DA5", logo: "/images/stores/kroger.png" },
];

const ALL_STORES = [
  { name: "Aldi", bg: "#E8601C", logo: "/images/stores/aldi.png" },
  { name: "Costco", bg: "#003DA5", logo: "/images/stores/costco.png" },
  { name: "Target", bg: "#CC0000", logo: "/images/stores/target.png" },
  { name: "Walmart", bg: "#0071DC", logo: "/images/stores/walmart.png" },
  { name: "Whole Foods", bg: "#00674B", logo: "/images/stores/wholefoods.png" },
  { name: "Amazon", bg: "#232F3E", logo: "/images/stores/amazon.png" },
  { name: "Trader Joe's", bg: "#C8102E", logo: "/images/stores/traderjoes.png" },
  { name: "Thrive Mkt", bg: "#1B7742", logo: "/images/stores/thrive.png" },
  { name: "Sprouts", bg: "#4B7B3B", logo: "/images/stores/sprouts.png" },
  { name: "Sam's Club", bg: "#004F2D", logo: "/images/stores/samsclub.png" },
  { name: "Kroger", bg: "#003DA5", logo: "/images/stores/kroger.png" },
  { name: "Publix", bg: "#3E8B2A", logo: "/images/stores/publix.png" },
  { name: "H.E.B.", bg: "#CC0000", logo: "/images/stores/heb.png" },
  { name: "Wegmans", bg: "#004225", logo: "/images/stores/wegmans.png" },
  { name: "Safeway", bg: "#CC0000", logo: "/images/stores/safeway.png" },
  { name: "Albertsons", bg: "#0072CE", logo: "/images/stores/albertsons.png" },
  { name: "Meijer", bg: "#CC0000", logo: "/images/stores/meijer.png" },
  { name: "Shop Rite", bg: "#F7941D", logo: "/images/stores/shoprite.png" },
  { name: "BJ's", bg: "#CC0000", logo: "/images/stores/bjs.png" },
  { name: "Food Lion", bg: "#1A1A1A", logo: "/images/stores/foodlion.png" },
  { name: "HyVee", bg: "#CC0000", logo: "/images/stores/hyvee.png" },
  { name: "Vons", bg: "#CC0000", logo: "/images/stores/vons.png" },
  { name: "Jewel Osco", bg: "#CC0000", logo: "/images/stores/jewelosco.png" },
  { name: "Save A Lot", bg: "#CC0000", logo: "/images/stores/savealot.png" },
];

const AISLE_CATEGORIES = [
  { name: "Meat &\nSeafood", img: "/images/aisles/meat.jpg" },
  { name: "Dairy,\nCheese, Eggs", img: "/images/aisles/dairy.jpg" },
  { name: "Baking &\nCooking", img: "/images/aisles/baking.jpg" },
  { name: "Bread &\nBaked Goods", img: "/images/aisles/bread.jpg" },
  { name: "Cookies,\nSnacks", img: "/images/aisles/snacks.jpg" },
  { name: "Beverages", img: "/images/aisles/beverages.jpg" },
  { name: "Frozen\nFoods", img: "/images/aisles/frozen.jpg" },
];

const ALL_PRODUCTS = [
  {
    category: "Meat & Seafood",
    items: [
      { name: "Beef", img: "/images/products/beef.jpg" },
      { name: "Other Meats", img: "/images/products/othermeats.jpg" },
      { name: "Seafood", img: "/images/products/seafood.jpg" },
    ],
  },
  {
    category: "Dairy, Cheese, Eggs",
    items: [
      { name: "Cheese", img: "/images/products/cheese.jpg" },
      { name: "Coffee Creamers", img: "/images/products/creamers.jpg" },
      { name: "Butter", img: "/images/products/butter.jpg" },
      { name: "Eggs", img: "/images/products/eggs.jpg" },
    ],
  },
  {
    category: "Baking & Cooking",
    items: [
      { name: "Baking", img: "/images/products/baking-sub.jpg" },
      { name: "Flour & Baking\nMixes", img: "/images/products/flour.jpg" },
      { name: "Oils & Vinegars", img: "/images/products/oils.jpg" },
    ],
  },
  {
    category: "Bread & Baked Goods",
    items: [
      { name: "Other Baked\nGoods", img: "/images/products/bakedgoods.jpg" },
      { name: "Bread", img: "/images/products/bread-sub.jpg" },
      { name: "Flatbreads,\nTortillas", img: "/images/products/flatbreads.jpg" },
    ],
  },
  {
    category: "Breakfast, Cereal, Granola",
    items: [
      { name: "Other Breakfast\nFoods", img: "/images/products/breakfast.jpg" },
      { name: "Cereal, Granola,\nOatmeal", img: "/images/products/cereal.jpg" },
    ],
  },
  {
    category: "Condiments, Sauces, Dressings",
    items: [
      { name: "Salad Dressings\n& Mayo", img: "/images/products/dressings.jpg" },
      { name: "Sauces", img: "/images/products/sauces.jpg" },
      { name: "Condiments", img: "/images/products/condiments.jpg" },
    ],
  },
  {
    category: "Cookies, Snacks, Chips",
    items: [
      { name: "Cookies", img: "/images/products/cookies.jpg" },
      { name: "Chips & Pretzels", img: "/images/products/chips.jpg" },
      { name: "Snack Bars", img: "/images/products/snackbars.jpg" },
    ],
  },
  {
    category: "Beverages",
    items: [
      { name: "Juice", img: "/images/products/juice.jpg" },
      { name: "Soda & Sparkling", img: "/images/products/soda.jpg" },
      { name: "Water", img: "/images/products/water.jpg" },
    ],
  },
  {
    category: "Frozen Foods",
    items: [
      { name: "Frozen Meals", img: "/images/products/frozenmeal.jpg" },
      { name: "Ice Cream", img: "/images/products/icecream.jpg" },
      { name: "Frozen Veggies", img: "/images/products/frozenveggies.jpg" },
    ],
  },
  {
    category: "Canned & Jarred",
    items: [
      { name: "Canned Veggies", img: "/images/products/cannedveggies.jpg" },
      { name: "Canned Soup", img: "/images/products/soup.jpg" },
      { name: "Canned Beans", img: "/images/products/beans.jpg" },
    ],
  },
];

const PROMOS = [
  { brand: "FlavCity Café", deal: "15% off first order + free gift", code: "CAFEAPP15", color: "#0D9488", url: "https://www.shopflavcity.com/pages/cafe" },
  { brand: "Thrive Market", deal: "25% off your first order", code: "BOBBY25", color: "#1B7742", url: "https://thrivemarket.com/bobby" },
  { brand: "Butcher Box", deal: "Free ground beef for life", code: "FLAVCITY", color: "#991B1B", url: "https://subscribe.butcherbox.com/home-8-bps" },
];

const FLAV_PRODUCTS = [
  { name: "Essential Drink Mix, Lemonade Variety Pack", img: "/images/flavcity/lemonade.png", c1: "#FF6B6B", c2: "#FFE66D" },
  { name: "Vanilla Cream Protein Smoothie", img: "/images/flavcity/vanilla.webp", c1: "#F5E6D3", c2: "#E8D5B7" },
  { name: "Electrolyte Drink Mix, Lemon Lime", img: "/images/flavcity/electrolyte-lemonlime.png", c1: "#84CC16", c2: "#A3E635" },
  { name: "Protein Smoothie, Butter Coffee", img: "/images/flavcity/buttercoffee.png", c1: "#A16207", c2: "#CA8A04" },
  { name: "Protein Smoothie, Chocolate PB", img: "/images/flavcity/chocpb.png", c1: "#78350F", c2: "#A16207" },
  { name: "Sleep Support Gummy", img: "/images/flavcity/sleep.png", c1: "#4338CA", c2: "#6366F1" },
  { name: "Vitamin C", img: "/images/flavcity/vitaminc.png", c1: "#EA580C", c2: "#F97316" },
  { name: "Immunity Tea, Lemon Ginger", img: "/images/flavcity/immunitytea.png", c1: "#CA8A04", c2: "#EAB308" },
  { name: "Keto Lemonade, Pink Grapefruit", img: "/images/flavcity/superfoodlemonade.png", c1: "#EC4899", c2: "#F472B6" },
  { name: "Strawberry Limeade Electrolyte", img: "/images/flavcity/strawberrylimeade.webp", c1: "#E11D48", c2: "#FB7185" },
];

/* ═══════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════ */

function StoreLogo({ store, size = 70 }: { store: { name: string; bg: string; logo: string }; size?: number }) {
  const [imgErr, setImgErr] = useState(false);
  return (
    <div className="flex flex-col items-center gap-1.5 flex-shrink-0" style={{ minWidth: size }}>
      <div
        className="rounded-full flex items-center justify-center overflow-hidden shadow-md"
        style={{ width: size, height: size, backgroundColor: store.bg, border: "3px solid rgba(255,255,255,0.25)" }}
      >
        {!imgErr ? (
          <img
            src={store.logo}
            alt={store.name.replace(/\n/g, " ")}
            style={{ width: size * 0.58, height: size * 0.58, objectFit: "contain" }}
            onError={() => setImgErr(true)}
          />
        ) : (
          <span className="text-white font-bold text-sm">
            {store.name.replace(/\n/g, " ").slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>
      <span
        className="text-[11px] text-gray-700 font-semibold text-center leading-tight whitespace-pre-line"
        style={{ width: size + 10 }}
      >
        {store.name}
      </span>
    </div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-sm">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5"><path d="M15 19l-7-7 7-7" /></svg>
    </button>
  );
}

function ChevRight() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 5l7 7-7 7" /></svg>;
}

/* ═══════════════════════════════════════════
   MAIN
   ═══════════════════════════════════════════ */

type Screen = "home" | "shoppingLists" | "allStores" | "allProducts" | "shopFlavCity" | "scanHistory" | "myLists" | "storeCategories" | "categoryDetail";

type CategoryProduct = { name: string; img: string; approved: boolean };

const CATEGORY_PRODUCTS: Record<string, CategoryProduct[]> = {
  "Savory Snacks": [
    { name: "Crackers, Organic, Original, Herb", img: "/images/products/flatbreads.jpg", approved: true },
    { name: "Crackers, Organic, Original", img: "/images/products/bread-sub.jpg", approved: true },
    { name: "Protein Bar, Dark Chocolate Chip Peanut", img: "/images/products/snackbars.jpg", approved: true },
    { name: "Chunky Guacamole", img: "/images/products/condiments.jpg", approved: true },
  ],
  "Sweet Snacks": [
    { name: "Peruvian Raw Cacao-Nectar Bar", img: "/images/products/cookies.jpg", approved: true },
    { name: "Cocoa Truffle Bar, Salted Almond", img: "/images/products/snackbars.jpg", approved: true },
    { name: "Protein Bar, Peanut Butter", img: "/images/products/breakfast.jpg", approved: true },
    { name: "Organic Ancient Grain Granola", img: "/images/products/cereal.jpg", approved: true },
  ],
  "Bread": [
    { name: "Whole Wheat Bread", img: "/images/products/bread-sub.jpg", approved: true },
    { name: "Sourdough Flatbread", img: "/images/products/flatbreads.jpg", approved: true },
    { name: "Multigrain Tortillas", img: "/images/products/flatbreads.jpg", approved: true },
    { name: "Organic Baked Rolls", img: "/images/products/bakedgoods.jpg", approved: true },
  ],
  "Cereal": [
    { name: "Organic Granola, Honey Almond", img: "/images/products/cereal.jpg", approved: true },
    { name: "Steel Cut Oatmeal", img: "/images/products/breakfast.jpg", approved: true },
    { name: "Cinnamon Crunch Cereal", img: "/images/products/cereal.jpg", approved: true },
    { name: "Maple Pecan Granola", img: "/images/products/breakfast.jpg", approved: true },
  ],
  "Cheese": [
    { name: "Organic Cheddar Slices", img: "/images/products/cheese.jpg", approved: true },
    { name: "Grass-Fed Mozzarella", img: "/images/products/cheese.jpg", approved: true },
    { name: "Goat Cheese Crumbles", img: "/images/products/cheese.jpg", approved: true },
    { name: "Cream Cheese, Plain", img: "/images/products/butter.jpg", approved: true },
  ],
  "Condiments": [
    { name: "Organic Ketchup", img: "/images/products/condiments.jpg", approved: true },
    { name: "Yellow Mustard", img: "/images/products/condiments.jpg", approved: true },
    { name: "Avocado Oil Mayo", img: "/images/products/dressings.jpg", approved: true },
    { name: "Hot Sauce, Original", img: "/images/products/sauces.jpg", approved: true },
  ],
  "Cooking Oils": [
    { name: "Extra Virgin Olive Oil", img: "/images/products/oils.jpg", approved: true },
    { name: "Avocado Oil, Cold-Pressed", img: "/images/products/oils.jpg", approved: true },
    { name: "Coconut Oil, Organic", img: "/images/products/oils.jpg", approved: true },
    { name: "Ghee, Grass-Fed", img: "/images/products/butter.jpg", approved: true },
  ],
  "Nut Butters & Jelly": [
    { name: "Almond Butter, Creamy", img: "/images/products/snackbars.jpg", approved: true },
    { name: "Peanut Butter, Organic", img: "/images/products/breakfast.jpg", approved: true },
    { name: "Strawberry Jam, No Sugar Added", img: "/images/products/condiments.jpg", approved: true },
    { name: "Cashew Butter", img: "/images/products/snackbars.jpg", approved: true },
  ],
  "Butter & Ghee": [
    { name: "Grass-Fed Butter, Unsalted", img: "/images/products/butter.jpg", approved: true },
    { name: "Kerrygold Butter", img: "/images/products/butter.jpg", approved: true },
    { name: "Ghee, Organic", img: "/images/products/butter.jpg", approved: true },
    { name: "Plant-Based Butter", img: "/images/products/butter.jpg", approved: true },
  ],
  "Eggs": [
    { name: "Pasture-Raised Eggs", img: "/images/products/eggs.jpg", approved: true },
    { name: "Organic Free Range Eggs", img: "/images/products/eggs.jpg", approved: true },
    { name: "Omega-3 Eggs", img: "/images/products/eggs.jpg", approved: true },
    { name: "Cage-Free Brown Eggs", img: "/images/products/eggs.jpg", approved: true },
  ],
  "Sweeteners": [
    { name: "Raw Honey, Local", img: "/images/products/condiments.jpg", approved: true },
    { name: "Maple Syrup, Grade A", img: "/images/products/breakfast.jpg", approved: true },
    { name: "Monk Fruit Sweetener", img: "/images/products/baking-sub.jpg", approved: true },
    { name: "Coconut Sugar", img: "/images/products/baking-sub.jpg", approved: true },
  ],
  "Baking": [
    { name: "Almond Flour", img: "/images/products/flour.jpg", approved: true },
    { name: "Organic All-Purpose Flour", img: "/images/products/flour.jpg", approved: true },
    { name: "Baking Powder, Aluminum Free", img: "/images/products/baking-sub.jpg", approved: true },
    { name: "Vanilla Extract, Pure", img: "/images/products/baking-sub.jpg", approved: true },
  ],
  "Yogurt": [
    { name: "Greek Yogurt, Plain", img: "/images/products/creamers.jpg", approved: true },
    { name: "Coconut Yogurt, Vanilla", img: "/images/products/creamers.jpg", approved: true },
    { name: "Skyr, Icelandic Style", img: "/images/products/creamers.jpg", approved: true },
    { name: "Kefir, Whole Milk", img: "/images/products/creamers.jpg", approved: true },
  ],
  "Coffee & Tea": [
    { name: "Organic Coffee, Medium Roast", img: "/images/products/breakfast.jpg", approved: true },
    { name: "Green Tea, Matcha", img: "/images/products/juice.jpg", approved: true },
    { name: "Chamomile Tea", img: "/images/products/juice.jpg", approved: true },
    { name: "Cold Brew Concentrate", img: "/images/products/soda.jpg", approved: true },
  ],
};

const STORE_APPROVED_ITEMS: CategoryProduct[] = [
  { name: "Organic Pasta Sauce", img: "/images/products/sauces.jpg", approved: true },
  { name: "Grass-Fed Ground Beef", img: "/images/products/beef.jpg", approved: true },
  { name: "Wild Caught Salmon", img: "/images/products/seafood.jpg", approved: true },
  { name: "Organic Almond Milk", img: "/images/products/creamers.jpg", approved: true },
  { name: "Sourdough Bread", img: "/images/products/bread-sub.jpg", approved: true },
  { name: "Extra Virgin Olive Oil", img: "/images/products/oils.jpg", approved: true },
];

const STORE_CATEGORIES = [
  { name: "Savory Snacks", icon: (
    <svg viewBox="0 0 40 40" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <path d="M12 28c-2-2-3-5-2-8s4-5 7-5c1-3 4-5 7-4s5 4 4 7c3 1 4 4 3 7s-4 4-7 3" />
      <line x1="8" y1="32" x2="18" y2="22" /><line x1="14" y1="32" x2="22" y2="24" />
    </svg>
  )},
  { name: "Sweet Snacks", icon: (
    <svg viewBox="0 0 40 40" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <circle cx="20" cy="20" r="10" /><path d="M15 18c0-1 1-2 2-2s2 1 2 2" /><circle cx="25" cy="16" r="1.5" fill="white" /><circle cx="18" cy="24" r="1.5" fill="white" /><circle cx="23" cy="22" r="1" fill="white" />
    </svg>
  )},
  { name: "Bread", icon: (
    <svg viewBox="0 0 40 40" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <ellipse cx="20" cy="18" rx="12" ry="8" /><path d="M8 18v6c0 4 5 7 12 7s12-3 12-7v-6" /><line x1="14" y1="14" x2="14" y2="18" /><line x1="20" y1="12" x2="20" y2="18" /><line x1="26" y1="14" x2="26" y2="18" />
    </svg>
  )},
  { name: "Cereal", icon: (
    <svg viewBox="0 0 40 40" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <path d="M10 26c0 4 4 6 10 6s10-2 10-6" /><path d="M10 26c0-6 4-14 10-14s10 8 10 14" /><circle cx="16" cy="22" r="2" /><circle cx="24" cy="22" r="2" /><circle cx="20" cy="18" r="2" />
    </svg>
  )},
  { name: "Cheese", icon: (
    <svg viewBox="0 0 40 40" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <path d="M6 28l14-16 14 8v8H6z" /><circle cx="14" cy="24" r="1.5" fill="white" /><circle cx="22" cy="26" r="1" fill="white" /><circle cx="28" cy="23" r="1.5" fill="white" />
    </svg>
  )},
  { name: "Condiments", icon: (
    <svg viewBox="0 0 40 40" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <rect x="14" y="6" width="12" height="6" rx="2" /><path d="M15 12h10l2 4v14a2 2 0 01-2 2H15a2 2 0 01-2-2V16l2-4z" /><line x1="20" y1="20" x2="20" y2="28" /><line x1="16" y1="24" x2="24" y2="24" />
    </svg>
  )},
  { name: "Cooking Oils", icon: (
    <svg viewBox="0 0 40 40" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <rect x="13" y="14" width="14" height="20" rx="2" /><path d="M16 14v-4a4 4 0 018 0v4" /><path d="M22 8c2-2 5-1 5 2" /><circle cx="20" cy="24" r="3" />
    </svg>
  )},
  { name: "Nut Butters & Jelly", icon: (
    <svg viewBox="0 0 40 40" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <rect x="12" y="10" width="16" height="22" rx="3" /><rect x="12" y="10" width="16" height="6" rx="2" /><path d="M16 22h8" /><path d="M18 26h4" />
    </svg>
  )},
  { name: "Butter & Ghee", icon: (
    <svg viewBox="0 0 40 40" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <rect x="8" y="16" width="24" height="14" rx="3" /><path d="M16 16v-4h8v4" /><line x1="20" y1="12" x2="22" y2="6" /><circle cx="22" cy="5" r="1.5" fill="white" />
    </svg>
  )},
  { name: "Eggs", icon: (
    <svg viewBox="0 0 40 40" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <ellipse cx="20" cy="22" rx="10" ry="12" /><circle cx="20" cy="22" r="5" /><circle cx="20" cy="22" r="2" fill="white" />
    </svg>
  )},
  { name: "Sweeteners", icon: (
    <svg viewBox="0 0 40 40" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <path d="M22 8c0-2 3-3 4-1l2 4c1 2-1 4-3 3" /><path d="M20 14c-6 3-10 8-10 14h20c0-6-4-11-10-14z" /><path d="M16 22c2-1 6-1 8 0" />
    </svg>
  )},
  { name: "Baking", icon: (
    <svg viewBox="0 0 40 40" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <line x1="20" y1="8" x2="20" y2="28" /><path d="M14 8c0 6 6 8 6 14" /><path d="M26 8c0 6-6 8-6 14" /><ellipse cx="20" cy="32" rx="8" ry="3" />
    </svg>
  )},
  { name: "Yogurt", icon: (
    <svg viewBox="0 0 40 40" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <path d="M12 14h16l-2 18H14l-2-18z" /><path d="M10 14h20" strokeWidth="2.2" /><path d="M18 10c0-2 2-4 4-3" /><circle cx="20" cy="22" r="3" />
    </svg>
  )},
  { name: "Coffee & Tea", icon: (
    <svg viewBox="0 0 40 40" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <path d="M8 16h20v10a6 6 0 01-6 6h-8a6 6 0 01-6-6v-10z" /><path d="M28 18c3 0 5 2 5 5s-2 5-5 5" /><path d="M14 12c0-2 2-4 4-2" /><path d="M20 10c0-2 2-4 4-2" />
    </svg>
  )},
];

const SCAN_HISTORY_ITEMS = [
  { name: "Shredded Unsweetened Coconut", img: "/images/products/bakedgoods.jpg", approved: true },
  { name: "Organic Naan Crackers", img: "/images/products/flatbreads.jpg", approved: false },
  { name: "Microwave Popcorn", img: "/images/products/chips.jpg", approved: false },
  { name: "Smart Water", img: "/images/products/water.jpg", approved: true },
  { name: "Barbecue Sauce", img: "/images/products/sauces.jpg", approved: false },
  { name: "Vegetable Fruit Sauce", img: "/images/products/condiments.jpg", approved: true },
];

export default function HomePage() {
  const [splash, setSplash] = useState(true);
  const [bannerVisible, setBannerVisible] = useState(true);
  const [profileCount, setProfileCount] = useState(0);
  const [screen, setScreen] = useState<Screen>("home");
  const [flavLikes, setFlavLikes] = useState<Record<number, boolean>>({});
  const [categorySearch, setCategorySearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<{ name: string; icon: React.ReactNode; products: CategoryProduct[] } | null>(null);
  const [prevScreen, setPrevScreen] = useState<Screen>("home");
  const [selectedStoreName, setSelectedStoreName] = useState("");

  useEffect(() => {
    const profile = getUserProfile();
    setProfileCount(profile.allergies.length + profile.restrictions.length);
    const timer = setTimeout(() => setSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const goHome = () => setScreen("home");
    window.addEventListener("go-home", goHome);
    return () => window.removeEventListener("go-home", goHome);
  }, []);

  const [shoppingListSearch, setShoppingListSearch] = useState("");

  const shoppingListItems = useMemo(() => {
    const stores = STORE_LOGOS.map((s) => ({ type: "store" as const, name: s.name.replace(/\n/g, " "), store: s }));
    const categories = STORE_CATEGORIES.map((c) => ({ type: "category" as const, name: c.name, category: c }));
    const all = [...stores, ...categories];
    if (!shoppingListSearch.trim()) return all;
    const q = shoppingListSearch.toLowerCase();
    return all.filter((item) => item.name.toLowerCase().includes(q));
  }, [shoppingListSearch]);

  const filteredCategories = useMemo(() => {
    if (!categorySearch.trim()) return STORE_CATEGORIES;
    const q = categorySearch.toLowerCase();
    return STORE_CATEGORIES.filter((c) => c.name.toLowerCase().includes(q));
  }, [categorySearch]);

  /* ═══ ALLERGEN BANNER (persists across all screens) ═══ */
  const allergenBanner = bannerVisible && (
    <div className="mx-4 mt-2 mb-4">
      <Link href="/profile">
        <div className="relative bg-bobby-pink rounded-2xl p-5 overflow-hidden">
          <div className="absolute left-3 bottom-4 w-3 h-3 rounded-full bg-purple-200 opacity-60" />
          <div className="absolute left-8 bottom-8 w-2 h-2 rounded-full bg-purple-300 opacity-40" />
          <div className="absolute left-1 bottom-12 w-4 h-4 rounded-full bg-purple-100 opacity-50" />
          <button onClick={(e) => { e.preventDefault(); setBannerVisible(false); }} className="absolute top-3 right-3 text-gray-400 text-lg">&times;</button>
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-2">
              <h2 className="text-lg font-bold text-gray-900">Have allergens?</h2>
              <p className="text-gray-600 text-sm mt-1 leading-snug">Select your allergens, and we&apos;ll highlight them on every product page</p>
              {profileCount > 0 ? (
                <span className="inline-block mt-3 text-sm font-medium text-bobby-teal-dark bg-bobby-teal-50 px-4 py-1.5 rounded-full">{profileCount} selected</span>
              ) : (
                <span className="inline-block mt-3 bg-bobby-orange text-white text-sm font-bold px-6 py-2.5 rounded-full">Select Now</span>
              )}
            </div>
            <div className="flex flex-wrap gap-1 w-28 justify-end text-2xl">
              <span>🦀</span><span>🫛</span><span>🥚</span><span>🥛</span><span>🌾</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );

  /* ═══ SPLASH SCREEN ═══ */
  if (splash) {
    return (
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center"
        style={{ background: "linear-gradient(180deg, #2A9D8F 0%, #6EC6B8 40%, #A8DDD4 70%, #D0F0EA 100%)" }}
      >
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="90" stroke="white" strokeWidth="6" fill="none" />
          <circle cx="100" cy="100" r="80" stroke="white" strokeWidth="3" fill="none" />
          <defs>
            <path id="topArc" d="M 30,100 a 70,70 0 0,1 140,0" />
            <path id="bottomArc" d="M 170,108 a 70,70 0 0,1 -140,0" />
          </defs>
          <text fill="white" fontSize="24" fontWeight="900" fontFamily="sans-serif" letterSpacing="6">
            <textPath href="#topArc" startOffset="50%" textAnchor="middle">BOBBY</textPath>
          </text>
          <text fill="white" fontSize="20" fontWeight="900" fontFamily="sans-serif" letterSpacing="4">
            <textPath href="#bottomArc" startOffset="50%" textAnchor="middle">APPROVED</textPath>
          </text>
          <polygon points="38,82 40,77 42,82 38,82" fill="white" />
          <polygon points="36,78 38,72 40,78 36,78" fill="white" />
          <polygon points="158,82 160,77 162,82 158,82" fill="white" />
          <polygon points="160,78 162,72 164,78 160,78" fill="white" />
          <circle cx="100" cy="96" r="32" stroke="white" strokeWidth="4" fill="none" />
          <path d="M92 108 L92 94 M92 94 L96 82 C97 79 101 78 102 81 L100 90 L112 90 C115 90 117 93 116 96 L113 108 C112 110 110 112 108 112 L96 112 C94 112 92 110 92 108Z" fill="white" />
          <rect x="84" y="94" width="8" height="18" rx="2" fill="white" />
          <circle cx="62" cy="68" r="1.5" fill="white" opacity="0.7" />
          <circle cx="56" cy="88" r="1" fill="white" opacity="0.5" />
          <circle cx="140" cy="72" r="1.5" fill="white" opacity="0.7" />
          <circle cx="68" cy="112" r="1" fill="white" opacity="0.6" />
          <circle cx="134" cy="108" r="1.2" fill="white" opacity="0.5" />
        </svg>
      </div>
    );
  }

  /* ═══ SCREEN: Shopping Lists ═══ */
  if (screen === "shoppingLists") {
    return (
      <div className="min-h-screen bg-white">
        <div className="sticky top-0 z-50 bg-white">
          <div className="flex items-center gap-3 px-4 py-4">
            <BackButton onClick={() => { setScreen("home"); setShoppingListSearch(""); }} />
            <h2 className="text-lg font-bold text-gray-900">Bobby&apos;s Shopping Lists</h2>
          </div>
          <div className="px-4 pb-3">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input type="text" placeholder="Search for Bobby's Shopping Lists" value={shoppingListSearch} onChange={(e) => setShoppingListSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400" />
            </div>
          </div>
        </div>
        <div className="px-4">
          {shoppingListItems.length === 0 ? (
            <div className="text-center py-12"><p className="text-gray-400 text-sm">No results found</p></div>
          ) : (
            shoppingListItems.map((item, i) => (
              <button
                key={i}
                onClick={() => {
                  setPrevScreen("shoppingLists");
                  if (item.type === "store") {
                    setSelectedCategory({ name: item.name, icon: null, products: STORE_APPROVED_ITEMS });
                  } else {
                    setSelectedCategory({ name: item.category.name, icon: item.category.icon, products: CATEGORY_PRODUCTS[item.category.name] || [] });
                  }
                  setScreen("categoryDetail");
                }}
                className="w-full flex items-center gap-4 py-3 border-b border-gray-100"
              >
                {item.type === "store" ? (
                  <div className="w-[60px] h-[60px] rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden shadow-sm" style={{ backgroundColor: item.store.bg }}>
                    <img src={item.store.logo} alt={item.name} className="w-[35px] h-[35px] object-contain" />
                  </div>
                ) : (
                  <div className="w-[60px] h-[60px] rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#0D9488" }}>
                    {item.category.icon}
                  </div>
                )}
                <span className="text-[17px] font-semibold text-gray-900 flex-1 text-left">{item.name}</span>
                <ChevRight />
              </button>
            ))
          )}
        </div>
      </div>
    );
  }

  /* ═══ SCREEN: All Stores ═══ */
  if (screen === "allStores") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 z-50 flex items-center gap-3 px-4 py-4" style={{ background: "linear-gradient(180deg, #B2F5EA, #E0F7F5)" }}>
          <BackButton onClick={() => setScreen("home")} />
          <h2 className="text-lg font-bold text-gray-900">Shop Your Favorite Stores</h2>
        </div>
        {allergenBanner}
        <div className="p-4">
          <div className="grid grid-cols-3 gap-5">{ALL_STORES.map((store, i) => <button key={i} onClick={() => { setSelectedStoreName(store.name.replace(/\n/g, " ")); setScreen("allProducts"); }}><StoreLogo store={store} size={80} /></button>)}</div>
        </div>
      </div>
    );
  }

  /* ═══ SCREEN: All Products ═══ */
  if (screen === "allProducts") {
    return (
      <div className="min-h-screen bg-white">
        <div className="sticky top-0 z-50 flex items-center gap-3 px-4 py-4 bg-white border-b border-gray-100">
          <BackButton onClick={() => { setScreen("home"); setSelectedStoreName(""); }} />
          <h2 className="text-lg font-bold text-gray-900">{selectedStoreName || "All Products"}</h2>
        </div>
        {allergenBanner}
        <div className="px-4 pb-8">
          {ALL_PRODUCTS.map((section, si) => (
            <div key={si}>
              {si > 0 && <hr className="my-5 border-gray-200" />}
              <h3 className="font-bold text-gray-900 text-[17px] mb-3">{section.category}</h3>
              <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2 items-start">
                {section.items.map((item, ii) => (
                  <Link href="/ingredients" key={ii} className="flex-shrink-0 w-[140px]">
                    <div className="w-[140px] h-[130px] rounded-2xl overflow-hidden border-[2.5px] border-bobby-teal bg-gray-50">
                      <img src={item.img} alt={item.name.replace(/\n/g, " ")} className="w-full h-full object-cover" />
                    </div>
                    <p className="text-[13px] text-gray-800 font-semibold mt-2 leading-tight whitespace-pre-line">{item.name}</p>
                  </Link>
                ))}
                {section.items.length >= 3 && (
                  <div className="flex-shrink-0 flex items-center justify-center h-[130px] w-8">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><path d="M9 5l7 7-7 7" /></svg>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ═══ SCREEN: Shop FlavCity ═══ */
  if (screen === "shopFlavCity") {
    return (
      <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #CCFBF1, #F0FDFA)" }}>
        <div className="sticky top-0 z-50 flex items-center gap-3 px-4 py-4" style={{ background: "linear-gradient(180deg, #99F6E4, #CCFBF1)" }}>
          <BackButton onClick={() => setScreen("home")} />
          <h2 className="text-lg font-bold text-gray-900">Shop FlavCity</h2>
          <div className="ml-auto">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#374151" strokeWidth="2"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4m6.6 14a1 1 0 100-2 1 1 0 000 2zm6 0a1 1 0 100-2 1 1 0 000 2z" /></svg>
          </div>
        </div>
        {allergenBanner}
        <div className="p-4">
          <div className="grid grid-cols-2 gap-3.5">
            {FLAV_PRODUCTS.map((p, i) => (
              <div key={i} className="rounded-2xl bg-white shadow-sm overflow-hidden">
                <div className="h-[140px] flex items-center justify-center relative" style={{ background: `linear-gradient(135deg, ${p.c1}22, ${p.c2}33)` }}>
                  <img src={p.img} alt={p.name} className="w-full h-full object-contain p-2" />
                  <div className="absolute top-2.5 left-2.5 w-[28px] h-[28px] rounded-full flex items-center justify-center" style={{ background: "#0D9488" }}>
                    <span className="text-white font-black text-[12px]">B</span>
                  </div>
                  <button onClick={() => setFlavLikes((prev) => ({ ...prev, [i]: !prev[i] }))} className="absolute top-2.5 right-2.5 w-9 h-9 rounded-full bg-gray-100/80 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill={flavLikes[i] ? "#ef4444" : "none"} stroke={flavLikes[i] ? "#ef4444" : "#bbb"} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>
                  </button>
                </div>
                <div className="p-3"><p className="text-[12px] font-semibold text-gray-700 leading-snug">{p.name}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ═══ SCREEN: Category Detail (products in a category) ═══ */
  if (screen === "categoryDetail" && selectedCategory) {
    return (
      <div className="min-h-screen bg-white">
        <div className="relative">
          <button onClick={() => setScreen(prevScreen)} className="absolute top-4 left-4 z-10 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-sm">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5"><path d="M15 19l-7-7 7-7" /></svg>
          </button>
          {selectedCategory.icon ? (
            <div className="flex justify-center pt-6 pb-8">
              <div className="w-[120px] h-[120px] rounded-full flex items-center justify-center" style={{ background: "#0D9488" }}>
                <div className="scale-[2.2]">{selectedCategory.icon}</div>
              </div>
            </div>
          ) : (
            <div className="pt-10 pb-6" />
          )}
        </div>
        <div className="px-4 pb-4">
          <h2 className="text-[22px] font-bold text-gray-900 mb-4">{selectedCategory.name}</h2>
          <div className="grid grid-cols-2 gap-3.5">
            {selectedCategory.products.map((item, i) => (
              <div key={i} className="rounded-2xl bg-white shadow-sm overflow-hidden border border-gray-100">
                <div className="h-[170px] relative">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                  <div className="absolute top-2.5 left-2.5 w-[32px] h-[32px] rounded-full flex items-center justify-center" style={{ background: item.approved ? "#0D9488" : "#EF4444" }}>
                    <span className="text-white font-black text-[13px]">B</span>
                  </div>
                  <button className="absolute top-2.5 right-2.5 w-9 h-9 rounded-full bg-gray-200/70 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>
                  </button>
                </div>
                <div className="p-3">
                  <p className="text-[13px] font-semibold text-gray-800 leading-snug">{item.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="sticky bottom-16 px-4 pb-4 z-40">
          <button onClick={() => window.open("https://www.instacart.com", "_blank")} className="w-full py-3.5 rounded-full font-bold text-white text-sm flex items-center justify-center gap-2 cursor-pointer" style={{ background: "#1B4332" }}>
            <span className="text-lg">🥕</span> Order with Instacart
          </button>
        </div>
      </div>
    );
  }

  /* ═══ SCREEN: Store Categories (Bobby's Shopping Lists detail) ═══ */
  if (screen === "storeCategories") {
    return (
      <div className="min-h-screen bg-white">
        <div className="sticky top-0 z-50 bg-white">
          <div className="flex items-center gap-3 px-4 py-4">
            <BackButton onClick={() => { setScreen("shoppingLists"); setCategorySearch(""); }} />
            <h2 className="text-lg font-bold text-gray-900">Bobby&apos;s Shopping Lists</h2>
          </div>
          <div className="px-4 pb-3">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input type="text" placeholder="Search for Bobby's Shopping Lists" value={categorySearch} onChange={(e) => setCategorySearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400" />
            </div>
          </div>
        </div>
        <div className="px-4">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12"><p className="text-gray-400 text-sm">No categories found</p></div>
          ) : (
            filteredCategories.map((cat, i) => (
              <button key={i} onClick={() => { setPrevScreen("storeCategories"); setSelectedCategory({ name: cat.name, icon: cat.icon, products: CATEGORY_PRODUCTS[cat.name] || [] }); setScreen("categoryDetail"); }} className="w-full flex items-center gap-4 py-3 border-b border-gray-100">
                <div className="w-[60px] h-[60px] rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#0D9488" }}>
                  {cat.icon}
                </div>
                <span className="text-[17px] font-semibold text-gray-900 flex-1 text-left">{cat.name}</span>
                <ChevRight />
              </button>
            ))
          )}
        </div>
      </div>
    );
  }

  /* ═══ SCREEN: Scan History ═══ */
  if (screen === "scanHistory") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 z-50 flex items-center justify-between px-4 py-4 bg-white border-b border-gray-100">
          <BackButton onClick={() => setScreen("home")} />
          <h2 className="text-lg font-bold text-gray-900">Scan History</h2>
          <button className="text-bobby-teal-dark font-semibold text-sm">Clear</button>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-3.5">
            {SCAN_HISTORY_ITEMS.map((item, i) => (
              <div key={i} className="rounded-2xl bg-white shadow-sm overflow-hidden border border-gray-100">
                <div className="h-[180px] relative">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                  <div className="absolute top-2.5 left-2.5 w-[32px] h-[32px] rounded-full flex items-center justify-center" style={{ background: item.approved ? "#0D9488" : "#EF4444" }}>
                    <span className="text-white font-black text-[13px]">B</span>
                  </div>
                  <button className="absolute top-2.5 right-2.5 w-9 h-9 rounded-full bg-gray-200/70 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>
                  </button>
                </div>
                <div className="p-3">
                  <p className="text-[13px] font-semibold text-gray-800 leading-snug">{item.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ═══ SCREEN: My Lists ═══ */
  if (screen === "myLists") {
    return (
      <div className="min-h-screen bg-white">
        <div className="sticky top-0 z-50 flex items-center justify-between px-4 py-4 bg-white border-b border-gray-100">
          <BackButton onClick={() => setScreen("home")} />
          <h2 className="text-lg font-bold text-gray-900">My Lists</h2>
          <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2"><path d="M12 5v14m-7-7h14" /></svg>
          </button>
        </div>
        <div className="px-4 pt-6">
          <p className="text-gray-500 font-semibold text-sm mb-2">Default Lists</p>
          <button className="w-full flex items-center justify-between py-4 border-b border-gray-100">
            <span className="text-[16px] font-semibold text-gray-900">My Favorites</span>
            <ChevRight />
          </button>
          <button className="w-full flex items-center justify-between py-4 border-b border-gray-100">
            <span className="text-[16px] font-semibold text-gray-900">Shopping List</span>
            <ChevRight />
          </button>
        </div>
        <div className="mx-4 mt-6 border border-gray-200 rounded-2xl p-6 text-center">
          <h3 className="font-bold text-gray-900 text-[17px] mb-2">Create Your First Custom List!</h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-5">Organize your favorite products your way. Start a custom list for your next grocery trip or meal plan.</p>
          <button className="w-full bg-bobby-teal text-white font-bold text-sm py-3.5 rounded-full flex items-center justify-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14m-7-7h14" /></svg>
            Create new list
          </button>
        </div>
      </div>
    );
  }

  /* ═══ SCREEN: HOME ═══ */
  return (
    <div className="min-h-screen bg-gradient-to-b from-bobby-teal via-bobby-teal-light to-white">
      <div className="flex items-center gap-2 px-4 pt-12 pb-2">
        <button onClick={() => setScreen("scanHistory")} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
          {/* Clock with counter-clockwise arrow (scan history) */}
          <svg viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M3.5 2v5h5" />
            <path d="M3.5 7a9 9 0 1 1-.87 4.26" />
            <polyline points="12,7 12,12 16,14" />
          </svg>
        </button>
        <button onClick={() => setScreen("myLists")} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
          {/* Document with heart (my lists) */}
          <svg viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14,2 14,8 20,8" />
            <line x1="8" y1="13" x2="16" y2="13" />
            <line x1="8" y1="17" x2="12" y2="17" />
            <path d="M16.5 17.5c.8-.8.8-2 0-2.8s-2-.8-2.8 0l-.7.7-.7-.7c-.8-.8-2-.8-2.8 0s-.8 2 0 2.8l3.5 3.5 3.5-3.5z" fill="#4B5563" stroke="none" />
          </svg>
        </button>
      </div>

      {allergenBanner}

      {/* Bobby's Shopping Lists */}
      <div className="mx-3 mb-4 rounded-2xl px-4 py-5" style={{ background: "linear-gradient(135deg, #E0F7F5, #CCFBF1, #B2F5EA)" }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-900 text-base">Bobby&apos;s Shopping Lists</h3>
          <button onClick={() => setScreen("shoppingLists")} className="text-bobby-teal-dark text-sm font-semibold flex items-center gap-0.5">See all <ChevRight /></button>
        </div>
        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-1">
          {STORE_LOGOS.map((s, i) => <button key={`store-${i}`} onClick={() => { setPrevScreen("home"); setSelectedCategory({ name: s.name.replace(/\n/g, " "), icon: null, products: STORE_APPROVED_ITEMS }); setScreen("categoryDetail"); }}><StoreLogo store={s} size={72} /></button>)}
          {STORE_CATEGORIES.map((cat, i) => (
            <button key={`cat-${i}`} onClick={() => { setPrevScreen("home"); setSelectedCategory({ name: cat.name, icon: cat.icon, products: CATEGORY_PRODUCTS[cat.name] || [] }); setScreen("categoryDetail"); }} className="flex flex-col items-center gap-1.5 flex-shrink-0" style={{ minWidth: 72 }}>
              <div className="w-[72px] h-[72px] rounded-full flex items-center justify-center" style={{ background: "#0D9488" }}>
                {cat.icon}
              </div>
              <span className="text-[11px] text-gray-700 font-semibold text-center leading-tight" style={{ width: 82 }}>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Shop Your Favorite Stores */}
      <div className="mx-3 mb-4 rounded-2xl px-4 py-5" style={{ background: "linear-gradient(135deg, #E0F7F5, #D5F5F0, #CCFBF1)" }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-900 text-base">Shop Your Favorite Stores</h3>
          <button onClick={() => setScreen("allStores")} className="text-bobby-teal-dark text-sm font-semibold flex items-center gap-0.5">See all <ChevRight /></button>
        </div>
        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-1">{FAVORITE_STORES.map((s, i) => <button key={i} onClick={() => { setSelectedStoreName(s.name.replace(/\n/g, " ")); setScreen("allProducts"); }}><StoreLogo store={s} size={72} /></button>)}</div>
      </div>

      {/* Current Promos */}
      <div className="mx-3 mb-4 rounded-2xl px-4 py-5" style={{ background: "linear-gradient(135deg, #FEF9C3, #FDE68A)" }}>
        <h3 className="font-bold text-gray-900 text-base mb-3">Current Promos</h3>
        <div className="flex gap-3.5 overflow-x-auto hide-scrollbar pb-1">
          {PROMOS.map((p, i) => (
            <div key={i} className="min-w-[270px] rounded-2xl p-4 flex flex-col gap-2 flex-shrink-0 border-2" style={{ background: `${p.color}12`, borderColor: `${p.color}40` }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: p.color }}>
                <span className="text-white font-extrabold text-[11px]">{p.brand.split(" ")[0]}</span>
              </div>
              <h4 className="font-extrabold text-gray-900 text-[15px]">{p.brand}</h4>
              <p className="text-gray-600 text-[13px]">{p.deal}</p>
              <code className="font-extrabold text-[13px] px-3 py-1 rounded-lg w-fit" style={{ background: `${p.color}20`, color: p.color }}>{p.code}</code>
              {p.url ? (
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-white font-bold text-[13px] px-4 py-2 rounded-xl w-fit flex items-center gap-1.5" style={{ backgroundColor: p.color }}>
                  Shop {p.brand.split(" ")[0]}
                  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6m4-3h6v6m-11 5L21 3" /></svg>
                </a>
              ) : (
                <span className="text-white font-bold text-[13px] px-4 py-2 rounded-xl w-fit" style={{ backgroundColor: p.color }}>Shop {p.brand.split(" ")[0]}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Shop Smart by Aisle */}
      <div className="mx-3 mb-4 rounded-2xl px-4 py-5" style={{ background: "linear-gradient(135deg, #FCE7F3, #FBCFE8, #F9A8D4)" }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-900 text-base">Shop Smart by Aisle</h3>
          <button onClick={() => setScreen("allProducts")} className="text-bobby-teal-dark text-sm font-semibold flex items-center gap-0.5">See all <ChevRight /></button>
        </div>
        <div className="flex gap-3.5 overflow-x-auto hide-scrollbar pb-1">
          {AISLE_CATEGORIES.map((cat) => (
            <button onClick={() => setScreen("allProducts")} key={cat.name} className="flex-shrink-0 text-left">
              <div className="w-[125px] h-[110px] rounded-2xl overflow-hidden border-[2.5px] border-bobby-teal shadow-sm bg-white">
                <img src={cat.img} alt={cat.name.replace(/\n/g, " ")} className="w-full h-full object-cover" />
              </div>
              <p className="text-xs text-gray-900 font-bold mt-2 text-center leading-tight whitespace-pre-line">{cat.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Bobby Chef Emoji */}
      <div className="flex justify-end px-6 -mb-5 relative z-10">
        <div className="w-[65px] h-[65px] rounded-full flex items-center justify-center shadow-lg" style={{ background: "linear-gradient(135deg, #0D9488, #14B8A6)" }}>
          <span className="text-[32px]">👨‍🍳</span>
        </div>
      </div>

      {/* Shop FlavCity Products */}
      <div className="mx-3 mb-4 rounded-2xl px-4 py-5" style={{ background: "linear-gradient(135deg, #CCFBF1, #B2F5EA, #99F6E4)" }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-900 text-base">Shop FlavCity</h3>
          <button onClick={() => setScreen("shopFlavCity")} className="text-bobby-teal-dark text-sm font-semibold flex items-center gap-0.5">See all <ChevRight /></button>
        </div>
        <div className="flex gap-3.5 overflow-x-auto hide-scrollbar pb-1">
          {FLAV_PRODUCTS.slice(0, 5).map((p, i) => (
            <div key={i} className="min-w-[165px] rounded-2xl bg-white shadow-sm overflow-hidden flex-shrink-0">
              <div className="h-[130px] flex items-center justify-center relative" style={{ background: `linear-gradient(135deg, ${p.c1}22, ${p.c2}33)` }}>
                <img src={p.img} alt={p.name} className="w-full h-full object-contain p-2" />
                <div className="absolute top-2 left-2 w-[26px] h-[26px] rounded-full flex items-center justify-center" style={{ background: "#0D9488" }}>
                  <span className="text-white font-black text-[11px]">B</span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); setFlavLikes((prev) => ({ ...prev, [i]: !prev[i] })); }} className="absolute top-2 right-2 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill={flavLikes[i] ? "#ef4444" : "none"} stroke={flavLikes[i] ? "#ef4444" : "#bbb"} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>
                </button>
              </div>
              <div className="p-2.5"><p className="text-[11px] font-semibold text-gray-700 leading-snug">{p.name}</p></div>
            </div>
          ))}
        </div>
      </div>

      {/* Demo Products */}
      <div className="mx-4 mb-6 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-900 text-sm mb-2">Demo Products</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { name: "Heinz Ketchup", barcode: "013000006408" },
            { name: "Cheez-It Crackers", barcode: "038000138416" },
            { name: "Coca-Cola", barcode: "049000006582" },
            { name: "Doritos", barcode: "028400090971" },
            { name: "Olive Oil", barcode: "041196010107" },
            { name: "Organic Oats", barcode: "021130126026" },
          ].map((item) => (
            <Link key={item.barcode} href={`/result/${item.barcode}`} className="bg-gray-50 rounded-xl px-3 py-2 text-xs text-gray-600 hover:bg-bobby-teal-50 transition-colors">
              {item.name}
            </Link>
          ))}
        </div>
      </div>
      <div className="h-5" />
    </div>
  );
}
