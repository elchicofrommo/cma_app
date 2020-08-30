const {Logger} = require( '@aws-amplify/core')
const {Auth} = require( '@aws-amplify/auth')
const {API} = require('@aws-amplify/api')
const config = require('../../aws-exports-test.js')



import api from '../../api/apiGateway'
import {store} from '../../redux/store'
import log from '../../util/Logging'
import {INITIAL_STATE, GUEST_USER, NEW_USER} from '../../redux/CombinedReducers'

const countedTestHOC = (toExecute)=>{
  var _testNum = 1;
  const _tt = (message, ...rest)=>{
      return toExecute(`EM${_testNum++} ${message}`, ...rest)
  }

  return  _tt;
}

const localStorage = {
  setItem: (key, value) => {
    store[key] = value;
  },
  getItem: key => {
    return store[key] || null;
  }
};

global.window = {
  localStorage
};

beforeAll(async ()=> { 
   //Logger.LOG_LEVEL = 'DEBUG';
    API.configure(config)
    log.setSilent(false);
    log.verbose(`configured with the following`, {env: process.env})
    log.setSilent(true);
   	return;
})




const mTest = countedTestHOC(test)
mTest('validing initial redux state', ()=>{

    const state = store.getState();
    log.verbose(``, {state})
    expect(state.general).toMatchObject(INITIAL_STATE)
})

let trackcount = 0;
let trackUrl = ""
mTest('getting soundcloud details', async()=>{
  const details = await api.getSoundCloudDetails();

  log.verbose('', {details})

  expect(details).toBeTruthy()
  expect(details).toHaveProperty("avatar")
  expect(details).toHaveProperty("trackCount")
  trackcount = details.trackCount;
})
mTest('getting soundcloud tracks', async ()=>{
  const tracks = await api.getSoundCloudTracks();


  expect(tracks).toBeTruthy()
  const entries = Object.entries(tracks)

  log.verbose(``, {track: entries[0][1]}); 

  expect(entries.length).toBeLessThanOrEqual(trackcount)

  let track = entries[Math.floor(Math.random() * trackcount) ][1];
  expect(track).toHaveProperty('trackUrl');
  expect(track).toHaveProperty('title');
  expect(track).toHaveProperty('duration')
  expect(track).toHaveProperty('description')

  trackUrl = track.trackUrl;

  track = entries[Math.floor(Math.random() * trackcount) ][1];
  expect(track).toHaveProperty('trackUrl');
  expect(track).toHaveProperty('title');
  expect(track).toHaveProperty('duration')
  expect(track).toHaveProperty('description')

  track = entries[Math.floor(Math.random() * trackcount) ][1];
  expect(track).toHaveProperty('trackUrl');
  expect(track).toHaveProperty('title');
  expect(track).toHaveProperty('duration')
  expect(track).toHaveProperty('description') 
})

mTest('getting the streaming url from a track url', async ()=>{
  const playableTrack = await api.getPlayableTrack(trackUrl)
  expect(playableTrack).toBeTruthy()
  expect(playableTrack).toMatch(/^https/)

  log.verbose('', {trackUrl, playableTrack})

})

mTest('test 0 distance should give no meetings', async()=>{
  const meetings = await api.getMeetings( 34.1005456,  -118.347567, 0)

  log.verbose('', {meetings})

  expect(meetings.data.length).toEqual(0)
})

let meetingIds= null
mTest('test 5 miles distance should give some meetings', async()=>{
  const meetings = await api.getMeetings( 34.1005456,  -118.347567, 5)

  log.verbose('', {meetings})

  expect(meetings.data.length).toBeGreaterThan(0)
  meetingIds = [meetings.data[0]._id, meetings.data[1]._id]
})

mTest('verify can get meetingDetails', async()=>{
  const temp = {...GUEST_USER}
  temp.meetingIds = meetingIds
  const meetingDetails = await api.getMeetingDetails(temp)
  expect(meetingDetails).toHaveLength(2)
  expect(meetingDetails[0].id).toBe(meetingIds[0])
  expect(meetingDetails[1].id).toBe(meetingIds[1])

  log.verbose('', {meetingDetails})
})


