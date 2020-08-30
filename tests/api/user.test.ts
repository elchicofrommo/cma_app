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
import {OperatingUser, destroyTestUsers, createTestUsers, createUserInput} from '../utils'

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


const operatingUsers = new Array<OperatingUser>()

beforeAll(async () => {
  //Logger.LOG_LEVEL = 'DEBUG';
  API.configure(config)
  log.setSilent(false)
  log.verbose(`configured with the following`, { env: process.env })

  return;
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
/*
describe("tests for fetchOperatingUser: new users", () => {
  mTest('fetchOperatingUser for user1', async () => {
    const opu:OperatingUser = await fetchCircles.fetchOperatingUser(user1);

    log.verbose('data from fetch user 1', opu)
    validateUserResponse(user1, opu.user)
    expect(opu.channels).toHaveLength(0);
    expect(opu.posts).toHaveLength(0);
    expect(opu.channelMembers).toHaveLength(0)
    operatingUsers.push(opu)
  })
  mTest('fetchOperatingUser for user2', async () => {
    const opu:OperatingUser = await fetchCircles.fetchOperatingUser(user2);

    log.verbose('data from fetch user 2', opu)
    validateUserResponse(user2, opu.user)
    expect(opu.channels).toHaveLength(0);
    expect(opu.posts).toHaveLength(0);
    expect(opu.channelMembers).toHaveLength(0)
    operatingUsers.push(opu)
  })
  mTest('fetchOperatingUser for user3', async () => {

    const opu:OperatingUser = await fetchCircles.fetchOperatingUser(user3);

    log.verbose('data from fetch user 3', opu)
    validateUserResponse(user3, opu.user)
    expect(opu.channels).toHaveLength(0);
    expect(opu.posts).toHaveLength(0);
    expect(opu.channelMembers).toHaveLength(0)
    operatingUsers.push(opu)

  })

})

describe("tests for updating user",  ()=>{
  
  mTest("isolated change, only name and updated at should be updated", async ()=>{
    const opu = operatingUsers[0];
    const result = await mutateCircles.updateUser({id: opu.user.id, name: "testchange"})
    expect(result.name).toBe("testchange");
    expect(result.createdAt).toBe(opu.user.createdAt)
    expect(result.updatedAt).not.toBe(opu.user.updatedAt);
    result.name = user1;
    validateUserResponse(user1, result);
    const tempOpu = await fetchCircles.fetchOperatingUser(opu.user.id)
    expect(tempOpu.user.name).toBe("testchange");
    expect(tempOpu.user.updatedAt).not.toBe(opu.user.updatedAt);
    tempOpu.user.name = user1;
    validateUserResponse(user1, tempOpu.user)
    const finalResult = await mutateCircles.updateUser({id: opu.user.id, name: opu.user.name});
    expect(finalResult.name).toBe(opu.user.name)
  })

  mTest("saving meeting ids ... ", async ()=>{

    const opu = operatingUsers[0]
    const result = await mutateCircles.updateUser({id: opu.user.id, meetingIds: ['meeting1', 'meeting2', 'meeting3']})
    log.verbose("modify meetings", {result})
    expect(result.meetingIds).toHaveLength(3);
    expect(result.meetingIds[0]).toBe("meeting1")
    expect(result.meetingIds[2]).toBe("meeting3")
    opu.user = result;
    operatingUsers[0] = opu
  })
  
})

/*
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
*/

function validateUserResponse(user, data) {
  expect(data.id).toBe(user)
  expect(data.shortId).toBeTruthy();
  expect(data.name).toBe(user);
  expect(data.email).toBe(`${user}${emailDomain}`)
  expect(data.dos).toBeTruthy();
  expect(data.role).toBe("basic");
  expect(data.shareDos).toBe(false);
  expect(data.createdAt).toBeTruthy();
  expect(data.updatedAt).toBeTruthy()
}