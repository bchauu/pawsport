import React, {useState, useEffect} from "react";
import { View, Modal, Button, Text, StyleSheet, Dimensions } from "react-native";
import Chat from "./Chat";

const ChatModal = ({socket, listId, roomId, userEmail, setUserEmail, chat, setChat}) => {
    const [modalVisible, setModalVisible] = useState(false);

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    useEffect(() => {
        const getNewSocketConnection = async () => {
            try {
                await delay(50)
                await socket.emit('leaveRoom', roomId);

                await delay(100)
                await      socket.emit('startChat', listId, (response) => {
                    if (response.status === 'success') { 
                        console.log(`Successfully joined room with listId: ${listId} in chatModal`);
                    }
                });
                
            } finally {
                setChat([]);
            }
        }
        getNewSocketConnection();
    }, [roomId])

    useEffect(() => {
        if (!socket) return;
    
        console.log(listId, 'is this listId changing?');
    
        const handleReceiveMessage = (data) => {
            setChat((prevChat) => [...prevChat, data]);
            
        };

        socket.emit('startChat', listId, (response) => {
            if (response.status === 'success') { 
                console.log(`Successfully joined room with listId: ${listId} in chatModal`);
            }
        });
    
        socket.on('receiveMessage', handleReceiveMessage);
    
        return () => {
            socket.emit('leaveRoom', roomId);
            socket.off('receiveMessage', handleReceiveMessage); // clean up
        };
    }, [listId, socket]);

    return (
        <View>
            <Button title='Collab Chat' onPress={() => setModalVisible(true)}/>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={()=> setModalVisible(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.container}>

                        <Chat
                            listId={listId}
                            roomId={roomId}
                            socket={socket}
                            userEmail={userEmail}
                            setUserEmail={setUserEmail}
                            chat={chat}
                            setChat={setChat}
                        />
                        <Button title="Hide" onPress={() => setModalVisible(false)} />
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
        // backgroundColor: 'rgba(0, 0, 0, 0.5)'  // Semi-transparent black background

    },
    container: {
        height: height / 2, 
        width: '70%',  
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(135, 206, 235, 0.9)',  // Sky blue with 90% opacity
        padding: 20,
        paddingTop: 30,
        borderRadius: 10,
        borderStyle: 'solid',
        borderColor: 'black',
        borderWidth: 0.5,        // 1px border width
    }
})

export default ChatModal;