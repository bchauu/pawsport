import {useEffect, useState} from 'react';
import {io} from 'socket.io-client';
import {getToken} from '../utils/authStorage'; // Import your token function

// const SOCKET_SERVER_URL = 'http://localhost:3000';
const SOCKET_SERVER_URL = 'wss://api.pawsport.quest';

const useSocket = () => {
  const [socket, setSocket] = useState(null);

  const initializeSocket = async () => {
    const token = await getToken(); // Fetch token for authentication
    const newSocket = io(SOCKET_SERVER_URL, {
      query: {token}, // Pass token as query parameter
    });

    console.log(token, newSocket.id, 'reconnect');
    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected.');
    });

    setSocket(newSocket);
  };

  useEffect(() => {
    initializeSocket();

    return () => {
      console.log('Cleaning up socket connection.');
      // newSocket.disconnect();
    };
  }, []); // Run once on mount

  const reconnectSocket = () => {
    console.log('Forcing socket reconnection...');
    setSocket(null); // This will trigger a re-render
    setTimeout(() => {
      initializeSocket(); // Reconnect after a small delay
    }, 100);
  };

  return {socket, reconnectSocket};
};

export default useSocket;
