import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, Button, Dimensions, Linking } from 'react-native';
import { BorderlessButton, ScrollView } from 'react-native-gesture-handler';
import {NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUserCircle, faGripLinesVertical} from '@fortawesome/free-solid-svg-icons';
import { fromBottom } from 'react-navigation-transitions';
import { MonoText } from '../components/StyledText';
import {WebView} from 'react-native-webview';
import { connect } from 'react-redux';
import moment from 'moment'
import { SwipeListView } from 'react-native-swipe-list-view';
import AppBanner from '../components/AppBanner'
import {MeetingList, sortMeetings} from './MeetingSearchScreen'
import {DetailsScreen, DetailsBackButton, DetailTransition, } from './MeetingDetailsScreen'

// Screens imported
import SoberietyTime from '../components/SoberietyTime'
import SettingsScreen from './SettingsScreen';

import DailyReading from '../components/DailyReading';
const {
  width: SCREEN_WIDTH, 
  height: SCREEN_HEIGHT
} = Dimensions.get('window')
const fontScale = SCREEN_WIDTH / 320;

const longScreen = (SCREEN_WIDTH / SCREEN_HEIGHT )  *2

function openMap(lat, long, label){
  const androidLabel =  encodeURIComponent(`(${label})`)
 // console.log(`open map to ${lat} ${long} name: ${androidLabel}`)
  const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
  const latLng = `${lat},${long}`;

  const url = Platform.select({
    ios: `${scheme}${label}@${latLng}`,
    android: `${scheme}${latLng}${androidLabel}`
  });
  
  
  Linking.openURL(url); 
}

// assets imported
import Logo from '../assets/images/LogoComponent'
import SplashScreen  from './SplashScreen'
const HomeStack = createStackNavigator();

export default function HomeScreenStack(){
  console.log(`rendering hoemscren stack`)
  return (
    <HomeStack.Navigator >
      <HomeStack.Screen 
        name="Crystal Meth Anonymous" 
        component={HomeScreen} 
        title="Crystal Meth Anonymous"
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
          headerLeft: ()=>{ 
            return (
              <CustomButton icon={faUserCircle} 
                callback={() => navigation.navigate('Settings')} 
                style={{color: 'white', marginLeft: 10}}  
                size={25} />
            )},

        })}
        />
      <HomeStack.Screen
        name="Settings"
        component={SettingsScreen} 
        title="Settings"

        options={({navigation, route})=>({
          ...DetailTransition,
          headerStyle: {
            backgroundColor: '#1f6e21',
            
          },
          title: 'Settings',
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontFamily: 'merriweather',
            fontSize:  18 * fontScale
          },
        })}/>
      <HomeStack.Screen
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

  console.log(`rendering homescreen`)
  if(!props.dailyReaders)
    return <Text>Stil Loading</Text>

  let readerDate = moment(props.readerDate)

  

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
        <View style={styles.readerSection}>
          <Text style={styles.sectionHeading}>Daily Reading {readerDate.format("MM/DD")}</Text>
          <DailyReading date={readerDate.format("MM-DD")} />
        </View>
        <View style={styles.meetingSection}>
          <Text style={styles.sectionHeading}>Saved Seats</Text>
          {meetingSection}
  

        </View>
      <SoberietyTime />
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
            console.log("dispatching test function with input " + testInput)
          },
          dispatchRemoveMeeting: (data) => {
            console.log("dispatching remove meeting " + JSON.stringify(data))
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

  },
  meetingSection:{
    flex: 20,
  },
  readerSection: {
    flex: 10.2* fontScale * longScreen 
  },
  section:{
    paddingHorizontal: 10 * fontScale,
    paddingTop: 10 * fontScale,
  },  
  sectionHeading: {
    fontSize: 18 * fontScale,
    paddingLeft: 10* fontScale,

    backgroundColor: '#D4DAD4',
    width: '100%',
  },
  meetings:{
    height: '30%',
    borderColor: '#fff',
    borderBottomWidth: 3,
    height: '30%'
  },
  icon:{
    color: 'gray'
  },
  gratitude:{
    height: '30%',
    borderColor: '#fff',
    height: '30%'
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
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },

  helpContainer: {
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  directions:{
    paddingVertical: 5 * fontScale,
    color: 'blue',
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

  

});
