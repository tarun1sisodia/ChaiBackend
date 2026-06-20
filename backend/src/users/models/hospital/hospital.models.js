import mongoose, { Mongoose } from "mongoose";
const { Schema } = mongoose;
const hospitalSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    addressLine1: {
        type: String,
        required: true
    },
    addressLine2: {
        type: String,
    },
    pincode: {
        //String - reason is Many International Hospitals have both alphabets and number so to handle.
        type: String,
        required: true
    },
    specializedIn: {
        type: String
    },
    //we can use it in future
    PrivateorPublic: {
        type: String
    },
    //Bad Practice to store same relationship on two tables or collections.
    // doctors: [
    //     {
    //         type: Mongoose.Schema.Types.ObjectId,
    //         ref: "Doctor"
    //     }
    // ]


}, { timestamps: true });

export const Hospital = mongoose.model("Hospital", hospitalSchema);
