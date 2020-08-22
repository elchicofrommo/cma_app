import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, HeaderTitle } from '@react-navigation/stack';
import React, { useEffect, useState} from 'react';
import { Platform, StatusBar, StyleSheet, View, Text } from 'react-native';
import useCachedResources, {APP_STATE} from './hooks/useCachedResources';
import useSubscriptions from './hooks/useSubscriptions';
import BottomTabNavigator from './navigation/BottomTabNavigator';
import links from './navigation/LinkingConfiguration';
import { store } from './components/store'
import {useColors} from './hooks/useColors';
import {useLayout} from './hooks/useLayout';
import { Provider, shallowEqual, useSelector  } from 'react-redux';
import SigninScreen from './screens/SignIn'
import SigninScreenExperiments from './screens/SignInExperiments'
import { AppLoading } from 'expo';
import AppBanner from './components/AppBanner'
import {SafeAreaProvider} from 'react-native-safe-area-context'
import DocumentBrowserScreen from './screens/DocumentBrowserScreen'
import SettingsScreen from './screens/SettingsScreen'
import {DetailsScreen} from './screens/MeetingDetailsScreen'
import SplashScreen from './screens/SplashScreen'
import EditorScreen from './screens/PostEditorScreen'
import CircleAdminScreen from './screens/CircleAdminScreen'
import appLog from './util/Logging';

import {InteractionManager} from 'react-native';
import {Amplify} from "aws-amplify"
import config from './aws-exports'

Amplify.configure(config)

const _setTimeout = global.setTimeout;
const _clearTimeout = global.clearTimeout;
const MAX_TIMER_DURATION_MS = 60 * 1000;
if (Platform.OS === 'android') {
// Work around issue `Setting a timer for long time`
// see: https://github.com/firebase/firebase-js-sdk/issues/97
    const timerFix = {};
    const runTask = (id, fn, ttl, args) => {
        const waitingTime = ttl - Date.now();
        if (waitingTime <= 1) {
            InteractionManager.runAfterInteractions(() => {
                if (!timerFix[id]) {
                    return;
                }
                delete timerFix[id];
                fn(...args);
            });
            return;
        }

        const afterTime = Math.min(waitingTime, MAX_TIMER_DURATION_MS);
        timerFix[id] = _setTimeout(() => runTask(id, fn, ttl, args), afterTime);
    };

    global.setTimeout = (fn, time, ...args) => {
        if (MAX_TIMER_DURATION_MS < time) {
            const ttl = Date.now() + time;
            const id = '_lt_' + Object.keys(timerFix).length;
            runTask(id, fn, ttl, args);
            return id;
        }
        return _setTimeout(fn, time, ...args);
    };

    global.clearTimeout = id => {
        if (id && typeof id === 'string' && id.startsWith('_lt_')) {
            _clearTimeout(timerFix[id]);
            delete timerFix[id];
            return;
        }
        _clearTimeout(id);
    };
}

const AppStack = createStackNavigator();

function AppStackStack({initialRoute}){
  const styles = useStyles()
  const {colors: Colors} = useColors()

  return (
    <AppStack.Navigator initialRouteName={initialRoute} >
      <AppStack.Screen 
        name="splash" 
        component={SplashScreen} 

        options={({navigation, route})=>({
          title:"",
          headerShown: false

        })}
        />
      <AppStack.Screen 
        name="home" 
        component={BottomTabNavigator} 

        options={({navigation, route})=>({
          title:"",
          headerShown: false,
          gestureEnabled: false
        })}
        />
      <AppStack.Screen
        name="Settings"
        component={SettingsScreen} 
        title="Settings"
        
        options={({navigation, route})=>({
          headerStyle: styles.whiteHeader,
          headerTintColor: Colors.primary1,
          headerTitleStyle: styles.headerTitle,
        })}/>
      <AppStack.Screen
        name="Signin"
        component={SigninScreen} 
        title=""
        
        options={({navigation, route})=>({
          headerStyle: styles.whiteHeader,
          headerTintColor: Colors.primary1,
          headerTitleStyle: styles.headerTitle,
          headerShown: false,
        })}/>

      <AppStack.Screen
        name="SignInExperiments"
        component={SigninScreenExperiments} 
        title=""
        
        options={({navigation, route})=>({
          headerStyle: styles.whiteHeader,
          headerTintColor: Colors.primary1,
          headerTitleStyle: styles.headerTitle,
          headerShown: false,
        })}/>


      <AppStack.Screen
        name="Details"
        component={DetailsScreen}

        options={({ navigation, route }) => ({

          headerStyle: styles.headerStyle,
          title: '',
          headerTintColor: Colors.primary1,
          headerTitleStyle: styles.headerTitle,
        })} />

      <AppStack.Screen
        name="editor"
        component={EditorScreen}

        options={({ navigation, route }) => ({

          headerStyle: styles.whiteHeader,
          title: '',
          headerTintColor: Colors.primary1,
          headerTitleStyle: styles.headerTitle,


        })} />  
      <AppStack.Screen
        name="circleAdmin"
        component={CircleAdminScreen}

        options={({ navigation, route }) => ({

          headerStyle: styles.headerStyle,
          title: '',
          headerTintColor: Colors.primary1,
          headerTitleStyle: styles.headerTitle,


        })} />  

      <AppStack.Screen  
        name="documentBrowser"
        component={DocumentBrowserScreen} 
        options={({navigation, route})=>({

          title: 'Formats',
          headerStyle: styles.headerStyle,
          headerTintColor: Colors.primary1,
          headerTitleStyle: styles.headerTitle,    
        })}/>
         
    </AppStack.Navigator>
  )
}

  function App(props) {

    console.disableYellowBox = true;
    const loadingState = useCachedResources();
    useSubscriptions();
    const styles = useStyles();
    const [ready, setAppReady] = useState(false)
/*
    if(loadingState == APP_STATE.FONTS_LOADED){
      appLog.info('fonts loaded, showing experiements')
      return(
      <View style={styles.container}>
      {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}
      <StatusBar barStyle={"light-content"} />
      <AppBanner />
      <NavigationContainer linking={LinkingConfiguration}>

        <AppStackStack initialRoute={'SignInExperiments'} />
      </NavigationContainer>
    </View>
      )
    }
    else 
*/

    if(loadingState==APP_STATE.NEW_USER){
      appLog.info(' showing new user')
        return (
          
            <View style={styles.container}>
              {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}
              <StatusBar barStyle={"light-content"} />
              <AppBanner />
              <NavigationContainer linking={links}>

                <AppStackStack initialRoute={'Signin'} />
              </NavigationContainer>
            </View>


        )
    } else if(loadingState==APP_STATE.AUTH_READY){
      appLog.info('showing auth ready')
      return (
          
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}
          <StatusBar barStyle={"light-content"} />
          <AppBanner />
          <NavigationContainer linking={links}>

            <AppStackStack initialRoute={'splash'} />
          </NavigationContainer>
        </View>


    )
    }else{
      appLog.info('splash screen')
        return(
  
              <View style={styles.loading}></View>
  
        )

    }


  }

function useStyles(){
  const {colors: Colors} = useColors()
  const layout  = useLayout()
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
    },
    whiteHeader: {
      backgroundColor: 'white',

    },
    loading: {backgroundColor: Colors.primary1, flex: 1},
    headerStyle: {
      backgroundColor: '#FFF',
      shadowColor: 'transparent'
    },
    headerTitle: {
      fontFamily: 'opensans-bold',
      fontSize:  18 * layout.scale.height,
    },

  });
  return styles
}
  

  export default function AppWrapper(){
    return(
      <Provider store={store} >
          <SafeAreaProvider>
        <App />
        </SafeAreaProvider>
      </Provider>
    )
  }
