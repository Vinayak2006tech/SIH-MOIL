import mongoose from 'mongoose';
import { config } from './env';

export let isMongoConnected = false;

export const connectDB = async (): Promise<boolean> => {
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(config.MONGO_URI, {
      serverSelectionTimeoutMS: 2000 // Quick timeout to fallback if no Mongo running
    });
    isMongoConnected = true;
    console.log(`[Database] MongoDB Connected successfully to: ${conn.connection.host}`);
    return true;
  } catch (error: any) {
    isMongoConnected = false;
    console.warn(`[Database] MongoDB connection failed (${error.message}).`);
    console.log(`[Database] Initializing High-Performance In-Memory Repository Fallback mode.`);
    return false;
  }
};
