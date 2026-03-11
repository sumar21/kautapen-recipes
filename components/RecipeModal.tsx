import React, { useState, useMemo, useEffect } from 'react';
import { Recipe, RecipeIngredient, Ingredient, Lodge } from '../types';
import { Button, Input, Label, Badge, Separator } from './ui/UIComponents';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/Select';
import { Dialog, DialogFooter } from './ui/Dialog';
import { Plus, Trash2, Scale, Calculator, ArrowRightLeft, CalendarDays, UtensilsCrossed, Info } from 'lucide-react';
import { formatCurrency, generateId, cn } from '../lib/utils';
import { CATEGORIES, DAYS_OPTIONS } from '../constants';

interface RecipeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Recipe | null;
  lodges: Lodge[];
  ingredients: Ingredient[];
  onSave: (recipe: Recipe) => void;
}

const INITIAL_RECIPE: Partial<Recipe> = {
  name: '',
  type: 'Appetizer',
  service: 'Dinner',
  day: 1,
  portionSizeGr: 0,
  yield: 10,
  ingredients: []
};

export function RecipeModal({ open, onOpenChange, initialData, lodges, ingredients, onSave }: RecipeModalProps) {
  const [formData, setFormData] = useState<Partial<Recipe>>(INITIAL_RECIPE);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [addCategory, setAddCategory] = useState<string>('');
  const [addIngredientId, setAddIngredientId] = useState<string>('');
  const [addQuantity, setAddQuantity] = useState<string>('');
  const [addError, setAddError] = useState<string>('');

  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData(JSON.parse(JSON.stringify(initialData)));
      } else {
        setFormData({ ...INITIAL_RECIPE, lodgeId: lodges[0]?.id });
      }
      setErrors({});
      setAddCategory('');
      setAddIngredientId('');
      setAddQuantity('');
      setAddError('');
    }
  }, [open, initialData, lodges]);

  const filteredIngredientsForAdd = useMemo(() => {
    if (!formData.lodgeId) return [];
    return ingredients.filter(i => {
      const matchesLodge = i.lodgeId === formData.lodgeId;
      const matchesCategory = !addCategory || i.category === addCategory;
      return matchesLodge && matchesCategory;
    });
  }, [ingredients, formData.lodgeId, addCategory]);

  const selectedIngredientObj = useMemo(() => {
    return ingredients.find(i => i.id === addIngredientId);
  }, [ingredients, addIngredientId]);

  const getWeightInGrams = (qty: number, unit: string) => {
    if (unit === 'KG' || unit === 'L') return qty * 1000;
    if (unit === 'G' || unit === 'ML') return qty;
    return 0; 
  };

  const totalBatchWeight = useMemo(() => {
    return (formData.ingredients || []).reduce((acc, ri) => {
        const ing = ingredients.find(i => i.id === ri.ingredientId);
        if (!ing) return acc;
        return acc + getWeightInGrams(ri.recipeQuantity, ing.baseUnit);
    }, 0);
  }, [formData.ingredients, ingredients]);

  const calculatedPortionSize = useMemo(() => {
    const y = formData.yield || 0;
    if (y <= 0) return 0;
    return Math.round(totalBatchWeight / y);
  }, [totalBatchWeight, formData.yield]);

  const totalBatchCost = useMemo(() => {
    return (formData.ingredients || []).reduce((acc, ri) => {
      const ing = ingredients.find(i => i.id === ri.ingredientId);
      if (!ing) return acc;
      const costPerBase = ing.price / ing.quantityPerUnit;
      return acc + (costPerBase * ri.recipeQuantity);
    }, 0);
  }, [formData.ingredients, ingredients]);

  const unitCost = useMemo(() => {
    const y = formData.yield || 1;
    return totalBatchCost / y;
  }, [totalBatchCost, formData.yield]);

  const scaleIngredients = (targetYield: number) => {
      const currentYield = formData.yield || 1;
      if (targetYield <= 0 || currentYield <= 0) return;
      const factor = targetYield / currentYield;
      const scaled = (formData.ingredients || []).map(ri => ({
          ...ri,
          recipeQuantity: parseFloat((ri.recipeQuantity * factor).toFixed(4))
      }));
      setFormData(prev => ({ ...prev, ingredients: scaled, yield: targetYield }));
  };

  const handleAddIngredientToTable = () => {
    const qty = parseFloat(addQuantity);
    if (!addIngredientId) { setAddError('Select an ingredient'); return; }
    if (!addQuantity || isNaN(qty) || qty <= 0) { setAddError('Quantity must be > 0'); return; }

    const newIngredient: RecipeIngredient = {
      id: generateId(),
      ingredientId: addIngredientId,
      recipeQuantity: qty
    };

    setFormData(prev => ({
      ...prev,
      ingredients: [...(prev.ingredients || []), newIngredient]
    }));

    setAddIngredientId('');
    setAddQuantity('');
    setAddError('');
  };

  const removeIngredientFromRecipe = (rIngId: string) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients?.filter(ri => ri.id !== rIngId) || []
    }));
  };

  const updateIngredientQuantity = (rIngId: string, qtyInput: string) => {
    const qty = parseFloat(qtyInput);
    if (qtyInput !== '' && isNaN(qty)) return;
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients?.map(ri => 
        ri.id === rIngId ? { ...ri, recipeQuantity: qtyInput === '' ? 0 : qty } : ri
      ) || []
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name?.trim()) newErrors.name = "Name is required";
    if (!formData.lodgeId) newErrors.lodgeId = "Lodge is required";
    if (!formData.yield || formData.yield <= 0) newErrors.yield = "Yield is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
        onSave({ ...formData, portionSizeGr: calculatedPortionSize } as Recipe);
        onOpenChange(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={onOpenChange} 
      title={initialData ? "Edit Recipe" : "New Recipe"}
      description="Calculate professional recipe costs by defining batch yield and ingredients."
      maxWidth="max-w-5xl"
    >
      <div className="space-y-8 pt-2">
        {/* Section 1: Identity & Lodge */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-4 space-y-2">
             <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Lodge / Context</Label>
             <Select 
                value={formData.lodgeId} 
                onValueChange={(val) => {
                  setFormData({...formData, lodgeId: val, ingredients: []});
                  setAddCategory('');
                  setAddIngredientId('');
                }}
             >
                <SelectTrigger disabled={!!initialData} className="h-11 bg-slate-50 border-slate-200 focus:ring-slate-400">
                  <SelectValue placeholder="Select Lodge">{lodges.find(l => l.id === formData.lodgeId)?.name}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {lodges.map(l => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}
                </SelectContent>
             </Select>
             {errors.lodgeId && <p className="text-[10px] font-bold text-destructive uppercase px-1">{errors.lodgeId}</p>}
          </div>
          
          <div className="md:col-span-8 space-y-2">
             <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Recipe Name</Label>
             <Input 
               value={formData.name} 
               onChange={(e) => {
                   setFormData({...formData, name: e.target.value});
                   if(errors.name) setErrors({...errors, name: ''});
               }} 
               className={cn(
                 "h-11 text-lg font-semibold",
                 errors.name ? "border-destructive bg-destructive/5" : "border-slate-200 bg-white"
               )}
               placeholder="e.g. Braised Short Ribs with Cabernet reduction"
               autoFocus={!initialData}
             />
             {errors.name && <p className="text-[10px] font-bold text-destructive uppercase px-1">{errors.name}</p>}
          </div>
        </div>

        {/* Section 2: Metadata & Controls */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-6 items-end bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
          <div className="md:col-span-3 space-y-2">
             <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recipe Category</Label>
             <Select value={formData.type} onValueChange={(val) => setFormData({...formData, type: val as any})}>
                <SelectTrigger className="bg-white border-slate-200 shadow-sm h-10">
                  <SelectValue>{formData.type}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Appetizer">Appetizer</SelectItem>
                    <SelectItem value="Principal">Principal</SelectItem>
                    <SelectItem value="Optional">Optional</SelectItem>
                    <SelectItem value="Dessert">Dessert</SelectItem>
                </SelectContent>
             </Select>
          </div>
          
          <div className="md:col-span-3 space-y-2">
             <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Service Block</Label>
              <Select value={formData.service} onValueChange={(val) => setFormData({...formData, service: val as any})}>
                <SelectTrigger className="bg-white border-slate-200 shadow-sm h-10">
                  <SelectValue>{formData.service}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Breakfast">Breakfast</SelectItem>
                    <SelectItem value="Lunch">Lunch</SelectItem>
                    <SelectItem value="Dinner">Dinner</SelectItem>
                    <SelectItem value="Lunch / Dinner">Lunch / Dinner</SelectItem>
                </SelectContent>
             </Select>
          </div>

          <div className="md:col-span-3 space-y-2">
             <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <CalendarDays className="h-3 w-3" /> Assigned Day
             </Label>
             <Select value={String(formData.day)} onValueChange={(val) => setFormData({...formData, day: val})}>
                <SelectTrigger className="bg-white border-slate-200 shadow-sm h-10">
                  <SelectValue>{formData.day ? (isNaN(Number(formData.day)) ? formData.day : `Day ${formData.day}`) : "Select Day"}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {DAYS_OPTIONS.map(group => (
                    <React.Fragment key={group.group}>
                      <div className="px-2 py-2 text-[9px] font-black uppercase tracking-widest text-slate-400 bg-slate-100/50">
                        {group.group}
                      </div>
                      {group.items.map(day => (
                        <SelectItem key={day} value={day}>
                          {isNaN(Number(day)) ? day : `Day ${day}`}
                        </SelectItem>
                      ))}
                    </React.Fragment>
                  ))}
                </SelectContent>
             </Select>
          </div>
          
          <div className="md:col-span-3 space-y-2">
             <Label className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1.5">
                <Scale className="h-3 w-3" /> Batch Yield
             </Label>
             <div className="relative flex gap-2">
                <Input 
                  type="number" 
                  step="any"
                  onFocus={(e) => e.target.select()}
                  className={cn(
                    "h-10 text-center font-black transition-all",
                    errors.yield ? "border-destructive bg-destructive/5" : "border-emerald-200 bg-emerald-50 focus:ring-emerald-500 text-emerald-700"
                  )}
                  value={formData.yield === 0 ? '' : formData.yield} 
                  onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setFormData({...formData, yield: isNaN(val) ? 0 : val});
                      if(errors.yield) setErrors({...errors, yield: ''});
                  }}
                />
                {initialData && (
                    <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-10 w-10 shrink-0 border-emerald-200 text-emerald-600 hover:bg-emerald-100 hover:border-emerald-300 shadow-sm"
                        title="Scale components proportionally"
                        onClick={() => scaleIngredients(formData.yield || 1)}
                    >
                        <ArrowRightLeft className="h-4 w-4" />
                    </Button>
                )}
             </div>
          </div>
        </div>

        {/* Section 3: Ingredients Management */}
        <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <UtensilsCrossed className="h-4 w-4 text-slate-400" />
                    Batch Composition
                </h3>
                <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <div className="flex items-center gap-1.5">
                        <Calculator className="h-3 w-3" />
                        Avg Portion: <span className="text-slate-700">{calculatedPortionSize}g</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                         Total Weight: <span className="text-slate-700">{(totalBatchWeight/1000).toFixed(2)}kg</span>
                    </div>
                </div>
            </div>

            {/* Quick Add Row */}
            <div className="bg-slate-900 p-4 rounded-xl shadow-lg shadow-slate-200/50 flex flex-col md:flex-row gap-3 items-center">
                <div className="w-full md:w-1/4">
                    <Select value={addCategory} onValueChange={setAddCategory}>
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100 h-10 focus:ring-slate-600">
                            <SelectValue placeholder="All Categories">{addCategory || "Category"}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">All Categories</SelectItem>
                            {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="w-full md:w-2/5">
                    <Select value={addIngredientId} onValueChange={(val) => { setAddIngredientId(val); setAddError(''); }}>
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100 h-10 focus:ring-slate-600">
                            <SelectValue placeholder="Search Ingredient...">
                               {ingredients.find(i => i.id === addIngredientId)?.name || "Select Ingredient"}
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            {filteredIngredientsForAdd.map(i => (
                                <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="w-full md:w-1/4 relative">
                    <Input 
                        type="number" 
                        step="any"
                        onFocus={(e) => e.target.select()}
                        placeholder="Amount"
                        className="bg-slate-800 border-slate-700 text-slate-100 h-10 pr-12 font-bold placeholder:text-slate-500 focus:ring-slate-600"
                        value={addQuantity}
                        onChange={(e) => { setAddQuantity(e.target.value); setAddError(''); }}
                    />
                    <div className="absolute right-3 top-2.5 text-[10px] font-black text-slate-500 uppercase">
                         {selectedIngredientObj?.baseUnit || ''}
                    </div>
                </div>
                <Button 
                    className="w-full md:w-auto px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-10 gap-2" 
                    onClick={(e) => { e.preventDefault(); handleAddIngredientToTable(); }}
                    disabled={!addIngredientId || !addQuantity}
                >
                    <Plus className="h-4 w-4" /> Add
                </Button>
            </div>
            {addError && <p className="text-[10px] text-destructive font-black uppercase tracking-widest px-2">{addError}</p>}

            {/* Ingredients Table */}
            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                  <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.1em] border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4 text-left font-bold">Ingredient</th>
                        <th className="px-6 py-4 text-right font-bold w-40">Batch Quantity</th>
                        <th className="px-6 py-4 text-right font-bold">Per Serving</th>
                        <th className="px-6 py-4 text-right font-bold">Cost / Srv</th>
                        <th className="px-6 py-4 text-center w-16"></th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                      {(formData.ingredients || []).length === 0 ? (
                        <tr>
                            <td colSpan={5} className="px-6 py-16 text-center">
                                <div className="flex flex-col items-center gap-2 text-slate-300">
                                    <UtensilsCrossed className="h-8 w-8 opacity-20" />
                                    <p className="italic text-sm">No components added to this batch yet.</p>
                                </div>
                            </td>
                        </tr>
                      ) : (
                        formData.ingredients?.map((ri) => {
                            const ing = ingredients.find(i => i.id === ri.ingredientId);
                            if (!ing) return null;
                            const qtyPerServing = ri.recipeQuantity / (formData.yield || 1);
                            const costPerBase = ing.price / ing.quantityPerUnit;
                            const costPerServing = costPerBase * qtyPerServing;

                            return (
                                <tr key={ri.id} className="group hover:bg-slate-50/30 transition-all">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-700">{ing.name}</div>
                                        <div className="text-[9px] text-slate-400 font-black uppercase tracking-tight">{ing.category}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Input 
                                                type="number" 
                                                step="any"
                                                onFocus={(e) => e.target.select()}
                                                className="h-9 w-24 text-right font-bold bg-white border-slate-200 group-hover:border-slate-300 focus:border-slate-400"
                                                value={ri.recipeQuantity === 0 ? '' : ri.recipeQuantity}
                                                onChange={(e) => updateIngredientQuantity(ri.id, e.target.value)}
                                            />
                                            <span className="text-[10px] font-black text-slate-400 w-6 uppercase">{ing.baseUnit}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right text-slate-500 tabular-nums font-medium">
                                        {qtyPerServing.toFixed(3)} {ing.baseUnit}
                                    </td>
                                    <td className="px-6 py-4 text-right font-black text-slate-800 tabular-nums">
                                        {formatCurrency(costPerServing)}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button 
                                            className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-slate-300 hover:text-destructive hover:bg-destructive/5 transition-all opacity-0 group-hover:opacity-100"
                                            onClick={() => removeIngredientFromRecipe(ri.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            )
                        })
                      )}
                  </tbody>
              </table>
            </div>
        </div>

        {/* Final Analysis Summary */}
        <div className="bg-emerald-50/30 border border-emerald-100 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5 text-center md:text-left">
                <div className="flex items-center gap-2 justify-center md:justify-start">
                    <Info className="h-4 w-4 text-emerald-600" />
                    <span className="text-[11px] font-black text-emerald-600 uppercase tracking-widest">Financial Breakdown</span>
                </div>
                <p className="text-sm text-slate-500 font-medium">
                    Based on a total batch cost of <span className="font-bold text-slate-900">{formatCurrency(totalBatchCost)}</span> divided by <span className="font-bold text-slate-900">{formData.yield} portions</span>.
                </p>
            </div>
            
            <div className="flex flex-col items-center md:items-end">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Cost Per Serving</span>
                <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black text-emerald-600 tabular-nums leading-none">
                        {formatCurrency(unitCost)}
                    </span>
                </div>
            </div>
        </div>

        <DialogFooter className="gap-3 pt-6 border-t mt-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="px-10 font-bold text-slate-400 hover:text-slate-600">Cancel</Button>
          <Button onClick={handleSubmit} className="bg-slate-900 hover:bg-black px-12 font-black shadow-xl uppercase tracking-widest text-xs h-12 rounded-xl transition-all hover:scale-[1.02] active:scale-95">
            Confirm & Save Recipe
          </Button>
        </DialogFooter>
      </div>
    </Dialog>
  );
}