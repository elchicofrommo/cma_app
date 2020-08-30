/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const subscribeToMyPosts = /* GraphQL */ `
  subscription SubscribeToMyPosts($ownerId: ID!) {
    subscribeToMyPosts(ownerId: $ownerId) {
      id
      ownerId
      owner {
        id
        shortId
        name
      }
      content
      likes {
        items {
          postId
          userId
          user{
            name
            id
          }
          createdAt
        }

      }
      comments {
        items {
          postId
          userId
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
          id
          postId
          ownerId
          channelId
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
      postId
      channelId
      ownerId
      post {
        id
                ownerId
        owner {
          id
          name
        }
        content
        likes {
          items {
            id
            userId
            user{
              name
              id
            }
            postId
            
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
            postId
            
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
export const onCreatePost = /* GraphQL */ `
  subscription OnCreatePost {
    onCreatePost {
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
        ownedChannels {
          nextToken
        }
        createdAt
        updatedAt
        delta
      }
      content
      likes {
        items {
          id
          userId
          postId
          userName
          
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
          postId
          
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
export const onUpdatePost = /* GraphQL */ `
  subscription OnUpdatePost {
    onUpdatePost {
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
        ownedChannels {
          nextToken
        }
        createdAt
        updatedAt
        delta
      }
      content
      likes {
        items {
          id
          userId
          postId
          userName
          
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
          postId
          
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
export const onDeletePost = /* GraphQL */ `
  subscription OnDeletePost {
    onDeletePost {
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
        ownedChannels {
          nextToken
        }
        createdAt
        updatedAt
        delta
      }
      content
      likes {
        items {
          id
          userId
          postId
          userName
          
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
          postId
          
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
      postId
      userName
      
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
      postId
      userName
      
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
      postId
      userName
      
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
      postId
      
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
      postId
      
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
      postId
      
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
      postId
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
      postId
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
      postId
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
      posts {
        items {
          id
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
      posts {
        items {
          id
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
      posts {
        items {
          id
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
      broadcasts {
        items {
          id
          postId
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
      broadcasts {
        items {
          id
          postId
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
      broadcasts {
        items {
          id
          postId
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
export const onUpdateBroadcast = /* GraphQL */ `
  subscription OnUpdateBroadcast {
    onUpdateBroadcast {
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
export const onDeleteBroadcast = /* GraphQL */ `
  subscription OnDeleteBroadcast {
    onDeleteBroadcast {
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
