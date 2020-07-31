import axios from 'axios';
import log from '../util/Logging'
import {Meeting, User} from '../types/gratitude'

const BASE = 'https://api.bit-word.com/cma'
type SoundCloudDetails = {
    avatar: any;
    description: any;
    trackCount: any;
}

async function getMeetings(lat: number, long:number, distance: number): Promise<{error?: string, data?: any}>{

    const query = `${BASE}/meeting?long=${lat}&lat=${long}&distance=${distance * 1609}`;

    log.info(`runnign query ${query}`)

    let response = undefined
    try {
      response = await axios.get(query)
      if(response.data.error){
          return { error: "System problem finding meetings. Try again later" }
      }else {
          return {data: response.data}
      }
    } catch{
      return { error: "Network problmes. Try again" };

    }

}
async function getMeetingDetails(operatingUser: User): Promise<Meeting[]> {

    if(!operatingUser.meetingIds || operatingUser.meetingIds.length ==0)
      return [];
  
    const meetingList = operatingUser.meetingIds.join(",");
    const query = `${BASE}/meeting/id?ids=${meetingList}`;
  
    log.info(`runnign query ${query}`)
  
    let response = undefined
    try {
      response = await axios.get(query)
      // log.info(`results from meeting query: ${JSON.stringify(response.data,null, 2)}`)
  
      const meetings: Meeting[] = response.data.map(rawMeeting => {
  
        const meeting: Meeting = {
          id: rawMeeting._id,
          name: rawMeeting.name,
          active: rawMeeting.active != 0,
          category: rawMeeting.category,
          location: { lat: rawMeeting.location.coordinates[1], long: rawMeeting.location.coordinates[0] },
          startTime: rawMeeting.start_time,
          weekday: rawMeeting.weekday,
          type: rawMeeting.type,
          street: rawMeeting.street,
          city: rawMeeting.city,
          state: rawMeeting.state,
          paid: rawMeeting.paid,
          zip: rawMeeting.zip
        }
  
        return meeting
  
      })
      return meetings
    } catch (err) {
      log.info(`Network problmes. Try again` , {err});
      return [];
    }
  
  }
  
async function getSoundCloudDetails(): Promise<SoundCloudDetails>{
    log.info(`gettin soundcloudAccountDetails from ${BASE}/sound-cloud/account-details`)
    const soundcloudDetails = await axios.get(`${BASE}/sound-cloud/account-details`);

    log.info(`got ` , {soundCloudDetails: soundcloudDetails.data})

    let filtered:SoundCloudDetails = {
      avatar: soundcloudDetails.data.avatar_url,
      description: soundcloudDetails.data.description,
      trackCount: soundcloudDetails.data.track_count
    }
    return filtered
}

async function getSoundCloudTracks(){
    log.info(`gettin soundcloudTrackDetails from ${BASE}/sound-cloud/track-details`)
    const results = await axios.get(`${BASE}/sound-cloud/track-details`)
    const tracks = results.data.collection
    log.info(`got sound cloud tracks `)
    const massaged = tracks.map(track=>{
        track.trackUrl = track.media.transcodings[1].url 
        return track;
    })
    return  massaged
}

async function getPlayableTrack(trackUrl){
    let massagedURL = trackUrl.replace('https://api-v2.soundcloud.com/media/', '')
    //massagedURL = encodeURIComponent(massagedURL)
    log.info(`getting playable track, ${BASE}/sound-cloud/media/${massagedURL} `)
    
    const results = await axios.get(`${BASE}/sound-cloud/media/${massagedURL}`)
    log.info(`playing track response is  ${JSON.stringify(results, null, 2)}`)
    return results.data.url
    
}

export default {
    getSoundCloudDetails,
    getSoundCloudTracks,
    getPlayableTrack,
    getMeetingDetails,
    getMeetings
}
