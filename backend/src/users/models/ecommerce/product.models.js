import mongoose from "mongoose";
const { Schema } = mongoose;
const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required:true
    },
    feedback: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Feedback"
    },
    stock: { type: Number, default: 0 },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }


}, { timestamps: true });

export const Product = mongoose.model('Product', productSchema);