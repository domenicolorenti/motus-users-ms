import mongoose from "mongoose";
import { Priority, State } from "./utils";

const TaskSchema = new mongoose.Schema({
   title: { type: String, required: true},
   description: { type: String, required: true},
   start: { type: Date, required: true},
   end: { type: Date, required: true},
   state: { type: State, required: true},
   notes: [{ type: String, required: true}],
   users: [{ type: mongoose.Schema.Types.ObjectId, required: true}],
   priority: { type: Priority, required: true},
   timestamp: { type: Date, required: true},
})

const Task = mongoose.model("Task", TaskSchema);

export default Task;