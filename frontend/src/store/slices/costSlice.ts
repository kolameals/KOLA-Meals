import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { costService } from '@/services/cost.service';
import { 
  StaffCost, 
  EquipmentCost, 
  FacilityCost, 
  CostSummary,
  DeliveryCostConfig
} from '@/types/cost.types';

interface FetchCostsParams {
  startDate: Date;
  endDate: Date;
}

interface CostState {
  staffCosts: StaffCost[];
  equipmentCosts: EquipmentCost[];
  facilityCosts: FacilityCost[];
  costSummary: CostSummary | null;
  deliveryCostConfig: DeliveryCostConfig | null;
  loading: boolean;
  error: string | null;
}

const initialState: CostState = {
  staffCosts: [],
  equipmentCosts: [],
  facilityCosts: [],
  costSummary: null,
  deliveryCostConfig: null,
  loading: false,
  error: null
};

// Fetch delivery cost configuration
export const fetchDeliveryCostConfig = createAsyncThunk(
  'costs/fetchDeliveryCostConfig',
  async () => {
    const response = await costService.getDeliveryCostConfig();
    return response;
  }
);

// Update delivery cost configuration
export const updateDeliveryCostConfig = createAsyncThunk(
  'costs/updateDeliveryCostConfig',
  async (config: { costPerAgent: number }) => {
    const response = await costService.updateDeliveryCostConfig(config);
    return response;
  }
);

// Fetch staff costs
export const fetchStaffCosts = createAsyncThunk(
  'costs/fetchStaffCosts',
  async () => {
    const response = await costService.getStaffCosts();
    return response;
  }
);

// Fetch equipment costs
export const fetchEquipmentCosts = createAsyncThunk(
  'costs/fetchEquipmentCosts',
  async () => {
    const response = await costService.getEquipmentCosts();
    return response;
  }
);

// Create equipment cost
export const createEquipmentCost = createAsyncThunk(
  'costs/createEquipmentCost',
  async (data: Omit<EquipmentCost, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await costService.createEquipmentCost(data);
    return response;
  }
);

// Fetch facility costs
export const fetchFacilityCosts = createAsyncThunk(
  'costs/fetchFacilityCosts',
  async () => {
    const response = await costService.getFacilityCosts();
    return response;
  }
);

// Create facility cost
export const createFacilityCost = createAsyncThunk(
  'costs/createFacilityCost',
  async (data: Omit<FacilityCost, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await costService.createFacilityCost(data);
    return response;
  }
);

// Fetch cost summary
export const fetchCostSummary = createAsyncThunk(
  'costs/fetchCostSummary',
  async (params: FetchCostsParams) => {
    const response = await costService.getCostSummary(params.startDate, params.endDate);
    return response;
  }
);

const costSlice = createSlice({
  name: 'costs',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch delivery cost config
      .addCase(fetchDeliveryCostConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeliveryCostConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.deliveryCostConfig = action.payload;
      })
      .addCase(fetchDeliveryCostConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch delivery cost configuration';
      })

      // Update delivery cost config
      .addCase(updateDeliveryCostConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDeliveryCostConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.deliveryCostConfig = action.payload;
      })
      .addCase(updateDeliveryCostConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update delivery cost configuration';
      })

      // Fetch staff costs
      .addCase(fetchStaffCosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStaffCosts.fulfilled, (state, action) => {
        state.loading = false;
        state.staffCosts = action.payload;
      })
      .addCase(fetchStaffCosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch staff costs';
      })

      // Fetch equipment costs
      .addCase(fetchEquipmentCosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEquipmentCosts.fulfilled, (state, action) => {
        state.loading = false;
        state.equipmentCosts = action.payload;
      })
      .addCase(fetchEquipmentCosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch equipment costs';
      })

      // Create equipment cost
      .addCase(createEquipmentCost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEquipmentCost.fulfilled, (state, action) => {
        state.loading = false;
        state.equipmentCosts.unshift(action.payload);
      })
      .addCase(createEquipmentCost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create equipment cost';
      })

      // Fetch facility costs
      .addCase(fetchFacilityCosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFacilityCosts.fulfilled, (state, action) => {
        state.loading = false;
        state.facilityCosts = action.payload;
      })
      .addCase(fetchFacilityCosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch facility costs';
      })

      // Create facility cost
      .addCase(createFacilityCost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFacilityCost.fulfilled, (state, action) => {
        state.loading = false;
        state.facilityCosts.unshift(action.payload);
      })
      .addCase(createFacilityCost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create facility cost';
      })

      // Fetch cost summary
      .addCase(fetchCostSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCostSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.costSummary = action.payload;
      })
      .addCase(fetchCostSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch cost summary';
      });
  }
});

export const { clearError } = costSlice.actions;
export default costSlice.reducer; 