import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet,Button, TextInput } from 'react-native';


const NotesSection = ({isItemNotesCollapsed, notes, item}) => {
  
     return (
        <View> 
        {isItemNotesCollapsed[item.id]?.isCollapsed &&
          notes
            .filter((listItem) => listItem.parentId === item.id)
            .flatMap((item) => item.notes)
            .map((note, index) => (
              <Text key={index}>
                {note}
              </Text>
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