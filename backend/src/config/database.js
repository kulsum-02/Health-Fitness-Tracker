import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let memoryServer = null;

export const connectDatabase = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/health_fitness';
  const autoMemory = process.env.USE_IN_MEMORY_DB !== 'false';

  // 1. Attempt connection to primary MONGODB_URI
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000 // fast fail if native daemon isn't running
    });
    console.log(`[MongoDB] Successfully connected to live database: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (liveErr) {
    if (!autoMemory) {
      console.error('[MongoDB] Connection to live database failed:', liveErr.message);
      throw liveErr;
    }

    console.warn(`[MongoDB] Live MongoDB daemon not reachable at ${uri}.`);
    console.log('[MongoDB] Starting embedded in-memory MongoDB engine for zero-setup demonstration...');

    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      memoryServer = await MongoMemoryServer.create();
      const memUri = memoryServer.getUri();

      const conn = await mongoose.connect(memUri);
      console.log(`[MongoDB] Embedded database active at: ${memUri}`);
      return conn;
    } catch (memErr) {
      console.error('[MongoDB] Failed to start embedded database:', memErr.message);
      throw memErr;
    }
  }
};

export const disconnectDatabase = async () => {
  try {
    await mongoose.disconnect();
    if (memoryServer) {
      await memoryServer.stop();
    }
    console.log('[MongoDB] Disconnected cleanly.');
  } catch (err) {
    console.error('[MongoDB] Disconnect error:', err.message);
  }
};