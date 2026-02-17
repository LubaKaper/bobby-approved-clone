"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getUserProfile, saveUserProfile } from "@/lib/profile";
import { UserProfile } from "@/types";

const ALLERGENS = [
  "Other", "Oat", "Soy", "Corn", "Barley", "Rye",
  "Wheat", "Gluten", "Eggs", "Peanuts", "Mollusks", "Tree nuts",
  "Sesame", "Fish", "Shellfish", "Coconut", "Almonds", "Milk/Dairy",
  "Allium", "Red Meat",
];

const EATING_HABITS = [
  "Grass-Fed", "Vegan", "Organic", "Pescatarian",
  "Paleo", "Low sugar", "Keto", "Carnivore",
  "Non-GMO", "Other", "Vegetarian", "Pasture raised",
  "Low carb",
];

// Map display names to dietary rule keys
const ALLERGEN_KEY_MAP: Record<string, string> = {
  "Gluten": "gluten",
  "Milk/Dairy": "dairy",
  "Eggs": "eggs",
  "Peanuts": "peanuts",
  "Tree nuts": "tree_nuts",
  "Soy": "soy",
  "Fish": "fish",
  "Shellfish": "shellfish",
  "Wheat": "wheat",
  "Barley": "barley",
  "Rye": "rye",
  "Oat": "oat",
  "Corn": "corn",
  "Sesame": "sesame",
  "Coconut": "coconut",
  "Almonds": "almonds",
  "Mollusks": "mollusks",
  "Allium": "allium",
  "Red Meat": "red_meat",
  "Other": "other_allergen",
};

const HABIT_KEY_MAP: Record<string, string> = {
  "Vegan": "vegan",
  "Keto": "keto",
  "Low sugar": "no_added_sugar",
  "Low carb": "low_carb",
  "Vegetarian": "vegetarian",
  "Pescatarian": "pescatarian",
  "Paleo": "paleo",
  "Carnivore": "carnivore",
  "Grass-Fed": "grass_fed",
  "Organic": "organic",
  "Non-GMO": "non_gmo",
  "Pasture raised": "pasture_raised",
  "Other": "other_habit",
};

export default function ProfilePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedAllergens, setSelectedAllergens] = useState<Set<string>>(new Set());
  const [selectedHabits, setSelectedHabits] = useState<Set<string>>(new Set());

  useEffect(() => {
    const profile = getUserProfile();
    // Reverse-map saved keys back to display names
    const allergenNames = new Set<string>();
    for (const [name, key] of Object.entries(ALLERGEN_KEY_MAP)) {
      if (profile.allergies.includes(key)) allergenNames.add(name);
    }
    setSelectedAllergens(allergenNames);

    const habitNames = new Set<string>();
    for (const [name, key] of Object.entries(HABIT_KEY_MAP)) {
      if (profile.restrictions.includes(key) || profile.preferences.includes(key)) {
        habitNames.add(name);
      }
    }
    setSelectedHabits(habitNames);
  }, []);

  const toggleAllergen = (name: string) => {
    setSelectedAllergens((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const toggleHabit = (name: string) => {
    setSelectedHabits((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const handleSave = () => {
    const allergies = Array.from(selectedAllergens)
      .map((name) => ALLERGEN_KEY_MAP[name])
      .filter(Boolean);

    const restrictions: string[] = [];
    const preferences: string[] = [];

    for (const name of selectedHabits) {
      const key = HABIT_KEY_MAP[name];
      if (!key) continue;
      if (["vegan", "keto", "vegetarian", "pescatarian", "paleo", "carnivore", "low_carb"].includes(key)) {
        restrictions.push(key);
      } else {
        preferences.push(key);
      }
    }

    const profile: UserProfile = { allergies, restrictions, preferences };
    saveUserProfile(profile);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-bobby-teal to-bobby-teal-light px-4 pt-12 pb-8">
        <button
          onClick={() => (step === 2 ? setStep(1) : router.back())}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth={2} className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        {/* Bobby avatar + speech bubble */}
        <div className="flex items-start justify-center gap-3 mt-2">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0 shadow-md">
            <Image src="/bobby-avatar.svg" alt="Bobby" width={96} height={96} className="w-full h-full object-cover" />
          </div>

          {/* Speech bubble */}
          <div className="relative bg-white rounded-2xl px-4 py-3 mt-2 shadow-sm max-w-[200px]">
            <div className="absolute left-[-8px] top-4 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[8px] border-r-white" />
            <p className="text-xs text-gray-600 leading-snug">
              Before we start, 5 quick questions to customize the app just for you.
            </p>
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mt-4 mb-2">
          <div className={`h-2 rounded-full transition-all ${step === 1 ? "w-6 bg-bobby-teal-dark" : "w-2 bg-bobby-teal-dark/40"}`} />
          <div className={`h-2 rounded-full transition-all ${step === 2 ? "w-6 bg-bobby-teal-dark" : "w-2 bg-bobby-teal-dark/40"}`} />
          <div className="w-2 h-2 rounded-full bg-bobby-teal-dark/40" />
          <div className="w-2 h-2 rounded-full bg-bobby-teal-dark/40" />
          <div className="w-2 h-2 rounded-full bg-bobby-teal-dark/40" />
        </div>
      </div>

      <div className="px-5 py-6 pb-32">
        {step === 1 ? (
          <>
            <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">
              Do you avoid any of these allergens?
            </h1>
            <div className="grid grid-cols-3 gap-2.5">
              {ALLERGENS.map((name) => {
                const isSelected = selectedAllergens.has(name);
                return (
                  <button
                    key={name}
                    onClick={() => toggleAllergen(name)}
                    className={`py-3 px-2 rounded-full border-2 text-sm font-medium transition-all ${
                      isSelected
                        ? "bg-bobby-teal-dark border-bobby-teal-dark text-white"
                        : "bg-white border-bobby-teal text-bobby-teal-dark"
                    }`}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">
              What eating habits do you follow?
            </h1>
            <div className="grid grid-cols-2 gap-2.5">
              {EATING_HABITS.map((name) => {
                const isSelected = selectedHabits.has(name);
                return (
                  <button
                    key={name}
                    onClick={() => toggleHabit(name)}
                    className={`py-3.5 px-3 rounded-full border-2 text-sm font-medium transition-all ${
                      isSelected
                        ? "bg-bobby-teal-dark border-bobby-teal-dark text-white"
                        : "bg-white border-bobby-teal text-bobby-teal-dark"
                    }`}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Bottom button */}
      <div className="fixed bottom-16 left-0 right-0 px-5 py-4 bg-white">
        <button
          onClick={() => (step === 1 ? setStep(2) : handleSave())}
          className="w-full py-4 rounded-full bg-gradient-to-r from-bobby-teal to-bobby-teal-dark text-white font-bold text-lg"
        >
          {step === 1 ? "Continue" : "Save & Continue"}
        </button>
      </div>
    </div>
  );
}
