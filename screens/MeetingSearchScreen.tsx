import React, { useState, useEffect, useCallback, memo } from 'react';
import {
  Image, Platform, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback,
  TextInput, View, Button, Dimensions, Keyboard, Linking, FlatList, Animated, Easing, Switch
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import { connect } from 'react-redux';

import { createStackNavigator,  } from '@react-navigation/stack';
import AppBanner from '../components/AppBanner'
import * as Location from 'expo-location';
import axios from 'axios';
import moment from 'moment'
import MeetingListRow from '../components/MeetingListRow'
import {DetailsScreen, DetailsBackButton, DetailTransition} from './MeetingDetailsScreen'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faFilter, faStop} from '@fortawesome/free-solid-svg-icons';
import { ToggleButton } from 'react-native-paper';
import { ForceTouchGestureHandler } from 'react-native-gesture-handler';
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
    //console.log(`item is :  index is: ${index} rowMap is ${rowMap} `)
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
  const [filteredMeetingData, setFilteredMeetingData] = useState();
  const [meetingTypes, setMeetingTypes] = useState([]);
  const [distance, setDistance] = useState(5)
  const [message, setMessage] = useState(null)
  const [meetingComponents, setMeetingComponents] = useState(emptyView)
  const [expanded, setExpanded] = useState(false)


  useEffect(() => {
    console.log(`observing the message changed in gratitude screen`)
    

  }, [])

  useEffect(() => {
    console.log(`meetingData changed`)


  }, [filteredMeetingData])

  function filterMeetings(filters){
    console.log(`filtering meetingData with ${filters}`)
    const filtered = [];

    meetingData.forEach(entry=>{
      const dayOfWeek = moment().day(entry.weekday).day();
      let step1 = false;
      let step2 = false;
      if(filters.daysOfWeek.size == 0 || filters.daysOfWeek.has(dayOfWeek)){
        step1 = true
      }
      if(filters.types.size == 0 ){
        step2 = true;
      }else if(entry.type){
        entry.type.forEach(type=>filters.types.has(type) && (step2=true))
      }

      if(step1 && step2){
        console.log(`filter passed, here is the meeting ${JSON.stringify(entry)}`)
        filtered.push(entry)
      }
    })

    setFilteredMeetingData(filtered)
  }

  async function getMeetings() {

    Keyboard.dismiss();

    let lat = 0;
    let long = 0
    setMessage("Working ...")
    setMeetingData(null)
    setFilteredMeetingData(null)
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
        console.log(`problem looking for address ${JSON.stringify(err)}`)
        props.dispatchSetBanner("Could not find address")
        return;
      }
    }

    const query = `https://api.bit-word.com/api/cma/meeting?long=${lat}&lat=${long}&distance=${distance * 1609}`;

    console.log(`runnign query ${query}`)

    let response = undefined
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
      let types = []
      response.data.forEach(entry=> { entry.type && (types = types.concat(entry.type))})
      let typeSet = new Set(types);
      console.log(`meeting types generated is ${JSON.stringify(types)} ${JSON.stringify(typeSet.size)}`)
      setMeetingTypes([...typeSet]);
      const sorted = sortMeetings(response.data)
      setMeetingData(sorted)
      setFilteredMeetingData(sorted)
    }

  }

  let finalMessage = message;
  if(filteredMeetingData ){
    console.log("filter message ther eis filtered data and the length is " + filteredMeetingData.length)
    if(meetingData.length != filteredMeetingData.length)
      finalMessage = `${filteredMeetingData.length} meetings of ${meetingData.length} (filtered)`
  }
  return (

    <View style={styles.container}>
      <AppBanner />
      <View style={{ backgroundColor: '#fff', paddingHorizontal: 10 * fontScale, position: 'relative', zIndex: 50}}>
        <View style={{ backgroundColor: '#fff', paddingTop: 10 * fontScale }}>

          <TextInput
            placeholder="[Current Location]"
            autoCapitalize="none"
            style={[styles.textField]}
            onChangeText={(location) => { (setAddress(location)) }}
          />
          <Text style={{ fontSize: 10 * fontScale, color: 'red' }}>Address</Text>
        </View>
        <View style={{ backgroundColor: '#fff', paddingVertical: 10 * fontScale }}>

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
        <View style={{ overflow:'visible', display: message ? "flex" : "none", justifyContent: 'space-between', flexDirection: "row", borderBottomWidth: 1, marginHorizontal: -10 * fontScale, paddingLeft: 10* fontScale }}>
          <Text style={[styles.message,]}>{finalMessage}</Text>
          <MeetingFilter show={meetingData && meetingData.length > 0} callback={filterMeetings} types={meetingTypes} />
        </View>


      </View>


      <MeetingList meetingData={filteredMeetingData} 
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
      dispatchSetBanner: (message)=>{
        dispatch({type: "SET_BANNER", banner: message})
      }
    }
  }
)(MeetingSearchScreen)

function MeetingFilter({show, types, callback}){

  

  const defaultFilters = {daysOfWeek: new Map(), paid: [], types: new Map()}
  const [showDialog, setShowDialog] = useState(false)
  const [opacity, setOpacity] = useState(new Animated.Value(0))
  const [filters, setFilters] = useState(defaultFilters)

  console.log(`building MeetingFilter, filters is ${JSON.stringify(filters)}`)
  useEffect(()=>{
    console.log(`showDialog changed`)
    if (showDialog) {
        console.log(`showing`)
        Animated.timing(opacity, {
            toValue: 1,
            useNativeDriver: true,
            duration: 200,
            easing: Easing.in(Easing.quad),
        }).start();
    } else {
        console.log(`hiding`)
        Animated.timing(opacity, {
            toValue: 0,
            useNativeDriver: true,
            duration: 200,
            easing: Easing.in(Easing.quad),
        }).start();
    }
  }, [showDialog])


  const backgroundOpacity = opacity.interpolate({
    inputRange: [0, 1],
    outputRange: [0, .2]
  });

  const dayButtons = [];

  for(let i=0; i< 7; i++){
    const dayString = moment().day(i).format("dddd ");
    const isSelected = filters.daysOfWeek.has(i)
    dayButtons.push(

        <TouchableOpacity style={[styles.toggleButton, 
          isSelected && styles.toggleButtonSelected]}
          onPress={()=>{
            if(isSelected)
              filters.daysOfWeek.delete(i);
            else
              filters.daysOfWeek.set(i, true);

            setFilters({...filters})

          }}>
          <Text style={[styles.toggleText]}>{dayString}</Text>
        </TouchableOpacity>
    )
  }
  

  console.log(`types is ${JSON.stringify(types)}`);
  const typeComponents = []

  types.forEach((entry)=>{
    const isSelected = filters.types.has(entry)
    typeComponents.push(

      <TouchableOpacity style={[styles.toggleButton, 
        isSelected && styles.toggleButtonSelected]}
        onPress={()=>{
          if(isSelected)
            filters.types.delete(entry);
          else
            filters.types.set(entry, true);

          setFilters({...filters})
        }}>
        <Text style={[styles.toggleText]}>{entry}</Text>
      </TouchableOpacity>
    )
  })

  return(
    <View style={[styles.filter, {display: show?"flex":"none"}]}>
      <TouchableOpacity onPress={()=>setShowDialog(true)}>
        <FontAwesomeIcon icon={faFilter} style={styles.icon} size={18}/>
      </TouchableOpacity>
      <TouchableWithoutFeedback onPress={()=>setShowDialog(false)}>
        <Animated.View style={[styles.filterBackground, {opacity: backgroundOpacity, display: showDialog?"flex":"none"}]} >
        </Animated.View>
      </TouchableWithoutFeedback>
      <Animated.View style={[styles.filterDialog, {opacity: opacity, display: showDialog?"flex":"none"}]}>
        <View style={{flexDirection: 'column', justifyContent: 'flex-start'}}>
          <Text style={styles.textField}>Select days to view</Text>
          <View style={styles.dayButtonContainer}>{dayButtons}</View>

          <Text style={styles.textField}>Select meeting types</Text>
          <View style={styles.dayButtonContainer}>{typeComponents}</View>
        </View>
        <View style={[styles.dayButtonContainer, ]}>
          <View style={{flexBasis: '31%'}}/>
          <TouchableOpacity style={[styles.toggleButton,{backgroundColor: '#f36468'}]}
            onPress={()=>{
              
              callback({...defaultFilters})
              setShowDialog(false)
              setFilters(defaultFilters)
            }}>
            <Text style={[styles.toggleText]}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.toggleButton ,{backgroundColor: '#1f6e21'}]}
            onPress={()=>{

              callback({...filters})
              setShowDialog(false)
              setFilters(defaultFilters)
            }}>
            <Text style={[styles.toggleText]}>Filter</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  )
}
const styles = StyleSheet.create({

  icon: {
    color: '#1f6e21',
    
  },
  dayButtonContainer: {
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between'
  },
  toggleText: {
    fontSize: 13 * fontScale,

    textAlign: 'center',
    color: 'white'
  },
  toggleButton:{
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 7 * fontScale,
    flexBasis: '31%',
    flexGrow: 0,
    paddingVertical: 5 * fontScale,
    width: 20 * fontScale,
    backgroundColor: '#0273b1', 
    shadowOffset: {width: 3, height: 3},
    marginBottom: 5* fontScale,
  },
  toggleButtonSelected:{
    backgroundColor: '#5fbfec', 
  },
  filterBackground: {
    position: 'absolute',
    zIndex: 5,
    height: SCREEN_HEIGHT + 200,
    width: SCREEN_WIDTH + 200,
    backgroundColor: 'black',
    left: -SCREEN_WIDTH, 
    top: -SCREEN_HEIGHT/2,
  },
  filterDialog: {
    position: 'absolute',
    zIndex: 10,
    height: 300 * fontScale,
    width: SCREEN_WIDTH - (40 * fontScale),
    backgroundColor: 'white',
    top: 35,
    right: 20 * fontScale,
    borderRadius: 10,
    padding: 10 * fontScale,
    flexDirection: 'column',
    justifyContent: 'space-between'


  },
  filter: {
    position: 'relative',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    paddingBottom: 5 * fontScale,
    paddingRight: 20 * fontScale,
    overflow: "visible"
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
    marginBottom: 5 * fontScale,
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
