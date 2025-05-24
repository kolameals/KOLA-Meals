import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { mealService } from '../../services/meal.service';
import type { Meal } from '../../services/meal.service';

interface MealState {
  meals: Meal[];
  loading: boolean;
  error: string | null;
}

const initialState: MealState = {
  meals: [],
  loading: false,
  error: null
};

export const fetchMeals = createAsyncThunk(
  'meal/fetchMeals',
  async () => {
    return await mealService.getMeals();
  }
);

export const addMeal = createAsyncThunk(
  'meal/addMeal',
  async (data: Omit<Meal, 'id' | 'createdAt' | 'updatedAt'>) => {
    return await mealService.createMeal(data);
  }
);

export const updateMeal = createAsyncThunk(
  'meal/updateMeal',
  async ({ id, data }: { id: string; data: Partial<Meal> }) => {
    return await mealService.updateMeal(id, data);
  }
);

export const deleteMeal = createAsyncThunk(
  'meal/deleteMeal',
  async (id: string) => {
    await mealService.deleteMeal(id);
    return id;
  }
);

const mealSlice = createSlice({
  name: 'meal',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMeals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMeals.fulfilled, (state, action) => {
        state.loading = false;
        state.meals = action.payload;
      })
      .addCase(fetchMeals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch meals';
      })
      .addCase(addMeal.fulfilled, (state, action) => {
        state.meals.push(action.payload);
      })
      .addCase(updateMeal.fulfilled, (state, action) => {
        const index = state.meals.findIndex(m => m.id === action.payload.id);
        if (index !== -1) {
          state.meals[index] = action.payload;
        }
      })
      .addCase(deleteMeal.fulfilled, (state, action) => {
        state.meals = state.meals.filter(m => m.id !== action.payload);
      });
  }
});

export default mealSlice.reducer; 