import React, { useState, useEffect, useCallback, memo, Fragment } from 'react';
import HeaderComponent from "../components/HeaderComponent"
import { LinearGradient } from "expo-linear-gradient"
import { useSafeArea } from 'react-native-safe-area-context';
import {
  Image, Platform, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback,
  TextInput, View, Button, Dimensions, Keyboard, Linking, FlatList, Animated, Easing, Switch
} from 'react-native';

import { connect } from 'react-redux';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { createStackNavigator, HeaderBackButton, } from '@react-navigation/stack';

import * as Location from 'expo-location';
import axios from 'axios';
import moment from 'moment'
import MeetingListRow from '../components/MeetingListRow'

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faFilter, } from '@fortawesome/free-solid-svg-icons';


import { Ionicons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import SliderToggle, { Toggle } from '../components/SliderToggle'
import { useColors } from '../hooks/useColors';
import { useLayout } from '../hooks/useLayout';
import { Meeting } from '../types/circles.'
import log from "../util/Logging"
import apiGateway from '../api/apiGateway';
import { isLoading } from 'expo-font';

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

export default function MeetingSearchScreenStack() {
  const { colors: Colors } = useColors();
  const layout = useLayout();
  const styles = useStyles()
  log.info(`rendering meetingstack`)
  return (
    <MeetingStack.Navigator >
      <MeetingStack.Screen
        name="meetingSearch"
        component={MeetingSearchScreen}

        options={({ navigation, route }) => ({

          
          headerTransparent: true,
          header: ({ scene, previous, navigation }) => {
            return (
              <HeaderComponent scene={scene} previous={previous} navigation={navigation}
                title={"Meetings"}  />)
          }

        })}

      />



    </MeetingStack.Navigator>
  )
}
export { MeetingList, sortMeetings }

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

function sortMeetings(meetings: Meeting[]) {
  meetings.sort((a, b) => {

    let aDay = daysOfWeek[a.weekday]
    const today = moment().weekday()
    if (aDay < today)
      aDay += 7;
    let
      bDay = daysOfWeek[b.weekday]
    if (bDay < today)
      bDay += 7


    if (aDay != today && bDay != today)
      return aDay - bDay

    let now = moment(moment().format("H:mm A"), "H:mm A").valueOf();
    let aTime = moment(a.startTime, 'H:mm A').valueOf();

    if (now > aTime && aDay == today) {
      aDay += 7;
      aTime += 86400000
    }
    let bTime = moment(b.startTime, 'H:mm A').valueOf();

    if (now > bTime && bDay == today) {
      bDay += 7
      bTime += 86400000
    }

    if (aDay != bDay)
      return aDay - bDay;

    //log.info(`now: ${now} aTime: ${aTime} bTime: ${bTime} aDay is today ${aDay == today} bDay is today ${bDay== today}`)
    return aTime.valueOf() - bTime.valueOf();
  })
  return meetings;
  1595696400000
  1595700420000
}


function MeetingList({ meetingData, action, loading = false, style = {}, emptyComponent, limit }: { meetingData: Meeting[], action: any, loading: boolean, style: any, emptyComponent?: any, limit?: number; }) {

  const keyExtractorCallback = useCallback((data) => { return data.id })
  const Layout = useLayout();
  const ITEM_HEIGHT = 65 * Layout.scale.height + StyleSheet.hairlineWidth 
  const styles = useStyles()
  const renderCallback = useCallback(({ item, ...props }: { item: Meeting }) => {
    //renderBackRow({data, rowMaps, props}),[])
    //log.info(`item is :  index is: ${index} rowMap is ${rowMap} `)

    return <MeetingListRow meeting={item} key={item.id}

      saved={true}
      action={action} />
  }, [])

  const loadingComponent = <View style={styles.loadingRow}>
    <View style={styles.loadingBoxOne}>

    </View>
    <View style={styles.loadingBoxTwo}>

    </View>
  </View>

  const seperatorComponent = <View style={styles.seperatorComponent}></View>

  if (!limit)
    return (
      <FlatList
        data={meetingData}
        alwaysBounceHorizontal={true}
        bounces={false}
        renderItem={renderCallback}
        keyExtractor={keyExtractorCallback}
        initialNumToRender={5}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={()=>seperatorComponent}
        style={[styles.meetingListContainer, ]}


        ListEmptyComponent={loading ? loadingComponent : emptyComponent ? emptyComponent : <View style={[{ height: ITEM_HEIGHT, flexDirection: "row", justifyContent: "flex-start", paddingLeft: 10, alignItems: "center", backgroundColor: 'white', borderRadius: 10  }]}>
          <Text style={styles.textField}>No meetings found.</Text>
        </View>}

      />
    )
  else {
    let toRender = []
    if(loading){
      return loadingComponent
    }
    for (let i = 0; i < limit && i < meetingData.length; i++) {
      toRender.push(renderCallback({ item: meetingData[i] }))
      toRender.push(<Fragment key={i}>{seperatorComponent}</Fragment>)
    }
    if (toRender.length > 0)
      toRender.pop()
    return (
      <View style={style}>
        {toRender}
      </View>
    )
  }
}
export  function MeetingSearchScreen({ navigation, ...props }) {
  const Layout = useLayout();

  log.info(`rendering MeetingSearchScreen`)
  const emptyView = <View></View>
  const [address, setAddress] = useState(null);
  const [meetingData, setMeetingData] = useState<Meeting[]>([]);
  const [filteredMeetingData, setFilteredMeetingData] = useState<Meeting[]>();
  const [meetingTypes, setMeetingTypes] = useState<string[]>([]);
  const [distance, setDistance] = useState(5)
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(false);
  const [meetingComponents, setMeetingComponents] = useState(emptyView)
  const [meetingListHeight, setMeetingListHeight] = useState(0)
  const [maxListHeight, setMaxListHeight] = useState(0);
  const [isVirtual, setIsVirtual] = useState(false);
  const { colors: Colors } = useColors();
  const styles = useStyles()


  React.useLayoutEffect(() => {
    log.info("maing a new save button");


    navigation.setOptions({

      headerLeft: () => (
        <HeaderBackButton
          label={"Back"}
          tintColor={Colors.primary1}
          onPress={(event) => {

            navigation.goBack();

          }}
        />
      ),
    });
  }, []);

  useEffect(() => {

    if (address && address != "")
      Location.geocodeAsync(address).then((resolve) => {
        log.info(`found address for ${JSON.stringify(resolve)} `)
        resolve.data.forEach((entry) => log.info(`Address match`, { entry }))
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

  function filterMeetings(filters) {
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
    setLoading(true)

    setMessage("Working ...")
    setMeetingData([])
    setFilteredMeetingData(null)
    setMeetingComponents(emptyView)

    const result = await searchForMeeting(address, distance)
    if (result.error) {
      setMessage(result.error)
      return;
    }

    log.info(`meeting types generated is ${JSON.stringify(result.types)} `)
    setMeetingTypes(result.types);
    setMeetingData(result.meetings)

    setMessage(`${result.meetings.length} meetings found`);
    log.info(`observed there are no filters to apply to meeting search `)
    setFilteredMeetingData(result.meetings)
    setLoading(false);

  }



  let finalMessage = message;
  if (filteredMeetingData) {

    if (meetingData.length != filteredMeetingData.length)
      finalMessage = `${filteredMeetingData.length} meetings of ${meetingData.length} (filtered)`
  }


  // component for meeting search
  // <TouchableOpacity onPress={()=>navigation.navigate('location')} ><Text>location search</Text></TouchableOpacity>
  const toggles: Toggle[] = [
    {
      callback: () => setIsVirtual(false),
      label: "Traditional"
    },
    {
      callback: () => setIsVirtual(true),
      label: "Virtual"
    }
  ]
  useEffect(()=>{
    const ITEM_HEIGHT = 65 * Layout.scale.height + StyleSheet.hairlineWidth 
    if(!filteredMeetingData || filteredMeetingData.length==0){
      setMeetingListHeight(ITEM_HEIGHT)
    }
    else if(filteredMeetingData?.length * ITEM_HEIGHT < maxListHeight)
      setMeetingListHeight(filteredMeetingData.length * ITEM_HEIGHT)
    else 
      setMeetingListHeight(maxListHeight)
  }, [maxListHeight, filteredMeetingData])

  
  return (
    <LinearGradient style={[styles.container,]}
      colors={[Colors.primary1, Colors.primary2]}
      start={[0, 0]}
      end={[1.5, 1.5]}
      locations={[0, .5]}
    >      
    
    <View style={[styles.sectionContainer, { marginTop: Layout.belowHeader, marginBottom: 10 * Layout.scale.height }]}>

        <SliderToggle containerWidth={Layout.window.width - 18 * Layout.scale.width}
          selectedIndex={isVirtual ? 1 : 0} toggles={toggles}
          ></SliderToggle>

        <View style={{  paddingTop: 10 * Layout.scale.height, paddingBottom: 5* Layout.scale.height}}>
          <View style={{ flexDirection: 'row', backgroundColor: Colors.primaryContrast, paddingVertical: 0, height: 34 * Layout.scale.height, justifyContent: 'space-between', alignItems: 'center', borderColor: Colors.primaryContrast, borderWidth: 2, borderRadius: 17 * Layout.scale.height, }}>
            <TextInput
              placeholder="Current Location"
              autoCapitalize="none"
              style={[styles.textField, { textAlign: 'center', flex: 10, marginRight: -34, }]}
              onChangeText={(location) => { (setAddress(location)) }}
              onSubmitEditing={getMeetings}
            />
            <TouchableOpacity onPress={getMeetings}
              style={{ width: 34 * Layout.scale.height, height: 30 * Layout.scale.height, justifyContent: 'center', alignItems: 'center' }} >
              <Ionicons name="md-search" color={Colors.primary1} size={24 * Layout.scale.height} />
            </TouchableOpacity>
          </View>


        </View>

        <View style={{paddingBottom: 5 * Layout.scale.height}}>
        <MeetingFilter show={meetingData && meetingData.length > 0} callback={filterMeetingsCallback} 
        types={meetingTypes} message={finalMessage} distance={distance} />
        </View>
        <View />

        <View onLayout={(event)=>{
          
          const y = event.nativeEvent.layout.y;

          const calculatedHeight = Layout.window.height - y - (135 * Layout.scale.height) - Layout.safeBottom
          log.verbose(`layout data is `, {nativeEvent: event.nativeEvent})

          setMaxListHeight(calculatedHeight)
        }}  style={{borderRadius: 10, overflow: 'hidden', backgroundColor: Colors.primaryContrast, marginBottom: 10, height: meetingListHeight}}>
        <MeetingList meetingData={filteredMeetingData} loading={loading}
          action={(row) => {
            // props.dispatchHideMenu(); 
            navigation.navigate('Details', row)
          }} />
          </View>

</View>
    </LinearGradient>

  );

}



MeetingSearchScreen = connect(
  function mapStateToProps(state) {

    const { operatingUser, meetings } = state.general;
    return {
      authenticated: operatingUser.role != "guest", meetings
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


type MeetingSearchResult = {
  meetings?: Meeting[]
  types?: string[];
  error?: {
    message: string,
    type: string,
  };
}

export async function searchForMeeting(address = undefined, distance = 5): Promise<MeetingSearchResult> {

  let { status } = await Location.requestPermissionsAsync();
  let lat;
  let long;
  if (status !== 'granted') {
    return {
      error: {
        message: "Location permissions are not granted to this app.",
        type: "NoLocationPermission"
      }
    }
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
        log.info(`found address for ${address}`, { location })
        lat = location[0].latitude;
        long = location[0].longitude;
      } catch (err) {
        log.info(`problem looking for address`, { err })

        return { error: 'Could not find address by location data. Network problem' };
      }
    }



    let response = await apiGateway.getMeetings(lat, long, distance)


    if (response.error) {
      log.info(`problem getting data ${response.error}`)
      return response
    } else {



      let types: string[] = []
      const meetings: Meeting[] = response.data.map(rawMeeting => {

        const meeting: Meeting = {
          id: rawMeeting._id,
          name: rawMeeting.name,
          active: rawMeeting.active != 0,
          category: rawMeeting.category,
          location: { lat: rawMeeting.location.coordinates[1], long: rawMeeting.location.coordinates[0] },
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
      return { meetings: sortMeetings(meetings), types: [...typeSet] }
    }
  } catch (bigerr) {
    log.info(`problem getting meeting data as follows `, { bigerr })
  }
}

function MeetingFilter({ show, types, callback, message, distance }) {

  const { colors: Colors } = useColors();
  const styles = useStyles()
  const defaultFilters = { daysOfWeek: new Map(), paid: [], types: new Map(), distance: distance }
  const [visible, setVisible] = useState(false)
  const [opacity, setOpacity] = useState(new Animated.Value(0))
  const [filters, setFilters] = useState(defaultFilters)
  const Layout = useLayout();


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


  log.info(`types is`, { types });
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
            style={{ width: 34, height: 34, backgroundColor: '#FFF', borderColor: Colors.primary1, borderWidth: 2, borderRadius: 17, justifyContent: 'center', alignItems: 'center' }} >
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
            <TouchableOpacity style={[styles.toggleButton, { backgroundColor: Colors.primary1 }]}
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
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
      <Text style={[styles.message,]}>{message}</Text>
      <View style={[styles.filter, { display: show ? "flex" : "none" }]}>
        <TouchableOpacity onPress={showDialog}
          style={{ width: 34, height: 34, backgroundColor: '#FFF', borderColor: Colors.primary1, borderWidth: 2, borderRadius: 17, justifyContent: 'center', alignItems: 'center' }} >
          <FontAwesomeIcon icon={faFilter} style={styles.icon} size={17} />
        </TouchableOpacity>
      </View>
    </View>

  return (
    dialog
  )
}
function useStyles() {
  const Layout = useLayout();
  const { colors: Colors } = useColors();
  const ITEM_HEIGHT = 65 * Layout.scale.height + StyleSheet.hairlineWidth 
  const styles = StyleSheet.create({

    icon: {
      color: Colors.primary1,

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

    meetingListContainer:{
      borderRadius: 10,
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
    
    loadingRow: { height: ITEM_HEIGHT , flexDirection: "row", justifyContent: "flex-start", alignItems: "center", backgroundColor: 'white', borderRadius: 10 },
    loadingBoxOne: { height: ITEM_HEIGHT-15, width: 65 * Layout.scale.height, marginLeft: 10 * Layout.scale.width, borderRadius: 10, backgroundColor: 'lightgray' },
    loadingBoxTwo: { height: ITEM_HEIGHT-15, flex: 1, marginHorizontal: 10 * Layout.scale.width, borderRadius: 10, backgroundColor: 'lightgray' },


    message: {
      fontSize: 14 * Layout.scale.width,
      paddingTop: 10 * Layout.scale.width,
      color: Colors.primaryContrast
    },

    button: {
      backgroundColor: Colors.primary1,
      paddingVertical: 5 * Layout.scale.width,
      marginBottom: 5 * Layout.scale.width,
      textAlign: 'center',
      justifyContent: 'center',
      flexDirection: 'row'
    },

    seperatorComponent: {
      width: '100%',
      height: StyleSheet.hairlineWidth*2.5,
      backgroundColor: Colors.primary1,
      alignSelf: 'center',
    },
    container: {
      flex: 1,
      backgroundColor: '#FFF',

    },
    header: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: 'yellow',
    },

    sectionContainer: {
      marginHorizontal: 8 * Layout.scale.width,
      borderRadius: 8 * Layout.scale.width,
      overflow: 'hidden',
    },

    textField: {
      fontSize: 17 * Layout.scale.width,
      fontFamily: 'opensans'
    },
  });
  return styles
}

