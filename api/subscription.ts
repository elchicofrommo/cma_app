import { API, graphqlOperation as gql } from "@aws-amplify/api";
import * as queries from "../graphql/queries";
import * as subscriptions from "../graphql/subscriptions-bck-fail";
import { store } from "../redux/store"
import log from "../util/Logging"
import {
    User,
    Channel,
    ChannelMember,
    Post,
    Broadcast,
} from "../types/circles.";

async function handlePostEvent(event) {

    type PostEvent = Post & { delta: string }

    let post: PostEvent = event.value.data.subscribeToMyPosts;
    log.info(
        `observed an event on PostSubscription `, { post }
    );
    //if it is   then fetch the whole thing
    if (post.delta === "CREATE") {
        store.dispatch({ type: "ADD_POST", post })
    } else if (post.delta === "UPDATE") {
        store.dispatch({ type: "UPDATE_POST", post })
    } else {
        store.dispatch({ type: "DELETE_POST", post })
    }

}

async function handleBroadcastEvent(event) {
    log.info(`observed event on broadcast subscription:`, { value: event.value })

    type BroadcastEvent = Broadcast & { delta: string }


    let broadcast: BroadcastEvent = event.value.data.subscribeToBroadcastChannel;
    log.info(
        `observed an event on PostSubscription `, { broadcast }
    );

    //if it is create then fetch the whole thing
    if (broadcast.delta === "CREATE") {
        store.dispatch({ type: "ADD_BROADCAST", broadcast })
    } else if (broadcast.delta === "UPDATE") {
        store.dispatch({ type: "UPDATE_BROADCAST", broadcast })
    } else {
        store.dispatch({ type: "DELETE_BROADCAST", broadcast })
    }

}

function subscribeToMyPosts(operatingUser: User, callback:Function = handlePostEvent) {
    log.info(`subscribing to my post for ${operatingUser?.id}`)
    if (operatingUser) {
        let postSub: any = API.graphql(
            gql(subscriptions.onCreatePost)
        );
        log.info(`got subscription object for ${operatingUser?.id}`)
        postSub = postSub.subscribe({ next: callback, complete: log.info, error: log.info });
        log.info(`completed subscription for ${operatingUser?.id} for function ${callback}`)
        return () => {
            log.info(`unsubscribing to posts for user ${operatingUser?.id}`)
            try {
                postSub.unsubscribe();
            } catch (err) {
                log.info(`could not unsubscribe, probably becasue the connection was closed due to timeout. `)
            }
        }
    } else {
        return undefined;
    }
}

function subscribeToBroadcastChannel(channelId: string, callback= handleBroadcastEvent) {
    log.info(`subscribing to broadcast channel for ${channelId}`)
    if (channelId) {
        let broadcastSub: any = API.graphql(
            gql(subscriptions.subscribeToBroadcastChannel, { channelId })
        );
        log.info(`got subscription object for ${channelId}`)
        broadcastSub = broadcastSub.subscribe({ next: callback, complete: log.info, error: log.info, });
        log.info(`completed subscription for ${channelId}`)
        return () => {
            log.info(`unsubscribing to broadcast channel ${channelId}`)
            try {
                broadcastSub.unsubscribe();
            } catch (err) {
                log.info(`could not unsubscribe, probably becasue the connection was closed due to timeout. `)
            }
        }
    } else {
        return undefined;
    }
}


/**
 * subscribes a user to a channel to listen to posts broadcast on that channel
 */
async function subscribeToChannel(operatingUser: User, channelId:
    string, channelMembers: ChannelMember[]): Promise<ChannelMember> {
    log.info(`subscribeToChannel start, operatingUser is`, { operatingUser })

    if (!operatingUser || channelId === "") {
        throw ({ error: "System Error: You must specify both user id and channel id" });
        return;
    }

    log.info(`trying to join ${channelId} the user channels I'm subscribed to  ${JSON.stringify(channelMembers, null, 2)}`)
    if (channelMembers?.filter((entry) => entry.channelId === channelId).length > 0) {
        throw ({ error: "You already subscribe to this channel" });
        return;
    }

    const channelMember: any = await API.graphql(
        gql(queries.getChannel, { id: channelId })
    );
    log.info(
        `resutls from userchannel query: `, { channelMember }
    );
    if (!channelMember.data.getChannel) {
        throw ({ error: "This Circle Code does not exist. Check your code and try again." })
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
    ) as { data: CreateChannelMember }

    log.info(
        `subscribeToChannel done, result is `, { results }
    );

    return results.data.createChannelMember
}

export default {
    subscribeToMyPosts,
    subscribeToBroadcastChannel,
    subscribeToChannel,
}