import mongoose, { Document, Schema, Model } from "mongoose";
import { AccessLevel } from "./enum";

interface IProjectAccess {
    projectId: mongoose.Types.ObjectId;
    accessLevel: AccessLevel;
}

interface IUser extends Document {
    username: string;
    password: string;
    email: string;
    access: IProjectAccess[];
    timestamp: Date;
}

const ProjectAccessSchema = new Schema<IProjectAccess>({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    accessLevel: { type: Number, enum: Object.values(AccessLevel), required: true },
});

const UserSchema: Schema<IUser> = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    access: { type: [ProjectAccessSchema], default: [] },
    timestamp: { type: Date, default: Date.now }
});

const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export default User;
export { IUser, IProjectAccess };
