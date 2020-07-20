import { combineReducers } from 'redux';
import NowPlaying from './NowPlayingReducer'

import { DataStore, Predicates } from "@aws-amplify/datastore";
import { Preferences, AuthDetail} from "../models/index";

import {AppState} from "../constants/AppState";
import {User, Gratitude, Broadcast, Entry, Comment, Like} from '../types/gratitude'
import log from '../util/Logging'

const GUEST_USER = {
  role: "guest",
  name: "",
  shortId: "none",
  email: "",
  meetingIds: []
}

const INITIAL_STATE: AppState = {
  operatingUser: GUEST_USER, 
  gratitudes: [],
  broadcastsByChannel: new Map<string, Broadcast[]>(),
  ownedChannels: [],
  userChannels: [],
  meetings: [],
  homegroup: undefined,
  meetingDetail: undefined,
  showDetail: false,
  showEditor: false, 
  showMenu: true,
  soundCloudDetails: undefined,
  soundCloudTracks: undefined,
  paths: undefined,
  dailyReaders: undefined,
  readerDate: undefined,
  banner: undefined,
  soberietyFormat: 0,
  submenus: {},

};

function logState(state){
//  log.info(`GR: state is:${JSON.stringify(state, null, 2)} \n`)
}
const generalReducer = (state = INITIAL_STATE , action: any) : AppState => {
  log.info(`in general reducer action observed:${action.type}`)
  let newState : AppState = {...state};

  switch (action.type) {

    case "CREATE_CHANNEL":
      newState.ownedChannels = [...newState.ownedChannels]
      newState.ownedChannels.push(action.data.ownedChannel);
      newState.userChannels = [...newState.userChannels];
      newState.userChannels.push(action.data.subscribedChannel)
      let map: Map<string, Broadcast[]> = new Map(newState.broadcastsByChannel);
      map.set(action.data.ownedChannel.id, [])
      newState.broadcastsByChannel = map;
      return newState;
      break;

    case "SUBSCRIBE_CHANNEL": {
      log.info(`subscribe channel data is ${JSON.stringify(action.data)}`)
      newState.userChannels = [...newState.userChannels];
      newState.userChannels.push(action.data)
      let map: Map<string, Broadcast[]> = new Map(newState.broadcastsByChannel);
      map.set(action.data.channelId, [])
      newState.broadcastsByChannel = map;

      return newState;
      break;
    }
    case "SET_BANNER":
    //  log.info(`set banner data is `, {action})
      newState.banner = action.banner
    //  log.info(`banner is now  ${JSON.stringify(newState.banner)}`)
      return newState;
    case "SET_SOBERIETY_FORMAT":
      newState.soberietyFormat = action.data;
      return newState

      
    case "ADD_OWNED_CHANNEL": {
      const ownedChannels = [...newState.ownedChannels]
      ownedChannels.push(action.ownedChannel)
      const userChannels = [...newState.userChannels]
      userChannels.push(action.subscribedChannel);

      let map: Map<string, Broadcast[]> = new Map(newState.broadcastsByChannel);
      map.set(action.ownedChannel.id, [])
      newState.broadcastsByChannel = map;

      newState.ownedChannels = ownedChannels
      newState.userChannels = userChannels;
      return newState;
    }
    case "SAVE_AUTH":
      log.info(`SAVE_AUTH`,  {data: action.data})
      newState.email = action.data.email
      newState.password = action.data.password
      newState.operatingUser = action.data.operatingUser
      newState.gratitudes = action.data.gratitudes
      newState.ownedChannels = action.data.ownedChannels
      newState.userChannels = action.data.userChannels
      newState.broadcastsByChannel = action.data.broadcastsByChannel
      saveAuth(newState);
    //  log.info(`saved auth with the followign: ${JSON.stringify(action.data, null, 2)}`)
      return newState;

    case "UPDATE_OPERATING_USER":
      newState.operatingUser = action.data
      return newState;

    case "SET_DETAIL":
      const {toggle, ...meetingDetail} = action.meetingDetail;
      newState.meetingDetail = meetingDetail

      log.info('just returning new state but same objects')
      return newState;

      

    case "SHOW_DETAIL":
      log.info(`in show detail, old: ${state.showDetail}`)
      newState.showDetail = true
      return newState;
    case "HIDE_DETAIL":
      log.info(`in show detail, old: ${state.showDetail}`)
      newState.showDetail = false
      return newState;
    
    case "SHOW_EDITOR":
        log.info(`in show menu, old: ${state.showEditor}`)

        return newState;


    case "ADD_BROADCAST":{
      log.info(`adding BROADCAST, data is ${JSON.stringify(action.broadcast, null, 2)}`)
      if(action.broadcast.gratitude.userId === newState.operatingUser.id){
        log.info(`observed broadcast event for message I own, so throwing it away `)
        return state;
      }
      let map: Map<string, Broadcast[]> = new Map(newState.broadcastsByChannel);
      let broadcasts: Broadcast[] = map.get(action.broadcast.channelId);
      broadcasts.unshift(action.broadcast);
      map.set(action.broadcast.channelId, broadcasts)
      newState.broadcastsByChannel = map;
      return newState;
    }

    case "UPDATE_BROADCAST": {
      if(action.broadcast.ownerId === newState.operatingUser.id){
        log.info(`observed broadcast event for message I own, so throwing it away `)
        return state;
      }
      log.info(`adding BROADCAST, data is ${JSON.stringify(action.broadcast, null, 2)}`)
      let map: Map<string, Broadcast[]> = new Map(newState.broadcastsByChannel);
      let broadcasts: Broadcast[] = [...map.get(action.broadcast.channelId)];
      broadcasts = broadcasts.map(broadcast=>{
        return broadcast.id==action.broadcast.id ? action.broadcast: broadcast
      })
      map.set(action.broadcast.channelId, broadcasts)
      newState.broadcastsByChannel = map;
      return newState;
    }
    case "DELETE_BROADCAST": {
      if(action.broadcast.gratitude.userId === newState.operatingUser.id){
        log.info(`observed broadcast event for message I own, so throwing it away `)
        return state;
      }
      const map: Map<string, Broadcast[]> = new Map(newState.broadcastsByChannel);
      let broadcasts: Broadcast[] = map.get(action.broadcast.channelId);
      broadcasts = broadcasts.filter(broadcast=>broadcast.id!==action.broadcast.id)
      map.set(action.broadcast, broadcasts);
      return newState;
    }
      
/*
    case "DELETE_BROADCAST":
        const gratitudes = newState.gratitudes.filter(gratitude=>gratitude.id != action.gratitude.id)
        newState.gratitudes = gratitudes;
        return newState;
    case "UPDATE_BROADCAST":
        log.info(`updating BROADCAST is ${JSON.stringify(action.gratitude, null, 2)}`)
        let updateGratitudes: Gratitude[] = [...newState.gratitudes];
        updateGratitudes = newState.gratitudes.filter(gratitude=>gratitude.id != action.gratitude.id)
        updateGratitudes.unshift(action.gratitude)
        newState.gratitudes = updateGratitudes;
        return newState;
*/
    case "ADD_GRATITUDE":
      log.info(`adding gratitude, data is ${JSON.stringify(action.gratitude, null, 2)}`)
      const addGratList: Gratitude[] = [...newState.gratitudes];
  
      addGratList.unshift(action.gratitude)
      newState.gratitudes = addGratList;
      return newState;

    case "DELETE_GRATITUDE":
        const gratitudes = newState.gratitudes.filter(gratitude=>gratitude.id != action.gratitude.id)
        newState.gratitudes = gratitudes;
        return newState;
    case "UPDATE_GRATITUDE":
        log.info(`updating gratitude is ${JSON.stringify(action.gratitude, null, 2)}`)
        let updateGratitudes: Gratitude[] = [...newState.gratitudes];
        updateGratitudes = newState.gratitudes.filter(gratitude=>gratitude.id != action.gratitude.id)
        updateGratitudes.unshift(action.gratitude)
        newState.gratitudes = updateGratitudes;
        return newState;

    case "HIDE_EDITOR":
      log.info(`in show detail, old: ${state.showEditor}`)

      return newState;
    
    case "SHOW_MENU":
        log.info(`in show menu, old: ${state.showMenu}`)
        newState.showMenu = true
        return newState;
    
    case "HIDE_MENU":
      log.info(`in hide menu, old: ${state.showMenu}`)
      newState.showMenu = false
      return newState;

    case "REGISTER_SUBMENU":
      newState.submenus = {...newState.submenus}
      newState.submenus[action.data.name] = action.data.submenu;
      return newState;

    case "ADD_MEETING":
      const add = [...newState.meetings];
      add.push(action.data)
      newState.meetings = add;
      
      const addClone: User = {...newState.operatingUser}
      addClone.meetingIds = action.meetingIds
      newState.operatingUser = addClone

      return newState;
    
    case "REMOVE_MEETING":
      const remove = [...newState.meetings];

      newState.meetings = remove.filter((entry)=> {

        return entry.id != action.data.id;
      });

      let removeClone = {...newState.operatingUser}
      removeClone.meetingIds = action.meetingIds
      newState.operatingUser = removeClone
      return newState;
      
    case "SIGN_OUT":
      newState = INITIAL_STATE;
      newState.dailyReaders = state.dailyReaders;
      newState.soundCloudDetails = state.soundCloudDetails;
      newState.soundCloudTracks = state.soundCloudTracks;
      newState.paths = state.paths;
      saveAuth(newState)
      return newState;


    case "SAVE_MEETINGS":
        saveMeetings(state)
        return state;
    case "SYNC_PREFRENCES":
      return syncPrefWithDS(newState, action.data)
    
    case "SYNC_AUTH":
      return syncAuthWithDS(newState, action.data)

    case "SYNC_MEETINGS":
      return syncMeetings(newState, action.data)

    case "SYNC_GRATITUDE":
      return syncGratitudeWithDS(newState, action.data )


    case "NETWORK_DATA":
      newState.paths = action.data;
     // logState(newState)
      return newState;
    case "DAILY_READERS":
      newState.dailyReaders = action.data;
     // logState(newState)
      return newState;
    case "READER_DATE":
      newState.readerDate = action.data;
      return newState;
    case "SOUNDCLOUD_DETAILS":
      newState.soundCloudDetails = action.data ;
      return newState;
    case "SOUNDCLOUD_TRACKS":
      newState.soundCloudTracks = action.data;
      //logState(newState.soundCloudTracks)
      return newState;
    default:
      return state;

  }
};


async function resetDataStore(){

 // log.info("Here in resetDataStore")
  const prefDelete = await DataStore.clear()

  
}

function syncGratitudeWithDS(state, gratitudes: Gratitude[]){
  const list = new Array<Gratitude>();
  /*gratitudes.forEach((gratitude)=>{
    log.info(`syncing with DS, ${JSON.stringify(gratitude)} start by pulling out entries and comments`)

    const entries = new Array<GratitudeEntry>()


    const grat = <Gratitude> {
      title: gratitude.title,
      date: new Date(gratitude.time),
      id: gratitude.id,
      entries: gratitude.entries
    }
    list.push(grat)
  }) */
  state.gratitude = gratitudes

 // log.info(`finished syncing gratitude, here are the results: ${JSON.stringify(gratitudes, null, 2)}`)
  return state;
}

function syncPrefWithDS(state, datastore){
  state.dos = datastore.soberietyDate;
  state.name = datastore.name;

  return state;
}

function syncMeetings(state, meetingList){

  state.meetings = meetingList;
  //log.info(` datastore `, {datastore})
  return state;
}

function syncAuthWithDS(state, datastore){
  state.email = datastore.email;
  state.password = datastore.password; 
  state.username = datastore.username;
 // log.info(`datastore auth synced `, {state})
  return state;
}



async function saveAuth(state){

 // log.info("Here in saveAuth")
  const original = await DataStore.query(AuthDetail);
  let auth = undefined;
  if(original.length>0){
    auth = AuthDetail.copyOf(original[0], updated => {
      updated.email= state.email, 
      updated.password= state.password

    })
  }else{
    auth = new AuthDetail({
      email: state.email, 
      password: state.password,
    })
  }

  const result = await DataStore.save(auth)
 // log.info(`result from save auth is `, {result})
}




async function saveMeetings(state){
  log.info("saving meetings")
  const original = await DataStore.query(Meetings);

  let data = undefined;
  const newMeetings = [];
  // log.info("saving preferences 2")
   state.meetings.forEach((entry)=>{newMeetings.push(JSON.stringify(entry))})
   
  try{
    if(original.length>0){
    //  log.info("saving preferences 3.1")
      data = Meetings.copyOf(original[0], updated => {
        updated.email = state.email,
        updated.meetings = newMeetings
      })
    }else{
   //   log.info("saving preferences 3.2")
      data = new Meetings({
        email: state.email,
        meetings: newMeetings
      })
    }
 //   log.info("saving preferences 4")
    const result = await DataStore.save(data)
 //   log.info(`result from save is ${result}`)
  }catch(err){

    log.info(`could not save meetings for ${err}`)
  }
}


export default combineReducers({
  general: generalReducer,
});