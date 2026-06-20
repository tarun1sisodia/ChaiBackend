import mongoose from "mongoose";
const { Schema } = mongoose;

const doctorSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    salary: {
        type: Number,
        required: true
    },
    YOE: {
        type: Number,
        required: true
    },
    qualification: {
        type: String,
        required: true
    },
    worksInHospitals: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hospital"
    }]

}, { timestamps: true });

export const Doctor = mongoose.model("Doctor", doctorSchema)