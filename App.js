import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import { Platform, StatusBar, StyleSheet, View, Text } from 'react-native';
import axios from 'axios';
import useCachedResources from './hooks/useCachedResources';
import BottomTabNavigator from './navigation/BottomTabNavigator';
import LinkingConfiguration from './navigation/LinkingConfiguration';
import reducers from './reducers/CombinedReducers';

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { AppLoading, SplashScreen } from 'expo';

import MySplashScreen from './screens/SplashScreen'

const Stack = createStackNavigator();
const store = createStore(reducers)

function getNetworkResources(){
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

  const CMA_DETAILS = "https://api-v2.soundcloud.com/users/295522782?client_id=pPoEnwUrlg2xU83gOZyN2AqPZ8kxkhBg&linked_partitioning=1"

  const CMA_TRACKS = "https://api-v2.soundcloud.com/users/295522782/tracks?client_id=pPoEnwUrlg2xU83gOZyN2AqPZ8kxkhBg&limit=100"

  console.log("getting cma soundcloud details")
  axios.get(CMA_DETAILS)
    .then( response => {
      //response.data
      console.log(`got CMA soundcloud details ${JSON.stringify(response.data)}`)
      let filtered = {
        avatar: response.data.avatar_url,
        description: response.data.description,
        trackCount: response.data.track_count
      }

      console.log(`filtered: ${JSON.stringify(filtered)}`)
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
  }, [])

  if (!isLoadingComplete) {
    return null;
  } else {

    if(ready){
      return (
        <Provider store={store} >
          <View style={styles.container}>
            {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}
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
    backgroundColor: '#fff',
  },
});
