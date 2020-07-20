/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten
enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}

export const getGratitude = /* GraphQL */ `
  query GetGratitude($id: ID!) {
    getGratitude(id: $id) {
      id
      title
      ownerId
      entries {
        items {
          id
          gratitudeId
          content
          index
        }
        nextToken
      }
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
      broadcasts {
        items {
          id
        }
      }

      createdAt
      updatedAt
    }
  }
`;
export const listGratitudes = /* GraphQL */ `
  query ListGratitudes(
    $filter: ModelGratitudeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listGratitudes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        ownerId
        owner {
          id
          shortId
          name
          email
        }
        entries {
            items{
              id
              gratitudeId
              content
              index
            }
          }
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
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const listShortGratitudes = /* GraphQL */ `
  query ListGratitudes(
    $filter: ModelGratitudeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listGratitudes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
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
    listGratitudeByOwner(
      ownerId: $id,
      sortDirection: DESC,
      limit: 50
    ){
      items {
          id
          title
          ownerId
          owner {
            id
            name
            email
          }
          createdAt
          entries {
            items{
              id
              gratitudeId
              content
              index
            }
          }
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
            items {
              channelId
              id
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
      gratitudes {
        items {
          id
          title
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
      gratitudeId
      gratitude {
        id
        title
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
        entries {
          nextToken
        }
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
        gratitudes {
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
        gratitudeId
        gratitude {
          id
          title
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
export const listGratitudeByOwner = /* GraphQL */ `
  query ListGratitudeByOwner(
    $ownerId: ID
    $createdAt: ModelIntKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelGratitudeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listGratitudeByOwner(
      ownerId: $ownerId
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        title
        ownerId
        owner {
          id
          shortId
          name
          email
          createdAt
          updatedAt
        }
        entries {
          items{
              id
              content
              index
              gratitudeId
          }
        }

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
            channelId
          }
        }
    }
    }
  }
`;
export const listLikesByGratitude = /* GraphQL */ `
  query ListLikesByGratitude(
    $gratitudeId: ID
    $createdAt: ModelIntKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelLikeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLikesByGratitude(
      gratitudeId: $gratitudeId
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userId
        gratitudeId
        userName
        entryId
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const listLikesByEntry = /* GraphQL */ `
  query ListLikesByEntry(
    $entryId: ID
    $createdAt: ModelIntKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelLikeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLikesByEntry(
      entryId: $entryId
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userId
        gratitudeId
        userName
        entryId
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const listLikesByUser = /* GraphQL */ `
  query ListLikesByUser(
    $userId: ID
    $createdAt: ModelIntKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelLikeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLikesByUser(
      userId: $userId
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userId
        gratitudeId
        userName
        entryId
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const listCommentsByGratitude = /* GraphQL */ `
  query ListCommentsByGratitude(
    $gratitudeId: ID
    $createdAt: ModelIntKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCommentsByGratitude(
      gratitudeId: $gratitudeId
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userId
        gratitudeId
        entryId
        comment
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const listCommentsByEntry = /* GraphQL */ `
  query ListCommentsByEntry(
    $entryId: ID
    $createdAt: ModelIntKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCommentsByEntry(
      entryId: $entryId
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userId
        gratitudeId
        entryId
        comment
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const listCommentsByUser = /* GraphQL */ `
  query ListCommentsByUser(
    $userId: ID
    $createdAt: ModelIntKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCommentsByUser(
      userId: $userId
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userId
        gratitudeId
        entryId
        comment
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const listEntryByGratitude = /* GraphQL */ `
  query ListEntryByGratitude(
    $gratitudeId: ID
    $createdAt: ModelIntKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelEntryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listEntryByGratitude(
      gratitudeId: $gratitudeId
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        gratitudeId
        content
        likes {
          nextToken
        }
        comments {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
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
export const listBrodcastByGratitude = /* GraphQL */ `
  query ListBrodcastByGratitude(
    $gratitudeId: ID
    $createdAt: ModelIntKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelBroadcastFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listBrodcastByGratitude(
      gratitudeId: $gratitudeId
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        gratitudeId
        gratitude {
          id
          title
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
        gratitudeId
        channelId

        gratitude{
          id
          ownerId
          owner{
            name
            id
          }
          title
          entries{
            items{
              content
              id
              index
            }

          }
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
