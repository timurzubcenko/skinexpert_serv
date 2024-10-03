import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
    },
    category: {
        type: String
    },
}, {
    timestamps: true,
})

export default mongoose.model('Product', ProductSchema)