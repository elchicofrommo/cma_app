import { Ionicons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as React from 'react';
import { DataStore, Predicates } from "@aws-amplify/datastore";
import axios from 'axios';
import { store } from '../components/store'
import { DailyReaders, Preferences, AuthDetail } from "../models/index";
import { signIn, SignInResult } from '../screens/SettingsScreen'
import { User, Meeting, UserChannel } from '../types/gratitude'
import fetchApi from '../api/fetch'
import { shallowEqual, useSelector  } from 'react-redux';
import NetInfo from '@react-native-community/netinfo';
import { AppState } from 'react-native';
import log from '../util/Logging'

export default function useSubscriptions() {

  const user : User = useSelector  (state=>state.general.operatingUser, shallowEqual ) 
  const userChannels: UserChannel[] = useSelector( state=>state.general.userChannels, shallowEqual)
  const [connected, setConnected] = React.useState(true)
  const [appState, setAppState] = React.useState(AppState.currentState)
  
  React.useEffect(()=>{
    const netInfoCleanup = NetInfo.addEventListener(state=>{
        setConnected(state.isConnected)
    })
    AppState.addEventListener("change", setAppState)
    return ()=>{netInfoCleanup(); AppState.removeEventListener('change', setAppState)}
  },[])
  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {

    function listenForGratitudes(user) {
        if(user.role!="guest"){

            const subs = [];
            subs.push(fetchApi.subscribeToMyGratitudes(user))
            userChannels.forEach(userChannel=>{
              subs.push(fetchApi.subscribeToBroadcastChannel(userChannel.channelId))
            })
            return ()=>{
              log.info(`unsubscribing to everything`)
              subs.forEach(sub=>sub())
            };
        }
    }
    //alert(`user changed: ${user.name}`)
    let cleanup = undefined;
    if(connected&&appState==="active")
        cleanup = listenForGratitudes(user)
    if(cleanup)
        return cleanup
  }, [user, connected, appState, userChannels])
}

