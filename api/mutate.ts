import { API, graphqlOperation as gql } from "@aws-amplify/api";
import * as mutate from "../graphql/mutations";
import * as queries from "../graphql/queries"
import shortid from "shortid";
import log from "../util/Logging"
import {
    User,
    ChannelMember,
    Post,
    Comment,
    Like,
    Broadcast,
    NestedArray,
    Channel,
} from "../types/circles.";

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
    meetingIds?: string[]
}

async function commentOnPost({ post, user, comment }: { post: Post, user: User, comment: string }) : Promise<Post> {
    try{
        log.info('commenting on post')
        const commentResult = await API.graphql(gql(mutate.commentOnPost,
            { postId: post.id, userId: user.id, comment: comment })) as { data: any }
        log.verbose(`commenting result `, { result:  commentResult.data.updatePost }) 

        if (commentResult.data.listBrodcastByPost) {
            commentResult.data.listBrodcastByPost.items.forEach((broadcast: Broadcast) => {
                API.graphql(gql(mutate.updateBroadcast, { input: { postId: broadcast.postId, channelId: broadcast.channelId } }))
                log.info(`comment caused broadcast update to channel ${broadcast.channelId}`)
            })
        }
        return commentResult.data.updatePost
    }catch(error){
        log.info(`caught error adding comment `, { error })
        return error.data? error.data.updatePost : post
    }

}

async function uncommentOnPost({ post, comment}: { post: Post, comment: Comment}) : Promise<Post> {
    try{
        log.info('uncommenting on post')
        const commentResult = await API.graphql(gql(mutate.uncommentOnPost,
            { postId: post.id, createdAt: comment.createdAt })) as { data: any }
        log.verbose(`commenting result `, { result:  commentResult.data.updatePost }) 

        if (commentResult.data.listBrodcastByPost) {
            commentResult.data.listBrodcastByPost.items.forEach((broadcast: Broadcast) => {
                API.graphql(gql(mutate.updateBroadcast, { input: { postId: broadcast.postId, channelId: broadcast.channelId } }))
                log.info(`uncomment caused broadcast update to channel ${broadcast.channelId}`)
            })
        }
        return commentResult.data.updatePost
    }catch(error){
        log.verbose(`caught error adding comment `, { error })
        return error.data? error.data.updatePost : post
    }

}


/**
 * Call to unlike a post. No op if the operating user hasn't previously 
 * liked the post
 * @param param0 
 */
async function unlikePost({ post, operatingUser }: { post: Post, operatingUser: User }): Promise<Post> {

    try{
        const result = await API.graphql(gql(mutate.unlikePost,
            { postId: post.id , userId: operatingUser.id})) as { data: any }
    
    
        log.info(`broadcast results from unlike`, { broadcasts: result })
        if (result.data.listBrodcastByPost) {
            result.data.listBrodcastByPost.items.forEach((broadcast: Broadcast) => {
                API.graphql(gql(mutate.updateBroadcast, { input: { channelId: broadcast.channelId, 
                    postId: broadcast.postId }, postId: post.id }))
                log.info(`like caused broadcast update to channel ${broadcast.channelId}`)
            })
        }
        log.info(`results from postLike is`, { updatePost: result.data.updatePost })
        return result.data.updatePost

    }catch(error){
        log.verbose('caught problem unliking, data is as follows', {error})
        return error.data? error.data.updatePost: post
    }
    

}

/**
 * Call to like a post. Will neve rhave more than one like per post id/user id. No errors
 * if post id/user id exists already
 * @param param0 
 */
async function likePost({ post, operatingUser }: { post: Post, operatingUser: User }): Promise<Post> {

    const result = await API.graphql(gql(mutate.likePost,
            { postId: post.id, userId: operatingUser.id })) as { data: any }
    log.info(`broadcast results  from like`, { broadcasts: result })
    if (result.data.listBrodcastByPost) {
        result.data.listBrodcastByPost.items.forEach((broadcast: Broadcast) => {
            API.graphql(gql(mutate.updateBroadcast, { input: { channelId: broadcast.channelId, 
                postId: broadcast.postId }, postId: post.id }))
            log.info(`like caused broadcast update to channel ${broadcast.channelId}`)
        })
    }

    log.info(`results from postLike is`, { updatePost: result.data.updatePost })
    return result.data.updatePost
}
async function updateUser(input: UpdateUserInput): Promise<User> {
    log.info(`updateUser start`)
    const { meetingIds, ...rest } = input
    if (meetingIds) {
        rest['meetingIds'] = meetingIds.join(',')
    }
    if (rest.id === "") {
        alert('you cannot update a user with no id. System error')
        return;
    }
    log.verbose('using this modified input', { rest })
    try {

        const results = await API.graphql(
            gql(mutate.updateUser,
                { input: rest })
        ) as { data: any }

        log.verbose('got back', { results })
        if (results?.data.hasOwnProperty("updateUser")) {
            const meetings = results.data.updateUser.meetingIds;

            if (meetings) results.data.updateUser.meetingIds = meetings.split(",")
            return results.data.updateUser
        } else {
            return results.data
        }


    } catch (err) {
        log.info(`could not save user update`, { err })
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

        const userResult = await API.graphql(
            gql(mutate.createUser, { input: user })
        ) as { data: any };


        log.info(`createUser done: `, { userResult })
        if (userResult?.data.hasOwnProperty("createUser")) {
            return userResult.data.createUser
        } else {
            return userResult.data
        }


    } catch (err) {
        log.error(`could not create user for this reason: `, { err });
    }
}
async function deleteUser({ id }: { id: string }) {
    if (id === "") {
        alert("must specify id");
        return;
    }

    log.info(`deleteUser start`);

    const results = await API.graphql(
        gql(mutate.deleteUser, {
            input: { id: id }
        })
    ) as { data: any };

    log.info(`deleteUser done: `, { results })
    if (results?.data.hasOwnProperty("deleteUser")) {
        const meetings = results.data.deleteUser.meetingIds;

        if (meetings) results.data.deleteUser.meetingIds = meetings.split(",")
        return results.data.deleteUser
    } else {
        return results.data
    }

}
/**
 * This function will create a channle for this user then subscribe to it as all
 * owned channles should autoamtically get a subscriptoin
 * @param operatingUser User that you are subscribing for 
 * @param channelName The name to give the channel
 */
async function createChannel(operatingUser: User, channelName: string, channelMembers: ChannelMember[])
    : Promise<{ ownedChannel: Channel, subscribedChannel: ChannelMember }> {
    log.info(`createChannel start`);
    if (!operatingUser) {
        alert(`only users can create channels`);
        return;
    }

    if (channelName === "") {
        alert("you must specify a name for your channel");
        return;
    }


    const channel: Channel = {
        id: shortid.generate().substring(0, 6),
        name: channelName,
        ownerIds: [operatingUser.id],
    };


    type CreateChannelResult = {
        createChannel: Channel
    }
    const results = await API.graphql(
        gql(mutate.createChannel, { input: channel })
    ) as { data: CreateChannelResult }

    log.info(`createChannel done:`, { results })
    log.info(`now subscribing:`);

    const subscribeResults = await subscribeToChannel(operatingUser, channel.id, channelMembers)

    return { ownedChannel: results.data.createChannel, subscribedChannel: subscribeResults }



}


/**
 * subscribes a user to a channel to listen to gratitudes broadcast on that channel
 */
async function subscribeToChannel(operatingUser: User, channelId: 
    string) : Promise<ChannelMember>{
    log.info(`subscribeToChannel start, operatingUser is`, {operatingUser})

    if (!operatingUser || channelId === "") {
      throw({error: "System Error: You must specify both user id and channel id"});
      return;
    }
  
    const channel: any = await API.graphql(
      gql(queries.getChannel, { id: channelId })
    );
    log.info(
      `resutls from userchannel query: `, {channel}
    );
    if(!channel.data.getChannel){
        throw({error: "This Circle Code does not exist. Check your code and try again."})
    }

    type CreateChannelMember = {
        createChannelMember: ChannelMember
    }
    const results = await API.graphql(
      gql(mutate.createChannelMember, {
        input: {
          channelId: channelId,
          userId: operatingUser.id,
        },
      })
    ) as {data: CreateChannelMember}

    log.info(
      `subscribeToChannel done, result is `, {results}
    );
    
    return results.data.createChannelMember
  }


async function createPost(operatingUser: User, input: string): Promise<Post | { error: string }> {

    if (!operatingUser) {
        return ({ error: "cannot create post without a user to attach it to" })
    }


    const post: Post = {
        ownerId: operatingUser.id,
        content: input
    };

    try {


        log.verbose(`creating post `, { post });


        type CreatePostResult = {
            createPost: Post;
        };


        const postResult = (await API.graphql(
            gql(mutate.createPost, { input: post })
        )) as { data: CreatePostResult };

        const rawPost = postResult.data.createPost
        log.verbose('raw post result ', {postResult})
        rawPost.broadcasts || (rawPost.broadcasts = { items: [] });
        rawPost.comments || (rawPost.comments = { items: [] });
        rawPost.likes || (rawPost.likes = { items: [] });
        rawPost.owner || (rawPost.owner = operatingUser);
        return postResult.data.createPost;

    } catch (err) {
        return ({ error: `could not create post for this reason: ${JSON.stringify(err)}` })

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
        `broadcastPost done, results are `, { results }
    );
    return results;

}

async function deleteBroadcast(id: string) {
    if (id === "") {
        alert("must specify broadcastid");
        return;
    }

    log.info(`deleteBroadcast start`);

    const results = await API.graphql(
        gql(mutate.deleteBroadcast, {
            input: { id}, postId
        })
    );

    log.info(
        `broadcastPost done, results are `, { results }
    );
    return results;

}

async function deletePost(post: Post) {
    log.verbose(`deletePost start for id:`, { post });
    if (!post) {
        alert(`cannot delete null post`);
        return;
    }

    try {

        let results = []

        // delete all entries, likes, and comments
        post.likes.items.forEach((like: Like) => {
            results.push(
                deleteLike(like.postId, like.userId)
            );
        });

        log.info("cleared likes")
        post.comments.items.forEach((comment: Comment) => {
            results.push(
                deleteComment(comment.postId, comment.createdAt)
            );
        });
        log.info("cleared comments")

        // delete all broadcasts,  entries, likes, and comments
        post.broadcasts.items.forEach((broadcast: Broadcast) => {
            results.push(
                deleteBroadcast(broadcast.id)
            )
        });
        log.info("cleared broadcasts")
        results.push(
            API.graphql(
                gql(mutate.deletePost, {
                    input: {
                        id: post.id
                    }
                })
            )
        );

        log.info("cleared posts")

        const finalResult = await Promise.all(results);

        log.info(
            `deletePost: done, result is ${JSON.stringify(finalResult)}`
        );
        //  updatePostCount((postCount) => postCount - 1);
    } catch (err) {
        log.info(`could not delete becasue of : ${JSON.stringify(err)}`);
    }
}

async function deleteComment(postId, createdAt) {
    return API.graphql(
        gql(mutate.deleteComment, {
            input: { postId, createdAt },
        })
    )
}

async function deleteLike(postId, userId) {
    return API.graphql(
        gql(mutate.deleteLike, {
            input: { postId, userId },
        })
    )
}

export default {

    deleteComment,
    deleteLike,
    createUser,
    deleteUser,
    createBroadcast,
    deleteBroadcast,
    createChannel,
    createPost,
    deletePost,
    updateUser,
    likePost,
    unlikePost,
    commentOnPost,
    uncommentOnPost,
    subscribeToChannel,
}