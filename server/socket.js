// socket.js
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { TravelList, User } = require('../server/models'); 
const { type } = require('os');

const rooms = {};  // Keep track of rooms and users
const roomCapacity = 5;

function setupSocketIO(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",  // Adjust for production
    },
  });

  // Optional JWT authentication middleware for Socket.IO
  io.use((socket, next) => {
    const token = socket.handshake.query.token;
    if (!token) {
      return next(new Error ('no valid Token'));
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return next(new Error('Authentication error'));
      }
      socket.user = decoded;
      console.log(socket.user, 'socket decoded')
      next();
    });
  });

  io.on('connection', (socket, next) => {

    socket.on('startChat', async (listId, callback) => {
      console.log(`${socket.id} joined room ${listId} as listId`);

      const user = await User.findOne({ where: {id: socket.user.userId}})
      const {username: displayName} = user;
      socket.displayName = displayName;
      console.log(displayName, 'socket user in startChat')

      try {
        let travelList;
        travelList = await TravelList.findOne({where: {id: listId}})
        socket.join(travelList.uuid)
      } catch (error) {
        console.log(error, 'error in querying list')
      }
  
      if (callback) callback({ status: 'success', listId });
    });

    socket.on('disconnect', (reason) => {
      console.log(`User disconnected: ${socket.id}, Reason: ${reason}`);
    });
  
    socket.on('joinRoom', async ({listId}, callback) => {
      try {
        let travelList; 
        if (listId) {
          travelList = await TravelList.findOne({ where: { id: listId }});
       
          const {uuid: roomId} = travelList;

          socket.join('roomId');

          callback({ status: 'success', roomId });

          socket.emit()
        }


      } catch (error) {
        console.log(error, 'error')
      }
    });

    socket.on('leaveRoom', (roomId, callback) => {
      socket.leave(roomId); 
      if (callback) callback({ status: 'success', roomId });
  });
  
    socket.on('sendMessage', ({ roomId, message }, callback) => {
      io.to(roomId).emit('receiveMessage', { userId: socket.displayName, text: message, room: roomId });  // Use socket.user.id for tracking user
      callback({ status: 'success' });
    });
  
    // Handle user disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
}

module.exports = { setupSocketIO };