import React from 'react';
import { Recipe, Ingredient, Lodge } from '../types';
import { Dialog, DialogFooter } from './ui/Dialog';
import { Button, Separator, Badge, Label } from './ui/UIComponents';
import { formatCurrency, cn } from '../lib/utils';
import { ChefHat, Utensils, Calendar, Scale, Weight, Coffee } from 'lucide-react';

interface RecipeDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipe: Recipe | null;
  lodges: Lodge[];
  ingredients: Ingredient[];
}

export function RecipeDetailsModal({ open, onOpenChange, recipe, lodges, ingredients }: RecipeDetailsModalProps) {
  if (!recipe) return null;

  const lodgeName = lodges.find(l => l.id === recipe.lodgeId)?.name || 'Unknown Lodge';

  const totalBatchCost = recipe.ingredients.reduce((acc, ri) => {
    const ing = ingredients.find(i => i.id === ri.ingredientId);
    if (!ing) return acc;
    const costPerBase = ing.price / ing.quantityPerUnit;
    return acc + (costPerBase * ri.recipeQuantity);
  }, 0);

  const unitCost = totalBatchCost / (recipe.yield || 1);

  return (
    <Dialog 
      open={open} 
      onOpenChange={onOpenChange} 
      title={recipe.name}
      description={`Recipe analysis for ${lodgeName}`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6">
        {/* Header Badges */}
        <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="px-3 py-1 text-sm bg-blue-50 text-blue-700 border-blue-200 gap-1 font-bold">
                <ChefHat className="w-3 h-3" />
                {recipe.type}
            </Badge>
            <Badge variant="outline" className={cn(
              "px-3 py-1 text-sm border-none gap-1 font-bold",
              recipe.service === 'Breakfast' ? "bg-amber-100 text-amber-700" :
              recipe.service === 'Lunch' ? "bg-sky-100 text-sky-700" :
              recipe.service === 'Dinner' ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-700"
            )}>
                {recipe.service === 'Breakfast' ? <Coffee className="w-3 h-3" /> : <Utensils className="w-3 h-3" />}
                {recipe.service}
            </Badge>
            <Badge variant="outline" className="px-3 py-1 text-sm bg-slate-100 text-slate-700 border-slate-200 gap-1 font-bold">
                <Calendar className="w-3 h-3" />
                {isNaN(Number(recipe.day)) ? recipe.day : `Day ${recipe.day}`}
            </Badge>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-slate-50/80 rounded-2xl border border-slate-100 shadow-sm">
            <div className="space-y-1">
                <Label className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Lodge</Label>
                <p className="font-bold text-sm text-slate-800">{lodgeName}</p>
            </div>
            <div className="space-y-1">
                <Label className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Yield</Label>
                <div className="flex items-center gap-1 font-bold text-sm text-slate-800">
                    <Scale className="w-3.5 h-3.5 text-emerald-500" />
                    {recipe.yield} Servings
                </div>
            </div>
            <div className="space-y-1">
                <Label className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Calculated Portion</Label>
                <div className="flex items-center gap-1 font-bold text-sm text-slate-800">
                    <Weight className="w-3.5 h-3.5 text-blue-500" />
                    {recipe.portionSizeGr} g
                </div>
            </div>
             <div className="space-y-1">
                <Label className="text-[10px] text-emerald-700 uppercase tracking-widest font-black">Unit Cost</Label>
                <p className="font-black text-xl text-emerald-600 tabular-nums leading-tight">{formatCurrency(unitCost)}</p>
            </div>
        </div>

        <Separator />

        {/* Ingredients Composition Table */}
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Batch Composition</h4>
                <div className="text-[10px] text-slate-500 font-bold">Total Batch Cost: <span className="font-black text-slate-900">{formatCurrency(totalBatchCost)}</span></div>
            </div>
            <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b">
                        <tr>
                            <th className="px-4 py-3 text-left">Ingredient</th>
                            <th className="px-4 py-3 text-right">Batch Amount</th>
                            <th className="px-4 py-3 text-right">Qty/Serv.</th>
                            <th className="px-4 py-3 text-right">Cost/Serv.</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                        {recipe.ingredients.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-4 py-10 text-center text-slate-400 italic">No ingredients defined for this recipe.</td>
                            </tr>
                        ) : (
                            recipe.ingredients.map(ri => {
                                const ing = ingredients.find(i => i.id === ri.ingredientId);
                                if (!ing) return null;
                                const sQty = ri.recipeQuantity / (recipe.yield || 1);
                                const costPerBase = ing.price / ing.quantityPerUnit;
                                const sCost = costPerBase * sQty;

                                return (
                                    <tr key={ri.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-4 py-3">
                                            <span className="font-bold text-slate-800">{ing.name}</span>
                                            <span className="text-[10px] ml-2 text-slate-400 font-black uppercase tracking-tight">({ing.category})</span>
                                        </td>
                                        <td className="px-4 py-3 text-right font-medium text-slate-600 tabular-nums">
                                            {ri.recipeQuantity} {ing.baseUnit}
                                        </td>
                                        <td className="px-4 py-3 text-right text-slate-400 tabular-nums font-medium">
                                            {sQty.toFixed(3)} {ing.baseUnit}
                                        </td>
                                        <td className="px-4 py-3 text-right tabular-nums font-black text-slate-800">{formatCurrency(sCost)}</td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                    <tfoot className="bg-slate-50/50 font-black border-t">
                         <tr>
                            <td colSpan={3} className="px-4 py-4 text-right text-slate-400 uppercase text-[10px] tracking-widest">Total Unit Cost (Per Service)</td>
                            <td className="px-4 py-4 text-right text-emerald-600 text-lg tabular-nums">{formatCurrency(unitCost)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>

        <DialogFooter className="pt-6 border-t">
            <Button variant="ghost" onClick={() => onOpenChange(false)} className="font-bold text-slate-500 px-8">Close Analysis</Button>
        </DialogFooter>
      </div>
    </Dialog>
  );
}