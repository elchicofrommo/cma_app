
import React, { useState, useEffect, useCallback, memo } from 'react';
import {
    Image, Platform, StyleSheet, Text, TouchableOpacity,
    TextInput, View, Button, Dimensions, Keyboard, Linking, FlatList
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { connect } from 'react-redux';
import AppBanner from '../components/AppBanner'

import { useFocusEffect } from '@react-navigation/native';
import { HeaderStyleInterpolators, HeaderBackButton } from '@react-navigation/stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCertificate } from '@fortawesome/free-solid-svg-icons';
import Colors from '../constants/Colors';

const {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT
} = Dimensions.get('window')
import Layout from '../constants/Layout';

function GratitudeCircleScreen({ route, navigation, ...props }) {



    return (
        <View style={styles.container}>
            <AppBanner />
            <View style={styles.details}>

                
                <Text style={[styles.text,styles.sectionHeader]}>Circle SCreen</Text>

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

export default GratitudeCircleScreen;