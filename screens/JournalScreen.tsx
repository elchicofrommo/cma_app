
import React, { useState, useEffect, useCallback, memo } from 'react';
import {
    Image, Platform, StyleSheet, Text, TouchableOpacity,
    TextInput, View, Button, Dimensions, Keyboard, Linking, FlatList
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { connect } from 'react-redux';
import AppBanner from '../components/AppBanner'
import Colors from '../constants/Colors';
import MeetingDetailMenu from '../navigation/MeetingDetailMenu'
import { useFocusEffect } from '@react-navigation/native';
import { HeaderStyleInterpolators, HeaderBackButton } from '@react-navigation/stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCertificate } from '@fortawesome/free-solid-svg-icons';

const {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT
} = Dimensions.get('window')
import Layout from '../constants/Layout';

function JournalScreen({ route, navigation, ...props }) {
    

    return (
        <View style={styles.container}>
            <AppBanner />
            <Text>holder for journal screen</Text>
            

        </View>
    )
}

const styles = StyleSheet.create({
    mapStyle: {
        width: '100%',
        marginBottom: 20,
        flex: 6,
        backgroundColor: '#dadde0'
    },
    address:{
        flex: 2,
        justifyContent: "flex-end",
        paddingHorizontal: 10 * Layout.scale.width,
    },
    sectionHeader: {
        fontWeight: 'bold',
        paddingTop: 10* Layout.scale.width
    },
    directions: {
        paddingVertical: 5 * Layout.scale.width,
        color: 'blue',
    },
    title: {
        fontSize: 22 * Layout.scale.width, 
        fontWeight: 'bold' 
    },
    typesContainer:{
        flexDirection: 'row',
        flexWrap: 'wrap', 
    },
    type: {
        width: '30%',
        textTransform: "capitalize",
    },
    text: {
        flexWrap: 'wrap',
        fontSize: 12 * Layout.scale.width,
        
    },

    details: {
        flex: 5,
        paddingHorizontal: 10 * Layout.scale.width,
    },
    badge: {
        color: '#f4b813',
        marginTop: -3,
    },
    container: {
        flex: 1, 
        backgroundColor: '#FFF' ,
        paddingTop: 5 * Layout.scale.width,
    }

});

JournalScreen = connect(
    function mapStateToProps(state, ownProps) {
        console.log(`DetailsScreen connect observed redux change, detail ${state.general.meetingDetail}`)

        return {

        };
    },
    function mapDispatchToProps(dispatch) {
        return {

            dispatchShowDetail: (data) => {
                dispatch(async (d1) => {
                    return new Promise(resolve => {
                        console.log(`step 1`);
                        dispatch({ type: "SET_DETAIL", meetingDetail: data })
                        console.log(`step 3`);
                        dispatch({ type: "SHOW_DETAIL" })
                        resolve();
                    })
                })
            },
            dispatchSetDetail: (data) => {
                console.log(`set detail data is `)
                dispatch({ type: "SET_DETAIL", meetingDetail: data })
            },
            dispatchRegisterSubmenu: (data) => {
                console.log("registering gratitude submenu")
                dispatch({ type: "REGISTER_SUBMENU", data })
            }

        }
    },

)(JournalScreen)

const config = {
    animation: 'timing',
    config: {
        duration: 200
    }
}


export default JournalScreen;