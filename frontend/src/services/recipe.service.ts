import api from './api';

export interface RecipeItem {
  id: string;
  rawMaterialId: string;
  quantity: number;
  unit: string;
  rawMaterial?: {
    name: string;
    unit: string;
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
  createdAt: string;
  updatedAt: string;
  recipeItems: RecipeItem[];
}

export const recipeService = {
  async getRecipes(): Promise<Recipe[]> {
    const response = await api.get('/recipes');
    return response.data.data;
  },

  async getRecipeById(id: string): Promise<Recipe> {
    const response = await api.get(`/recipes/${id}`);
    return response.data.data;
  },

  async createRecipe(data: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt' | 'recipeItems'> & {
    recipeItems: Omit<RecipeItem, 'id'>[];
  }): Promise<Recipe> {
    const response = await api.post('/recipes', data);
    return response.data.data;
  },

  async updateRecipe(id: string, data: Partial<Omit<Recipe, 'id' | 'createdAt' | 'updatedAt' | 'recipeItems'>> & {
    recipeItems?: Omit<RecipeItem, 'id'>[];
  }): Promise<Recipe> {
    const response = await api.put(`/recipes/${id}`, data);
    return response.data.data;
  },

  async deleteRecipe(id: string): Promise<void> {
    await api.delete(`/recipes/${id}`);
  },

  async calculateCost(recipeItems: Omit<RecipeItem, 'id'>[]): Promise<number> {
    const response = await api.post('/recipes/calculate-cost', { recipeItems });
    return response.data.data.cost;
  }
}; 