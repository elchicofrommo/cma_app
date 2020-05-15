import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';
import { StyleSheet, View} from 'react-native';
import { MonoText } from '../components/StyledText';

import TabBarIcon from '../components/TabBarIcon';
import AudioScreen from '../screens/AudioScreen';
import DocumentScreen from '../screens/DocumentScreen';
import GratitudeScreen from '../screens/GratitudeScreen';
import HomeScreen from '../screens/HomeScreen';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Meeting';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faHeadphones, faHome, faBook} from '@fortawesome/free-solid-svg-icons'
import { faPagelines} from '@fortawesome/free-brands-svg-icons'

export default function BottomTabNavigator({ navigation, route }) {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html


  return (

    <BottomTab.Navigator 
    tabBarOptions={{
      activeTintColor: 'green',
      inactiveTintColor: 'gray',
      showLabel: false,
      style: {
        borderTopWidth: 1,
        paddingTop: 5,
        backgroundColor: 'black'
      }
    }}>
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, color }) => <FontAwesomeIcon icon={faHome} style={{color: color}}  size={25}/>,

        }}
      />
      <BottomTab.Screen
        name="Audio"
        component={AudioScreen}
        options={{
          tabBarIcon: ({ focused, color }) => <FontAwesomeIcon icon={faHeadphones} style={{color: color}}  size={25}/>,
        }}
      />
      <BottomTab.Screen
        name="Gratitude"
        component={GratitudeScreen}
        options={{
          tabBarIcon: ({ focused, color }) => <FontAwesomeIcon icon={faPagelines} style={{color: color}}  size={25}/>,
        }}
      />
      <BottomTab.Screen
        name="Document"
        component={DocumentScreen}
        options={{
          tabBarIcon: ({ focused, color }) => <FontAwesomeIcon icon={faBook} style={{color: color}}  size={25}/>,
        }}
      />
    </BottomTab.Navigator>

  );
}

function getHeaderTitle(route) {
  const routeName = route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;

  switch (routeName) {
    case 'Meeting':
      return 'Meetings';
    case 'Audio':
      return 'Speakers Shares';
    case 'Gratitude':
      return 'Growing Gratitude';
    case 'Document':
      return 'Meeting Formats and more';
  }
}

const styles = StyleSheet.create({
  bottomNav: {
    backgroundColor: '#fff',
    color: 'lightgray'
  }
})
