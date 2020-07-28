
import React, { useState, useEffect, memo, useCallback } from 'react';
import { shallowEqual, useSelector } from "react-redux";
import { StyleSheet, Text, View, Dimensions, FlatList } from 'react-native';
import { RectButton, ScrollView, BorderlessButton, TouchableOpacity } from 'react-native-gesture-handler';
import AppBanner from '../components/AppBanner'

import { createStackNavigator } from '@react-navigation/stack';
import HeaderComponent from '../components/HeaderComponent'
import Logo from '../assets/images/GreenLogo'
import moment from 'moment'
import { Audio } from 'expo-av'
import axios from 'axios';
import {useColors} from '../hooks/useColors'
import {useLayout} from '../hooks/useLayout'

import {LinearGradient} from "expo-linear-gradient"
import log from "../util/Logging"
import {AnimationStates, AnimatedCircle, CircleEnd, CircleStart} from '../assets/images/circlePlayer'

const SpeakerStack = createStackNavigator();

import { faPlayCircle, faPauseCircle } from '@fortawesome/free-regular-svg-icons'
import { Feather, AntDesign } from '@expo/vector-icons'; 

import { Ionicons } from '@expo/vector-icons';

let playerReady = false



import { TrackingConfiguration } from 'expo/build/AR';
import { useSafeArea } from 'react-native-safe-area-context';

enum PlayStates {
  INITAL, LOADING, PAUSED, PLAYING, RESUME
}

export default function SpeakerScreenStack() {
  log.info(`render AudioScreenStack`)
  return (
    <SpeakerStack.Navigator>
      <SpeakerStack.Screen
        name="Speakers Shares"
        component={SpeakerScreen}
        options={({navigation, route})=>({
          title:"",

          headerMode: "float",
          headerTransparent: true,
          header: ({scene,previous, navigation})=>{
            return (
              <HeaderComponent scene={scene} previous={previous} navigation={navigation}
            title={"Speaker Shares"} /> ) }
           
          })}
        />
    </SpeakerStack.Navigator>
  )
}






const TrackDetails = memo(({ track, state = PlayStates.INITAL, playerCallback }: 
  {track: any, state: PlayStates, playerCallback:Function}) => {

  log.info(`new PlayerComponent past memo input is track:${track.state} and state:${state}`)
  

  const duration = moment.duration(track.duration)
  const time = moment.utc(duration.as('milliseconds')).format('mm:ss')
  let hours = ""

  if (duration.hours() > 0)
    hours = `${duration.hours()}:`

  const created = moment(track.created_at);

  const durationText = `${hours}${time}`;
  const description = track.description;
  const title = track.title.replace(/\d\d.\d\d.\d\d\d\d$/, '');
  const createdText = created.format("MM/DD/YYYY");
  const url = track.trackUrl

  const layout = useLayout();
  const buttons = [faPlayCircle, faPauseCircle]


  function playbackStatus(status) {

    log.info(`playbackStatus`)
  }
  const styles = useStyle();
  const {colors: Colors} = useColors();
  let playStatus =  <View style={{position: 'absolute', zIndex:  5,top: 1, left: 2}}>
    <CircleStart width={60} height={60} style={{position: 'absolute', zIndex: 1, top: 0, left:0}}  />
    <Feather name="play" size={35} color={Colors.primary} style={{position: 'absolute', zIndex: 3, top: 12.5, left:14.5}}/>
    </View>


  if(state == PlayStates.PLAYING)
    playStatus = <View style={{position: 'absolute', zIndex: 5, top: 1, left: 2}}>
      <AnimatedCircle style={{position: 'absolute', zIndex: 1, top: 0, left:0}} width={60} height={60} duration={track.duration} state={AnimationStates.PLAY} />
      <AntDesign name="pause" size={40} color={Colors.primary} style={{position: 'absolute', zIndex: 3, top: 10, left:10}}/>
      </View>
  else if(state == PlayStates.PAUSED)
    playStatus = <View style={{position: 'absolute', zIndex: 5, top: 1, left: 2}}>
      <AnimatedCircle style={{position: 'absolute', zIndex: 1, }} width={60} height={60} duration={track.duration} state={AnimationStates.PAUSE} />
      <Feather name="play" size={35} color={Colors.primary} style={{position: 'absolute', zIndex: 3, top: 12.5, left:14.5}}/>
      </View>
  else if (state == PlayStates.RESUME)
  playStatus = <View style={{position: 'absolute', zIndex: 5, top: 1, left: 2}}>
    <AnimatedCircle style={{position: 'absolute', zIndex: 1, top: 0, left:0}} width={60} height={60} duration={track.duration} state={AnimationStates.RESUME} />
    <AntDesign name="pause" size={40} color={Colors.primary} style={{position: 'absolute', zIndex: 3, top: 10, left:10}}/>
    </View>
  //else if(state == PlayStates.LOADING)
 //   playStatus = <FontAwesomeIcon icon={faHourglassHalf} style={{ color: color }} size={50 * Layout.scale.width} />

  return (
    <View style={{ height: layout.scale.width * 80, flexDirection: 'row', backgroundColor: '#FFF', borderBottomWidth: 1, }}>
      
      <View style={[{ justifyContent: 'center', paddingHorizontal: 5 }, track.state==PlayStates.LOADING && {opacity: .5}]}>
        <BorderlessButton style={[styles.button, {height: 65, width: 65}]} onPress={()=>{track.state!=PlayStates.LOADING&& playerCallback(track)}}>
          {playStatus}
          <View style={{position: 'absolute', zIndex: 3, top: 1, left: 2}}><CircleEnd width={60} height={60} /></View>
        </BorderlessButton>

        <Text style={styles.duration}>{`${durationText}`}</Text>
      </View>
      <View key={title} style={{ flex: 10, borderColor: 'grey', }}>
        <View style={styles.trackTitleGroup}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.trackCreated}>{createdText}</Text>

        </View>
        <Text style={styles.trackDescription}>{description}</Text>
      </View>
    </View>
  )

}, compareStates)

function compareStates(prev, next) {

  return prev.state == next.state
}



function SpeakerScreen(props) {
  const {colors: Colors} = useColors();
  const layout = useLayout();
  const styles = useStyle()
  log.info(`rendering SpeakerScreen`)
  const [playingTrack, setPlayingTrack] = useState();

  const [player, setPlayer] = useState();
  const{tracks, details} = useSelector((state)=>{
    const tracks = state.general.soundCloudTracks;
    const details = state.general.soundCloudDetails;
    return {tracks, details}
  })


  async function playerCallback (track){

    const temp = {player: undefined};
    setPlayer(player=>{
      temp.player = player;
      return player;
    })

    log.info(`playerCallback called`, {track, player})

    if(!playingTrack||track.id != playingTrack.id){
      track.state = PlayStates.LOADING
      setPlayingTrack({...track})

      log.info(`going to play the following`, {track})
      

      axios.get(track.trackUrl)
        .then(response => {
          // log.info(`have playing url ${response.data.url}`)
          if(temp.player){

                temp.player.unloadAsync().then(r2=>{
                  temp.player.loadAsync(
                    { uri: response.data.url },
                    { shouldPlay: true },
                    false
                  ).then((status) => {
                    log.info(`playing status ${status}`);

                    track.state = PlayStates.PLAYING
                    setPlayingTrack({...track})
                  }).catch((err) => {
                    log.info('problem playing the file ' + err)
                  })
                })

               
          }else{
            Audio.Sound.createAsync(
              { uri: response.data.url },
              { shouldPlay: true },
              null,
              false
            ).then(({ sound, status }) => {
              log.info(`playing track ${track.id}`);
              setPlayer(sound)
              track.state = PlayStates.PLAYING
              setPlayingTrack({...track})
            }).catch((err) => {
              log.info('problem playing the file ' + err)
            })
          }
        }).catch(error => {
          log.info("could not get network resources " + error)
        })
    } else if (track.id==playingTrack.id){
      if(track.state != PlayStates.PAUSED){
        track.state = PlayStates.PAUSED
        setPlayingTrack({...track})
        temp.player.pauseAsync().then(
          (result) => {
            log.info('pausing');

          }
        )
      }else{
        track.state = PlayStates.RESUME
        setPlayingTrack({...track})
        temp.player.playAsync().then(
          (result) => {
            log.info(`restarting track ${track.id}`);

          }
        ) 
      }
    } 
  }

  log.info(`tracks and details are null? ${tracks==undefined} ${details==undefined}`)
  //console.log(`${JSON.stringify(tracks)}`)
  function renderTrackDetails({item:track, index}) {
   // log.info(`playing track ${playingTrack?.id} and this track id ${track.id}`)
    let state = PlayStates.INITAL;
    if(playingTrack?.id == track.id){
      state = playingTrack.state
      log.info(`got a hit, changing state to ${state}`)
    }
    return <TrackDetails track={track} playerCallback={playerCallback} state={state}/>
  }
  const keyExtractorCallback = useCallback(({ item }) => { return item.track.id }, [])
  const insets = useSafeArea()
  const headerComponent =         <View style={{backgroundColor: '#FFFFFF33', marginTop: insets.top + 50 * layout.scale.height , height: 150 * layout.scale.height, flexDirection: 'row'}}>
  <Logo style={{ flex: 1, marginLeft: -10, marginRight: -30, }} />

  <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10 * layout.scale.width }}>
    <Text style={{color: Colors.primaryContrast, fontFamily: 'opensans', fontSize: 13 * layout.scale.width}}>{details.description}</Text>
  </View>
</View>
  return (

    <LinearGradient style={[styles.container, ]}
    colors={[Colors.primary, Colors.primaryL1]}
    start={[0 , 0]}
    end={[1.5, 1.5]}
    locations={[0, .5]}>   



        <FlatList data={tracks}
        extraData={playingTrack}
        contentContainerStyle={{}}
        ListHeaderComponent={headerComponent}
        maxToRenderPerBatch={10}
        initialNumToRender={10}
        renderItem={renderTrackDetails} />
    </LinearGradient>
  );
}




function OptionButton({ icon, label, onPress, isLastOption }) {
  const styles = useStyle();
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
function useStyle(){
  const {colors: Colors} = useColors()
  const layout = useLayout();

const styles = StyleSheet.create({
  trackTitleGroup: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  title: {
    flex: 6
  },
  duration: {
    textAlign: 'center'
  },
  trackDescription: {

  },
  trackCreated: {
    flex: 2.1
  },
  container: {
    flex: 1,
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
return styles;
}

