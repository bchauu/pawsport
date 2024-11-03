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

  // Start the HTTP server
  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((error) => {
  console.error('Unable to connect to the database:', error);
});