import React, { useContext } from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AudioList from '../screens/AudioList';
import Player from '../screens/Player';
import PlayList from '../screens/PlayList';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { AudioContext } from '../context/AudioProvider';
import Toast from 'react-native-root-toast';

const Tab = createBottomTabNavigator();
export default function AppNavigator() {
  const context = useContext(AudioContext);

  return (
    <Tab.Navigator
      initialRouteName="AudioList"
      screenOptions={() => ({
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          padding: 5,
          height: 60,
        },
        tabBarActiveTintColor: '#ec3d06',
        tabBarInactiveTintColor: '#5252ad',
        tabBarLabelStyle: {
          fontFamily: 'iranYekan',
          fontSize: 12,
        },
      })}
    >
      <Tab.Screen
        name="Player"
        component={Player}
        options={({ navigation }) => ({
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <FontAwesome5 name="compact-disc" size={size} color={color} />
              <Text
                style={{
                  color: focused ? '#2d2149' : '#555',
                  fontFamily: 'iranYekan',
                }}
              >
                رادیو
              </Text>
            </View>
          ),
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              onPress={() => {
                if (context && context.playbackObj._loaded) {
                  navigation.navigate('Player');
                } else {
                  Toast.show(
                    'لطفا ابتدا قسمت مورد نظر را از لیست پخش انتخاب نمایید',
                    {
                      duration: Toast.durations.LONG,
                      position: Toast.positions.TOP,
                      shadow: false,
                      animation: true,
                      hideOnPress: true,
                      backgroundColor: 'yellow',
                      textColor: 'black',
                      delay: 0,
                      opacity: 1,
                      textStyle: {
                        fontFamily: 'iranYekan',
                        fontSize: 12,
                        textAlign: 'right',
                      },
                    }
                  );
                }
              }}
            />
          ),
        })}
      />
      <Tab.Screen
        name="AudioList"
        component={AudioList}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <MaterialIcons name="headset" size={size} color={color} />
              <Text
                style={{
                  color: focused ? '#2d2149' : '#555',
                  fontFamily: 'iranYekan',
                }}
              >
                لیست پخش
              </Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
