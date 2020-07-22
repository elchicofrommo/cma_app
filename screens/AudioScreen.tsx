
import React, { useState, useEffect, memo, useCallback } from 'react';
import { shallowEqual, useSelector } from "react-redux";
import { StyleSheet, Text, View, Dimensions, FlatList } from 'react-native';
import { RectButton, ScrollView, BorderlessButton, TouchableOpacity } from 'react-native-gesture-handler';
import AppBanner from '../components/AppBanner'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { connect } from 'react-redux';
import Logo from '../assets/images/GreenLogo'
import moment from 'moment'
import { Audio } from 'expo-av'
import axios from 'axios';
import Colors from '../constants/Colors';
import SoberietyTime from "../components/SoberietyTime"
import {LinearGradient} from "expo-linear-gradient"
import log from "../util/Logging"
const SpeakerStack = createStackNavigator();

import { faPlayCircle, faPauseCircle } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPause } from '@fortawesome/free-solid-svg-icons';
import { Ionicons } from '@expo/vector-icons';
const color = Colors.primary
let playerReady = false



import Layout from '../constants/Layout';

export default function SpeakerScreenStack() {
  log.info(`render AudioScreenStack`)
  return (
    <SpeakerStack.Navigator>
      <SpeakerStack.Screen
        name="Speakers Shares"
        component={SpeakerScreen}
        options={({ navigation, route }) => ({
          headerLeft: ()=>{
            return <Text style={{color: 'white', fontFamily: 'opensans', fontSize:  21 * Layout.scale.width, paddingLeft: 10* Layout.scale.width}}>Speaker Shares</Text>
          },
          title: '',
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {

          },

        })} />
    </SpeakerStack.Navigator>
  )
}






const PlayerComponent = memo(({ track, isPlaying, setPlayingTrack }) => {

  log.info(`new PlayerComponent past memo`)
  const [player, setPlayer] = useState();

  const duration = moment.duration(track.full_duration)
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


  const buttons = [faPlayCircle, faPauseCircle]


  function playbackStatus(status) {

    log.info(`playbackStatus`)
  }

  function playerCallback() {
    log.info(`player callback is called for ${url}`)

    if (player) {
      if (isPlaying) {
        player.pauseAsync().then(
          (result) => {
            log.info('pausing');
            setPlayingTrack(undefined)
          }
        )

      } else {
        player.playAsync().then(
          (result) => {
            log.info(`restarting track ${track.id}`);
            setPlayingTrack(track.id)
          }
        )
      }

    }


    else {
      axios.get(url)
        .then(response => {
          // log.info(`have playing url ${response.data.url}`)
          Audio.Sound.createAsync(
            { uri: response.data.url },
            { shouldPlay: true },
            playbackStatus,
            false
          ).then(({ sound, status }) => {
            log.info(`playing track ${track.id}`);
            setPlayer(sound)
            setPlayingTrack(track.id)
          }).catch((err) => {
            log.info('problem playing the file ' + err)
          })

        }).catch(error => {
          log.info("could not get network resources " + error)
        })
    }

  }

  const button = isPlaying? 
    <TouchableOpacity  onPress={playerCallback}
    style={{ width: 34, height: 30, justifyContent: 'center', alignItems: 'center'}} >
    <Ionicons name="ios-pause" color={Colors.primary} size={24} />
    </TouchableOpacity> :

    <TouchableOpacity  onPress={playerCallback}
    style={{ width: 34, height: 30, justifyContent: 'center', alignItems: 'center'}} >
    <Ionicons name="ios-play" color={Colors.primary} size={24} />
    </TouchableOpacity>

  return (
    <View style={{ height: Layout.scale.width * 80, flexDirection: 'row', backgroundColor: '#FFF', borderBottomWidth: 1, }}>
      
      <View style={{ justifyContent: 'center', paddingHorizontal: 5 }}>
        <BorderlessButton style={[styles.button]} onPress={playerCallback}>
          <FontAwesomeIcon icon={isPlaying ? faPauseCircle : faPlayCircle} style={{ color: color }} size={50 * Layout.scale.width} />
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

  return prev.isPlaying == next.isPlaying
}



function SpeakerScreen(props) {
  log.info(`rendering SpeakerScreen`)
  const [playingTrack, setPlayingTrack] = useState();

  const{tracks, details} = useSelector((state)=>{
    const tracks = state.general.soundCloudTracks;
    const details = state.general.soundCloudDetails;
    return {tracks, details}
  })


  log.info(`tracks and details are null? ${tracks==undefined} ${details==undefined}`)
  //console.log(`${JSON.stringify(tracks)}`)
  const playerComponentWrapper = useCallback(({ item }) => {
    //log.info(`playingTrack ${playingTrack} and this track is ${item.id}`)
    return <PlayerComponent track={item} isPlaying={playingTrack == item.id} setPlayingTrack={setPlayingTrack} />
  }, [playingTrack])
  const keyExtractorCallback = useCallback(({ item }) => { return item.track.id }, [])
  return (

    <View style={styles.container}>
      <AppBanner />
      <View style={{ backgroundColor: Colors.primaryL2, flex: .2, flexDirection: 'row', paddingTop: 10, paddingBottom: 10 }}>
        <LinearGradient 
          colors={[Colors.primaryL2, Colors.primaryL1]}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
          }}
          start={[0,0]}
          end={[1.8, 1.8]}
        />
        <Logo style={{ flex: 1, marginLeft: -10, marginRight: -40, }} />

        <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10 * Layout.scale.width }}>
          <Text>{details.description}</Text>
        </View>
      </View>

      <FlatList data={tracks}

        style={styles.container}
        extraData={playingTrack}
        maxToRenderPerBatch={10}
        renderItem={playerComponentWrapper} />
     
    </View>
  );
}




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
