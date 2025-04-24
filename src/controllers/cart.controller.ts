// controllers/cart.controller.ts
import { Response } from 'express';
import { Cart } from '../models/cart.model';
import { AuthRequest } from '../middlewares/auth.middleware';
import { Product } from '../models/product.model';

export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    res.json(cart);
  } catch {
    res.status(500).json({ message: 'Failed to fetch cart' });
  }
};

export const listUserCarts = async (req: AuthRequest, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
  
    try {
      const total = await Cart.countDocuments({ userId: req.user._id });
      const carts = await Cart.find({ userId: req.user._id })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });
  
      res.status(200).json({
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        carts,
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch user carts' });
    }
  };
  

  export const createCart = async (req: AuthRequest, res: Response) => {
    const { productId, quantity } = req.body;
  
    if (!productId || !quantity) {
      return res.status(400).json({ message: 'productId and quantity are required' });
    }
  
    try {
      const product = await Product.findById(productId);
      console.log('Product:', product?.name);
      if (!product) return res.status(404).json({ message: 'Product not found' });
  
      // Check if user already has a cart
      let cart = await Cart.findOne({ userId: req.user._id });
  
      if (!cart) {
        // Create new cart if none exists
        cart = new Cart({
          userId: req.user._id,
          items: [{ productId, quantity, name: product.name, price: product.price }],
        });
        await cart.save();
        return res.status(201).json(cart);
      }
  
      // Check if item already exists in the cart
      const existingItem = cart.items.find(
        (item) => item.productId.toString() === productId
      );
  
      if (existingItem) {
        return res.status(400).json({ message: 'Item already exists in the cart' });
      }
  
      // Add new item to existing cart
      console.log('Adding item to cart:', product.name? product.name : 'Unknown');
      cart.items.push({
        productId,
        name: product.name,
        price: product.price,
        quantity,
      });
  
      await cart.save();
      res.status(201).json(cart);
    } catch (error) {
        // console.error('Error creating cart:', error);
      res.status(500).json({ message: 'Failed to create cart' });
    }
  };

export const updateCart = async (req: AuthRequest, res: Response) => {
  const { productId, quantity } = req.body;
  try {
    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const index = cart.items.findIndex((item) => item.productId === productId);

    if (index > -1) {
      cart.items[index].quantity = quantity;
    } else {
      cart.items.push({ productId, name: req.body.name, quantity, price: req.body.price });
    }

    await cart.save();
    res.json(cart);
  } catch {
    res.status(500).json({ message: 'Failed to update cart' });
  }
};

export const removeItemFromCart = async (req: AuthRequest, res: Response) => {
  const { productId } = req.params;
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
    await cart.save();

    res.json(cart);
  } catch {
    res.status(500).json({ message: 'Failed to remove item' });
  }
};

export const clearCart = async (req: AuthRequest, res: Response) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = [];
    await cart.save();

    res.json({ message: 'Cart cleared', cart });
  } catch {
    res.status(500).json({ message: 'Failed to clear cart' });
  }
};
