import React, {
  useState,
} from "react";
import {
  Text,
  TouchableWithoutFeedback,
  View,
  StyleSheet
} from "react-native";
import { connect } from "react-redux";
import {useColors} from '../hooks/useColors'
import {useLayout} from '../hooks/useLayout'

import PostList from '../components/PostList'
import Modal from "react-native-modal";

import log from "../util/Logging"
import {store} from '../redux/store'


import mutateApi from "../api/mutate";
import {
  Post,
  User,
  UserChannel,
} from "../types/circles.";
import { SafeAreaView } from "react-native-safe-area-context";
function JournalScreen({
  route,
  navigation,
  posts,
  operatingUser,
  subscribedChannels,
  ...props
}: {
  posts: Post[];
  operatingUser: User;
  subscribedChannels: UserChannel[];
  route: any;
  navigation: any;
}) {

  const [postToShare, setPostToShare] = useState<Post>(undefined)
  const [modalHeight, setModalHeight] = useState(0)

  log.info(`should be rendering my posts:`, {posts} )
  const Layout = useLayout();
  const {colors: Colors} = useColors();
  async function sharePost(userChannel: UserChannel){

    const results = await mutateApi.createBroadcast(postToShare.id, userChannel.channelId, postToShare.ownerId)
    log.info(`results from broadcast are:`, {results})
    store.dispatch({type: "SET_BANNER", banner: {message: "Post shared", status: "info"}})
  }
  return (
    <View style={styles.container}>
      <PostList
        postData={posts}
        operatingUser={operatingUser}
        action={setPostToShare}
      />
      <Modal
        isVisible={postToShare!=undefined}
        onBackdropPress={() => setPostToShare(undefined)}
       onSwipeComplete={() => setPostToShare(undefined)}
       backdropOpacity={.2}
       useNativeDriver={true}
    //    onBackButtonPress={() => setVisible(false)}
        swipeDirection={["down"]}
        style={{margin: 0, justifyContent: "flex-end"}}
      >
        <View style={[styles.modalTextContainer, 
          {backgroundColor: 'white', borderTopLeftRadius: 17, borderTopRightRadius: 17, }]}
          onLayout={(event) => {
            var {height} = event.nativeEvent.layout;
            setModalHeight(height)
          }}>
          <SafeAreaView style={{ width: '100%', marginTop: -30  }}>
            <View style={{alignItems: "center"}}>
              <View style={{width: 50, height: 5, backgroundColor: Colors.primary1, borderRadius: 5, borderColor: Colors.primary1}}></View>
            </View>
            <Text style={{ paddingHorizontal: 10, fontFamily: 'opensans', color: Colors.primary1, fontSize: 21 * Layout.scale.width}}>Your Circles</Text>
            {subscribedChannels.map((userChannel: UserChannel)=>{
              return(
                <View key={userChannel.id} style={{flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 3,}}>
                  <Text style={{ flex: 1, fontSize:17}}>{userChannel.channel.name}</Text>
                  <TouchableWithoutFeedback style={{flex: 2, backgroundColor: 'yellow'}} onPress={()=>sharePost(userChannel)}>
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

function useStyles(){
  const Layout = useLayout();
  const styles = StyleSheet.create({
 
    container: {
      flex: 1,
      backgroundColor: "#FFF",
      paddingTop: 5 * Layout.scale.width,
    }
    
    })
  return styles
}

JournalScreen = connect(
  function mapStateToProps(state, ownProps) {
    const { posts, operatingUser, userChannels: subscribedChannels } = state.general;
    log.info(`JournalScreen connect observed redux change`);

    return {
      posts,
      operatingUser,
      subscribedChannels
    };
  },
  function mapDispatchToProps(dispatch) {
    return {
      dispatchShowDetail: (data) => {
        dispatch(async (d1) => {
          return new Promise((resolve) => {
            log.info(`step 1`);
            dispatch({ type: "SET_DETAIL", meetingDetail: data });
            log.info(`step 3`);
            dispatch({ type: "SHOW_DETAIL" });
            resolve();
          });
        });
      },
      dispatchSetDetail: (data) => {
        log.info(`set detail data is `);
        dispatch({ type: "SET_DETAIL", meetingDetail: data });
      },
      dispatchRegisterSubmenu: (data) => {
        log.info("registering post submenu");
        dispatch({ type: "REGISTER_SUBMENU", data });
      },
    };
  }
)(JournalScreen);


export default JournalScreen;
