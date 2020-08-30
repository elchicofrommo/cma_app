/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const listBroadcastByPost = /* GraphQL */ `
  mutation ListBroadcastByPost($postId: ID, $limit: Int, $nextToken: String) {
    listBroadcastByPost(postId: $postId, limit: $limit, nextToken: $nextToken) {
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
export const createPost = /* GraphQL */ `
  mutation CreatePost(
    $input: CreatePostInput!
    $condition: ModelPostConditionInput
  ) {
    createPost(input: $input, condition: $condition) {
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
export const deletePost = /* GraphQL */ `
  mutation DeletePost(
    $input: DeletePostInput!
    $condition: ModelPostConditionInput
  ) {
    deletePost(input: $input, condition: $condition) {
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
export const createLike = /* GraphQL */ `
  mutation CreateLike(
    $input: CreateLikeInput!
    $condition: ModelLikeConditionInput
  ) {
    createLike(input: $input, condition: $condition) {
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
export const updateLike = /* GraphQL */ `
  mutation UpdateLike(
    $input: UpdateLikeInput!
    $condition: ModelLikeConditionInput
  ) {
    updateLike(input: $input, condition: $condition) {
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
export const deleteLike = /* GraphQL */ `
  mutation DeleteLike(
    $input: DeleteLikeInput!
    $condition: ModelLikeConditionInput
  ) {
    deleteLike(input: $input, condition: $condition) {
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
export const createComment = /* GraphQL */ `
  mutation CreateComment(
    $input: CreateCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    createComment(input: $input, condition: $condition) {
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
export const updateComment = /* GraphQL */ `
  mutation UpdateComment(
    $input: UpdateCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    updateComment(input: $input, condition: $condition) {
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
export const deleteComment = /* GraphQL */ `
  mutation DeleteComment(
    $input: DeleteCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    deleteComment(input: $input, condition: $condition) {
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
export const createChannel = /* GraphQL */ `
  mutation CreateChannel(
    $input: CreateChannelInput!
    $condition: ModelChannelConditionInput
  ) {
    createChannel(input: $input, condition: $condition) {
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
export const updateChannel = /* GraphQL */ `
  mutation UpdateChannel(
    $input: UpdateChannelInput!
    $condition: ModelChannelConditionInput
  ) {
    updateChannel(input: $input, condition: $condition) {
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
export const deleteChannel = /* GraphQL */ `
  mutation DeleteChannel(
    $input: DeleteChannelInput!
    $condition: ModelChannelConditionInput
  ) {
    deleteChannel(input: $input, condition: $condition) {
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
export const createChannelMember = /* GraphQL */ `
  mutation CreateChannelMember(
    $input: CreateChannelMemberInput!
    $condition: ModelChannelMemberConditionInput
  ) {
    createChannelMember(input: $input, condition: $condition) {
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
export const updateChannelMember = /* GraphQL */ `
  mutation UpdateChannelMember(
    $input: UpdateChannelMemberInput!
    $condition: ModelChannelMemberConditionInput
  ) {
    updateChannelMember(input: $input, condition: $condition) {
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
export const deleteChannelMember = /* GraphQL */ `
  mutation DeleteChannelMember(
    $input: DeleteChannelMemberInput!
    $condition: ModelChannelMemberConditionInput
  ) {
    deleteChannelMember(input: $input, condition: $condition) {
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


/************************************/


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
            postId
            userId
            user{
              name
              id
            }
            createdAt
            updatedAt
          }

        }
        comments {
          items {
            userId
            user{
              name
              id
            }
            postId
            
            comment
            createdAt
            updatedAt
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
          userId
          user{
            name
            id
          }
          postId
          
          createdAt
          updatedAt
        }

      }
      comments {
        items {
          userId
          user{
            name
            id
          }
          postId
          
          comment
          createdAt
          updatedAt
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
  }
`;

export const likePost = /* GraphQL */ `
mutation LikePost(
    $postId: ID!
    $userId: ID!
  ) {
    createLike(input: {postId: $postId, userId: $userId}) {
      userId
      postId
      user{
          id
          name
      }
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
    listBroadcastByPost( postId: $postId){
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
    $postId: ID!
    $userId: ID!
  ) {
    deleteLike(input: {postId: $postId, userId: $userId}) {
      userId
      postId
      user{
        name
      }
  
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
          postId
          ownerId
          channelId
        }
      }

      createdAt
      updatedAt
      delta
    }
    listBroadcastByPost( postId: $postId){
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


export const commentOnPost = /* GraphQL */ `
mutation CommentOnPost(
    $postId: ID!
    $userId: ID!
    $comment: String!
  ) {
    createComment(input: {postId: $postId, userId: $userId, comment: $comment}) {
      userId
      postId
      user{
          id
          name
      }
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
          postId
          userId
          user{
            name
            id
          }
          createdAt
          updatedAt
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
          updatedAt
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
    listBroadcastByPost( postId: $postId){
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
    $postId: ID!
    $createdAt: String!
  ) {
    deleteComment(input: {postId: $postId, createdAt: $createdAt}) {
      postId
      userId
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
          postId
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
          postId
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
