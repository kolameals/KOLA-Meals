import api from './api';
import type { SubscriptionPlan } from '../types/subscription';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  mealsPerDay: number;
  description: string;
}

export interface CreateSubscriptionData {
  planId: string;
  addressId: string;
  startDate: Date;
  endDate: Date;
}

export const createSubscription = async (data: CreateSubscriptionData) => {
  try {
    const response = await api.post('/subscriptions', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create subscription');
  }
}; 