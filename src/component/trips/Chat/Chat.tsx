import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  FlatList,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

const Chat = ({listId, roomId, chat, socket}) => {
  const [message, setMessage] = useState('');

  const sendMessage = () => {
    if (socket && message) {
      socket.emit('sendMessage', {roomId, message}, response => {
        if (response.status === 'success') {
          setMessage('');
        }
      });
    }
  };

  return (
    <View style={styles.chatContainer}>
      <FlatList
        data={chat}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <View style={styles.space}>
            <View style={styles.user}>
              <Text style={styles.username}>{item.userId}</Text>
              <Text>:</Text>
            </View>
            <Text>{item.text}</Text>
          </View>
        )}
        style={styles.chatBoxContainer}
      />
      <View style={styles.space} />
      <View style={styles.textInputContainer}>
        <TextInput
          placeholder="Type a message"
          value={message}
          onChangeText={setMessage}
          style={styles.textInput}
          multiline={true}
        />
        <TouchableOpacity style={styles.textButton} onPress={sendMessage}>
          <Text>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chatContainer: {
    backgroundColor: '#87CEEB',
    width: '99%',
    height: '100%',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  chatBoxContainer: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    minWidth: '90%',
    maxHeight: '90%',
  },
  space: {
    paddingBottom: 1,
  },
  user: {
    flexDirection: 'row',
  },
  username: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(211, 211, 211, 0.5)',
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingRight: 5,
    paddingBottom: 5,
    width: '100%',
    backgroundColor: 'rgba(211, 211, 211, 0.7)',
    borderRadius: 10,
  },
  textInput: {
    flex: 1,
    borderRadius: 10,
    paddingTop: 2,
    paddingLeft: 2,
    maxWidth: '80%',
    height: 40,
  },
  textButton: {
    zIndex: 10,
  },
});

export default Chat;
