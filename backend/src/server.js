import dotenv from 'dotenv';
import { createApp } from './app.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { Health } from './models/Health.js';
import { runSeed } from '../scripts/seed.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // 1. Initialize MongoDB connection
    await connectDatabase();

    // 2. Auto-seed if database has no health records
    const recordCount = await Health.countDocuments();
    if (recordCount === 0) {
      console.log('[Server] Database is empty. Seeding initial baseline data...');
      await runSeed();
    }

    // 3. Create and start Express application
    const app = createApp();

    const server = app.listen(PORT, () => {
      console.log('========================================================');
      console.log(`🚀 FitPulse Pro API Server running on port ${PORT}`);
      console.log(`👉 Status: http://localhost:${PORT}/api/status`);
      console.log(`👉 Health: http://localhost:${PORT}/api/health`);
      console.log(`👉 Goals:  http://localhost:${PORT}/api/goals`);
      console.log(`👉 Progress: http://localhost:${PORT}/api/progress`);
      console.log(`👉 Reports: http://localhost:${PORT}/api/reports/weekly`);
      console.log(`👉 Recommendations: http://localhost:${PORT}/api/recommendations`);
      console.log('========================================================');
    });

    // Graceful shutdown handling
    const shutdown = async (signal) => {
      console.log(`\n[Server] Received ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        await disconnectDatabase();
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));

  } catch (err) {
    console.error('[Server Error] Critical startup failure:', err);
    process.exit(1);
  }
};

startServer();