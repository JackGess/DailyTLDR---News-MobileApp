import { SafeAreaView } from 'react-native-safe-area-context';
import { useContext, useState } from 'react';
import { Text, ActivityIndicator, StyleSheet, Button, View} from 'react-native';
import {AuthProvider, AuthContext} from './src/contexts/AuthContext';
import {Alert, ScrollView} from "react-native";
import {triggerManualDigest, getLatestDigest} from "./src/services/DigestService";

const AuthStatus = () => {
  const {user, profile, loading, isNewUser, createProfile} = useContext(AuthContext);
  const [isCreating, setIsCreating] = useState(false);
  const [digestData, setDigestData] = useState(null);
  const [generating, setGenerating] = useState(false);

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      await createProfile("Jester-Tester");
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Could not create profile.");
    }
    setIsCreating(false);
  };

  const handleGenerate = async () => {
    if(!user) return;

    setGenerating(true);
    setDigestData(null);

    try {
      console.log("triggering cloud functions...")
      await triggerManualDigest();

      console.log("Fetching new data...")
      const data = await getLatestDigest(user.uid);

      console.log("Data Received:", data);

      setDigestData(data);

    } catch (e) {
      Alert.alert("Error", "Generation failed. Check console for Index Link.");
    }
    setGenerating(false);
  }

  if (loading) return <ActivityIndicator size="large" color="blue" />
  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <View>
      <Text style={styles.label}>Slice 2: Identity Verification</Text>

      <Text style={styles.label}>User ID:</Text>
      <Text style={styles.value}>{user ? user.uid : 'No User'}</Text>

      <Text style={styles.label}>Is New User?</Text>
      <Text style={styles.value}>{isNewUser ? 'YES (Needs Profile)' : 'NO (Has Profile)'}</Text>

      <Text style={styles.label}>Profile Topic:</Text>
      <Text style={styles.value}>{profile ? profile.topic : 'N/A'}</Text>
      </View>

      {isNewUser ? (
        //if user needs a profile
        <View style={{ marginTop: 20 }}>
          <Button
            title={isCreating ? "Creating..." : "Create Test Profile"}
            onPress={handleCreate}
            disabled={isCreating}
          />
        </View>
      ) : (
        //if profile exists
        <View style={{ marginTop: 20 }}>
          <Button
            title={generating ? "Generating (~20s)..." : "Generate Daily Digest"}
            onPress={handleGenerate}
            disabled={generating}
            color="blue"
          />
        </View>
      )}

      {/* RESULT DISPLAY */}
      {digestData && (
        <ScrollView style={styles.resultBox}>
          <Text style={styles.resultHeader}>Latest Digest Loaded!</Text>
          <Text style={{ marginBottom: 10 }}>Topic: {digestData.topic}</Text>

          <Text style={styles.subHeader}>Key Takeaways:</Text>
          {digestData.overall_key_takeaways && digestData.overall_key_takeaways.map((point, index) => (
            <Text key={index} style={styles.bulletPoint}>• {point}</Text>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function App(){
  return (
 <AuthProvider>
   <AuthStatus />
 </AuthProvider>
  );
}

export default App;

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    color: '#666',
    marginTop: 10
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333'
  },

  resultBox: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    maxHeight: 300,
    flex: 1,
  },
  resultHeader: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
    color: '#2e7d32',
  },
  subHeader: {
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  bulletPoint: {
    fontSize: 14,
    marginBottom: 4,
    lineHeight: 20,
  }
});