import Modal from "react-native-modal";
import React, { useState, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";

import log from "../util/Logging"
import {
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableWithoutFeedback,

} from "react-native";
import {

    UserChannel,
    Gratitude,
  } from "../types/gratitude";
  import Colors from "../constants/Colors";
  import Layout from "../constants/Layout";

export function GratitudeShareModal({gratitudeId, isVisible, shareCallback, dismissCallback}: 
        {gratitudeId: string, isVisible: boolean, shareCallback: Function, dismissCallback: Function}){
    const gratitude = useSelector((state)=>{
        const temp: Gratitude = state.general.gratitudes.find((gratitude:Gratitude)=>gratitude.id === gratitudeId)
        log.info(`found gratitude for modal `, {gratitude: temp})
        return temp
    })
    const userChannels = useSelector((state)=>state.general.userChannels)
    return(
        <Modal
        isVisible={isVisible}
        onBackdropPress={() => dismissCallback()}
       onSwipeComplete={() => dismissCallback()}

       backdropOpacity={.2}

    //    onBackButtonPress={() => setVisible(false)}
        swipeDirection={["down"]}
        style={{margin: 0, justifyContent: "flex-end"}}
      >
        <View style={[
          {backgroundColor: 'white', borderTopLeftRadius: 17, borderTopRightRadius: 17, }]}
>
          <SafeAreaView style={{ width: '100%', marginTop: -30 , paddingBottom: 15 }}>
            <View style={{alignItems: "center"}}>
              <View style={{width: 50, height: 5, backgroundColor: Colors.primary, borderRadius: 5, borderColor: Colors.primary}}></View>
            </View>
            <Text style={{ paddingHorizontal: 10, paddingTop: 10, fontFamily: 'opensans', color: Colors.primary, fontSize: 21 * Layout.scale.width}}>Your Circles</Text>
            {userChannels.map((userChannel: UserChannel)=>{
              const broadcast = gratitude?.broadcasts.items.filter(
                broadcast=>broadcast.channelId===userChannel.channelId
              )
              const isBroadcastAlready = broadcast?.length > 0
              return(
                <View key={userChannel.id} style={{flexDirection: 'row', justifyContent: 'flex-start', paddingHorizontal: 10, paddingVertical: 5,}}>
                  <Text style={{flex: 3, fontSize:17}}>{userChannel.channel.name}</Text>
                  <TouchableWithoutFeedback onPress={()=>shareCallback(userChannel, isBroadcastAlready? broadcast[0].id: undefined)} >
                    <View style={[{ backgroundColor: isBroadcastAlready? '#f36468': 'green', borderRadius: 17, padding: 5,},shadow]}>
                     <Text style={[{fontSize:17, width: 80, textAlign: 'center', color: 'white'} ,{color: 'white'}]}>{isBroadcastAlready?"Unshare": "Share"}</Text>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              )
            })}

          </SafeAreaView>
        </View>
      </Modal>
    )
}

const shadow =
  Platform.OS === "ios"
    ? {
        shadowColor: "black",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.3,
      }
    : { elevation: 3 };