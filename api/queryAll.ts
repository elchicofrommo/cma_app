import { API, graphqlOperation as gql } from "@aws-amplify/api";
import * as queries from "../graphql/queries";

import log from "../util/Logging"

import {
    User,
    Post,
    Like,
    NestedArray,
    Channel,
    ChannelMember,
    Comment
} from "../types/circles.";
import PostCircleScreen from "../screens/PostCircleScreen";

/**
 * Warning: Massive potental performance and cost implications using this method. 
 * Do you really want to get all Likes?
 */
async function fetchAllLikes(): Promise<Array<Like>> {
    log.info(`fetchAllLikes start`);

    try {
        log.info(`#### about to run the query against the api`);
        const firstStageResult = (await API.graphql(
            gql(queries.listLikes)
        )) as { data: any };

        return firstStageResult.data.listLikes.items || [];
    } catch (err) {
        log.verbose(`fetchAllLikes error:  `, { err });
        return []
    }

    log.info(`fetchAllLikes done`);
}

/**
 * Warning: Massive potental performance and cost implications using this method. 
 * Do you really want to get all Comments?
 */
async function fetchAllComments(): Promise<Array<Comment>> {
    log.info(`fetchAllLikes start`);

    try {
        log.info(`#### about to run the query against the api`);
        const firstStageResult = (await API.graphql(
            gql(queries.listComments)
        )) as { data: any };

        return firstStageResult.data.listComments.items || [];
    } catch (err) {
        log.info(`fetchAllComments error:  `, { err });
        return []
    }

    log.info(`fetchAllComments done`);
}

/**
 * Warning: Massive potental performance and cost implications using this method. 
 * Do you really want to get all Users?
 */
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

/**
* Warning: Massive potental performance and cost implications using this method. 
* Do you really want to get all Posts?
*/
async function fetchAllPosts(): Promise<Array<Post>> {
    log.info(`fetchAllPosts start`);

    try {
        log.info(`#### about to run the query against the api`);
        type ListPostResult = {
            listPosts: NestedArray<Post>
        };

        const firstStageResult = (await API.graphql(
            gql(queries.listShortPosts, {
                limit: 100,
            })
        )) as { data: ListPostResult };

        const results = firstStageResult.data.listPosts.items 
        if(!results)
            return []
        
        results.forEach((post:Post)=>{
            post.likes = post.likes || {items: []}
            post.comments = post.comments || {items: []}
            post.broadcasts = post.broadcasts || {items: []}
        })
        
        return results  
    } catch (err) {
        log.info(`fetchAllPosts error:  `, { err });
        return []
    }

    log.info(`fetchAllPosts done`);

}
/**
* Warning: Massive potental performance and cost implications using this method. 
* Do you really want to get all Channels?
*/
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

/**
* Warning: Massive potental performance and cost implications using this method. 
* Do you really want to get all ChannelMembers?
*/
async function fetchAllChannelMembers(): Promise<Array<ChannelMember>> {
    log.info(`fetchAllChannels`);
    type ListChannelMembersResult = {
        listChannelMembers: NestedArray<ChannelMember>;
    };
    const result = (await API.graphql(gql(queries.listChannelMembers))) as {
        data: ListChannelMembersResult;
    };

    log.info(`fetchAllChannels done `);
    return result.data.listChannelMembers.items || [];
}

export default {
    fetchAllLikes,
    fetchAllComments,
    fetchAllUsers,
    fetchAllChannels,
    fetchAllChannelMembers,
    fetchAllPosts,
}