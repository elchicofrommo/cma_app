import {User, Post, Channel, ChannelMember, Broadcast, Meeting} from './circles.'

export type AppState = {
    email?: string,
    currentTheme: number,
    operatingUser: User,
    posts: Post[],
    broadcastsByChannel: Map<string, Broadcast[]>,
    channelMembers: ChannelMember[],
    closeMeetings: Meeting[],
    closeMeetingsLoading: boolean,
    meetings: Meeting[] ,
    meetingsLoading: boolean,
    soundCloudDetails: any,
    soundCloudTracks: any,
    paths: any,
    dailyReaders: any, 
    readerDate: any,
    banner: undefined|string,
    soberietyFormat: number,
    
    
  }