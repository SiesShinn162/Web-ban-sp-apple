import { Order } from './order.model.js';

export const orderRepository = {

  async create(orderData) {
    const order = new Order(orderData);
    return await order.save();
  },

  async findByCode(orderCode) {
    return await Order.findOne({ orderCode }).populate('items.productId');
  }
};
