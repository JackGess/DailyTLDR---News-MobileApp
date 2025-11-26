import { SafeAreaView } from 'react-native-safe-area-context';
import { useContext } from 'react';
import { Text, ActivityIndicator, StyleSheet} from 'react-native';
import {AuthProvider, AuthContext} from './src/contexts/AuthContext';

const AuthStatus = () => {
  const {user, profile, loading, isNewUser} = useContext(AuthContext);

  if (loading) return <ActivityIndicator size="large" color="blue" />
  return (
    <SafeAreaView>
      <Text style={styles.label}>Slice 2: Identity Verification</Text>

      <Text style={styles.label}>User ID:</Text>
      <Text style={styles.value}>{user ? user.uid : 'No User'}</Text>

      <Text style={styles.label}>Is New User?</Text>
      <Text style={styles.value}>{isNewUser ? 'YES (Needs Profile)' : 'NO (Has Profile)'}</Text>

      <Text style={styles.label}>Profile Topic:</Text>
      <Text style={styles.value}>{profile ? profile.topic : 'N/A'}</Text>
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
  }
});