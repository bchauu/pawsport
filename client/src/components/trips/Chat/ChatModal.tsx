import React, {useState, useEffect} from "react";
import { View, Modal, Button, Text, StyleSheet, Dimensions } from "react-native";
import Chat from "./Chat";
import { TouchableOpacity } from "react-native-gesture-handler";

const ChatModal = ({setIsNewMessage, setNewMessageCount, newMessageCount, socket, listId, roomId, userEmail, setUserEmail, chat, setChat}) => {
    const [modalVisible, setModalVisible] = useState(false);

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    useEffect(() => {
        if (!socket) return;
      
        const handleReceiveMessage = (data) => {
          setChat((prevChat) => [...prevChat, data]); // Update chat state
        };
      
        const joinRoom = async () => {
          try {
            await delay(50); // Add delay to ensure other components/rendering are ready
      
            if (roomId) {
              await socket.emit('leaveRoom', roomId); // Always leave the current room
              console.log(`Left room: ${roomId}`);
            }
      
            await delay(100); // Add delay before joining the new room
      
            await socket.emit('startChat', listId, (response) => {
              if (response.status === 'success') {
                console.log(`Successfully joined room with listId: ${listId}`);
              } else {
                console.error('Failed to join room:', response.reason);
              }
            });
      
            setChat([]); // Clear chat when switching rooms
          } catch (error) {
            console.error('Error joining room:', error);
          }
        };
      
        joinRoom();
        socket.on('receiveMessage', handleReceiveMessage);
      
        return () => {
          socket.emit('leaveRoom', roomId); // Leave the room
          socket.off('receiveMessage', handleReceiveMessage); // Remove the listener
        };
      }, [listId, roomId, socket]);

    const handleCollab = () => {
        setNewMessageCount(0);
        setIsNewMessage(false);
        setModalVisible(true)
    }

    const closeModal = () => {
        setNewMessageCount(0);
        setIsNewMessage(false)
        setModalVisible(false)
    }

    return (
        <View>
            <TouchableOpacity
                onPress={() => handleCollab()}
                style={styles.planButton}
            >
                <Text style={styles.planButtonText}>
                    Plan Together ✈️
                </Text>
            </TouchableOpacity>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={()=> closeModal()}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.container}>
                        <View style={styles.minContainer}>
                            <TouchableOpacity
                                onPress={() => closeModal()}
                                style={styles.minButton}
                            >
                                <Text style={styles.minButton} >
                                ➖
                                </Text>
                            </TouchableOpacity>
                        </View>
      
                        <Chat
                            listId={listId}
                            roomId={roomId}
                            socket={socket}
                            userEmail={userEmail}
                            setUserEmail={setUserEmail}
                            chat={chat}
                            setChat={setChat}
                        />
                    </View>
                </View>
            </Modal>

        </View>
    )
}

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
    modalBackground : {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        width: '99%',  
    },
    container: {
        height: height / 2, 
        width: '70%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#87CEEB',  // Sky blue without transparency
        padding: 1,
        paddingTop: 11,
        paddingBottom: 25,
        borderRadius: 10,
        borderStyle: 'solid',
        borderColor: 'grey',
        borderWidth: .17, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.6,
        shadowRadius: 10,
        elevation: 10,
    },
    minContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '100%',
        right: 1.5,
    },
    planButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(135, 206, 235, 0.85)', // Soft blue background
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      planButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 8, // Space for an optional icon
      },
      iconStyle: {
        color: '#fff',
        fontSize: 18,
      },
    minButton: {
        fontSize: 16,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 2 },
        textShadowRadius: 3,
    }
})

export default ChatModal;