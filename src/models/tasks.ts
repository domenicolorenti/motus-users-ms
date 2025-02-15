import mongoose from "mongoose";
import { Priority, State } from "./enum";


const TaskSchema = new mongoose.Schema({
   title: { type: String, required: true},
   description: { type: String, required: true},
   start: { type: Date, required: true},
   end: { type: Date, required: true},
   state:{ type: Number, enum: Object.values(State), required: true },
   notes: [{ type: String, required: true}],
   users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}],
   priority: { type: Number, enum: Object.values(Priority), required: true },
   timestamp: { type: Date, required: true},
})

const Task = mongoose.model("Task", TaskSchema);

export default Task;