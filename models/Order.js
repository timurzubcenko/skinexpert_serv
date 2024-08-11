import mongoose from "mongoose";
import { Types } from "mongoose";

const OrderSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true,
    },
    user: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: {
        type: Array,
        ref: 'Product'
    },
    totalPrice: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    index: {
        type: String,
        required: true
    }
})

export default mongoose.model('Order', OrderSchema)