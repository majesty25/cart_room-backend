import mongoose from 'mongoose';
import { OrderModel, OrderDocument } from '../models/order.model';
import { Product } from '../models/product.model';

interface CreateOrderInput {
    store: string;
    items: { productId: string; quantity: number }[];
    status: string;
    userId: string;
  }
  


export class OrderService {
    static async getUserOrders(userId: string): Promise<OrderDocument[]> {
        return OrderModel.find({ userId: new mongoose.Types.ObjectId(userId) })
          .populate('items.productId', 'name price image') // fetch only name and price
          .sort({ createdAt: -1 });
      }
    
      static async getOrderById(id: string, userId: string): Promise<OrderDocument | null> {
        return OrderModel.findOne({ _id: id, userId: new mongoose.Types.ObjectId(userId) })
          .populate('items.productId', 'name price image');
      }

  static async createOrder(data: CreateOrderInput): Promise<OrderDocument> {
    const orderItems = [];

    let total = 0;

    for (const item of data.items) {
      const product = await Product.findById(item.productId);
      if (!product) throw new Error(`Product not found: ${item.productId}`);

      const subtotal = product.price * item.quantity;
      total += subtotal;

      orderItems.push({
        productId: item.productId,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: item.quantity
      });
    }

    const order = new OrderModel({
        store: data.store,
        items: orderItems,
        status: data.status,
        createdAt: new Date().toISOString(),
        total,
        userId: data.userId
      });
      

    return order.save();
  }

  static async confirmOrder(id: string): Promise<OrderDocument | null> {
    return OrderModel.findByIdAndUpdate(id, { status: 'Completed' }, { new: true });
  }

  static async deleteOrder(id: string): Promise<boolean> {
    const result = await OrderModel.findByIdAndDelete(id);
    return !!result;
  }
}
