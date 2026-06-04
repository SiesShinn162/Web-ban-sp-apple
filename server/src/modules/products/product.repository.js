import { Product } from './product.model.js';

export const productRepository = {
  async findAll({ category, search, sort }) {
    const boLoc = {};

    if (category && category !== 'all') {
      boLoc.category = category;
    }

    if (search) {
      boLoc.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }

    let truyVan = Product.find(boLoc);

    if (sort === 'price-asc') {
      truyVan = truyVan.sort({ price: 1 });
    } else if (sort === 'price-desc') {
      truyVan = truyVan.sort({ price: -1 });
    } else if (sort === 'rating') {
      truyVan = truyVan.sort({ rating: -1 });
    } else {
      truyVan = truyVan.sort({ isFeatured: -1, createdAt: -1 });
    }

    return await truyVan;
  },

  async findBySlug(slug) {
    return await Product.findOne({ slug });
  },

  async findById(id) {
    return await Product.findById(id);
  }
};
