console.log('Starting server initialization...');

import dotenv from 'dotenv';
// Load environment variables first
dotenv.config();
console.log('Environment loaded');

import { createServer } from 'http';
import app from './app';
// import { initSocketService } from './core/bookings/services/socketService';
import cors from 'cors';

console.log('Dependencies imported');

const server = createServer(app);
console.log('HTTP server created');

// Basic CORS - keep it simple
app.use(cors({
  origin: ['http://192.168.178.28:3000', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
console.log('CORS configured');

// Add specific handling for Socket.IO polling
app.options('/socket.io/*', cors());

// Initialize Socket.IO
// const io = initSocketService(server);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const port = process.env.PORT || 3001;
server.listen(Number(port), '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
  console.log('CORS enabled for all origins (testing)');
  // console.log('Socket.IO initialized');
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

// After server.listen
// setInterval(() => {
//   console.log('Server heartbeat - active connections:', io.engine.clientsCount);
// }, 10000);