import { Gratitude, Entry, User  } from "../types/gratitude";
import React, { useCallback,  useState } from "react";
import { GratitudeComponent, GratitudeRenderMode, ShareButton, CommentButton, LikeButton, DeleteButton } from "../components/GratitudeComponent"
import Modal from "react-native-modal";
import mutateApi from '../api/mutate'
import {
  Platform,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  FlatList,
  ListRenderItemInfo,

} from "react-native";

import Button from "../components/Button"

import log from "../util/Logging";
import {useLayout} from '../hooks/useLayout'
import {useColors} from "../hooks/useColors";
import { shallowEqual, useSelector } from "react-redux";
import {store} from "../components/store"


export default function GratitudeList({
  gratitudeData,
  channelId, 
  action,
  navigation,
}: {
  gratitudeData: Gratitude[];
  channelId?: string;
  action: Function;
  navigation: any
}) {
  log.info(`rendering gratitude list `);

  const styles = useStyles()
  const user: User = useSelector(
    (state) => state.general.operatingUser,
    shallowEqual
  );
  const [deleteState, setDeleteState] = useState({show: false, gratitude: undefined}) 

  function confirmDelete(gratitude: Gratitude){
    setDeleteState({show: true, gratitude})
  }

  function deleteGratitude(){
    const result = mutateApi.deleteGratitude(deleteState.gratitude)
    // should check status of delete
    log.info(`results from delete`, {deleteResult: result})
    store.dispatch({type: 'SET_BANNER', 
      banner: {
        message: "Message Deleted."
      }
    })
    setDeleteState(deleteState=>{deleteState.show=false; return deleteState})
  }


  function renderGratitudeRow({ item: gratitude, index }: ListRenderItemInfo<Gratitude>) {
    const iLiked =
      gratitude.likes.items.filter((like) => like.user.id == user.id)
        .length > 0;
    const isMine = gratitude.ownerId == user.id
    const commentCallback = () => navigation.navigate("editor", { gratitude, channelId })

    return (
      <View>
        <TouchableWithoutFeedback onPress={()=>alert('hi')}>
          <GratitudeComponent gratitude={gratitude} action={action} mode={GratitudeRenderMode.SHORT} navigation={navigation} />
        </TouchableWithoutFeedback>
        <View style={[styles.gratitudeFooter, ]}>
          { !isMine && <LikeButton gratitude={gratitude} user={user} iLiked={iLiked}></LikeButton>}
          { false && isMine && <DeleteButton callback={() => confirmDelete(gratitude)}></DeleteButton>}
          { isMine && <ShareButton callback={() => action(gratitude)}></ShareButton>}
          <CommentButton callback={commentCallback} ></CommentButton>
        </View>
      </View>
    )
  }
  function gratitudeRowSeprator(highlighted, next) {
    return <View style={styles.gratitudeRowSeprator} />;
  }
  const keyExtractor = useCallback((item, index): string => {
    return index + "";
  }, []);

  return (
    <View>
    <FlatList
      data={gratitudeData}
      renderItem={renderGratitudeRow}
      ItemSeparatorComponent={gratitudeRowSeprator}

      keyExtractor={keyExtractor}
      initialNumToRender={5}
      ListEmptyComponent={
        <Text style={styles.keyboardEntry} key={"empty"}>
          Start writing your first gratitude
        </Text>
      }
      contentContainerStyle={styles.gratitudeList}

    />
      <Modal
        isVisible={deleteState.show}
        onBackdropPress={() => setDeleteState(deleteState=>{deleteState.show=false; return {...deleteState}})}
       onSwipeComplete={() => setDeleteState(deleteState=>{deleteState.show=false; return {...deleteState}})}
      animationIn={"fadeInUp"}
      animationOut={"fadeOutDown"}
       backdropOpacity={.2}
      style={{width: '70%', alignSelf: 'center'}}
        onBackButtonPress={() => setDeleteState(deleteState=>{deleteState.show=false; return {...deleteState}})}
        swipeDirection={["down", "up", "left", "right"]}

      >
        <View style={{ backgroundColor: 'white', borderRadius: 12, paddingHorizontal: 15, paddingVertical: 25, ...shadow}}>
    <Text style={{fontSize: 17, fontFamily: "opensans",textAlign: 'center'}}>Delete '{deleteState.gratitude?.title}' permanantly?</Text>
          <View style={{flexDirection: 'row' , justifyContent: 'space-around', paddingTop: 15}}>
            <Button label={"Confirm"} style={styles.deleteButtonContainer} onPress={()=>deleteGratitude()} ></Button>
            <Button label={"Cancel"} style={styles.cancelButtonContainer} onPress={()=>setDeleteState(deleteState=>{deleteState.show=false; return {...deleteState}})} ></Button>
          </View>
        </View>
        
      </Modal>
      </View>

  );
}
const shadow =
  Platform.OS === "ios"
    ? {
      shadowColor: "black",
      shadowOffset: { width: 4, height: 4 },
      shadowRadius: 3,
      shadowOpacity: 0.4,
    }
    : { elevation: 15 };
function useStyles(){
  const {colors: Colors} = useColors()
  const Layout = useLayout()

  const styles = StyleSheet.create({

    gratitudeButtons: {
      flexDirection: "row",
      paddingVertical: 7,
      alignItems: "center",
    },


    deleteButtonContainer: {
      backgroundColor: Colors.primary1,
      alignSelf: 'center',
      borderRadius: 17,
      paddingHorizontal: 10,
      paddingVertical: 5,
      ...shadow,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: 'lightgray'
    },
    cancelButtonContainer: {
      backgroundColor: Colors.primary1,
      alignSelf: 'center',
      borderRadius: 17,
      paddingHorizontal: 10,
      paddingVertical: 5,
      ...shadow,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: 'lightgray'
    },

    gratitudeFooter: {
      flexDirection: "row",
      justifyContent: "space-around",
      flex: 1,
      width: "100%",
    },

    gratitudeRowSeprator: {
      height: 5 * Layout.scale.width,
      backgroundColor: Colors.primary1L3,
      width: "100%",
    },

    type: {
      width: "30%",
      textTransform: "capitalize",
    },
    text: {
      flexWrap: "wrap",
      fontSize: 12 * Layout.scale.width,
    },
  


    gratitudeRow: {
      flexDirection: "column",
      alignItems: "center",
  
      overflow: "hidden",
    },

    keyboardEntry: {
      width: "100%",
      margin: 0,
      flexWrap: "wrap",
      fontSize: 18,
      fontFamily: "opensans",
      paddingBottom: 5,
  
      paddingHorizontal: 10 * Layout.scale.width,
    },
  });
  return styles;
}

