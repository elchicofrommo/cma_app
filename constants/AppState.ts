export type AppState = {
    name: string| undefined,
    dos: string|undefined,
    meetings: [string] | [],
    meetingMap: Map<string, any>,
    
    homegroup: string|undefined,
    gratitudeLists: [string] | [],
    screenName: string|undefined,
    
    authenticated: boolean|undefined,
    role: string|undefined,
    soundCloudDetails: any,
    soundCloudTracks: any,
    paths: any,
    dailyReaders: any, 
    readerDate: any,
    submenus: {},
    meetingDetail: undefined| {},
    showDetail: boolean,
    showMenu: boolean,
    
    // Cognito details
    password: string|undefined,
    email: string|undefined,
    username: string|undefined
    
  }