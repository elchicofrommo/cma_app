import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, Button } from 'react-native';
import { BorderlessButton, ScrollView } from 'react-native-gesture-handler';
import SoberietyTime from '../components/SoberietyTime'
import Svg, { Circle, G, Path } from "react-native-svg";
import {NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faUserCircle} from '@fortawesome/free-solid-svg-icons'

import { MonoText } from '../components/StyledText';

export default function MeetingSearchSCreen() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Meeting Search!</Text>
      </View>
    );
  }
  