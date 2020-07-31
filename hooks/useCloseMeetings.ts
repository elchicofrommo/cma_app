import { searchForMeeting } from '../screens/MeetingSearchScreen';
import React, {useState, useEffect} from 'react'
import log from '../util/Logging'
import { Meeting } from '../types/gratitude';

export default function useCloseMeetings(): {meetings: Meeting[], loading: boolean, error: string}{
    const [state, setState] = useState({meetings: [], loading: false, error: undefined});


    async function getCloseMeetings(){
        setState((state)=>{
            state.loading = true;
            state.error = undefined;
            state.meetings =[];
            return {...state};
        })
        const result = await searchForMeeting();

        setState((state)=>{
            log.verbose('got data from meeting serach: ', {result})
            state.loading = false;

            state.meetings = result.meetings || []
            state.error = result.error;
            return {...state};
        })
    
    }
   useEffect(()=>{
    getCloseMeetings();
   }, [])

   return state
}
