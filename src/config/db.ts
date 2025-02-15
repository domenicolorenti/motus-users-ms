import mongoose, { mongo } from 'mongoose';

export const connectDB = (url: string) => {
    mongoose.set('strictQuery', true);
    mongoose.connect(url)
        .then(() => console.log("Connected to db!"))
        .catch((err) => console.log(err));
}