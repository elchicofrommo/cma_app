import { Ionicons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as React from 'react';
import { DataStore, Predicates } from "@aws-amplify/datastore";
import axios from 'axios';
import { store } from '../components/store'
import { DailyReaders, Preferences, AuthDetail } from "../models/index";
import { signIn, SignInResult } from '../screens/SettingsScreen'
import { User, Meeting } from '../types/gratitude'
import fetchApi from '../api/fetch'
import { shallowEqual, useSelector  } from 'react-redux';
import appLog from '../util/Logging'
import soundCloudApi from "../api/soundcloud"

export default function useCachedResources() {
  const [loadingState, setLoadingState] = React.useState(0);
  const user : User = useSelector  (state=>state.general.operatingUser, shallowEqual ) 
  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();

        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          'space-mono': require('../assets/fonts/SpaceMono-Regular.ttf'),
          'merriweather': require('../assets/fonts/Merriweather/Merriweather-Regular.ttf'),
          'merriweather-bold': require('../assets/fonts/Merriweather/Merriweather-Bold.ttf'),
          'merriweather-italic': require('../assets/fonts/Merriweather/Merriweather-Italic.ttf'),
          'opensans': require('../assets/fonts/OpenSans/OpenSans-Regular.ttf'),
          'opensans-bold': require('../assets/fonts/OpenSans/OpenSans-SemiBold.ttf'),
          'opensans-light': require('../assets/fonts/OpenSans/OpenSans-Light.ttf')
        });
        setLoadingState(1)
        getNetworkResources();
        startUpAuth()

        setTimeout(() => {
          
          //SplashScreen.hide();
          setLoadingState(3)
        }, 5000)
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingState(2);
        SplashScreen.hideAsync();
      }
    }
    
    async function getNetworkResources() {
      appLog.verbose("geting network resources")

      const promises = [];
      promises.push(soundCloudApi.getSoundCloudDetails())
      promises.push(soundCloudApi.getSoundCloudTracks())
      promises.push(axios.get("https://api.bit-word.com/queryS3Directory"))
      promises.push(DataStore.query(DailyReaders, Predicates.ALL))

      //const results: PromiseSettledResult<any>[] = await Promise.all(promises)

      const readerDate = new Date();
      store.dispatch({ type: "READER_DATE", data: readerDate })

      // soundcloud details
      try{
        const filtered = await promises[0]
        store.dispatch({ type: "SOUNDCLOUD_DETAILS", data: filtered })
      }catch(err){
        store.dispatch({type: "SOUNDCLOUD_DETAILS", data: {description: "Could not get track details. "}})
        appLog.info("could not get soundcloud details " , {error: err})
      }

      // soundcloud tracks
      try{
        const tracks = await promises[1]
        appLog.info(`got CMA soundcloud tracks ${tracks.length}`)

        store.dispatch({ type: "SOUNDCLOUD_TRACKS", data: tracks})
      }catch(err){
        
        store.dispatch({ type: "SOUNDCLOUD_TRACKS", data: []})
        appLog.info("could not get soundcloud tracks ", {error: err} )
      }

      // S3 directory
      try{
        const directory = await promises[2]
        appLog.info(`got S3 directory structure `, {directory: directory.data})
        store.dispatch({ type: "NETWORK_DATA", data: directory.data })
      }catch(err){
        appLog.info("could not get S3 directory structure " + err)
      }

      // Daily Readers out of data store
      try{
        const result = await promises[3]
        if (result.length > 0) { // if there are auth details to retrieve
          appLog.info(`daily reader out of datastore are ${result}`)
          store.dispatch({ type: "DAILY_READERS", data: JSON.parse(result[0].readings) })
        }
        else {
          appLog.info(`getting daily reader from network`)
          try{
            const readersRaw = await axios.get("https://cma-northamerica.s3-us-west-1.amazonaws.com/documents/appData/dailyReader.json")
            appLog.info(`got daily reader `)
            const readers = new DailyReaders({ readings: JSON.stringify(readersRaw.data) })
            DataStore.save(readers)
            store.dispatch({ type: "DAILY_READERS", data: readersRaw.data })
          }catch(error){
            appLog.info("could not daily reader data " + error)
          }
        }
      }catch(err){

      }
    }

    async function startUpAuth(){
      // GET email and password from datastore
      const result = await DataStore.query(AuthDetail, Predicates.ALL)


      if (result.length > 0) { // if there are auth details to retrieve

        // try to sign in
        const email = result[0].email;
        const signInResult = await signIn(result[0].email, result[0].password)
        if (signInResult.error) {
          store.dispatch({
            type: "SET_BANNER", banner: {
              message:
                "Your saved username/password was refused. You have been signed out."
            }
          })
          store.dispatch({ type: "SIGN_OUT" })

        } 

      }


    }


    

    loadResourcesAndDataAsync();
  }, []);

  return loadingState;
}
