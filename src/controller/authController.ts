import { Request, Response } from 'express';
import User from '../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import { ObjectId, Types } from 'mongoose';
import { AccessLevel } from '../models/enum';
import { checkPermission } from '../utils/authUtils';

const sendResponse = (res: Response, status: number, message: string, extraData = {}): void => {
    res.status(status).json({ message, ...extraData });
};

// Register a new user
export const register = async (req: Request, res: Response): Promise<void> => {
    const { username, password, email, access = [] } = req.body;

    if (!username || !password || !email) {
        sendResponse(res, 400, 'Username, password, and email are required!');
        return;
    }

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            sendResponse(res, 409, 'Username is already taken!');
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword, email, access });
        await newUser.save();

        sendResponse(res, 201, 'User registered successfully.');
    } catch (error) {
        sendResponse(res, 500, 'Server error. Please try again later.');
    }
};

// User login
export const login = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    if (!username || !password) {
        sendResponse(res, 400, 'Username and password are required!');
        return;
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            sendResponse(res, 401, 'Invalid Username or Password!');
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            sendResponse(res, 401, 'Invalid Username or Password!');
            return;
        }

        const token = jwt.sign(
            { id: user._id, username: user.username, access: user.access },
            config.security.jwt_secret,
            { expiresIn: '1h' }
        );

        sendResponse(res, 200, 'Login Successful', { token });
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error!');
        console.error(error);
    }
};

// Get User Profile (protected route)
export const getProfile = (req: Request, res: Response): void => {
    sendResponse(res, 200, 'This is your profile.', { user: req.user });
};

// Validate JWT Token (use header instead of body)
export const auth = (req: Request, res: Response): void => {
    const token = validate(req.headers.authorization?.split(' ')[1]);
    if (!token) {
        sendResponse(res, 401, 'Invalid or expired token.', { valid: false });
        return;
    }
    sendResponse(res, 200, 'Authenticated', { valid: true });
};

interface AddProjectRequest extends Request {
    body: {
        projectId: Types.ObjectId;
        access: number;
        userId: Types.ObjectId;
    }
}

export const addProjectAccess = async (req: AddProjectRequest, res: Response): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            sendResponse(res, 401, 'Missing or malformed authorization header.');
            return;
        }

        const token = validate(authHeader.split(' ')[1]);
        if (!token) {
            sendResponse(res, 401, 'Invalid or expired token.');
            return;
        }

        const { projectId, userId, access} = req.body;

        if (!projectId) {
            sendResponse(res, 400, 'Project ID is required.');
            return;
        }

        if (!checkPermission(token, projectId, AccessLevel.FULL)) {
            sendResponse(res, 403, 'User does not have the required permission.');
            return;
        }

        const user = await User.findById(userId);
        if (!user) {
            sendResponse(res, 404, 'User does not exist.');
            return;
        }

        user.access.push({ projectId: projectId, accessLevel: 2 });
        await user.save();

        sendResponse(res, 200, 'Project access granted successfully.');
    } catch (error) {
        console.error('Error in addProjectAccess:', error);
        sendResponse(res, 500, 'Internal Server Error.');
    }
};


const validate = (token: string | undefined): string | null => {
    if (!token) {
        return null;
    }

    try {
        jwt.verify(token, config.security.jwt_secret);
        return token;
    } catch (error) {
        console.error(error);
        return null;
    }
}