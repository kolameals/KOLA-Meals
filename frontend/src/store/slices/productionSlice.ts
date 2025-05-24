import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { productionService } from '../../services/production.service';
import type { ProductionSchedule, ProductionItem, ProductionStatus, ProductionItemStatus } from '../../types/production.types';
import type { CreateScheduleData, UpdateScheduleData, UpdateProductionItemData, MealType } from '../../services/production.service';

// Async thunks
export const fetchSchedules = createAsyncThunk(
  'production/fetchSchedules',
  async (params: { date?: Date; mealType?: MealType } = {}) => {
    return await productionService.getSchedules(params);
  }
);

export const createSchedule = createAsyncThunk(
  'production/createSchedule',
  async (data: CreateScheduleData) => {
    return await productionService.createSchedule(data);
  }
);

export const updateSchedule = createAsyncThunk(
  'production/updateSchedule',
  async ({ id, data }: { id: string; data: UpdateScheduleData }) => {
    return await productionService.updateSchedule(id, data);
  }
);

export const deleteSchedule = createAsyncThunk(
  'production/deleteSchedule',
  async (id: string) => {
    await productionService.deleteSchedule(id);
    return id;
  }
);

export const updateProductionItem = createAsyncThunk(
  'production/updateProductionItem',
  async ({ id, data }: { id: string; data: UpdateProductionItemData }) => {
    return await productionService.updateProductionItem(id, data);
  }
);

export const autoGenerateSchedule = createAsyncThunk(
  'production/autoGenerateSchedule',
  async (data: { date: Date; mealType: MealType; startTime: Date; endTime: Date }) => {
    return await productionService.autoGenerateSchedule(data);
  }
);

// Slice
const productionSlice = createSlice({
  name: 'production',
  initialState: {
    items: [] as ProductionSchedule[],
    loading: false,
    error: null as string | null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch schedules
      .addCase(fetchSchedules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSchedules.fulfilled, (state, action: PayloadAction<ProductionSchedule[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchSchedules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch schedules';
      })
      // Create schedule
      .addCase(createSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSchedule.fulfilled, (state, action: PayloadAction<ProductionSchedule>) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create schedule';
      })
      // Update schedule
      .addCase(updateSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSchedule.fulfilled, (state, action: PayloadAction<ProductionSchedule>) => {
        state.loading = false;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(updateSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update schedule';
      })
      // Delete schedule
      .addCase(deleteSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSchedule.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(deleteSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete schedule';
      })
      // Update production item
      .addCase(updateProductionItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProductionItem.fulfilled, (state, action: PayloadAction<ProductionItem>) => {
        state.loading = false;
        state.items.forEach(schedule => {
          const itemIndex = schedule.items.findIndex(item => item.id === action.payload.id);
          if (itemIndex !== -1) schedule.items[itemIndex] = action.payload;
        });
      })
      .addCase(updateProductionItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update production item';
      })
      // Auto-generate schedule
      .addCase(autoGenerateSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(autoGenerateSchedule.fulfilled, (state, action: PayloadAction<ProductionSchedule[]>) => {
        state.loading = false;
        state.items.push(...action.payload);
      })
      .addCase(autoGenerateSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to auto-generate schedule';
      });
  }
});

export const { clearError } = productionSlice.actions;
export default productionSlice.reducer; 