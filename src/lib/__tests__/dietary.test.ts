import { describe, it, expect } from "vitest";
import { checkDietaryConflicts } from "../dietary";
import type { Product, UserProfile } from "@/types";

// Minimal helper — keeps fixtures concise
function makeProduct(overrides: Partial<Product>): Product {
  return {
    barcode: "000000000000",
    product_name: "Test Product",
    brand: "Test Brand",
    image: "/test.jpg",
    ingredients: [],
    category: "Snacks",
    ...overrides,
  };
}

const emptyProfile: UserProfile = {
  allergies: [],
  restrictions: [],
  preferences: [],
};

describe("checkDietaryConflicts", () => {
  // 1. Empty profile → no conflicts
  it("returns no conflicts for an empty user profile", () => {
    // Arrange
    const product = makeProduct({
      ingredients: ["High Fructose Corn Syrup", "Soybean Oil", "Wheat Flour"],
    });

    // Act
    const result = checkDietaryConflicts(product, emptyProfile);

    // Assert
    expect(result).toHaveLength(0);
  });

  // 2. Gluten allergy + wheat ingredient
  it("detects gluten conflict when product contains semolina/wheat", () => {
    // Arrange — based on Barilla Thin Spaghetti
    const product = makeProduct({
      product_name: "Thin Spaghetti",
      ingredients: ["Semolina (Wheat)", "Durum Wheat Flour"],
      category: "Pasta",
    });
    const profile: UserProfile = {
      allergies: ["gluten"],
      restrictions: [],
      preferences: [],
    };

    // Act
    const result = checkDietaryConflicts(product, profile);

    // Assert
    expect(result).toHaveLength(1);
    expect(result[0].ruleKey).toBe("gluten");
    expect(result[0].conflictingIngredients).toContain("Semolina (Wheat)");
  });

  // 3. Dairy allergy + milk product
  it("detects dairy conflict for Kroger 2% Reduced Fat Milk", () => {
    // Arrange
    const product = makeProduct({
      product_name: "2% Reduced Fat Milk",
      ingredients: ["Reduced Fat Milk", "Vitamin A Palmitate", "Vitamin D3"],
      category: "Dairy",
    });
    const profile: UserProfile = {
      allergies: ["dairy"],
      restrictions: [],
      preferences: [],
    };

    // Act
    const result = checkDietaryConflicts(product, profile);

    // Assert
    const dairyConflict = result.find((c) => c.ruleKey === "dairy");
    expect(dairyConflict).toBeDefined();
    expect(dairyConflict!.conflictingIngredients).toContain("Reduced Fat Milk");
  });

  // 4. Vegan restriction + honey
  it("detects vegan conflict for a product containing honey", () => {
    // Arrange — based on Nature Nate's Raw Organic Honey
    const product = makeProduct({
      product_name: "Raw Organic Honey",
      ingredients: ["Organic Raw Honey"],
      category: "Sweeteners",
    });
    const profile: UserProfile = {
      allergies: [],
      restrictions: ["vegan"],
      preferences: [],
    };

    // Act
    const result = checkDietaryConflicts(product, profile);

    // Assert
    const veganConflict = result.find((c) => c.ruleKey === "vegan");
    expect(veganConflict).toBeDefined();
    expect(veganConflict!.conflictingIngredients).toContain("Organic Raw Honey");
  });

  // 5. Keto restriction + Oreo (sugar + HFCS + wheat flour)
  it("captures multiple conflicting ingredients for keto restriction", () => {
    // Arrange — based on Oreo ingredients
    const product = makeProduct({
      product_name: "Oreo Chocolate Sandwich Cookies",
      ingredients: [
        "Unbleached Enriched Wheat Flour",
        "Sugar",
        "Palm Oil",
        "Canola Oil",
        "High Fructose Corn Syrup",
        "Cornstarch",
      ],
    });
    const profile: UserProfile = {
      allergies: [],
      restrictions: ["keto"],
      preferences: [],
    };

    // Act
    const result = checkDietaryConflicts(product, profile);

    // Assert
    const ketoConflict = result.find((c) => c.ruleKey === "keto");
    expect(ketoConflict).toBeDefined();
    expect(ketoConflict!.conflictingIngredients.length).toBeGreaterThanOrEqual(2);
    expect(ketoConflict!.conflictingIngredients).toContain("Sugar");
    expect(ketoConflict!.conflictingIngredients).toContain("High Fructose Corn Syrup");
  });

  // 6. No seed oils preference + Doritos
  it("detects no_seed_oils conflict for Doritos sunflower/canola oil", () => {
    // Arrange
    const product = makeProduct({
      product_name: "Doritos Nacho Cheese",
      ingredients: [
        "Corn",
        "Vegetable Oil (Sunflower Oil, Canola Oil)",
        "Salt",
      ],
    });
    const profile: UserProfile = {
      allergies: [],
      restrictions: [],
      preferences: ["no_seed_oils"],
    };

    // Act
    const result = checkDietaryConflicts(product, profile);

    // Assert
    const seedOilConflict = result.find((c) => c.ruleKey === "no_seed_oils");
    expect(seedOilConflict).toBeDefined();
  });

  // 7. Active rule but no matching ingredients → no conflict
  it("returns no conflict when active rule has no matching ingredients in product", () => {
    // Arrange — peanut allergy but product has none
    const product = makeProduct({
      product_name: "Yellow Mustard",
      ingredients: ["Distilled Vinegar", "Water", "Mustard Seed", "Salt", "Turmeric"],
    });
    const profile: UserProfile = {
      allergies: ["peanuts"],
      restrictions: [],
      preferences: [],
    };

    // Act
    const result = checkDietaryConflicts(product, profile);

    // Assert
    expect(result).toHaveLength(0);
  });
});
