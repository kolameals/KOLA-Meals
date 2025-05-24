import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { inventoryService, type InventoryItem, type CreateInventoryItemDto, type UpdateStockDto, type WasteRecord, type RecordWasteDto } from '../../services/inventory.service';

interface InventoryState {
  items: InventoryItem[];
  wasteRecords: WasteRecord[];
  loading: boolean;
  error: string | null;
}

const initialState: InventoryState = {
  items: [],
  wasteRecords: [],
  loading: false,
  error: null
};

export const fetchInventoryItems = createAsyncThunk(
  'inventory/fetchAll',
  async () => {
    return await inventoryService.getInventoryItems();
  }
);

export const fetchLowStockItems = createAsyncThunk(
  'inventory/fetchLowStock',
  async () => {
    return await inventoryService.getLowStockItems();
  }
);

export const createInventoryItem = createAsyncThunk(
  'inventory/create',
  async (data: CreateInventoryItemDto) => {
    return await inventoryService.createInventoryItem(data);
  }
);

export const updateStock = createAsyncThunk(
  'inventory/updateStock',
  async ({ itemId, data }: { itemId: string; data: UpdateStockDto }) => {
    return await inventoryService.updateStock(itemId, data);
  }
);

export const recordWaste = createAsyncThunk(
  'inventory/recordWaste',
  async ({ itemId, data }: { itemId: string; data: RecordWasteDto }) => {
    return await inventoryService.recordWaste(itemId, data);
  }
);

export const fetchWasteRecords = createAsyncThunk(
  'inventory/fetchWasteRecords',
  async () => {
    return await inventoryService.getWasteRecords();
  }
);

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchInventoryItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventoryItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchInventoryItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch inventory items';
      })
      // Fetch low stock
      .addCase(fetchLowStockItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLowStockItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchLowStockItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch low stock items';
      })
      // Create
      .addCase(createInventoryItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Update stock
      .addCase(updateStock.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Record waste
      .addCase(recordWaste.fulfilled, (state, action) => {
        const { wasteRecord, updatedItem } = action.payload;
        state.wasteRecords.push(wasteRecord);
        const index = state.items.findIndex(item => item.id === updatedItem.id);
        if (index !== -1) {
          state.items[index] = updatedItem;
        }
      })
      // Fetch waste records
      .addCase(fetchWasteRecords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWasteRecords.fulfilled, (state, action) => {
        state.loading = false;
        state.wasteRecords = action.payload;
      })
      .addCase(fetchWasteRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch waste records';
      });
  }
});

export const { clearError } = inventorySlice.actions;
export default inventorySlice.reducer; 