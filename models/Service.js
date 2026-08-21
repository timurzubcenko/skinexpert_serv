import mongoose from "mongoose";

const Service = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        default: ""
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
    courseProcedures: {
        type: Number,
        default: null
    },
    coursePrice: {
        type: String,
        default: ""
    },
    position: {
        type: Number,
        default: 1000,
        index: true
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    },
}, {
    timestamps: true,
})

export default mongoose.model('Service', Service)
