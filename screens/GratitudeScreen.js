
import React, {useState, useEffect, useRef} from 'react';
import { StyleSheet, Text, View, Dimensions, Animated, Easing } from 'react-native';
import { RectButton, ScrollView, TouchableOpacity } from 'react-native-gesture-handler';

import {NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

const GratitudeStack = createStackNavigator();
const {
  width: SCREEN_WIDTH, 
  height: SCREEN_HEIGHT
} = Dimensions.get('window')
const fontScale = SCREEN_WIDTH / 320;



export default function GratitudeScreenStack(props){
  console.log(`rendering gratitudestack`)
  return (
    <GratitudeStack.Navigator>
      <GratitudeStack.Screen 
        name="Growing Gratitude"
        component={GratitudeScreen} 
        options={({navigation, route, props})=>({

          headerStyle: {
            backgroundColor: '#1f6e21',
            shadowRadius: 0,
            shadowOffset: {
                height: 0,
            },
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontFamily: 'merriweather',
            fontSize:  18 * fontScale
          },
        })} />

    </GratitudeStack.Navigator>
  )
}
function Button({navigate}){ 
  return <OptionButton
    icon="md-school"
    label="Read the Expo documentation"
    onPress={() =>navigate("Detail")}
  />
}


function GratitudeScreen(props) {
  console.log(`rendering GratitudeScreen`)
  const [meetings, setMeetings] = useState(
    [{
      "_id": "5ebef20af9a382798559f4b5",
      "name": "The View From Here Group",
      "active": 1,
      "category": 3213,
      "start_time": "12:00 PM",
      "weekday": "Monday",
      "location": {
        "type": "Point",
        "coordinates": [
          -122.4340955,
          37.7611498
        ]
      },
      "street": "4058 18th St",
      "city": "San Francisco",
      "state": "CA",
      "zip": "94114",
      "dist": {
        "calculated": 3671.772803710437
      }
    },{
      "_id": "5ebef20af9a382798559f729",
      "name": "CMA Monday Nooner - Online Meeting",
      "active": 1,
      "category": 3213,
      "start_time": "12:00 PM",
      "weekday": "Monday",
      "location": {
        "type": "Point",
        "coordinates": [
          -122.4325682,
          37.7561438
        ]
      },
      "street": "https://meet.google.com/boq-nhum-qpn",
      "city": "San Francisco",
      "state": "CA",
      "zip": "94114",
      "dist": {
        "calculated": 4027.2561324519174
      }
    },{
      "_id": "5ebef20af9a382798559f72a",
      "name": "12:00pm Pacific - CMA Monday Nooner - Online Meeting - San Francisco.CA",
      "active": 1,
      "category": 4322,
      "start_time": "12:00 PM",
      "weekday": "Monday",
      "location": {
        "type": "Point",
        "coordinates": [
          -122.4325682,
          37.7561438
        ]
      },
      "street": "https://meet.google.com/boq-nhum-qpn",
      "city": "San Francisco",
      "state": "CA",
      "zip": "94114",
      "dist": {
        "calculated": 4027.2561324519174
      }
    }
  ]
  )


  return (

      <View style={styles.container}>

        


        <View>
          <Text>
            gratitude page
          </Text>
        </View>
        
      </View>

  );
}
/*
GratitudeScreen = connect(
    null, 
    function mapDispatchToProps(dispatch){
      return {
        dispatchSetDetail: (data) => {
          console.log("dispatching set detail ")
          dispatch({type: "SET_DETAIL", meetingDetail: data})
        },
        dispatchToggleDetail: (data) =>{
          console.log("dispatching show detail " )
          dispatch({type: "TOGGLE_DETAIL"})
        },
        dispatchRegisterSubmenu: (data) => {
          console.log("registering gratitude submenu")
          dispatch({type: "REGISTER_SUBMENU", data})
        }
      }

    }
)(GratitudeScreen) */

function OptionButton({ icon, label, onPress, isLastOption }) {
  return (
    <RectButton style={[styles.option, isLastOption && styles.lastOption]} onPress={onPress}>
      <View style={{ flexDirection: 'row' }}>
        <View style={styles.optionIconContainer}>
          <Ionicons name={icon} size={22} color="rgba(0,0,0,0.35)" />
        </View>
        <View style={styles.optionTextContainer}>
          <Text style={styles.optionText}>{label}</Text>
        </View>
      </View>
    </RectButton>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D4DAD4',
    marginHorizontal: 15,
    position: 'relative',

    zIndex: 20,
  },
  contentContainer: {
    paddingTop: 15,
  },
  optionIconContainer: {
    marginRight: 12,
  },
  slideDown:{
    position: 'absolute',
    top: 0,
    left: 0,
    height: 100,
    width: '100%',
    backgroundColor: '#1f6e21',
    zIndex: 10,
  },
  slideUp:{
    position: 'absolute',
    top: SCREEN_HEIGHT,
    left: 0,
    height: 200,
    width: '100%',
    backgroundColor: 'green',
    zIndex: 100,
  },
  option: {
    backgroundColor: '#fdfdfd',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 0,
    borderColor: '#ededed',

  },
  lastOption: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionText: {
    fontSize: 15,
    alignSelf: 'flex-start',
    marginTop: 1,
  },
});
