import { Lodge, Ingredient, Recipe } from './types';

export const LODGES: Lodge[] = [
  { id: '1', name: 'Sumar Test' },
  { id: '2', name: 'Patagonia Lodge' },
  { id: '3', name: 'Andes High Country' },
  { id: '4', name: 'River Valley Lodge' },
];

export const MOCK_INGREDIENTS: Ingredient[] = [
  // Lodge 1: Sumar Test
  { id: '1', lodgeId: '1', name: 'Salmon', category: 'Fish & Seafood', purchaseUnit: 'KG', baseUnit: 'KG', quantityPerUnit: 1, price: 16.50 },
  { id: '2', lodgeId: '1', name: 'Baguette', category: 'Bakery', purchaseUnit: 'Unit', baseUnit: 'Unit', quantityPerUnit: 1, price: 1.20 },
  { id: '3', lodgeId: '1', name: 'Cream Cheese', category: 'Dairy', purchaseUnit: 'KG', baseUnit: 'KG', quantityPerUnit: 1, price: 8.50 },
  { id: '4', lodgeId: '1', name: 'Olive Oil', category: 'Oil', purchaseUnit: 'Bottle', baseUnit: 'ML', quantityPerUnit: 750, price: 12.00 },
  { id: '5', lodgeId: '1', name: 'Fresh Dill', category: 'Vegetables', purchaseUnit: 'KG', baseUnit: 'G', quantityPerUnit: 1000, price: 25.00 },
  { id: '6', lodgeId: '1', name: 'Capers', category: 'Dry Goods', purchaseUnit: 'Jar', baseUnit: 'G', quantityPerUnit: 200, price: 4.50 },

  // Lodge 2: Patagonia Lodge
  { id: '21', lodgeId: '2', name: 'Lamb Leg (Bone-in)', category: 'Meat', purchaseUnit: 'KG', baseUnit: 'KG', quantityPerUnit: 1, price: 14.00 },
  { id: '22', lodgeId: '2', name: 'Rosemary Fresh', category: 'Vegetables', purchaseUnit: 'KG', baseUnit: 'G', quantityPerUnit: 1000, price: 18.00 },
  { id: '23', lodgeId: '2', name: 'Red Wine (Cabernet)', category: 'Alcohol', purchaseUnit: 'Bottle', baseUnit: 'ML', quantityPerUnit: 750, price: 9.50 },
  { id: '24', lodgeId: '2', name: 'Potatoes', category: 'Vegetables', purchaseUnit: 'Sack', baseUnit: 'KG', quantityPerUnit: 25, price: 15.00 },
  { id: '25', lodgeId: '2', name: 'Garlic', category: 'Vegetables', purchaseUnit: 'KG', baseUnit: 'KG', quantityPerUnit: 1, price: 6.00 },
  { id: '26', lodgeId: '2', name: 'Butter', category: 'Dairy', purchaseUnit: 'KG', baseUnit: 'G', quantityPerUnit: 1000, price: 9.00 },

  // Lodge 3: Andes High Country
  { id: '31', lodgeId: '3', name: 'Beef Tenderloin', category: 'Meat', purchaseUnit: 'KG', baseUnit: 'KG', quantityPerUnit: 1, price: 28.00 },
  { id: '32', lodgeId: '3', name: 'Malbec Wine', category: 'Alcohol', purchaseUnit: 'Bottle', baseUnit: 'ML', quantityPerUnit: 750, price: 14.00 },
  { id: '33', lodgeId: '3', name: 'Pearl Onions', category: 'Vegetables', purchaseUnit: 'KG', baseUnit: 'KG', quantityPerUnit: 1, price: 5.50 },
  { id: '34', lodgeId: '3', name: 'Carrots', category: 'Vegetables', purchaseUnit: 'KG', baseUnit: 'KG', quantityPerUnit: 1, price: 1.80 },
  { id: '35', lodgeId: '3', name: 'Thyme', category: 'Vegetables', purchaseUnit: 'KG', baseUnit: 'G', quantityPerUnit: 1000, price: 22.00 },
  { id: '36', lodgeId: '3', name: 'Heavy Cream', category: 'Dairy', purchaseUnit: 'L', baseUnit: 'ML', quantityPerUnit: 1000, price: 4.20 },

  // Lodge 4: River Valley Lodge
  { id: '41', lodgeId: '4', name: 'Rainbow Trout', category: 'Fish & Seafood', purchaseUnit: 'KG', baseUnit: 'KG', quantityPerUnit: 1, price: 19.50 },
  { id: '42', lodgeId: '4', name: 'Almonds (Sliced)', category: 'Dry Goods', purchaseUnit: 'KG', baseUnit: 'G', quantityPerUnit: 1000, price: 24.00 },
  { id: '43', lodgeId: '4', name: 'Lemons', category: 'Fruit', purchaseUnit: 'KG', baseUnit: 'KG', quantityPerUnit: 1, price: 3.50 },
  { id: '44', lodgeId: '4', name: 'Green Beans', category: 'Vegetables', purchaseUnit: 'KG', baseUnit: 'KG', quantityPerUnit: 1, price: 4.80 },
  { id: '45', lodgeId: '4', name: 'White Rice', category: 'Dry Goods', purchaseUnit: 'KG', baseUnit: 'G', quantityPerUnit: 1000, price: 2.00 },
  { id: '46', lodgeId: '4', name: 'Parsley', category: 'Vegetables', purchaseUnit: 'KG', baseUnit: 'G', quantityPerUnit: 1000, price: 15.00 },
];

export const MOCK_RECIPES: Recipe[] = [
  // Lodge 1
  {
    id: '101',
    lodgeId: '1',
    name: 'Smoked Salmon Crostini',
    type: 'Appetizer',
    service: 'Dinner',
    day: 1,
    portionSizeGr: 200,
    yield: 10,
    ingredients: [
      { id: 'r1', ingredientId: '1', recipeQuantity: 0.6 },
      { id: 'r2', ingredientId: '2', recipeQuantity: 3 },
      { id: 'r3', ingredientId: '3', recipeQuantity: 0.5 },
      { id: 'r4', ingredientId: '6', recipeQuantity: 100 }, // Capers in grams
    ]
  },
  {
    id: '102',
    lodgeId: '1',
    name: 'Roasted Pumpkin Soup',
    type: 'Appetizer',
    service: 'Lunch / Dinner',
    day: 'Monday',
    portionSizeGr: 350,
    yield: 8,
    ingredients: []
  },

  // Lodge 2
  {
    id: '201',
    lodgeId: '2',
    name: 'Slow Roasted Lamb Leg',
    type: 'Principal',
    service: 'Dinner',
    day: 2,
    portionSizeGr: 450,
    yield: 12,
    ingredients: [
      { id: 'r21', ingredientId: '21', recipeQuantity: 3.5 }, // 3.5kg Lamb
      { id: 'r22', ingredientId: '22', recipeQuantity: 50 },  // 50g Rosemary
      { id: 'r23', ingredientId: '25', recipeQuantity: 0.2 }, // 200g Garlic
      { id: 'r24', ingredientId: '23', recipeQuantity: 500 }, // 500ml Wine
      { id: 'r25', ingredientId: '24', recipeQuantity: 2 },   // 2kg Potatoes side
    ]
  },

  // Lodge 3
  {
    id: '301',
    lodgeId: '3',
    name: 'Beef Bourguignon',
    type: 'Principal',
    service: 'Dinner',
    day: 'Wednesday',
    portionSizeGr: 400,
    yield: 15,
    ingredients: [
      { id: 'r31', ingredientId: '31', recipeQuantity: 4 },   // 4kg Beef
      { id: 'r32', ingredientId: '32', recipeQuantity: 1500 },// 2 bottles wine
      { id: 'r33', ingredientId: '33', recipeQuantity: 1 },   // 1kg onions
      { id: 'r34', ingredientId: '34', recipeQuantity: 1 },   // 1kg carrots
      { id: 'r35', ingredientId: '35', recipeQuantity: 30 },  // 30g thyme
    ]
  },

  // Lodge 4
  {
    id: '401',
    lodgeId: '4',
    name: 'Trout Amandine',
    type: 'Principal',
    service: 'Lunch',
    day: 4,
    portionSizeGr: 300,
    yield: 6,
    ingredients: [
      { id: 'r41', ingredientId: '41', recipeQuantity: 1.2 }, // 1.2kg Trout fillets
      { id: 'r42', ingredientId: '42', recipeQuantity: 150 }, // 150g Almonds
      { id: 'r43', ingredientId: '43', recipeQuantity: 0.5 }, // 500g Lemons
      { id: 'r44', ingredientId: '44', recipeQuantity: 0.8 }, // 800g Green beans
    ]
  }
];

export const CATEGORIES = [
  'Meat', 'Fish & Seafood', 'Vegetables', 'Fruit', 'Dairy', 'Bakery', 'Oil', 'Spices', 'Dry Goods', 'Alcohol'
];

export const UNITS = ['KG', 'L', 'ML', 'G', 'Unit', 'Box', 'Bottle', 'Can', 'Sack', 'Jar'];

export const DAYS_OPTIONS = [
  { group: 'Trip Days', items: ['1', '2', '3', '4', '5', '6', '7'] },
  { group: 'Weekdays', items: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] }
];