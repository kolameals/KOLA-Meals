import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Plus, Minus, ChefHat, Users, IndianRupee, Package, Building, Zap, Briefcase, Info } from "lucide-react";
import { recipeService } from '../../../services/recipe.service';
import type { Recipe } from '../../../services/recipe.service';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CostBreakdown {
  rawMaterials: number;
  labor: number;
  overhead: number;
  packaging: number;
  total: number;
  profitMargin: number;
  sellingPrice: number;
  profitMarginPercentage: number;
}

interface CustomerCalculation {
  recipeId: string;
  customerCount: number;
  costBreakdown: CostBreakdown;
  costPerCustomer: number;
  rawMaterialsNeeded: {
    name: string;
    quantity: number;
    unit: string;
    totalCost: number;
    costPerUnit: number;
  }[];
}

const FinancialCalculator: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [customerCount, setCustomerCount] = useState<number>(1);
  const [calculation, setCalculation] = useState<CustomerCalculation | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [menuDate, setMenuDate] = useState<Date | null>(null);

  // Cost factors (these could be made configurable through settings)
  const LABOR_COST_PER_HOUR = 200;
  const OVERHEAD_COST_PERCENTAGE = 0.15; // 15% of raw materials cost
  const PACKAGING_COST_PER_MEAL = 10;
  const PROFIT_MARGIN_PERCENTAGE = 0.30; // 30% profit margin
  const MINIMUM_PROFIT_MARGIN = 0.20; // 20% minimum profit margin

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

  const calculateCosts = (recipe: Recipe, customerCount: number): CostBreakdown => {
    // Calculate raw materials cost with proper scaling
    const rawMaterialsCost = recipe.recipeItems.reduce((total, item) => {
      const costPerUnit = item.rawMaterial?.costPerUnit || 0;
      const scaledQuantity = item.quantity * (customerCount / recipe.servings);
      return total + (scaledQuantity * costPerUnit);
    }, 0);

    // Calculate labor cost based on preparation and cooking time
    // Consider economies of scale for larger batches
    const totalTimeInHours = (recipe.preparationTime + recipe.cookingTime) / 60;
    const scaleFactor = Math.min(1, 1 / Math.sqrt(customerCount / recipe.servings)); // Efficiency increases with scale
    const laborCost = totalTimeInHours * LABOR_COST_PER_HOUR * scaleFactor * (customerCount / recipe.servings);

    // Calculate overhead cost (fixed + variable)
    const fixedOverhead = 1000; // Base overhead cost
    const variableOverhead = rawMaterialsCost * OVERHEAD_COST_PERCENTAGE;
    const overheadCost = fixedOverhead + variableOverhead;

    // Calculate packaging cost with bulk discount
    const bulkDiscount = customerCount > 50 ? 0.1 : 0; // 10% discount for orders over 50
    const packagingCost = PACKAGING_COST_PER_MEAL * customerCount * (1 - bulkDiscount);

    // Calculate total cost
    const totalCost = rawMaterialsCost + laborCost + overheadCost + packagingCost;

    // Calculate profit margin and selling price
    const profitMargin = totalCost * PROFIT_MARGIN_PERCENTAGE;
    const sellingPrice = totalCost + profitMargin;
    const profitMarginPercentage = (profitMargin / sellingPrice) * 100;

    return {
      rawMaterials: rawMaterialsCost,
      labor: laborCost,
      overhead: overheadCost,
      packaging: packagingCost,
      total: totalCost,
      profitMargin,
      sellingPrice,
      profitMarginPercentage
    };
  };

  const calculateForCustomers = () => {
    if (!selectedRecipe) return;

    const costBreakdown = calculateCosts(selectedRecipe, customerCount);
    const rawMaterialsNeeded = selectedRecipe.recipeItems.map(item => {
      const scaledQuantity = item.quantity * (customerCount / selectedRecipe.servings);
      const costPerUnit = item.rawMaterial?.costPerUnit || 0;
      return {
        name: item.rawMaterial?.name || 'Unknown',
        quantity: scaledQuantity,
        unit: item.unit,
        totalCost: scaledQuantity * costPerUnit,
        costPerUnit: costPerUnit
      };
    });

    setCalculation({
      recipeId: selectedRecipe.id,
      customerCount,
      costBreakdown,
      costPerCustomer: costBreakdown.total / customerCount,
      rawMaterialsNeeded
    });
  };

  const addToMenu = async () => {
    if (!selectedRecipe || !calculation || !menuDate) return;

    try {
      // Here you would make an API call to save to the menu
      // Example structure:
      const menuItem = {
        recipeId: selectedRecipe.id,
        date: menuDate,
        customerCount: customerCount,
        costBreakdown: calculation.costBreakdown,
        sellingPrice: calculation.costBreakdown.sellingPrice,
        profitMargin: calculation.costBreakdown.profitMarginPercentage
      };

      // TODO: Implement the API call to save the menu item
      console.log('Adding to menu:', menuItem);
      
      // Show success message
      alert(`Successfully added ${selectedRecipe.name} to menu for ${format(menuDate, 'PPP')}`);
    } catch (error) {
      console.error('Error adding to menu:', error);
      alert('Failed to add to menu. Please try again.');
    }
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
          <h2 className="text-2xl font-semibold">Recipe Calculator</h2>
          <p className="text-sm text-gray-500 mt-1">Calculate costs and pricing for your recipes</p>
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
                disabled={(date) => date < new Date()} // Disable past dates
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recipe Selection */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Recipe Details</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Select a recipe to calculate costs and pricing</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label>Recipe</Label>
              <Select
                value={selectedRecipe?.id}
                onValueChange={(value) => {
                  const recipe = recipes.find(r => r.id === value);
                  setSelectedRecipe(recipe || null);
                  setCalculation(null);
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
        </Card>

        {/* Customer Calculation */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Cost Calculation</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Calculate costs based on number of customers</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <Label>Number of Customers</Label>
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

            <Button
              className="w-full"
              onClick={calculateForCustomers}
              disabled={!selectedRecipe}
            >
              Calculate Costs
            </Button>

            {calculation && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4 bg-green-50">
                    <div className="flex items-center gap-2">
                      <IndianRupee className="h-4 w-4 text-green-600" />
                      <div>
                        <Label className="text-green-600">Total Cost</Label>
                        <div className="text-xl font-bold text-green-700">₹{calculation.costBreakdown.total.toFixed(2)}</div>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4 bg-blue-50">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      <div>
                        <Label className="text-blue-600">Cost per Customer</Label>
                        <div className="text-xl font-bold text-blue-700">₹{calculation.costPerCustomer.toFixed(2)}</div>
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4 bg-purple-50">
                    <div className="flex items-center gap-2">
                      <ChefHat className="h-4 w-4 text-purple-600" />
                      <div>
                        <Label className="text-purple-600">Raw Materials</Label>
                        <div className="text-lg font-bold text-purple-700">₹{calculation.costBreakdown.rawMaterials.toFixed(2)}</div>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4 bg-orange-50">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-orange-600" />
                      <div>
                        <Label className="text-orange-600">Labor Cost</Label>
                        <div className="text-lg font-bold text-orange-700">₹{calculation.costBreakdown.labor.toFixed(2)}</div>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4 bg-teal-50">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-teal-600" />
                      <div>
                        <Label className="text-teal-600">Overhead</Label>
                        <div className="text-lg font-bold text-teal-700">₹{calculation.costBreakdown.overhead.toFixed(2)}</div>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4 bg-pink-50">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-pink-600" />
                      <div>
                        <Label className="text-pink-600">Packaging</Label>
                        <div className="text-lg font-bold text-pink-700">₹{calculation.costBreakdown.packaging.toFixed(2)}</div>
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4 bg-indigo-50">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-indigo-600" />
                      <div>
                        <Label className="text-indigo-600">Profit Margin</Label>
                        <div className="text-lg font-bold text-indigo-700">₹{calculation.costBreakdown.profitMargin.toFixed(2)}</div>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4 bg-cyan-50">
                    <div className="flex items-center gap-2">
                      <IndianRupee className="h-4 w-4 text-cyan-600" />
                      <div>
                        <Label className="text-cyan-600">Suggested Price</Label>
                        <div className="text-lg font-bold text-cyan-700">₹{calculation.costBreakdown.sellingPrice.toFixed(2)}</div>
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <Label className="text-gray-700">Raw Materials Needed</Label>
                  <div className="mt-2 space-y-2">
                    {calculation.rawMaterialsNeeded.map((material, index) => (
                      <div key={index} className="flex justify-between text-sm bg-white p-2 rounded">
                        <span className="font-medium">{material.name}</span>
                        <span className="text-gray-600">
                          {material.quantity.toFixed(2)} {material.unit}
                          <span className="ml-2 text-gray-500">
                            (₹{material.costPerUnit.toFixed(2)}/unit)
                          </span>
                          <span className="ml-2 text-gray-500">
                            Total: ₹{material.totalCost.toFixed(2)}
                          </span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={addToMenu}
                  disabled={!menuDate}
                >
                  Add to Menu
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FinancialCalculator; 