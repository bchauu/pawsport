import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from "../../../context/ThemeContext";

const NotesSection = ({isItemNotesCollapsed, notes, item}) => {
  const { theme } = useTheme();
    // console.log(notes[0], 'notesection')

     return (
        <View> 
        {isItemNotesCollapsed[item.id]?.isCollapsed &&
          notes
            .filter((listItem) => listItem.parentId === item.id)
            .flatMap((item) => item.notes)
            .map((note, index) => (
              // console.log(note, 'test note')
              <View key={index}>
                <Text style={theme.personalList.notesItem}>
                  {note.message}
                </Text>
                <Text> {note.user}</Text>
              </View>
            ))
            //can make it collapsible to make it simpler
              // do i need conditional check if notes changes?
        }
      </View>
     )
}

const styles = StyleSheet.create({

})

export default NotesSection;