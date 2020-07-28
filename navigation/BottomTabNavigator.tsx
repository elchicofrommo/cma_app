import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, {useState, useEffect} from 'react';
import { StyleSheet, View, Animated, Easing, Platform, Keyboard} from 'react-native';

import {useColors} from '../hooks/useColors'

import AudioScreen from '../screens/AudioScreen';
import DocumentScreen from '../screens/DocumentScreen';
import GratitudeScreen from '../screens/GratitudeScreen';
import HomeScreen from '../screens/HomeScreen';

import { connect } from 'react-redux';

import log from '../util/Logging'
const BottomTab = createBottomTabNavigator();

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faHeadphones, faHome, faBook, faChair} from '@fortawesome/free-solid-svg-icons'
import { faPagelines} from '@fortawesome/free-brands-svg-icons'
import HomeGroupsScreen from '../screens/HomeGroupsScreen';



function BottomTabNavigator({ navigation, route, ...props }) {

  const {colors: Colors} = useColors();

  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html

  log.info(`rendering BottomTabNavigator`)
  
 
  const [visible, setVisible] = useState(true)

  function hideMenu(){
    setVisible(false)
  }

  function showMenu(){
    setVisible(true)
  }

  useEffect(()=>{
    const keyboardShow = Keyboard.addListener('keyboardDidShow', hideMenu);
    const keyboardHide = Keyboard.addListener('keyboardDidHide', showMenu);

    return  ()=>{
      keyboardShow.remove();
      keyboardHide.remove();
    }
  }, [])




    log.info(`tab navigator visibility: ${visible}`)
    const gratitude = props.authenticated ? 
      <BottomTab.Screen name="Gratitude" component={GratitudeScreen}
        options={{
          tabBarIcon: ({ focused, color }) => <FontAwesomeIcon icon={faPagelines} style={{color: color}}  size={25}/>,
        }}/> : undefined
    const display = Platform.OS==='android'? {display: visible? 'flex': 'none'}:{}
  return (

    <BottomTab.Navigator  

    
    tabBarOptions={{
      activeTintColor: Colors.primary1,
      inactiveTintColor: 'gray',
      showLabel: true,
      inactiveBackgroundColor: '#00000000',
      style: {
        borderTopWidth: 1,


        ...display
      },
      labelStyle:{


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
        name="Meetings"
        component={HomeGroupsScreen}
        options={{
          tabBarIcon: ({ focused, color }) => <FontAwesomeIcon icon={faChair} style={{color: color}}  size={25}/>,

        }}
      />
      <BottomTab.Screen
        name="Speakers"
        component={AudioScreen}
        options={{
          tabBarIcon: ({ focused, color }) => <FontAwesomeIcon icon={faHeadphones} style={{color: color}}  size={25}/>,
        }}
      />
      {gratitude}
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
    log.info(`toggletab ${state.general.tabExpanded}`)
      return {tabExpanded: state.general.tabExpanded,
        authenticated: state.general.operatingUser.role != 'guest'
      };
    }, 
    function mapDispatchToProps(dispatch){
      return {

      }

    }
)(BottomTabNavigator)




const styles = StyleSheet.create({
  bottomNav: {
    backgroundColor: '#000000AA',
    color: '#000000AA'
  }
})
