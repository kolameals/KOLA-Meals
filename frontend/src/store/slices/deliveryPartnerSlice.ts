import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { deliveryPartnerService } from '../../services/deliveryPartner.service';
import type { DeliveryPartner } from '../../services/deliveryPartner.service';

interface DeliveryPartnerState {
  partners: DeliveryPartner[];
  loading: boolean;
  error: string | null;
}

const initialState: DeliveryPartnerState = {
  partners: [],
  loading: false,
  error: null
};

export const fetchDeliveryPartners = createAsyncThunk(
  'deliveryPartner/fetchPartners',
  async () => {
    return await deliveryPartnerService.getDeliveryPartners();
  }
);

export const addDeliveryPartner = createAsyncThunk(
  'deliveryPartner/addPartner',
  async (data: Omit<DeliveryPartner, 'id' | 'createdAt' | 'updatedAt'> & { password: string }) => {
    return await deliveryPartnerService.createDeliveryPartner(data);
  }
);

export const updateDeliveryPartner = createAsyncThunk(
  'deliveryPartner/updatePartner',
  async ({ id, data }: { id: string; data: Partial<DeliveryPartner> }) => {
    return await deliveryPartnerService.updateDeliveryPartner(id, data);
  }
);

export const deleteDeliveryPartner = createAsyncThunk(
  'deliveryPartner/deletePartner',
  async (id: string) => {
    await deliveryPartnerService.deleteDeliveryPartner(id);
    return id;
  }
);

const deliveryPartnerSlice = createSlice({
  name: 'deliveryPartner',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDeliveryPartners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeliveryPartners.fulfilled, (state, action) => {
        state.loading = false;
        state.partners = action.payload;
      })
      .addCase(fetchDeliveryPartners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch delivery partners';
      })
      .addCase(addDeliveryPartner.fulfilled, (state, action) => {
        state.partners.push(action.payload);
      })
      .addCase(updateDeliveryPartner.fulfilled, (state, action) => {
        const index = state.partners.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.partners[index] = action.payload;
        }
      })
      .addCase(deleteDeliveryPartner.fulfilled, (state, action) => {
        state.partners = state.partners.filter(p => p.id !== action.payload);
      });
  }
});

export default deliveryPartnerSlice.reducer; 