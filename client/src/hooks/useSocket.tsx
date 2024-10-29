import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { getToken } from '../utils/authStorage';

const useSocket =  () => {
    const [socket, setSocket] = useState(null);

    const SOCKET_SERVER_URL = "http://localhost:3000";  // Your backend URL

    useEffect(() => {
        const establishSocketConnection = async () => {
            const token = await getToken();
            console.log(token, 'useSocket occuring again')
            const newSocket = io(SOCKET_SERVER_URL, {
                query: {token}
            });    // socket connection
            setSocket(newSocket);   //calling that connection   --> set in state
    
            return () => {
                newSocket.close();
            }
        }

        establishSocketConnection();

    }, [])

    return socket;
}

export default useSocket;