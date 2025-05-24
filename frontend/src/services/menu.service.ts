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
      const response = await api.get('/daily-menu', {
        params: {
          date: date.toISOString(),
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching daily menu:', error);
      throw error;
    }
  },

  async createDailyMenu(data: CreateDailyMenuDto): Promise<DailyMenu> {
    try {
      const response = await api.post('/daily-menu', data);
      return response.data;
    } catch (error) {
      console.error('Error creating daily menu:', error);
      throw error;
    }
  },

  async updateDailyMenu(id: string, data: UpdateDailyMenuDto): Promise<DailyMenu> {
    try {
      const response = await api.put(`/daily-menu/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating daily menu:', error);
      throw error;
    }
  },

  // Menu Items
  async createMenuItem(data: CreateMenuItemDto): Promise<MenuItem> {
    try {
      const response = await api.post('/menu-items', data);
      return response.data;
    } catch (error) {
      console.error('Error creating menu item:', error);
      throw error;
    }
  },

  async updateMenuItem(id: string, data: UpdateMenuItemDto): Promise<MenuItem> {
    try {
      const response = await api.put(`/menu-items/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating menu item:', error);
      throw error;
    }
  },

  async deleteMenuItem(id: string): Promise<void> {
    try {
      await api.delete(`/menu-items/${id}`);
    } catch (error) {
      console.error('Error deleting menu item:', error);
      throw error;
    }
  },
}; 