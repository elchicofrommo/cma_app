
import log from '../util/Logging'
import { Meeting, User } from '../types/circles'
import { API, Auth } from 'aws-amplify'

const BASE = 'https://d5d92ay1m1.execute-api.us-west-1.amazonaws.com/dev-auth/cma'
type SoundCloudDetails = {
  avatar: any;
  description: any;
  trackCount: any;
}

async function getMeetings(lat: number, long: number, distance: number): Promise<{ error?: string, data?: any }> {


  const apiName = "CMAGuestAPI";
  const path = "/meeting"
  const myInit = {
    response: true,
    'queryStringParameters': {
      lat: long,
      long: lat,
      distance: distance * 1609
    }
  }
  let response = undefined
  try {
    response = await API.get(apiName, path, myInit)
    if (response.data.error) {
      return { error: "System problem finding meetings. Try again later" }
    } else {
      return { data: response.data }
    }
  } catch (err) {
    log.verbose("Network problems", { err })
    return { error: "Network problmes. Try again" };

  }

}
async function getMeetingDetails(operatingUser: User): Promise<{ error: string } | Meeting[]> {

  if (!operatingUser.meetingIds || operatingUser.meetingIds.length == 0)
    return [];

  const meetingList = operatingUser.meetingIds.join(",");
  const apiName = "CMAGuestAPI";
  const path = "/meeting/id"
  const myInit = {
    response: true,
    'queryStringParameters': {
      ids: meetingList
    }
  }

  try {
    let response = await API.get(apiName, path, myInit)
    if (response.data.error) {
      return { error: "System problem finding meetings. Try again later" }
    } else {
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

        return meeting;
      })
      return meetings;
    }
  }
  catch (err) {
    log.verbose("Network problems", { err })
    return { error: "Network problmes. Try again" };

  }
}

async function getSoundCloudDetails(): Promise<{ error: string } | SoundCloudDetails> {

  log.info(`gettin soundcloudAccountDetails`)
  const apiName = "CMAGuestAPI";
  const path = "/sound-cloud/account-details"
  const myInit = {
    response: true,
  }
  let response = undefined
  try {
    response = await API.get(apiName, path, myInit)
    if (response.data.error) {
      return { error: "System problem finding meetings. Try again later" }
    } else {
      let filtered: SoundCloudDetails = {
        avatar: response.data.avatar_url,
        description: response.data.description,
        trackCount: response.data.track_count
      }
      return filtered
    }
  } catch (err) {
    log.verbose("Network problems", { err })
    return { error: "Network problmes. Try again" };

  }

}

async function getSoundCloudTracks() {


  log.info(`gettin soundcloudAccountDetails`)
  const apiName = "CMAGuestAPI";
  const path = "/sound-cloud/track-details"
  const myInit = {
    response: true,
  }
  let response = undefined
  try {
    response = await API.get(apiName, path, myInit)
    if (response.data.error) {
      return { error: "System problem finding meetings. Try again later" }
    } else {
      const tracks = response.data.collection
      log.info(`got sound cloud tracks `)
      const massaged = tracks.map(track => {
        track.trackUrl = track.media.transcodings[1].url
        return track;
      })
      return massaged
    }
  } catch (err) {
    log.verbose("Network problems", { err })
    return { error: "Network problmes. Try again" };

  }

}

async function getPlayableTrack(trackUrl) {
  let massagedURL = trackUrl.replace('https://api-v2.soundcloud.com/media/', '')

  log.info(`getting playable track, ${massagedURL} `)


  log.info(`gettin soundcloudAccountDetails`)
  const apiName = "CMAGuestAPI";
  const path = `/sound-cloud/media/${massagedURL}`
  const myInit = {
    response: true,
  }
  let response = undefined
  try {
    response = await API.get(apiName, path, myInit)
    if (response.data.error) {
      return { error: "System problem finding meetings. Try again later" }
    } else {
      return response.data.url
    }
  } catch (err) {
    log.verbose("Network problems", { err })
    return { error: "Network problmes. Try again" };

  }  

}

export default {
  getSoundCloudDetails,
  getSoundCloudTracks,
  getPlayableTrack,
  getMeetingDetails,
  getMeetings
}
