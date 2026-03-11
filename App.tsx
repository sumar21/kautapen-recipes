import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { IngredientsView } from './components/IngredientsView';
import { RecipesView } from './components/RecipesView';
import { LODGES, MOCK_INGREDIENTS, MOCK_RECIPES } from './constants';
import { Ingredient, Recipe } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<'recipes' | 'ingredients'>('recipes');
  
  // App State (Simulating Backend)
  const [ingredients, setIngredients] = useState<Ingredient[]>(MOCK_INGREDIENTS);
  const [recipes, setRecipes] = useState<Recipe[]>(MOCK_RECIPES);

  // Ingredient Handlers
  const handleAddIngredient = (ing: Ingredient) => {
    setIngredients([...ingredients, ing]);
  };
  
  const handleUpdateIngredient = (ing: Ingredient) => {
    setIngredients(ingredients.map(i => i.id === ing.id ? ing : i));
  };

  // Logic moved to IngredientsView for UI confirmation, here we just execute
  const handleDeleteIngredient = (id: string) => {
    setIngredients(ingredients.filter(i => i.id !== id));
  };

  // Recipe Handlers
  const handleAddRecipe = (rec: Recipe) => {
    setRecipes([...recipes, rec]);
  };

  const handleUpdateRecipe = (rec: Recipe) => {
    setRecipes(recipes.map(r => r.id === rec.id ? rec : r));
  };

  const handleDeleteRecipe = (id: string) => {
    setRecipes(recipes.filter(r => r.id !== id));
  };

  return (
    <div className="flex h-screen overflow-hidden bg-muted/30 font-sans">
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-[1600px] mx-auto">
          {currentView === 'ingredients' ? (
            <IngredientsView 
              ingredients={ingredients} 
              lodges={LODGES}
              onAddIngredient={handleAddIngredient}
              onUpdateIngredient={handleUpdateIngredient}
              onDeleteIngredient={handleDeleteIngredient}
            />
          ) : (
             <RecipesView 
              recipes={recipes} 
              ingredients={ingredients}
              lodges={LODGES}
              onAddRecipe={handleAddRecipe}
              onUpdateRecipe={handleUpdateRecipe}
              onDeleteRecipe={handleDeleteRecipe}
             />
          )}
        </div>
      </main>
    </div>
  );
}