import { NextFunction, Request, Response } from "express";
import config from "../config/config";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongoose";
import { User } from "../models";
import { IUser } from "../models/user";

// Extend Express Request type to include `user` of type IUser
declare module "express-serve-static-core" {
    interface Request {
        user?: IUser | null;
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Unauthorized access" });
        return;
    }

    const token = authHeader.split(" ")[1];

    if (!config.security.jwt_secret) {
        throw new Error("JWT Secret is missing in the config.");
    }

    try {
        const decoded = jwt.verify(token, config.security.jwt_secret) as { id: ObjectId; username: string };

        const user: IUser | null = await User.findById(decoded.id);
        if (!user) {
            res.status(401).json({ message: "User not found." });
            return;
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token." });
    }
};