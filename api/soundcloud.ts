import axios from 'axios';
import log from '../util/Logging'
import { Sound } from 'expo-av/build/Audio';
const CLIENT_ID = 'z7xDdzwjM6kB7fmXCd06c8kU6lFNtBCT'
const CMA_DETAILS = `https://api-v2.soundcloud.com/users/295522782?client_id=${CLIENT_ID}&linked_partitioning=1`
const CMA_TRACKS = `https://api-v2.soundcloud.com/users/295522782/tracks?client_id=${CLIENT_ID}&limit=100`

type SoundCloudDetails = {
    avatar: any;
    description: any;
    trackCount: any;
}
async function getSoundCloudDetails(): Promise<SoundCloudDetails>{
    const soundcloudDetails = await axios.get(CMA_DETAILS);

    log.info(`got ` , {soundCloudDetails: soundcloudDetails.data})

    let filtered:SoundCloudDetails = {
      avatar: soundcloudDetails.data.avatar_url,
      description: soundcloudDetails.data.description,
      trackCount: soundcloudDetails.data.track_count
    }
    return filtered
}

async function getSoundCloudTracks(){
    const results = await axios.get(CMA_TRACKS)
    const tracks = results.data.collection
    log.info(`got sound cloud tracks `)
    const massaged = tracks.map(track=>{
        track.trackUrl = `${track.media.transcodings[1].url}?client_id=${CLIENT_ID}` 
        return track;
    })
    return  massaged
}

export default {
    getSoundCloudDetails,
    getSoundCloudTracks
}
