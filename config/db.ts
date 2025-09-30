import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
    throw new Error("No connection string")
}

let cached = global.mongoose;
//if its not running on edge
if (!cached) {
    cached = global.mongoose = {
        conn: null,
        promise: null
    }
}

export async function connectMongo() {
    // If already connected, return the existing connection
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    // If connecting, wait for it to complete
    if (mongoose.connection.readyState === 2) {
        return new Promise((resolve, reject) => {
            mongoose.connection.once('connected', () => resolve(mongoose.connection));
            mongoose.connection.once('error', reject);
        });
    }

    try {
        const opts = {
            bufferCommands: false,
        };
        
        await mongoose.connect(MONGODB_URI, opts);
        return mongoose.connection;
    } catch (error) {
        console.error('Database connection error:', error);
        throw new Error("Database connection failed");
    }
}