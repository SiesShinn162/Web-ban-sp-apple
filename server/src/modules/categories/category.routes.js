import express from 'express';
import { categoryController } from './category.controller.js';

const router = express.Router();

router.get('/', categoryController.getCategories);

export default router;
