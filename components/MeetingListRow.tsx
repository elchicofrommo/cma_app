import React, { useState, useEffect, useCallback, memo } from 'react';
import {
    Image, Platform, StyleSheet, Text, TouchableOpacity,
    TextInput, View, Button, Dimensions, Keyboard, Linking, FlatList
} from 'react-native';
import { SharedElement} from 'react-native-shared-element'
const {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT
} = Dimensions.get('window')
const fontScale = SCREEN_WIDTH / 320;

function shouldUpdateMainRow(prev, next) {
    return prev.meeting._id == next.meeting._id &&
        prev.saved == next.saved
}



const MeetingListRow = memo(({ meeting, saved, navigate }) => {


    console.log("render MeetingComponent is saved " + saved)
    // object is [{name, active, category, start_time (as string), weekday, street, city,state, zip, dist.calculated}
    return (
        <SharedElement id={meeting._id} key={meeting._id} >
        <TouchableOpacity 
            
            onPressOut={(event) => {
                
                console.log(`touch row: is ${JSON.stringify(meeting)}\n`)
               // props.dispatchShowSequence(meeting)
               navigate('Details', meeting)

            }}
            style={{
                backgroundColor: '#FFF',
                borderBottomWidth: 1,
                paddingLeft: 10 * fontScale,
                paddingVertical: 10 * fontScale,
                justifyContent: "space-between",
                flexDirection: "row"
            }}>

            <View style={{ flex: 15 }}>
                <View style={{ flexDirection: 'row', }}>
                    <Text style={[styles.title, { fontSize: 14 * fontScale, fontWeight: 'bold' }]}>{meeting.name}</Text>
                </View>
                <Text style={[styles.title,]}>{meeting.weekday + " " + meeting.start_time}</Text>
                <Text style={styles.title}>{meeting.street}</Text>
                <Text style={styles.title}>{meeting.city}, {meeting.state} {meeting.zip}</Text>
                <Text style={styles.title}>{(meeting.dist.calculated / 1609).toFixed(2)} miles</Text>



            </View>
        </TouchableOpacity>
        </SharedElement>
    )
}, shouldUpdateMainRow)


const styles = StyleSheet.create({

    directions: {
        paddingVertical: 5 * fontScale,
        color: 'blue',
    },
    title: {
        flex: 6,
        flexWrap: 'wrap'
    },
});

export default MeetingListRow