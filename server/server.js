const jwt = require('jsonwebtoken');
const http = require('http');
const { Server } = require('socket.io');
const { sequelize } = require('./models');
const app = require('./app'); // Import the Express app
const { setupSocketIO } = require('./socket');

const PORT = process.env.PORT || 3000;
const jwtSecret = process.env.JWT_SECRET;  // Your JWT secret key

// Sync database and start the server
sequelize.sync().then(async () => {
  console.log('Database synchronized');

  // Create the HTTP server with Express app
  const httpServer = http.createServer(app);

// Initialize Socket.IO
setupSocketIO(httpServer);

  // // Initialize Socket.IO
  // const io = new Server(httpServer, {
  //   cors: {
  //     origin: "*",  // Allow all origins (adjust for production)
  //   },
  // });

  // Socket.IO middleware for authentication
//   io.use((socket, next) => {
//     const token = socket.handshake.query.token;

//     // Temporarily skip token validation for testing
//     if (!token) {
//         console.log('No token provided. Allowing connection for test purposes.');
//         socket.user = { id: 'test-user' };  // Assign a default test user
//         return next();  // Allow connection
//     }

//     // If token is provided, validate it (can leave this for later)
//     jwt.verify(token, jwtSecret, (err, decoded) => {
//         if (err) {
//             console.error('Token verification failed:', err);
//             return next(new Error('Authentication error: Invalid token'));
//         }
//         socket.user = decoded;
//         next();
//     });
// });



//   // Global Socket.IO instance (io)
// io.on('connection', (socket) => {
//   console.log(`User connected: ${socket.id}`);  // New client, new socket

//   // Handle client-specific events
//   socket.on('joinRoom', (roomId) => {
//       socket.join(roomId);  // Join the client to a room
//       console.log(`${socket.id} joined room ${roomId}`);
//   });

//   socket.on('sendMessage', ({ roomId, message }) => {
//       io.to(roomId).emit('receiveMessage', { userId: socket.id, text: message });
//   });

//   // Handle disconnection
//   socket.on('disconnect', () => {
//       console.log(`User disconnected: ${socket.id}`);
//   });
// });

  // Start the HTTP server
  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((error) => {
  console.error('Unable to connect to the database:', error);
});