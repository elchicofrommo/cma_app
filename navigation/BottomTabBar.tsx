import {  BottomTabBar } from '@react-navigation/bottom-tabs';
import React, {useState, useEffect,} from 'react';
import { StyleSheet, View, Animated, Easing, TouchableOpacity, Text} from 'react-native';

import { connect } from 'react-redux';


let TabBar  = function ({ state, descriptors, navigation, style, ...props }) {
  
  console.log('rendering TabBar')
  console.log(`showMenu is ${props.showMenu}`)
  const [offset, setOffset] = useState(new Animated.Value(0))

  function show(){

    Animated.timing(offset, {
      toValue: 0,
      useNativeDriver: true,
      duration: 200,
      easing: Easing.inOut(Easing.sin),
    }).start();

  }

  function hide(){

    Animated.timing(offset, {
      toValue: 100,
      useNativeDriver: true, 
      duration: 200,
    }).start();

  }

  if(props.showMenu){
    show()
  }else{
    hide()
  }

  const transform = {
    transform: [{ translateY: offset }]
  }
  const submenu = []

 for(const name in props.submenus){
   submenu.push(props.submenus[name])
 } 

 console.log(`submenu list has been built and is this long: ${submenu.length}`)
  
  return (
      <View>
        <Animated.View style={[{position: 'relative'}, transform]}>
            <BottomTabBar state={state} navigation={navigation} descriptors={descriptors} style={[style, {position: 'relative'}]} {...props}/>
        </Animated.View>
        {submenu}
      </View>
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
