import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, index: true },
  brand: { type: String, required: true, default: 'iStore' },
  category: { type: String, required: true, index: true },
  price: { type: Number, required: true },
  oldPrice: { type: Number },
  images: [{ type: String }],
  rating: { type: Number, default: 5 },
  stock: { type: Number, required: true, default: 0 },
  isFeatured: { type: Boolean, default: false },
  description: { type: String },
  specs: { type: Map, of: String }
}, {
  timestamps: true
});

export const Product = mongoose.model('Product', productSchema);
export default Product;
