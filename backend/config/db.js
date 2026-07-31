/*because Node.js itself is failing to reach the DNS server directly even though Windows' own stub resolver handles it fine.*/

import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};