"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
exports.config = {
    PORT: process.env.PORT || 5001,
    NODE_ENV: process.env.NODE_ENV || 'development',
    MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/moil_reserveiq',
    JWT_SECRET: process.env.JWT_SECRET || 'moil_reserveiq_secret_super_secure_key_2026',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    ML_SERVICE_URL: process.env.ML_SERVICE_URL || 'http://localhost:8000',
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
    EMAIL_HOST: process.env.EMAIL_HOST || '',
    EMAIL_PORT: parseInt(process.env.EMAIL_PORT || '587', 10),
    EMAIL_USER: process.env.EMAIL_USER || '',
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || '',
    EMAIL_FROM: process.env.EMAIL_FROM || 'MOIL ReserveIQ <no-reply@moil.gov.in>',
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'vaishayvinayak@gmail.com',
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'vinayak@2006'
};
