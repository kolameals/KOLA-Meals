import api from './api';
import type {
  MenuCalendar,
  DailyMenu,
  MenuItem,
  CreateMenuItemDto,
  UpdateMenuItemDto,
  CreateDailyMenuDto,
  UpdateDailyMenuDto,
  CreateMenuCalendarDto,
  UpdateMenuCalendarDto,
} from '../types/menu.types';

export class MenuNotFoundError extends Error {
  constructor(date: Date) {
    super(`No menu found for date: ${date.toISOString()}`);
    this.name = 'MenuNotFoundError';
  }
}

export const menuService = {
  // Menu Calendar
  async getMenuCalendarByDateRange(startDate: Date, endDate: Date): Promise<MenuCalendar> {
    try {
      const response = await api.get('/menu-calendar', {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching menu calendar:', error);
      throw error;
    }
  },

  async createMenuCalendar(data: CreateMenuCalendarDto): Promise<MenuCalendar> {
    try {
      const response = await api.post('/menu-calendar', data);
      return response.data;
    } catch (error) {
      console.error('Error creating menu calendar:', error);
      throw error;
    }
  },

  async updateMenuCalendar(id: string, data: UpdateMenuCalendarDto): Promise<MenuCalendar> {
    try {
      const response = await api.put(`/menu-calendar/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating menu calendar:', error);
      throw error;
    }
  },

  // Daily Menu
  async getDailyMenuByDate(date: Date): Promise<DailyMenu> {
    try {
      const response = await api.get(`/menu/daily/${date.toISOString()}`);
      return {
        ...response.data,
        date: response.data.date
      };
    } catch (error: any) {
      if (error.response?.data?.error === 'Daily menu not found') {
        throw new MenuNotFoundError(date);
      }
      console.error('Error fetching daily menu:', error);
      throw new Error('Failed to fetch daily menu');
    }
  },

  async createDailyMenu(data: CreateDailyMenuDto): Promise<DailyMenu> {
    try {
      console.log('Creating daily menu with data:', data);
      const response = await api.post('/menu/daily', {
        date: data.date,
        items: data.items || []
      });
      console.log('Create daily menu response:', response.data);
      return {
        ...response.data,
        date: response.data.date
      };
    } catch (error: any) {
      console.error('Error creating daily menu:', error.response?.data || error);
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Failed to create daily menu');
    }
  },

  async updateDailyMenu(id: string, data: UpdateDailyMenuDto): Promise<DailyMenu> {
    try {
      const response = await api.put(`/menu/daily/${id}`, data);
      return {
        ...response.data,
        date: response.data.date
      };
    } catch (error) {
      console.error('Error updating daily menu:', error);
      throw new Error('Failed to update daily menu');
    }
  },

  // Menu Items
  async createMenuItem(data: CreateMenuItemDto): Promise<MenuItem> {
    try {
      const response = await api.post('/menu/items', data);
      return response.data;
    } catch (error) {
      console.error('Error creating menu item:', error);
      throw new Error('Failed to create menu item');
    }
  },

  async updateMenuItem(id: string, data: UpdateMenuItemDto): Promise<MenuItem> {
    try {
      const response = await api.patch(`/menu/items/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating menu item:', error);
      throw new Error('Failed to update menu item');
    }
  },

  async deleteMenuItem(id: string): Promise<void> {
    try {
      await api.delete(`/menu/items/${id}`);
    } catch (error) {
      console.error('Error deleting menu item:', error);
      throw new Error('Failed to delete menu item');
    }
  },

  async getMeals(): Promise<any[]> {
    try {
      const response = await api.get('/meals');
      return response.data;
    } catch (error) {
      console.error('Error fetching meals:', error);
      throw new Error('Failed to fetch meals');
    }
  },
}; 