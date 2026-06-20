import mongoose from "mongoose";
const { Schema } = mongoose;

const medicalRecordSchema = new Schema({
    patientName:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Patient"
    },

},{timestamps:true});

export const MedicalRecord = mongoose.model("MedicalRecord", medicalRecordSchema);