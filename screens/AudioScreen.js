import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import  React,  {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { RectButton, ScrollView, BorderlessButton } from 'react-native-gesture-handler';
import SoberietyTime from '../components/SoberietyTime'
import {NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import { connect } from 'react-redux';
import Logo from '../assets/images/GreenLogo'
import moment from 'moment'
import {Audio} from 'expo-av'
import axios from 'axios';

const SpeakerStack = createStackNavigator();

import { faPlayCircle, faPauseCircle} from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPause } from '@fortawesome/free-solid-svg-icons';
const color = "#1f6e21"
let playerReady = false


export const search = (uri, callback) => {
    return fetch(
        `https://api-v2.soundcloud.com/search/tracks?q=${query}&client_id=${SC_KEY}&limit=${limit}&offset=${page*limit}&linked_partitioning=1`
    ).then(res => res.json())
     .then(json => new Promise((resolve, reject) => {
         resolve(json);
     }));
};
const CLIENT_ID = "?client_id=pPoEnwUrlg2xU83gOZyN2AqPZ8kxkhBg"
export const streamUrl = (trackUrl) => `${trackUrl}/stream?client_id=${SC_KEY}`;

const {
  width: SCREEN_WIDTH, 
  height: SCREEN_HEIGHT
} = Dimensions.get('window')
const fontScale = SCREEN_WIDTH / 320;

export default function SpeakerScreenStack(){
  return (
    <SpeakerStack.Navigator>
      <SpeakerStack.Screen 
        name="Speakers Shares" 
        component={SpeakerScreen} 
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

        })}/>
    </SpeakerStack.Navigator>
  )
}

function PlayerComponent(props){
  const [buttonState, setButtonState] = useState(0);
  const [player, setPlayer] = useState();
  const buttons = [faPlayCircle, faPauseCircle]

  function playbackStatus(status){
    console.log(`${JSON.stringify(status)}`)
  }

  function playerCallback(){
    console.log(`player callback is called for ${props.url}`)

    if(player){
      if(buttonState ==1){
        player.pauseAsync().then(
          (result)=>{ 
            console.log('pausing');
            setButtonState((buttonState +1)%2)
          }
        )
        
      }else {
        player.playAsync().then(
          (result)=>{
            console.log('playing again');
            setButtonState((buttonState +1 ) %2 )
          }
        )
      }
      
    }


    else{
        axios.get(props.url + CLIENT_ID)
      .then( response => {
        console.log(`have playing url ${response.data.url}`)
        Audio.Sound.createAsync(
          {uri: response.data.url},
          {shouldPlay: true},
          playbackStatus,
          false
        ).then(({sound, status})=>{
          setButtonState((buttonState +1)%2)
          setPlayer(sound);

        }).catch((err)=>{
          console.log('problem playing the file ' + err)
        })
        
      }).catch( error =>{
        console.log("could not get network resources " + error)
      })
    }
    
  }
  return (
  <View style={{height: fontScale * 80, flexDirection: 'row',  backgroundColor: '#FFF', borderBottomWidth: 1,}}>
          <View style={{ justifyContent: 'center', paddingHorizontal: 5}}>
            <BorderlessButton style={[styles.button]} onPress={playerCallback}>
              <FontAwesomeIcon icon={buttons[buttonState]} style={{color: color}}  size={50* fontScale}/>
            </BorderlessButton>
            
            <Text style={styles.duration}>{`${props.duration}`}</Text>
          </View>
          <View key={props.title} style={{flex: 10,  borderColor: 'grey', }}>
            <View style={styles.trackTitleGroup}>
              <Text style={styles.title}>{props.title}</Text>
              <Text style={styles.trackCreated}>{props.created}</Text>
                
            </View>
            <Text style={styles.trackDescription}>{props.description}</Text>
          </View>
          </View>
  )
}

function buildTrackList(rawTracks){
  const tracks = [];

  rawTracks.forEach((track)=>{
    const duration = moment.duration(track.full_duration)
    const time = moment.utc(duration.as('milliseconds')).format('mm:ss')
    let hours = duration.hours();

    if(hours >0)
      hours = `${hours}:`
    else
      hours = ""

    console.log(`getting uri from ${JSON.stringify(track.media.transcodings[1].url)}`);
    const created = moment(track.created_at);

    tracks.push(<PlayerComponent 
      duration={`${hours}${time}`} 
      description={track.description} 
      title={track.title.replace(/\d\d.\d\d.\d\d\d\d$/, '')}
      created={created.format("MM/DD/YYYY")}
      url={track.media.transcodings[1].url}
    />)
  })
  return tracks
}
function SpeakerScreen(props) {
  console.log(`building audio screen, description is ${JSON.stringify(props.general.soundcloudDetails)}`)
  const trackList = buildTrackList(props.general.soundcloudTracks)
  return (
    
    <View style={styles.container}>

      <View style={{flex: .2, flexDirection: 'row', paddingTop: 10, paddingBottom: 10}}>

          <Logo style={{flex: 1, marginLeft: -20, marginRight: -40, }}/>


          <View style={{flex: 2, justifyContent: 'center', alignItems: 'center' }}>
            <Text>{props.general.soundcloudDetails.description}</Text>
          </View>


      </View>
    
    <ScrollView style={styles.container} contentContainerStyle={{}}>
      {trackList}
      <OptionButton
        icon="md-school"
        label="Read the Expo documentation"
        onPress={() => WebBrowser.openBrowserAsync('https://docs.expo.io')}
      />

      <OptionButton
        icon="md-compass"
        label="Read the React Navigation documentation"
        onPress={() => WebBrowser.openBrowserAsync('https://reactnavigation.org')}
      />

      <OptionButton
        icon="ios-chatboxes"
        label="Ask a question on the forums"
        onPress={() => WebBrowser.openBrowserAsync('https://forums.expo.io')}
        isLastOption
      />
      
    </ScrollView>
    </View>
  );
}

SpeakerScreen =  connect(
  function mapStateToProps(state, ownProps){
      return state;
    }, 
    function mapDispatchToProps(dispatch, ownState){
      return {
        dispatchNameChange: (name) => {
          console.log("dispatching name change with input " + name);
          dispatch({type: "NAME_CHANGE", name})
        },
        dispatchDosChange: (date) => {
            console.log(`dispatching dos change ${date}`)
            dispatch({type: 'DOS_CHANGE', date})
        }
        
      }
    }
)(SpeakerScreen)


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
  trackTitleGroup:{
    flex: 1, 
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  title:{
    flex: 6
  },
  duration:{
    textAlign: 'center'
  },
  trackDescription:{

  },
  trackCreated:{
    flex: 2.1
  },
  container: {
    flex: 1,
    backgroundColor: '#D4DAD4',
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
