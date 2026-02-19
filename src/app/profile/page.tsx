"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getUserProfile, saveUserProfile } from "@/lib/profile";
import { UserProfile } from "@/types";
import { DIETARY_RULES } from "@/data/dietary-rules";

const ALLERGENS = [
  "Other", "Oat", "Soy", "Corn", "Barley", "Rye",
  "Wheat", "Gluten", "Eggs", "Peanuts", "Mollusks", "Tree nuts",
  "Sesame", "Fish", "Shellfish", "Coconut", "Almonds", "Milk/Dairy",
  "Allium", "Red Meat",
];

const ALLERGEN_DISPLAY = [
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
  // Demo profile info for display
  const demoProfile = {
    name: "",
    email: "demo123@gmail.com",
  };
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
    <div className="min-h-screen bg-white flex flex-col">
      {/* Cartoon avatar and speech bubble */}
      <div className="bg-gradient-to-b from-bobby-teal to-bobby-teal-light px-4 pt-12 pb-8 flex flex-col items-center">
        <div className="w-24 h-24 rounded-full overflow-hidden shadow-md mb-2">
          <Image src="/bobby-avatar.svg" alt="Bobby" width={96} height={96} className="w-full h-full object-cover" />
        </div>
        <div className="relative bg-white rounded-2xl px-4 py-3 shadow-sm max-w-[320px] mb-4">
          <div className="absolute left-[-8px] top-4 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[8px] border-r-white" />
          <p className="text-sm text-gray-600">Before we start, 5 quick questions to customize the app just for you.</p>
        </div>
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mt-2 mb-2">
          <div className={`h-2 rounded-full transition-all ${step === 1 ? "w-6 bg-bobby-teal-dark" : "w-2 bg-bobby-teal-dark/40"}`} />
          <div className={`h-2 rounded-full transition-all ${step === 2 ? "w-6 bg-bobby-teal-dark" : "w-2 bg-bobby-teal-dark/40"}`} />
          <div className="w-2 h-2 rounded-full bg-bobby-teal-dark/40" />
          <div className="w-2 h-2 rounded-full bg-bobby-teal-dark/40" />
          <div className="w-2 h-2 rounded-full bg-bobby-teal-dark/40" />
        </div>
      </div>

      {/* Step content and profile info below in scrollable layout */}
      <div className="flex-1 flex flex-col items-center justify-start px-4 pt-4 pb-32 overflow-y-auto">
        {/* Onboarding steps */}
        {step === 1 && (
          <>
            <h1 className="text-2xl font-bold text-center mb-6">Do you avoid any of these allergens?</h1>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3 w-full max-w-lg mb-8">
              {ALLERGEN_DISPLAY.map((name) => {
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
            <button
              onClick={() => setStep(2)}
              className="w-full max-w-lg py-4 rounded-full bg-gradient-to-r from-bobby-teal to-bobby-teal-dark text-white font-bold text-lg mb-4"
            >
              Continue
            </button>
          </>
        )}
        {step === 2 && (
          <>
            <h1 className="text-2xl font-bold text-center mb-6">What eating habits do you follow?</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full max-w-lg mb-8">
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
            <button
              onClick={handleSave}
              className="w-full max-w-lg py-4 rounded-full bg-gradient-to-r from-bobby-teal to-bobby-teal-dark text-white font-bold text-lg mb-8"
            >
              Save & Continue
            </button>
          </>
        )}

        {/* Profile info and sections always visible below */}
        <h1 className="text-2xl font-bold text-center mb-4">My Profile</h1>
        <div className="bg-white rounded-xl shadow p-4 mb-6 w-full max-w-lg mx-auto">
          <div className="flex flex-col divide-y divide-gray-200">
            <div className="flex items-center justify-between py-3">
              <span>Name</span>
              <span className="text-gray-400">{demoProfile.name || ""}</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span>Email</span>
              <span className="text-gray-400">demo123@gmail.com</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span>Change Password</span>
              <span className="text-gray-400">&gt;</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span>Additional Details</span>
              <span className="text-gray-400">&gt;</span>
            </div>
          </div>
        </div>

        {/* Personalization */}
        <div className="mb-6 w-full max-w-lg mx-auto">
          <h2 className="font-semibold text-lg mb-2">Personalization</h2>
          <div className="bg-white rounded-xl shadow divide-y divide-gray-200">
            <div className="flex items-center justify-between py-3 px-4">
              <span>My Lists</span>
              <span className="text-gray-400">&gt;</span>
            </div>
            <div className="flex items-center justify-between py-3 px-4">
              <span>Scan History</span>
              <span className="text-gray-400">&gt;</span>
            </div>
            <div className="flex items-center justify-between py-3 px-4">
              <span>Update Allergens</span>
              <span className="text-gray-400">&gt;</span>
            </div>
            <div className="flex items-center justify-between py-3 px-4">
              <span>Retake the Quiz</span>
              <span className="text-gray-400">&gt;</span>
            </div>
          </div>
        </div>

        {/* Meet Bobby */}
        <div className="mb-6 w-full max-w-lg mx-auto">
          <h2 className="font-semibold text-lg mb-2">Meet Bobby</h2>
          <div className="bg-white rounded-xl shadow divide-y divide-gray-200">
            <div className="flex items-center justify-between py-3 px-4">
              <span>Who's Bobby?</span>
              <span className="text-gray-400">&gt;</span>
            </div>
          </div>
        </div>

        {/* Help & Support */}
        <div className="mb-6 w-full max-w-lg mx-auto">
          <h2 className="font-semibold text-lg mb-2">Help & Support</h2>
          <div className="bg-white rounded-xl shadow divide-y divide-gray-200">
            <div className="flex items-center justify-between py-3 px-4">
              <span>Contact Support</span>
              <span className="text-bobby-teal font-medium">info@bobbyapproved.com</span>
            </div>
            <div className="flex items-center justify-between py-3 px-4">
              <span>Useful Links</span>
              <span className="text-gray-400">&gt;</span>
            </div>
          </div>
        </div>

        {/* Legal & Disclaimers */}
        <div className="mb-6 w-full max-w-lg mx-auto">
          <h2 className="font-semibold text-lg mb-2">Legal & Disclaimers</h2>
          <div className="bg-white rounded-xl shadow divide-y divide-gray-200">
            <div className="flex items-center justify-between py-3 px-4">
              <span>End user license agreement</span>
              <span className="text-gray-400">&gt;</span>
            </div>
            <div className="flex items-center justify-between py-3 px-4">
              <span>Non-affiliate disclosure</span>
              <span className="text-gray-400">&gt;</span>
            </div>
          </div>
        </div>

        {/* Socials and logout */}
        <div className="flex flex-col items-center gap-4 w-full max-w-lg mx-auto">
          <div className="flex gap-4 mb-2">
            <span className="rounded-full bg-gray-100 p-2"><i className="fab fa-instagram" /></span>
            <span className="rounded-full bg-gray-100 p-2"><i className="fab fa-youtube" /></span>
            <span className="rounded-full bg-gray-100 p-2"><i className="fab fa-tiktok" /></span>
            <span className="rounded-full bg-gray-100 p-2"><i className="fab fa-facebook" /></span>
          </div>
          <button className="w-full py-3 rounded-full bg-bobby-teal text-white font-bold">Logout</button>
          <button className="w-full py-2 text-red-600 font-semibold">Delete Account</button>
        </div>
      </div>
      {/* Bottom navigation remains unchanged */}
    </div>
  );
}
