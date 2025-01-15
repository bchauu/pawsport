const { TravelList, User } = require('../models'); 
   
const roomEvents = (socket, io) => {

    socket.on('startChat', async (listId, callback) => {
        console.log(`${socket.id} joined room ${listId} as listId`);
        // 3sJJa0TvewbNx8a9AAAD
        console.log(socket.user, 'socket user')
            // { userId: '4', iat: 1730951808, exp: 1730955408 } socket user
                // so we know who is online
                //match userId in database and just return their username


        const user = await User.findOne({ where: {id: socket.user.userId}})
        console.log(user, 'startChat socket')

        // User {
        //   dataValues: {
        //     id: '4',
        //     username: 'Sound Autonomous Aardvark',
        //     email: '131313@gmail.com',
        //     password: '$2b$10$Qu8ViH89w7mjUWvBoAN7dOgfmFQve9UHzoktAMq6ecdnYr94REWKq',
        //     createdAt: 2024-08-22T00:03:38.482Z,
        //     updatedAt: 2024-08-22T00:03:38.482Z
        //   },

        //if im just putting who posts i dont need socket. I just need who left the note
            //these comments will persist unlike chat room
                //since we dont want comments to take up whole screen.
                //this should also be a modal


        const {username: displayName} = user;
        socket.displayName = displayName;

        try {
        let travelList;
        travelList = await TravelList.findOne({where: {id: listId}})
        socket.join(travelList.uuid)
        } catch (error) {
        console.log(error, 'error in querying list')
        }

        if (callback) callback({ status: 'success', listId });
    });

    socket.on('joinRoom', async ({listId}, callback) => {
        console.log('roomJoined here')
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

}
module.exports = { roomEvents };