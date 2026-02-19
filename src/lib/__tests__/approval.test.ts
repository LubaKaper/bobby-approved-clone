import { describe, it, expect } from "vitest";
import { checkBobbyApproval } from "../approval";
import type { Product } from "@/types";

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

describe("checkBobbyApproval", () => {
  // 1. Clean product
  it("approves a product with no flagged ingredients", () => {
    // Arrange
    const product = makeProduct({
      product_name: "Organic Extra Virgin Olive Oil",
      ingredients: ["Organic Extra Virgin Olive Oil"],
      category: "Oils & Vinegars",
    });

    // Act
    const result = checkBobbyApproval(product);

    // Assert
    expect(result.approved).toBe(true);
    expect(result.flaggedIngredients).toHaveLength(0);
    expect(result.heuristicFlags).toHaveLength(0);
  });

  // 2. Single hard flagged ingredient
  it("flags a product with High Fructose Corn Syrup", () => {
    // Arrange
    const product = makeProduct({
      product_name: "Heinz Tomato Ketchup",
      ingredients: [
        "Tomato Concentrate",
        "Distilled Vinegar",
        "High Fructose Corn Syrup",
        "Salt",
      ],
    });

    // Act
    const result = checkBobbyApproval(product);

    // Assert
    expect(result.approved).toBe(false);
    expect(result.flaggedIngredients).toContain("High Fructose Corn Syrup");
  });

  // 3. Multiple flagged ingredients
  it("captures all flagged ingredients from Doritos", () => {
    // Arrange
    const product = makeProduct({
      product_name: "Doritos Nacho Cheese",
      ingredients: [
        "Corn",
        "Vegetable Oil (Sunflower Oil, Canola Oil)",
        "Maltodextrin",
        "Salt",
        "Monosodium Glutamate",
        "Red 40",
        "Yellow 6",
        "Yellow 5",
      ],
    });

    // Act
    const result = checkBobbyApproval(product);

    // Assert
    expect(result.approved).toBe(false);
    expect(result.flaggedIngredients.length).toBeGreaterThanOrEqual(4);
    expect(result.flaggedIngredients).toContain("Red 40");
    expect(result.flaggedIngredients).toContain("Yellow 6");
    expect(result.flaggedIngredients).toContain("Monosodium Glutamate");
  });

  // 4. Substring matching — compound ingredient string
  it("flags via substring match inside a compound ingredient string", () => {
    // Arrange — "Vegetable Oil (Soybean Oil, Palm Oil)" contains "soybean oil"
    const product = makeProduct({
      ingredients: ["Enriched Wheat Flour", "Vegetable Oil (Soybean Oil, Palm Oil)", "Salt"],
    });

    // Act
    const result = checkBobbyApproval(product);

    // Assert
    expect(result.approved).toBe(false);
    expect(result.flaggedIngredients).toContain(
      "Vegetable Oil (Soybean Oil, Palm Oil)"
    );
  });

  // 5. New caramel color + natural flavor rules
  it("flags caramel color and natural flavor (newly added rules)", () => {
    // Arrange — based on Sweet Baby Ray's
    const product = makeProduct({
      product_name: "Original Barbecue Sauce",
      ingredients: [
        "High Fructose Corn Syrup",
        "Caramel Color",
        "Sodium Benzoate",
        "Natural Flavor",
      ],
    });

    // Act
    const result = checkBobbyApproval(product);

    // Assert
    expect(result.flaggedIngredients).toContain("Caramel Color");
    expect(result.flaggedIngredients).toContain("Natural Flavor");
  });

  // 6. Enriched grain heuristic — Barilla Thin Spaghetti (all 5 markers)
  it("sets enriched_grain heuristic flag when 2+ enrichment markers are present", () => {
    // Arrange
    const product = makeProduct({
      product_name: "Thin Spaghetti",
      ingredients: [
        "Semolina (Wheat)",
        "Durum Wheat Flour",
        "Vitamin B3 (Niacin)",
        "Iron (Ferrous Sulfate)",
        "Vitamin B1 (Thiamine Mononitrate)",
        "Vitamin B2 (Riboflavin)",
        "Folic Acid",
      ],
      category: "Pasta",
    });

    // Act
    const result = checkBobbyApproval(product);

    // Assert
    const enrichedFlag = result.heuristicFlags?.find(
      (f) => f.ruleId === "enriched_grain"
    );
    expect(enrichedFlag).toBeDefined();
    expect(enrichedFlag!.ingredients.length).toBeGreaterThanOrEqual(5);
  });

  // 7. Non-organic wheat heuristic fires for Pasta category
  it("sets non_organic_wheat_heuristic for non-organic Pasta products with wheat", () => {
    // Arrange
    const product = makeProduct({
      product_name: "Thin Spaghetti",
      ingredients: ["Semolina (Wheat)", "Durum Wheat Flour"],
      category: "Pasta",
    });

    // Act
    const result = checkBobbyApproval(product);

    // Assert
    const wheatFlag = result.heuristicFlags?.find(
      (f) => f.ruleId === "non_organic_wheat_heuristic"
    );
    expect(wheatFlag).toBeDefined();
    expect(wheatFlag!.ingredients).toContain("Semolina (Wheat)");
  });

  // 8. Wheat heuristic does NOT fire for non-Pasta/Grains categories
  it("does not set wheat heuristic for Snacks category even with wheat ingredients", () => {
    // Arrange — Cheez-It has wheat flour but is Snacks
    const product = makeProduct({
      product_name: "Cheez-It Original Crackers",
      ingredients: ["Enriched Wheat Flour", "Soybean Oil", "Cheese"],
      category: "Snacks",
    });

    // Act
    const result = checkBobbyApproval(product);

    // Assert
    const wheatFlag = result.heuristicFlags?.find(
      (f) => f.ruleId === "non_organic_wheat_heuristic"
    );
    expect(wheatFlag).toBeUndefined();
  });
});
