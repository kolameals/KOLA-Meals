import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Plus, Minus, ChefHat, Users, Package, Building, Info, Wand2, Clock, DollarSign, AlertCircle, Star } from "lucide-react";
import { recipeService } from '../../../../services/recipe.service';
import type { Recipe } from '../../../../services/recipe.service';
import type { GeneratedRecipe } from '../../../../types/recipe.types';
import { MealCategory, MealType } from '../../../../services/meal.service';
import api, { recipeApi } from '../../../../services/api';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import MDEditor from '@uiw/react-md-editor';
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const FinancialCalculator: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [customerCount, setCustomerCount] = useState<number>(1);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [menuDate, setMenuDate] = useState<Date | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState<GeneratedRecipe | null>(null);
  const [recipePrompt, setRecipePrompt] = useState("");
  const [activeTab, setActiveTab] = useState<'select' | 'generate'>('select');

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const fetchedRecipes = await recipeService.getRecipes();
      setRecipes(fetchedRecipes);
      setError(null);
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setError('Failed to fetch recipes');
    } finally {
      setLoading(false);
    }
  };

  const generateRecipe = async () => {
    if (!recipePrompt.trim()) return;

    try {
      setIsGenerating(true);
      const response = await recipeApi.post('/recipes/generate', { 
        prompt: recipePrompt,
        servings: customerCount
      });
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to generate recipe');
      }
      setGeneratedRecipe(response.data.data);
      setActiveTab('generate');
    } catch (error) {
      console.error('Error generating recipe:', error);
      alert('Failed to generate recipe. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const saveGeneratedRecipe = async () => {
    if (!generatedRecipe) return;

    try {
      const newRecipe: Recipe = {
        id: Date.now().toString(),
        name: generatedRecipe.name,
        description: generatedRecipe.description,
        category: generatedRecipe.category as MealCategory,
        type: generatedRecipe.type as MealType,
        servings: generatedRecipe.servings,
        preparationTime: generatedRecipe.preparationTime,
        cookingTime: generatedRecipe.cookingTime,
        recipeItems: generatedRecipe.ingredients.map(ing => ({
          id: Date.now().toString(),
          rawMaterialId: Date.now().toString(),
          rawMaterial: {
            id: Date.now().toString(),
            name: ing.name,
            unit: ing.unit,
            costPerUnit: 0,
          },
          quantity: ing.quantity,
          unit: ing.unit,
        })),
        instructions: generatedRecipe.instructions.join('\n'),
        costPerServing: generatedRecipe.costEstimate.costPerServing,
        mealId: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await recipeService.createRecipe(newRecipe);
      await fetchRecipes();
      setGeneratedRecipe(null);
      setActiveTab('select');
      alert('Recipe saved successfully!');
    } catch (error) {
      console.error('Error saving recipe:', error);
      alert('Failed to save recipe. Please try again.');
    }
  };

  // Helper function to check if a string is a valid URL
  const isValidUrl = (url: string | undefined) => {
    return typeof url === 'string' && url.startsWith('http');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={fetchRecipes}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Recipe Generator</h2>
          <p className="text-sm text-gray-500 mt-1">Generate and manage your recipes</p>
        </div>
        <div className="flex gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {menuDate ? format(menuDate, "PPP") : "Select Menu Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={menuDate || undefined}
                onSelect={(date) => date && setMenuDate(date)}
                initialFocus
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Recipe Selection and Generation */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Recipe Details</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Select a recipe or generate a new one using AI</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'select' | 'generate')} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="select">Select Recipe</TabsTrigger>
              <TabsTrigger value="generate">Generate Recipe</TabsTrigger>
            </TabsList>

            <TabsContent value="select">
              <div className="space-y-4">
                <div>
                  <Label>Recipe</Label>
                  <Select
                    value={selectedRecipe?.id}
                    onValueChange={(value) => {
                      const recipe = recipes.find(r => r.id === value);
                      setSelectedRecipe(recipe || null);
                      setGeneratedRecipe(null);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a recipe" />
                    </SelectTrigger>
                    <SelectContent>
                      {recipes.map(recipe => (
                        <SelectItem key={recipe.id} value={recipe.id}>
                          {recipe.name} ({recipe.type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedRecipe && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <Label className="text-gray-500">Category</Label>
                        <div className="text-sm font-medium">{selectedRecipe.category}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <Label className="text-gray-500">Type</Label>
                        <div className="text-sm font-medium">{selectedRecipe.type}</div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg">
                      <Label className="text-gray-500">Raw Materials</Label>
                      <div className="mt-2 space-y-2">
                        {selectedRecipe.recipeItems.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="font-medium">{item.rawMaterial?.name}</span>
                            <span className="text-gray-600">{item.quantity} {item.unit}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <Label className="text-gray-500">Preparation Time</Label>
                        <div className="text-sm font-medium">{selectedRecipe.preparationTime} mins</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <Label className="text-gray-500">Cooking Time</Label>
                        <div className="text-sm font-medium">{selectedRecipe.cookingTime} mins</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="generate">
              <div className="space-y-4">
                <div>
                  <Label>Number of Servings</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCustomerCount(Math.max(1, customerCount - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      value={customerCount}
                      onChange={(e) => setCustomerCount(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-24 text-center"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCustomerCount(customerCount + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Describe your recipe</Label>
                  <Textarea
                    placeholder="Describe the recipe you want to generate (e.g., 'A healthy vegetarian pasta dish with seasonal vegetables')"
                    value={recipePrompt}
                    onChange={(e) => setRecipePrompt(e.target.value)}
                    className="h-32"
                  />
                </div>

                <Button
                  className="w-full"
                  onClick={generateRecipe}
                  disabled={!recipePrompt.trim() || isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Recipe...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Generate Recipe
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Recipe Display */}
        {(selectedRecipe || generatedRecipe) && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Recipe Display</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View your recipe</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="space-y-6">
              {selectedRecipe ? (
                <div className="prose max-w-none">
                  <MDEditor.Markdown source={selectedRecipe.instructions} />
                </div>
              ) : generatedRecipe && (
                <div className="space-y-6">
                  {/* Recipe Header with Image */}
                  <div className="relative">
                    {isValidUrl(generatedRecipe.images?.main) && (
                      <div className="aspect-video w-full overflow-hidden rounded-lg mb-4">
                        <img
                          src={generatedRecipe.images.main}
                          alt={generatedRecipe.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{generatedRecipe.name}</h3>
                      <p className="text-gray-600 mt-2 leading-relaxed">{generatedRecipe.description}</p>
                    </div>
                  </div>

                  {/* Recipe Info Badges */}
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Prep: {generatedRecipe.preparationTime} mins
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Cook: {generatedRecipe.cookingTime} mins
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {generatedRecipe.servings} servings
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      ₹{generatedRecipe.costEstimate.costPerServing}/serving
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Star className="h-4 w-4" />
                      {generatedRecipe.difficulty}
                    </Badge>
                  </div>

                  {/* Presentation Image */}
                  {isValidUrl(generatedRecipe.images?.presentation) && (
                    <div className="mt-6">
                      <h4 className="text-lg font-semibold mb-3">Final Presentation</h4>
                      <div className="aspect-video w-full overflow-hidden rounded-lg">
                        <img
                          src={generatedRecipe.images.presentation}
                          alt="Final Presentation"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}

                  {/* Plating Suggestions */}
                  {generatedRecipe.images?.plating && generatedRecipe.images.plating.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-lg font-semibold mb-3">Plating Suggestions</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {generatedRecipe.images.plating.map((image, index) => (
                          isValidUrl(image) && (
                            <div key={index} className="aspect-video overflow-hidden rounded-lg">
                              <img
                                src={image}
                                alt={`Plating Suggestion ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Cost Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Cost Breakdown
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <div className="text-sm text-gray-500">Total Cost</div>
                        <div className="text-xl font-semibold">₹{generatedRecipe.costEstimate.totalCost.toFixed(2)}</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <div className="text-sm text-gray-500">Cost per Serving</div>
                        <div className="text-xl font-semibold">₹{generatedRecipe.costEstimate.costPerServing.toFixed(2)}</div>
                      </div>
                      {generatedRecipe.costEstimate.bulkDiscount > 0 && (
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <div className="text-sm text-gray-500">Bulk Discount</div>
                          <div className="text-xl font-semibold text-green-600">
                            -₹{generatedRecipe.costEstimate.bulkDiscount.toFixed(2)}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Cost Breakdown by Category */}
                    <div className="mt-4">
                      <h5 className="text-sm font-medium mb-2">Cost Breakdown by Category</h5>
                      <div className="space-y-2">
                        {generatedRecipe.costEstimate.costBreakdown.map((item, index) => (
                          <div key={index} className="flex items-center justify-between bg-white p-2 rounded">
                            <span className="text-sm">{item.category}</span>
                            <div className="flex items-center gap-4">
                              <span className="text-sm font-medium">₹{item.cost.toFixed(2)}</span>
                              <span className="text-sm text-gray-500">({item.percentage.toFixed(1)}%)</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Ingredients Section */}
                  <div>
                    <h4 className="text-xl font-semibold flex items-center gap-2 mb-4">
                      <ChefHat className="h-5 w-5" />
                      Ingredients
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {generatedRecipe.ingredients.map((ingredient, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex gap-4">
                            {isValidUrl(ingredient.image) && (
                              <div className="w-16 h-16 flex-shrink-0">
                                <img
                                  src={ingredient.image}
                                  alt={ingredient.name}
                                  className="w-full h-full object-cover rounded"
                                />
                              </div>
                            )}
                            <div className="flex-grow">
                              <div className="flex justify-between items-start">
                                <div>
                                  <span className="font-medium">{ingredient.name}</span>
                                  {ingredient.notes && (
                                    <p className="text-sm text-gray-500 mt-1">{ingredient.notes}</p>
                                  )}
                                </div>
                                <span className="text-gray-600 font-medium">
                                  {ingredient.quantity} {ingredient.unit}
                                </span>
                              </div>
                              {ingredient.cost && (
                                <div className="mt-2 space-y-1">
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Cost per {ingredient.cost.unit}</span>
                                    <span className="font-medium">₹{ingredient.cost.perUnit.toFixed(2)}</span>
                                  </div>
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Total Cost</span>
                                    <span className="font-medium">₹{ingredient.cost.total.toFixed(2)}</span>
                                  </div>
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Cost per Serving</span>
                                    <span className="font-medium">₹{ingredient.cost.perServing.toFixed(2)}</span>
                                  </div>
                                  {ingredient.cost.bulkDiscount && ingredient.cost.bulkDiscount > 0 && (
                                    <div className="flex items-center justify-between text-sm text-green-600">
                                      <span>Bulk Discount</span>
                                      <span>-₹{ingredient.cost.bulkDiscount.toFixed(2)}</span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Instructions Section */}
                  <div>
                    <h4 className="text-xl font-semibold flex items-center gap-2 mb-4">
                      <Wand2 className="h-5 w-5" />
                      Instructions
                    </h4>
                    <div className="space-y-6">
                      {generatedRecipe.instructions.map((instruction, index) => (
                        <div key={index} className="flex gap-4">
                          {isValidUrl(instruction.image) && (
                            <div className="w-32 h-32 flex-shrink-0">
                              <img
                                src={instruction.image}
                                alt={`Step ${instruction.step}`}
                                className="w-full h-full object-cover rounded"
                              />
                            </div>
                          )}
                          <div className="flex-grow">
                            <div className="prose max-w-none">
                              <MDEditor.Markdown source={instruction.description} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tips Section */}
                  {generatedRecipe.tips && generatedRecipe.tips.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="text-xl font-semibold flex items-center gap-2 mb-4">
                          <AlertCircle className="h-5 w-5" />
                          Tips
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {generatedRecipe.tips.map((tip, index) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-lg">
                              <div className="flex items-start gap-2">
                                {tip.icon && (
                                  <div className="mt-1">
                                    {/* You can map the icon name to the actual Lucide icon component here */}
                                  </div>
                                )}
                                <div>
                                  <h5 className="font-medium">{tip.title}</h5>
                                  <p className="text-sm text-gray-600 mt-1">{tip.description}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Variations Section */}
                  {generatedRecipe.variations && generatedRecipe.variations.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="text-xl font-semibold flex items-center gap-2 mb-4">
                          <Wand2 className="h-5 w-5" />
                          Variations
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {generatedRecipe.variations.map((variation, index) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-lg">
                              <div className="flex gap-4">
                                {isValidUrl(variation.image) && (
                                  <div className="w-32 h-32 flex-shrink-0">
                                    <img
                                      src={variation.image}
                                      alt={variation.name}
                                      className="w-full h-full object-cover rounded"
                                    />
                                  </div>
                                )}
                                <div className="flex-grow">
                                  <h5 className="font-medium">{variation.name}</h5>
                                  <p className="text-sm text-gray-600 mt-1">{variation.description}</p>
                                  {variation.modifications && variation.modifications.length > 0 && (
                                    <div className="mt-2">
                                      <h6 className="text-sm font-medium">Modifications:</h6>
                                      <ul className="text-sm text-gray-600 list-disc list-inside">
                                        {variation.modifications.map((mod, i) => (
                                          <li key={i}>{mod}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Pairings Section */}
                  {generatedRecipe.pairings && generatedRecipe.pairings.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="text-xl font-semibold flex items-center gap-2 mb-4">
                          <Package className="h-5 w-5" />
                          Suggested Pairings
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {generatedRecipe.pairings.map((pairing, index) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-lg">
                              <div className="flex gap-4">
                                {isValidUrl(pairing.image) && (
                                  <div className="w-32 h-32 flex-shrink-0">
                                    <img
                                      src={pairing.image}
                                      alt={pairing.name}
                                      className="w-full h-full object-cover rounded"
                                    />
                                  </div>
                                )}
                                <div className="flex-grow">
                                  <h5 className="font-medium">{pairing.name}</h5>
                                  <p className="text-sm text-gray-600 mt-1">{pairing.description}</p>
                                  {pairing.reason && (
                                    <p className="text-sm text-gray-500 mt-2">
                                      <span className="font-medium">Why it works:</span> {pairing.reason}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-4 pt-4 border-t">
                    <Button variant="outline" onClick={() => setGeneratedRecipe(null)}>
                      Cancel
                    </Button>
                    <Button onClick={saveGeneratedRecipe}>
                      Save Recipe
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FinancialCalculator; 