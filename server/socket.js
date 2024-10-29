// socket.js
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { TravelList } = require('../server/models'); 
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
    console.log(token, 'checking token')
    if (!token) {
      return next(new Error ('no valid Token'));
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log(err, 'hitting error')
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

      try {
        let travelList;
        travelList = await TravelList.findOne({where: {id: listId}})
        socket.join(travelList.uuid)
      } catch (error) {
        console.log(error, 'error in querying list')
      }
  
      if (callback) callback({ status: 'success', listId });
    });
  
    // Renamed event for sending a message
    // socket.on('testMessage', ({ roomId, message }, callback) => {
    //   console.log(roomId, 'testMessage')

    //   io.to(roomId).emit('receiveMessage', { userId: socket.id, text: message });
    //   if (callback) callback({ status: 'success' });
    //   //test message works able to connect to correct room. socket.id does not matter
    //     // hence no disconnect is happen.
    //       // so far no list trigger affects since none is being used as dependency to trigger
    // });
  

    socket.on('disconnect', (reason) => {
      console.log(`User disconnected: ${socket.id}, Reason: ${reason}`);
    });
  
    socket.on('joinRoom', async ({listId}, callback) => {
      console.log(listId, 'check listId')
      try {
        let travelList; 
        console.log(listId, 'check listId inside')
        if (listId) {
          travelList = await TravelList.findOne({ where: { id: listId }});
          console.log(travelList, 'travelList from socket')
       

          const {uuid: roomId} = travelList;

          console.log(roomId, 'travelList from socket uuid')
          console.log(`Current rooms for socket ${socket.id}:`, socket.rooms); // Log all rooms

          console.log(io.sockets.adapter.rooms, 'io.sockets.adapter.rooms in before joining')
          // socket.id = "YOUR_CUSTOM_ID";
          socket.join('roomId');
          console.log(`${socket.id} created and joined room ${roomId}`);
          console.log(io.sockets.adapter.rooms, 'io.sockets.adapter.rooms in joining')
          console.log(typeof callback === "function", 'callback socket 1')
          callback({ status: 'success', roomId });

          socket.emit()
        }


      } catch (error) {
        console.log(error, 'error')
      }
    });

    socket.on('leaveRoom', (roomId, callback) => {
      socket.leave(roomId); // Remove user from the specified room
      console.log(`${socket.id} left room ${roomId}`);
      if (callback) callback({ status: 'success', roomId });
  });
  
    socket.on('sendMessage', ({ roomId, message }, callback) => {
      io.to(roomId).emit('receiveMessage', { userId: socket.id, text: message, room: roomId });  // Use socket.user.id for tracking user
      console.log(`Emitting to room ${roomId}:`, { userId: socket.id, text: message });
      callback({ status: 'success' });
    });
  
    // Handle user disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
}

module.exports = { setupSocketIO };