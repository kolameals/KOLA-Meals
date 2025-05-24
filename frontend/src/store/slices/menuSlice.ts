import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Menu, MenuItem } from '../../types/menu.types';
import { menuService } from '../../services/menu.service';

interface MenuState {
  menus: Menu[];
  currentMenu: Menu | null;
  loading: boolean;
  error: string | null;
}

const initialState: MenuState = {
  menus: [],
  currentMenu: null,
  loading: false,
  error: null
};

export const fetchMenus = createAsyncThunk(
  'menu/fetchMenus',
  async () => {
    const response = await menuService.getMenus();
    return response;
  }
);

export const fetchMenuById = createAsyncThunk(
  'menu/fetchMenuById',
  async (menuId: string) => {
    const response = await menuService.getMenuById(menuId);
    return response;
  }
);

export const createMenu = createAsyncThunk(
  'menu/createMenu',
  async (menuData: Partial<Menu>) => {
    const response = await menuService.createMenu(menuData);
    return response;
  }
);

export const updateMenu = createAsyncThunk(
  'menu/updateMenu',
  async ({ menuId, menuData }: { menuId: string; menuData: Partial<Menu> }) => {
    const response = await menuService.updateMenu(menuId, menuData);
    return response;
  }
);

export const deleteMenu = createAsyncThunk(
  'menu/deleteMenu',
  async (menuId: string) => {
    await menuService.deleteMenu(menuId);
    return menuId;
  }
);

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    clearCurrentMenu: (state) => {
      state.currentMenu = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Menus
      .addCase(fetchMenus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenus.fulfilled, (state, action) => {
        state.loading = false;
        state.menus = action.payload;
      })
      .addCase(fetchMenus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch menus';
      })
      // Fetch Menu by ID
      .addCase(fetchMenuById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenuById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMenu = action.payload;
      })
      .addCase(fetchMenuById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch menu';
      })
      // Create Menu
      .addCase(createMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.menus.push(action.payload);
      })
      .addCase(createMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create menu';
      })
      // Update Menu
      .addCase(updateMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMenu.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentMenu?.id === action.payload.id) {
          state.currentMenu = action.payload;
        }
        const index = state.menus.findIndex(menu => menu.id === action.payload.id);
        if (index !== -1) {
          state.menus[index] = action.payload;
        }
      })
      .addCase(updateMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update menu';
      })
      // Delete Menu
      .addCase(deleteMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.menus = state.menus.filter(menu => menu.id !== action.payload);
        if (state.currentMenu?.id === action.payload) {
          state.currentMenu = null;
        }
      })
      .addCase(deleteMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete menu';
      });
  }
});

export const { clearCurrentMenu, clearError } = menuSlice.actions;
export default menuSlice.reducer; 