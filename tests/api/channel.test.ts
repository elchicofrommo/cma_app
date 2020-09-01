import { API, graphqlOperation as gql } from "@aws-amplify/api";
const { Logger } = require('@aws-amplify/core')
const config = require('../../aws-exports-test.js')
import { User, Post, Like, Comment, Channel, ChannelMember } from '../../types/circles.'
import mutateCircles from '../../api/mutate'
import fetchCircles from '../../api/query'
import fetchAllCircles from '../../api/queryAll'
import { createTestUsers } from '../utils'
import log from '../../util/Logging'


const countedTestHOC = (toExecute) => {
    var _testNum = 1;
    const _tt = (message, ...rest) => {
        return toExecute(`CIRCLE TESTS ${_testNum++}: ${message}`, ...rest)
    }

    return _tt;
}
const mTest = countedTestHOC(test)
const store = []
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

function generateAllCharsString() {
    const chars = []
    for (let i = 0; i < 1024; i++) {
        chars.push(String.fromCharCode(i))
    }
    return chars.join()
}


let users = new Array<User>()
let userPosts: Post[][] = []
let channels: Channel[] = []
let memberships: ChannelMember[] = []
let staticMessage = ""

beforeAll(async () => {
    //Logger.LOG_LEVEL = 'DEBUG';
    API.configure(config)
    log.setSilent(true)
    users = await createTestUsers(3)

    log.verbose(`configured with the following`, { users })
    expect(users).toHaveLength(3)
    staticMessage = generateAllCharsString();
    return;
})

beforeEach(()=>{
    log.setSilent(true)
})

describe("This test suite is for channels", () => {
    mTest("creating channel user 1", async () => {
        let name = `channel1-${users[0].name}`
        let result = await mutateCircles.createChannel(users[0], name)
        validateNewChannel(result.channel, users[0])
        validateNewMembership(result.membership, users[0], result.channel)
        channels.push(result.channel)
        memberships.push(result.membership)
    })

    mTest("creating channel user 2", async () => {
        let name = `channel1-${users[1].name}`
        let result = await mutateCircles.createChannel(users[1], name)
        validateNewChannel(result.channel, users[1])
        validateNewMembership(result.membership, users[1], result.channel)
        channels.push(result.channel)
        memberships.push(result.membership)
    })

    mTest("creating channel user 1", async () => {
        let name = `channel2-${users[0].name}`
        let result = await mutateCircles.createChannel(users[0], name)
        expect(result.channel.name).toBe(name);
        result.channel.name = `channel1-${users[0].name}`
        validateNewChannel(result.channel, users[0])
        result.channel.name = name;
        validateNewMembership(result.membership, users[0], result.channel)

        channels.push(result.channel)
        memberships.push(result.membership)
    })

    mTest("unsubscribe a channel owner should fail", async () => {

        try{
            async ()=>{await mutateCircles.unsubscribeToChannel(users[0], channels[2])}
        }catch(err){
            expect(err.error).toBe("You cannot unsubscribe while being an owner. ")
        }
    })

    mTest("subscribe to channel happy path", async()=>{
        let result = await mutateCircles.subscribeToChannel(users[1], channels[0].id)
        validateNewMembership(result, users[1], channels[0]);
        expect(result.channel.id).toBe(channels[0].id)
        memberships.push(result);

        result = await mutateCircles.subscribeToChannel(users[2], channels[0].id)
        validateNewMembership(result, users[2], channels[0])
        expect(result.channel.id).toBe(channels[0].id)
        memberships.push(result)

        result = await mutateCircles.subscribeToChannel(users[2], channels[1].id)
        expect(result.channel.id).toBe(channels[1].id)
        validateNewMembership(result, users[2], channels[1])
        memberships.push(result)
    })

    mTest("try to subscribe to channel user owns", async()=>{
        let result = await mutateCircles.subscribeToChannel(users[0], channels[0].id)
        let origianlOwners = channels[0].ownerIds.join("")
        let newOwners = result.channel.ownerIds.join("")
        expect(origianlOwners).toBe(newOwners)
        expect(result.createdAt).not.toBe(memberships[0].createdAt)
        validateNewMembership(result, users[0], channels[0])
        memberships[0] = result
        log.verbose(`subscribe to my own channel`, {original: memberships[0], result, user: users[0], channel: channels[0]})  
    })

    mTest("subscribe to channel user already subscribed to", async()=>{
        let result = await mutateCircles.subscribeToChannel(users[1], channels[0].id)
        let origianlOwners = channels[0].ownerIds.join("")
        let newOwners = result.channel.ownerIds.join("")
        expect(origianlOwners).toBe(newOwners)
        expect(result.createdAt).not.toBe(memberships[0].createdAt)
        validateNewMembership(result, users[1], channels[0])
        memberships[0] = result
        log.verbose(`subscribe to my own channel`, {original: memberships[0], result, user: users[1], channel: channels[0]}) 
    })

    mTest("unsubscribe happy path", async()=>{

        let result = await mutateCircles.unsubscribeToChannel(users[1], channels[0])
        validateNewMembership(result, users[1], channels[0])
        const temp = memberships.length
        memberships.splice(1, 1)
        expect(memberships).toHaveLength(temp-1)
    })

    mTest("validate final state of channels and memberships", async()=>{
        let storedChannels = await fetchAllCircles.fetchAllChannels();
        let storedMemberships = await fetchAllCircles.fetchAllChannelMembers();

        expect(storedChannels).toHaveLength(channels.length)
        expect(storedMemberships).toHaveLength(memberships.length)
        expect(storedChannels[0].ownerIds).toHaveLength(1)
        expect(storedChannels[1].ownerIds).toHaveLength(1)
        expect(storedChannels[2].ownerIds).toHaveLength(1)
        for(let i=0;i< storedChannels.length;i++){
            if(storedChannels[i].name === `channel1-${users[0].name}`){
                expect(storedChannels[i].ownerIds).toContain(users[0].id)
            }else if(storedChannels[i].name === `channel1-${users[1].name}`){
                expect(storedChannels[i].ownerIds).toContain(users[1].id)
            }else{
                expect(storedChannels[i].ownerIds).toContain(users[0].id)
            }
        }

        let user1 = await fetchCircles.fetchUser(users[0].id)
        let user2 = await fetchCircles.fetchUser(users[1].id)
        let user3 = await fetchCircles.fetchUser(users[2].id)
        expect(user1.channels.items).toHaveLength(2)
        expect(user2.channels.items).toHaveLength(1)
        expect(user3.channels.items).toHaveLength(2)
        users[0] = user1
        users[1] = user2
        users[2] = user3
    })
})

const testMessage = "I am here for it"
describe("testsing Broadcast functions ", ()=>{
    mTest("validate create broadcasts and the return object ", async()=>{
        let p1 = await mutateCircles.createPost(users[0], `${testMessage} ${users[0].name} 1`) as Post
        let r1 = await mutateCircles.createBroadcast(p1, channels[0], users[0])
        expect(r1.ownerId).toBe(users[0].id)
        expect(r1.channelId).toBe(channels[0].id)
        expect(r1.post.content).toBe(`${testMessage} ${users[0].name} 1`)

        let p2 = await mutateCircles.createPost(users[2], `${testMessage} ${users[2].name} 1`) as Post
        let r2 = await mutateCircles.createBroadcast(p2, channels[0], users[2])
        expect(r2.ownerId).toBe(users[2].id)
        expect(r2.channelId).toBe(channels[0].id)
        expect(r2.post.content).toBe(`${testMessage} ${users[2].name} 1`)

        let p3 = await mutateCircles.createPost(users[2], `${testMessage} ${users[2].name} 2`) as Post
        let r3 = await mutateCircles.createBroadcast(p3, channels[1], users[2])
        expect(r3.ownerId).toBe(users[2].id)
        expect(r3.channelId).toBe(channels[1].id)
        expect(r3.post.content).toBe(`${testMessage} ${users[2].name} 2`)

        let p4 = await mutateCircles.createPost(users[2], `${testMessage} ${users[2].name} 3`) as Post
        let r4 = await mutateCircles.createBroadcast(p4, channels[1], users[2])
        expect(r4.ownerId).toBe(users[2].id)
        expect(r4.channelId).toBe(channels[1].id)
        expect(r4.post.content).toBe(`${testMessage} ${users[2].name} 3`)

        let p5 = await mutateCircles.createPost(users[0], `${testMessage} ${users[0].name} 2`) as Post
        let r5 = await mutateCircles.createBroadcast(p5, channels[0], users[0])
        expect(r5.ownerId).toBe(users[0].id)
        expect(r5.channelId).toBe(channels[0].id)
        expect(r5.post.content).toBe(`${testMessage} ${users[0].name} 2`)

        let p6 = await mutateCircles.createPost(users[0], `${testMessage} ${users[0].name} 3`) as Post
        let r6 = await mutateCircles.createBroadcast(p6, channels[2], users[0])
        expect(r6.ownerId).toBe(users[0].id)
        expect(r6.channelId).toBe(channels[2].id)
        expect(r6.post.content).toBe(`${testMessage} ${users[0].name} 3`)


    })

    mTest("valdiating fetchBroadcastPost pulls the right data for each user", async()=>{

        let u1b = await fetchCircles.fetchBroadcastPost(users[0])
        let u2b = await fetchCircles.fetchBroadcastPost(users[1])
        let u3b = await fetchCircles.fetchBroadcastPost(users[2])

        expect(u1b.size).toBe(2)
        expect(u2b.size).toBe(1)
        expect(u3b.size).toBe(2)

        expect(u3b.get(channels[0].id)).toHaveLength(3)
        expect(u1b.get(channels[0].id)).toHaveLength(3)
        
        expect(u1b.get(channels[0].id)[0].post.content).toBe(`${testMessage} ${users[0].name} 1`)
        expect(u3b.get(channels[0].id)[0].post.content).toBe(`${testMessage} ${users[0].name} 1`)
        expect(u1b.get(channels[0].id)[1].post.content).toBe(`${testMessage} ${users[2].name} 1`)
        expect(u3b.get(channels[0].id)[1].post.content).toBe(`${testMessage} ${users[2].name} 1`)
        expect(u1b.get(channels[0].id)[2].post.content).toBe(`${testMessage} ${users[0].name} 2`)
        expect(u3b.get(channels[0].id)[2].post.content).toBe(`${testMessage} ${users[0].name} 2`)

        expect(u2b.get(channels[1].id)).toHaveLength(2)
        expect(u3b.get(channels[1].id)).toHaveLength(2)
        expect(u2b.get(channels[1].id)[0].post.content).toBe(`${testMessage} ${users[2].name} 2`)
        expect(u3b.get(channels[1].id)[0].post.content).toBe(`${testMessage} ${users[2].name} 2`)
        expect(u2b.get(channels[1].id)[1].post.content).toBe(`${testMessage} ${users[2].name} 3`)
        expect(u3b.get(channels[1].id)[1].post.content).toBe(`${testMessage} ${users[2].name} 3`)

        expect(u1b.get(channels[2].id)).toHaveLength(1)
        expect(u1b.get(channels[2].id)[0].post.content).toBe(`${testMessage} ${users[0].name} 2`)
    })
})

function validateNewChannel(channel: Channel, user: User) {
    expect(channel).toBeTruthy()
    expect(channel.id).toBeTruthy();
    expect(channel.createdAt).toBe(channel.updatedAt)
    expect(channel.ownerIds).toHaveLength(1)
    expect(channel.ownerIds[0]).toBe(user.id)
    expect(channel.name).toBe(`channel1-${user.name}`);
}

function validateNewMembership(membership: ChannelMember, user: User, channel: Channel) {
    expect(membership).toBeTruthy();
    expect(membership.createdAt).toBe(membership.updatedAt)
    expect(membership.userId).toBe(user.id)
    expect(membership.channelId).toBe(channel.id)
}
afterAll(async () => {

    await cleanUp()

})

async function cleanUp() {

    const work = []

    const likes = await fetchAllCircles.fetchAllLikes();
    likes.forEach((like: Like) => {

        work.push(mutateCircles.deleteLike(like.postId, like.userId))
    })



    const comments = await fetchAllCircles.fetchAllComments();
    comments.forEach((comment: Comment) => {

        work.push(mutateCircles.deleteComment(comment.postId, comment.createdAt))
    })

    const posts = await fetchAllCircles.fetchAllPosts();

    posts.forEach((post: Post) => {
        work.push(mutateCircles.deletePost(post))
    })

    const channelMembers = await fetchAllCircles.fetchAllChannelMembers();
    channelMembers.forEach((member: ChannelMember) => {
        work.push(mutateCircles.deleteChannelMember({ userId: member.userId, channelId: member.channelId }))
    })

    const channels = await fetchAllCircles.fetchAllChannels();
    channels.forEach((channel: Channel) => {
        work.push(mutateCircles.deleteChannel(channel.id))
    })

    const users = await fetchAllCircles.fetchAllUsers();
    users.forEach((user: User) => {
        work.push(mutateCircles.deleteUser({ id: user.id }))
    })



    await Promise.all(work)
}