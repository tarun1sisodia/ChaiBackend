import mongoose from "mongoose";
const { Schema } = mongoose;
const orderItemSchema = new Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
});
const addressSchema = new Schema({
    village: {
        type: String,
    },
    city: {
        type: String,
        required: true
    },
    street: {
        type: String,
    },
    State: {
        type: String,
        required: true,
    },
    houseNo: {
        type: Number,
        required: true
    }

})
const orderSchema = new Schema({
    orderPrice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    orderItem: {
        type: [orderItemSchema]
    },
    //Schema for address will be added in future.
    address: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['PENDING', 'CANCELLED', 'DELIVERED'],
        default: "PENDING"
    }

}, { timestamps: true });

export const Order = mongoose.model("Order", orderSchema);