
import * as React from 'react';

import { User,  ChannelMember } from '../types/circles.'

import subApi from '../api/subscription'
import { shallowEqual, useSelector  } from 'react-redux';
import NetInfo from '@react-native-community/netinfo';
import { AppState } from 'react-native';
import log from '../util/Logging'

export default function useSubscriptions() {

  const user : User = useSelector  (state=>state.general.operatingUser, shallowEqual ) 
  const channelMembers: ChannelMember[] = useSelector( state=>state.general.channelMembers, shallowEqual)
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

    function listenForPosts(user) {
        if(user && user.role!="guest"){

            const subs = [];
            subs.push(subApi.subscribeToMyPosts(user))
            channelMembers.forEach(channelMember=>{
              subs.push(subApi.subscribeToBroadcastChannel(channelMember.channelId))
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
        cleanup = listenForPosts(user)
    if(cleanup)
        return cleanup
  }, [user, connected, appState, channelMembers])
}

