"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
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
  { name: "Walmart", bg: "#0071DC", logo: "/images/stores/walmart.png" },
  { name: "Whole Foods", bg: "#00674B", logo: "/images/stores/wholefoods.png" },
  { name: "Trader Joe's", bg: "#C8102E", logo: "/images/stores/traderjoes.png" },
  { name: "Thrive Mkt", bg: "#1B7742", logo: "/images/stores/thrive.png" },
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
  { name: "Essential Drink Mix, Lemonade Variety Pack", emoji: "🍋", c1: "#FF6B6B", c2: "#FFE66D" },
  { name: "Vanilla Cream Protein Smoothie", emoji: "🥛", c1: "#F5E6D3", c2: "#E8D5B7" },
  { name: "Electrolyte Drink Mix, Lemon Lime", emoji: "🍈", c1: "#84CC16", c2: "#A3E635" },
  { name: "Protein Smoothie, Butter Coffee", emoji: "☕", c1: "#A16207", c2: "#CA8A04" },
  { name: "Protein Smoothie, Chocolate PB", emoji: "🍫", c1: "#78350F", c2: "#A16207" },
  { name: "Sleep Support Gummy", emoji: "🌙", c1: "#4338CA", c2: "#6366F1" },
  { name: "Vitamin C", emoji: "🍊", c1: "#EA580C", c2: "#F97316" },
  { name: "Immunity Tea, Lemon Ginger", emoji: "🍵", c1: "#CA8A04", c2: "#EAB308" },
  { name: "Keto Lemonade, Pink Grapefruit", emoji: "🍊", c1: "#EC4899", c2: "#F472B6" },
  { name: "Strawberry Limeade Electrolyte", emoji: "🍓", c1: "#E11D48", c2: "#FB7185" },
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

type Screen = "home" | "shoppingLists" | "allStores" | "allProducts" | "shopFlavCity";

export default function HomePage() {
  const [bannerVisible, setBannerVisible] = useState(true);
  const [profileCount, setProfileCount] = useState(0);
  const [screen, setScreen] = useState<Screen>("home");
  const [flavLikes, setFlavLikes] = useState<Record<number, boolean>>({});
  const [storeSearch, setStoreSearch] = useState("");

  useEffect(() => {
    const profile = getUserProfile();
    setProfileCount(profile.allergies.length + profile.restrictions.length);
  }, []);

  const filteredStores = useMemo(() => {
    if (!storeSearch.trim()) return ALL_STORES;
    const q = storeSearch.toLowerCase();
    return ALL_STORES.filter((s) => s.name.toLowerCase().replace(/\n/g, " ").includes(q));
  }, [storeSearch]);

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

  /* ═══ SCREEN: Shopping Lists ═══ */
  if (screen === "shoppingLists") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 z-50 px-4 pt-4 pb-3" style={{ background: "linear-gradient(180deg, #B2F5EA, #E0F7F5)" }}>
          <div className="flex items-center gap-3 mb-3">
            <BackButton onClick={() => { setScreen("home"); setStoreSearch(""); }} />
            <h2 className="text-lg font-bold text-gray-900">Bobby&apos;s Shopping Lists</h2>
          </div>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="Search stores..." value={storeSearch} onChange={(e) => setStoreSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400" />
          </div>
        </div>
        {allergenBanner}
        <div className="p-4">
          {filteredStores.length === 0 ? (
            <div className="text-center py-12"><span className="text-4xl block mb-2">😕</span><p className="text-gray-500 text-sm">No stores found</p></div>
          ) : (
            <div className="grid grid-cols-3 gap-5">{filteredStores.map((store, i) => <StoreLogo key={i} store={store} size={80} />)}</div>
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
          <div className="grid grid-cols-3 gap-5">{ALL_STORES.map((store, i) => <StoreLogo key={i} store={store} size={80} />)}</div>
        </div>
      </div>
    );
  }

  /* ═══ SCREEN: All Products ═══ */
  if (screen === "allProducts") {
    return (
      <div className="min-h-screen bg-white">
        <div className="sticky top-0 z-50 flex items-center gap-3 px-4 py-4 bg-white border-b border-gray-100">
          <BackButton onClick={() => setScreen("home")} />
          <h2 className="text-lg font-bold text-gray-900">All Products</h2>
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
                <div className="h-[140px] flex items-center justify-center text-[52px] relative" style={{ background: `linear-gradient(135deg, ${p.c1}22, ${p.c2}33)` }}>
                  {p.emoji}
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

  /* ═══ SCREEN: HOME ═══ */
  return (
    <div className="min-h-screen bg-gradient-to-b from-bobby-teal via-bobby-teal-light to-white">
      <div className="flex items-center gap-2 px-4 pt-12 pb-2">
        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth={2} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </button>
        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth={2} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
        </button>
      </div>

      {allergenBanner}

      {/* Bobby's Shopping Lists */}
      <div className="mx-3 mb-4 rounded-2xl px-4 py-5" style={{ background: "linear-gradient(135deg, #E0F7F5, #CCFBF1, #B2F5EA)" }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-900 text-base">Bobby&apos;s Shopping Lists</h3>
          <button onClick={() => setScreen("shoppingLists")} className="text-bobby-teal-dark text-sm font-semibold flex items-center gap-0.5">See all <ChevRight /></button>
        </div>
        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-1">{STORE_LOGOS.map((s, i) => <StoreLogo key={i} store={s} size={72} />)}</div>
      </div>

      {/* Shop Your Favorite Stores */}
      <div className="mx-3 mb-4 rounded-2xl px-4 py-5" style={{ background: "linear-gradient(135deg, #E0F7F5, #D5F5F0, #CCFBF1)" }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-900 text-base">Shop Your Favorite Stores</h3>
          <button onClick={() => setScreen("allStores")} className="text-bobby-teal-dark text-sm font-semibold flex items-center gap-0.5">See all <ChevRight /></button>
        </div>
        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-1">{FAVORITE_STORES.map((s, i) => <StoreLogo key={i} store={s} size={72} />)}</div>
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

      {/* FlavCity Café Banner */}
      <a href="https://www.shopflavcity.com/pages/cafe" target="_blank" rel="noopener noreferrer" className="block mx-4 mb-4">
        <div className="rounded-2xl border-[3px] border-teal-300/40 bg-white p-5 flex items-center gap-4 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 80% 20%, rgba(13,148,136,0.06), transparent 60%)" }} />
          <div className="w-[75px] h-[75px] rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #0D9488, #14B8A6)" }}>
            <div className="text-center">
              <span className="text-white font-black text-[10px] block">FLAV</span>
              <span className="text-yellow-300 font-black text-[10px] block">CITY</span>
              <span className="text-white font-semibold text-[7px]">Café</span>
            </div>
          </div>
          <div className="flex-1 relative z-10">
            <h3 className="font-extrabold text-gray-900 text-[17px]">FlavCity Café</h3>
            <span className="inline-flex items-center gap-1.5 text-white rounded-full px-4 py-1.5 font-bold text-xs mt-1.5" style={{ background: "#0D9488" }}>
              Shop FlavCity Café
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6m4-3h6v6m-11 5L21 3" /></svg>
            </span>
            <p className="text-gray-500 text-xs mt-1.5">15% off + free gift: <strong className="text-teal-600">CAFEAPP15</strong></p>
          </div>
        </div>
      </a>

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
              <div className="h-[130px] flex items-center justify-center text-[48px] relative" style={{ background: `linear-gradient(135deg, ${p.c1}22, ${p.c2}33)` }}>
                {p.emoji}
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
