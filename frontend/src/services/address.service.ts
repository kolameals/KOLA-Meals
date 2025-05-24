import api from './api';
import type { Address } from '../types/address';

export const createAddress = async (address: Address) => {
  try {
    console.log('Creating address:', address); // Debug log
    const response = await api.post('/users/addresses', {
      ...address,
      // Ensure dates are properly formatted
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    console.log('Address created successfully:', response.data); // Debug log
    return response.data;
  } catch (error: any) {
    console.error('Address creation error:', error.response?.data || error); // Detailed error log
    if (error.response?.status === 404) {
      throw new Error('Address API endpoint not found. Please check the API configuration.');
    }
    if (error.response?.status === 401) {
      throw new Error('Authentication failed. Please login again.');
    }
    throw new Error(error.response?.data?.message || 'Failed to create address. Please try again.');
  }
}; 