
import React, { useState, useMemo } from 'react';
import { Recipe, Ingredient, Lodge } from '../types';
import { Button, Input, Card, CardContent, Badge, Separator } from './ui/UIComponents';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/Select';
import { Dialog, DialogFooter } from './ui/Dialog';
import { Plus, Search, Pencil, Trash2, Eye } from 'lucide-react';
// Added 'cn' to the utility imports to resolve the reference error in the JSX
import { formatCurrency, generateId, cn } from '../lib/utils';
import { RecipeModal } from './RecipeModal';
import { RecipeDetailsModal } from './RecipeDetailsModal';

interface RecipesViewProps {
  recipes: Recipe[];
  ingredients: Ingredient[];
  lodges: Lodge[];
  onAddRecipe: (r: Recipe) => void;
  onUpdateRecipe: (r: Recipe) => void;
  onDeleteRecipe: (id: string) => void;
}

export function RecipesView({ recipes, ingredients, lodges, onAddRecipe, onUpdateRecipe, onDeleteRecipe }: RecipesViewProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  
  // Details Modal State
  const [viewingRecipe, setViewingRecipe] = useState<Recipe | null>(null);

  // Delete Confirmation State
  const [recipeToDelete, setRecipeToDelete] = useState<string | null>(null);
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [lodgeFilter, setLodgeFilter] = useState<string>('all');

  // --- Calculations Helper ---
  const getIngredientCost = (ingId: string, recipeQty: number, recipeYield: number) => {
    const ing = ingredients.find(i => i.id === ingId);
    if (!ing) return 0;
    const costPerBase = ing.price / ing.quantityPerUnit; 
    const qtyPerServing = recipeQty / recipeYield;
    return costPerBase * qtyPerServing;
  };

  const getRecipeUnitCost = (recipe: Recipe) => {
    return recipe.ingredients.reduce((total, ri) => {
      return total + getIngredientCost(ri.ingredientId, ri.recipeQuantity, recipe.yield);
    }, 0);
  };

  // --- Filtering ---
  const filteredRecipes = useMemo(() => {
    return recipes.filter(r => {
      const matchesLodge = lodgeFilter === 'all' || r.lodgeId === lodgeFilter;
      const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesLodge && matchesSearch;
    });
  }, [recipes, lodgeFilter, searchTerm]);

  // --- Handlers ---
  const handleEdit = (rec: Recipe) => {
    setEditingRecipe(rec);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingRecipe(null);
    setIsDialogOpen(true);
  };

  const handleSave = (recipeToSave: Recipe) => {
    if (editingRecipe) {
      onUpdateRecipe(recipeToSave);
    } else {
      onAddRecipe({ ...recipeToSave, id: generateId() });
    }
  };

  const handleConfirmDelete = () => {
    if (recipeToDelete) {
      onDeleteRecipe(recipeToDelete);
      setRecipeToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Recipes</h2>
          <p className="text-muted-foreground">Manage recipes, define servings and analyze unit costs per service.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleCreate} className="bg-slate-900 text-white hover:bg-black shadow-md">
            <Plus className="mr-2 h-4 w-4" /> New Recipe
          </Button>
        </div>
      </div>

      {/* Main Table Card */}
      <Card>
        <div className="p-4 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search recipes..."
                    className="pl-9 bg-slate-50/50"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-[200px]">
                <Select value={lodgeFilter} onValueChange={setLodgeFilter}>
                    <SelectTrigger className="bg-slate-50/50">
                         <SelectValue>{lodgeFilter === 'all' ? "All Lodges" : lodges.find(l => l.id === lodgeFilter)?.name}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Lodges</SelectItem>
                        {lodges.map(l => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
        </div>
        <Separator />
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] text-muted-foreground uppercase bg-slate-50/80 font-bold tracking-widest border-b">
                <tr>
                  <th className="px-4 py-4 font-bold">Lodge</th>
                  <th className="px-4 py-4 font-bold">Recipe Name</th>
                  <th className="px-4 py-4 font-bold">Type</th>
                  <th className="px-4 py-4 font-bold">Service</th>
                  <th className="px-4 py-4 font-bold text-center">Day / Weekday</th>
                  <th className="px-4 py-4 font-bold text-center">Yield</th>
                  <th className="px-4 py-4 font-bold text-right">Unit Cost</th>
                  <th className="px-4 py-4 font-bold text-right w-[120px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecipes.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground italic">
                      No recipes found.
                    </td>
                  </tr>
                ) : (
                  filteredRecipes.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-4 py-4 font-medium text-slate-400">{lodges.find(l => l.id === rec.lodgeId)?.name}</td>
                      <td className="px-4 py-4 font-bold text-slate-800">{rec.name}</td>
                      <td className="px-4 py-4">
                        <Badge variant="outline" className="font-semibold text-slate-500 bg-white border-slate-200">{rec.type}</Badge>
                      </td>
                      <td className="px-4 py-4">
                        {/* Use the 'cn' utility to combine classes conditionally */}
                        <Badge variant="secondary" className={cn(
                          "font-bold text-[10px] uppercase border-none rounded-md px-2 py-0.5",
                          rec.service === 'Breakfast' ? "bg-amber-100 text-amber-700" :
                          rec.service === 'Lunch' ? "bg-sky-100 text-sky-700" :
                          rec.service === 'Dinner' ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-700"
                        )}>
                          {rec.service}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-center text-slate-500 font-medium">
                        {isNaN(Number(rec.day)) ? rec.day : `Day ${rec.day}`}
                      </td>
                       <td className="px-4 py-4 text-center text-slate-800 font-bold">{rec.yield}</td>
                      <td className="px-4 py-4 text-right font-black text-emerald-600">
                        {formatCurrency(getRecipeUnitCost(rec))}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button 
                            className="h-8 w-8 inline-flex items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-all"
                            onClick={() => setViewingRecipe(rec)}
                           >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button 
                            className="h-8 w-8 inline-flex items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-all"
                            onClick={() => handleEdit(rec)}
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button 
                            className="h-8 w-8 inline-flex items-center justify-center rounded-lg bg-red-50 text-red-400 hover:text-red-600 hover:bg-red-100 transition-all"
                            onClick={() => setRecipeToDelete(rec.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit/Create Modal */}
      <RecipeModal 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initialData={editingRecipe}
        lodges={lodges}
        ingredients={ingredients}
        onSave={handleSave}
      />

      {/* Details View Modal */}
      <RecipeDetailsModal 
        open={!!viewingRecipe}
        onOpenChange={(open) => !open && setViewingRecipe(null)}
        recipe={viewingRecipe}
        lodges={lodges}
        ingredients={ingredients}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={!!recipeToDelete} 
        onOpenChange={(open) => !open && setRecipeToDelete(null)}
        title="Delete Recipe"
        description="Are you sure you want to delete this recipe? This action cannot be undone."
      >
        <DialogFooter className="gap-2 sm:gap-0 pt-4">
          <Button variant="outline" onClick={() => setRecipeToDelete(null)}>Cancel</Button>
          <Button variant="destructive" onClick={handleConfirmDelete} className="bg-red-600 font-bold">Delete Recipe</Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
