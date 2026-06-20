import mongoose from "mongoose";
const { Schema } = mongoose;

const patientSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    LastName: {
        type: String,
    },
    age: {
        type: Number,
        required: true
    },
    diseasesFound: {
        type: String
    },
    address: {
        type: String,
        required: true
    },
    bloodGroup: {
        type: String,
        enum: ['A', 'A+', 'etc.....']
    },
    sex: {
        type: String,
        enum: ["M", "F", "O"],
        required: true
    },
    admittedIn: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hospital"
    },
    doctorAssigned: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor"
    }


}, { timestamps: true });

export const Patient = mongoose.model("Patient", patientSchema);