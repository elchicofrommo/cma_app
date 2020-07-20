import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useState} from 'react';
import { Platform, StatusBar, StyleSheet, View, Text } from 'react-native';
import useCachedResources from './hooks/useCachedResources';
import useSubscriptions from './hooks/useSubscriptions';
import BottomTabNavigator from './navigation/BottomTabNavigator';
import LinkingConfiguration from './navigation/LinkingConfiguration';
import { store } from './components/store'
import Colors from './constants/Colors';
import Layout from './constants/Layout';
import { Provider, shallowEqual, useSelector  } from 'react-redux';
import { AppLoading } from 'expo';
import { Auth, auth0SignInButton } from 'aws-amplify'
import MySplashScreen from './screens/SplashScreen'
import { subscribeToMyGratitudes } from './graphql/subscriptions';
import SettingsScreen from './screens/SettingsScreen'
import {DetailsScreen} from './screens/MeetingDetailsScreen'
import SplashScreen from './screens/SplashScreen'
import EditorScreen from './screens/GratitudeEditorScreen'
import CircleAdminScreen from './screens/CircleAdminScreen'
import appLog from './util/Logging'

const AppStack = createStackNavigator();

function AppStackStack({initialRoute}){
  appLog.info(`rendering homescreen stack`)
  return (
    <AppStack.Navigator initialRouteName={initialRoute}  >
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
          headerStyle: {
            backgroundColor: 'white',

          },

          headerTintColor: Colors.primary,
          

          headerTitleStyle: {
            fontFamily: 'opensans-bold',
            fontSize:  18 * Layout.scale.width,
          },
        })}/>
      <AppStack.Screen
        name="Details"
        component={DetailsScreen}

        options={({ navigation, route }) => ({

          headerStyle: {
            backgroundColor: '#FFF',
            shadowColor: 'transparent'
          },
          title: '',
          headerTintColor: Colors.primary,
          headerTitleStyle: {
            fontWeight: 'bold',
            fontFamily: 'merriweather',
            fontSize: 18 * Layout.scale.width,
            borderBottomWidth: 0,


          },
        })} />

      <AppStack.Screen
        name="editor"
        component={EditorScreen}

        options={({ navigation, route }) => ({

          headerStyle: {
            backgroundColor: '#FFF',

          },
          title: '',
          headerTintColor: Colors.primary,
          headerTitleStyle: {
            fontFamily: 'opensans-bold',
            fontSize: 18 * Layout.scale.width,
          },


        })} />  
      <AppStack.Screen
        name="circleAdmin"
        component={CircleAdminScreen}

        options={({ navigation, route }) => ({

          headerStyle: {
            backgroundColor: '#FFF',
            shadowColor: 'transparent'
          },
          title: '',
          headerTintColor: Colors.primary,
          headerTitleStyle: {
            fontFamily: 'opensans-bold',
            fontSize: 18 * Layout.scale.width,
          },


        })} />  
    </AppStack.Navigator>
  )
}

  function App(props) {

    console.disableYellowBox = true;
    const loadingState = useCachedResources();
    useSubscriptions();
    const [ready, setAppReady] = useState(false)
    
    let initialRoute = "splash" 
    if(loadingState == 3)
      initialRoute = "home"

    if (loadingState==0) {
      return(

            <View style={{backgroundColor: Colors.primary, flex: 1}}></View>

      )
    } else {
        return (

            <View style={styles.container}>
              {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}
              <StatusBar barStyle={"light-content"} />
              <NavigationContainer linking={LinkingConfiguration}>
                <AppStackStack initialRoute={initialRoute} />
              </NavigationContainer>
            </View>

        )
    } 


  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
    },
  });

  export default function AppWrapper(){
    return(
      <Provider store={store} >
        <App />
      </Provider>
    )
  }
