const { Server } = require('socket.io');

let io;

const init = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log('🔌 New socket connection:', socket.id);

    // Dynamic join room based on role (future enhancement)
    socket.on('joinAdmin', () => {
      socket.join('admin-room');
      console.log(`👤 Socket ${socket.id} joined admin-room`);
    });

    socket.on('disconnect', () => {
      console.log('🔌 Socket disconnected');
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

module.exports = { init, getIO };
