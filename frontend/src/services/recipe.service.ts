import { recipeApi } from './api';
import { MealCategory, MealType } from './meal.service';

export interface RecipeItem {
  id: string;
  rawMaterialId: string;
  quantity: number;
  unit: string;
  rawMaterial?: {
    name: string;
    unit: string;
    costPerUnit: number;
  };
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  instructions: string;
  preparationTime: number;
  cookingTime: number;
  servings: number;
  costPerServing: number;
  mealId: string;
  category: MealCategory;
  type: MealType;
  createdAt: string;
  updatedAt: string;
  recipeItems: RecipeItem[];
  imageUrl?: string;
}

export const recipeService = {
  async getRecipes(): Promise<Recipe[]> {
    const response = await recipeApi.get('/recipes');
    return response.data.data;
  },

  async getRecipeById(id: string): Promise<Recipe> {
    const response = await recipeApi.get(`/recipes/${id}`);
    return response.data.data;
  },

  async createRecipe(data: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt' | 'recipeItems'> & {
    recipeItems: Omit<RecipeItem, 'id'>[];
  }): Promise<Recipe> {
    const response = await recipeApi.post('/recipes', data);
    return response.data.data;
  },

  async updateRecipe(id: string, data: Partial<Omit<Recipe, 'id' | 'createdAt' | 'updatedAt' | 'recipeItems'>> & {
    recipeItems?: Omit<RecipeItem, 'id'>[];
  }): Promise<Recipe> {
    const response = await recipeApi.put(`/recipes/${id}`, data);
    return response.data.data;
  },

  async deleteRecipe(id: string): Promise<void> {
    await recipeApi.delete(`/recipes/${id}`);
  },

  async calculateCost(recipeItems: Omit<RecipeItem, 'id'>[]): Promise<number> {
    const response = await recipeApi.post('/recipes/calculate-cost', { recipeItems });
    return response.data.data.cost;
  },

  async generateRecipe(prompt: string, servings: number = 1) {
    try {
      const response = await recipeApi.post('/recipes/generate', { prompt, servings });
      return response.data;
    } catch (error) {
      console.error('Error generating recipe:', error);
      throw error;
    }
  }
}; 