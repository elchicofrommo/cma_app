import { API, graphqlOperation as gql } from "@aws-amplify/api";
import * as mutate from "../graphql/mutations";
import * as queries from "../graphql/queries"
import shortid from "shortid";
import log from "../util/Logging"
import {
    User,
    UserChannel,
    Gratitude,
    Entry,
    Comment,
    Like,
    Broadcast,
    NestedArray,
    Channel,
} from "../types/gratitude";

async function commentOnGratitude({gratitude, user, comment}: {gratitude: Gratitude, user: User, comment: string}){
    const commentResult = await API.graphql(gql(mutate.commentOnGratitude, 
        { gratitudeId: gratitude.id, userId: user.id, comment: comment }))
    log.info(`commenting result `, {commentResult})
    if(commentResult.data.listBrodcastByGratitude){
        commentResult.data.listBrodcastByGratitude.items.forEach((broadcast: Broadcast)=>{
           API.graphql(gql(mutate.updateBroadcast, {input: {id: broadcast.id}}))
            log.info(`comment caused broadcast update to channel ${broadcast.channelId}`)
        })
    }

}
async function likeGratitude({ gratitude, operatingUser }: { gratitude: Gratitude, operatingUser: User }) {

    const filtered = gratitude.likes.items.filter(like => like.user.id === operatingUser.id)
    let result = undefined
    if (filtered.length > 0)
        result = await API.graphql(gql(mutate.unlikeGratitude, { likeId: filtered[0].id, gratitudeId: gratitude.id }))
    else
        result = await API.graphql(gql(mutate.likeGratitude, { gratitudeId: gratitude.id, userId: operatingUser.id }))
    log.info(`broadcast results  from like`, {broadcasts: result})
    if(result.data.listBrodcastByGratitude){
        result.data.listBrodcastByGratitude.items.forEach((broadcast: Broadcast)=>{
           API.graphql(gql(mutate.updateBroadcast, {input: {id: broadcast.id}}))
            log.info(`like caused broadcast update to channel ${broadcast.channelId}`)
        })
    }
    
    log.info(`results from gratitudeLike is`, {result} )
}

export type CreateUserInput = {
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

        // don't want to create multiple accounts with same email. 
        const userExists = await API.graphql(
            gql(queries.listUserByEmail, { email: input.email })
        ) as { data: UserResult }

        if (userExists.data.listUserByEmail.items.length > 0) {
            log.info(`trying to create multiple users with same email, fail fast`);
            return;
        }
        const userResult = await API.graphql(
            gql(mutate.createUser, { input: user })
        );
        const results = userResult;
        log.info(`createUser done: `, {results})
    } catch (err) {
        alert(`could not create user for this reason: `, {err});
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
 * This function will create a Channel for this user then subscribe to it as all
 * owned channles should autoamtically get a subscriptoin
 * @param operatingUser User that you are subscribing for 
 * @param channelName The name to give the channel
 */
async function deleteChannel(operatingUser: User, channelId: string, userChannels: UserChannel[]) 
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
 * subscribes a user to a channel to listen to gratitudes broadcast on that channel
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

export type CreateGratitudeInput = {
    title: string
    entries: string[]
}

async function createGratitude(operatingUser: User, input: CreateGratitudeInput): Promise<Gratitude> {

    if (!operatingUser) {
        alert("cannot create gratitude without a user to attach it to");
        return;
    }

    if (
        input.title === "" ||
        input.entries.length == 0
    ) {
        alert("you must specify a title and entries for a gratitude");
    }
    const now = Math.floor(Date.now() );
    const gratitudeId = shortid.generate() + shortid.generate() + shortid.generate();

    const gratitude: Gratitude = {
        ownerId: operatingUser.id,
        title: input.title,
        id: gratitudeId
    };

    const results = [];
    try {


        log.info(`creating gratitude `);
        const entries = input.entries.map(function (content, index): Entry {
            return {
                gratitudeId,
                content: content,
                index
            };
        }); 

        entries.forEach((entry) => {
            results.push(API.graphql(gql(mutate.createEntry, { input: entry })));
        });

        log.info(
            `maybe created all entries, need to do checkign on results and delte if there were any failures`
        );

        type CreateGratitudeResult = {
            createGratitude: Gratitude;
        };

        const gratitudeResult = (await API.graphql(
            gql(mutate.createGratitude, { input: gratitude })
        )) as { data: CreateGratitudeResult };
        
        return gratitudeResult.data.createGratitude;

    } catch (err) {
        alert(
            `could not create gratitude for this reason: ${JSON.stringify(err)}`
        );
    }
}


async function createBroadcast(gratitudeId: string, channelId: string, ownerId: string) {
    if (gratitudeId === "" || channelId === "") {
        alert("must specify both gratitude id and channel id");
        return;
    }

    log.info(`broadcastGratitude start`);

    const results = await API.graphql(
        gql(mutate.createBroadcast, {
            input: {
                gratitudeId,
                channelId,
                ownerId
            }, gratitudeId
        })
    );

    log.info(
        `broadcastGratitude done, results are `, {results}
    );
    return results;

}

async function deleteBroadcast(broadcastId, gratitudeId) {
    if (broadcastId === "" ) {
        alert("must specify broadcastID");
        return;
    }

    log.info(`deleteBroadcast start`);

    const results = await API.graphql(
        gql(mutate.deleteBroadcast, {
            input: {id: broadcastId}, gratitudeId
        })
    );

    log.info(
        `broadcastGratitude done, results are `, {results}
    );
    return results;

}

async function deleteGratitude(gratitude: Gratitude) {
    log.info(`deleteGratitude start for id: ${gratitude.id}`);
    if (!gratitude ) {
      alert(`cannot delete null gratitude`);
      return;
    }

    try {

      let results = []

      // delete all entries, likes, and comments
      gratitude.likes.items.forEach((like: Like) => {
        results.push(
          API.graphql(
            gql(mutate.deleteLike, {
              input: { id: like.id},
            })
          )
        );
      });

      gratitude.entries.items.forEach((entry: Entry) => {
        results.push(
          API.graphql(
            gql(mutate.deleteEntry, {
              input: { id: entry.id},
            })
          )
        );
      });
      gratitude.comments.items.forEach((comment: Comment) => {
        results.push(
          API.graphql(
            gql(mutate.deleteComment, {
              input: { id: comment.id },
            })
          )
        );
      });

    // delete all broadcasts,  entries, likes, and comments
    gratitude.broadcasts.items.forEach((broadcast: Broadcast)=>{
        results.push(API.graphql(
            gql(mutate.deleteBroadcast, {
            input: {id: broadcast.id}, 
            gratitudeId: gratitude.id
            })
        ))
        })

      results.push(
        await API.graphql(
          gql(mutate.deleteGratitude, {
            input: {
              id: gratitude.id,
            },
          })
        )
      );

      const finalResult = await Promise.allSettled(results);

      console.log(
        `deleteGratitude: done, result is ${JSON.stringify(finalResult)}`
      );
      //  updateGratitudeCount((gratitudeCount) => gratitudeCount - 1);
    } catch (err) {
      console.log(`could not delete becasue of : ${JSON.stringify(err)}`);
    }
  }

export default {

    createUser,
    createBroadcast,
    deleteBroadcast,
    createChannel,
    deleteChannel,
    createGratitude,
    deleteGratitude,
    updateUser,
    likeGratitude,
    commentOnGratitude,
    subscribeToChannel
}