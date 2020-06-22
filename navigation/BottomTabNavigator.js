import { createBottomTabNavigator, BottomTabBar } from '@react-navigation/bottom-tabs';
import React, {useState, useEffect} from 'react';
import { StyleSheet, View, Animated, Easing, Platform, Keyboard} from 'react-native';
import { MonoText } from '../components/StyledText';
import Colors from '../constants/Colors'
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

    console.log(`tab navigator visibility: ${visible}`)
    const gratitude = props.authenticated ? 
      <BottomTab.Screen name="Gratitude" component={GratitudeScreen}
        options={{
          tabBarIcon: ({ focused, color }) => <FontAwesomeIcon icon={faPagelines} style={{color: color}}  size={25}/>,
        }}/> : undefined
    const display = Platform.OS==='android'? {display: visible? 'flex': 'none'}:{}
  return (

    <BottomTab.Navigator  
    tabBar={MyTabBar}
    
    tabBarOptions={{
      activeTintColor: Colors.primary,
      inactiveTintColor: 'gray',
      showLabel: true,
      style: {
        borderTopWidth: 1,
        backgroundColor: 'white',
        ...display
      },
      labelStyle:{
        marginTop: Platform.OS==='ios'?-10: -5,
        marginBottom: Platform.OS==='ios'?-5: 0,
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
        component={MeetingSearchScreen}
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
    console.log(`toggletab ${state.general.tabExpanded}`)
      return {tabExpanded: state.general.tabExpanded,
        authenticated: state.general.authenticated
      };
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
