
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Dimensions, Animated, Easing, Linking, Platform } from 'react-native';
import { RectButton, ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Colors from '../constants/Colors';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlusCircle, faMinusCircle, faDirections } from '@fortawesome/free-solid-svg-icons';

import Layout from '../constants/Layout';

function openMap(lat, long, label) {
    const androidLabel = encodeURIComponent(`(${label})`)
    // console.log(`open map to ${lat} ${long} name: ${androidLabel}`)
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${lat},${long}`;

    const url = Platform.select({
        ios: `${scheme}${label}@${latLng}`,
        android: `${scheme}${latLng}${androidLabel}`
    });


    Linking.openURL(url);
}

const DetailsMenu = (props) => {
    console.log(`render DetailsMenu `)
    const [offset, setOffset] = useState(new Animated.Value(104))

    

   if (props.showEditor) {
        console.log(`going to 0`)
        Animated.timing(offset, {
            toValue: 0,
            useNativeDriver: true,
            duration: 200,
            easing: Easing.inOut(Easing.sin),
        }).start();
    } else {
        console.log(`going to 100`)
        Animated.timing(offset, {
            toValue: 104,
            useNativeDriver: true,
            duration: 200,
            easing: Easing.inOut(Easing.sin),
        }).start();
    }


    const transform = {
        transform: [{ translateY: offset }]
    }

        let button = undefined;

        const buttonSize = 45 * Layout.scale.width

        return (
            <Animated.View style={[styles.menuStyle, transform]}>
                <TouchableOpacity onPress={(event) => { alert('adding gratitude')}}>
                    <FontAwesomeIcon icon={faPlusCircle} style={[styles.icon, styles.plus]} size={buttonSize} />
                </TouchableOpacity>

            </Animated.View>
        )

}

const topPadding = Platform.OS == 'ios' ? 19 : 8

const styles = StyleSheet.create({
    menuStyle: {
        position: 'absolute',
        top: 0,
        left: 0,
        marginTop: -20,
        paddingTop: topPadding,

        paddingHorizontal: 40,
        zIndex: 200,
        height: 100,
        backgroundColor: 'white',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly'
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


export default connect(
    function mapStateToProps(state, ownProps) {
        console.log(`DetailsMenu connect observed redux change, detail ${state.general.meetingDetail}`)

        return {
            showEditor: state.general.showEditor,
            authenticated: state.general.authenticated
        };
    },
    function mapDispatchToProps(dispatch) {
        return {
            dispatchAddMeeting: (data) => {
                console.log("dispatching add meeting " + data)
                dispatch({ type: "ADD_MEETING", data })
            },
            dispatchRemoveMeeting: (data) => {
                console.log("dispatching remove meeting " + data)
                dispatch({ type: "REMOVE_MEETING", data })
            },
            dispatchSetBanner: (message)=>{
                dispatch({type: "SET_BANNER", banner: message})
            }
        }
    },

)(DetailsMenu)
