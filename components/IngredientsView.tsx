import React, { useState, useMemo } from 'react';
import { Ingredient, Lodge } from '../types';
import { Button, Input, Card, CardContent, Label, Separator, Badge } from './ui/UIComponents';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/Select';
import { Dialog, DialogFooter } from './ui/Dialog';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { formatCurrency, generateId } from '../lib/utils';
import { CATEGORIES, UNITS } from '../constants';

interface IngredientsViewProps {
  ingredients: Ingredient[];
  lodges: Lodge[];
  onAddIngredient: (ing: Ingredient) => void;
  onUpdateIngredient: (ing: Ingredient) => void;
  onDeleteIngredient: (id: string) => void;
}

const INITIAL_FORM: Partial<Ingredient> = {
  name: '',
  category: '',
  purchaseUnit: 'KG',
  baseUnit: 'KG',
  quantityPerUnit: 1,
  price: 0,
};

export function IngredientsView({ ingredients, lodges, onAddIngredient, onUpdateIngredient, onDeleteIngredient }: IngredientsViewProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Ingredient>>(INITIAL_FORM);
  const [searchTerm, setSearchTerm] = useState('');
  const [lodgeFilter, setLodgeFilter] = useState<string>('all');
  
  // Validation State
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Delete State
  const [ingredientToDelete, setIngredientToDelete] = useState<string | null>(null);

  const filteredIngredients = useMemo(() => {
    return ingredients.filter(ing => {
      const matchesLodge = lodgeFilter === 'all' || ing.lodgeId === lodgeFilter;
      const matchesSearch = ing.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            ing.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesLodge && matchesSearch;
    });
  }, [ingredients, lodgeFilter, searchTerm]);

  const handleEdit = (ing: Ingredient) => {
    setFormData(ing);
    setEditingId(ing.id);
    setErrors({});
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setFormData({ ...INITIAL_FORM, lodgeId: lodges[0]?.id });
    setEditingId(null);
    setErrors({});
    setIsDialogOpen(true);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.lodgeId) newErrors.lodgeId = "Lodge is required";
    if (!formData.name?.trim()) newErrors.name = "Name is required";
    if (!formData.category) newErrors.category = "Category is required";
    
    // Numerical validation
    if (formData.price === undefined || formData.price < 0) {
      newErrors.price = "Price cannot be negative";
    }
    
    if (!formData.quantityPerUnit || formData.quantityPerUnit <= 0) {
      newErrors.quantityPerUnit = "Quantity must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const newIng = { ...formData } as Ingredient;

    if (editingId) {
      onUpdateIngredient(newIng);
    } else {
      onAddIngredient({ ...newIng, id: generateId() });
    }
    setIsDialogOpen(false);
  };

  const handleConfirmDelete = () => {
    if (ingredientToDelete) {
      onDeleteIngredient(ingredientToDelete);
      setIngredientToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Ingredients</h2>
          <p className="text-muted-foreground">Manage your ingredient master list and prices per lodge.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleCreate} className="bg-slate-900 shadow-md">
            <Plus className="mr-2 h-4 w-4" /> Add Ingredient
          </Button>
        </div>
      </div>

      <Card>
        <div className="p-4 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search ingredients..."
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
              <thead className="text-[10px] text-muted-foreground uppercase bg-slate-50/80 font-bold tracking-wider border-b">
                <tr>
                  <th className="px-4 py-4 font-bold">Lodge</th>
                  <th className="px-4 py-4 font-bold">Ingredient</th>
                  <th className="px-4 py-4 font-bold">Category</th>
                  <th className="px-4 py-4 font-bold">Purch. Unit</th>
                  <th className="px-4 py-4 font-bold text-right">Price</th>
                  <th className="px-4 py-4 font-bold text-right">Base Cost</th>
                  <th className="px-4 py-4 font-bold text-right w-[100px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredIngredients.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground italic">
                      No ingredients found.
                    </td>
                  </tr>
                ) : (
                  filteredIngredients.map((ing) => (
                    <tr key={ing.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-4 py-4 font-medium text-muted-foreground">{lodges.find(l => l.id === ing.lodgeId)?.name}</td>
                      <td className="px-4 py-4 font-bold text-slate-800">{ing.name}</td>
                      <td className="px-4 py-4">
                        <Badge variant="secondary" className="font-semibold bg-slate-100 text-slate-600 border-none rounded-md px-2 py-0.5">
                          {ing.category}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-slate-600 font-medium">
                        {ing.quantityPerUnit} {ing.baseUnit} / {ing.purchaseUnit}
                      </td>
                      <td className="px-4 py-4 text-right font-bold text-slate-900">{formatCurrency(ing.price)}</td>
                      <td className="px-4 py-4 text-right text-emerald-600 font-semibold">
                        {formatCurrency(ing.price / ing.quantityPerUnit)} / {ing.baseUnit}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900" onClick={() => handleEdit(ing)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-slate-400 hover:text-red-600" 
                            onClick={() => setIngredientToDelete(ing.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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

      <Dialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        title={editingId ? "Edit Ingredient" : "Add Ingredient"}
        description="Configure purchase details and conversion units."
      >
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2 col-span-1">
                <Label className="text-slate-600 font-semibold">Lodge</Label>
                <Select 
                  value={formData.lodgeId} 
                  onValueChange={(val) => {
                    setFormData({...formData, lodgeId: val});
                    if (errors.lodgeId) setErrors({...errors, lodgeId: ''});
                  }}
                >
                  <SelectTrigger className={errors.lodgeId ? "border-red-400 bg-red-50/30" : "bg-slate-50"}>
                    <SelectValue placeholder="Select Lodge" >
                      {lodges.find(l => l.id === formData.lodgeId)?.name}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {lodges.map(l => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.lodgeId && <p className="text-[10px] font-bold text-red-600 uppercase tracking-tight">{errors.lodgeId}</p>}
             </div>
             
             <div className="space-y-2 col-span-1">
                <Label className="text-slate-600 font-semibold">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(val) => {
                    setFormData({...formData, category: val});
                    if (errors.category) setErrors({...errors, category: ''});
                  }}
                >
                  <SelectTrigger className={errors.category ? "border-red-400 bg-red-50/30" : "bg-slate-50"}>
                    <SelectValue placeholder="Select Category">
                      {formData.category}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-[10px] font-bold text-red-600 uppercase tracking-tight">{errors.category}</p>}
             </div>

             <div className="space-y-2 col-span-2">
                <Label className="text-slate-600 font-semibold">Name</Label>
                <Input 
                  value={formData.name} 
                  onChange={(e) => {
                    setFormData({...formData, name: e.target.value});
                    if (errors.name) setErrors({...errors, name: ''});
                  }}
                  placeholder="e.g. Premium Beef Cut"
                  className={errors.name ? "border-red-400 bg-red-50/30" : "bg-slate-50"}
                />
                {errors.name && <p className="text-[10px] font-bold text-red-600 uppercase tracking-tight">{errors.name}</p>}
             </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2 col-span-1">
                <Label className="text-slate-600 font-semibold">Purchase Unit</Label>
                <Select 
                  value={formData.purchaseUnit} 
                  onValueChange={(val) => setFormData({...formData, purchaseUnit: val as any})}
                >
                  <SelectTrigger className="bg-slate-50">
                    <SelectValue>{formData.purchaseUnit}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                     {UNITS.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                  </SelectContent>
                </Select>
             </div>

             <div className="space-y-2 col-span-1">
                <Label className="text-slate-600 font-semibold">Price <span className="text-muted-foreground text-[10px] font-normal tracking-wide">(per Purch. Unit)</span></Label>
                <div className="relative">
                   <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">$</span>
                   <Input 
                      type="number"
                      step="any"
                      onFocus={(e) => e.target.select()}
                      className={`pl-7 bg-slate-50 font-bold ${errors.price ? "border-red-400 bg-red-50/30 focus-visible:ring-red-400" : ""}`}
                      value={formData.price === 0 ? '' : formData.price}
                      placeholder="0.00"
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setFormData({...formData, price: isNaN(val) ? 0 : val});
                        if (errors.price) setErrors({...errors, price: ''});
                      }}
                   />
                </div>
                {errors.price && <p className="text-[10px] font-bold text-red-600 uppercase tracking-tight">{errors.price}</p>}
             </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-5 space-y-5">
              <div className="flex items-center justify-between">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Internal Conversion</Label>
                  <Badge variant="outline" className="text-[10px] bg-white font-bold text-blue-600 border-blue-200 px-2">
                      1 {formData.purchaseUnit} = {formData.quantityPerUnit} {formData.baseUnit}
                  </Badge>
              </div>

              <div className="grid grid-cols-2 gap-5">
                 <div className="space-y-2">
                    <Label className="text-slate-600 font-semibold">Base Unit</Label>
                    <Select 
                      value={formData.baseUnit} 
                      onValueChange={(val) => setFormData({...formData, baseUnit: val as any})}
                    >
                      <SelectTrigger className="bg-white border-slate-200">
                        <SelectValue>{formData.baseUnit}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {UNITS.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                      </SelectContent>
                    </Select>
                 </div>
                 <div className="space-y-2">
                    <Label className="text-slate-600 font-semibold">Qty per Purch. Unit</Label>
                     <Input 
                      type="number"
                      step="any"
                      onFocus={(e) => e.target.select()}
                      className={`bg-white border-slate-200 font-bold ${errors.quantityPerUnit ? "border-red-400 focus-visible:ring-red-400" : ""}`}
                      value={formData.quantityPerUnit === 0 ? '' : formData.quantityPerUnit}
                      placeholder="1.00"
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setFormData({...formData, quantityPerUnit: isNaN(val) ? 0 : val});
                        if (errors.quantityPerUnit) setErrors({...errors, quantityPerUnit: ''});
                      }}
                   />
                   {errors.quantityPerUnit && <p className="text-[10px] font-bold text-red-600 uppercase tracking-tight">{errors.quantityPerUnit}</p>}
                 </div>
              </div>
          </div>

          <DialogFooter className="border-t pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="px-6 font-semibold">Cancel</Button>
            <Button type="submit" className="bg-slate-900 px-10 font-bold shadow-lg">Save Changes</Button>
          </DialogFooter>
        </form>
      </Dialog>

      <Dialog 
        open={!!ingredientToDelete} 
        onOpenChange={(open) => !open && setIngredientToDelete(null)}
        title="Delete Ingredient"
        description="Are you sure you want to delete this ingredient? This might affect existing recipes."
      >
        <DialogFooter className="gap-2 sm:gap-0 pt-4">
          <Button variant="outline" onClick={() => setIngredientToDelete(null)}>Cancel</Button>
          <Button variant="destructive" onClick={handleConfirmDelete} className="bg-red-600 font-bold">Delete Ingredient</Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
