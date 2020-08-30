const {Logger} = require( '@aws-amplify/core')
const {Auth} = require( '@aws-amplify/auth')
const {API} = require('@aws-amplify/api')
const config = require('../aws-exports-test.js')

import fetchCircles from '../api/query'
import mutateCircles from '../api/mutate'

import api from '../api/apiGateway'

import {store} from '../redux/store'
import {authorize, getUserDetails, signIn, signOut, signUp, Role} from '../util/auth' 
import log from '../util/Logging'
import {INITIAL_STATE, GUEST_USER, NEW_USER} from '../redux/CombinedReducers'
import { ViewPagerAndroidBase } from 'react-native'

const localStore = []
const localStorage = {
  setItem: (key, value) => {
    localStore[key] = value;
  },
  getItem: key => {
    return localStore[key] || null;
  }
};

global.window = {
  localStorage
};


const adminUserEmail = 'cmasuperuser79821@gmail.com'
const adminUserPassword = '4Yellow*dishwasher'
const password = "N3wst@rt"
const user1 = "testuser1"
const user2 = 'testuser2'
const user3 = 'testuser3'
const emailDomain = "@nowhere.com"

beforeAll(async ()=> { 
    Logger.LOG_LEVEL = 'DEBUG';
    const result = Auth.configure(config)
    API.configure(config)
    log.setSilent(false);
    log.verbose(`configured with the following`, {config, result, env: process.env})
    const currentCreds = await Auth.currentCredentials(); 

    log.verbose(`before all the auth result is`, {currentCreds})

 //   log.setSilent(true);
   	return;
})
const  tt = (message)=>{
  var _testNum = 1;
  const _tt = (message)=>{
      return `EM${_testNum++} ${message}`
  }
  return _tt(message)
}


it(tt('validing initial redux state'), ()=>{

    const state = store.getState();
    log.verbose(``, {state})

    expect(state.general).toMatchObject(INITIAL_STATE)
})



it(tt('creating user'), async ()=>{
  const createdUser1 = await mutateCircles.createUser({
    email: `${user1}${emailDomain}`,
    name: `${user1}`,
    id: `${user1}`, 
    shareDos: false
  })

  log.verbose(`created user`, {createdUser1})
})


test(tt('testing GUEST user'), async ()=>{
    log.setSilent(false)
    const result = await authorize();
    expect(result.role).toBe(Role.GUEST)
    expect(result.email).toBeUndefined()
    expect(result.error).toBe("not authenticated")
    expect(result.userName).toBeUndefined()
})
/*
test(tt('creating a new user - success'), async()=>{
    log.setSilent(false);
    const result1 = await signUp(`${user1}${emailDomain}`, password,  user1)
    
    log.verbose(``, {result1})
   // log.setSilent(true)
    const result2 = await signUp(`${user2}${emailDomain}`, password,  user2)
   // log.setSilent(false);
    log.verbose(``, {result2})
   // log.setSilent(true)
    const result3 = await signUp(`${user3}${emailDomain}`, password,  user3)
   // log.setSilent(false);
    log.verbose(``, {result3})
  //  log.setSilent(true)

    expect(true).toBe(true)
}) */