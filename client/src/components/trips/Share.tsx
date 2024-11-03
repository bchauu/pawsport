import React, {useState} from 'react';
import { TextInput, Button, StyleSheet, View } from 'react-native';

const Share = ({handleShare}) => {

  const [inputValue, setInputValue] = useState('');
  const [showTextField, setShowTextField] = useState(false);

  const handleChange = () => {
    // setInputValue(text); // Update state when the input value changes
    handleShare(inputValue);
    setInputValue('');
  };

  const toggleVisibility = () => {
    setShowTextField(!showTextField);  // Toggle visibility
  };
  return (
    <View>
      <Button title={showTextField ? 'Hide' : 'Share'} onPress={toggleVisibility} />
      {showTextField && (
      <>
        <TextInput
          style={styles.input}
          value={inputValue}
          onChangeText={setInputValue}  // Update state when the input changes
          placeholder="Enter email or username"
        />
        <Button title="Submit" onPress={handleChange}/>
      </>
      )}
  </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default Share;