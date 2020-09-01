
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

import {useColors} from '../hooks/useColors';
import log from "../util/Logging"


export default function ResourceListingScreen({navigation, route}){
  const { links } = route.params;


  log.info(`rendering ResourceListingScreen`)
  const buttons = [];
  links.forEach(entry=>{
    const URI = encodeURI(`${entry.link}`)

    let action = ()=> {WebBrowser.openBrowserAsync(`${URI}`)}
    if(entry.link.match(/html$/)){
      action = ()=>{navigation.navigate("resourceWebView", {link: URI})}
    }

    buttons.push(
        <OptionButton
            label={entry.label}
            key={URI}
            onPress={() => {
              log.info(`opening up ${URI}`)
              try{
                action();
              }catch(err){
                log.info("could not open up file because of " + err)
              }
            }}
        />
    )
  })
  const styles = useStyles();
  return (
    <View style={styles.container}>
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {buttons}
    </ScrollView>
    </View>
    
  );
}


function OptionButton({ icon, label, onPress, isLastOption }) {
  const styles = useStyles()
  return (
    <RectButton style={[styles.option, isLastOption && styles.lastOption]} onPress={onPress}>
      <View style={{ flexDirection: 'row' }}>
        <View style={styles.optionIconContainer}>
          <Ionicons name={icon} size={22} color="rgba(0,0,0,0.35)" />
        </View>
        <View style={styles.optionTextContainer}>
          <Text style={styles.optionText}>{label}</Text>
        </View>
      </View>
    </RectButton>
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

