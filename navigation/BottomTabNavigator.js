import { createBottomTabNavigator, BottomTabBar } from '@react-navigation/bottom-tabs';
import React, {useState} from 'react';
import { StyleSheet, View, Animated, Easing} from 'react-native';
import { MonoText } from '../components/StyledText';

import TabBarIcon from '../components/TabBarIcon';
import AudioScreen from '../screens/AudioScreen';
import DocumentScreen from '../screens/DocumentScreen';
import GratitudeScreen from '../screens/GratitudeScreen';
import HomeScreen from '../screens/HomeScreen';
import MeetingSearchScreen from '../screens/MeetingSearchScreen';
import { connect } from 'react-redux';
import MyTabBar from './BottomTabBar';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Meeting';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faHeadphones, faHome, faBook, faHandsHelping, faChair} from '@fortawesome/free-solid-svg-icons'
import { faPagelines} from '@fortawesome/free-brands-svg-icons'
import { relativeTimeRounding } from 'moment';


function BottomTabNavigator({ navigation, route, ...props }) {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html

  console.log(`rendering BottomTabNavigator`)
  
  const [tabHeight, setTabHeight] = useState(
    new Animated.Value(0),
  );

  function show(){

    Animated.timing(tabHeight, {
      toValue: 0,
      useNativeDriver: true,
      duration: 500,
      easing: Easing.inOut(Easing.sin),
    }).start();
  }

  function hide(){

    Animated.timing(tabHeight, {
      toValue: -100,
      useNativeDriver: true, 
      duration: 500,
    }).start();
  }

  function toggleTab(){
    console.log(`toggle tab is ${props.tabExpanded}`)
    if(props.tabExpanded)
      show()
    else
      hide()

  }

  toggleTab()

  return (

    <BottomTab.Navigator  
    tabBar={MyTabBar}
    tabBarOptions={{
      activeTintColor: 'green',
      inactiveTintColor: 'gray',
      showLabel: false,
      style: {
        borderTopWidth: 1,
        backgroundColor: 'black',
      },

    }}>
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, color }) => <FontAwesomeIcon icon={faHome} style={{color: color}}  size={25}/>,

        }}
      />
      <BottomTab.Screen
        name="Meeting"
        component={MeetingSearchScreen}
        options={{
          tabBarIcon: ({ focused, color }) => <FontAwesomeIcon icon={faChair} style={{color: color}}  size={25}/>,

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
export default connect(
  function mapStateToProps(state, ownProps){
    console.log(`toggletab ${state.general.tabExpanded}`)
      return {tabExpanded: state.general.tabExpanded};
    }, 
    function mapDispatchToProps(dispatch){
      return {

      }

    }
)(BottomTabNavigator)




const styles = StyleSheet.create({
  bottomNav: {
    backgroundColor: '#fff',
    color: 'lightgray'
  }
})
