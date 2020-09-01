const { Logger } = require('@aws-amplify/core')
const { Auth } = require('@aws-amplify/auth')
const { API } = require('@aws-amplify/api')
const config = require('../../aws-exports-test.js')



import shortid from 'shortid'
import { User, Post, Broadcast, Channel, ChannelMember, Meeting, NestedArray } from '../../types/circles.'
import mutateCircles from '../../api/mutate'
import fetchCircles from '../../api/query'
import { store } from '../../redux/store'
import log from '../../util/Logging'
import { INITIAL_STATE, GUEST_USER, NEW_USER } from '../../redux/CombinedReducers'
import {destroyTestUsers, createTestUsers, createUserInput} from '../utils'

const countedTestHOC = (toExecute) => {
  var _testNum = 1;
  const _tt = (message, ...rest) => {
    return toExecute(`MUTATE ${_testNum++}: ${message}`, ...rest)
  }

  return _tt;
}
const mTest = countedTestHOC(test)
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


const user1 = "testuser1"
const user2 = 'testuser2'
const user3 = 'testuser3'
const emailDomain = "@nowhere.com"


const operatingUsers = new Array<User>()

beforeAll(async () => {
  //Logger.LOG_LEVEL = 'DEBUG';
  API.configure(config)
  log.setSilent(false)
  log.verbose(`configured with the following`, { env: process.env })

  return;
})

beforeEach(()=>{
  log.setSilent(true)
})


describe("tests for createUser", () => {

  mTest('creating user1', async () => {

    const data = await mutateCircles.createUser(createUserInput(user1))
    log.verbose(``, { data })
    validateUserResponse(user1, data)

  })
  mTest('creating user2', async () => {

    const data = await mutateCircles.createUser(createUserInput(user2))
    log.verbose(``, { data })
    validateUserResponse(user2, data)

  })
  mTest('creating user3', async () => {

    const data = await mutateCircles.createUser(createUserInput(user3))
    log.verbose(``, { data })
    validateUserResponse(user3, data)

  })
})

describe("tests for fetchOperatingUser: new users", () => {
  mTest('fetchOperatingUser for user1', async () => {
    const user:User = await fetchCircles.fetchUser(user1) as User;
    log.setSilent(false)
    log.verbose('data from fetch user 1', user)
    validateUserResponse(user1, user)
    log.setSilent(true)
    operatingUsers.push(user)
  })
  mTest('fetchOperatingUser for user2', async () => {
    const user:User = await fetchCircles.fetchUser(user2);

    log.verbose('data from fetch user 2', user)
    validateUserResponse(user2, user)
    operatingUsers.push(user)
  })
  mTest('fetchOperatingUser for user3', async () => {

    const user:User = await fetchCircles.fetchUser(user3);

    log.verbose('data from fetch user 3', user)
    validateUserResponse(user3, user)
    operatingUsers.push(user)

  })

})

describe("tests for updating user",  ()=>{
  
  mTest("isolated change, only name and updated at should be updated", async ()=>{
    const opu = operatingUsers[0];
    const result = await mutateCircles.updateUser({id: opu.id, name: "testchange"})
    expect(result.name).toBe("testchange");
    expect(result.createdAt).toBe(opu.createdAt)
    expect(result.updatedAt).not.toBe(opu.updatedAt);
    result.name = user1;
    validateUserResponse(user1, result);
    const tempOpu = await fetchCircles.fetchUser(opu.id)
    expect(tempOpu.name).toBe("testchange");
    expect(tempOpu.updatedAt).not.toBe(opu.updatedAt);
    tempOpu.name = user1;
    validateUserResponse(user1, tempOpu)
    const finalResult = await mutateCircles.updateUser({id: opu.id, name: opu.name});
    expect(finalResult.name).toBe(opu.name)
  })

  mTest("saving meeting ids ... ", async ()=>{


    const opu = operatingUsers[0];
    log.verbose('saving meeting user', {opu})
    const result = await mutateCircles.updateUser({id: opu.id, meetingIds: ['meeting1', 'meeting2', 'meeting3']})
    log.verbose("modify meetings", {result})
    expect(result.meetingIds).toHaveLength(3);
    expect(result.meetingIds[0]).toBe("meeting1")
    expect(result.meetingIds[2]).toBe("meeting3")

    operatingUsers[0] = opu
  })
  
})


describe("tests for deleting user", () => {
  mTest('deleting user1', async () => {

    const data = await mutateCircles.deleteUser({ id: user1 })
    validateUserResponse(user1, data)

  })
  mTest('deleting user2', async () => {

    const data = await mutateCircles.deleteUser({ id: user2 })
    validateUserResponse(user2, data)

  })
  mTest('deleting user3', async () => {

    const data = await mutateCircles.deleteUser({ id: user3 })
    validateUserResponse(user3, data)

  })
})


function validateUserResponse(user: string, data:User) {
  expect(data.id).toBe(user)
  expect(data.shortId).toBeTruthy();
  expect(data.name).toBe(user);
  expect(data.email).toBe(`${user}${emailDomain}`)
  expect(data.dos).toBeTruthy();
  expect(data.role).toBe("basic");
  expect(data.shareDos).toBe(false);
  expect(data.createdAt).toBeTruthy();
  expect(data.updatedAt).toBeTruthy()
  expect(data.channels.items).toHaveLength(0)
  expect(data.posts.items).toHaveLength(0)
}