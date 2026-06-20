import mongoose from "mongoose";

const { Schema } = mongoose;
const todoSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        default: false
    },
    createdBy:
    {
        // type:String,
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    subTodos: [
        //Array of subtodo.
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubTodo"
        }
    ],

}, { timestamps: true })

export const Todo = Schema("Todo", todoSchema);