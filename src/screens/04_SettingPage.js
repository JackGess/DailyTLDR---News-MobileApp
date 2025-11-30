import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { SettingsContext } from '../contexts/SettingsContext';

const SettingsPage = () => {
  // todo: Use these values to build the UI switches
  const { isDarkMode, toggleTheme, isTTSEnabled, toggleTTS } = useContext(SettingsContext);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Settings Page (Under Construction)</Text>
      <Text>TTS Enabled: {isTTSEnabled ? "YES" : "NO"}</Text>
      <Button title="Toggle TTS" onPress={toggleTTS} />
    </View>
  );
};
const styles = StyleSheet.create({ container: { flex:1, justifyContent:'center', alignItems:'center' } });
export default SettingsPage;