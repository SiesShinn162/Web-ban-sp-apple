import { orderService } from './order.service.js';

export const orderController = {

  async createOrder(req, res, next) {
    try {
      const order = await orderService.createOrder(req.body);
      res.status(201).json({
        success: true,
        message: 'Tạo đơn hàng thành công.',
        data: order
      });
    } catch (error) {
      res.status(400);
      next(error);
    }
  },

  async getOrderByCode(req, res, next) {
    try {
      const { orderCode } = req.params;
      const order = await orderService.getOrderByCode(orderCode);
      res.json({
        success: true,
        data: order
      });
    } catch (error) {
      res.status(404);
      next(error);
    }
  }
};
