import mongoose from 'mongoose';
const {Schema} = mongoose;

const subTodoSchema = new Schema({

},{timeseries:true});

export const SubTodo = Schema("SubTodo",subTodoSchema);