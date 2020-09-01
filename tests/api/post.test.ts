import { API, graphqlOperation as gql } from "@aws-amplify/api";
const { Logger } = require('@aws-amplify/core')
const config = require('../../aws-exports-test.js')




import { User, Post, Broadcast, Channel, ChannelMember, Meeting, NestedArray, Like, Comment } from '../../types/circles.'
import mutateCircles from '../../api/mutate'
import fetchCircles from '../../api/query'
import fetchAllCircles from '../../api/queryAll'
import subscribeCircles from '../../api/subscription'


import { OperatingUser, destroyTestUsers, createTestUsers } from '../utils'

import log from '../../util/Logging'
import mutate from "../../api/mutate";
import { faDiceOne } from "@fortawesome/free-solid-svg-icons";
import { getOperatingUser } from "../../graphql/queries";


const countedTestHOC = (toExecute) => {
  var _testNum = 1;
  const _tt = (message, ...rest) => {
    return toExecute(`POST TESTS ${_testNum++}: ${message}`, ...rest)
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
const postTestFunctions = [];
let currentTest = 0;
let maxTest = 1
let stopPostSub = null

describe("Tests centered on creation, updating (via like/comment), query for and deleting of posts", () => {
  /*mTest("subscription for my posts, tests observable output from following tests in this group.", async ()=>{
    let resolver = null;
    const complete = new Promise((resolve)=>{
      resolver = resolve
    })

    function postTester(event){
      log.setSilent(false);
      log.verbose("in postTester...", {event})
      log.setSilent(true);
      let post = undefined;
      
      if(currentTest++ < maxTest){
        const fn = postTestFunctions.shift()
        fn(event)
      }else{
        resolver()
      }
      
    }
    
    stopPostSub = subscribeCircles.subscribeToMyPosts(users[0], postTester)
    await complete
  }) 
  */
  mTest("creating post for user 1", async () => {

    // start by making the function for testing the subscription
    postTestFunctions.push((event) => {
      expect(event).toBeTruthy();
      const post = event.value.data.subscribeToMyPosts;
      log.setSilent(false);
      log.verbose('recieved post subscription event: ', { post })
      log.setSilent(true);
    })

    const post1 = await mutateCircles.createPost(users[0], staticMessage) as Post;
    const posts: Post[] = [];
    posts.push(post1);
    stopPostSub && stopPostSub();
    log.setSilent(true)


    log.verbose(`created post response`, { post1 })
    validateNewPost(users[0], post1, staticMessage)


    const post2 = await mutateCircles.createPost(users[0], staticMessage) as Post;
    posts.push(post2);
    log.verbose(`created post response`, { post2 })
    validateNewPost(users[0], post2, staticMessage)


    userPosts.push(posts)
    //await complete
    log.setSilent(true)

  })



  mTest("liking post happy path and response for user 1", async () => {
    const likeResults = [];
    await mutateCircles.likePost({ post: userPosts[0][0], operatingUser: users[1] })
    likeResults.push(await mutateCircles.likePost({ post: userPosts[0][0], operatingUser: users[2] }))
    likeResults.push(await mutateCircles.likePost({ post: userPosts[0][1], operatingUser: users[1] }))

    expect(likeResults[0].id).toBe(userPosts[0][0].id)
    expect(likeResults[0].ownerId).toBe(userPosts[0][0].ownerId)
    expect(likeResults[0].likes.items).toHaveLength(2)
    expect(likeResults[0].likes.items[0].userId).toBe(users[1].id)
    expect(likeResults[0].likes.items[1].userId).toBe(users[2].id)

    expect(likeResults[1].id).toBe(userPosts[0][1].id)
    expect(likeResults[1].ownerId).toBe(userPosts[0][1].ownerId)
    expect(likeResults[1].likes.items).toHaveLength(1)
    expect(likeResults[1].likes.items[0].userId).toBe(users[1].id)

    userPosts[0][0] = likeResults[0]
    userPosts[0][1] = likeResults[1]

  })

  mTest("liking multiple times should not increase number of likes", async()=>{
    await mutateCircles.likePost({ post: userPosts[0][0], operatingUser: users[1] })
    await mutateCircles.likePost({ post: userPosts[0][0], operatingUser: users[1] })
    const result = await mutateCircles.likePost({ post: userPosts[0][0], operatingUser: users[1] })
    expect(result.id).toBe(userPosts[0][0].id)
    expect(result.ownerId).toBe(userPosts[0][0].ownerId)
    expect(result.likes.items).toHaveLength(2)

    userPosts[0][0] = result
  })

  mTest("happy path unlike for user1", async ()=>{
    const result = await mutateCircles.unlikePost({ post: userPosts[0][1], operatingUser: users[1] })
    expect(result.likes.items).toHaveLength(0)
    userPosts[0][1] = result
  })

  mTest("multiple unlikes should not cause errors or remove other users likes", async ()=>{

    let result = await mutateCircles.unlikePost({ post: userPosts[0][0], operatingUser: users[1] })
    expect(result.likes.items).toHaveLength(1)
    result = await mutateCircles.unlikePost({ post: userPosts[0][0], operatingUser: users[1] })
    expect(result.likes.items).toHaveLength(1)
    result = await mutateCircles.unlikePost({ post: userPosts[0][0], operatingUser: users[1] })
    expect(result.likes.items).toHaveLength(1)
    expect(result.likes.items[0].userId).toBe(users[2].id)

    userPosts[0][0] = result
  })

  mTest("unliking post and response for user 1", async () => {
    const likeResults = [];
    await mutateCircles.likePost({ post: userPosts[0][0], operatingUser: users[1] })
    likeResults.push(await mutateCircles.likePost({ post: userPosts[0][0], operatingUser: users[2] }))
    likeResults.push(await mutateCircles.likePost({ post: userPosts[0][1], operatingUser: users[1] }))

    expect(likeResults[0].id).toBe(userPosts[0][0].id)
    expect(likeResults[0].ownerId).toBe(userPosts[0][0].ownerId)
    expect(likeResults[0].likes.items).toHaveLength(2)
    expect(likeResults[0].likes.items[0].userId).toBe(users[1].id)
    expect(likeResults[0].likes.items[1].userId).toBe(users[2].id)

    expect(likeResults[1].id).toBe(userPosts[0][1].id)
    expect(likeResults[1].ownerId).toBe(userPosts[0][1].ownerId)
    expect(likeResults[1].likes.items).toHaveLength(1)
    expect(likeResults[1].likes.items[0].userId).toBe(users[1].id)

    userPosts[0][0] = likeResults[0];
    userPosts[0][1] = likeResults[1]
  })


  mTest("happy path adding comments to post", async()=>{

    let results = await mutateCircles.commentOnPost({post: userPosts[0][0], 
      user: users[1], comment: `comment 1 by ${users[1].name}`})

    expect(results.comments.items).toHaveLength(1)
    expect(results.comments.items[0].userId).toBe(users[1].id)
    expect(results.comments.items[0].comment).toBe(`comment 1 by ${users[1].name}`)
    userPosts[0][0] = results

    results = await mutateCircles.commentOnPost({post: userPosts[0][1], 
      user: users[1], comment: `comment 1 by ${users[1].name}`})
    
    expect(results.comments.items).toHaveLength(1)
    expect(results.comments.items[0].userId).toBe(users[1].id)
    expect(results.comments.items[0].comment).toBe(`comment 1 by ${users[1].name}`)

    results = await mutateCircles.commentOnPost({post: userPosts[0][1], 
      user: users[2], comment: `comment 2 by ${users[2].name}`})
    
    expect(results.comments.items).toHaveLength(2)
    expect(results.comments.items[1].userId).toBe(users[2].id)
    expect(results.comments.items[1].comment).toBe(`comment 2 by ${users[2].name}`)
    userPosts[0][1] = results
  })

  mTest("multiple calls by same user should create new comment for each call", async()=>{

    await mutateCircles.commentOnPost({post: userPosts[0][0], user: users[2], comment: `comment 1 by ${users[2].name}`})
    let results = await mutateCircles.commentOnPost({post: userPosts[0][0], user: users[2], comment: `comment 2 by ${users[2].name}`})

    expect(results.comments.items).toHaveLength(3)

    expect(results.comments.items[1].userId).toBe(users[2].id)
    expect(results.comments.items[1].comment).toBe(`comment 1 by ${users[2].name}`)
    expect(results.comments.items[2].userId).toBe(users[2].id)
    expect(results.comments.items[2].comment).toBe(`comment 2 by ${users[2].name}`)

    userPosts[0][0] = results
  })

  let commentHolder = null;
  mTest("happy path uncomment", async()=>{

    commentHolder = userPosts[0][1].comments.items[0]
    let result = await mutateCircles.uncommentOnPost({post: userPosts[0][1], comment: userPosts[0][1].comments.items[0]})
    expect(result.comments.items).toHaveLength(1)

    userPosts[0][1] = result
  })

  mTest("uncommenting with old comments should not generate errors", async()=>{
    await mutateCircles.uncommentOnPost({post: userPosts[0][1], comment: userPosts[0][1].comments.items[0]})
    await mutateCircles.uncommentOnPost({post: userPosts[0][1], comment: userPosts[0][1].comments.items[0]})
    let result = await mutateCircles.uncommentOnPost({post: userPosts[0][1], comment: userPosts[0][1].comments.items[0]})

    expect(result.comments.items).toHaveLength(0)
    userPosts[0][1] = result
  })

  mTest("delete post and verify all it's comments/likes are deleted", async()=>{
    let allPosts = await fetchAllCircles.fetchAllPosts();
    let allComments = await fetchAllCircles.fetchAllComments();
    let allLikes = await fetchAllCircles.fetchAllLikes();
    let fetchedPosts = await fetchCircles.fetchPosts(users[0])
    let user = await fetchCircles.fetchUser(users[0].id)

    expect(fetchedPosts).toHaveLength(user.posts.items.length)
    expect(fetchedPosts).toHaveLength(userPosts[0].length)
    expect(fetchedPosts[0].content).toBe(userPosts[0][0].content)
    expect(fetchedPosts[1].content).toBe(userPosts[0][1].content)
    expect(fetchedPosts[0].comments.items).toHaveLength(userPosts[0][0].comments.items.length)
    expect(fetchedPosts[0].likes.items).toHaveLength(userPosts[0][0].likes.items.length)
    expect(fetchedPosts[1].comments.items).toHaveLength(userPosts[0][1].comments.items.length)
    expect(fetchedPosts[1].likes.items).toHaveLength(userPosts[0][1].likes.items.length)

    await mutateCircles.deletePost(userPosts[0][0])
    let p1 = await fetchAllCircles.fetchAllPosts();
    let c1 = await fetchAllCircles.fetchAllComments();
    let l1 = await fetchAllCircles.fetchAllLikes();

    expect(l1).toHaveLength(allLikes.length - userPosts[0][0].likes.items.length)
    expect(c1).toHaveLength(allComments.length - userPosts[0][0].comments.items.length)
    expect(p1).toHaveLength(allPosts.length - 1)

  })
  mTest("final test, grabbing users from backend and validating state ", async()=>{
    //let user = fetchCircles.fetchUser(userId)
  })
})

afterAll(async () => {
  stopPostSub && stopPostSub()
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

  const users = await fetchAllCircles.fetchAllUsers();
  users.forEach((user: User) => {
    work.push(mutateCircles.deleteUser({ id: user.id }))
  })

  await Promise.all(work)
}

function validateNewPost(user: User, post: Post, content: string) {
  expect(post.ownerId).toBe(user.id);
  expect(post.updatedAt).toBeTruthy();
  expect(post.createdAt).toBe(post.updatedAt);
  expect(post.broadcasts.items).toHaveLength(0);
  expect(post.comments.items).toHaveLength(0);
  expect(post.likes.items).toHaveLength(0)
  expect(post.content).toBe(content)
}
