import mongoose from "mongoose";

const Service = new mongoose.Schema({
    name: {
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
    time: {
        type: String,
        required: true
    },
}, {
    timestamps: true,
})

export default mongoose.model('Service', Service)