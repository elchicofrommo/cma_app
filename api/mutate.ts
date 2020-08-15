import { API, graphqlOperation as gql } from "@aws-amplify/api";
import * as mutate from "../graphql/mutations";
import * as queries from "../graphql/queries"
import shortid from "shortid";
import log from "../util/Logging"
import {
    User,
    UserChannel,
    Post,
    Comment,
    Like,
    Broadcast,
    NestedArray,
    Channel,
} from "../types/circles";

async function commentOnPost({post, user, comment}: {post: Post, user: User, comment: string}){
    const commentResult = await API.graphql(gql(mutate.commentOnPost, 
        { postId: post.id, userId: user.id, comment: comment }))
    log.info(`commenting result `, {commentResult})
    if(commentResult.data.listBrodcastByPost){
        commentResult.data.listBrodcastByPost.items.forEach((broadcast: Broadcast)=>{
           API.graphql(gql(mutate.updateBroadcast, {input: {id: broadcast.id}}))
            log.info(`comment caused broadcast update to channel ${broadcast.channelId}`)
        })
    }

}
async function likePost({ post, operatingUser }: { post: Post, operatingUser: User }) {

    const filtered = post.likes.items.filter(like => like.user.id === operatingUser.id)
    let result = undefined
    if (filtered.length > 0)
        result = await API.graphql(gql(mutate.unlikePost, { likeId: filtered[0].id, postId: post.id }))
    else
        result = await API.graphql(gql(mutate.likePost, { postId: post.id, userId: operatingUser.id }))
    log.info(`broadcast results  from like`, {broadcasts: result})
    if(result.data.listBrodcastByPost){
        result.data.listBrodcastByPost.items.forEach((broadcast: Broadcast)=>{
           API.graphql(gql(mutate.updateBroadcast, {input: {id: broadcast.id}, postId: post.id}))
            log.info(`like caused broadcast update to channel ${broadcast.channelId}`)
        })
    }
    
    log.info(`results from postLike is`, {result} )
}

export type CreateUserInput = {
    id: string,
    email: string,
    name: string,
    dos?: number,
    shareDos?: boolean,
};

export type UpdateUserInput = {
    id: string,
    name?: string,
    dos?: number,
    shareDos?: boolean,
    email?: string,
    meetingIds?: string
}

async function updateUser(input: UpdateUserInput): Promise<User> {
    log.info(`updateUser start`)
    if (input.id === "") {
        alert('you cannot update a user with no id. System error')
        return;
    }
    try {
        type UpdateUserResult = {
            updateUser: User
        }
        const result = await API.graphql(
            gql(mutate.updateUser,
                { input: input })
        ) as { data: UpdateUserResult }
        log.info(`done updating, results are`, {result} )
        return result.data.updateUser
    } catch (err) {
        log.info(`could not save user update`, {err})
    }
}


async function createUser(input: CreateUserInput) {
    log.info(`createUser start`);

    if (input.name === "" || input.email === "") {
        alert("you must specity name and email to create user");
        return;
    }
    const user: User = {
        id: input.id,
        name: input.name,
        email: input.email,
        role: `basic`,
        shortId: shortid.generate().substring(0, 6),
        shareDos: input.shareDos === true,
        dos: new Date(input.dos || Date.now()).getTime(),
    };

    try {
        type UserResult = {
            listUserByEmail: NestedArray<User>
        }

        const userResult = await API.graphql(
            gql(mutate.createUser, { input: user })
        );
        const results = userResult;
        log.info(`createUser done: `, {results})
    } catch (err) {
        log.error(`could not create user for this reason: `, {err});
    }
}
/**
 * This function will create a channle for this user then subscribe to it as all
 * owned channles should autoamtically get a subscriptoin
 * @param operatingUser User that you are subscribing for 
 * @param channelName The name to give the channel
 */
async function createChannel(operatingUser: User, channelName: string, userChannels: UserChannel[]) 
: Promise<{ownedChannel: Channel, subscribedChannel: UserChannel}>{
    log.info(`createChannel start`);
    if (!operatingUser) {
        alert(`only users can create channels`);
        return;
    }

    if (channelName === "") {
        alert("you must specify a name for your channel");
        return;
    }

    const id = shortid.generate();

    const channel: Channel = {
        id: shortid.generate().substring(0, 6),
        name: channelName,
        ownerId: operatingUser.id,
        shortId: shortid.generate().substring(0, 6),
    };


    type CreateChannelResult =  {
        createChannel: Channel
    }
    const results = await API.graphql(
        gql(mutate.createChannel, { input: channel })
    ) as {data: CreateChannelResult}

    log.info(`createChannel done:`, {results})
    log.info(`now subscribing:`);

    const subscribeResults = await subscribeToChannel(operatingUser, channel.id, userChannels)

    return {ownedChannel: results.data.createChannel, subscribedChannel: subscribeResults}
        


}


/**
 * subscribes a user to a channel to listen to posts broadcast on that channel
 */
async function subscribeToChannel(operatingUser: User, channelId: 
    string, userChannels: UserChannel[]) : Promise<UserChannel>{
    log.info(`subscribeToChannel start, operatingUser is`, {operatingUser})

    if (!operatingUser || channelId === "") {
      throw({error: "System Error: You must specify both user id and channel id"});
      return;
    }

    log.info(`trying to join ${channelId} the user channels I'm subscribed to  ${JSON.stringify(userChannels, null, 2)}`)
    if (userChannels?.filter((entry) => entry.channelId === channelId).length > 0) {
      throw({error: "You already subscribe to this channel"});
      return;
    }
    
    const userChannel: any = await API.graphql(
      gql(queries.getChannel, { id: channelId })
    );
    log.info(
      `resutls from userchannel query: `, {userChannel}
    );
    if(!userChannel.data.getChannel){
        throw({error: "This Circle Code does not exist. Check your code and try again."})
    }

    type CreateUserChannel ={
        createUserChannel: UserChannel
    }
    const results = await API.graphql(
      gql(mutate.createUserChannel, {
        input: {
          channelId: channelId,
          userId: operatingUser.id,
        },
      })
    ) as {data: CreateUserChannel}

    log.info(
      `subscribeToChannel done, result is `, {results}
    );
    
    return results.data.createUserChannel
  }

async function createPost(operatingUser: User, input: string): Promise<Post> {

    if (!operatingUser) {
        alert("cannot create post without a user to attach it to");
        return;
    }

    const now = Math.floor(Date.now() );
    const postId = shortid.generate() + shortid.generate() + shortid.generate();

    const post: Post = {
        ownerId: operatingUser.id,
        id: postId,
        content: input
    };

    const results = [];
    try {


        log.info(`creating post `);


        type CreatePostResult = {
            createPost: Post;
        };

        const postResult = (await API.graphql(
            gql(mutate.createPost, { input: post })
        )) as { data: CreatePostResult };
        
        return postResult.data.createPost;

    } catch (err) {
        alert(
            `could not create post for this reason: ${JSON.stringify(err)}`
        );
    }
}


async function createBroadcast(postId: string, channelId: string, ownerId: string) {
    if (postId === "" || channelId === "") {
        alert("must specify both post id and channel id");
        return;
    }

    log.info(`broadcastPost start`);

    const results = await API.graphql(
        gql(mutate.createBroadcast, {
            input: {
                postId,
                channelId,
                ownerId
            }, postId
        })
    );

    log.info(
        `broadcastPost done, results are `, {results}
    );
    return results;

}

async function deleteBroadcast(broadcastId, postId) {
    if (broadcastId === "" ) {
        alert("must specify broadcastID");
        return;
    }

    log.info(`deleteBroadcast start`);

    const results = await API.graphql(
        gql(mutate.deleteBroadcast, {
            input: {id: broadcastId}, postId
        })
    );

    log.info(
        `broadcastPost done, results are `, {results}
    );
    return results;

}

async function deletePost(post: Post) {
    log.info(`deletePost start for id: ${post.id}`);
    if (!post ) {
      alert(`cannot delete null post`);
      return;
    }

    try {

      let results = []

      // delete all entries, likes, and comments
      post.likes.items.forEach((like: Like) => {
        results.push(
          API.graphql(
            gql(mutate.deleteLike, {
              input: { id: like.id},
            })
          )
        );
      });


      post.comments.items.forEach((comment: Comment) => {
        results.push(
          API.graphql(
            gql(mutate.deleteComment, {
              input: { id: comment.id },
            })
          )
        );
      });

    // delete all broadcasts,  entries, likes, and comments
    post.broadcasts.items.forEach((broadcast: Broadcast)=>{
        results.push(API.graphql(
            gql(mutate.deleteBroadcast, {
            input: {id: broadcast.id}, 
            postId: post.id
            })
        ))
        })

      results.push(
        await API.graphql(
          gql(mutate.deletePost, {
            input: {
              id: post.id,
            },
          })
        )
      );

      const finalResult = await Promise.allSettled(results);

      console.log(
        `deletePost: done, result is ${JSON.stringify(finalResult)}`
      );
      //  updatePostCount((postCount) => postCount - 1);
    } catch (err) {
      console.log(`could not delete becasue of : ${JSON.stringify(err)}`);
    }
  }

export default {

    createUser,
    createBroadcast,
    deleteBroadcast,
    createChannel,
    createPost,
    deletePost,
    updateUser,
    likePost,
    commentOnPost,
    subscribeToChannel
}