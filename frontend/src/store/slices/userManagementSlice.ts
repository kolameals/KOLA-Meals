import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userManagementService } from '../../services/userManagement.service';
import type { User, CreateUserData, UpdateUserData } from '../../types/user.types';

interface UserManagementState {
  users: User[];
  deliveryPartners: User[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  totalPages: number;
}

const initialState: UserManagementState = {
  users: [],
  deliveryPartners: [],
  loading: false,
  error: null,
  total: 0,
  page: 1,
  totalPages: 1
};

export const fetchUsers = createAsyncThunk(
  'userManagement/fetchUsers',
  async ({ page, limit }: { page: number; limit: number }) => {
    const response = await userManagementService.getUsers(page, limit);
    return response;
  }
);

export const createUser = createAsyncThunk(
  'userManagement/createUser',
  async (userData: CreateUserData) => {
    const response = await userManagementService.createUser(userData);
    return response;
  }
);

export const updateUser = createAsyncThunk(
  'userManagement/updateUser',
  async ({ userId, userData }: { userId: string; userData: UpdateUserData }) => {
    const response = await userManagementService.updateUser(userId, userData);
    return response;
  }
);

export const deleteUser = createAsyncThunk(
  'userManagement/deleteUser',
  async (userId: string) => {
    await userManagementService.deleteUser(userId);
    return userId;
  }
);

export const fetchDeliveryPartners = createAsyncThunk(
  'userManagement/fetchDeliveryPartners',
  async ({ page, limit }: { page: number; limit: number }) => {
    const response = await userManagementService.getDeliveryPartners(page, limit);
    return response;
  }
);

const userManagementSlice = createSlice({
  name: 'userManagement',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      })
      // Create User
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = [action.payload, ...state.users];
        state.total += 1;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create user';
      })
      // Update User
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update user';
      })
      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(user => user.id !== action.payload);
        state.total -= 1;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete user';
      })
      // Fetch Delivery Partners
      .addCase(fetchDeliveryPartners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeliveryPartners.fulfilled, (state, action) => {
        state.loading = false;
        state.deliveryPartners = action.payload.users;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchDeliveryPartners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch delivery partners';
      });
  }
});

export const { clearError } = userManagementSlice.actions;
export default userManagementSlice.reducer; 