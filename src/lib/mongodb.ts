import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
}

const cached = (global as any).mongoose || { conn: null, promise: null };
(global as any).mongoose = cached;

async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            bufferCommands: false,
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

export default connectDB;