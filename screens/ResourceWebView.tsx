

import { WebView } from 'react-native-webview';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';


import {useColors} from '../hooks/useColors';
import log from "../util/Logging"


export default function ResourceWebView({navigation, route}){
  const { link } = route.params;


  log.info(`rendering ResourceWebView ${link}`)


  const styles = useStyles();
  return (

    <WebView source={{uri: link}}>

    </WebView>

    
  );
}


function useStyles(){
  const {colors} = useColors();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fafafa',
      
    },

    optionIconContainer: {
      marginRight: 12,
    },
    option: {
      backgroundColor: '#fdfdfd',
      paddingHorizontal: 15,
      paddingVertical: 15,
      borderWidth: StyleSheet.hairlineWidth,
      borderBottomWidth: 0,
      borderColor: '#ededed',
    },
    lastOption: {
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
    optionText: {
      fontSize: 15,
      alignSelf: 'flex-start',
      marginTop: 1,
    },
  });
  return styles;
}

