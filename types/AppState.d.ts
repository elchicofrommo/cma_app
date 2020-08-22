import {User, Post, Channel, UserChannel, Broadcast, Meeting} from './circles.'

export type AppState = {
    email?: string,
    currentTheme: number,
    operatingUser: User,
    posts: Post[],
    broadcastsByChannel: Map<string, Broadcast[]>,
    ownedChannels: Channel[],
    userChannels: UserChannel[],
    closeMeetings: Meeting[],
    closeMeetingsLoading: boolean,
    meetings: Meeting[] ,
    meetingsLoading: boolean,
    homegroup: string|undefined,
    soundCloudDetails: any,
    soundCloudTracks: any,
    paths: any,
    dailyReaders: any, 
    readerDate: any,
    submenus: {},
    meetingDetail: undefined| {},
    showDetail: boolean,
    showEditor: boolean,
    showMenu: boolean,
    banner: undefined|string,
    soberietyFormat: number,
    
    
  }