import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './config/env';
import { connectDB } from './config/db';

// Route imports
import authRoutes from './routes/authRoutes';
import mineRoutes from './routes/mineRoutes';
import reserveRoutes from './routes/reserveRoutes';
import productionRoutes from './routes/productionRoutes';
import shortfallRoutes from './routes/shortfallRoutes';
import recommendationRoutes from './routes/recommendationRoutes';
import equipmentRoutes from './routes/equipmentRoutes';
import ingestionRoutes from './routes/ingestionRoutes';
import reportRoutes from './routes/reportRoutes';
import dataSourceRoutes from './routes/dataSourceRoutes';
import globalMarketRoutes from './routes/globalMarketRoutes';
import adminRoutes from './routes/adminRoutes';

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow local development ports (Vite 5173, etc.)
      callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  })
);

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
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/mines', mineRoutes);
app.use('/api/reserves', reserveRoutes);
app.use('/api/production', productionRoutes);
app.use('/api/shortfall', shortfallRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/ingestion', ingestionRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/data-sources', dataSourceRoutes);
app.use('/api/global', globalMarketRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[Backend Error]', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start Server
const startServer = async () => {
  const connected = await connectDB();
  if (connected) {
    try {
      const { store } = await import('./services/store');
      await store.syncUsersToMongoDB();
    } catch (e) {
      console.warn('[Database] Initial sync warning:', e);
    }
  }

  const server = app.listen(config.PORT, () => {
    console.log(`\n======================================================`);
    console.log(`⚡ MOIL ReserveIQ Backend running on http://localhost:${config.PORT}`);
    console.log(`📡 ML Service Target: ${config.ML_SERVICE_URL}`);
    console.log(`💾 MongoDB URI: ${config.MONGO_URI}`);
    console.log(`======================================================\n`);
  });

  server.on('error', (e: any) => {
    if (e.code === 'EADDRINUSE') {
      console.error(`\n⚠️  [PORT BUSY] Port ${config.PORT} is currently in use by another process.`);
      console.error(`👉 Run 'lsof -ti :${config.PORT} | xargs kill -9' to free the port, then run 'npm run dev' again.\n`);
      process.exit(1);
    } else {
      console.error('[Server Error]', e);
    }
  });
};

startServer();

export default app;
