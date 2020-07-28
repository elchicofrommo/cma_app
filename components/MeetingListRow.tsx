import React, { memo } from 'react';
import {
    StyleSheet, Text, TouchableOpacity,
    View,
} from 'react-native';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCertificate } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment'
import { useColors } from '../hooks/useColors';
import { useLayout } from '../hooks/useLayout'
import { Meeting } from '../types/gratitude'
import log from '../util/Logging'
function shouldUpdateMainRow(prev, next) {
    return prev.meeting.id == next.meeting.id &&
        prev.saved == next.saved
}



const MeetingListRow = memo(({ meeting, saved, action}: { meeting: Meeting, saved: any, action: any}) => {
    const Layout = useLayout();
    const { colors: Colors } = useColors();
    const styles = useStyles()
    const badge = meeting.paid ? <FontAwesomeIcon icon={faCertificate} style={styles.badge} size={15} /> : undefined

    let meetingName = meeting.name.substring(0, Math.floor(20 * Layout.scale.width))
    let day = moment().day(meeting.weekday).format('ddd').toLocaleUpperCase();
    let time = meeting.startTime.replace(/[\sm]/gi, "")
    if (meetingName.length < meeting.name.length)
        meetingName += "..."
    // object is [{name, active, category, start_time (as string), weekday, street, city,state, zip, dist.calculated}
    return (

        <TouchableOpacity key={meeting.id}

            onPress={(event) => {
                requestAnimationFrame(() => {
                    console.log(`touch row: is ${JSON.stringify(meeting)}\n`)
                    action(meeting)
                });



            }}
            style={[styles.rowContainer,]}>

            <View style={styles.rowData}>
                <View style={{ flex: 2.2, alignItems: 'flex-start', justifyContent: 'center', }}>
                    <Text style={[styles.title, styles.day, { flex: 1, color:  Colors.primary1, fontWeight: 'bold', width: '100%', textAlign: 'center' }]}>{day}</Text>
                    <Text style={[styles.title, { flex: 1, color: Colors.primary1, fontWeight: 'bold', textTransform: 'lowercase', width: '100%', textAlign: 'center' }]}>{time}</Text>
                </View>
                <View style={{ flex: 1.2, alignItems: 'flex-end' }}>
                    {badge}
                </View>
                <View style={{ flexDirection: 'row', flex: 13, alignItems: 'center' }}>
                    <Text style={[styles.title,, { fontFamily: 'opensans-bold', fontSize: 14 * Layout.scale.width, fontWeight: 'bold' }]}>{meetingName}</Text>
                </View>
                <View style={{ flex: 2, paddingRight: 10 * Layout.scale.width, alignItems: 'flex-start', justifyContent: 'center' }}>
                    <Text style={[styles.title,]}>{meeting.distance ? (meeting.distance / 1609).toFixed(2) + " miles" : ""} </Text>
                </View>





            </View>



        </TouchableOpacity>

    )
}, shouldUpdateMainRow)

function useStyles() {
    const Layout = useLayout();
    const {colors} = useColors();
    const styles = StyleSheet.create({
        rowContainer: {
            backgroundColor: colors.primaryContrast,
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
    return styles
}

export default MeetingListRow