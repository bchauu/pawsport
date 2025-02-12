import React, {useState} from 'react';
import {
  TextInput,
  Button,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import {useTheme} from '../../context/ThemeContext';

const Share = ({handleShare}) => {
  const {theme} = useTheme();
  const [inputValue, setInputValue] = useState('');
  // const [showTextField, setShowTextField] = useState(false);

  const handleChange = () => {
    // setInputValue(text); // Update state when the input value changes
    handleShare(inputValue);
    setInputValue('');
  };

  const toggleVisibility = () => {
    // setShowTextField(!showTextField);  // Toggle visibility
  };
  return (
    <View>
      {/* <Button title={showTextField ? 'Hide' : 'Invite'} onPress={toggleVisibility} /> */}
      {/* <TouchableOpacity
        onPress={toggleVisibility}
        style={[theme.ctaButton.default, styles.buttonContainer, {alignSelf: 'center', width: '100%'}]}
      >
        <Text style={[theme.ctaButton.text]}>
        {showTextField ? 'Hide' : 'Invite'}
        </Text>
      </TouchableOpacity> */}
      {/* {showTextField && ( */}
      <>
        <TextInput
          // style={styles.input}
          style={theme.inputs.default}
          value={inputValue}
          onChangeText={setInputValue} // Update state when the input changes
          placeholder="Enter email or username"
        />
        <TouchableOpacity
          onPress={handleChange}
          style={[theme.buttons.ctaButton, styles.buttonContainer]}>
          <Text style={[theme.buttons.ctaText]}>Submit</Text>
        </TouchableOpacity>
      </>
      {/* )} */}
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
