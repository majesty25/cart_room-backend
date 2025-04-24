import mongoose, {Document, Schema} from "mongoose";


export interface ICart extends Document {
    userId: mongoose.Types.ObjectId;
    items: {
        productId: mongoose.Types.ObjectId;
        name: string;
        quantity: number;
        price: number;
    }[];
    totalPrice: number;
    createdAt: Date;
    updatedAt: Date;
}
const cartSchema: Schema = new Schema<ICart>({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    items: [
        {
            productId: {type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true},
            name: {type: String, required: true},
            quantity: {type: Number, required: true,},
            price: {type: Number, required: true},
        },
    ],
    totalPrice: {type: Number, required: true, default: 0},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
});

export const Cart = mongoose.model<ICart>("Cart", cartSchema);