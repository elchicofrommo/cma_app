
import React, { useState} from 'react';
import { StyleSheet, Text, View, Animated, Easing, Linking, Platform } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {useColors} from '../hooks/useColors';
import {useLayout} from '../hooks/useLayout';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlusCircle, faMinusCircle, faDirections } from '@fortawesome/free-solid-svg-icons';
import {User, Meeting} from '../types/circles.'
import log from '../util/Logging'



import mutate from '../api/mutate'

function openMap(lat, long, label) {
    const androidLabel = encodeURIComponent(`(${label})`)
    // log.info(`open map to ${lat} ${long} name: ${androidLabel}`)
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${lat},${long}`;

    const url = Platform.select({
        ios: `${scheme}${label}@${latLng}`,
        android: `${scheme}${latLng}${androidLabel}`
    });


    Linking.openURL(url);
}

const DetailsMenu = ({operatingUser, showDetail, authenticated, detail, ...props} :
    {operatingUser: User, showDetail: boolean, authenticated: boolean,
        detail: Meeting, props: any}) => {
    log.info(`render DetailsMenu `)
    const {colors} = useColors();
    const layout = useLayout();
    const styles = useStyles();
    const [offset, setOffset] = useState(new Animated.Value(layout.safeBottom + 40 * layout.scale.height))


    if (showDetail) {
        log.info(`going to 0`)
        Animated.timing(offset, {
            toValue: 0,
            useNativeDriver: true,
            duration: 200,
            easing: Easing.inOut(Easing.sin),
        }).start();
    } else {
        log.info(`going to 100`)
        Animated.timing(offset, {
            toValue: layout.safeBottom + 40 * layout.scale.height,
            useNativeDriver: true,
            duration: 200,
            easing: Easing.inOut(Easing.sin),
        }).start();
    }



    if (detail) {

        let button = undefined;

        const buttonSize = 45 * layout.scale.height
        log.info(`here's the lsit of meetings for this user `, {operatingUser})
        if (operatingUser.meetingIds?.includes(detail.id)) {
            button = <TouchableOpacity onPress={(event) => { 
                authenticated? props.dispatchRemoveMeeting(detail, operatingUser) : 
                props.dispatchSetBanner({message:`You must sign in to add meetings.`})}}>
                <FontAwesomeIcon icon={faMinusCircle} style={[styles.icon, styles.minus]} size={buttonSize} />
            </TouchableOpacity>
        } else {
            button = <TouchableOpacity onPress={(event) => { authenticated? props.dispatchAddMeeting(detail, operatingUser): 
                props.dispatchSetBanner({message:`You must sign in to add meetings.`}) }}>
                <FontAwesomeIcon icon={faPlusCircle} style={[styles.icon, styles.plus]} size={buttonSize} />
            </TouchableOpacity>
        }
        return (
            <View style={[styles.menuStyle]}>
                {button}
                <TouchableOpacity onPress={(event) => {
                    openMap(
                        detail.location.lat,
                        detail.location.long,
                        detail.name)
                }}>
                    <FontAwesomeIcon icon={faDirections} style={[styles.icon, styles.directions]} size={buttonSize} />
                </TouchableOpacity>
            </View>
        )
    } else {
        return (
            <View style={[styles.menuStyle]}>
                <Text> Blank menu</Text>

            </View>
        )
    }
}

const topPadding = Platform.OS == 'ios' ? 19 : 8

function useStyles(){
    const layout = useLayout();
    const styles = StyleSheet.create({
        menuStyle: {

            paddingVertical: 8 * layout.scale.height,
            marginBottom: layout.safeBottom,
    
            paddingHorizontal: 40,

            backgroundColor: 'white',
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center'
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
        }
    
    })
    return styles;
}



export default connect(
    function mapStateToProps(state, ownProps) {
        log.info(`DetailsMenu connect observed redux change, detail ${state.general.meetingDetail}`)

        return {
            detail: state.general.meetingDetail,
            showDetail: state.general.showDetail,
            authenticated: state.general.operatingUser.role!="guest",
            operatingUser: state.general.operatingUser
        };
    },
    function mapDispatchToProps(dispatch) {
        return {

            dispatchRemoveMeeting: (data:Meeting, operatingUser: User) => {
                dispatch(async (d1) => {
                    let meetingList = operatingUser.meetingIds
                    meetingList = meetingList.filter(id=>id!=data.id)
                    let meetingString = meetingList.join(",");
                    const removeMeetingResult = await mutate.updateUser({
                        id: operatingUser.id,
                        meetingIds: meetingList.join(',')
                    })
                    operatingUser.meetingIds = meetingList
                    log.info(`results from setting meetings is ${JSON.stringify(removeMeetingResult, null, 2)}`)

                    return new Promise(resolve=>{
                        dispatch({ type: "REMOVE_MEETING", data, meetingIds: meetingList })
                        dispatch({ type: "SET_BANNER", banner: {message: "Meeting Removed", status: "info" }})
                    })
                })
                
            },
            dispatchAddMeeting: (data:Meeting, operatingUser: User) => {
                dispatch(async (d1) => {
                    const meetingList = operatingUser.meetingIds||[]
                    meetingList.push(data.id)
                    const addMeetingResult = await mutate.updateUser({
                        id: operatingUser.id,
                        meetingIds: meetingList.join(',')
                    })
                    operatingUser.meetingIds = meetingList
                    log.info(`results from setting meetings is ${JSON.stringify(addMeetingResult, null, 2)}`)

                    return new Promise(resolve=>{
                        dispatch({ type: "ADD_MEETING", data , meetingIds: meetingList})
                        dispatch({ type: "SET_BANNER", banner: {message: "Meeting Saved", status: "info" }})
                    })
                })
              },
            dispatchSetBanner: (message)=>{
                dispatch({type: "SET_BANNER", banner: message})
            }
        }
    },

)(DetailsMenu)
