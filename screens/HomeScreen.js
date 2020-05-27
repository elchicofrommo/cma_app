import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, Button, Dimensions } from 'react-native';
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

// Screens imported
import SoberietyTime from '../components/SoberietyTime'
import SettingsScreen from './SettingsScreen';

import DailyReading from '../components/DailyReading';
const {
  width: SCREEN_WIDTH, 
  height: SCREEN_HEIGHT
} = Dimensions.get('window')
const fontScale = SCREEN_WIDTH / 320;

// assets imported
import Logo from '../assets/images/LogoComponent'
import SplashScreen  from './SplashScreen'
const HomeStack = createStackNavigator();

export default function HomeScreenStack(){
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

const MeetingComponent = ({item: meeting, rowMap})=>{

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

             </View>
             <View style={{flexDirection: 'column', flex: 1, justifyContent: 'center', }}>
               <FontAwesomeIcon icon={faGripLinesVertical} style={styles.icon} size={23 * fontScale}/>
             </View>
         </View>
     )
 }

function HomeScreen({navigation, ...props}) {
  let twentyFour = props.general.dailyReaders.twentyFour;
  let men = props.general.dailyReaders.men;
  let women = props.general.dailyReaders.women;
  let readerDate = moment(props.general.readerDate)

  console.log(`meeting list is: ${props.general.meetings}`)
  return (
    <View style={styles.container}>

        <Text style={styles.readingTitle}>Daily Reading {readerDate.format("MM/DD")}</Text>
        <DailyReading subtitle={twentyFour.subtitle} reading={{...twentyFour[readerDate.format('MM-DD')], ...men[readerDate.format('MM-DD')], ...women[readerDate.format('MM-DD')]}} />


        <SwipeListView
            data={props.general.meetings}
            renderItem={ (data, rowMap) => { return MeetingComponent(data, rowMap)}}
            keyExtractor={(data)=>{return data._id}}
            renderHiddenItem={ (data, rowMap) => (

                <TouchableOpacity style={[styles.rowBack, styles.rowBackRemove]} key={data._id}
                onPress={(rowPress)=>{
                  console.log(`I am removing meeting ${JSON.stringify(data.item)}`)
                  rowMap[data.item._id].closeRow()
                  props.dispatchRemoveMeeting(data.item)
                }}>
                <Text style={styles.rowBackText}>Remove</Text>
              </TouchableOpacity>  
            )}
            rightOpenValue={-75 * fontScale}
            leftOpenValue={0}
            disableRightSwipe={true}
        />



      <SoberietyTime />
    </View>
  );
}

HomeScreen = connect(
    function mapStateToProps(state, ownProps){
        return state;
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
    backgroundColor: '#D4DAD4',
  },
  readingTitle: {
    fontSize: 18 * fontScale,
    paddingLeft: 7* fontScale,

  },
  meetings:{
    height: '30%',
    borderColor: '#fff',
    borderBottomWidth: 3,
    height: '30%'
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
