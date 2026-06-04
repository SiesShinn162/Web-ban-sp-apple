import { apiClient } from './apiClient.js';

export const productApi = {

  async getProducts(params = {}) {
    let queryString = '';
    const queryParts = [];

    if (params.category) queryParts.push(`category=${encodeURIComponent(params.category)}`);
    if (params.search) queryParts.push(`search=${encodeURIComponent(params.search)}`);
    if (params.sort) queryParts.push(`sort=${encodeURIComponent(params.sort)}`);

    if (queryParts.length > 0) {
      queryString = `?${queryParts.join('&')}`;
    }

    return await apiClient.get(`/products${queryString}`);
  },

  async getProductBySlug(slug) {
    return await apiClient.get(`/products/${slug}`);
  },

  async getCategories() {
    return await apiClient.get('/categories');
  }
};
