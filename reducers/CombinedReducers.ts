import { combineReducers } from 'redux';
import NowPlaying from './NowPlayingReducer'

import { DataStore, Predicates } from "@aws-amplify/datastore";
import { Preferences, AuthDetail } from "../models/index";

import {AppState} from "../constants/AppState";


const INITIAL_STATE: AppState = {
  name: undefined,
  dos: undefined,
  meetings: [],
  meetingMap: new Map(),
  homegroup: undefined,
  gratitudeLists: [],
  screenName: undefined,
  authenticated: false,
  role: 'basic',
  soundCloudDetails: undefined,
  soundCloudTracks: undefined,
  paths: undefined,
  dailyReaders: undefined,
  readerDate: undefined,

  password: undefined,
  email: undefined,
  username: undefined,
};

function logState(state){
  console.log(`GR: state is:${JSON.stringify(state, null, 2)} \n`)
}
const generalReducer = (state = INITIAL_STATE , action: any) : AppState => {
  console.log(`in general reducer action observed:${action.type} \n`)
  let newState : AppState = {...state};

  switch (action.type) {
    case "AUTHENTICATE":
      newState.authenticated = true;
      return newState;
    case "SAVE_AUTH":

      newState.username = action.data
      newState.authenticated = true
      saveAuth(newState);
      return newState;
      
    case "AUTHORIZE":
      newState.role = action.data;
      return newState

    case "ADD_MEETING":
      const add = [...newState.meetings];
      add.push(action.data)
      newState.meetings = add;
      newState.meetingMap = new Map(newState.meetingMap);
      newState.meetingMap.set(action.data._id, action.data);
      //savePreferences(newState);
      return newState;
    
    case "REMOVE_MEETING":
      const remove = [...newState.meetings];
      console.log(`in before remove meeting size is ${remove.length}`)
      
     
      newState.meetings = remove.filter((entry)=> {
        console.log(`entry is ${entry._id}`)

        return entry._id != action.data._id;
      });
      console.log(`in after remove meeting size is ${newState.meetings.length}`)
      newState.meetingMap = new Map(newState.meetingMap);
      newState.meetingMap.delete(action.data._id)
      //savePreferences(newState);
      return newState;
      
    case "SIGN_OUT":
      newState = INITIAL_STATE;
      newState.dailyReaders = state.dailyReaders;
      newState.soundCloudDetails = state.soundCloudDetails;
      newState.soundCloudTracks = state.soundCloudTracks;
      resetDataStore();
      return newState;

    case "SAVE_PREFERENCES":
      savePreferences(state)
      return state;
    case "SYNC_PREFRENCES":
      return syncPrefWithDS(newState, action.data)
    
    case "SYNC_AUTH":
      return syncAuthWithDS(newState, action.data)

    case "NAME_CHANGE":
      newState.name = action.name;
      //logState(newState)
      return newState;
    case "PASSWORD_CHANGE":
        newState.password = action.data;
        //logState(newState)
        return newState;
    case "EMAIL_CHANGE":
      newState.email = action.data;
      return newState;
    case "SCREEN_NAME_CHANGE":
      newState.screenName = action.data;
      return newState;
    case "DOS_CHANGE":
      newState.dos = action.date;
     // logState(newState)
      return newState;
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
      newState.soundCloudDetails = action.data;
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

  console.log("Here in resetDataStore")
  const prefDelete = await DataStore.delete(Preferences, Predicates.ALL);
  const authDelete = await DataStore.delete(AuthDetail, Predicates.ALL);

  console.log(`result from save auth is ${JSON.stringify(prefDelete)} and ${JSON.stringify(authDelete)}`)
}

function syncPrefWithDS(state, datastore){
  state.screenName = datastore.screenName;
  state.dos = datastore.soberietyDate;
  state.name = datastore.name;
  state.meetings = datastore.meetings;
  console.log(`datastore pref synced ${JSON.stringify(state)}`)
  return state;
}

function syncAuthWithDS(state, datastore){
  state.email = datastore.email;
  state.password = datastore.password; 
  state.username = datastore.username;
  console.log(`datastore auth synced ${JSON.stringify(state)}`)
  return state;
}



async function saveAuth(state){

  console.log("Here in saveAuth")
  const original = await DataStore.query(AuthDetail);
  let auth = undefined;
  if(original.length>0){
    auth = AuthDetail.copyOf(original[0], updated => {
      updated.email= state.email, 
      updated.password= state.password,
      updated.username=state.username
    })
  }else{
    auth = new AuthDetail({
      email: state.email, 
      password: state.password,
      username: state.username
    })
  }

  const result = await DataStore.save(auth)
  console.log(`result from save auth is ${JSON.stringify(result)}`)
}



async function savePreferences(state){
  const original = await DataStore.query(Preferences);
  let pref = undefined;
  if(original.length>0){
    pref = Preferences.copyOf(original[0], updated => {
      updated.soberietyDate= state.dos, 
      updated.name= state.name, 
      updated.meetings= state.meetings
    })
  }else{
    pref = new Preferences({screenName: state.screenName, 
      soberietyDate: state.dos, 
      name: state.name, 
      meetings: state.meetings
    })
  }

  const result = await DataStore.save(pref)
  console.log(`result from save is ${JSON.stringify(result)}`)
}
export default combineReducers({
  general: generalReducer,
});