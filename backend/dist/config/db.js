"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.isMongoConnected = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
exports.isMongoConnected = false;
const connectDB = async () => {
    try {
        mongoose_1.default.set('strictQuery', false);
        const conn = await mongoose_1.default.connect(env_1.config.MONGO_URI, {
            serverSelectionTimeoutMS: 2000 // Quick timeout to fallback if no Mongo running
        });
        exports.isMongoConnected = true;
        console.log(`[Database] MongoDB Connected successfully to: ${conn.connection.host}`);
        return true;
    }
    catch (error) {
        exports.isMongoConnected = false;
        console.warn(`[Database] MongoDB connection failed (${error.message}).`);
        console.log(`[Database] Initializing High-Performance In-Memory Repository Fallback mode.`);
        return false;
    }
};
exports.connectDB = connectDB;
