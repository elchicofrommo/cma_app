import React, { useState, useEffect, useCallback, memo } from 'react';
import {
  Image, Platform, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback,
  TextInput, View, Button, Dimensions, Keyboard, Linking, FlatList, Animated, Easing, Switch
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { connect } from 'react-redux';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { createStackNavigator, } from '@react-navigation/stack';
import AppBanner from '../components/AppBanner'
import * as Location from 'expo-location';
import axios from 'axios';
import moment from 'moment'
import MeetingListRow from '../components/MeetingListRow'
import { DetailsScreen} from './MeetingDetailsScreen'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faFilter, faWindowClose, faStop } from '@fortawesome/free-solid-svg-icons';
import { ToggleButton } from 'react-native-paper';
import { ForceTouchGestureHandler } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import SoberietyTime from '../components/SoberietyTime';
import symbolicateStackTrace from 'react-native/Libraries/Core/Devtools/symbolicateStackTrace';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import {Meeting} from '../types/gratitude'
import log from "../util/Logging"
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
export { MeetingList, sortMeetings }
/*function MeetingSearchScreenStack() {
  log.info(`rendering meetingstack`)
  return (
    <MeetingStack.Navigator >
      <MeetingStack.Screen
        name="meetings"
        component={MeetingSearchScreen}

        options={({ navigation, route }) => ({

          headerStyle: {
            backgroundColor: Colors.primary,

          },
          headerLeft: () => {
            return <Text style={{ color: 'white', fontFamily: 'opensans', fontSize: 21 * Layout.scale.width, paddingLeft: 10 * Layout.scale.width }}>Meetings</Text>
          },
          title: "",
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontFamily: 'merriweather',
            fontSize: 18 * Layout.scale.width
          },



        })}
      />
      <MeetingStack.Screen
        name="location"
        component={LocationScreen}
        options={({ navigation, route }) => ({

          headerStyle: {
            backgroundColor: '#FFF',
            shadowColor: 'transparent'
          },
          title: 'Location Search',
          headerTintColor: Colors.primary,
          headerTitleStyle: {
            fontWeight: 'bold',
            fontFamily: 'merriweather',
            fontSize: 18 * Layout.scale.width,
            borderBottomWidth: 0,


          },

        })}

      />
      

    </MeetingStack.Navigator>
  )
}
*/
function LocationScreen({ navigation, ...props }) {
  const [location, setLocation] = useState()
  return (
    <View style={{ flex: 1 }}>

      <GooglePlacesAutocomplete
        query={{
          key: 'AIzaSyD-iHMOooeowqHXKtULGymcD-mtnuHFv6o',
          language: 'en', // language of the results
        }}
        onPress={(data, details = null) => log.info(data)}
        onFail={error => console.error(error)}
        styles={{
          textInputContainer: {
            backgroundColor: 'rgba(0,0,0,0)',
            borderTopWidth: 0,
            borderBottomWidth: 0,
          },
          textInput: {
            marginLeft: 0,
            marginRight: 0,
            height: 38,
            color: '#5d5d5d',
            fontSize: 16,
          },
          predefinedPlacesDescription: {
            color: '#1faadb',
          },
        }}
      />

    </View>
  )
}

function sortMeetings(meetings: Meeting[])  {
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

    let aTime = moment(a.startTime, 'H:mm A');
    let bTime = moment(b.startTime, 'H:mm A');

    return aTime.valueOf() - bTime.valueOf();
  })
  return meetings;
}


function MeetingList({ meetingData, action, style = {}, emptyMessage } :{ meetingData: Meeting[], action:any, style: any, emptyMessage?: string}) {

  const keyExtractorCallback = useCallback((data) => { return data.id })

  const renderCallback = useCallback(({ item, index }, rowMap) => {
    //renderBackRow({data, rowMaps, props}),[])
    //log.info(`item is :  index is: ${index} rowMap is ${rowMap} `)
    return <MeetingListRow meeting={item}
      saved={true}
      action={action} />
  }, [])

  return (
    <FlatList
      data={meetingData}
      renderItem={renderCallback}
      keyExtractor={keyExtractorCallback}
      initialNumToRender={5}
      contentContainerStyle={style}
      ListEmptyComponent={<View style={[styles.container, {paddingHorizontal: 10 * Layout.scale.width}]}>
        <Text style={styles.textField}>{emptyMessage}</Text>
      </View>}

    />
  )
}
export default function MeetingSearchScreen({ navigation, ...props }) {

  log.info(`rendering MeetingSearchScreen`)
  const emptyView = <View></View>
  const [address, setAddress] = useState(null);
  const [meetingData, setMeetingData] = useState <Meeting[]>([]);
  const [filteredMeetingData, setFilteredMeetingData] = useState<Meeting[]>();
  const [meetingTypes, setMeetingTypes] = useState<string[]>([]);
  const [distance, setDistance] = useState(5)
  const [message, setMessage] = useState(null)
  const [meetingComponents, setMeetingComponents] = useState(emptyView)
  const [expanded, setExpanded] = useState(false)
  const [offset, setOffset] = useState(new Animated.Value(Layout.window.width *.008))
  const [isVirtual, setIsVirtual] = useState(false);



  useEffect(() => {

    if (address && address != "")
      Location.geocodeAsync(address).then((resolve) => {
        log.info(`found address for ${JSON.stringify(resolve)} `)
        resolve.data.forEach((entry) => log.info(`Address match` , {entry}))
      }).catch((err) => {
        log.info(`caught an error with getting new geocode for this address. ${err}`)
      })


  }, [address])

  useEffect(() => {
    log.info("use effect observed distance changed")
    getMeetings();


  }, [distance])



  async function filterMeetingsCallback(filters) {
    log.info(`filterMeetingCallback  with ${JSON.stringify(filters)} `)


    if (distance != filters.distance) {

      log.info(`distance changed, setting ${distance} to ${filters.distance} filtered size is ${filteredMeetingData.length} and meetingData length is ${meetingData.length}`)
      setDistance(filters.distance)
      //  getMeetings({filters: filters});

    }
    else {
      filterMeetings(filters);
    }
  }

  function filterMeetings(filters)  {
    const filtered: Meeting[] = [];
    log.info(`filtering meetings, meetingData length is ${meetingData.length}`)
    meetingData.forEach(entry => {
      const dayOfWeek = moment().day(entry.weekday).day();
      let step1 = false;
      let step2 = false;
      if (filters.daysOfWeek.size == 0 || filters.daysOfWeek.has(dayOfWeek)) {
        step1 = true
      }
      if (filters.types.size == 0) {
        step2 = true;
      } else if (entry.type) {
        entry.type.forEach(type => filters.types.has(type) && (step2 = true))
      }

      if (step1 && step2) {

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
    setMeetingData([])
    setFilteredMeetingData(null)
    setMeetingComponents(emptyView)

    let { status } = await Location.requestPermissionsAsync();
    if (status !== 'granted') {
      setMessage("You must enable location in Settings to use current location. \
      Otherwise you may enter an address");
      return;
    }
    log.info("have location permission ");
    try {
      if (!address) {
        const location = await Location.getCurrentPositionAsync({});
        lat = location.coords.latitude;
        long = location.coords.longitude
      } else {
        try {
          const location = await Location.geocodeAsync(address)
          log.info(`found address for ${address}` , {location})
          lat = location[0].latitude;
          long = location[0].longitude;
        } catch (err) {
          log.info(`problem looking for address` , {err})
          props.dispatchSetBanner({ message: "Could not find address" })
          return;
        }
      }

      const query = `https://api.bit-word.com/api/cma/meeting?long=${lat}&lat=${long}&distance=${distance * 1609}`;

      log.info(`runnign query ${query}`)

      let response = undefined
      try {
        response = await axios.get(query)
      } catch{
        setMessage("Network problmes. Try again");
        return;
      }

      if (response.data.error) {
        log.info(`problem getting data ${response.data.error}`)
        setMessage("System problem finding meetings. Try again later")
      } else {


        setMessage(`${response.data.length} meetings found`);
        let types: string[] = []
        const meetings: Meeting[] = response.data.map(rawMeeting=>{

          const meeting: Meeting = {
            id: rawMeeting._id,
            name: rawMeeting.name,
            active: rawMeeting.active!=0,
            category: rawMeeting.category,
            location: {lat: rawMeeting.location.coordinates[1], long: rawMeeting.location.coordinates[0]},
            startTime: rawMeeting.start_time,
            weekday: rawMeeting.weekday,
            type: rawMeeting.type,
            street: rawMeeting.street,
            city: rawMeeting.city,
            state: rawMeeting.state,
            paid: rawMeeting.paid,
            distance: rawMeeting.dist.calculated,
            zip: rawMeeting.zip
          }
          meeting.type && (types = types.concat(meeting.type))
          return meeting

        })


        let typeSet = new Set<string>(types);
        log.info(`meeting types generated is ${JSON.stringify(types)} ${JSON.stringify(typeSet.size)}`)
        setMeetingTypes([...typeSet]);
        const sorted = sortMeetings(meetings)
        setMeetingData(sorted)
        log.info(`done getting meeting and sorting, meetingData length is ${sorted.length}`)

        log.info(`observed there are no filters to apply to meeting search `)
        setFilteredMeetingData(sorted)


      }
    } catch (bigerr) {
      log.info(`problem getting meeting data as follows `, {bigerr})
    }

  }

  function searchTraditional(){
    setIsVirtual(false)
    Animated.timing(offset, {
      toValue: (Layout.window.width *.008),
      useNativeDriver: true,
      duration: 200,
      easing: Easing.inOut(Easing.ease)
    }).start();
  }

  function searchVirtual(){
    setIsVirtual(true)
    Animated.timing(offset, {
      toValue: Layout.window.width * .47,
      useNativeDriver: true,
      duration: 200,
      easing: Easing.inOut(Easing.ease)
    }).start();
  }

  let finalMessage = message;
  if (filteredMeetingData) {

    if (meetingData.length != filteredMeetingData.length)
      finalMessage = `${filteredMeetingData.length} meetings of ${meetingData.length} (filtered)`
  }
  const transform = {
    transform: [{ translateX: offset }]
  }
  const shadow = Platform.OS === 'ios' ? {
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: .3,
  } : { elevation: 3 }


  // component for meeting search
  // <TouchableOpacity onPress={()=>navigation.navigate('location')} ><Text>location search</Text></TouchableOpacity>
  return (

    <View style={styles.container}>

      <View style={{ backgroundColor: '#fff', paddingHorizontal: 10 * Layout.scale.width, }}>
        <View style={{ backgroundColor: '#fff', paddingTop: 10 * Layout.scale.width }}>
          <View style={{position: 'relative', zIndex: 1,  flexDirection: 'row', paddingVertical: 0, height: 34, justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#d1d7dd',  borderRadius: 17, }}>
          <Animated.View style={[{position: 'absolute', zIndex: 3, height: 29, width: '49%', backgroundColor: 'white', top: 2.5, left: 0, borderRadius: 16 ,...shadow,...transform } ]}></Animated.View>
            
            <TouchableWithoutFeedback onPress={searchTraditional} ><Text style={[{position: 'relative', zIndex: 5, elevation: 4, flex: 1, textAlign: 'center', color: (isVirtual?'black':Colors.primary), }, styles.textField]}>Traditional</Text></TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={searchVirtual} ><Text style={[{position: 'relative', zIndex: 5, elevation: 4, flex: 1, textAlign: 'center', color: (isVirtual?Colors.primary:'black'), }, styles.textField]}>Virtual</Text></TouchableWithoutFeedback>

          </View>


        </View>
        <View style={{ backgroundColor: '#fff', paddingVertical: 10 * Layout.scale.width }}>
          <View style={{ flexDirection: 'row', paddingVertical: 0, height: 34, justifyContent: 'space-between', borderColor: Colors.primary, borderWidth: 2, borderRadius: 17, }}>
            <TextInput
              placeholder="Current Location"
              autoCapitalize="none"
              style={[styles.textField, { textAlign: 'center', flex: 10, marginRight: -34, }]}
              onChangeText={(location) => { (setAddress(location)) }}
              onSubmitEditing={getMeetings}
            />
            <TouchableOpacity onPress={getMeetings}
              style={{ width: 34, height: 30, justifyContent: 'center', alignItems: 'center' }} >
              <Ionicons name="md-search" color={Colors.primary} size={24} />
            </TouchableOpacity>
          </View>


        </View>


        <MeetingFilter show={meetingData && meetingData.length > 0} callback={filterMeetingsCallback} types={meetingTypes} message={finalMessage} distance={distance} />



      </View>


      <MeetingList meetingData={filteredMeetingData}
        action={(row) => {
          // props.dispatchHideMenu(); 
          navigation.navigate('Details', row)
        }} />

    </View>


  );

}


MeetingSearchScreen = connect(
  function mapStateToProps(state) {

    const { operatingUser, meetings } = state.general;
    return {
      authenticated: operatingUser.role!="guest", meetings
    };
  },
  function mapDispatchToProps(dispatch) {
    return {

      dispatchSetDetail: (data) => {
        log.info(`set detail data is `)
        dispatch({ type: "SET_DETAIL", meetingDetail: data })
      },

      dispatchShowMenu: (data) => {
        log.info("dispatching show menu ")
        dispatch({ type: "SHOW_MENU" })
      },
      dispatchHideMenu: (data) => {
        log.info("dispatching hide menu ")
        dispatch({ type: "HIDE_MENU" })
      },
      dispatchSetBanner: (message) => {
        dispatch({ type: "SET_BANNER", banner: message })
      }
    }
  }
)(MeetingSearchScreen)

function MeetingFilter({ show, types, callback, message, distance }) {



  const defaultFilters = { daysOfWeek: new Map(), paid: [], types: new Map(), distance: distance }
  const [visible, setVisible] = useState(false)
  const [opacity, setOpacity] = useState(new Animated.Value(0))
  const [filters, setFilters] = useState(defaultFilters)

  log.info(`building MeetingFilter, filters is ${JSON.stringify(filters)} distance ${distance}`)

  useEffect(() => {
    log.info(`observed distance changed, setting new distance `)
    const newFilter = { ...filters }
    newFilter.distance = distance;
    setFilters(newFilter);
  }, [distance])


  const showDialog = () => {
    log.info(`showing`)
    setVisible(true)
    Animated.timing(opacity, {
      toValue: 1,
      useNativeDriver: true,
      duration: 200,
      easing: Easing.in(Easing.quad),
    }).start();
  }

  const hideDialog = () => {
    log.info(`hiding`)
    Animated.timing(opacity, {
      toValue: 0,
      useNativeDriver: true,
      duration: 200,
      easing: Easing.in(Easing.quad),
    }).start(() => {
      setVisible(false)
      const newFilters = { ...defaultFilters }
      newFilters.distance = filters.distance
      setFilters(newFilters)
    });
  }

  const backgroundOpacity = opacity.interpolate({
    inputRange: [0, 1],
    outputRange: [0, .2]
  });

  const dayButtons = [];

  for (let i = 0; i < 7; i++) {
    const dayString = moment().day(i).format("dddd ");
    const isSelected = filters.daysOfWeek.has(i)
    dayButtons.push(

      <TouchableOpacity style={[styles.toggleButton,
      isSelected && styles.toggleButtonSelected]}
        onPress={() => {
          if (isSelected)
            filters.daysOfWeek.delete(i);
          else
            filters.daysOfWeek.set(i, true);

          setFilters({ ...filters })

        }}>
        <Text style={[styles.toggleText]}>{dayString}</Text>
      </TouchableOpacity>
    )
  }


  log.info(`types is` , {types});
  const typeComponents = []

  types.forEach((entry) => {
    const isSelected = filters.types.has(entry)
    typeComponents.push(

      <TouchableOpacity style={[styles.toggleButton,
      isSelected && styles.toggleButtonSelected]}
        onPress={() => {
          if (isSelected)
            filters.types.delete(entry);
          else
            filters.types.set(entry, true);

          setFilters({ ...filters })
        }}>
        <Text style={[styles.toggleText]}>{entry}</Text>
      </TouchableOpacity>
    )
  })

  function reset() {
    callback({ ...defaultFilters })
    hideDialog();
  }

  let dialog = visible ?
    <View >

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
        <Text style={[styles.message,]}>{message}</Text>
        <View style={[styles.filter, { display: show ? "flex" : "none" }]}>
          <TouchableOpacity onPress={hideDialog}
            style={{ width: 34, height: 34, backgroundColor: '#FFF', borderColor: Colors.primary, borderWidth: 2, borderRadius: 17, justifyContent: 'center', alignItems: 'center' }} >
            <FontAwesomeIcon icon={faFilter} style={styles.icon} size={17} />
          </TouchableOpacity>

        </View>
      </View>
      <Modal isVisible={visible}
        onBackdropPress={reset}
        onSwipeComplete={reset}
        onBackButtonPress={reset}
        swipeDirection={['up', 'down', 'left', 'right']}>
        <Animated.View style={[styles.filterDialog, { opacity: opacity, display: visible ? "flex" : "none" }]}>


          <View style={{ flexDirection: 'column', justifyContent: 'flex-start' }}>
            <Text style={styles.textField}>Distance</Text>
            <View style={styles.dayButtonContainer}>
              <TouchableOpacity style={[styles.toggleButton,
              filters.distance == 5 && styles.toggleButtonSelected]}
                onPress={() => {
                  filters.distance = 5

                  setFilters({ ...filters })
                }}>
                <Text style={[styles.toggleText]}>5</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.toggleButton,
              filters.distance == 15 && styles.toggleButtonSelected]}
                onPress={() => {
                  filters.distance = 15

                  setFilters({ ...filters })
                }}>
                <Text style={[styles.toggleText]}>15</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.toggleButton,
              filters.distance == 30 && styles.toggleButtonSelected]}
                onPress={() => {
                  filters.distance = 30

                  setFilters({ ...filters })
                }}>
                <Text style={[styles.toggleText]}>30</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.textField}>Select days to view</Text>
            <View style={styles.dayButtonContainer}>{dayButtons}</View>

            <Text style={styles.textField}>Select meeting types</Text>
            <View style={styles.dayButtonContainer}>{typeComponents}</View>
          </View>
          <View style={[styles.dayButtonContainer,]}>
            <View style={{ flexBasis: '31%' }} />
            <TouchableOpacity style={[styles.toggleButton, { backgroundColor: '#f36468' }]}
              onPress={reset}>
              <Text style={[styles.toggleText]}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.toggleButton, { backgroundColor: Colors.primary }]}
              onPress={() => {



                callback({ ...filters })
                hideDialog();
              }}>
              <Text style={[styles.toggleText]}>Filter</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Modal>
    </View>
    :
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: show ? 1 : 0, paddingBottom: 5 * Layout.scale.width }}>
      <Text style={[styles.message,]}>{message}</Text>
      <View style={[styles.filter, { display: show ? "flex" : "none" }]}>
        <TouchableOpacity onPress={showDialog}
          style={{ width: 34, height: 34, backgroundColor: '#FFF', borderColor: Colors.primary, borderWidth: 2, borderRadius: 17, justifyContent: 'center', alignItems: 'center' }} >
          <FontAwesomeIcon icon={faFilter} style={styles.icon} size={17} />
        </TouchableOpacity>
      </View>
    </View>

  return (
    dialog
  )
}
const styles = StyleSheet.create({

  icon: {
    color: Colors.primary,

  },
  dayButtonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  toggleText: {
    fontSize: 13 * Layout.scale.width,

    textAlign: 'center',
    color: 'white'
  },
  toggleButton: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 7 * Layout.scale.width,
    flexBasis: '31%',
    flexGrow: 0,
    paddingVertical: 5 * Layout.scale.width,
    width: 20 * Layout.scale.width,
    backgroundColor: '#0273b1',
    shadowOffset: { width: 3, height: 3 },
    marginBottom: 5 * Layout.scale.width,
  },
  toggleButtonSelected: {
    backgroundColor: '#5fbfec',
  },
  filterBackground: {

    height: Layout.window.height + 200,
    width: Layout.window.width+ 200,
    backgroundColor: 'black',
    left: -Layout.window.width,
    top: -Layout.window.height / 2,
  },
  filterDialog: {

    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10 * Layout.scale.width,
    flexDirection: 'column',
    justifyContent: 'space-between'


  },
  filter: {
    position: 'relative',
    flexDirection: 'column',
    justifyContent: 'flex-end',

  },

  title: {
    flex: 6,
    flexWrap: 'wrap'
  },

  message: {
    fontSize: 14 * Layout.scale.width,
    paddingTop: 10 * Layout.scale.width,
  },
  buttonText: {
    fontSize: 20 * Layout.scale.width,
    color: 'white',
  },

  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 5 * Layout.scale.width,
    marginBottom: 5 * Layout.scale.width,
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
    fontSize: 17 * Layout.scale.width,
    fontFamily: 'opensans'
  },
});
