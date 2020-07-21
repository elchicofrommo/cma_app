/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const commentOnGratitude = /* GraphQL */ `
mutation CommentOnGratitude(
    $gratitudeId: ID!
    $userId: ID!
    $comment: String!
  ) {
    createComment(input: {gratitudeId: $gratitudeId, userId: $userId, comment: $comment}) {
      id
      userId
      gratitudeId
      user{
          id
          name
      }
      entryId
      createdAt
      updatedAt
    }
    updateGratitude( input: {id: $gratitudeId}){
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
      broadcasts{
        items{
          id
          gratitudeId
          ownerId
          channelId
        }
      }

      createdAt
      updatedAt
      delta
    }
    listBrodcastByGratitude( gratitudeId: $gratitudeId){
      items {
        id
        gratitudeId
        channelId
        createdAt
        updatedAt
      }
    }
  }
`;

export const likeGratitude = /* GraphQL */ `
mutation LikeGratitude(
    $gratitudeId: ID!
    $userId: ID!
  ) {
    createLike(input: {gratitudeId: $gratitudeId, userId: $userId}) {
      id
      userId
      gratitudeId
      user{
          id
          name
      }
      entryId
      createdAt
      updatedAt
    }
    updateGratitude( input: {id: $gratitudeId}){
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
      broadcasts{
        items{
          id
          gratitudeId
          ownerId
          channelId
        }
      }

      createdAt
      updatedAt
      delta
    }
    listBrodcastByGratitude( gratitudeId: $gratitudeId){
      items {
        id
        gratitudeId
        channelId
        createdAt
        updatedAt
      }
    }
  }
`;

export const unlikeGratitude = /* GraphQL */ `
  mutation UnlikeGratitude(
    $likeId: ID!
    $gratitudeId: ID!
  ) {
    deleteLike(input: {id: $likeId}) {
      id
      userId
      gratitudeId
      user{
            name
          }
      entryId
      createdAt
      updatedAt
    }
    updateGratitude( input: {id: $gratitudeId}){
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
      broadcasts{
        items{
          id
          gratitudeId
          ownerId
          channelId
        }
      }

      createdAt
      updatedAt
      delta
    }
    listBrodcastByGratitude( gratitudeId: $gratitudeId){
      items {
        id
        gratitudeId
        channelId
        createdAt
        updatedAt
      }
    } 
  }
`;


export const uncommentOnGratitude = /* GraphQL */ `
  mutation UncommentOnGratitude(
    $commentId: ID!
    $gratitudeId: ID!
  ) {
    deleteLike(input: {id: $likeId}) {
      id
      userId
      gratitudeId
      entryId
      createdAt
      updatedAt
    }
    updateGratitude( input: {id: $gratitudeId}){
      id
      title
      ownerId
      createdAt
      updatedAt
      delta
      entries{
        items{
          id
          content
          index
        }
      }
      comments{
        items{
          userId
          comment
          createdAt
          user{
            name
          }
        }
      }
      likes{
        items{
          userId
          user{
            name
          }
        }
      }
      broadcasts{
        items{
          id
          gratitudeId
          ownerId
          channelId
        }
      }
    }
  }
`;

export const createGratitude = /* GraphQL */ `
  mutation CreateGratitude(
    $input: CreateGratitudeInput!
  ) {
    createGratitude( input: $input){
      id
      title
      ownerId
      owner {
        id
        shortId
        name
      }
      createdAt
      updatedAt
      delta
      entries{
        items{
          id
          gratitudeId
          content
          index
        }
      }
      comments{
        items{
          userId
          user{
            name
            id
          }
          comment
          createdAt
        }
      }
      likes{
        items{
          userId
          user{
            name
            id
          }
        }
      }
      broadcasts{
        items{
          id
          gratitudeId
          ownerId
          channelId
        }
      }
    }

  }
`;

export const updateGratitude = /* GraphQL */ `
  mutation UpdateGratitude(
    $input: UpdateGratitudeInput!
    $condition: ModelGratitudeConditionInput
  ) {
    updateGratitude(input: $input, condition: $condition) {
      id
      title
      ownerId
      owner {
        id
        shortId
        name
      }
      createdAt
      updatedAt
      delta
      entries{
        items{
          id
          gratitudeId
          content
          index
        }
      }
      comments{
        items{
          userId
          user{
            name
            id
          }
          comment
          createdAt
        }
      }
      likes{
        items{
          user{
            name
            id
          }
          userId
        }
      }
      broadcasts{
        items{
          id
          gratitudeId
          ownerId
          channelId
        }
      }
    }
  }
`;
export const deleteGratitude = /* GraphQL */ `
  mutation DeleteGratitude(
    $input: DeleteGratitudeInput!
    $condition: ModelGratitudeConditionInput
  ) {
    deleteGratitude(input: $input, condition: $condition) {
      id
      title
      ownerId
      createdAt
      updatedAt
      delta
    }
  }
`;
export const createLike = /* GraphQL */ `
  mutation CreateLike(
    $input: CreateLikeInput!
    $condition: ModelLikeConditionInput
  ) {
    createLike(input: $input, condition: $condition) {
      id
      userId
      gratitudeId
      userName
      entryId
      createdAt
      updatedAt
    }
  }
`;
export const updateLike = /* GraphQL */ `
  mutation UpdateLike(
    $input: UpdateLikeInput!
    $condition: ModelLikeConditionInput
  ) {
    updateLike(input: $input, condition: $condition) {
      id
      userId
      gratitudeId
      userName
      entryId
      createdAt
      updatedAt
    }
  }
`;
export const deleteLike = /* GraphQL */ `
  mutation DeleteLike(
    $input: DeleteLikeInput!
    $condition: ModelLikeConditionInput
  ) {
    deleteLike(input: $input, condition: $condition) {
      id
      userId
      gratitudeId
      userName
      entryId
      createdAt
      updatedAt
    }
  }
`;
export const createComment = /* GraphQL */ `
  mutation CreateComment(
    $input: CreateCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    createComment(input: $input, condition: $condition) {
      id
      userId
      gratitudeId
      entryId
      comment
      createdAt
      updatedAt
    }
  }
`;
export const updateComment = /* GraphQL */ `
  mutation UpdateComment(
    $input: UpdateCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    updateComment(input: $input, condition: $condition) {
      id
      userId
      gratitudeId
      entryId
      comment
      createdAt
      updatedAt
    }
  }
`;
export const deleteComment = /* GraphQL */ `
  mutation DeleteComment(
    $input: DeleteCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    deleteComment(input: $input, condition: $condition) {
      id
      userId
      gratitudeId
      entryId
      comment
      createdAt
      updatedAt
    }
  }
`;
export const createEntry = /* GraphQL */ `
  mutation CreateEntry(
    $input: CreateEntryInput!
    $condition: ModelEntryConditionInput
  ) {
    createEntry(input: $input, condition: $condition) {
      id
      gratitudeId
      content
      index
    }
  }
`;
export const updateEntry = /* GraphQL */ `
  mutation UpdateEntry(
    $input: UpdateEntryInput!
    $condition: ModelEntryConditionInput
  ) {
    updateEntry(input: $input, condition: $condition) {
      id
      gratitudeId
      content
      index
    }
  }
`;
export const deleteEntry = /* GraphQL */ `
  mutation DeleteEntry(
    $input: DeleteEntryInput!
    $condition: ModelEntryConditionInput
  ) {
    deleteEntry(input: $input, condition: $condition) {
      id
      gratitudeId
      content
      index
    }
  }
`;
export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
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
  }
`;
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
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
  }
`;
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
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
  }
`;
export const createChannel = /* GraphQL */ `
  mutation CreateChannel(
    $input: CreateChannelInput!
    $condition: ModelChannelConditionInput
  ) {
    createChannel(input: $input, condition: $condition) {
      id
      shortId
      name
      ownerId
      createdAt
      updatedAt
    }
  }
`;
export const updateChannel = /* GraphQL */ `
  mutation UpdateChannel(
    $input: UpdateChannelInput!
    $condition: ModelChannelConditionInput
  ) {
    updateChannel(input: $input, condition: $condition) {
      id
      shortId
      name
      ownerId
      createdAt
      updatedAt
    }
  }
`;
export const deleteChannel = /* GraphQL */ `
  mutation DeleteChannel(
    $input: DeleteChannelInput!
    $condition: ModelChannelConditionInput
  ) {
    deleteChannel(input: $input, condition: $condition) {
      id
      shortId
      name
      ownerId
      createdAt
      updatedAt
    }
  }
`;
export const createUserChannel = /* GraphQL */ `
  mutation CreateUserChannel(
    $input: CreateUserChannelInput!
    $condition: ModelUserChannelConditionInput
  ) {
    createUserChannel(input: $input, condition: $condition) {
      id
      channelId
      channel{
        name
        id
      }
      userId
      createdAt
      updatedAt
    }
  }
`;
export const updateUserChannel = /* GraphQL */ `
  mutation UpdateUserChannel(
    $input: UpdateUserChannelInput!
    $condition: ModelUserChannelConditionInput
  ) {
    updateUserChannel(input: $input, condition: $condition) {
      id
      channelId
      userId
      createdAt
      updatedAt
    }
  }
`;
export const deleteUserChannel = /* GraphQL */ `
  mutation DeleteUserChannel(
    $input: DeleteUserChannelInput!
    $condition: ModelUserChannelConditionInput
  ) {
    deleteUserChannel(input: $input, condition: $condition) {
      id
      channelId
      userId
      createdAt
      updatedAt
    }
  }
`;
export const createBroadcast = /* GraphQL */ `
  mutation CreateBroadcast(
    $input: CreateBroadcastInput!
    $gratitudeId: ID!
    $condition: ModelBroadcastConditionInput
  ) {
    createBroadcast(input: $input, condition: $condition) {
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
    updateGratitude( input: {id: $gratitudeId}){
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
      broadcasts{
        items{
          id
          gratitudeId
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
export const updateBroadcast = /* GraphQL */ `
  mutation UpdateBroadcast(
    $input: UpdateBroadcastInput!
    $gratitudeId: ID!
    $condition: ModelBroadcastConditionInput
  ) {
    updateBroadcast(input: $input, condition: $condition) {
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
    updateGratitude( input: {id: $gratitudeId}){
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
      broadcasts{
        items{
          id
          gratitudeId
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
export const deleteBroadcast = /* GraphQL */ `
  mutation DeleteBroadcast(
    $input: DeleteBroadcastInput!
    $gratitudeId: ID!
    $condition: ModelBroadcastConditionInput
  ) {
    deleteBroadcast(input: $input, condition: $condition) {
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
    updateGratitude( input: {id: $gratitudeId}){
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
      broadcasts{
        items{
          id
          gratitudeId
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
