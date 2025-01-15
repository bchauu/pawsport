import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { getToken } from '../utils/authStorage'; // Import your token function

const SOCKET_SERVER_URL = 'http://localhost:3000';

const useSocket = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const initializeSocket = async () => {
      const token = await getToken(); // Fetch token for authentication
      const newSocket = io(SOCKET_SERVER_URL, {
        query: { token }, // Pass token as query parameter
      });

      newSocket.on('connect', () => {
        console.log('Socket connected:', newSocket.id);
      });

      newSocket.on('disconnect', () => {
        console.log('Socket disconnected.');
      });

      setSocket(newSocket);


    };
    initializeSocket();

    return () => {
      console.log('Cleaning up socket connection.');
      // newSocket.disconnect();
    };


  }, []); // Run once on mount

  return socket;
};

export default useSocket;