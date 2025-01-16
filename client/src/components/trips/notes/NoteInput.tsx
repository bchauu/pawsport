import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet,Button, TextInput } from 'react-native';

const NoteInput = ({item, newNoteAdded, handleEnteredNotes, addNotes, isItemNotesCollapsed}) => {
   const [enteredNotes, setEnteredNotes] = useState('');

   useEffect(() => {
      setEnteredNotes('');
    }, [newNoteAdded])

   useEffect(() => {
      handleEnteredNotes(enteredNotes, item);  
   }, [enteredNotes])

   const handleNoteInput = async (value) => {
      setEnteredNotes(value);
   }

   return (
      <>
        {isItemNotesCollapsed[item.id]?.isCollapsed && (
          <View>
            <TextInput 
              placeholder="new notes..." 
              onChangeText={value => handleNoteInput(value)} 
              value={enteredNotes} 
            />
            <Button title="add notes" onPress={()=> addNotes(item)} />
          </View>
        )}
      </>
    );
}

export default NoteInput;