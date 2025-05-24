import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { rawMaterialService } from '../../services/rawMaterial.service';
import type { RawMaterial } from '../../services/rawMaterial.service';

interface RawMaterialState {
  items: RawMaterial[];
  loading: boolean;
  error: string | null;
}

const initialState: RawMaterialState = {
  items: [],
  loading: false,
  error: null
};

export const fetchRawMaterials = createAsyncThunk(
  'rawMaterials/fetchAll',
  async () => {
    return await rawMaterialService.getRawMaterials();
  }
);

export const addRawMaterial = createAsyncThunk(
  'rawMaterials/add',
  async (data: Omit<RawMaterial, 'id' | 'createdAt' | 'lastUpdated'>) => {
    return await rawMaterialService.createRawMaterial(data);
  }
);

export const updateRawMaterial = createAsyncThunk(
  'rawMaterials/update',
  async ({ id, data }: { id: string; data: Partial<Omit<RawMaterial, 'id' | 'createdAt' | 'lastUpdated'>> }) => {
    return await rawMaterialService.updateRawMaterial(id, data);
  }
);

export const deleteRawMaterial = createAsyncThunk(
  'rawMaterials/delete',
  async (id: string) => {
    await rawMaterialService.deleteRawMaterial(id);
    return id;
  }
);

export const updateStock = createAsyncThunk(
  'rawMaterials/updateStock',
  async ({ id, quantity }: { id: string; quantity: number }) => {
    return await rawMaterialService.updateStock(id, quantity);
  }
);

const rawMaterialSlice = createSlice({
  name: 'rawMaterials',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchRawMaterials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRawMaterials.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchRawMaterials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch raw materials';
      })
      // Add
      .addCase(addRawMaterial.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Update
      .addCase(updateRawMaterial.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete
      .addCase(deleteRawMaterial.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      // Update stock
      .addCase(updateStock.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  }
});

export default rawMaterialSlice.reducer; 