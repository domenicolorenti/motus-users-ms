import mongoose from "mongoose";
import { AccessLevel, Backlog, Priority } from "./utils";

enum State {
    todo,
    inProgress,
    done,
    archivied
}

const ProjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    users: [{ type: mongoose.Schema.Types.ObjectId, required: true }],
    tasks: [{ type: mongoose.Schema.Types.ObjectId }],
    backlogs: [{ type: Backlog }],
    start: { type: Date, required: true },
    end: { type: Date, required: true},
    access_level: { type: AccessLevel, required: true},
    priority: { type: Priority, required: true},
    timestamp: { type: Date, default: Date.now}
})

const Project = mongoose.model("Project", ProjectSchema);

export default Project;