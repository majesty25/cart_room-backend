// routes/cart.routes.ts
import { Router } from 'express';
import {
  getCart,
  createCart,
  updateCart,
  removeItemFromCart,
  clearCart,
    listUserCarts,
} from '../controllers/cart.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.use(protect); // Protect all routes below

router.get('/', getCart);
router.get('/list', listUserCarts);
router.post('/', createCart);
router.put('/', updateCart);
router.delete('/item/:productId', removeItemFromCart);
router.delete('/', clearCart);

export default router;
