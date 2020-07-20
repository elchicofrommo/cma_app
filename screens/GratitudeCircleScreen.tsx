import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  TouchableWithoutFeedback,

} from "react-native";
import Modal from "react-native-modal";
import AppBanner from "../components/AppBanner";
import { shallowEqual, useSelector } from "react-redux";
import { store } from "../components/store";
import Carousel, { Pagination } from "react-native-snap-carousel";
import log from "../util/Logging"
import {
  User,
  UserChannel,
  Channel,
  Gratitude,
  Broadcast,
} from "../types/gratitude";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import fetchApi from "../api/fetch";
import mutateApi from "../api/mutate";
import GratitudeList from "../components/GratitudeList";
import { getInputRangeFromIndexes } from "react-native-snap-carousel";
import { LinearGradient } from "expo-linear-gradient";
import { Octicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

function GratitudeCircleScreen({ route, navigation, ...props }) {
  const user: User = useSelector(
    (state) => state.general.operatingUser,
    shallowEqual
  );
  const personalGratitudes: Gratitude[] = useSelector(
    (state)=> state.general.gratitudes, shallowEqual
  )
  const broadcasts: Map<string, Broadcast[]> = useSelector(
    (state)=> state.general.broadcastsByChannel
  )

  const [refreshing, setRefreshing] = useState(false);
  const [gratitudeToShare, setGratitudeToShare] = useState<Gratitude>(undefined)

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentGratitudes, setCurrentGratitudes] = useState <Gratitude[]>([])
  const originalUserChannels: UserChannel[] = useSelector(
    (state) => state.general.userChannels,
    shallowEqual
  );
  // push "journal" as the first user channel

  const journalChannel: UserChannel = {
    id: "journal",
    channelId: "journal",
    channel: {
      id: "journal",
      shortId: "journal",
      name: "Journal",
      ownerId: user.id,
      owner: user
    },
    userId: user.id,
  }
  let userChannels: UserChannel[] = [journalChannel]
  userChannels = userChannels.concat(originalUserChannels)
  //const [modalHeight, setModalHeight] = useState(0)


  async function shareGratitude(userChannel: UserChannel){

    const results = await mutateApi.createBroadcast(gratitudeToShare.id, userChannel.channelId, user.id)
    log.info(`results from broadcast`, {results})
    store.dispatch({type: "SET_BANNER", banner: {message: "Gratitude shared", status: "info"}})
  }
  /*
  async function loadGratitudes() {
    setRefreshing(true);
    const broadcastMap = await fetchApi.fetchBroadcastGratitude(userChannels,);
    log.info(
   
    );
    setBroadcasts(broadcastMap);
    setRefreshing(false);
  }

  useEffect(() => {
    loadGratitudes();
  }, []);
  */

  useEffect(()=>{

    if(currentIndex ==0){

      setCurrentGratitudes(personalGratitudes)
    }else{
      log.info(`setting gratitude list for`, { userChannel: userChannels[currentIndex].channel.name})
      const gratitudes: Gratitude[] = broadcasts.get(userChannels[currentIndex].channelId)
      .map((broadcast) => broadcast.gratitude)
      setCurrentGratitudes(gratitudes)
    }
  },[broadcasts, currentIndex, personalGratitudes])

  function renderUserChannel({
    item,
    index,
  }: {
    item: UserChannel;
    index: number;
  }) {
    
    return (
      <View style={{ justifyContent: "center",  }}>
        <Text
          style={{
            textAlign: "center",
            fontSize: 22,
          }}
        >
          {item.channel.name}
        </Text>
      </View>
    );
  }

  // Perspective effect
  function scrollInterpolator2(index, carouselProps) {
    const range = [2, 1, 0, -1, -2];
    const inputRange = getInputRangeFromIndexes(range, index, carouselProps);
    const outputRange = range;

    return { inputRange, outputRange };
  }
  function animatedStyles2(index, animatedValue, carouselProps) {
    return {
      zIndex: index - carouselProps.data.length,
      opacity: animatedValue.interpolate({
        inputRange: [-1, 0, 1, 2],
        outputRange: [0.5, 1, 0.5, 0.4],
      }),
      transform: [
        {
          translateX: animatedValue.interpolate({
            inputRange: [-1, 0, 1, 2],
            outputRange: [
              -Layout.window.width *.008,
              0,
              Layout.window.width *.008,
              0.6,
            ],
            extrapolate: "clamp",
          }),
        },
        {
          scale: animatedValue.interpolate({
            inputRange: [-1, 0, 1, 2],
            outputRange: [0.2, 1, 0.2, 0.5],
          }),
        },
        {},
      ],
    };
  }


  return (
    <View style={styles.container}>
      <AppBanner />
    <View style={{flexDirection: 'row', alignItems: "center"}} >
      <View
        style={[
          styles.details,
          { 
            justifyContent: "center", 
            alignItems: "center" , 
            borderRadius: 25,
            borderWidth: 2,
            borderColor: Colors.primary,
            marginHorizontal: 10 * Layout.scale.width,
            paddingVertical: 2,
            overflow: 'hidden'
          },
        ]}
      >

        <LinearGradient
          colors={["#a0a0a066", "#a0a0a044", "#f1f1f000", "#a0a0a044", "#a0a0a066"]}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            borderRadius: 16,
          }}
          start={[0, 0]}
          end={[1, 1]}
          locations={[0, 0.05, 0.5, 0.95, 1]}
        />
        <Carousel
          data={userChannels}
          renderItem={renderUserChannel}
          layout={`default`}
          sliderWidth={Layout.window.width -70}
          itemWidth={(Layout.window.width - 70) / 1.2}
          containerCustomStyle={
            {
              flexGrow: 0
            }
          }
          enableMomentum={false}
          decelerationRate={'fast'}
          useScrollView={true}
          loop={false}
          firstItem={0}
          onBeforeSnapToItem={(index)=>setCurrentIndex(index)}
          scrollInterpolator={scrollInterpolator2}
          slideInterpolatedStyle={animatedStyles2}
        /><Pagination
            
              dotsLength={userChannels.length}
              activeDotIndex={currentIndex}
              containerStyle={{
                alignSelf: 'center', 
                padding: 0, 
                marginTop: -50,
                marginBottom: -4
              }}
              inactiveDotElement={
                <View style={{backgroundColor:Colors.primaryL2, width: 5, height: 5,borderRadius: 3, marginLeft: 3, marginRight: 3, marginTop: 0, marginBottom: -45,}} />
              }
            dotElement={
                <View style={{backgroundColor:Colors.primary, width: 5, height: 5,borderRadius: 3,  marginLeft: 3, marginRight: 3, marginTop: 0, marginBottom: -45,}} />
              }
              inactiveDotOpacity={0.4}
              inactiveDotScale={0.6}
            />
           
      </View>
      <TouchableOpacity  onPress={() => navigation.navigate('editor')} style={{marginLeft: -2}}>
    
        <MaterialCommunityIcons name="feather" color={Colors.primary} size={22} style={{paddingRight: 20 * Layout.scale.width, paddingTop: 4, height: 34, width: 34, borderWidth: 2, borderColor: Colors.primary, borderRadius: 17, paddingLeft: 4}} />
      </TouchableOpacity>

  </View>
      <GratitudeList
        gratitudeData={currentGratitudes}
        channelId={currentIndex!=0 ? userChannels[currentIndex].channelId: undefined }
        action={setGratitudeToShare}
        navigation={navigation}
      />
<Modal
        isVisible={gratitudeToShare!=undefined}
        onBackdropPress={() => setGratitudeToShare(undefined)}
       onSwipeComplete={() => setGratitudeToShare(undefined)}

       backdropOpacity={.2}

    //    onBackButtonPress={() => setVisible(false)}
        swipeDirection={["down"]}
        style={{margin: 0, justifyContent: "flex-end"}}
      >
        <View style={[
          {backgroundColor: 'white', borderTopLeftRadius: 17, borderTopRightRadius: 17, }]}
>
          <SafeAreaView style={{ width: '100%', marginTop: -30  }}>
            <View style={{alignItems: "center"}}>
              <View style={{width: 50, height: 5, backgroundColor: Colors.primary, borderRadius: 5, borderColor: Colors.primary}}></View>
            </View>
            <Text style={{ paddingHorizontal: 10, fontFamily: 'opensans', color: Colors.primary, fontSize: 21 * Layout.scale.width}}>Your Circles</Text>
            {originalUserChannels.map((userChannel: UserChannel)=>{
              return(
                <View key={userChannel.id} style={{flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 3,}}>
                  <Text style={{ flex: 1, fontSize:17}}>{userChannel.channel.name}</Text>
                  <TouchableWithoutFeedback style={{flex: 2, backgroundColor: 'yellow'}} onPress={()=>shareGratitude(userChannel)}>
                    <Text style={{fontSize:17, width: 80}}>Share</Text>
                  </TouchableWithoutFeedback>
                </View>
              )
            })}

          </SafeAreaView>
        </View>
      </Modal>
    </View>
  );
}
const shadow =
  Platform.OS === "ios"
    ? {
        shadowColor: "black",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.3,
      }
    : { elevation: 3 };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingTop: 5 * Layout.scale.width,
  },
});

export default GratitudeCircleScreen;
