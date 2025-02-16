import { Types } from "mongoose";
import { config } from "../config";
import jwt from "jsonwebtoken";
import { AccessLevel } from "../models/enum";
import { IProjectAccess } from "../models/user";


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

export const checkPermission = (token: string, projectId: Types.ObjectId, requiredAccessLevel: AccessLevel): boolean => {
    try {
        const decoded = jwt.verify(token, config.security.jwt_secret) as { username: string, access: IProjectAccess[] };

        if(decoded.username === "admin") {
            return true;
        }

        if (!decoded || !decoded.access || !Array.isArray(decoded.access)) {
            return false;
        }

        const projectAccess = decoded.access.find(
            (entry) => entry.projectId.equals(projectId)
        );

        return projectAccess ? projectAccess.accessLevel.valueOf() >= requiredAccessLevel : false;
    } catch (error) {
        console.error('Error verifying token:', error);
        return false;
    }
};
