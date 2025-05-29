import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  cost: number;
}

interface Recipe {
  id: string;
  name: string;
  type: 'veg' | 'non-veg';
  category: string;
  ingredients: Ingredient[];
  instructions: string;
  prepTime: number;
  cookingTime: number;
  servings: number;
  totalCost: number;
}

const MealManagement: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const addNewRecipe = () => {
    const newRecipe: Recipe = {
      id: Date.now().toString(),
      name: '',
      type: 'veg',
      category: 'lunch',
      ingredients: [],
      instructions: '',
      prepTime: 0,
      cookingTime: 0,
      servings: 1,
      totalCost: 0
    };
    setRecipes([...recipes, newRecipe]);
    setSelectedRecipe(newRecipe);
  };

  const addIngredient = () => {
    if (!selectedRecipe) return;
    
    const newIngredient: Ingredient = {
      id: Date.now().toString(),
      name: '',
      quantity: 0,
      unit: 'g',
      cost: 0
    };

    const updatedRecipe = {
      ...selectedRecipe,
      ingredients: [...selectedRecipe.ingredients, newIngredient]
    };

    setSelectedRecipe(updatedRecipe);
    setRecipes(recipes.map(r => r.id === updatedRecipe.id ? updatedRecipe : r));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Meal Management</h2>
        <Button onClick={addNewRecipe}>Add New Recipe</Button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Recipe List */}
        <Card className="p-4">
          <h3 className="text-xl font-semibold mb-4">Recipes</h3>
          <div className="space-y-2">
            {recipes.map(recipe => (
              <div
                key={recipe.id}
                className={`p-3 border rounded cursor-pointer hover:bg-gray-50 ${
                  selectedRecipe?.id === recipe.id ? 'bg-gray-100' : ''
                }`}
                onClick={() => setSelectedRecipe(recipe)}
              >
                <div className="font-medium">{recipe.name || 'New Recipe'}</div>
                <div className="text-sm text-gray-500">
                  {recipe.type === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'} • {recipe.category}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recipe Details */}
        {selectedRecipe && (
          <Card className="p-4">
            <h3 className="text-xl font-semibold mb-4">Recipe Details</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={selectedRecipe.name}
                    onChange={(e) => {
                      const updated = { ...selectedRecipe, name: e.target.value };
                      setSelectedRecipe(updated);
                      setRecipes(recipes.map(r => r.id === updated.id ? updated : r));
                    }}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Type</label>
                  <Select
                    value={selectedRecipe.type}
                    onValueChange={(value: 'veg' | 'non-veg') => {
                      const updated = { ...selectedRecipe, type: value };
                      setSelectedRecipe(updated);
                      setRecipes(recipes.map(r => r.id === updated.id ? updated : r));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="veg">Vegetarian</SelectItem>
                      <SelectItem value="non-veg">Non-Vegetarian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Instructions</label>
                <Textarea
                  value={selectedRecipe.instructions}
                  onChange={(e) => {
                    const updated = { ...selectedRecipe, instructions: e.target.value };
                    setSelectedRecipe(updated);
                    setRecipes(recipes.map(r => r.id === updated.id ? updated : r));
                  }}
                  rows={4}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Ingredients</h4>
                  <Button onClick={addIngredient} size="sm">Add Ingredient</Button>
                </div>
                <div className="space-y-2">
                  {selectedRecipe.ingredients.map(ingredient => (
                    <div key={ingredient.id} className="grid grid-cols-4 gap-2">
                      <Input placeholder="Name" />
                      <Input type="number" placeholder="Quantity" />
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="g">g</SelectItem>
                          <SelectItem value="kg">kg</SelectItem>
                          <SelectItem value="ml">ml</SelectItem>
                          <SelectItem value="l">l</SelectItem>
                          <SelectItem value="pcs">pcs</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input type="number" placeholder="Cost" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Prep Time (mins)</label>
                  <Input type="number" value={selectedRecipe.prepTime} />
                </div>
                <div>
                  <label className="text-sm font-medium">Cooking Time (mins)</label>
                  <Input type="number" value={selectedRecipe.cookingTime} />
                </div>
                <div>
                  <label className="text-sm font-medium">Servings</label>
                  <Input type="number" value={selectedRecipe.servings} />
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MealManagement; 