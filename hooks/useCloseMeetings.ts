import { searchForMeeting } from '../screens/MeetingSearchScreen';
import React, {useState, useEffect} from 'react'
import log from '../util/Logging'
import { Meeting } from '../types/circles.';

export default function useCloseMeetings(): {meetings: Meeting[], loading: boolean, error: {messge: string, type: string}}{
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
            log.info('got data from meeting serach: ', {result})
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
