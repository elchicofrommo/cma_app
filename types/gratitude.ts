export type NestedArray<T> = {
  items: T[]
}
export type Gratitude = {
  id?: string,
  title: string,
  ownerId: string,
  owner?: User,
  createdAt?: number,
  entries?: NestedArray<Entry>,
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
  likes?: NestedArray<Like>,
  channels?: NestedArray<UserChannel>,
  comments?: NestedArray<Comment>,
  gratitudes?: NestedArray<Gratitude>,
  ownedChannels?: NestedArray<Channel>,
  lastUpdatedAt?: number,
  meetingIds?: string[]
}

export type Like = {
  id?: string,
  userId: string,
  user?: User,
  gratitudeId?: string,
  entryId?: string,
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
  gratitudeId?: string,
  entryId?: string,
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
  gratitudeId: string,
  gratitude?: Gratitude,
  ownerId: string,
  owner?: User,
  channelId: string,
  channel?: Channel,
  createdAt?: number,
  updatedAt?: number,
}

export type Entry = {
  id?: string,
  gratitudeId: string,
  index: number,
  content: string,
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
