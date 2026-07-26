import 'dotenv/config';
import database from './db/database';
import { createApp } from './server';
import http from 'http';


async function main() {
  const PORT = process.env.PORT || 8000;

  const app = createApp();
  const server = http.createServer(app);

  await database.connect()

  const gracefulShutdown = async (signal: string): Promise<void> => {
    console.log(`\n${signal} received. Starting graceful shutdown...`);

    server.close(() => {
      console.log('HTTP server closed.');
      process.exit(0);
    });

    await Promise.all([
      database.disconnect(),
    ])

    // Force close after 10 seconds
    setTimeout(() => {
      console.error('Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
  });

}

void main()