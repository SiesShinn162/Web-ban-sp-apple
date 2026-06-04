import { CONFIG } from '../config.js';

export const apiClient = {
  async get(endpoint) {
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`);
      if (!response.ok) {
        throw new Error(`Lỗi HTTP! Trạng thái: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Lỗi gọi API GET [${endpoint}]:`, error);
      throw error;
    }
  },

  async post(endpoint, data) {
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Lỗi HTTP! Trạng thái: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Lỗi gọi API POST [${endpoint}]:`, error);
      throw error;
    }
  }
};
