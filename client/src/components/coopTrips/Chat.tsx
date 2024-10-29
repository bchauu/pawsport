import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import config from '../../config';
import { getToken } from '../../utils/authStorage';
import axios from 'axios';
import io from 'socket.io-client';
import ChatMessages from './ChatMessages';

const SOCKET_SERVER_URL = "http://localhost:3000";  // Your backend URL


//display users who are currently active 

const Chat = ({userEmail, setUserEmail, chat, setChat}) => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  // const [userEmail, setUserEmail] = useState('');
  // const [chat, setChat] = useState([]);
  const [roomId, setRoomId] = useState('');
  const [isRoomCreated, setIsRoomCreated] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);  // New state for minimization
  const [animation] = useState(new Animated.Value(0));    // Animation value

  useEffect(() => {
    const getList = async () => {
      const token = await getToken();
      const { apiUrl } = await config();
      const response = await axios.get(`${apiUrl}/chat/user-cred`, {
          headers: {
            'authorization': `Bearer ${token}`
          }
      });
      setUserEmail(response.data.email);

  }
  getList();
  }, [])

  useEffect(() => {
    const socketConnection = async () => {
      const newSocket = io(SOCKET_SERVER_URL);
      setSocket(newSocket);
  
      const token = await getToken();
      newSocket.emit('authenticate', { token });  // Send the token after connecting
  
      newSocket.on('receiveMessage', (data) => {
        setChat((prevChat) => [...prevChat, data]);  // Update chat state with new message
      });
  
      return () => newSocket.close();
    };
  
    socketConnection();
  }, []);

  //I dont need to render Enter Chat conditionally
    // it will show message on useEffect
      // it will already be connected
        //and then handle changing list with exit and reenter new room

useEffect(() => {
  const newSocket = io(SOCKET_SERVER_URL);
  setSocket(newSocket);

  newSocket.on('receiveMessage', (data) => {
    setChat((prevChat) => [...prevChat, data]);
  });



  return () => newSocket.close();
}, []);



  const enterChat = () => {
    if (socket) {
      socket.emit('createRoom', (response) => {
        if (response.status === 'success') {
          setRoomId(response.roomId);
          setIsRoomCreated(true);
        }
      });
    }
  };

  const sendMessage = () => {
    if (socket && message && roomId) {
      socket.emit('sendMessage', { roomId, message }, (response) => {
        if (response.status === 'success') {
          setMessage('');
        } else {
          console.error(response.reason);
        }
      });
    }
  };

  // Function to toggle chat window between minimized and expanded
  const toggleChatWindow = () => {
    const finalValue = isMinimized ? 1 : 0;
    Animated.timing(animation, {
      toValue: finalValue,
      duration: 300,  // Animation duration
      useNativeDriver: false,
    }).start();

    setIsMinimized(!isMinimized);  // Toggle minimization state
  };

  // Interpolating the animation to control the height of the chat window
  const chatHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 300],  // Minimized height (50), expanded height (300)
  });

  return (
    <View style={styles.container}>
      {!isRoomCreated && (
        <View>
          <Button title="Enter Chat" onPress={enterChat} />
        </View>
      )}

      {/* {isRoomCreated && ( */}
        <Animated.View style={[styles.chatWindow, { height: chatHeight }]}>
          <TouchableOpacity onPress={toggleChatWindow} style={styles.header}>
            <Text style={styles.roomInfo}>
              Room ID: {roomId} (Tap to {isMinimized ? 'Expand' : 'Minimize'})
            </Text>
          </TouchableOpacity>

          {!isMinimized && (
            <View style={styles.chatContent}>
              <TextInput
                style={styles.input}
                value={message}
                onChangeText={setMessage}
                placeholder="Type a message..."
              />
              <Button title="Send Message" onPress={sendMessage} />
              
              {/* Use ChatMessages component to display chat */}
              {/* <ChatMessages chat={chat} userEmail={userEmail} /> */}
            </View>
          )}
        </Animated.View>
      {/* )} */}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      padding: 20,
      justifyContent: 'center',
    },
    chatWindow: {
      position: 'relative',
      backgroundColor: '#f0f0f0',
      borderRadius: 10,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: '#ccc',
      flexGrow: 0,
      flexShrink: 1,
      maxHeight: '80%',  // Ensure the chat doesn’t take up more than 80% of the screen height
      justifyContent: 'space-between',  // Ensure content is spaced evenly
    },
    header: {
      backgroundColor: '#ddd',
      padding: 10,
      alignItems: 'center',
    },
    roomInfo: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    chatContent: {
      flex: 1,  // Use flex to make sure chat messages take up available space
      padding: 10,
    },
    flatListContainer: {
      flex: 1,  // Make sure the FlatList is scrollable and uses available space
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
    },
    input: {
      flex: 0,  // Make the input field take the remaining space
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginRight: 10,
      paddingHorizontal: 8,
    },
    sendButton: {
      flexShrink: 1,  // Ensure the button doesn’t get cut off
    },
  });

export default Chat;