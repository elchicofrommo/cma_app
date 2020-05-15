import { combineReducers } from 'redux';
import NowPlaying from './NowPlayingReducer'

const INITIAL_STATE = {
  name: undefined,
  dos: undefined,
  meetings: [],
  homegroup: undefined,
  gratitudeLists: []
};

function logState(state){
  console.log(`GR: state is:${JSON.stringify(state, null, 2)} \n`)
}
const generalReducer = (state = INITIAL_STATE, action) => {
  console.log(`in general reducer action observed:${action.type} \n`)
  let newState = {...state};

  switch (action.type) {
    case "NAME_CHANGE":
      newState.name = action.name;
      //logState(newState)
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
      newState.soundcloudDetails = action.data;
      return newState;
    case "SOUNDCLOUD_TRACKS":
      newState.soundcloudTracks = action.data;
      return newState;
    default:
      return state;

  }
};

export default combineReducers({
  general: generalReducer,
});