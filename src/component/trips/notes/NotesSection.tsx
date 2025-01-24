import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useTheme} from '../../../context/ThemeContext';

const NotesSection = ({
  isItemNotesCollapsed,
  handleCategoryChange,
  notes,
  item,
}) => {
  const [activeCategory, setActiveCategory] = useState('Important');
  const {theme} = useTheme();

  const categories = [
    {label: '📌 Important Notes', value: 'Important Notes'},
    {label: '📋 Logistics', value: 'Logistics'},
    {label: '📦 Misc', value: 'Misc'},
  ];

  const updateCategory = selectedCategory => {
    setActiveCategory(selectedCategory);
    handleCategoryChange(selectedCategory, item.id);
  };

  return (
    <View>
      {isItemNotesCollapsed[item.id]?.isCollapsed && (
        <View>
          {/* Category Buttons */}
          <View style={styles.buttonContainer}>
            {categories.map(category => (
              <TouchableOpacity
                key={category.value}
                style={[
                  styles.categoryButton,
                  activeCategory === category.value && styles.activeButton,
                ]}
                onPress={() => updateCategory(category.value)} // Update active category
              >
                <Text
                  style={[
                    styles.buttonText,
                    activeCategory === category.value &&
                      styles.activeButtonText,
                  ]}>
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <ScrollView>
            {/* Notes Section */}
            {notes
              .filter(listItem => listItem.parentId === item.id) // Filter by parent item
              .flatMap(
                listItem =>
                  listItem.notes.filter(
                    note => note.category === activeCategory,
                  ), // Filter by active category
              )
              .map((note, index) => (
                <View key={index}>
                  <Text style={theme.personalList.notesItem}>
                    {note.message}
                  </Text>
                  <Text>{note.user}</Text>
                </View>
              ))}

            {/* Show a message if no notes exist for the selected category */}
            {notes
              .filter(listItem => listItem.parentId === item.id)
              .flatMap(listItem =>
                listItem.notes.filter(note => note.category === activeCategory),
              ).length === 0 && (
              <Text style={styles.noNotesText}>
                No notes available for this category.
              </Text>
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  categoryButton: {
    padding: 10,
    margin: 5,
    borderRadius: 5,
    backgroundColor: '#e0e0e0',
  },
  activeButton: {
    backgroundColor: '#007bff',
  },
  buttonText: {
    color: '#333',
  },
  activeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noNotesText: {
    textAlign: 'center',
    color: '#888',
    marginVertical: 10,
    fontSize: 16,
  },
});

export default NotesSection;
