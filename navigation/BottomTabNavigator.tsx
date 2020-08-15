import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, {useState, useEffect, Fragment} from 'react';
import { StyleSheet,Platform, Keyboard} from 'react-native';

import {useColors} from '../hooks/useColors'

import AudioScreen from '../screens/AudioScreen';
import DocumentScreen from '../screens/DocumentScreen';
import PostScreen from '../screens/PostScreen';
import HomeScreen from '../screens/HomeScreen';

import { connect } from 'react-redux';

import log from '../util/Logging'
const BottomTab = createBottomTabNavigator();

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { MaterialCommunityIcons } from '@expo/vector-icons';
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
    const post = props.authenticated ? 
      <BottomTab.Screen name="Circles" component={PostScreen}
        options={{
          tabBarIcon: ({ focused, color }) => 
            <Fragment>
                <MaterialCommunityIcons name="circle-outline" style={{color: color,marginLeft: 5, paddingTop: 3}}  size={25}/>
                <MaterialCommunityIcons name="circle-outline" style={{color: color,marginLeft: -10, marginTop: -21}}  size={25}/>
            </Fragment>,
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
      {post}
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
