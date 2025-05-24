import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createAddress, type Address } from '../../services/address.service';
import { createSubscription, type CreateSubscriptionData } from '../../services/subscription.service';
import { initializePayment, type InitializePaymentData } from '../../services/payment.service';

interface SubscriptionState {
  loading: boolean;
  error: string | null;
  address: Address | null;
  subscription: any | null;
  paymentLink: string | null;
}

const initialState: SubscriptionState = {
  loading: false,
  error: null,
  address: null,
  subscription: null,
  paymentLink: null,
};

export const createUserAddress = createAsyncThunk(
  'subscription/createAddress',
  async (address: Address) => {
    const response = await createAddress(address);
    return response;
  }
);

export const createUserSubscription = createAsyncThunk(
  'subscription/createSubscription',
  async (data: CreateSubscriptionData) => {
    const response = await createSubscription(data);
    return response;
  }
);

export const initializeUserPayment = createAsyncThunk(
  'subscription/initializePayment',
  async (data: InitializePaymentData) => {
    const response = await initializePayment(data);
    return response;
  }
);

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    clearSubscriptionState: (state) => {
      state.loading = false;
      state.error = null;
      state.address = null;
      state.subscription = null;
      state.paymentLink = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Address
      .addCase(createUserAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUserAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.address = action.payload;
      })
      .addCase(createUserAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create address';
      })
      // Create Subscription
      .addCase(createUserSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUserSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.subscription = action.payload;
      })
      .addCase(createUserSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create subscription';
      })
      // Initialize Payment
      .addCase(initializeUserPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initializeUserPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentLink = action.payload.paymentLink;
      })
      .addCase(initializeUserPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to initialize payment';
      });
  },
});

export const { clearSubscriptionState } = subscriptionSlice.actions;
export default subscriptionSlice.reducer; 