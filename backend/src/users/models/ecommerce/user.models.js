import mongoose from "mongoose";

const { Schema } = mongoose;

const ecommUserSchema = new Schema({
    
}, { timestamps: True });

export const EcommUser = Schema("EcommUser", ecommUserSchema);