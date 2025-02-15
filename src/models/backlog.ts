import mongoose from "mongoose";
import { Priority } from "./enum/priority";

const BacklogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    priority: { type: Number, enum:Object.values(Priority), required: true }
});

export const Backlog = mongoose.model("Backlog", BacklogSchema);
