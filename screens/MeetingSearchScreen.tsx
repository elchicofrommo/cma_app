import React, { useState, useEffect, useCallback, memo } from 'react';
import {
  Image, Platform, StyleSheet, Text, TouchableOpacity,
  TextInput, View, Button, Dimensions, Keyboard, Linking, FlatList
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import { connect } from 'react-redux';

import { createStackNavigator,  } from '@react-navigation/stack';

import * as Location from 'expo-location';
import axios from 'axios';
import moment from 'moment'
import MeetingListRow from '../components/MeetingListRow'
import {DetailsScreen, DetailsBackButton, DetailTransition} from './MeetingDetailsScreen'

const {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT
} = Dimensions.get('window')
const fontScale = SCREEN_WIDTH / 320;

const daysOfWeek = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6
}


const MeetingStack = createStackNavigator();
export {MeetingList, sortMeetings}
export default function MeetingSearchScreenStack() {
  console.log(`rendering meetingstack`)
  return (
    <MeetingStack.Navigator >
      <MeetingStack.Screen
        name="Meeting Search"
        component={MeetingSearchScreen}

        options={({ navigation, route }) => ({

          headerStyle: {
            backgroundColor: '#1f6e21',

          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontFamily: 'merriweather',
            fontSize: 18 * fontScale
          },

          

        })}
      />

      <MeetingStack.Screen
        name="Details"
        component={DetailsScreen}

        options={({ navigation, route }) => ({

          headerStyle: {
            backgroundColor: '#FFF',
            shadowColor: 'transparent'
          },
          title: '',
          headerTintColor: '#1f6e21',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontFamily: 'merriweather',
            fontSize: 18 * fontScale,
            borderBottomWidth: 0,
            

          },
          headerLeft: () => <DetailsBackButton navigation={navigation}/>,
          ...DetailTransition
        })} />

    </MeetingStack.Navigator>
  )
}

function sortMeetings(meetings) {
  meetings.sort((a, b) => {

    let aDay = daysOfWeek[a.weekday]
    if (aDay < moment().weekday())
      aDay += 7;
    let
      bDay = daysOfWeek[b.weekday]
    if (bDay < moment().weekday())
      bDay += 7


    const dayMath = aDay - bDay
    if (dayMath != 0)
      return dayMath

    let aTime = moment(a.start_time, 'H:mm A');
    let bTime = moment(b.start_time, 'H:mm A');

    return aTime.valueOf() - bTime.valueOf();
  })
  return meetings;
}


function MeetingList({meetingData, action}){

  const keyExtractorCallback = useCallback((data) => { return data._id })

  const renderCallback = useCallback(({ item, index }, rowMap) => {
    //renderBackRow({data, rowMaps, props}),[])
    console.log(`item is :  index is: ${index} rowMap is ${rowMap} `)
    return <MeetingListRow meeting={item}
      saved={true}
      action={action}/>
  }, [])

  return(
    <FlatList
        data={meetingData}
        renderItem={renderCallback}
        keyExtractor={keyExtractorCallback}
        initialNumToRender={5}
      />
  )
}
function MeetingSearchScreen({ navigation, ...props }) {

  console.log(`rendering MeetingSearchScreen`)
  const emptyView = <View></View>
  const [address, setAddress] = useState(null);
  const [meetingData, setMeetingData] = useState();
  const [distance, setDistance] = useState(5)
  const [message, setMessage] = useState(null)
  const [meetingComponents, setMeetingComponents] = useState(emptyView)
  const [expanded, setExpanded] = useState(false)


  useEffect(() => {
    console.log(`observing the message changed in gratitude screen`)
    

  }, [])

  useEffect(() => {
    console.log(`meetingData changed`)


  }, [meetingData])


  async function getMeetings() {

    Keyboard.dismiss();

    let lat = 0;
    let long = 0
    setMessage("Working ...")
    setMeetingData(null)
    setMeetingComponents(emptyView)

    let { status } = await Location.requestPermissionsAsync();
    if (status !== 'granted') {
      setMessage("You must enable location in Settings to use current location. \
      Otherwise you may enter an address");
      return;
    }
    console.log("have location permission ");

    if (!address) {
      const location = await Location.getCurrentPositionAsync({});
      lat = location.coords.latitude;
      long = location.coords.longitude
    } else {
      try {
        const location = await Location.geocodeAsync(address)
        console.log(`found address for ${address} ${JSON.stringify(location)}`)
        lat = location[0].latitude;
        long = location[0].longitude;
      } catch (err) {
        alert("Could not find address");
        return;
      }
    }

    const query = `https://api.bit-word.com/api/cma/meeting?long=${lat}&lat=${long}&distance=${distance * 1609}`;

    console.log(`runnign query ${query}`)

    let response = ""
    try {
      response = await axios.get(query)
    } catch{
      setMessage("Network problmes. Try again");
      return;
    }

    if (response.data.error) {
      console.log(`problem getting data ${response.data.error}`)
      setMessage("System problem finding meetings. Try again later")
    } else {


      setMessage(`${response.data.length} meetings found`);
      setMeetingData(sortMeetings(response.data))
    }

  }




  return (

    <View style={styles.container}>
      <View style={{ backgroundColor: '#fff', paddingHorizontal: 10 * fontScale, }}>
        <View style={{ backgroundColor: '#fff', paddingVertical: 15 * fontScale }}>

          <TextInput
            placeholder="[Current Location]"
            autoCapitalize="none"
            style={[styles.textField]}
            onChangeText={(location) => { (setAddress(location)) }}
          />
          <Text style={{ fontSize: 10 * fontScale, color: 'red' }}>Address</Text>
        </View>
        <View style={{ backgroundColor: '#fff', paddingVertical: 15 * fontScale }}>

          <TextInput keyboardType='numeric'
            placeholder="[Default 5 miles]"
            autoCapitalize="none"
            style={[styles.textField]}
            onChangeText={(location) => { (setDistance(location)) }}
          />
          <Text style={{ fontSize: 10 * fontScale, color: 'red' }}>Distance</Text>
        </View>

        <View style={{}}>
          <TouchableOpacity style={styles.button} onPress={getMeetings}>
            <Text style={styles.buttonText}>Find</Text>
          </TouchableOpacity>
        </View>
        <View style={{ display: message ? "flex" : "none", justifyContent: 'space-between', flexDirection: "row", borderBottomWidth: 1 }}>
          <Text style={[styles.message,]}>{message}</Text>

        </View>


      </View>


      <MeetingList meetingData={meetingData} 
        action={(row)=>{
         // props.dispatchHideMenu(); 
          navigation.navigate('Details', row)
        }}/>


      </View>


  );

}


MeetingSearchScreen = connect(
  function mapStateToProps(state) {

    const { authenticated, meetings } = state.general;
    return {
      authenticated, meetings
    };
  },
  function mapDispatchToProps(dispatch) {
    return {

      dispatchSetDetail: (data) => {
        console.log(`set detail data is `)
        dispatch({ type: "SET_DETAIL", meetingDetail: data })
      },

      dispatchShowMenu: (data) => {
        console.log("dispatching show menu ")
        dispatch({ type: "SHOW_MENU" })
      },
      dispatchHideMenu: (data) => {
        console.log("dispatching hide menu ")
        dispatch({ type: "HIDE_MENU" })
      },
    }
  }
)(MeetingSearchScreen)


const styles = StyleSheet.create({

  icon: {
    color: 'gray'
  },
  rowBack: {
    backgroundColor: '#0273b1',
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row'
  },


  title: {
    flex: 6,
    flexWrap: 'wrap'
  },

  message: {
    fontSize: 14 * fontScale,
    paddingTop: 10 * fontScale,
  },
  buttonText: {
    fontSize: 20 * fontScale,
    color: 'white',
  },

  button: {
    backgroundColor: '#1f6e21',
    paddingVertical: 5 * fontScale,
    textAlign: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },

  container: {
    flex: 1,
    backgroundColor: '#FFF',
    justifyContent: "space-between"
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'yellow',
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

  textField: {
    fontSize: 19 * fontScale
  },
});
