export type NestedArray<T> = {
  items: T[]
}
export type Post = {
  id?: string,
  ownerId: string,
  owner?: User,
  createdAt?: number,
  content: string,
  likes?: NestedArray<Like>,
  comments?: NestedArray<Comment>,
  broadcasts?: NestedArray<Broadcast>,
  lastUpdatedAt?: number
}

export type User = {
  id?: string,
  shortId: string,
  name: string,
  email: string,
  dos?: number,
  role?: string,
  shareDos?: boolean,
  createdAt?: number,
  channels?: NestedArray<UserChannel>,
  posts?: NestedArray<Post>,
  ownedChannels?: NestedArray<Channel>,
  lastUpdatedAt?: number,
  meetingIds?: string[]
}

export type Like = {
  id?: string,
  userId: string,
  user?: User,
  postId?: string,
  createdAt?: number,
  updatedAt?: number,
}

export type ChannelDetails = Channel & {
  subscribedUsers?: User[]
}

export type UserChannel = {
  id?: string,
  channelId: string,
  channel: Channel,
  userId: string,
  user?: User,
  createdAt?: number,
  updatedAt?: number,
}

export type Comment = {
  id?: string,
  userId: string,
  user?: User,
  postId?: string,
  comment: string,
  createdAt?: number,
  updatedAt?: number,
}

export type Channel = {
  id?: string,
  shortId: string,
  name: string,
  ownerId: string,
  owner?: User,
  broadcasts?: NestedArray<Broadcast>,
  subscriptions?: NestedArray<UserChannel>,
  createdAt?: number,
  updatedAt?: number,
}

export type Broadcast = {
  id?: string,
  postId: string,
  post?: Post,
  ownerId: string,
  owner?: User,
  channelId: string,
  channel?: Channel,
  createdAt?: number,
  updatedAt?: number,
}

export type Meeting ={

  id: string,
  name: string,
  active: boolean
  category: string
  startTime: string
  weekday: string
  street?: string
  city?: string
  state?: string
  zip?: string
  type?: string[]
  paid?: boolean
  distance?: number
  location: {
    lat: number
    long: number
  }
}
