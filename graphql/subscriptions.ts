/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const subscribeToMyGratitudes = /* GraphQL */ `
  subscription SubscribeToMyGratitudes($ownerId: ID!) {
    subscribeToMyGratitudes(ownerId: $ownerId) {
      id
      title
      ownerId
      owner {
        id
        shortId
        name
      }
      entries {
        items {
          id
          gratitudeId
          content
          index
        }
      }
      likes {
        items {
          id
          userId
          user{
            name
            id
          }
          gratitudeId
          entryId
          createdAt
        }

      }
      comments {
        items {
          id
          userId
          user{
            name
            id
          }
          gratitudeId
          entryId
          comment
          createdAt
        }

      }

      createdAt
      updatedAt
      delta
    }
  }
`;
export const subscribeToBroadcastChannel = /* GraphQL */ `
  subscription SubscribeToBroadcastChannel($channelId: ID!) {
    subscribeToBroadcastChannel(channelId: $channelId) {
      id
      gratitudeId
      channelId
      ownerId
      gratitude {
        id
        title
        ownerId
        owner {
          id
          name
        }
        entries {
          items {
            id
            gratitudeId
            content
            index
          }
        }
        likes {
          items {
            id
            userId
            user{
              name
              id
            }
            gratitudeId
            entryId
            createdAt
          }

        }
        comments {
          items {
            id
            userId
            user{
              name
              id
            }
            gratitudeId
            entryId
            comment
            createdAt
          }

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
export const onCreateGratitude = /* GraphQL */ `
  subscription OnCreateGratitude {
    onCreateGratitude {
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
      entries {
        items {
          id
          gratitudeId
          content
          index
          delta
          createdAt
          updatedAt
        }
        nextToken
      }
      likes {
        items {
          id
          userId
          gratitudeId
          userName
          entryId
          createdAt
          updatedAt
          delta
        }
        nextToken
      }
      comments {
        items {
          id
          userId
          gratitudeId
          entryId
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
          gratitudeId
          ownerId
          channelId
          createdAt
          updatedAt
          delta
        }
        nextToken
      }
      createdAt
      updatedAt
      delta
    }
  }
`;
export const onUpdateGratitude = /* GraphQL */ `
  subscription OnUpdateGratitude {
    onUpdateGratitude {
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
      entries {
        items {
          id
          gratitudeId
          content
          index
          delta
          createdAt
          updatedAt
        }
        nextToken
      }
      likes {
        items {
          id
          userId
          gratitudeId
          userName
          entryId
          createdAt
          updatedAt
          delta
        }
        nextToken
      }
      comments {
        items {
          id
          userId
          gratitudeId
          entryId
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
          gratitudeId
          ownerId
          channelId
          createdAt
          updatedAt
          delta
        }
        nextToken
      }
      createdAt
      updatedAt
      delta
    }
  }
`;
export const onDeleteGratitude = /* GraphQL */ `
  subscription OnDeleteGratitude {
    onDeleteGratitude {
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
      entries {
        items {
          id
          gratitudeId
          content
          index
          delta
          createdAt
          updatedAt
        }
        nextToken
      }
      likes {
        items {
          id
          userId
          gratitudeId
          userName
          entryId
          createdAt
          updatedAt
          delta
        }
        nextToken
      }
      comments {
        items {
          id
          userId
          gratitudeId
          entryId
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
          gratitudeId
          ownerId
          channelId
          createdAt
          updatedAt
          delta
        }
        nextToken
      }
      createdAt
      updatedAt
      delta
    }
  }
`;
export const onCreateLike = /* GraphQL */ `
  subscription OnCreateLike {
    onCreateLike {
      id
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
      gratitudeId
      userName
      entryId
      createdAt
      updatedAt
      delta
    }
  }
`;
export const onUpdateLike = /* GraphQL */ `
  subscription OnUpdateLike {
    onUpdateLike {
      id
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
      gratitudeId
      userName
      entryId
      createdAt
      updatedAt
      delta
    }
  }
`;
export const onDeleteLike = /* GraphQL */ `
  subscription OnDeleteLike {
    onDeleteLike {
      id
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
      gratitudeId
      userName
      entryId
      createdAt
      updatedAt
      delta
    }
  }
`;
export const onCreateComment = /* GraphQL */ `
  subscription OnCreateComment {
    onCreateComment {
      id
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
      gratitudeId
      entryId
      comment
      createdAt
      updatedAt
      delta
    }
  }
`;
export const onUpdateComment = /* GraphQL */ `
  subscription OnUpdateComment {
    onUpdateComment {
      id
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
      gratitudeId
      entryId
      comment
      createdAt
      updatedAt
      delta
    }
  }
`;
export const onDeleteComment = /* GraphQL */ `
  subscription OnDeleteComment {
    onDeleteComment {
      id
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
      gratitudeId
      entryId
      comment
      createdAt
      updatedAt
      delta
    }
  }
`;
export const onCreateEntry = /* GraphQL */ `
  subscription OnCreateEntry {
    onCreateEntry {
      id
      gratitudeId
      content
      index
      delta
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateEntry = /* GraphQL */ `
  subscription OnUpdateEntry {
    onUpdateEntry {
      id
      gratitudeId
      content
      index
      delta
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteEntry = /* GraphQL */ `
  subscription OnDeleteEntry {
    onDeleteEntry {
      id
      gratitudeId
      content
      index
      delta
      createdAt
      updatedAt
    }
  }
`;
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser {
    onCreateUser {
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
          id
          channelId
          userId
          createdAt
          updatedAt
          delta
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
          delta
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
          delta
        }
        nextToken
      }
      createdAt
      updatedAt
      delta
    }
  }
`;
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser {
    onUpdateUser {
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
          id
          channelId
          userId
          createdAt
          updatedAt
          delta
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
          delta
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
          delta
        }
        nextToken
      }
      createdAt
      updatedAt
      delta
    }
  }
`;
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser {
    onDeleteUser {
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
          id
          channelId
          userId
          createdAt
          updatedAt
          delta
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
          delta
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
          delta
        }
        nextToken
      }
      createdAt
      updatedAt
      delta
    }
  }
`;
export const onCreateChannel = /* GraphQL */ `
  subscription OnCreateChannel {
    onCreateChannel {
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
      broadcasts {
        items {
          id
          gratitudeId
          ownerId
          channelId
          createdAt
          updatedAt
          delta
        }
        nextToken
      }
      subscriptions {
        items {
          id
          channelId
          userId
          createdAt
          updatedAt
          delta
        }
        nextToken
      }
      createdAt
      updatedAt
      delta
    }
  }
`;
export const onUpdateChannel = /* GraphQL */ `
  subscription OnUpdateChannel {
    onUpdateChannel {
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
      broadcasts {
        items {
          id
          gratitudeId
          ownerId
          channelId
          createdAt
          updatedAt
          delta
        }
        nextToken
      }
      subscriptions {
        items {
          id
          channelId
          userId
          createdAt
          updatedAt
          delta
        }
        nextToken
      }
      createdAt
      updatedAt
      delta
    }
  }
`;
export const onDeleteChannel = /* GraphQL */ `
  subscription OnDeleteChannel {
    onDeleteChannel {
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
      broadcasts {
        items {
          id
          gratitudeId
          ownerId
          channelId
          createdAt
          updatedAt
          delta
        }
        nextToken
      }
      subscriptions {
        items {
          id
          channelId
          userId
          createdAt
          updatedAt
          delta
        }
        nextToken
      }
      createdAt
      updatedAt
      delta
    }
  }
`;
export const onCreateUserChannel = /* GraphQL */ `
  subscription OnCreateUserChannel {
    onCreateUserChannel {
      id
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
      createdAt
      updatedAt
      delta
    }
  }
`;
export const onUpdateUserChannel = /* GraphQL */ `
  subscription OnUpdateUserChannel {
    onUpdateUserChannel {
      id
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
      createdAt
      updatedAt
      delta
    }
  }
`;
export const onDeleteUserChannel = /* GraphQL */ `
  subscription OnDeleteUserChannel {
    onDeleteUserChannel {
      id
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
      createdAt
      updatedAt
      delta
    }
  }
`;
export const onCreateBroadcast = /* GraphQL */ `
  subscription OnCreateBroadcast {
    onCreateBroadcast {
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
export const onUpdateBroadcast = /* GraphQL */ `
  subscription OnUpdateBroadcast {
    onUpdateBroadcast {
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
export const onDeleteBroadcast = /* GraphQL */ `
  subscription OnDeleteBroadcast {
    onDeleteBroadcast {
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
