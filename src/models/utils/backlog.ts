import mongoose from "mongoose";
import { Priority } from "./priority";

const BacklogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    priority: { type: Priority, required: true }
});

export const Backlog = mongoose.model("Backlog", BacklogSchema);
