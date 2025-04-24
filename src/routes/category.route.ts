import express from 'express';
import { getCategoryTree, createCategory } from '../controllers/category.controller';

const router = express.Router();

router.get('/tree', getCategoryTree);
router.post('/', createCategory);

export default router;