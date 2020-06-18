
import React, { useState, useEffect, useCallback, memo } from 'react';
import {
    Image, Platform, StyleSheet, Text, TouchableOpacity,
    TextInput, View, Button, Dimensions, Keyboard, Linking, FlatList
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { connect } from 'react-redux';
import AppBanner from '../components/AppBanner'

import MeetingDetailMenu from '../navigation/MeetingDetailMenu'
import { useFocusEffect } from '@react-navigation/native';
import { HeaderStyleInterpolators, HeaderBackButton } from '@react-navigation/stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCertificate } from '@fortawesome/free-solid-svg-icons';

import Colors from '../constants/Colors';
import Layout from "../constants/Layout"

function DetailsScreen({ route, navigation, ...props }) {
    console.log(`rendering DetailsScreen route is ${route.params} `)

    const meeting = route.params;

    let moreDetails = undefined
    const types = [];
    route.params.type && route.params.type.forEach(entry=>{
        types.push(<Text key={entry} style={[styles.text, styles.type]}>{entry}</Text> )
    })

    React.useLayoutEffect(() => {
        navigation.setOptions({

          headerLeft: () => <DetailsBackButton navigation={navigation}/>,
        });
      }, [props.navigation]);

    if(route.params.extra){
        const myurl = route.params.extra.match(/https?:\/\/\S+/g)
        const remainder = route.params.extra.replace(/https?:\/\/\S+/g, "")
        console.log(`links is ###${myurl}###`)
        moreDetails = 
            <View>
                <Text style={[styles.text, styles.sectionHeader]}>Additional Details</Text>
                
                <Text style={[styles.text, {color: 'blue'}]} onPress={
                    () => {

                        Linking.canOpenURL(myurl +"").then(supported => {
                            console.log(`seems I should be able to open this url ${JSON.stringify(myurl)}`)
                            if (supported) {
                            Linking.openURL(myurl +"");
                            } else {
                            console.log('Don\'t know how to open URI: ' + myurl);
                            }
                        });

                    }
                }>{myurl}</Text>
                <Text style={[styles.text, ]}>{remainder}</Text>
            </View>
    }
    
    const mapPlaceholder = <View style={styles.mapStyle}></View>
    const [mapComponent, setMapComponent] = useState(mapPlaceholder)
    useEffect((param) => {
        props.dispatchRegisterSubmenu({ submenu: <MeetingDetailMenu key={'meetingSubmenu'} />, name: "detail" })

    }, [])

    useEffect((param) => {
        console.log(`change to route prams, now building meeting map`)
        if (Platform.OS == 'ios') {
            console.log('building map component for ios')
            buildMapComponent()
        }
        else {
            setTimeout(buildMapComponent, 100)
        }

        return () => setMapComponent(mapPlaceholder)
    }, [route.params])

    const buildMapComponent = useCallback(() => {
        setMapComponent(<MapView style={styles.mapStyle} liteMode={true}
            initialRegion={{
                latitude: meeting.location.coordinates[1],
                longitude: meeting.location.coordinates[0],
                latitudeDelta: 0.01022,
                longitudeDelta: 0.00921,
            }}  >
            <Marker coordinate={latlong} title={meeting.name} />
        </MapView>)
    }, [meeting])

    useFocusEffect(() => {

        console.log('focus into details screen ')
        try {
            props.dispatchShowDetail(route.params);

        } catch (e) {
            console.log(`could not dispatch because of ${e}`)
        }
        //  meetingMap =  



    }, [route.params])

    const latlong = {
        latitude: meeting.location.coordinates[1],
        longitude: meeting.location.coordinates[0],
    }
    const badge = meeting.paid && <FontAwesomeIcon icon={faCertificate} style={styles.badge}  size={20}/> 
    const meetingSignup = meeting.paid || <Text style={[styles.text, {paddingTop: 5* Layout.scale.width}]}>
            Would you like this meeting to get access to additional features like group gratitude, 
            online meeting documents, and your own speaker recordings? Bring it up at a business 
            meeting and see if your group would like to sign up. 
        </Text>

    return (
        <View style={styles.container}>
            <AppBanner />
            <View style={styles.details}>
                <View style={{ flexDirection: 'row',justifyContent: 'flex-start' }}>
                    <Text style={[styles.text, styles.title]}>{meeting.name}</Text>
                    {badge}
                </View>
                <Text style={[styles.text,{fontSize: 15 * Layout.scale.width}]}>{meeting.weekday + " " + meeting.start_time}</Text>
                <Text style={[styles.text,styles.sectionHeader]}>Meeting Type</Text>
                <View style={styles.typesContainer}>{types}</View>
                {moreDetails}
                {meetingSignup}
            </View>
            <View style={{flex: 5, justifyContent: 'flex-end'}}>
                <View style={styles.address}>
                    <Text style={styles.text}>{meeting.street}</Text>
                    <Text style={styles.text}>{meeting.city}, {meeting.state} {meeting.zip}</Text>
    
                </View>
                {mapComponent}
            </View>
            

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

DetailsScreen = connect(
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

)(DetailsScreen)

const config = {
    animation: 'timing',
    config: {
        duration: 200
    }
}


const DetailTransition = {

    gestureDirection: 'horizontal',
    transitionSpec: {
        open: config,
        close: config
    }
    ,
    headerStyleInterpolator: HeaderStyleInterpolators.forFade,
    cardStyleInterpolator: ({ current, next, ...props }) => {
        console.log(`XXXXXX Detail transition, current is ${JSON.stringify(current)} next is ${JSON.stringify(next)} closing is ${JSON.stringify(props)}`)
        if (!next) {
            console.log('creating transition for the details card?')
            return {

                cardStyle: {
                    opacity: current.progress.interpolate({
                        inputRange: [.5, 1],
                        outputRange: [0, 1]
                    })
                }
            }
        } else {
            return {

                cardStyle: {
                    transform: [

                        {
                            scale: next.progress.interpolate({
                                inputRange: [0, 1],
                                outputRange: [1, .9],
                            })
                        },
                    ],

                }
            }
        }

    }
}

function DetailsBackButton({ navigation, ...props }) {
    return (
        <HeaderBackButton onPress={(event) => {
            props.dispatchHideDetail()
            navigation.goBack()
        }}
            tintColor={Colors.primary}
        />
    )

}

DetailsBackButton = connect(
    function mapStateToProps(state, ownProps) {
        return {}
    },
    function mapDispatchToProps(dispatch) {
        return {
            dispatchHideDetail: (data) => {
                dispatch(async (d1) => {
                    return new Promise(resolve => {
                        console.log(`dispatch hide hide detail step 1`);
                        dispatch({ type: "HIDE_DETAIL" })

                        console.log(`step 2`)
                        dispatch({ type: "SHOW_MENU" })
                        resolve();

                    })
                })
            }
        }
    })(DetailsBackButton)


export { DetailsScreen, DetailsBackButton, DetailTransition }