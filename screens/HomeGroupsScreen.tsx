import {MeetingList, sortMeetings} from './MeetingSearchScreen'
import Layout from '../constants/Layout';
import Colors from '../constants/Colors';
import {StyleSheet, Text,  View,  } from 'react-native';
import React, {useState, useEffect} from 'react';
import log from "../util/Logging"
import { Provider, shallowEqual, useSelector  } from 'react-redux';
import { createStackNavigator, } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import { TouchableOpacity } from 'react-native-gesture-handler';
const MeetingStack = createStackNavigator();  

export default function MeetingSearchScreenStack() {
    log.info(`rendering meetingstack`)
    return (
      <MeetingStack.Navigator >
        <MeetingStack.Screen
          name="homeGroup"
          component={HomeGroupsScreen}
  
          options={({ navigation, route }) => ({
  
            headerStyle: {
              backgroundColor: Colors.primary,
  
            },
            headerLeft: () => {
              return <Text style={{ color: 'white', fontFamily: 'opensans', fontSize: 21 * Layout.scale.width, paddingLeft: 10 * Layout.scale.width }}>Meetings</Text>
            },
            title: "",
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontFamily: 'merriweather',
              fontSize: 18 * Layout.scale.width
            },
  
  
  
          })}
        />
     
        
  
      </MeetingStack.Navigator>
    )
  }
  

function HomeGroupsScreen({navigation, route, ...props}){
  let meetingSection = undefined;
  let signin = ""
  if(!props.authenticated){
      signin = "Start by signing in or creating an account. ";
  }
  let emptyMessage = `You have no saved seats. ${signin} Search for your favorite meeting and save a seat.`
  let meetings = useSelector((state)=>state.general.meetings, shallowEqual)
  meetings = sortMeetings(meetings)


React.useLayoutEffect(() => {
    log.info("maing a new save button");

    
    navigation.setOptions({
        
      headerRight: () => (

        <TouchableOpacity  onPress={
                
            () => {
              navigation.navigate('meetingSearch')
            }
          } 
          style={{width: 34, height: 34, backgroundColor: Colors.primary, borderColor:'#FFF', 
          borderWidth: 2, borderRadius: 17, justifyContent: 'center', alignItems: 'center',
          marginRight: 10 * Layout.scale.width}}>
           <Ionicons name="md-search" color={Colors.primaryContrast} size={24} />
          </TouchableOpacity>

      ),
    });
  }, []);

  return (
    <View style={styles.container}>
        <View style={{borderBottomColor: 'slategray', borderBottomWidth: 1, padding:0, }}></View>
        <MeetingList meetingData={meetings} style={{}}
            action={row=> navigation.navigate('Details', row)} emptyMessage={emptyMessage} />


    </View>
  )
}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#FFF',
        justifyContent: "flex-start"
      },
    meetingSection:{
      flex: 20,
      borderTopWidth: 1,
      borderTopColor: 'slategray',
    },
    section:{
      paddingHorizontal: 10 * Layout.scale.width,
      paddingTop: 10 * Layout.scale.width,
    },  
    sectionHeading: {
      fontSize: 18 * Layout.scale.width,
      paddingLeft: 10* Layout.scale.width,
      paddingVertical: 3,
      width: '100%',
     
    },
    meetings:{
      height: '30%',
      borderColor: '#fff',
      borderBottomWidth: 3,
    },
    icon:{
      color: 'gray'
    },
    gratitude:{
      height: '30%',
      borderColor: '#fff',
    },
    contentContainer: {
      flex: 1,
      justifyContent: "flex-start"
    },
 
  
    
  
  });
  