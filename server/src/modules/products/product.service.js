import { productRepository } from './product.repository.js';

export const productService = {
  async getProducts(boLoc) {
    return await productRepository.findAll(boLoc);
  },

  async getProductBySlug(slug) {
    const sanPham = await productRepository.findBySlug(slug);
    if (!sanPham) {
      throw new Error(`Không tìm thấy sản phẩm với slug: ${slug}`);
    }
    return sanPham;
  }
};
