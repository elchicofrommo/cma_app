import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import { Platform, StatusBar, StyleSheet, View, Text } from 'react-native';
import axios from 'axios';
import useCachedResources from './hooks/useCachedResources';
import BottomTabNavigator from './navigation/BottomTabNavigator';
import LinkingConfiguration from './navigation/LinkingConfiguration';
import reducers from './reducers/CombinedReducers';
import thunk from "redux-thunk";
import BackgroundColor from 'react-native-background-color';
import { DataStore, Predicates } from "@aws-amplify/datastore";
import { Preferences, AuthDetail, Meetings, Gratitude as GratitudeModel, GratitudeEntry as GratitudeEntryModel, GratitudeComment as GratitudeCommentModel } from "./models/index";
import Colors from "./constants/Colors"
import { Provider } from 'react-redux';
import { createStore, applyMiddleware,  } from 'redux';
import { AppLoading, SplashScreen } from 'expo';
import { Auth, auth0SignInButton } from 'aws-amplify'
import MySplashScreen from './screens/SplashScreen'

const Stack = createStackNavigator();
const store = createStore(reducers, applyMiddleware(thunk))


async function signIn(email, password){
  console.log(`signing in with userName: ${email} password: ${password}`)

  try{
    const result = await Auth.signIn(email, password  )
    console.log(`successful sign in, now dispatching save auth ${JSON.stringify(result.username)}`)
    return result.username;
  }catch(err){
    console.log(`error signing in ${err}`)
    return undefined
  }

  
}

async function getNetworkResources(){
  axios.get("https://api.bit-word.com/queryS3Directory")
    .then( response => {
      console.log(`got network resources `)
      store.dispatch({type: "NETWORK_DATA", data: response.data})
    }).catch( error =>{
      console.log("could not get network resources " + error)
    })

  console.log("getting daily")
  axios.get("https://cma-northamerica.s3-us-west-1.amazonaws.com/documents/appData/dailyReader.json")
    .then( response => {
      //response.data
      console.log(`got daily reader `)
      store.dispatch({type: "DAILY_READERS", data: response.data})
    }).catch( error =>{
      console.log("could not get network resources " + error)
  })

  const CMA_DETAILS = "https://api-v2.soundcloud.com/users/295522782?client_id=ort1mNnec7uBq15sMpCNm5oPUYUpu1oV&linked_partitioning=1"

  const CMA_TRACKS = "https://api-v2.soundcloud.com/users/295522782/tracks?client_id=ort1mNnec7uBq15sMpCNm5oPUYUpu1oV&limit=100"

  console.log("getting cma soundcloud details")
  axios.get(CMA_DETAILS)
    .then( response => {
      //response.data
      console.log(`got CMA soundcloud details ${response.data}`)
      let filtered = {
        avatar: response.data.avatar_url,
        description: response.data.description,
        trackCount: response.data.track_count
      }

      //console.log(`filtered: ${JSON.stringify(filtered)}`)
      store.dispatch({type: "SOUNDCLOUD_DETAILS", data: filtered})
    }).catch( error =>{
      console.log("could not get network resources " + error)
  })

  console.log("getting cma soundcloud tracks")
  axios.get(CMA_TRACKS)
    .then( response => {
      //response.data
      console.log(`got CMA soundcloud tracks ${response.data.collection.length}`)

      store.dispatch({type: "SOUNDCLOUD_TRACKS", data: response.data.collection})
    }).catch( error =>{
      console.log("could not get network resources " + error)
  })
  
  Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  }

  const readerDate = new Date();
  store.dispatch({type: "READER_DATE", data: readerDate})

  DataStore.query(AuthDetail, Predicates.ALL)
    .then(async (result)=>{
      console.log(`authDetail out of datastore are ${result}`)
      if(result.length >0){ // if there are auth details to retrieve
        store.dispatch({type: "SYNC_AUTH", data: result[0]})
        // try to sign in

        const email = result[0].email;
        const userName = await signIn(result[0].email, result[0].password)

        if(userName){

          store.dispatch({type: "SAVE_AUTH", data: userName})

          DataStore.query(Preferences, c => {
            c.email("eq", email)
          }).then((result)=>{

            if(result.length >0)
              store.dispatch({type: "SYNC_PREFRENCES", data: result[0]})
          }).catch((err)=> {
            console.log(`err out of datastore are ${JSON.stringify(err)}`)
          })

          DataStore.query(Meetings, c =>{ c.email("eq", email)})
          .then((result)=>{

            if(result.length >0)
              store.dispatch({type: "SYNC_MEETINGS", data: result[0]})
          })
          .catch((err)=> {
            console.log(`err getting meetings out of datastore are ${JSON.stringify(err)}`)
          })

          DataStore.query(GratitudeModel, c=>{c.email("eq", email)} )
          .then((result)=>{
            console.log('gratitude sync made, length is ' + JSON.stringify(result))
            if(result.length >0)
            /*
              result.sort((a, b)=>{
                if(a.time == b.time)
                  return 0
                return a.time > b.time ?  -1 :1
              }) */
              store.dispatch({type: "SYNC_GRATITUDE", data: result})
          })
          .catch((err)=> {
            console.log(`err getting gratitude out of datastore are ${JSON.stringify(err)}`)
          })
        }else{
          console.log(`signin failed `)
        }

      }
    })
    .catch((err)=> {
      console.log(`err out of datastore are ${JSON.stringify(err)}`)
    })
  
  
}

export default function App(props) {

  console.disableYellowBox = true;
  const isLoadingComplete = useCachedResources();
  const [ready, setAppReady] = useState(false)
  useEffect(()=>{
    setTimeout(()=>{
      setAppReady(true)
      SplashScreen.hide({
        fadeOutDuration: 500
      });
      
    }, 5000)
    getNetworkResources();
    Text.defaultProps = Text.defaultProps || {};
    // Ignore dynamic type scaling on iOS
    Text.defaultProps.allowFontScaling = false; 

  }, [])

  if (!isLoadingComplete) {
    return null;
  } else {

    if(ready){
      return (
        <Provider store={store} >
          <View style={styles.container}>
            {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}
            <StatusBar barStyle={"light-content"}/>
            <NavigationContainer linking={LinkingConfiguration}>
              <BottomTabNavigator />
            </NavigationContainer>
          </View>
        </Provider>
      )
    }else{
      console.log("inside splash screen")
      return (
        <MySplashScreen  />
      )
    }

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
