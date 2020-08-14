import { API, graphqlOperation as gql } from "@aws-amplify/api";
import * as queries from "../graphql/queries";
import * as subscriptions from "../graphql/subscriptions";
import { store } from "../components/store"
import log from "../util/Logging"
import { shallowEqual, useSelector } from "react-redux";
import {
    User,
    UserChannel,
    Gratitude,
    Entry,
    Broadcast,
    NestedArray,
    Channel,
    ChannelDetails
} from "../types/gratitude";

async function fetchAllUsers(): Promise<Array<User>> {
    log.info(`fetchAllUsers start`);

    try {
        log.info(`#### about to run the query against the api`);

        type ListUsersResults = {
            listUsers: NestedArray<User>
        };

        const firstStageResult = (await API.graphql(
            gql(queries.listUsersShort, {
                limit: 50,
            })
        )) as { data: ListUsersResults };

        return firstStageResult.data.listUsers.items || [];
    } catch (err) {
        log.info(`fetchAllUSers error:  `, { err });
        return []
    }

    log.info(`fetchAllUsers done`);
}

async function fetchAllGratitudes(): Promise<Array<Gratitude>> {
    log.info(`fetchAllGratitudes start`);

    try {
        log.info(`#### about to run the query against the api`);
        type ListGratitudeResult = {
            listGratitudes: NestedArray<Gratitude>
        };

        const firstStageResult = (await API.graphql(
            gql(queries.listShortGratitudes, {
                limit: 50,
            })
        )) as { data: ListGratitudeResult };


        return firstStageResult.data.listGratitudes.items || [];
    } catch (err) {
        log.info(`fetchAllGratitudes error:  `, { err });
        return []
    }

    log.info(`fetchAllGratitudes done`);

}

async function fetchAllChannels(): Promise<Array<Channel>> {
    log.info(`fetchAllChannels`);
    type ListChannelsResult = {
        listChannels: NestedArray<Channel>;
    };
    const result = (await API.graphql(gql(queries.listChannels))) as {
        data: ListChannelsResult;
    };

    log.info(`fetchAllChannels done `);
    return result.data.listChannels.items || [];
}

async function fetchAllEntries(): Promise<Array<Entry>> {
    log.info(`fetchAllEntries start`);
    type ListEntriesResult = {
        listEntrys: NestedArray<Entry>;
    };
    const entryResults = (await API.graphql(gql(queries.listEntrys))) as {
        data: ListEntriesResult;
    };
    log.info(`fetchAllEntries end`);
    return entryResults.data.listEntrys.items;
}

async function handleGratitudeEvent(event) {


    type GratitudeEvent = Gratitude & { delta: string }


    let gratitude: GratitudeEvent = event.value.data.subscribeToMyGratitudes;
    log.info(
        `observed an event on GratitudeSubscription `, { gratitude }
    );
    //if it is   then fetch the whole thing
    if (gratitude.delta === "CREATE") {
        store.dispatch({ type: "ADD_GRATITUDE", gratitude })
    } else if (gratitude.delta === "UPDATE") {
        store.dispatch({ type: "UPDATE_GRATITUDE", gratitude })
    } else {
        store.dispatch({ type: "DELETE_GRATITUDE", gratitude })
    }

}

async function handleBroadcastEvent(event) {
    log.info(`observed event on broadcast subscription:`, { value: event.value })

    type BroadcastEvent = Broadcast & { delta: string }


    let broadcast: BroadcastEvent = event.value.data.subscribeToBroadcastChannel;
    log.info(
        `observed an event on GratitudeSubscription `, { broadcast }
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

function subscribeToMyGratitudes(operatingUser: User) {
    log.info(`subscribing to my gratitude for ${operatingUser?.id}`)
    if (operatingUser) {
        let gratitudeSub: any = API.graphql(
            gql(subscriptions.subscribeToMyGratitudes, { ownerId: operatingUser.id })
        );
        log.info(`got subscription object for ${operatingUser?.id}`)
        gratitudeSub = gratitudeSub.subscribe({ next: handleGratitudeEvent, complete: log.info, error: log.info });
        log.info(`completed subscription for ${operatingUser?.id}`)
        return () => {
            log.info(`unsubscribing to gratitudes for user ${operatingUser?.id}`)
            try {
                gratitudeSub.unsubscribe();
            } catch (err) {
                log.info(`could not unsubscribe, probably becasue the connection was closed due to timeout. `)
            }
        }
    } else {
        return undefined;
    }
}

function subscribeToBroadcastChannel(channelId: string) {
    log.info(`subscribing to broadcast channel for ${channelId}`)
    if (channelId) {
        let broadcastSub: any = API.graphql(
            gql(subscriptions.subscribeToBroadcastChannel, { channelId })
        );
        log.info(`got subscription object for ${channelId}`)
        broadcastSub = broadcastSub.subscribe({ next: handleBroadcastEvent, complete: log.info, error: log.info,  });
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
///// Section for fetching data for operating

async function fetchOperatingUser(userId):
    Promise<{
        user: User,
        channels: Channel[],
        userChannels: UserChannel[],
        gratitudes: Gratitude[]
    } | undefined> {

    if (!userId) {
        return undefined
    }
    try {
        type GetOperatingUserResult = {
            getUser: Omit<User, 'meetingIds'> & { meetingIds: any };
            listChannelByOwner: NestedArray<Channel>;
            listChannelByUser: NestedArray<UserChannel>;
            listGratitudeByOwner: NestedArray<Gratitude>;
        };

        const firstStageResult = (await API.graphql(
            gql(queries.getOperatingUser, {
                id: userId,
            })
        )) as { data: GetOperatingUserResult };

        log.info(`full results of user query is commented out` /*, {firstStageResult}*/);

        let meetingIds = [];
        if (firstStageResult.data.getUser.meetingIds != "") {
            meetingIds = firstStageResult.data.getUser.meetingIds?.split(",")
        }

        firstStageResult.data.getUser.meetingIds = meetingIds

        const userResult: User = firstStageResult.data.getUser;

        const tempMyOwnedChannels: NestedArray<Channel> =
            firstStageResult.data?.listChannelByOwner;
        const tempMyChannels: NestedArray<UserChannel> =
            firstStageResult.data?.listChannelByUser;
        const tempMyGratitudes: NestedArray<Gratitude> =
            firstStageResult.data?.listGratitudeByOwner;

        try {

            log.info(`fetchOperatingUser done:`, { userResult, tempMyChannels, tempMyGratitudes, tempMyOwnedChannels })

            return {
                channels: tempMyOwnedChannels.items,
                gratitudes: tempMyGratitudes.items,
                userChannels: tempMyChannels.items,
                user: userResult,
            }
        } catch (err) {
            log.error(`could not destructure because of ${err}`);
            return undefined
        }
    } catch (err) {
        log.error(`fetchOperatingUser error:  `, { err });
        return undefined
    }
    log.info(`fetchOperatingUser done`);
}

async function fetchOwnedChannels(operatingUser: User): Promise<Array<Channel>> {
    log.info(`fetchMyOwnedChannels start for user ${operatingUser.id}`);
    if (!operatingUser) {
        log.info(`fetchMyOwnedChannels setting to empy list`);
        return []

    }

    type ListChannelResult = {
        listChannelByOwner: {
            items: Channel[];
        };
    };

    const firstStageResult = (await API.graphql(
        gql(queries.listChannelByOwner, {
            ownerId: operatingUser.id,
            limit: 50,
        })
    )) as { data: ListChannelResult };

    return firstStageResult.data.listChannelByOwner.items

}

async function fetchGratitudes(operatingUser: User): Promise<Gratitude[]> {
    log.info(`fetchMyGratitudes start for user: ${operatingUser.id}`);
    if (!operatingUser) {
        log.info(`fetchMyGratitudes setting to empty list `);
        return []
    }

    try {
        type ListGratitudeResults = {
            listGratitudeByOwner: NestedArray<Gratitude>;
        };
        const gratitudeResults = (await API.graphql(
            gql(queries.listGratitudeByOwner, {
                ownerId: operatingUser.id,
                limit: 50
            })
        )) as { data: ListGratitudeResults };
        let results = gratitudeResults.data.listGratitudeByOwner.items;


        log.info(`fetchMyGratitudes done: `, { results });

        return (results);
    } catch (err) {
        log.info(`fetchMyGratitudes error:  `, { err });
        return []
    }
}

async function fetchBroadcastGratitude(user: User, mySubChannels: UserChannel[]): Promise<Map<string, Broadcast[]>> {
    try {

        if (mySubChannels.length === 0) {
            log.info(`fetchMyBroadcastGratitude setting to empty list `);
            return (new Map<string, Broadcast[]>());
        }


        const promises = [];
        const broadcastByChannel = new Map<string, Broadcast[]>();
        mySubChannels.forEach((channel) => {
            broadcastByChannel.set(channel.channelId, []);
            promises.push(
                API.graphql(
                    gql(queries.listBroadcastByChannel, {
                        channelId: channel.channelId, filter: {ownerId: {ne: user.id}}
                    })
                )
            );
        });

        let results: any = await Promise.all(promises);
        log.info(`broadcastresults are `, { results });

        let i = 0;
        const mapStrings = [];
        const finalMap = new Map<string, Broadcast[]>()
        broadcastByChannel.forEach((value, key) => {
            let {

                data: {
                    listBroadcastByChannel: { items: broadcasts },
                },

            } = results[i++];

            finalMap.set(key, broadcasts);
            mapStrings.push(`key: ${key}`, { broadcasts });
        });


        log.info(`broadcasts look like this ${mapStrings}`);
        log.info(`finalMap has this many keys ${finalMap.size}`)

        return (finalMap);
    } catch (err) {
        log.info(`problem getting broadcasat: `, { err });
        return (new Map<string, Broadcast[]>());
    }
}

async function getAuthDetails(email: string): Promise<User> {
    if (!email) {
        log.info("could not fetch user with no email")
        return;
    }
    type AuthDetailResult = {
        listUserByEmail: NestedArray<User>
    }
    const authResult = (await API.graphql(
        gql(queries.listUserByEmail, { email })
    )) as { data: AuthDetailResult }
    if (authResult.data.listUserByEmail.items.length > 1) {
        log.info('problem getting auth details, seems there are two users with same email, returning first')
    }
    return authResult.data.listUserByEmail.items[0]
}

async function fetchMySubChannels(operatingUser: User): Promise<UserChannel[]> {
    log.info(`fetchMySubchannels start for id ${operatingUser.id}`);
    if (!operatingUser) {
        log.info(`fetchMySubchannels setting to empty list`);
        return ([]);
    }

    type ListUserChannelResults = {
        listChannelByUser: NestedArray<UserChannel>;
    };
    const broadcastResult = (await API.graphql(
        gql(queries.listChannelByUser, {
            userId: operatingUser.id,
        })
    )) as { data: ListUserChannelResults };

    log.info(`fetchMySubchannels done `);
    return (broadcastResult.data.listChannelByUser.items);

}

async function fetchChannelDetails(channelId: string): Promise<ChannelDetails> {
    type getChannelResult = {
        getChannel: Channel

    }

    type ChannelDetailResults = {
        getChannel: Channel,
        listUserByChannel: NestedArray<{ user: User }>
    }
    const channelDetails = await API.graphql(
        gql(queries.getChannelDetails, { id: channelId })
    ) as { data: ChannelDetailResults }

    const detail: ChannelDetails = channelDetails.data.getChannel
    detail.subscribedUsers = channelDetails.data.listUserByChannel.items.map(item => item.user)


    return detail;
}

export default {
    getAuthDetails,
    fetchMySubChannels,
    fetchBroadcastGratitude,
    fetchGratitudes,
    fetchAllUsers,
    fetchAllChannels,
    fetchAllGratitudes,
    fetchAllEntries,
    fetchOperatingUser,
    fetchOwnedChannels,
    subscribeToMyGratitudes,
    subscribeToBroadcastChannel,
    fetchChannelDetails
}