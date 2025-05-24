import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
                                                                                                                                                                                                                                                                                                                                                                                                                import { recipeService } from '../../services/recipe.service';
import type { Recipe, RecipeItem } from '../../services/recipe.service';

interface RecipeState {
  items: Recipe[];
  loading: boolean;
  error: string | null;
}

const initialState: RecipeState = {
  items: [],
  loading: false,
  error: null
};

export const fetchRecipes = createAsyncThunk(
  'recipes/fetchAll',
  async () => {
    return await recipeService.getRecipes();
  }
);

export const addRecipe = createAsyncThunk(
  'recipes/add',
  async (data: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt' | 'recipeItems'> & {
    recipeItems: Omit<RecipeItem, 'id'>[];
  }) => {
    return await recipeService.createRecipe(data);
  }
);

export const updateRecipe = createAsyncThunk(
  'recipes/update',
  async ({ id, data }: {
    id: string;
    data: Partial<Omit<Recipe, 'id' | 'createdAt' | 'updatedAt' | 'recipeItems'>> & {
      recipeItems?: Omit<RecipeItem, 'id'>[];
    };
  }) => {
    return await recipeService.updateRecipe(id, data);
  }
);

export const deleteRecipe = createAsyncThunk(
  'recipes/delete',
  async (id: string) => {
    await recipeService.deleteRecipe(id);
    return id;
  }
);

const recipeSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch recipes';
      })
      // Add
      .addCase(addRecipe.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Update
      .addCase(updateRecipe.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete
      .addCase(deleteRecipe.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      });
  }
});

export default recipeSlice.reducer; 