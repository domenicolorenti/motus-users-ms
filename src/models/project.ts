import mongoose from "mongoose";
import { AccessLevel, Priority } from "./enum";

const ProjectSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
        tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
        backlogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Backlog" }],
        start: { type: Date, required: true },
        end: { type: Date, required: true },
        access_level: { type: Number, enum: Object.values(AccessLevel), required: true },
        priority: { type: Number, enum: Object.values(Priority), required: true }
    },
    { timestamps: true }
);

const Project = mongoose.model("Project", ProjectSchema);

export default Project;
