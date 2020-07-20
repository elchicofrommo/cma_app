import React, { useState, useEffect, useCallback, memo } from 'react';
import {
    Image, Platform, StyleSheet, Text, TouchableOpacity,
    TextInput, View, Button, Dimensions, Keyboard, Linking, FlatList
} from 'react-native';
import { SharedElement} from 'react-native-shared-element'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCertificate } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment'
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import {Meeting} from '../types/gratitude'

function shouldUpdateMainRow(prev, next) {
    return prev.meeting.id == next.meeting.id &&
        prev.saved == next.saved
}



const MeetingListRow = memo(( { meeting , saved, action}:{meeting: Meeting, saved:any, action:any} ) => {

    const badge = meeting.paid ? <FontAwesomeIcon icon={faCertificate} style={styles.badge}  size={15}/> : undefined
    console.log("render MeetingComponent is saved " + saved)
    let meetingName = meeting.name.substring(0, Math.floor(20 * Layout.scale.width ))
    let day = moment().day(meeting.weekday).format('ddd').toLocaleUpperCase();
    let time = meeting.startTime.replace(/[\sm]/gi, "")
    if(meetingName.length < meeting.name.length)
        meetingName += "..."
    // object is [{name, active, category, start_time (as string), weekday, street, city,state, zip, dist.calculated}
    return (

        <TouchableOpacity  key={meeting.id} 
            
            onPress={(event) => {
                
               console.log(`touch row: is ${JSON.stringify(meeting)}\n`)
               action(meeting)

            }}
            style={styles.rowContainer}>

            <View style={styles.rowData}>
                <View style={{flex: 2.2, alignItems: 'flex-start', justifyContent: 'center', }}>
                    <Text style={[styles.title, styles.day,  {flex: 1, color: Colors.primary, fontWeight: 'bold',  width: '100%', textAlign: 'center'}]}>{day}</Text>
                    <Text style={[styles.title, {flex: 1, color: Colors.primary, fontWeight: 'bold', textTransform: 'lowercase',  width: '100%', textAlign: 'center'}]}>{time}</Text>
                </View>
                <View style={{flex: 1.2, alignItems: 'flex-end'}}>
                    {badge}
                </View>
                <View style={{ flexDirection: 'row', flex: 13, alignItems: 'center'}}>
                    <Text style={[styles.title, {fontFamily: 'opensans-bold',  fontSize: 14 * Layout.scale.width, fontWeight: 'bold' }]}>{meetingName}</Text>
                </View>
                <View style={{flex: 2, paddingRight: 10 * Layout.scale.width, alignItems: 'flex-start', justifyContent: 'center'}}>
                    <Text style={styles.title}>{meeting.distance? (meeting.distance/ 1609).toFixed(2) + " miles": ""} </Text>
                </View>
                
                



            </View>

                

        </TouchableOpacity>

    )
}, shouldUpdateMainRow)


const styles = StyleSheet.create({
    rowContainer:{
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        paddingLeft: 10 * Layout.scale.width,
        paddingVertical: 15 * Layout.scale.width,
        
        justifyContent: "space-between",
        flexDirection: "row",
        position: 'relative',

    },
    rowData: {
        flex: 1, 
        flexDirection: 'row'
    },
    directions: {
        paddingVertical: 5 * Layout.scale.width,
        color: 'blue',
    },
    title: {
        flexWrap: 'nowrap',
        fontSize: 10 * Layout.scale.width,
    },
    day: {
        fontSize: 12 * Layout.scale.width,
        marginBottom: -2 * Layout.scale.width,
    },
    badge: {
        color: '#f4b813',
        marginRight: 2,
    }
});

export default MeetingListRow