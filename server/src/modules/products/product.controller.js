import { productService } from './product.service.js';

export const productController = {

  async getProducts(req, res, next) {
    try {
      const { category, search, sort } = req.query;
      const dsSanPham = await productService.getProducts({ category, search, sort });

      res.json({
        success: true,
        count: dsSanPham.length,
        data: dsSanPham
      });
    } catch (error) {
      next(error);
    }
  },

  async getProductBySlug(req, res, next) {
    try {
      const { slug } = req.params;
      const sanPham = await productService.getProductBySlug(slug);

      res.json({
        success: true,
        data: sanPham
      });
    } catch (error) {
      res.status(404);
      next(error);
    }
  }
};
