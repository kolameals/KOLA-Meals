import api from './api';
import type { Meal, CreateMealDto, UpdateMealDto } from '../types/meal.types';

export const mealService = {
  async getMeals(): Promise<{ success: boolean; data: Meal[] }> {
    try {
      const response = await api.get('/meals');
      return response.data;
    } catch (error) {
      console.error('Error fetching meals:', error);
      throw error;
    }
  },

  async getMealById(id: string): Promise<Meal> {
    try {
      const response = await api.get(`/meals/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching meal:', error);
      throw error;
    }
  },

  async createMeal(data: CreateMealDto): Promise<Meal> {
    try {
      const response = await api.post('/meals', data);
      return response.data;
    } catch (error) {
      console.error('Error creating meal:', error);
      throw error;
    }
  },

  async updateMeal(id: string, data: UpdateMealDto): Promise<Meal> {
    try {
      const response = await api.put(`/meals/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating meal:', error);
      throw error;
    }
  },

  async deleteMeal(id: string): Promise<void> {
    try {
      await api.delete(`/meals/${id}`);
    } catch (error) {
      console.error('Error deleting meal:', error);
      throw error;
    }
  },

  async getMealsByType(type: string): Promise<Meal[]> {
    try {
      const response = await api.get('/meals', {
        params: { type },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching meals by type:', error);
      throw error;
    }
  },
}; 