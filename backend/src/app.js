import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import healthRoutes from './routes/healthRoutes.js';
import goalRoutes from './routes/goalRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';

import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

export const createApp = () => {
  const app = express();

  // CORS configuration
  app.use(cors({
    origin: '*', // allows React dev server at port 3000, 5173, etc.
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  // Body parsers
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // Basic request logger in development
  if (process.env.NODE_ENV !== 'test') {
    app.use((req, res, next) => {
      console.log(`[HTTP] ${req.method} ${req.originalUrl}`);
      next();
    });
  }

  // System Health Check
  app.get('/api/status', (req, res) => {
    const isDbConnected = mongoose.connection.readyState === 1;
    res.status(200).json({
      success: true,
      service: 'FitPulse Pro Person 3 API',
      status: 'operational',
      database: isDbConnected ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString()
    });
  });

  // Mount API Modules
  app.use('/api/health', healthRoutes);
  app.use('/api/goals', goalRoutes);
  app.use('/api/progress', progressRoutes);
  app.use('/api/reports', reportRoutes);
  app.use('/api/recommendations', recommendationRoutes);

  // Catch 404 & Centralized Error Handler
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

export default createApp();