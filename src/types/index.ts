export interface Product {
  barcode: string;
  product_name: string;
  brand: string;
  image: string;
  ingredients: string[];
  category: string;
}

export interface UserProfile {
  allergies: string[];
  restrictions: string[];
  preferences: string[];
}

export interface ApprovalResult {
  approved: boolean;
  flaggedIngredients: string[];
}

export interface DietaryConflict {
  ruleName: string;
  ruleKey: string;
  conflictingIngredients: string[];
}

export interface ScanResult {
  product: Product;
  approval: ApprovalResult;
  conflicts: DietaryConflict[];
}
