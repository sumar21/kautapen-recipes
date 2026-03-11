export interface Lodge {
  id: string;
  name: string;
}

export type UnitType = 'KG' | 'L' | 'ML' | 'G' | 'Unit' | 'Box' | 'Bottle' | 'Can' | 'Jar' | 'Sack';

export interface Ingredient {
  id: string;
  lodgeId: string;
  name: string;
  category: string;
  purchaseUnit: UnitType;
  baseUnit: UnitType;
  quantityPerUnit: number; // e.g. 0.75 for 750ml bottle
  price: number; // Price per purchase unit
}

// Helper for UI: Cost per base unit (calculated)
export interface IngredientWithCost extends Ingredient {
  costPerBaseUnit: number;
}

export interface RecipeIngredient {
  id: string; // unique link id
  ingredientId: string;
  recipeQuantity: number; // Total quantity for the batch
}

export interface Recipe {
  id: string;
  lodgeId: string;
  name: string;
  type: 'Appetizer' | 'Principal' | 'Optional' | 'Dessert';
  service: 'Breakfast' | 'Lunch' | 'Dinner' | 'Lunch / Dinner';
  day: number | string;
  portionSizeGr: number;
  yield: number; // Number of servings this recipe batch creates
  ingredients: RecipeIngredient[];
}