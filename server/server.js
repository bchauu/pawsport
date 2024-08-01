console.log('Starting server.js');

require('dotenv').config();
const app = require('./app');
const http = require('http');
const { sequelize } = require('./models');

// const PORT = process.env.PORT || 3000;
// Accessing environment variables
const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
const dbName = process.env.DB_NAME;
const dbPort = process.env.DB_PORT;
const jwtSecret = process.env.JWT_SECRET;
const PORT = process.env.PORT || 3000;


// Sync database and start server
sequelize.sync()
  .then(async () => {
    console.log('Database synchronized');

    const httpServer = http.createServer(app);


    httpServer.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
    });
  }).catch(error => {
    console.error('Unable to connect to the database:', error);
  });

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});

console.log('server.js setup complete');