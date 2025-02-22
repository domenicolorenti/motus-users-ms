import * as dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();


if (!process.env.JWT_SECRET) {
    console.error("⚠️ Missing JWT_SECRET in environment variables!");
    process.env.JWT_SECRET = crypto.randomBytes(32).toString('hex');
    console.log("✅ Generated JWT_SECRET!");
}

const config = {
    server: {
        port: Number(process.env.PORT) || 8080,
    },

    db: {
        url: process.env.MONGODB_URL || "mongodb://localhost/27017"
    },

    security: {
        jwt_secret: process.env.JWT_SECRET
    }
}

export default config;