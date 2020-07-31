
import React, { useState } from 'react';
import {
  StyleSheet, Text, TouchableOpacity, View,
  Animated, Easing
} from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';

import { Octicons } from '@expo/vector-icons';

import moment from 'moment'

import JournalScreen from './JournalScreen'

import CircleScreen from './GratitudeCircleScreen'

import log from "../util/Logging"
import {useColors} from '../hooks/useColors'
import {useLayout} from '../hooks/useLayout'

const GratitudeStack = createStackNavigator();
const JournalStack = createStackNavigator();

export default function GratitudeScreenStack() {
  log.info(`rendering GratitudeStack stack`)
  const Layout = useLayout();
  const {colors: Colors} = useColors();
  return (
    <GratitudeStack.Navigator >
      <GratitudeStack.Screen
        name="gratitude"
        component={GratitudeScreen}

        options={({ navigation, route }) => ({
          title: "",
          headerStyle: {
            backgroundColor: Colors.primary1,
          },
          headerLeft: () => {
            return <Text style={{ color: 'white', fontFamily: 'opensans', fontSize: 21 * Layout.scale.width, paddingLeft: 10 * Layout.scale.width }}>Gratitude</Text>
          },


          headerTintColor: '#fff',
          headerTitleStyle: {

            fontFamily: 'opensans-bold',
            fontSize: 18 * Layout.scale.width,
            textAlign: 'left',
          },


        })}
      />

    </GratitudeStack.Navigator>
  )
}


function JournalScreenStack() {
  log.info(`rendering JournalStack stack`)
  const Layout = useLayout();
  const {colors: Colors} = useColors();
  return (
    <JournalStack.Navigator screenOptions={{ headerShown: false }}>


      <JournalStack.Screen
        name="circle"
        component={CircleScreen}

        options={({ navigation, route }) => ({

          headerStyle: {
            backgroundColor: '#FFF',

          },
          title: '',
          headerTintColor: Colors.primary1,
          headerTitleStyle: {
            fontFamily: 'opensans-bold',
            fontSize: 18 * Layout.scale.width,
          },


        })} />
      <JournalStack.Screen
        name="journal"
        component={JournalScreen}
        title="Journal"

        options={({ navigation, route }) => ({
          headerStyle: {
            backgroundColor: 'white',

          },

          headerTintColor: Colors.primary1,


          headerTitleStyle: {
            fontFamily: 'opensans-bold',
            fontSize: 18 * Layout.scale.width,
          },
        })} />
    </JournalStack.Navigator>
  )
}





function GratitudeScreen({ navigation, ...props }) {

  const Layout = useLayout();
  const {colors: Colors} = useColors();
  const styles = useStyles();
  log.info(`rendering gratitudescreen`)
  const [offset, setOffset] = useState(new Animated.Value(Layout.window.width * .008))
  const [isJournal, setIsJournal] = useState(true)

  React.useLayoutEffect(() => {

    navigation.setOptions({

      headerRight: () => {
        return (
          <TouchableOpacity onPress={() => navigation.navigate('circleAdmin')} >
            <Octicons name="gear" color={Colors.primaryContrast} size={24} style={{ marginRight: 10 * Layout.scale.width, paddingTop: 2.5, height: 34, width: 34, borderWidth: 2, borderColor: Colors.primaryContrast, borderRadius: 17, paddingLeft: 4 * Layout.scale.width }} />
          </TouchableOpacity>
        )
      },

    });


  }, [isJournal])

  function goToJournal() {
    setIsJournal(true)
    navigation.navigate('journal')
    Animated.timing(offset, {
      toValue: (Layout.window.width * .008),
      useNativeDriver: true,
      duration: 200,
      easing: Easing.inOut(Easing.ease)
    }).start();
  }

  function goToCircle() {
    setIsJournal(false)
    navigation.navigate('circle')
    Animated.timing(offset, {
      toValue: Layout.window.width * .47,
      useNativeDriver: true,
      duration: 200,
      easing: Easing.inOut(Easing.ease)
    }).start();
  }

  const transform = {
    transform: [{ translateX: offset }]
  }
  const shadow = Platform.OS === 'ios' ? {
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: .3,
  } : { elevation: 3 }

 

  return (
    <View style={styles.container}>

      <JournalScreenStack />

    </View>
  );
}

function useStyles(){
  const Layout = useLayout();
  const {colors: Colors} = useColors();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFF',
    },
    contentContainer: {
      paddingTop: 15,
    },
    optionIconContainer: {
      marginRight: 12,
    },
    option: {
      backgroundColor: '#ffffff33',
      paddingHorizontal: 15,
      paddingVertical: 15,
      marginVertical: 3*Layout.scale.height,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: Colors.primaryContrast,
  
  
    },
    lastOption: {
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
    optionText: {
      fontSize: 15 * Layout.scale.width,
      color: Colors.primaryContrast,
      fontFamily: 'opensans',
      alignSelf: 'flex-start',
      marginTop: 1,
    },
  });

  return styles
}

