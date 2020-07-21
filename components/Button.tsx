import React, { useState, useEffect, useCallback, memo, useRef } from "react";
import {

  Text,
  TouchableOpacity,

  Animated,
  Easing,
    StyleSheet,
    Platform,
  GestureResponderEvent,
} from "react-native";
import log from "../util/Logging"
import Colors from "../constants/Colors"
import Layout from "../constants/Layout"
export default function Button({onPress, label, style}:{onPress: (event: GestureResponderEvent) => void, label: string, style: any}){

    const [pressOffset, setPressOffset] = useState(new Animated.Value(0))
    function pressDown(){
      log.info("press down")
      Animated.timing(pressOffset, {
        toValue: 3,
        useNativeDriver: true,
        duration: 50,
        easing: Easing.linear
      }).start();
    }
  
    function pressUp(){
      Animated.timing(pressOffset, {
        toValue: 0,
        useNativeDriver: true,
        duration: 50,
        easing: Easing.linear
      }).start();
    }
  
    const buttonTransform = {
      transform: [{ translateY: pressOffset }, {translateX: pressOffset}],
    }
  
    return (
      <TouchableOpacity onPressIn={pressDown} onPressOut={pressUp} onPress={onPress} style={[style, buttonTransform]}>
        <Text style={styles.buttonText}>{label}</Text>
      </TouchableOpacity>
    )
  }


const shadow = Platform.OS === 'ios' ? {
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: .3,
  } : { elevation: 3 }
  
  const styles = StyleSheet.create({
   
    buttonContainer: {
      backgroundColor: Colors.primary,
      alignSelf: 'center',
      borderRadius: 17,
      paddingHorizontal: 10,
      paddingVertical: 5,
      ...shadow,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: 'lightgray'
    },
    buttonText:{
      color: Colors.primaryContrast,
  
      fontSize: 16 * Layout.scale.width,
  
  
    },
  });
  