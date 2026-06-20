import mongoose from 'mongoose';
const { Schema } = mongoose;

const subTodoSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    complete: {
        type: Boolean,
        default: false
    },
    //Referencing User Model to Subtodo Model.
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timeseries: true });

export const SubTodo = Schema("SubTodo", subTodoSchema);