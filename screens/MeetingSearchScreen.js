import * as WebBrowser from 'expo-web-browser';
import React, { useState, useEffect } from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, TextInput, View, Button, Dimensions } from 'react-native';

import { connect } from 'react-redux';
import { BorderlessButton, ScrollView } from 'react-native-gesture-handler';
import { SwipeListView } from 'react-native-swipe-list-view';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faGripLinesVertical} from '@fortawesome/free-solid-svg-icons';
import {NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Slider from '@react-native-community/slider';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import axios from 'axios';
import moment from 'moment'
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

const BackRowComponent = (data, rowMap, props) => {

  
  if(data.item.myCma){
    console.log(`this row ${JSON.stringify(data)}`)
    return (
      <TouchableOpacity style={[styles.rowBack, styles.rowBackRemove]} key={data._id}
      onPress={(rowPress)=>{
        console.log(`I am removing meeting ${JSON.stringify(data.item)}`)
        rowMap[data.item._id].closeRow()
        props.dispatchRemoveMeeting(data.item)
      }}>
      <Text style={styles.rowBackText}>Remove</Text>
    </TouchableOpacity>      
    )
  }

  else{
    return (
        <TouchableOpacity style={styles.rowBack} key={data._id}
        onPress={(rowPress)=>{
          console.log(`I am adding meeting ${JSON.stringify(data.item)}`)
          rowMap[data.item._id].closeRow()
          props.dispatchAddMeeting(data.item)
        }}>
        <Text style={styles.rowBackText}>Add</Text>
      </TouchableOpacity>
      )
    }
  }

  



function MeetingComponent ({item: meeting}){

 //console.log("building MeetingComponent " + JSON.stringify(meeting))
            // object is [{name, active, category, start_time (as string), weekday, street, city,state, zip, dist.calculated}
    return(
        <View key={meeting._id}
          style={{ 
            flexDirection: 'column',  
            backgroundColor: '#FFF', 
            borderBottomWidth: 1, 
            paddingLeft: 10 * fontScale, 
            paddingVertical: 10* fontScale,
            justifyContent: "space-between",
            flexDirection: "row"
          }}>

            <View style={{flex: 15 }}>
              <View style={{flexDirection: 'row', }}>
                <Text style={[styles.title, {fontSize: 14* fontScale, fontWeight: 'bold'}]}>{meeting.name}</Text>
              </View>
              <Text style={[styles.title,]}>{meeting.weekday + " " + meeting.start_time}</Text>
              <Text style={styles.title}>{meeting.street}</Text>
              <Text style={styles.title}>{meeting.city}, {meeting.state} {meeting.zip}</Text>
              <Text style={styles.title}>{(meeting.dist.calculated/1609).toFixed(2)} miles</Text>
            </View>
            <View style={{flexDirection: 'column', flex: 1, justifyContent: 'center', }}>
              <FontAwesomeIcon icon={faGripLinesVertical} style={styles.icon} size={23 * fontScale}/>
            </View>
        </View>
    )
}
const MeetingStack = createStackNavigator();
export default function MeetingSearchScreenStack(){
  return (
    <MeetingStack.Navigator >
      <MeetingStack.Screen 
        name="Meeting Search" 
        component={MeetingSearchScreen} 
        title="Meeting Search"
        options={({navigation, route})=>({

          headerStyle: {
            backgroundColor: '#1f6e21',
            
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontFamily: 'merriweather',
            fontSize:  18 * fontScale
          },


        })}
        />
     
      
    </MeetingStack.Navigator>
  )
}

function decorateMeetings(meetings, myMeetings){
  console.log(`decorating meetings  ${meetings} ${myMeetings}`)
  if(!meetings)
    return
  meetings.forEach((entry)=>{
    if(myMeetings.has(entry._id)){
      console.log(`found myMeeting match ${entry.name}`)
      entry.myCma = true
    }else{
      entry.myCma = false
    }
  })
}

function sortMeetings(meetings){
  meetings.sort((a, b) =>{

    let aDay = daysOfWeek[a.weekday]
    if (aDay < moment().weekday())
        aDay += 7;
    let
     bDay =  daysOfWeek[b.weekday]
    if(bDay  < moment().weekday())
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
function MeetingSearchScreen({navigation, ...props}) {

    const emptyView = <View></View>
    const [address, setAddress] = useState(null);
    const [meetingData, setMeetingData] = useState();
    const [distance, setDistance] = useState(5)
    const [message, setMessage] = useState(null)
    const [meetingComponents, setMeetingComponents] = useState (emptyView)
    
    useEffect(()=> {
      console.log(`use effect is called, myMeeting has changed`)
      decorateMeetings(meetingData, props.general.meetingMap)
      if(meetingData)
        setMeetingData([...meetingData]);
    }, [props.general.meetingMap])
  
    async function getMeetings(){

        let lat ="";
        let long = ""
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
        
        if(!address){
           const location = await Location.getCurrentPositionAsync({});
           lat = location.coords.latitude;
           long = location.coords.longitude
        }else{
            try{
                const location = await Location.geocodeAsync(address)
                console.log(`found address for ${address} ${JSON.stringify(location)}`)
                lat = location[0].latitude;
                long = location[0].longitude;
            }catch(err){
                alert("Could not find address");
                return;
            }
        }

        const query = `https://api.bit-word.com/api/cma/meeting?long=${lat}&lat=${long}&distance=${distance* 1609}`;

        console.log(`runnign query ${query}`)

        let response = ""
        try{
          response = await axios.get(query)
        }catch{
            setMessage("Network problmes. Try again");
            return;
        }

        if(response.data.error){
          console.log(`problem getting data ${response.data.error}`)
          setMessage("System problem finding meetings. Try again later")
        }else{

        
          setMessage(`${response.data.length} meetings found`);
          decorateMeetings(response.data, props.general.meetingMap)
          setMeetingData(sortMeetings(response.data))
        }
        
        

    }

  
console.log(`props are : ${JSON.stringify(props.general.authenticated)}`)
  return (

    <View style={styles.container}>
      <View style={{backgroundColor: '#fff',paddingHorizontal: 10* fontScale,}}>
        <View style={{flexDirection: 'row',  paddingVertical: 15* fontScale}}>
            <Text style={{fontSize: 19 * fontScale, fontWeight: 'bold'}}>Address: </Text>
            <TextInput 
            placeholder="[Current Location]" 
            style={[styles.textField, {fontSize: 19 * fontScale}]}
            onChangeText={(location)=>{(setAddress(location))}}/>
        </View>
        <View style={{flexDirection: 'row', paddingVertical: 15* fontScale}}>
            <Text style={{fontSize: 19 * fontScale, fontWeight: 'bold'}}>Distance: </Text>
            <TextInput 
            placeholder="[Default 5 miles]" 
            style={[styles.textField, {fontSize: 19 * fontScale}]}
            onChangeText={(myDistance)=>{(setDistance(myDistance))}}/>

        </View>
        <View style={{  }}>
          <TouchableOpacity style={styles.button} onPress={getMeetings}>
                <Text style={styles.buttonText}>Find</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.message}>{message}</Text>
      </View>
      

      <SwipeListView
            data={meetingData}
            renderItem={ MeetingComponent}
            keyExtractor={(data)=>{return data._id}}
            renderHiddenItem={ (data, rowMap) => BackRowComponent(data, rowMap, props)}
            closeOnRowPress={true}
            rightOpenValue={-75 * fontScale}
            leftOpenValue={0}
            disableRightSwipe={true}
            disableLeftSwipe={!props.general.authenticated}
        />

        
    </View>

 
  );

  }
  

  MeetingSearchScreen = connect(
    function mapStateToProps(state, ownProps){
        return state;
      }, 
    function mapDispatchToProps(dispatch){
      return {
        dispatchAddMeeting: (data) => {
          console.log("dispatching test function with input " + data)
          dispatch({type: "ADD_MEETING", data})
        },
        dispatchRemoveMeeting: (data) => {
          console.log("dispatching test function with input " + data)
          dispatch({type: "REMOVE_MEETING", data})
        }
      }
    }
)(MeetingSearchScreen)


  const styles = StyleSheet.create({
    trackTitleGroup:{
      flex: 1, 
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    icon:{
      color: 'gray'
    },
    rowBack: {
      backgroundColor: '#0273b1',
      height: '100%',
      justifyContent: 'flex-end',
      alignItems: 'center',
      flexDirection: 'row'
    },
    rowBackRemove: {
      backgroundColor: '#d15457',
    },
    rowBackText: {
      fontSize: 17 * fontScale,
      color: '#FFF',
      textAlign: 'center',

      width: 75 * fontScale
    },
    title:{
      flex: 6,
      flexWrap: 'wrap'
    },
    duration:{
      textAlign: 'center'
    },
    trackDescription:{
  
    },
    message: {
      fontSize: 14 * fontScale,
      paddingTop: 10 * fontScale,
    },
    buttonText: {
      fontSize: 20 * fontScale, 
      color: 'white',     
    },
    modalButton: {
      borderBottomLeftRadius: 5 * fontScale,
      borderBottomRightRadius: 5 * fontScale,
    },
    button: {
      backgroundColor: '#1f6e21',
      paddingVertical: 5* fontScale,
      textAlign: 'center',
      justifyContent: 'center',
      flexDirection: 'row'
    },
    trackCreated:{
      flex: 2.1
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
    logo: {
      flex: 1, 
      height: '55%', 
      width: '55%',
      marginLeft: -10,
      marginRight: -10,
      borderWidth: 1,
    },
    headerText: {
      width: '40%',
      borderWidth: 1
    },
    contentContainer: {
      paddingTop: 15,
    },
    optionIconContainer: {
      marginRight: 12,
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
  