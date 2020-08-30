/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPost = /* GraphQL */ `
  query GetPost($id: ID!) {
    getPost(id: $id) {
      id
      ownerId
      owner {
        id
        shortId
        name
        email
        dos
        role
        shareDos
        meetingIds
        channels {
          items {
            channelId
            userId
            createdAt
            updatedAt
            delta
          }
          nextToken
        }
        posts {
          items {
            id
            ownerId
            content
            createdAt
            updatedAt
            updatedBy
            delta
          }
          nextToken
        }
        createdAt
        updatedBy
        updatedAt
        delta
      }
      content
      likes {
        items {
          postId
          userId
          user {
            id
            shortId
            name
            email
            dos
            role
            shareDos
            meetingIds
            createdAt
            updatedBy
            updatedAt
            delta
          }
          userName
          createdAt
          updatedAt
          delta
        }
        nextToken
      }
      comments {
        items {
          postId
          userId
          user {
            id
            shortId
            name
            email
            dos
            role
            shareDos
            meetingIds
            createdAt
            updatedBy
            updatedAt
            delta
          }
          comment
          createdAt
          updatedAt
          delta
        }
        nextToken
      }
      broadcasts {
        items {
          id
          postId
          post {
            id
            ownerId
            content
            createdAt
            updatedAt
            updatedBy
            delta
          }
          ownerId
          owner {
            id
            shortId
            name
            email
            dos
            role
            shareDos
            meetingIds
            createdAt
            updatedBy
            updatedAt
            delta
          }
          channelId
          channel {
            id
            name
            shortId
            ownerIds
            createdAt
            updatedAt
            delta
          }
          createdAt
          updatedAt
          updatedBy
          delta
        }
        nextToken
      }
      createdAt
      updatedAt
      updatedBy
      delta
    }
  }
`;
export const listPosts = /* GraphQL */ `
  query ListPosts(
    $filter: ModelPostFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPosts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        ownerId
        owner {
          id
          shortId
          name
          email
          dos
          role
          shareDos
          meetingIds
          channels {
            nextToken
          }
          posts {
            nextToken
          }
          createdAt
          updatedBy
          updatedAt
          delta
        }
        content
        likes {
          items {
            postId
            userId
            userName
            createdAt
            updatedAt
            delta
          }
          nextToken
        }
        comments {
          items {
            postId
            userId
            comment
            createdAt
            updatedAt
            delta
          }
          nextToken
        }
        broadcasts {
          items {
            id
            postId
            ownerId
            channelId
            createdAt
            updatedAt
            updatedBy
            delta
          }
          nextToken
        }
        createdAt
        updatedAt
        updatedBy
        delta
      }
      nextToken
    }
  }
`;
export const getLike = /* GraphQL */ `
  query GetLike($userId: ID!, $postId: ID!) {
    getLike(userId: $userId, postId: $postId) {
      postId
      userId
      user {
        id
        shortId
        name
        email
        dos
        role
        shareDos
        meetingIds
        channels {
          items {
            channelId
            userId
            createdAt
            updatedAt
            delta
          }
          nextToken
        }
        posts {
          items {
            id
            ownerId
            content
            createdAt
            updatedAt
            updatedBy
            delta
          }
          nextToken
        }
        createdAt
        updatedBy
        updatedAt
        delta
      }
      userName
      createdAt
      updatedAt
      delta
    }
  }
`;
export const listLikes = /* GraphQL */ `
  query ListLikes(
    $userId: ID
    $postId: ModelIDKeyConditionInput
    $filter: ModelLikeFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listLikes(
      userId: $userId
      postId: $postId
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        postId
        userId
        user {
          id
          shortId
          name
          email
          dos
          role
          shareDos
          meetingIds
          channels {
            nextToken
          }
          posts {
            nextToken
          }
          createdAt
          updatedBy
          updatedAt
          delta
        }
        userName
        createdAt
        updatedAt
        delta
      }
      nextToken
    }
  }
`;
export const getComment = /* GraphQL */ `
  query GetComment($postId: ID!, $createdAt: String!) {
    getComment(postId: $postId, createdAt: $createdAt) {
      postId
      userId
      user {
        id
        shortId
        name
        email
        dos
        role
        shareDos
        meetingIds
        channels {
          items {
            channelId
            userId
            createdAt
            updatedAt
            delta
          }
          nextToken
        }
        posts {
          items {
            id
            ownerId
            content
            createdAt
            updatedAt
            updatedBy
            delta
          }
          nextToken
        }
        createdAt
        updatedBy
        updatedAt
        delta
      }
      comment
      createdAt
      updatedAt
      delta
    }
  }
`;
export const listComments = /* GraphQL */ `
  query ListComments(
    $postId: ID
    $createdAt: ModelStringKeyConditionInput
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listComments(
      postId: $postId
      createdAt: $createdAt
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        postId
        userId
        user {
          id
          shortId
          name
          email
          dos
          role
          shareDos
          meetingIds
          channels {
            nextToken
          }
          posts {
            nextToken
          }
          createdAt
          updatedBy
          updatedAt
          delta
        }
        comment
        createdAt
        updatedAt
        delta
      }
      nextToken
    }
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      shortId
      name
      email
      dos
      role
      shareDos
      meetingIds
      channels {
        items {
          channelId
          channel {
            id
            name
            shortId
            ownerIds
            createdAt
            updatedAt
            delta
          }
          userId
          createdAt
          updatedAt
          delta
        }
        nextToken
      }
      posts {
        items {
          id
          ownerId
          owner {
            id
            shortId
            name
            email
            dos
            role
            shareDos
            meetingIds
            createdAt
            updatedBy
            updatedAt
            delta
          }
          content
          likes {
            nextToken
          }
          comments {
            nextToken
          }
          broadcasts {
            nextToken
          }
          createdAt
          updatedAt
          updatedBy
          delta
        }
        nextToken
      }
      createdAt
      updatedBy
      updatedAt
      delta
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        shortId
        name
        email
        dos
        role
        shareDos
        meetingIds
        channels {
          items {
            channelId
            userId
            createdAt
            updatedAt
            delta
          }
          nextToken
        }
        posts {
          items {
            id
            ownerId
            content
            createdAt
            updatedAt
            updatedBy
            delta
          }
          nextToken
        }
        createdAt
        updatedBy
        updatedAt
        delta
      }
      nextToken
    }
  }
`;
export const getChannel = /* GraphQL */ `
  query GetChannel($id: ID!) {
    getChannel(id: $id) {
      id
      name
      shortId
      ownerIds
      createdAt
      updatedAt
      delta
    }
  }
`;
export const listChannels = /* GraphQL */ `
  query ListChannels(
    $filter: ModelChannelFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listChannels(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        shortId
        ownerIds
        createdAt
        updatedAt
        delta
      }
      nextToken
    }
  }
`;
export const getChannelMember = /* GraphQL */ `
  query GetChannelMember($userId: ID!, $channelId: ID!) {
    getChannelMember(userId: $userId, channelId: $channelId) {
      channelId
      channel {
        id
        name
        shortId
        ownerIds
        createdAt
        updatedAt
        delta
      }
      userId
      createdAt
      updatedAt
      delta
    }
  }
`;
export const listChannelMembers = /* GraphQL */ `
  query ListChannelMembers(
    $userId: ID
    $channelId: ModelIDKeyConditionInput
    $filter: ModelChannelMemberFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listChannelMembers(
      userId: $userId
      channelId: $channelId
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        channelId
        channel {
          id
          name
          shortId
          ownerIds
          createdAt
          updatedAt
          delta
        }
        userId
        createdAt
        updatedAt
        delta
      }
      nextToken
    }
  }
`;
export const getBroadcast = /* GraphQL */ `
  query GetBroadcast($id: ID!) {
    getBroadcast(id: $id) {
      id
      postId
      post {
        id
        ownerId
        owner {
          id
          shortId
          name
          email
          dos
          role
          shareDos
          meetingIds
          channels {
            nextToken
          }
          posts {
            nextToken
          }
          createdAt
          updatedBy
          updatedAt
          delta
        }
        content
        likes {
          items {
            postId
            userId
            userName
            createdAt
            updatedAt
            delta
          }
          nextToken
        }
        comments {
          items {
            postId
            userId
            comment
            createdAt
            updatedAt
            delta
          }
          nextToken
        }
        broadcasts {
          items {
            id
            postId
            ownerId
            channelId
            createdAt
            updatedAt
            updatedBy
            delta
          }
          nextToken
        }
        createdAt
        updatedAt
        updatedBy
        delta
      }
      ownerId
      owner {
        id
        shortId
        name
        email
        dos
        role
        shareDos
        meetingIds
        channels {
          items {
            channelId
            userId
            createdAt
            updatedAt
            delta
          }
          nextToken
        }
        posts {
          items {
            id
            ownerId
            content
            createdAt
            updatedAt
            updatedBy
            delta
          }
          nextToken
        }
        createdAt
        updatedBy
        updatedAt
        delta
      }
      channelId
      channel {
        id
        name
        shortId
        ownerIds
        createdAt
        updatedAt
        delta
      }
      createdAt
      updatedAt
      updatedBy
      delta
    }
  }
`;
export const listBroadcasts = /* GraphQL */ `
  query ListBroadcasts(
    $filter: ModelBroadcastFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listBroadcasts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        postId
        post {
          id
          ownerId
          owner {
            id
            shortId
            name
            email
            dos
            role
            shareDos
            meetingIds
            createdAt
            updatedBy
            updatedAt
            delta
          }
          content
          likes {
            nextToken
          }
          comments {
            nextToken
          }
          broadcasts {
            nextToken
          }
          createdAt
          updatedAt
          updatedBy
          delta
        }
        ownerId
        owner {
          id
          shortId
          name
          email
          dos
          role
          shareDos
          meetingIds
          channels {
            nextToken
          }
          posts {
            nextToken
          }
          createdAt
          updatedBy
          updatedAt
          delta
        }
        channelId
        channel {
          id
          name
          shortId
          ownerIds
          createdAt
          updatedAt
          delta
        }
        createdAt
        updatedAt
        updatedBy
        delta
      }
      nextToken
    }
  }
`;
export const listPostByOwner = /* GraphQL */ `
  query ListPostByOwner(
    $ownerId: ID
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPostFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPostByOwner(
      ownerId: $ownerId
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        ownerId
        owner {
          id
          shortId
          name
          email
          dos
          role
          shareDos
          meetingIds
          channels {
            nextToken
          }
          posts {
            nextToken
          }
          createdAt
          updatedBy
          updatedAt
          delta
        }
        content
        likes {
          items {
            postId
            userId
            userName
            createdAt
            updatedAt
            delta
          }
          nextToken
        }
        comments {
          items {
            postId
            userId
            comment
            createdAt
            updatedAt
            delta
          }
          nextToken
        }
        broadcasts {
          items {
            id
            postId
            ownerId
            channelId
            createdAt
            updatedAt
            updatedBy
            delta
          }
          nextToken
        }
        createdAt
        updatedAt
        updatedBy
        delta
      }
      nextToken
    }
  }
`;
export const listLikesByPost = /* GraphQL */ `
  query ListLikesByPost(
    $postId: ID
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelLikeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLikesByPost(
      postId: $postId
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        postId
        userId
        user {
          id
          shortId
          name
          email
          dos
          role
          shareDos
          meetingIds
          channels {
            nextToken
          }
          posts {
            nextToken
          }
          createdAt
          updatedBy
          updatedAt
          delta
        }
        userName
        createdAt
        updatedAt
        delta
      }
      nextToken
    }
  }
`;
export const listUserByChannel = /* GraphQL */ `
  query ListUserByChannel(
    $channelId: ID
    $userId: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelChannelMemberFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserByChannel(
      channelId: $channelId
      userId: $userId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        channelId
        channel {
          id
          name
          shortId
          ownerIds
          createdAt
          updatedAt
          delta
        }
        userId
        createdAt
        updatedAt
        delta
      }
      nextToken
    }
  }
`;
export const listBrodcastByPost = /* GraphQL */ `
  query ListBrodcastByPost(
    $postId: ID
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelBroadcastFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listBrodcastByPost(
      postId: $postId
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        postId
        post {
          id
          ownerId
          owner {
            id
            shortId
            name
            email
            dos
            role
            shareDos
            meetingIds
            createdAt
            updatedBy
            updatedAt
            delta
          }
          content
          likes {
            nextToken
          }
          comments {
            nextToken
          }
          broadcasts {
            nextToken
          }
          createdAt
          updatedAt
          updatedBy
          delta
        }
        ownerId
        owner {
          id
          shortId
          name
          email
          dos
          role
          shareDos
          meetingIds
          channels {
            nextToken
          }
          posts {
            nextToken
          }
          createdAt
          updatedBy
          updatedAt
          delta
        }
        channelId
        channel {
          id
          name
          shortId
          ownerIds
          createdAt
          updatedAt
          delta
        }
        createdAt
        updatedAt
        updatedBy
        delta
      }
      nextToken
    }
  }
`;
export const listBroadcastByChannel = /* GraphQL */ `
  query ListBroadcastByChannel(
    $channelId: ID
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelBroadcastFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listBroadcastByChannel(
      channelId: $channelId
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        postId
        post {
          id
          ownerId
          owner {
            id
            shortId
            name
            email
            dos
            role
            shareDos
            meetingIds
            createdAt
            updatedBy
            updatedAt
            delta
          }
          content
          likes {
            nextToken
          }
          comments {
            nextToken
          }
          broadcasts {
            nextToken
          }
          createdAt
          updatedAt
          updatedBy
          delta
        }
        ownerId
        owner {
          id
          shortId
          name
          email
          dos
          role
          shareDos
          meetingIds
          channels {
            nextToken
          }
          posts {
            nextToken
          }
          createdAt
          updatedBy
          updatedAt
          delta
        }
        channelId
        channel {
          id
          name
          shortId
          ownerIds
          createdAt
          updatedAt
          delta
        }
        createdAt
        updatedAt
        updatedBy
        delta
      }
      nextToken
    }
  }
`;

/******************* custom queries*************/


export const listShortPosts = /* GraphQL */ `
  query ListPosts(
    $filter: ModelPostFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPosts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        ownerId
        owner {
          id
          name
        }
        createdAt
        updatedAt
      }
      nextToken
      
    }
  }
`;

export const getOperatingUser = /* GraphQL */ `

  query GetOperationalUser($id: ID!) {
    listChannelByOwner(
      ownerId: $id
      limit: 50
    ){
      items{
        id
        name
      }
    }
    listChannelByUser(
      userId: $id
      limit: 50
    ){
      items{
        channelId
        channel{
          name
        }
        userId
        createdAt
        updatedAt
      }
    }
    listPostByOwner(
      ownerId: $id,
      sortDirection: DESC,
      limit: 50
    ){
      items {
          id
           ownerId
          owner {
            id
            name
            email
          }
          createdAt
          content
          likes {
            items{
              postId
              userId
              user{
                id
                name
              }
            }
          }
          comments {
            items{
              postId
              userId
              user{
                id
                name
              }
              comment
              createdAt
            }
          }
          broadcasts{
            items{
              id
              postId
              ownerId
              channelId
            }
          }
        }
    }
    getUser(id: $id) {
      id
      shortId
      name
      email
      dos
      role
      meetingIds
      shareDos
      createdAt
      updatedAt
    }
  }
`;
export const listUsersShort = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        shortId
        name
        email
        dos
        role
        shareDos
        createdAt
        updatedAt
      }
      nextToken
      
    }
  }
`;
export const getChannelDetails = /* GraphQL */ `
  query GetChannelDetails($id: ID!) {
    getChannel(id: $id) {
      id
      shortId
      name
      ownerId
      owner {
        id
        shortId
        name
        updatedAt
      }
      createdAt
      updatedAt
    }
    listUserByChannel(channelId: $id){
      items{
        user{
          id
          name
        }
      }
    }
  }
`;