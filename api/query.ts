import { API, graphqlOperation as gql } from "@aws-amplify/api";
import * as queries from "../graphql/queries";
import log from "../util/Logging"
import {
    User,
    UserChannel,
    Post,
    Broadcast,
    NestedArray,
    Channel,
    ChannelDetails
} from "../types/circles.";

///// Section for fetching data for operating

async function fetchOperatingUser(userId):
    Promise<{
        user: User,
        channels: Channel[],
        userChannels: UserChannel[],
        posts: Post[]
    } | undefined> {

    if (!userId) {
        return undefined
    }
    try {
        type GetOperatingUserResult = {
            getUser: Omit<User, 'meetingIds'> & { meetingIds: any };
            listChannelByOwner: NestedArray<Channel>;
            listChannelByUser: NestedArray<UserChannel>;
            listPostByOwner: NestedArray<Post>;
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
        const tempMyPosts: NestedArray<Post> =
            firstStageResult.data?.listPostByOwner;

        try {

            log.info(`fetchOperatingUser done:`, { userResult, tempMyChannels, tempMyPosts, tempMyOwnedChannels })

            return {
                channels: tempMyOwnedChannels.items,
                posts: tempMyPosts.items,
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

async function fetchPosts(operatingUser: User): Promise<Post[]> {
    log.info(`fetchMyPosts start for user: ${operatingUser.id}`);
    if (!operatingUser) {
        log.info(`fetchMyPosts setting to empty list `);
        return []
    }

    try {
        type ListPostResults = {
            listPostByOwner: NestedArray<Post>;
        };
        const postResults = (await API.graphql(
            gql(queries.listPostByOwner, {
                ownerId: operatingUser.id,
                limit: 50
            })
        )) as { data: ListPostResults };
        let results = postResults.data.listPostByOwner.items;


        log.info(`fetchMyPosts done: `, { results });

        return (results);
    } catch (err) {
        log.info(`fetchMyPosts error:  `, { err });
        return []
    }
}

async function fetchBroadcastPost(user: User, mySubChannels: UserChannel[]): Promise<Map<string, Broadcast[]>> {
    try {

        if (mySubChannels.length === 0) {
            log.info(`fetchMyBroadcastPost setting to empty list `);
            return (new Map<string, Broadcast[]>());
        }


        const promises = [];
        const broadcastByChannel = new Map<string, Broadcast[]>();
        mySubChannels.forEach((channel) => {
            broadcastByChannel.set(channel.channelId, []);
            promises.push(
                API.graphql(
                    gql(queries.listBroadcastByChannel, {
                        channelId: channel.channelId, filter: { ownerId: { ne: user.id } }
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

async function getAuthDetails(id: string): Promise<User> {
    if (!id) {
        log.info("could not fetch user with no id ... system error")
        return;
    }
    type AuthDetailResult = {
        getUser: User
    }
    const authResult = (await API.graphql(
        gql(queries.getUser, { id })
    )) as { data: AuthDetailResult }

    return authResult.data.getUser
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
    fetchBroadcastPost,
    fetchPosts,
    fetchOperatingUser,
    fetchOwnedChannels,
    fetchChannelDetails,
}