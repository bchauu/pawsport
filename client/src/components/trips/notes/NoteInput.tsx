import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet,Button, TextInput } from 'react-native';

const NoteInput = ({item, newNoteAdded, handleEnteredNotes, addNotes}) => {
   const [enteredNotes, setEnteredNotes] = useState('');

   useEffect(() => {
         console.log('is enteredNotes resetting')
         setEnteredNotes('');
    }, [newNoteAdded])

   useEffect(() => {
      console.log(enteredNotes, 'enteredNotes')
      handleEnteredNotes(enteredNotes, item);  
   }, [enteredNotes])

   const handleNoteInput = async (value) => {
      setEnteredNotes(value);
   }

   const checkNotes = () => {
      console.log(enteredNotes, 'enteredNotes after resetting')
   }
     return (
        <View>
         <TextInput placeholder="new notes..." onChangeText={value => handleNoteInput(value)} value={enteredNotes}/>
         <Button title="add notes" onPress={addNotes}/>
         <Button title="notes" onPress={checkNotes}/>
        </View>
     )
}

export default NoteInput;