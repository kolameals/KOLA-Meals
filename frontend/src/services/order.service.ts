import api from './api';
import type { Order, OrderItem, CreateOrderData } from '../types/order.types';

export const orderService = {
  async getOrders(): Promise<Order[]> {
    try {
      const response = await api.get('/orders');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  async getOrderById(orderId: string): Promise<Order> {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  },

  async updateOrderStatus(orderId: string, status: string): Promise<Order> {
    try {
      const response = await api.patch(`/orders/${orderId}/status`, { status });
      return response.data.data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  async createOrder(orderData: CreateOrderData): Promise<Order> {
    try {
      const response = await api.post('/orders', orderData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  async cancelOrder(orderId: string): Promise<Order> {
    try {
      const response = await api.post(`/orders/${orderId}/cancel`);
      return response.data.data;
    } catch (error) {
      console.error('Error cancelling order:', error);
      throw error;
    }
  }
}; 