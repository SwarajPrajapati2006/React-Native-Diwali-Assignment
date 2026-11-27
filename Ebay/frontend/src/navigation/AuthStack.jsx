import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../features/7.Authentication/LoginScreen';
import { RegisterScreen } from '../features/7.Authentication/RegisterScreen';
import { BiometricUnlockScreen } from '../features/7.Authentication/BiometricUnlockScreen';

const Stack = createNativeStackNavigator();

export const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="BiometricUnlock" component={BiometricUnlockScreen} />
    </Stack.Navigator>
  );
};
