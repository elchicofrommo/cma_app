
import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, Button, Dimensions, Linking, Animated } from 'react-native';
import { BorderlessButton, ScrollView } from 'react-native-gesture-handler';

import {createStackNavigator} from '@react-navigation/stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { LinearGradient } from "expo-linear-gradient"
import { connect } from 'react-redux';
import moment from 'moment'
import log from '../util/Logging'

import HeaderComponent from '../components/HeaderComponent'

import {MeetingList, sortMeetings} from './MeetingSearchScreen'
import { useSafeArea } from 'react-native-safe-area-context';
//import appLog from '../util/Logging'

// Screens imported
import SoberietyTime from '../components/SoberietyTime'

import {useLayout} from '../hooks/useLayout';
import {useColors} from '../hooks/useColors';

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

import { Ionicons } from '@expo/vector-icons';


const HomeStack = createStackNavigator();

export default function HomeScreenStack(){
  const Layout = useLayout();

  return (
    <HomeStack.Navigator >
      <HomeStack.Screen 
        name="home" 
        component={HomeScreen} 

        options={({navigation, route})=>({
          title:"",

          headerMode: "float",
          headerTransparent: true,
          header: ({scene,previous, navigation})=>{
            return (
              <HeaderComponent scene={scene} previous={previous} navigation={navigation}
            title={"Home"} rightIcon={<Ionicons name="md-person" color='#FFF' size={22* Layout.scale.height} style={{marginLeft: 1}} />}
            rightIconNavigation={'Settings'}/> ) }
           
          })}
        />

    </HomeStack.Navigator>
  )
}

function CustomButton({icon, callback, ...rest}){
  const styles = useStyles()
  return (
      <BorderlessButton style={[styles.button]} onPress={()=>{callback()}}>

          <FontAwesomeIcon icon={icon} style={styles.icon} {...rest}/>

      </BorderlessButton>
  )
}


function HomeScreen({navigation, closeMeetings, closeMeetingsLoading, meetingsLoading, ...props}) {

  if(!props.dailyReaders)
    return <Text>Stil Loading</Text>

  let readerDate = moment(props.readerDate)

  const styles = useStyles()


  let meetingSection = undefined;
  if((props.meetings && props.meetings.length > 0)|| meetingsLoading){
    const meetings = sortMeetings(props.meetings)
    meetingSection = <MeetingList meetingData={meetings} limit={3} loading={meetingsLoading}
      action={row=> navigation.navigate('Details', row)} />
  }else{
    let signin = ""
    if(!props.authenticated)
      signin = "Start by signing in or creating an account. ";
    meetingSection = <View style={[styles.section, styles.emptyMeetingSection]}>
      <Text style={styles.emtpyMeetingSectionText}>You have no saved seats. {signin} Search for your favorite meeting and save a seat. 
    </Text></View>
  }
  return (
    <View style={styles.container}>


        <ScrollViewWithBackground>
              
        <SoberietyTime />
        <View style={[styles.readerSection, ]}>
          <Text style={styles.sectionHeading}>Daily Reading {readerDate.format("MM/DD")}</Text>

          <DailyReading date={readerDate.format("MM-DD")} />
          <DailyReading />
          
        </View>
        <View style={styles.meetingSection}>
          <Text style={styles.sectionHeading}>Upcoming Home Group Meetings</Text>

          {meetingSection}

        </View>

        <View style={styles.meetingSection}>
          <Text style={styles.sectionHeading}>Closest Upcoming Meetings</Text>

          <MeetingList meetingData={closeMeetings} loading={closeMeetingsLoading} limit={3} action={row=> navigation.navigate('Details', row)} />

        </View>  
        </ScrollViewWithBackground>
     
        </View>
  );
}
function ScrollViewWithBackground({children, ...props}){
  
  const {colors} = useColors()
  const styles = useStyles();
  const upper = .5
  const lower = 0;
  const delta = upper-lower;
  const [gradientCenter, setGradientCenter] = React.useState(upper)
  const insets = useSafeArea()
  function adjustGradientCenter({nativeEvent: event}){

    const height = event.contentSize.height - event.layoutMeasurement.height;
    const currentPosition = event.contentOffset.y > height? height: event.contentOffset.y < 0? 0: event.contentOffset.y;
    let percentScrolled = currentPosition / height ;

    setGradientCenter(upper- delta*percentScrolled)
  // log.info(`gradient pos is ${upper- delta*percentScrolled}`)
  } 
  //(1*(.9-gradientCenter))
  return (
    <LinearGradient style={[styles.container, ]}
    colors={[colors.primary, colors.primaryL1]}
    start={[0 , 0]}
    end={[1.5, 1.5]}
    locations={[0, gradientCenter]}
    >
      <ScrollView style={{  }} scrollEventThrottle={1}>
        {children}

      </ScrollView>
    </LinearGradient>
  )
}
HomeScreen = connect(
    function mapStateToProps(state, ownProps){
        const { dailyReaders, meetings, authenticated, closeMeetings, closeMeetingsLoading, meetingsLoading} = state.general
        console.log(`meetingsLoading: ${meetingsLoading}, closeMeetingsLoading: ${closeMeetingsLoading}`)
        return {
          dailyReaders, meetings, authenticated, closeMeetings, closeMeetingsLoading, meetingsLoading
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



function useStyles(){

  const Layout = useLayout();
  const {colors: Colors} = useColors();
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,

    },
    emptyMeetingSection: {backgroundColor: '#FFFFFF33', paddingBottom: 10* Layout.scale.height},
    emtpyMeetingSectionText: {fontFamily: 'opensans', fontSize: 18* Layout.scale.width, color: Colors.primaryContrast},
    meetingSection:{
      flex: 20,
  
    },
    readerSection: {
      flex: 10.7* Layout.scale.width * Layout.ratio ,
      marginTop: 10 * Layout.scale.height
    },
    section:{
      paddingHorizontal: 10 * Layout.scale.width,
      paddingTop: 10 * Layout.scale.width,
    },  
    sectionHeading: {
      fontSize: 18 * Layout.scale.width,
      paddingLeft: 10* Layout.scale.width,
      backgroundColor: "#00000055",
      paddingVertical: 8,
      width: '100%',
      fontFamily: 'opensans',
      color: Colors.primaryContrast,
     
    },
    meetings:{
      height: '30%',
      borderBottomWidth: 3,
  
    },
    icon:{
      color: 'gray'
    },

  
  });
  return styles;
}

