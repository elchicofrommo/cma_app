import {User, Gratitude, Channel, UserChannel, Broadcast, Meeting} from '../types/gratitude'

export type AppState = {
    email?: string,
    password?: string,
    operatingUser: User,
    gratitudes: Gratitude[],
    broadcastsByChannel: Map<string, Broadcast[]>,
    ownedChannels: Channel[],
    userChannels: UserChannel[],
    meetings: Meeting[] ,
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