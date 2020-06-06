import React, { useState, useEffect, useCallback, memo } from 'react';
import {
    Image, Platform, StyleSheet, Text, TouchableOpacity,
    TextInput, View, Button, Dimensions, Keyboard, Linking, FlatList
} from 'react-native';
import { SharedElement} from 'react-native-shared-element'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCertificate } from '@fortawesome/free-solid-svg-icons';

const {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT
} = Dimensions.get('window')
const fontScale = SCREEN_WIDTH / 320;

function shouldUpdateMainRow(prev, next) {
    return prev.meeting._id == next.meeting._id &&
        prev.saved == next.saved
}



const MeetingListRow = memo(({ meeting, saved, action}) => {

    const badge = meeting.paid ? <FontAwesomeIcon icon={faCertificate} style={styles.badge}  size={15}/> : undefined
    console.log("render MeetingComponent is saved " + saved)
    // object is [{name, active, category, start_time (as string), weekday, street, city,state, zip, dist.calculated}
    return (
        <SharedElement id={meeting._id} key={meeting._id} >
        <TouchableOpacity 
            
            onPress={(event) => {
                
               console.log(`touch row: is ${JSON.stringify(meeting)}\n`)
               action(meeting)

            }}
            style={styles.rowContainer}>

            <View style={styles.rowData}>
                <View style={{ flexDirection: 'row',justifyContent: 'flex-start' }}>
                    <Text style={[styles.title, { fontSize: 14 * fontScale, fontWeight: 'bold' }]}>{meeting.name}</Text>
                    {badge}
                </View>
                <Text style={[styles.title,]}>{meeting.weekday + " " + meeting.start_time}</Text>
                <Text style={styles.title}>{(meeting.dist.calculated / 1609).toFixed(2)} miles</Text>



            </View>

                

        </TouchableOpacity>
        </SharedElement>
    )
}, shouldUpdateMainRow)


const styles = StyleSheet.create({
    rowContainer:{
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        paddingLeft: 10 * fontScale,
        paddingVertical: 10 * fontScale,
        justifyContent: "space-between",
        flexDirection: "row",

        zIndex: 10,
    },
    rowData: {
        flex: 15, 

        zIndex: 20,
    },
    directions: {
        paddingVertical: 5 * fontScale,
        color: 'blue',
    },
    title: {
        flexWrap: 'wrap'
    },
    badge: {
        color: '#f4b813',
        marginTop: -3,
    }
});

export default MeetingListRow