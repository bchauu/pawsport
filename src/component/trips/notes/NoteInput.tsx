import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Button,
  TextInput,
} from 'react-native';
import {useTheme} from '../../../context/ThemeContext';

const NoteInput = ({
  item,
  newNoteAdded,
  handleEnteredNotes,
  addNotes,
  isItemNotesCollapsed,
}) => {
  const [enteredNotes, setEnteredNotes] = useState('');
  const {theme} = useTheme();

  useEffect(() => {
    setEnteredNotes('');
  }, [newNoteAdded]);

  useEffect(() => {
    handleEnteredNotes(enteredNotes, item);
  }, [enteredNotes]);

  const handleNoteInput = async value => {
    setEnteredNotes(value);
  };

  return (
    <>
      {isItemNotesCollapsed[item.id]?.isCollapsed && (
        <View>
          <TextInput
            placeholder="new notes..."
            onChangeText={value => handleNoteInput(value)}
            value={enteredNotes}
          />
          <TouchableOpacity
            onPress={() => addNotes(item)}
            style={theme.buttons.action}>
            <Text style={theme.buttons.actionText}>Add Note</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

export default NoteInput;
