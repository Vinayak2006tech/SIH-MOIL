"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const env_1 = require("./config/env");
const db_1 = require("./config/db");
// Route imports
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const mineRoutes_1 = __importDefault(require("./routes/mineRoutes"));
const reserveRoutes_1 = __importDefault(require("./routes/reserveRoutes"));
const productionRoutes_1 = __importDefault(require("./routes/productionRoutes"));
const shortfallRoutes_1 = __importDefault(require("./routes/shortfallRoutes"));
const recommendationRoutes_1 = __importDefault(require("./routes/recommendationRoutes"));
const equipmentRoutes_1 = __importDefault(require("./routes/equipmentRoutes"));
const ingestionRoutes_1 = __importDefault(require("./routes/ingestionRoutes"));
const reportRoutes_1 = __importDefault(require("./routes/reportRoutes"));
const dataSourceRoutes_1 = __importDefault(require("./routes/dataSourceRoutes"));
const globalMarketRoutes_1 = __importDefault(require("./routes/globalMarketRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const app = (0, express_1.default)();
// Middlewares
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow local development ports (Vite 5173, etc.)
        callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
// Root Service Info & Health Check
app.get('/', (req, res) => {
    res.status(200).json({
        service: 'MOIL ReserveIQ Backend REST API',
        status: 'ONLINE',
        version: '1.0.0',
        cpse: 'MOIL LIMITED (Miniratna CPSE)',
        ministry: 'Ministry of Steel, Govt. of India',
        healthCheck: '/api/health',
        endpoints: [
            '/api/health',
            '/api/auth',
            '/api/admin',
            '/api/mines',
            '/api/reserves',
            '/api/production',
            '/api/shortfall',
            '/api/recommendations',
            '/api/equipment',
            '/api/ingestion',
            '/api/reports',
            '/api/data-sources',
            '/api/global'
        ],
        timestamp: new Date().toISOString()
    });
});
app.get('/api', (req, res) => {
    res.status(200).json({
        service: 'MOIL ReserveIQ Backend REST API',
        status: 'ONLINE',
        version: '1.0.0',
        health: '/api/health'
    });
});
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        service: 'MOIL ReserveIQ Backend REST API',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});
// API Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
app.use('/api/mines', mineRoutes_1.default);
app.use('/api/reserves', reserveRoutes_1.default);
app.use('/api/production', productionRoutes_1.default);
app.use('/api/shortfall', shortfallRoutes_1.default);
app.use('/api/recommendations', recommendationRoutes_1.default);
app.use('/api/equipment', equipmentRoutes_1.default);
app.use('/api/ingestion', ingestionRoutes_1.default);
app.use('/api/reports', reportRoutes_1.default);
app.use('/api/data-sources', dataSourceRoutes_1.default);
app.use('/api/global', globalMarketRoutes_1.default);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error('[Backend Error]', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});
// Start Server
const startServer = async () => {
    const connected = await (0, db_1.connectDB)();
    if (connected) {
        try {
            const { store } = await Promise.resolve().then(() => __importStar(require('./services/store')));
            await store.syncUsersToMongoDB();
        }
        catch (e) {
            console.warn('[Database] Initial sync warning:', e);
        }
    }
    const server = app.listen(env_1.config.PORT, () => {
        console.log(`\n======================================================`);
        console.log(`⚡ MOIL ReserveIQ Backend running on http://localhost:${env_1.config.PORT}`);
        console.log(`📡 ML Service Target: ${env_1.config.ML_SERVICE_URL}`);
        console.log(`💾 MongoDB URI: ${env_1.config.MONGO_URI}`);
        console.log(`======================================================\n`);
    });
    server.on('error', (e) => {
        if (e.code === 'EADDRINUSE') {
            console.error(`\n⚠️  [PORT BUSY] Port ${env_1.config.PORT} is currently in use by another process.`);
            console.error(`👉 Run 'lsof -ti :${env_1.config.PORT} | xargs kill -9' to free the port, then run 'npm run dev' again.\n`);
            process.exit(1);
        }
        else {
            console.error('[Server Error]', e);
        }
    });
};
startServer();
exports.default = app;
