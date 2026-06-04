import { categoryService } from './category.service.js';

export const categoryController = {

  async getCategories(req, res, next) {
    try {
      const categories = await categoryService.getCategories();
      res.json({
        success: true,
        count: categories.length,
        data: categories
      });
    } catch (error) {
      next(error);
    }
  }
};
