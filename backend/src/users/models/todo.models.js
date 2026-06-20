import mongoose from "mongoose";

const { Schema } = mongoose;
const todoSchema = new Schema({
    title:{
        type:String,
        required:true,
    },

}, { timestamps: true })

export const Todo = Schema("Todo",todoSchema);