import { ObjectId } from "mongoose";
import { config } from "../config";
import jwt from "jsonwebtoken";
import { AccessLevel } from "../models/enum";


export const getAuthorizedUser = (token: string) => {

    if (!token) {
        return null;
    }

    if (!config.security.jwt_secret) {
        throw new Error("JWT Secret is missing in the config.");
    }

    try {
        const decoded = jwt.verify(token, config.security.jwt_secret) as { username: string };
        return decoded.username;
    } catch (error) {
        console.error("Invalid or expired token.", error);
    }
}

export const checkPermission = (project: ObjectId, access: AccessLevel) => {

}