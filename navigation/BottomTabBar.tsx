import {  BottomTabBar } from '@react-navigation/bottom-tabs';
import React, {useState, useEffect,} from 'react';
import { StyleSheet, View, Animated, Easing, TouchableOpacity, Text} from 'react-native';
import Colors from '../constants/Colors';
import { connect } from 'react-redux';


let TabBar  = function ({ state, descriptors, navigation, style, ...props }) {
  
  console.log('rendering TabBar')
  console.log(`showMenu is ${props.showMenu}`)
  const [offset, setOffset] = useState(new Animated.Value(90))
  const [isVisible, setIsVisible] = useState(true)

  
  function show(){

    Animated.timing(offset, {
      toValue: 90,
      useNativeDriver: false,
      duration: 200,
      easing: Easing.inOut(Easing.sin),
    }).start();

  }

  function hide(){
    console.log('hiding menu')
    Animated.timing(offset, {
      toValue: 0,
      useNativeDriver: false, 
      duration: 200,
    }).start();

  }


    if(props.showMenu){
      show()
    }else{
      hide()
    }


  

  const transform = {
    height: offset
  }
  const submenu = []

 for(const name in props.submenus){
   submenu.push(props.submenus[name])
 } 

 console.log(`submenu list has been built and is this long: ${submenu.length}`)
  
  return (
      <View style={{display: isVisible? "flex": "none"}}>
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
