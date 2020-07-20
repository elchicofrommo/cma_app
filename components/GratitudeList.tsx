import { Gratitude, Entry, User, Like, Comment, Broadcast } from "../types/gratitude";
import React, { useCallback, useEffect, useState } from "react";
import { GratitudeComponent, GratitudeRenderMode, ShareButton, CommentButton, LikeButton } from "../components/GratitudeComponent"

import {
  Platform,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  FlatList,
  ListRenderItemInfo,

} from "react-native";


import log from "../util/Logging";
import Layout from "../constants/Layout";
import Colors from "../constants/Colors";
import { shallowEqual, useSelector } from "react-redux";

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

  const user: User = useSelector(
    (state) => state.general.operatingUser,
    shallowEqual
  );


  function renderGratitudeRow({ item: gratitude, index }: ListRenderItemInfo<Gratitude>) {
    const iLiked =
      gratitude.likes.items.filter((like) => like.user.id == user.id)
        .length > 0;
    const isMine = gratitude.ownerId == user.id
    const commentCallback = () => navigation.navigate("editor", { gratitude, channelId })

    return (
      <View>
        <TouchableWithoutFeedback onPress={()=>alert('hi')}>
          <GratitudeComponent gratitude={gratitude} channelId={channelId} action={action} mode={GratitudeRenderMode.SHORT} navigation={navigation} />
        </TouchableWithoutFeedback>
        <View style={[styles.gratitudeFooter,]}>
          { !isMine && <LikeButton gratitude={gratitude} user={user} iLiked={iLiked}></LikeButton>}
          <CommentButton callback={commentCallback} ></CommentButton>
          { isMine && <ShareButton callback={() => action(gratitude, channelId)}></ShareButton>}

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

const styles = StyleSheet.create({
  mapStyle: {
    width: "100%",
    marginBottom: 20,
    flex: 6,
    backgroundColor: "#dadde0",
  },
  gratitudeButtons: {
    flexDirection: "row",
    paddingVertical: 7,
    alignItems: "center",
  },
  gratitudeButtonsText: {
    flexDirection: "row",
    fontSize: 16 * Layout.scale.width,
    paddingLeft: 5 * Layout.scale.width,
    color: "dimgray",
  },
  title: {},
  statsRow: {
    paddingVertical: 3,
    paddingHorizontal: 10 * Layout.scale.width,
    flexDirection: "row",
    justifyContent: "flex-start",
    flex: 1,
    width: "100%",
  },
  seperator: {
    width: "90%",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: "gray",
    alignSelf: "center",
  },
  gratitudeFooter: {
    flexDirection: "row",
    justifyContent: "space-around",
    flex: 1,
    width: "100%",
  },
  address: {
    flex: 2,
    justifyContent: "flex-end",
    paddingHorizontal: 10 * Layout.scale.width,
  },
  sectionHeader: {
    fontWeight: "bold",
    paddingTop: 10 * Layout.scale.width,
  },
  directions: {
    paddingVertical: 5 * Layout.scale.width,
    color: "blue",
  },
  gratitudeRowSeprator: {
    height: 5 * Layout.scale.width,
    backgroundColor: Colors.primaryL3,
    width: "100%",
  },
  typesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  type: {
    width: "30%",
    textTransform: "capitalize",
  },
  text: {
    flexWrap: "wrap",
    fontSize: 12 * Layout.scale.width,
  },

  details: {
    flex: 5,
    paddingHorizontal: 10 * Layout.scale.width,
  },
  badge: {
    color: "#f4b813",
    marginTop: -3,
  },
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingTop: 5 * Layout.scale.width,
  },
  gratitudeList: {},
  gratitudeEntryList: {
    paddingHorizontal: 10 * Layout.scale.width,
    width: "100%",
  },
  gratitudeRow: {
    flexDirection: "column",
    alignItems: "center",

    overflow: "hidden",
  },
  bullet: {
    marginRight: 3 * Layout.scale.width,
  },
  entryText: {
    fontSize: 17,
    fontFamily: "opensans",
    color: "white",
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
