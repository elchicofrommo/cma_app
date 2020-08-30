export type NestedArray<T> = {
  items: T[]
}
export type Post = {
  id?: string,
  ownerId: string,
  owner?: User,
  createdAt?: string,
  content: string,
  likes?: NestedArray<Like>,
  comments?: NestedArray<Comment>,
  broadcasts?: NestedArray<Broadcast>,
  updatedAt?: number
}

export type User = {
  id?: string,
  shortId: string,
  name: string,
  email: string,
  dos?: number,
  role?: string,
  shareDos?: boolean,
  createdAt?: string,
  updatedAt?: string
  channels?: NestedArray<ChannelMember>,
  posts?: NestedArray<Post>,
  meetingIds?: string[]
}

export type Like = {
  userId: string,
  user?: User,
  postId?: string,
  createdAt?: string,
  updatedAt?: string,
}

export type ChannelDetails = Channel & {
  subscribedUsers?: User[]
}

export type ChannelMember = {
  channelId: string,
  channel: Channel,
  userId: string,
  user?: User,
  createdAt?: string,
  updatedAt?: string,
}

export type Comment = {
  userId: string,
  user?: User,
  postId?: string,
  comment: string,
  createdAt?: string,
  updatedAt?: string,
}

export type Channel = {
  id?: string,
  shortId?: string,
  name: string,
  ownerIds: [string],
  broadcasts?: NestedArray<Broadcast>,
  subscriptions?: NestedArray<ChannelMember>,
  createdAt?: string,
  updatedAt?: string,
}

export type Broadcast = {
  id: string,
  postId: string,
  post?: Post,
  ownerId: string,
  owner?: User,
  channelId: string,
  channel?: Channel,
  createdAt?: string,
  updatedAt?: string,
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
