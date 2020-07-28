import { MeetingList, sortMeetings } from './MeetingSearchScreen'
import { useLayout } from '../hooks/useLayout';
import { useColors } from '../hooks/useColors';
import { StyleSheet, Text, View, } from 'react-native';
import React, { useState, useEffect } from 'react';
import log from "../util/Logging"
import { Provider, shallowEqual, useSelector } from 'react-redux';
import { createStackNavigator, } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import HeaderComponent from "../components/HeaderComponent"
import { LinearGradient } from "expo-linear-gradient"
import { useSafeArea } from 'react-native-safe-area-context';

import AppBanner from '../components/AppBanner';
const MeetingStack = createStackNavigator();

export default function MeetingSearchScreenStack() {
  const { colors: Colors } = useColors();
  const layout = useLayout();
  const styles = useStyles()
  log.info(`rendering meetingstack`)
  return (
    <MeetingStack.Navigator >
      <MeetingStack.Screen
        name="homeGroup"
        component={HomeGroupsScreen}

        options={({ navigation, route }) => ({

          headerMode: "float",
          headerTransparent: true,
          header: ({ scene, previous, navigation }) => {
            return (
              <HeaderComponent scene={scene} previous={previous} navigation={navigation}
                title={"Meetings"} rightIcon={<Ionicons name="md-search" color={Colors.primaryContrast} size={24 * layout.scale.height} />}
                rightIconNavigation={'meetingSearch'} />)
          }

        })}

      />



    </MeetingStack.Navigator>
  )
}


function HomeGroupsScreen({ navigation, route, ...props }) {
  const { colors: Colors } = useColors();
  const layout = useLayout();
  const styles = useStyles()
  let meetingSection = undefined;
  const insets = useSafeArea()
  let signin = ""
  if (!props.authenticated) {
    signin = "Start by signing in or creating an account. ";
  }
  let emptyComponent =
    <View style={{ backgroundColor: '#FFFFFF33', marginTop: 10 * layout.scale.height, paddingVertical: 10 * layout.scale.height, paddingHorizontal: 10 * layout.scale.width }}>
      <Text style={{ color: Colors.primaryContrast, fontSize: 16 * layout.scale.width, fontFamily: 'opensans' }}>
        {`You have no saved seats. ${signin} Search for your favorite meeting and save a seat.`}</Text>
    </View>
  let meetings = useSelector((state) => state.general.meetings, shallowEqual)
  meetings = sortMeetings(meetings)

  return (
    <LinearGradient style={[styles.container,]}
      colors={[Colors.primary, Colors.primaryL1]}
      start={[0, 0]}
      end={[1.5, 1.5]}
      locations={[0, .5]}
    >

      <View style={{ paddingTop: insets.top + 50 * layout.scale.height }}></View>
      <MeetingList meetingData={meetings} style={{}} emptyComponent={emptyComponent}
        action={row => navigation.navigate('Details', row)} />


    </LinearGradient>

  )
}

function useStyles() {
  const { colors: Colors } = useColors();
  const layout = useLayout();
  const styles = StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor: '#FFF',
      justifyContent: "flex-start"
    },
    meetingSection: {
      flex: 20,
      borderTopWidth: 1,
      borderTopColor: 'slategray',
    },
    section: {
      paddingHorizontal: 10 * layout.scale.width,
      paddingTop: 10 * layout.scale.width,
    },
    sectionHeading: {
      fontSize: 18 * layout.scale.width,
      paddingLeft: 10 * layout.scale.width,
      paddingVertical: 3,
      width: '100%',

    },
    meetings: {
      height: '30%',
      borderColor: '#fff',
      borderBottomWidth: 3,
    },
    icon: {
      color: 'gray'
    },
    gratitude: {
      height: '30%',
      borderColor: '#fff',
    },
    contentContainer: {
      flex: 1,
      justifyContent: "flex-start"
    },




  });
  return styles
}