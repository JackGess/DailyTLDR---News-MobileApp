import { SafeAreaView } from 'react-native-safe-area-context';
import { useContext, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AuthProvider, AuthContext } from './src/contexts/AuthContext';
import { colors } from './src/theme/colors';

import CustomizationScreen from './src/screens/03_CustomizationPage';
import HomePage from './src/screens/01_HomePage';
import AuthStatus from './src/components/AuthStatus';


const MainNavigator = () => {
  const { user, isNewUser, loading } = useContext(AuthContext);
  const [currentScreen, setCurrentScreen] = useState('home');

  if (loading) return <View style={{flex:1, justifyContent:'center'}}><ActivityIndicator size="large" color={colors.primary} /></View>;


  if (!user || isNewUser) {
    return <AuthStatus />;
  }

  if (currentScreen === 'settings') {
    return <CustomizationScreen onBack={() => setCurrentScreen('home')} />;
  }

  return (
    <HomePage onOpenSettings={() => setCurrentScreen('settings')} />
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainNavigator />
    </AuthProvider>
  );
}