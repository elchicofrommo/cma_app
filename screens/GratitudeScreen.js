
import React, { useState } from 'react';
import {
  StyleSheet, Text, TouchableOpacity, View,
  Dimensions, TouchableWithoutFeedback, Animated, Easing, useLayoutEffect
} from 'react-native';
import { BorderlessButton, ScrollView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { MaterialCommunityIcons, Octicons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import moment from 'moment'
import AppBanner from '../components/AppBanner'
import JournalScreen from './JournalScreen'
import EditorScreen from './GratitudeEditorScreen'
import CircleScreen from './GratitudeCircleScreen'
import Colors from '../constants/Colors';
import log from "../util/Logging"
// Screens imported
import SoberietyTime from '../components/SoberietyTime'


import Layout from '../constants/Layout';


// assets imported
import Logo from '../assets/images/LogoComponent'
import SplashScreen from './SplashScreen'
const GratitudeStack = createStackNavigator();
const JournalStack = createStackNavigator();

export default function GratitudeScreenStack() {
  log.info(`rendering GratitudeStack stack`)
  return (
    <GratitudeStack.Navigator >
      <GratitudeStack.Screen
        name="gratitude"
        component={GratitudeScreen}

        options={({ navigation, route }) => ({
          title: "",
          headerStyle: {
            backgroundColor: Colors.primary,
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
          headerTintColor: Colors.primary,
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

          headerTintColor: Colors.primary,


          headerTitleStyle: {
            fontFamily: 'opensans-bold',
            fontSize: 18 * Layout.scale.width,
          },
        })} />
    </JournalStack.Navigator>
  )
}





function GratitudeScreen({ navigation, ...props }) {
  const readerDate = moment();
  const buttonSize = 32;
  log.info(`rendering gratitudescreen`)
  const [offset, setOffset] = useState(new Animated.Value(Layout.window.width * .008))
  const [isJournal, setIsJournal] = useState(true)

  React.useLayoutEffect(() => {

    navigation.setOptions({

      headerRight: () => {
        return (


          <TouchableOpacity onPress={() => navigation.navigate('circleAdmin')} >

            <Octicons name="gear" color={Colors.primaryContrast} size={24} style={{ marginRight: 10 * Layout.scale.width, paddingTop: 2.5, height: 34, width: 34, borderWidth: 2, borderColor: Colors.primaryContrast, borderRadius: 17, paddingLeft: 4 }} />
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

  /*
        <View style={{ backgroundColor: '#fff', paddingTop: 10 * Layout.scale.width, paddingHorizontal: 10 * Layout.scale.width, }}>
        <View style={{ position: 'relative', zIndex: 1, flexDirection: 'row', paddingVertical: 0, height: 34, justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#d1d7dd', borderRadius: 17, }}>
          <TouchableWithoutFeedback onPress={goToJournal}><Text style={[{ position: 'relative', zIndex: 5, elevation: 4, flex: 1, textAlign: 'center', color: (isJournal ? Colors.primary : 'black'), }, styles.textField]}>Journal</Text></TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={goToCircle}><Text style={[{ position: 'relative', zIndex: 5, elevation: 4, flex: 1, textAlign: 'center', color: (isJournal ? 'black' : Colors.primary), }, styles.textField]}>Circle</Text></TouchableWithoutFeedback>
          <Animated.View style={[{ position: 'absolute', zIndex: 3, height: 29, width: '49%', backgroundColor: 'white', top: 2.5, left: 0, borderRadius: 16, ...shadow, ...transform }]}></Animated.View>
        </View>

      </View>
  */

  return (
    <View style={styles.container}>
      <AppBanner />

      <JournalScreenStack />

    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  meetingSection: {
    flex: 20,
    borderTopWidth: 1,
    borderTopColor: 'slategray',
  },
  readerSection: {
    flex: 10.7 * Layout.scale.width * Layout.ratio,
    marginBottom: 5,
  },
  section: {
    paddingHorizontal: 10 * Layout.scale.width,
    paddingTop: 10 * Layout.scale.width,
  },
  sectionHeading: {
    fontSize: 18 * Layout.scale.width,
    paddingLeft: 10 * Layout.scale.width,
    paddingVertical: 3,
    width: '100%',

  },
  meetings: {
    height: '30%',
    borderColor: '#fff',
    borderBottomWidth: 3,
    height: '30%'
  },
  icon: {
    color: 'gray'
  },
  gratitude: {
    height: '30%',
    borderColor: '#fff',
    height: '30%'
  },
  contentContainer: {
    flex: 1,
    justifyContent: "flex-start"
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },

  getStartedContainer: {
    marginHorizontal: 20,
  },
  gratitudeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  headerButton: {

    backgroundColor: Colors.primary,
    borderColor: Colors.primaryContrast,
    borderWidth: 2,
    borderRadius: 17,
    marginRight: 10 * Layout.scale.width,
    marginTop: 0,
    paddingTop: 0,
    lineHeight: 0,
  },
  plusButton: {
    backgroundColor: Colors.appRed,
    borderColor: Colors.primaryContrast,

    fontFamily: "opensans",
    color: Colors.primaryContrast,
    fontSize: 30 * Layout.scale.width,



  },
  icon: {

  },
  minus: {
    color: '#f36468'
  },
  plus: {
    color: 'green'
  },
  directions: {
    color: '#0273b1'
  },

  helpContainer: {
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  directions: {
    paddingVertical: 5 * Layout.scale.width,
    color: 'blue',
  },
  textField: {
    fontSize: 17 * Layout.scale.width,
    fontFamily: 'opensans'
  },




});
