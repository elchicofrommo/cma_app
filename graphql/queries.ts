/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten
enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}

export const getPost = /* GraphQL */ `
  query GetPost($id: ID!) {
    getPost(id: $id) {
      id
            ownerId
      conent
      likes {
        items {
          id
          userId
          user{
            id
            name
          }
        }
        nextToken
      }
      comments {
        items {
          id
          userId
          user{
            id
            name
          }
          comment
          createdAt
        }
        nextToken
      }
      broadcasts{
        items{
          id
          postId
          ownerId
          channelId
        }
      }

      createdAt
      updatedAt
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
        }
        content
          likes {
            items{
              userId
              id
                  user{
                    name
                    id
                  }
            }
          }
          comments {
            items{
              userId
              id
                  user{
                    name
                    id
                  }
              comment
              createdAt
            }
          }
          broadcasts{
          items{
              channelId
            }
          }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
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
        id
        channelId
        channel{
          name
        }
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
              id
              userId
              user{
                id
                name
              }
            }
          }
          comments {
            items{
              id
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
      channels {
        items {
          id
          channelId
          userId
          createdAt
          updatedAt
        }
        nextToken
      }
      posts {
        items {
          id
                    ownerId
          createdAt
          updatedAt
        }
        nextToken
      }
      ownedChannels {
        items {
          id
          shortId
          name
          ownerId
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
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
        createdAt
        updatedAt
      }
      nextToken
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
export const getChannel = /* GraphQL */ `
  query GetChannel($id: ID!) {
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
export const listChannels = /* GraphQL */ `
  query ListChannels(
    $filter: ModelChannelFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listChannels(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        shortId
        name
        ownerId
        owner {
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
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getUserChannel = /* GraphQL */ `
  query GetUserChannel($id: ID!) {
    getUserChannel(id: $id) {
      id
      channelId
      userId
      createdAt
      updatedAt
    }
  }
`;
export const listUserChannels = /* GraphQL */ `
  query ListUserChannels(
    $filter: ModelUserChannelFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserChannels(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        channelId
        channel {
          id
          shortId
          name
          ownerId
          createdAt
          updatedAt
        }
        userId
        createdAt
        updatedAt
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
          createdAt
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
        ownedChannels {
          nextToken
        }
        createdAt
        updatedAt
        delta
      }
      channelId
      channel {
        id
        shortId
        name
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
          updatedAt
          delta
        }
        broadcasts {
          nextToken
        }
        subscriptions {
          nextToken
        }
        createdAt
        updatedAt
        delta
      }
      createdAt
      updatedAt
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
          createdAt
          updatedAt
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
          updatedAt
          delta
        }
        channelId
        channel {
          id
          shortId
          name
          ownerId
          createdAt
          updatedAt
          delta
        }
        createdAt
        updatedAt
        delta
      }
      nextToken
    }
  }
`;
export const listPostByOwner = /* GraphQL */ `
  query ListPostByOwner(
    $ownerId: ID
    $createdAt: ModelIntKeyConditionInput
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
          createdAt
          updatedAt
        }
        content

        likes {
          items{
              userId

            }
        }
        comments {
            items{
              userId

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
    }
    }
  }
`;

export const listUserByEmail = /* GraphQL */ `
  query ListUserByEmail(
    $email: String
    $sortDirection: ModelSortDirection
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserByEmail(
      email: $email
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
export const listUserByShortId = /* GraphQL */ `
  query ListUserByShortId(
    $shortId: String
    $sortDirection: ModelSortDirection
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserByShortId(
      shortId: $shortId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
export const listChannelByOwner = /* GraphQL */ `
  query ListChannelByOwner(
    $ownerId: ID
    $sortDirection: ModelSortDirection
    $filter: ModelChannelFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listChannelByOwner(
      ownerId: $ownerId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        shortId
        name
        ownerId
        owner {
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
        
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const listChannelByShortId = /* GraphQL */ `
  query ListChannelByShortId(
    $shortId: String
    $sortDirection: ModelSortDirection
    $filter: ModelChannelFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listChannelByShortId(
      shortId: $shortId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        shortId
        name
        ownerId
        owner {
          id
          shortId
          name
          
        }
        createdAt
        updatedAt
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
    $filter: ModelUserChannelFilterInput
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
        id
        channelId
        userId
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const listChannelByUser = /* GraphQL */ `
  query ListChannelByUser(
    $userId: ID
    $channelId: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelUserChannelFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listChannelByUser(
      userId: $userId
      channelId: $channelId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        channelId
        channel {
          id
          shortId
          name
          ownerId
          createdAt
          updatedAt
        }
        userId
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const listBrodcastByPost = /* GraphQL */ `
  query ListBrodcastByPost(
    $postId: ID
    $createdAt: ModelIntKeyConditionInput
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
          createdAt
          updatedAt
        }
        channelId
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const listBroadcastByChannel = /* GraphQL */ `
  query ListBroadcastByChannel(
    $channelId: ID
    $createdAt: ModelIntKeyConditionInput
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
        channelId

        post{
          id
          ownerId
          owner{
            name
            id
          }
                    content
          likes{
            items{
              id
              userId
              user{
                id
                name
              }
            }
          }
          comments{
            items{
              id
              userId
              comment
              createdAt
              user{
                id
                name
              }
            }
          }
          createdAt
          updatedAt

        }

        createdAt
        updatedAt
      }
      nextToken
      
    }
  }
`;
