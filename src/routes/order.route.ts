import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.use(protect); // Protect all routes below

router.get('/', OrderController.getAllOrders);
router.get('/:id', OrderController.getOrderById);
router.post('/', OrderController.createOrder);
router.put('/:id/confirm', OrderController.confirmOrder);
router.delete('/:id', OrderController.deleteOrder);

export default router;
