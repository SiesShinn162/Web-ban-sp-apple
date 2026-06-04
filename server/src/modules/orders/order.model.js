import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 }
});

const orderSchema = new mongoose.Schema({
  orderCode: { type: String, required: true, unique: true, index: true },
  customer: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true }
  },
  items: [orderItemSchema],
  subtotal: { type: Number, required: true },
  shippingFee: { type: Number, required: true, default: 0 },
  total: { type: Number, required: true },
  status: { type: String, required: true, enum: ['pending', 'processing', 'shipped', 'completed', 'cancelled'], default: 'pending' },
  paymentMethod: { type: String, required: true, default: 'cod_demo' }
}, {
  timestamps: true
});

export const Order = mongoose.model('Order', orderSchema);
export default Order;
