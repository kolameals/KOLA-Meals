import api from './api';
import type { InitializePaymentData } from '../types/payment';

export const initializePayment = async (data: InitializePaymentData) => {
  try {
    const response = await api.post('/payments/initialize', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to initialize payment');
  }
}; 