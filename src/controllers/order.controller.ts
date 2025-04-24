import { Request, Response } from 'express';
import { OrderService } from '../services/order.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export class OrderController {
    static async getAllOrders(req: AuthRequest, res: Response) {
        try {
          const orders = await OrderService.getUserOrders(req.user!);
          res.json({ orders });
        } catch (err: any) {
          res.status(400).json({ message: 'Error fetching orders', error: err.message || err });
        }
      }
      
      static async getOrderById(req: AuthRequest, res: Response) {
        try {
          const order = await OrderService.getOrderById(req.params.id, req.user!);
          if (!order) return res.status(404).json({ message: 'Order not found' });
          res.json(order);
        } catch (err: any) {
          res.status(400).json({ message: 'Error fetching order', error: err.message || err });
        }
      }

  static async createOrder(req: Request, res: Response) {
    try {
      const order = await OrderService.createOrder({...req.body, userId: req.user});
      res.status(201).json(order);
    } catch (err) {
        console
      res.status(400).json({ message: 'Error creating order', error: err });
    }
  }

  static async confirmOrder(req: Request, res: Response) {
    const order = await OrderService.confirmOrder(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  }

  static async deleteOrder(req: Request, res: Response) {
    const success = await OrderService.deleteOrder(req.params.id);
    if (!success) return res.status(404).json({ message: 'Order not found' });
    res.status(204).send();
  }
}
