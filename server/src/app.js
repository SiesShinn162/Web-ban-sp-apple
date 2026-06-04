import express from 'express';
import cors from 'cors';
import { errorHandler } from './shared/middlewares/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());

import productRoutes from './modules/products/product.routes.js';
import categoryRoutes from './modules/categories/category.routes.js';
import orderRoutes from './modules/orders/order.routes.js';

app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);

app.get('/api/status', (req, res) => {
  res.json({ success: true, message: 'HoangPhanStore API đang hoạt động bình thường.' });
});

app.use(errorHandler);

export default app;
