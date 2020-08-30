
import React, { useState, useEffect, memo, useCallback } from 'react';
import apiGateway from '../api/apiGateway'
import { shallowEqual, useSelector } from "react-redux";
import { StyleSheet, Text, View, Dimensions, FlatList, LayoutAnimation } from 'react-native';
import { RectButton, ScrollView, BorderlessButton, TouchableOpacity } from 'react-native-gesture-handler';
import AppBanner from '../components/AppBanner'

import { createStackNavigator } from '@react-navigation/stack';
import HeaderComponent from '../components/HeaderComponent'
import Logo from '../assets/images/GreenLogo'
import moment from 'moment'
import { Audio } from 'expo-av'
import axios from 'axios';
import { useColors } from '../hooks/useColors'
import { useLayout } from '../hooks/useLayout'

import { LinearGradient } from "expo-linear-gradient"
import log from "../util/Logging"
import { AnimationStates, AnimatedCircle, CircleEnd, CircleStart } from '../assets/images/circlePlayer'

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
        options={({ navigation, route }) => ({
          title: "",


          headerTransparent: true,
          header: ({ scene, previous, navigation }) => {
            return (
              <HeaderComponent scene={scene} previous={previous} navigation={navigation}
                title={"Speaker Shares"} />)
          }

        })}
      />
    </SpeakerStack.Navigator>
  )
}






const TrackDetails = memo(({ track, state = PlayStates.INITAL, playerCallback , index}:
  { track: any, state: PlayStates, playerCallback: Function, index: number }) => {

  //log.info(`new PlayerComponent past memo input is track:${track.state} and state:${state}`)


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

  const circleWidth = 40 * layout.scale.width;
  const playIconSize = 22 * layout.scale.width;
  const pauseIconSize = 24 * layout.scale.width;
  function playbackStatus(status) {

    log.info(`playbackStatus`)
  }
  const styles = useStyle();
  const { colors: Colors } = useColors();
  let playStatus = <View style={{ position: 'absolute', zIndex: 5, top: 1, left: 2 }}>
    <CircleStart width={circleWidth} height={circleWidth} style={{ position: 'absolute', zIndex: 1, top: 0, left: 0 }} />
    <Feather name="play" size={playIconSize} color={Colors.primary1} style={{ position: 'absolute', zIndex: 3, top: playIconSize *.4, left: playIconSize *.45 }} />
  </View>


  if (state == PlayStates.PLAYING)
    playStatus = <View style={{ position: 'absolute', zIndex: 5, top: 1, left: 2 }}>
      <AnimatedCircle style={{ position: 'absolute', zIndex: 1, top: 0, left: 0 }} width={circleWidth} height={circleWidth} duration={track.duration} state={AnimationStates.PLAY} />
      <AntDesign name="pause" size={pauseIconSize} color={Colors.primary1} style={{ position: 'absolute', zIndex: 3, top: pauseIconSize * .35, left: pauseIconSize * .32 }} />
    </View>
  else if (state == PlayStates.PAUSED)
    playStatus = <View style={{ position: 'absolute', zIndex: 5, top: 1, left: 2 }}>
      <AnimatedCircle style={{ position: 'absolute', zIndex: 1, }} width={circleWidth} height={circleWidth} duration={track.duration} state={AnimationStates.PAUSE} />
      <Feather name="play" size={playIconSize} color={Colors.primary1} style={{ position: 'absolute', zIndex: 3, top: playIconSize *.4, left: playIconSize *.45 }} />
    </View>
  else if (state == PlayStates.RESUME)
    playStatus = <View style={{ position: 'absolute', zIndex: 5, top: 1, left: 2 }}>
      <AnimatedCircle style={{ position: 'absolute', zIndex: 1, top: 0, left: 0 }} width={circleWidth} height={circleWidth} duration={track.duration} state={AnimationStates.RESUME} />
      <AntDesign name="pause" size={pauseIconSize} color={Colors.primary1} style={{ position: 'absolute', zIndex: 3, top: pauseIconSize * .35, left: pauseIconSize * .32}} />
    </View>
  //else if(state == PlayStates.LOADING)
  //   playStatus = <FontAwesomeIcon icon={faHourglassHalf} style={{ color: color }} size={50 * Layout.scale.width} />

  return (
    <View style={[{ height: layout.scale.width * 80, flexDirection: 'row', flex: 0, marginTop: -.3, backgroundColor: '#FFF'}, index==0 && {borderTopLeftRadius: 8 * layout.scale.width, borderTopRightRadius: 8 * layout.scale.width} ]}>

      <View style={[{  justifyContent: 'center', alignItems: 'center', paddingHorizontal: 5,  }, track.state == PlayStates.LOADING && { opacity: .5 }]}>
        <BorderlessButton style={[styles.button, {  height: circleWidth * 1.1, width: circleWidth * 1.1 , marginRight: 0, paddingRight: 0 }]} onPress={() => { track.state != PlayStates.LOADING && playerCallback(track) }}>
          {playStatus}
          <View style={{ position: 'absolute', zIndex: 3, top: 1, left: 2 }}><CircleEnd width={circleWidth} height={circleWidth} /></View>
        </BorderlessButton>

        <Text style={[styles.duration, ]}>{`${durationText}`}</Text>
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
  const { colors: Colors } = useColors();
  const layout = useLayout();
  const styles = useStyle()
  log.info(`rendering SpeakerScreen`)
  const [playingTrack, setPlayingTrack] = useState();

  const [player, setPlayer] = useState();
  const { tracks, details } = useSelector((state) => {
    const tracks = state.general.soundCloudTracks;
    const details = state.general.soundCloudDetails;
    return { tracks, details }
  })


  async function playerCallback(track) {

    const temp = { player: undefined };
    setPlayer(player => {
      temp.player = player;
      return player;
    })

    log.info(`playerCallback called`, { track, player })

    if (!playingTrack || track.id != playingTrack.id) {
      track.state = PlayStates.LOADING
      setPlayingTrack({ ...track })

      log.info(`going to play `)

      const playableTrack = await apiGateway.getPlayableTrack(track.trackUrl)

      if (temp.player) {

        temp.player.unloadAsync().then(r2 => {
          temp.player.loadAsync(
            { uri: playableTrack },
            { shouldPlay: true },
            false
          ).then((status) => {
            log.info(`playing status ${status}`);

            track.state = PlayStates.PLAYING
            setPlayingTrack({ ...track })
          }).catch((err) => {
            log.info('problem playing the file ' + err)
          })
        })


      } else {
        Audio.Sound.createAsync(
          { uri: playableTrack },
          { shouldPlay: true },
          null,
          false
        ).then(({ sound, status }) => {
          log.info(`playing track ${track.id}`);
          setPlayer(sound)
          track.state = PlayStates.PLAYING
          setPlayingTrack({ ...track })
        }).catch((err) => {
          log.info('problem playing the file ' + err)
        })
      }

    } else if (track.id == playingTrack.id) {
      if (track.state != PlayStates.PAUSED) {
        track.state = PlayStates.PAUSED
        setPlayingTrack({ ...track })
        temp.player.pauseAsync().then(
          (result) => {
            log.info('pausing');

          }
        )
      } else {
        track.state = PlayStates.RESUME
        setPlayingTrack({ ...track })
        temp.player.playAsync().then(
          (result) => {
            log.info(`restarting track ${track.id}`);

          }
        )
      }
    }
  }

  //log.info(`soundcloud details`, {tracks, details})

  function renderTrackDetails({ item: track, index }) {
     //log.info(`this track id ${track.id}`)
    let state = PlayStates.INITAL;
    if (playingTrack?.id == track.id) {
      state = playingTrack.state
      log.info(`got a hit, changing state to ${state}`)
    }
    return <TrackDetails track={track} playerCallback={playerCallback} state={state} index={index} />
  }
  const keyExtractorCallback = useCallback(({ item }) => { return item.track.id }, [])
  const insets = useSafeArea()
  const headerComponent = <View style={{  marginTop: insets.top + 50 * layout.scale.height, height: 150 * layout.scale.height, flexDirection: 'row' }}>
    <Logo style={{ flex: 1, marginLeft: -10, marginRight: -30, }} />

    <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10 * layout.scale.width }}>
      <Text style={{ color: Colors.primaryContrast, fontFamily: 'opensans', fontSize: 13 * layout.scale.width }}>{details.error? details.error: details.description}</Text>
    </View>
  </View>
  return (

    <LinearGradient style={[styles.container,]}
    colors={[Colors.primary1, Colors.primary2]}
    start={[0, 0]}
    end={[1.5, 1.5]}
    locations={[0, .7]}
  >
      <FlatList data={tracks}
        extraData={playingTrack}
        ItemSeparatorComponent={() => <View style={styles.seperatorComponent}></View>}

        contentContainerStyle={{ marginHorizontal: 8 * layout.scale.width,  borderRadius: 8 * layout.scale.width, overflow: 'hidden' , }}
        ListHeaderComponent={headerComponent}
        maxToRenderPerBatch={20}
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
function useStyle() {
  const { colors: Colors } = useColors()
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
      textAlign: 'center',
      fontFamily: 'opensans',
      fontSize: 12* layout.scale.width,
    },
    trackDescription: {

    },
    seperatorComponent: {
      width: '100%',
      height: 3,
      flexShrink: 0,
      borderTopWidth: .2,
      borderColor: Colors.primary1,
      backgroundColor: Colors.primaryContrast,
      borderBottomWidth: 0,
      alignSelf: 'center',
    },
    trackCreated: {
      flex: 2.1,
      textAlign: 'center',
      fontFamily: 'opensans',
      fontSize: 10* layout.scale.width,
    },
    container: {
      flex: 1,
      paddingBottom: 8 * layout.scale.width,

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

