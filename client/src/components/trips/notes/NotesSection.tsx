import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet,Button, TextInput } from 'react-native';


const NotesSection = ({notes, item}) => {
     return (
        <View> 
        {
          notes
            .filter((listItem) => listItem.parentId === item.id)
            .flatMap((item) => item.notes)
            .map((note, index) => (
              <Text>
                {note}
              </Text>
            ))
            //can make it collapsible to make it simpler
              // do i need conditional check if notes changes?
        }
      </View>
     )
}

export default NotesSection;