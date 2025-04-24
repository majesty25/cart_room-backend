import mongoose, { Document, Schema } from 'mongoose';

export interface OrderItem {
  productId: mongoose.Schema.Types.ObjectId;
  name: string;
    image?: string;
  quantity: number;
  price: number;
}

export interface OrderDocument extends Document {
  store: string;
  userId: mongoose.Schema.Types.ObjectId;
  items: OrderItem[];
  status: 'Awaiting delivery' | 'Completed' | 'Shipped' | 'To ship';
  createdAt: string;
  total: number;
}

const OrderItemSchema = new Schema<OrderItem>(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: String,
    image: String,
    quantity: Number,
    price: Number
  },
  { _id: false }
);

const OrderSchema = new Schema<OrderDocument>(
  {
    store: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [OrderItemSchema],
    status: { type: String, enum: ['Awaiting delivery', 'Completed', 'Shipped', 'To ship'], required: true },
    createdAt: { type: String, default: () => new Date().toISOString() },
    total: Number
  },
  { versionKey: false }
);

export const OrderModel = mongoose.model<OrderDocument>('Order', OrderSchema);
