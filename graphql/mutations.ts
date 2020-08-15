/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const commentOnPost = /* GraphQL */ `
mutation CommentOnPost(
    $postId: ID!
    $userId: ID!
    $comment: String!
  ) {
    createComment(input: {postId: $postId, userId: $userId, comment: $comment}) {
      id
      userId
      postId
      user{
          id
          name
      }
      entryId
      createdAt
      updatedAt
    }
    updatePost( input: {id: $postId}){
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
          id
          userId
          user{
            name
            id
          }
          postId
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
          postId
          entryId
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
    listBrodcastByPost( postId: $postId){
      items {
        id
        postId
        channelId
        createdAt
        updatedAt
      }
    }
  }
`;

export const likePost = /* GraphQL */ `
mutation LikePost(
    $postId: ID!
    $userId: ID!
  ) {
    createLike(input: {postId: $postId, userId: $userId}) {
      id
      userId
      postId
      user{
          id
          name
      }
      entryId
      createdAt
      updatedAt
    }
    updatePost( input: {id: $postId}){
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
          id
          userId
          user{
            name
            id
          }
          postId
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
          postId
          entryId
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
    listBrodcastByPost( postId: $postId){
      items {
        id
        postId
        channelId
        createdAt
        updatedAt
      }
    }
  }
`;

export const unlikePost = /* GraphQL */ `
  mutation UnlikePost(
    $likeId: ID!
    $postId: ID!
  ) {
    deleteLike(input: {id: $likeId}) {
      id
      userId
      postId
      user{
            name
          }
      entryId
      createdAt
      updatedAt
    }
    updatePost( input: {id: $postId}){
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
          id
          userId
          user{
            name
            id
          }
          postId
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
          postId
          entryId
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
    listBrodcastByPost( postId: $postId){
      items {
        id
        postId
        channelId
        createdAt
        updatedAt
      }
    } 
  }
`;


export const uncommentOnPost = /* GraphQL */ `
  mutation UncommentOnPost(
    $commentId: ID!
    $postId: ID!
  ) {
    deleteLike(input: {id: $likeId}) {
      id
      userId
      postId
      entryId
      createdAt
      updatedAt
    }
    updatePost( input: {id: $postId}){
      id
            ownerId
      createdAt
      updatedAt
      delta
      content
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
          postId
          ownerId
          channelId
        }
      }
    }
  }
`;

export const createPost = /* GraphQL */ `
  mutation CreatePost(
    $input: CreatePostInput!
  ) {
    createPost( input: $input){
      id
            ownerId
      owner {
        id
        shortId
        name
      }
      createdAt
      updatedAt
      delta
      content
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
          postId
          ownerId
          channelId
        }
      }
    }

  }
`;

export const updatePost = /* GraphQL */ `
  mutation UpdatePost(
    $input: UpdatePostInput!
    $condition: ModelPostConditionInput
  ) {
    updatePost(input: $input, condition: $condition) {
      id
            ownerId
      owner {
        id
        shortId
        name
      }
      createdAt
      updatedAt
      delta
      content
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
          postId
          ownerId
          channelId
        }
      }
    }
  }
`;
export const deletePost = /* GraphQL */ `
  mutation DeletePost(
    $input: DeletePostInput!
    $condition: ModelPostConditionInput
  ) {
    deletePost(input: $input, condition: $condition) {
      id
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
      postId
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
      postId
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
      postId
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
      postId
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
      postId
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
      postId
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
      postId
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
      postId
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
      postId
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
    $postId: ID!
    $condition: ModelBroadcastConditionInput
  ) {
    createBroadcast(input: $input, condition: $condition) {
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
            postId
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
    updatePost( input: {id: $postId}){
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
          id
          userId
          user{
            name
            id
          }
          postId
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
          postId
          entryId
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
export const updateBroadcast = /* GraphQL */ `
  mutation UpdateBroadcast(
    $input: UpdateBroadcastInput!
    $postId: ID!
    $condition: ModelBroadcastConditionInput
  ) {
    updateBroadcast(input: $input, condition: $condition) {
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
            postId
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
    updatePost( input: {id: $postId}){
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
          id
          userId
          user{
            name
            id
          }
          postId
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
          postId
          entryId
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
export const deleteBroadcast = /* GraphQL */ `
  mutation DeleteBroadcast(
    $input: DeleteBroadcastInput!
    $postId: ID!
    $condition: ModelBroadcastConditionInput
  ) {
    deleteBroadcast(input: $input, condition: $condition) {
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
            postId
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
    updatePost( input: {id: $postId}){
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
          id
          userId
          user{
            name
            id
          }
          postId
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
          postId
          entryId
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
