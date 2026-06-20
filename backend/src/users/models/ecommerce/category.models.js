import mongoose from "mongoose";
const { Schema } = mongoose;

const categorySchema = new Schema({
    name: {
        type:String,
        required:true
    },
    //Electronic devices has Headphones, earbuds, Speaker and more...
    type:{
        type:String,
        required:true
    }

}, { timestamps: true });

export const Category = mongoose.model("Category", categorySchema);