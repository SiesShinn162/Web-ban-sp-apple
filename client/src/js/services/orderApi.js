import { apiClient } from './apiClient.js';

export const orderApi = {

  async createOrder(orderData) {
    return await apiClient.post('/orders', orderData);
  },

  async getOrderByCode(orderCode) {
    return await apiClient.get(`/orders/${orderCode}`);
  }
};
