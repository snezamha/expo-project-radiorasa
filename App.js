import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './app/navigation/AppNavigator';
import AudioProvider from './app/context/AudioProvider';
import { StatusBar } from 'expo-status-bar';
import { RootSiblingParent } from 'react-native-root-siblings';

import { useFonts } from 'expo-font';
export default function App() {
  let [fontsLoaded] = useFonts({
    iranYekan: require('./assets/fonts/IRANYekanMobileLight.ttf'),
    iranYekanFaNum: require('./assets/fonts/IRANYekanRegularFaNum.ttf'),
  });

  if (!fontsLoaded) {
    return <></>;
  }
  return (
    <RootSiblingParent>
      <AudioProvider>
        <NavigationContainer>
          <AppNavigator />
          <StatusBar hidden={true} style="auto" />
        </NavigationContainer>
      </AudioProvider>
    </RootSiblingParent>
  );
}
