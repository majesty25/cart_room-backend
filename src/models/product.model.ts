import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  image: string;
  countInStock: number;
  categoryId?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const productSchema: Schema = new Schema<IProduct>({
  name: { type: String, required: true },
  description: { type: String, required: false },
  price: { type: Number, required: true },
  image: { type: String, required: false },
  countInStock: { type: Number, required: true, default: 0 },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
  createdAt: { type: Date, default: Date.now }
});

export const Product = mongoose.model<IProduct>("Product", productSchema);
