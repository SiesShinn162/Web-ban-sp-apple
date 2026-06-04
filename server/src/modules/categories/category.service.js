import { Category } from './category.model.js';

export const categoryService = {
  async getCategories() {
    return await Category.find({});
  }
};
