import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, FlatList } from 'react-native';

const Chat = ({listId, roomId, chat, socket}) => {
  const [message, setMessage] = useState('');

  const sendMessage = () => {
    if (socket && message) {
        console.log(roomId, 'roomId in chat')
      socket.emit('sendMessage', { roomId, message }, (response) => { //sending to testMessage worked. try to augment testMessage instead to debug
        if (response.status === 'success') setMessage('');
      });
    }
  };

  return (
    <View>
      <FlatList
        data={chat}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <Text>
            {item.userId}: {item.text}
          </Text>
        )}
        style={styles.chatContainer}
      />
      <View style={styles.space}></View>
      <TextInput
        placeholder="Type a message"
        value={message}
        onChangeText={setMessage}
        style={styles.textInput}
        multiline={true}
      />
      <Button title="Send" onPress={sendMessage} />

    </View>
  );
};

const styles = StyleSheet.create({
  chatContainer: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    width: '90%',
    minWidth: '90%',
    maxHeight: '90%',  // Limit the height of the chat container
    // zIndex: 10
  },
  space: {
    padding: 1
  },
  textInput: {
    paddingTop: -5,
    paddingLeft: 2,
    paddingRight: 2,
    maxWidth: '90%',
    height: 40,
    // backgroundColor: 'blue'
  }
})

export default Chat;