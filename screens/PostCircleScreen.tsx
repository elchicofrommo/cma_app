import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,

} from "react-native";

import { shallowEqual, useSelector } from "react-redux";
import { store } from "../redux/store";
import Carousel, { Pagination } from "react-native-snap-carousel";
import log from "../util/Logging"
import { PostShareModal} from "../components/PostShareModal"
import {
  User,
  ChannelMember,
  Post,
  Broadcast,
} from "../types/circles.";
import {useColors} from '../hooks/useColors'
import {useLayout} from '../hooks/useLayout'
import mutateApi from "../api/mutate";
import PostList from "../components/PostList";
import { getInputRangeFromIndexes } from "react-native-snap-carousel";
import { LinearGradient } from "expo-linear-gradient";
import {  MaterialCommunityIcons } from "@expo/vector-icons";

function PostCircleScreen({ route, navigation, ...props }) {
  const user: User = useSelector(
    (state) => state.general.operatingUser,
    shallowEqual
  );
  const personalPosts: Post[] = useSelector(
    (state)=> state.general.posts, shallowEqual
  )
  const broadcasts: Map<string, Broadcast[]> = useSelector(
    (state)=> state.general.broadcastsByChannel
  )

  const [refreshing, setRefreshing] = useState(false);
  const [postToShare, setPostToShare] = useState<Post>(undefined)
  const [showModal, setShowModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPosts, setCurrentPosts] = useState <Post[]>([])
  const styles = useStyles();
  const {colors: Colors} = useColors()
  const Layout = useLayout();
  const originalChannelMembers: ChannelMember[] = useSelector(
    (state) => state.general.channelMembers,
    shallowEqual
  );
  // push "journal" as the first user channel

  const journalChannel: ChannelMember = {
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
  let channelMembers: ChannelMember[] = [journalChannel]
  channelMembers = channelMembers.concat(originalChannelMembers)
  //const [modalHeight, setModalHeight] = useState(0)


  async function sharePost(channelMember: ChannelMember, broadcastId: string){

    log.info(`placeholder for share post, broacast id is ${broadcastId}`)
    let results;
    if(!broadcastId){
      results = await mutateApi.createBroadcast(postToShare.id, channelMember.channelId, user.id)
      results = results.data.createBroadcast
   //   store.dispatch({type: "BROADCAST_POST", broadcast:results })
      store.dispatch({type: "SET_BANNER", banner: {message: `Post shared`, status: "info"}})
    }else{
      results = await mutateApi.deleteBroadcast(broadcastId, postToShare.id)
      results = results.data.deleteBroadcast
   //   store.dispatch({type: "DELETE_BROADCAST_POST", broadcast:results })
      store.dispatch({type: "SET_BANNER", banner: {message: `Post unshared`, status: "info"}})
    }
    log.info(`results from broadcast`, {results})
   
  }

  useEffect(()=>{

    if(currentIndex ==0){

      setCurrentPosts(personalPosts)
    }else{
      log.info(`setting post list for`, { channelMember: channelMembers[currentIndex].channel.name})
      const posts: Post[] = broadcasts.get(channelMembers[currentIndex].channelId)
      .map((broadcast) => broadcast.post)
      setCurrentPosts(posts)
    }
  },[broadcasts, currentIndex, personalPosts])

  function renderChannelMember({
    item,
    index,
  }: {
    item: ChannelMember;
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

    <View style={{flexDirection: 'row', alignItems: "center"}} >
      <View
        style={[
          styles.details,
          { 
            justifyContent: "center", 
            alignItems: "center" , 
            borderRadius: 25,
            borderWidth: 2,
            borderColor: Colors.primary1,
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
          data={channelMembers}
          renderItem={renderChannelMember}
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
            
              dotsLength={channelMembers.length}
              activeDotIndex={currentIndex}
              containerStyle={{
                alignSelf: 'center', 
                padding: 0, 
                marginTop: -50,
                marginBottom: -4
              }}
              inactiveDotElement={
                <View style={{backgroundColor:Colors.primary2, width: 5, height: 5,borderRadius: 3, marginLeft: 3, marginRight: 3, marginTop: 0, marginBottom: -45,}} />
              }
            dotElement={
                <View style={{backgroundColor:Colors.attention2, width: 5, height: 5,borderRadius: 3,  marginLeft: 3, marginRight: 3, marginTop: 0, marginBottom: -45,}} />
              }
              inactiveDotOpacity={0.4}
              inactiveDotScale={0.6}
            />
           
      </View>
      <TouchableOpacity  onPress={() => navigation.navigate('editor')} style={{marginLeft: -2}}>
    
        <MaterialCommunityIcons name="feather" color={Colors.primary1} size={22} style={{paddingRight: 20 * Layout.scale.width, paddingTop: 4, height: 34, width: 34, borderWidth: 2, borderColor: Colors.primary1, borderRadius: 17, paddingLeft: 4}} />
      </TouchableOpacity>

  </View>
      <PostList
        postData={currentPosts}
        channelId={currentIndex!=0 ? channelMembers[currentIndex].channelId: undefined }
        action={(input)=>{setShowModal(true); setPostToShare(input)}}
        navigation={navigation}
      />
      <PostShareModal isVisible={showModal} dismissCallback={()=>setShowModal(false)}
        postId={postToShare?.id} shareCallback={sharePost} />
 
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
function useStyles(){
  const Layout = useLayout();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#FFF",
      paddingTop: 5 * Layout.scale.width,
    },
  });
  return styles
}


export default PostCircleScreen;
