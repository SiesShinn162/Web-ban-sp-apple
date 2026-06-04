import express from 'express';
import { orderController } from './order.controller.js';
import { validateRequestBody } from '../../shared/middlewares/validateRequest.js';

const router = express.Router();

const orderFields = [
  'customer.fullName',
  'customer.phone',
  'customer.email',
  'customer.address',
  'items',
  'paymentMethod'
];

router.post('/', validateRequestBody(orderFields), orderController.createOrder);
router.get('/:orderCode', orderController.getOrderByCode);

export default router;
