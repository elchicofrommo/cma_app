
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
import { Gratitude } from '../models/index';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Octicons, Entypo, FontAwesome } from '@expo/vector-icons';

function JournalScreen({ route, navigation, ...props }) {


    return (
        <View style={styles.container}>
            <AppBanner />


            <GratitudeList gratitudeData={props.gratitude}
                action={(row) => {
                    // props.dispatchHideMenu(); 
                    //navigation.navigate('Details', row)
                    alert('row was touched')
                }} />

        </View>
    )
}

function GratitudeList({ gratitudeData, action, style = {} }) {
    console.log(`rendering gratitude list ${JSON.stringify(gratitudeData)}`)

    function likeGratitude() {

    }
    function unlikeGratitude() {

    }

    const renderCallback = useCallback(({ item, index }, rowMap) => {

        const counts = item.entries.reduce((accum, current) => {

            accum.likes += current.likes.length
            accum.comments += current.comments.length
            return accum
        }, { likes: 0, comments: 0 })
        counts.comment += item.comments.length;
        counts.likes += item.likes.length


        //renderBackRow({data, rowMaps, props}),[])
        console.log(`item is ${JSON.stringify(item)}  :  index is: ${JSON.stringify(index)} rowMap is ${rowMap} `)
        return (
            <View key={index}>
                <TouchableWithoutFeedback onPress={action} style={styles.gratitudeRow}>
                    <Octicons name="primitive-dot" size={18} color={"black"} style={styles.bullet} />
                    <Text style={[styles.keyboardEntry]}>{item.title}</Text>
                </TouchableWithoutFeedback>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>

                    <Entypo name="leaf" size={14} color={counts.likes > 0 ? "green" : 'grey'} />
                    <Text style={[{ fontSize: 14 }]}>: {counts.likes}</Text>

                    <FontAwesome name="commenting" size={14} color={counts.likes > 0 ? Colors.appBlue : "grey"} />
                    <Text style={[{ fontSize: 14 }]}>: {counts.comments}</Text>
                </View>
            </View>


        )
    }, [])

    const keyExtractor = useCallback((item, index) => {

        return index
    }, [])

    return (
        <FlatList
            data={gratitudeData}
            renderItem={renderCallback}
            keyExtractor={keyExtractor}
            initialNumToRender={5}
            ListEmptyComponent={<Text style={styles.keyboardEntry}>Start writing your first gratitude</Text>}
            contentContainerStyle={styles.gratitudeList} />
    )
}

const styles = StyleSheet.create({
    mapStyle: {
        width: '100%',
        marginBottom: 20,
        flex: 6,
        backgroundColor: '#dadde0'
    },
    address: {
        flex: 2,
        justifyContent: "flex-end",
        paddingHorizontal: 10 * Layout.scale.width,
    },
    sectionHeader: {
        fontWeight: 'bold',
        paddingTop: 10 * Layout.scale.width
    },
    directions: {
        paddingVertical: 5 * Layout.scale.width,
        color: 'blue',
    },
    title: {
        fontSize: 22 * Layout.scale.width,
        fontWeight: 'bold'
    },
    typesContainer: {
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
        backgroundColor: '#FFF',
        paddingTop: 5 * Layout.scale.width,
    },
    gratitudeList: {
        paddingHorizontal: 10 * Layout.scale.width,
    },
    gratitudeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 5 * Layout.scale.width
    },
    bullet: {
        flex: .8,
    }, keyboardEntry: {
        flex: 10,

        margin: 0,
        flexWrap: 'wrap',
        fontSize: 18,
        fontFamily: 'opensans',
        paddingBottom: 5,
    }

});

JournalScreen = connect(
    function mapStateToProps(state, ownProps) {
        const { gratitude } = state.general
        console.log(`JournalScreen connect observed redux change, gratitude is ${JSON.stringify(gratitude, null, 2)}`)

        return {
            gratitude
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