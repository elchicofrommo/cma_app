
import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, Button, Dimensions, Linking, Animated } from 'react-native';
import { BorderlessButton, ScrollView } from 'react-native-gesture-handler';

import {createStackNavigator} from '@react-navigation/stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import { connect } from 'react-redux';
import moment from 'moment'
import log from '../util/Logging'
import AppBanner from '../components/AppBanner'
import {MeetingList, sortMeetings} from './MeetingSearchScreen'

//import appLog from '../util/Logging'

// Screens imported
import SoberietyTime from '../components/SoberietyTime'
import {searchForMeeting} from './MeetingSearchScreen';
import Layout from '../constants/Layout';
import Colors from '../constants/Colors';

import DailyReading from '../components/DailyReading';


function openMap(lat, long, label){
  const androidLabel =  encodeURIComponent(`(${label})`)
 // appLog.info(`open map to ${lat} ${long} name: ${androidLabel}`)
  const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
  const latLng = `${lat},${long}`;

  const url = Platform.select({
    ios: `${scheme}${label}@${latLng}`,
    android: `${scheme}${latLng}${androidLabel}`
  });
  
  
  Linking.openURL(url); 
}

// assets imported
import SplashScreen  from './SplashScreen'
import { Ionicons } from '@expo/vector-icons';
import { faInfo } from '@fortawesome/free-solid-svg-icons';
const HomeStack = createStackNavigator();

export default function HomeScreenStack(){

  return (
    <HomeStack.Navigator >
      <HomeStack.Screen 
        name="home" 
        component={HomeScreen} 

        options={({navigation, route})=>({
          title:"",
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerLeft: ()=>{
            return <Text style={{color: 'white', fontFamily: 'opensans', fontSize:  21 * Layout.scale.width, paddingLeft: 10* Layout.scale.width}}>Home</Text>
          },

          headerTintColor: '#fff',
          headerTitleStyle: {

            fontFamily: 'opensans-bold',
            fontSize:  18 * Layout.scale.width,
            textAlign: 'left',
          },
          headerRight: ()=>{ 
            return (
              <TouchableOpacity  onPress={
                
                () => {
                  navigation.navigate('Settings')
                }
              } 
              style={{width: 34, height: 34, backgroundColor: Colors.primary, borderColor:'#FFF', 
              borderWidth: 2, borderRadius: 17, justifyContent: 'center', alignItems: 'center',
              marginRight: 10 * Layout.scale.width}}>
              <Ionicons name="md-person" color='#FFF' size={22} style={{marginLeft: 1}} />
              </TouchableOpacity>

            )},

        })}
        />

    </HomeStack.Navigator>
  )
}

function CustomButton({icon, callback, ...rest}){

  return (
      <BorderlessButton style={[styles.button]} onPress={()=>{callback()}}>

          <FontAwesomeIcon icon={icon} style={styles.icon} {...rest}/>

      </BorderlessButton>
  )
}


function HomeScreen({navigation, ...props}) {

  if(!props.dailyReaders)
    return <Text>Stil Loading</Text>

  let readerDate = moment(props.readerDate)

  const meetingSearch = searchForMeeting()
  log.info(`cose meeting is ${JSON.stringify(meetingSearch)}` )
  const [closeMeetings, setCloseMeetings] = React.useState([])
  React.useEffect(()=>{
    async function waitForMeetings(meetingPromise){
      const result = await meetingPromise;
      if(!result.error && result.meetings){
        const reducedMeetings = result.meetings.slice(0,3)
        setCloseMeetings(reducedMeetings)
      }
    }
    waitForMeetings(meetingSearch)
    log.info(`observed change in closeMeetings, must be bcasue promise resolved? `, {meetingSearch})
  },[])
  


  let meetingSection = undefined;
  if(props.meetings && props.meetings.length > 0){
    const meetings = sortMeetings(props.meetings)
    meetingSection = <MeetingList meetingData={meetings} 
      action={row=> navigation.navigate('Details', row)} />
  }else{
    let signin = ""
    if(!props.authenticated)
      signin = "Start by signing in or creating an account. ";
    meetingSection = <View style={styles.section}><Text>You have no saved seats. {signin} Search for your favorite meeting and save a seat. 
    </Text></View>
  }
  return (
    <View style={styles.container}>
        <AppBanner />
        <ScrollView>
        <SoberietyTime />
        <View style={styles.readerSection}>
          <Text style={styles.sectionHeading}>Daily Reading {readerDate.format("MM/DD")}</Text>
          <View style={{padding:0, }}></View>
          <DailyReading date={readerDate.format("MM-DD")} />
          <DailyReading />
          
        </View>
        <View style={styles.meetingSection}>
          <Text style={styles.sectionHeading}>Upcoming Home Group Meetings</Text>
          <View style={{ padding:0, }}></View>
          {meetingSection}

        </View>

        <View style={styles.meetingSection}>
          <Text style={styles.sectionHeading}>Closest Upcoming Meetings</Text>
          <View style={{ padding:0, }}></View>
          <MeetingList meetingData={closeMeetings} action={row=> navigation.navigate('Details', row)} />

        </View>  
        
        </ScrollView>
    </View>
  );
}

HomeScreen = connect(
    function mapStateToProps(state, ownProps){
        const { dailyReaders, meetings, authenticated} = state.general
        return {
          dailyReaders, meetings, authenticated
        };
      }, 
      function mapDispatchToProps(dispatch){
        return {
          testFunction: (testInput) => {
        //    appLog.info("dispatching test function with input " + testInput)
          },
          dispatchRemoveMeeting: (data) => {
         //   appLog.info("dispatching remove meeting ", {removeData: data})
            dispatch({type: "REMOVE_MEETING", data})
          }
        }

      }
)(HomeScreen)

HomeScreen.navigationOptions = {
  header: null,
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  meetingSection:{
    flex: 20,

  },
  readerSection: {
    flex: 10.7* Layout.scale.width * Layout.ratio ,
    marginBottom: 15,
  },
  section:{
    paddingHorizontal: 10 * Layout.scale.width,
    paddingTop: 10 * Layout.scale.width,
  },  
  sectionHeading: {
    fontSize: 18 * Layout.scale.width,
    paddingLeft: 10* Layout.scale.width,
    paddingVertical: 3,
    width: '100%',
   
  },
  meetings:{
    height: '30%',
    borderBottomWidth: 3,

  },
  icon:{
    color: 'gray'
  },
  gratitude:{
    height: '30%',
    borderColor: '#fff',

  },
  contentContainer: {
    flex: 1,
    justifyContent: "flex-start"
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },

  getStartedContainer: {
    marginHorizontal: 20,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },


  helpContainer: {
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  directions:{
    paddingVertical: 5 * Layout.scale.width,
    color: 'blue',
  },


  

});
