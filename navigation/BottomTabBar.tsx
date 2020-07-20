import {  BottomTabBar } from '@react-navigation/bottom-tabs';
import React, {useState, useEffect,} from 'react';
import { StyleSheet, View, Animated, Easing, TouchableOpacity, Text} from 'react-native';
import Colors from '../constants/Colors';
import { connect } from 'react-redux';
import log from '../util/Logging'

let TabBar  = function ({ state, descriptors, navigation, style, ...props }) {
  
  log.info('rendering TabBar')
  log.info(`showMenu is ${props.showMenu}`)
  const [offset, setOffset] = useState(new Animated.Value(80))
  const [isVisible, setIsVisible] = useState(true)

  
  function show(){

    Animated.timing(offset, {
      toValue: 80,
      useNativeDriver: false,
      duration: 200,
      easing: Easing.inOut(Easing.sin),
    }).start();

  }

  function hide(){
    log.info('hiding menu')
    Animated.timing(offset, {
      toValue: 0,
      useNativeDriver: false, 
      duration: 200,
    }).start();

  }

/*
    if(props.showMenu){
      show()
    }else{
      hide()
    }

*/
  

  const transform = {
    height: offset
  }

  
  return (

            <BottomTabBar state={state} navigation={navigation} descriptors={descriptors} style={[style]} {...props}/>

  );

}

 
TabBar =  connect(
    function mapStateToProps(state){
        const {submenus, showMenu} = state.general
        return {submenus, showMenu}
      }, 
      function mapDispatchToProps(dispatch){
        return {
  
        }
  
      }
)(TabBar)

export default (props) => <TabBar {...props} />
