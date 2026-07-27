/*because Node.js itself is failing to reach the DNS server directly even though Windows' own stub resolver handles it fine.*/

import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);


import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect("mongodb+srv://lydiahiouani_db_user:swu6hGq0gxTWsjy9@cluster0.3rzqi0t.mongodb.net/Finance")
    .then(() => console.log("DB CONNECTED"));
}