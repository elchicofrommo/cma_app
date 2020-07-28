import log from "../util/Logging";
import {useLayout} from '../hooks/useLayout'
import {useColors} from "../hooks/useColors";
import { shallowEqual, useSelector } from "react-redux";
import shortid from "shortid";

import {
  Gratitude,
  Entry,
  User,
  Comment,

} from "../types/gratitude";
import React, {  useEffect, useState } from "react";
import { Entypo, FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import moment from "moment";
import mutateApi from "../api/mutate";

import {
  Platform,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,

  ListRenderItemInfo,

} from "react-native";

import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view'


export enum GratitudeRenderMode {
  SHORT,
  EDIT,
  NEW
}

export function GratitudeComponent({
  gratitude,

  mode = GratitudeRenderMode.SHORT,
}: {
  gratitude: Gratitude;
  action?: Function;
  navigation?: any;
  channelId?: string
  mode: GratitudeRenderMode
}) {

  const counts = {
    comments: 0,
    likes: 0,
  };

  const styles = useStyles()
  const [workingGratitude, setWorkingGratitude] = useState(gratitude);

  counts.comments += workingGratitude.comments.items.length;
  counts.likes += workingGratitude.likes.items.length;
  const Layout = useLayout();
  const {colors: Colors} = useColors();

  let userName = "";
  if (workingGratitude.likes.items.length > 0) {
    userName = workingGratitude.likes.items[0].user.name;
  }

  const user: User = useSelector(
    (state) => state.general.operatingUser,
    shallowEqual
  );

  

  function addSingleEntry() {
    const id = shortid.generate();
    workingGratitude.entries.items.push({
      id: id,
      content: id,
      gratitudeId: workingGratitude.id,
      index: workingGratitude.entries.items.length
    })
    setWorkingGratitude({ ...workingGratitude });
  }

  function add15Entries() {
    for (let i = 0; i < 45; i++) {
      const id = shortid.generate();
      workingGratitude.entries.items.push({
        id: id,
        content: id,
        gratitudeId: workingGratitude.id,
        index: workingGratitude.entries.items.length
      })
    }

    setWorkingGratitude({ ...workingGratitude });
  }


/*

*/
  useEffect(() => {
    setWorkingGratitude(gratitude)
  }, [gratitude])


  const renderEntryRow = ({ item, index }: ListRenderItemInfo<Entry>) => {
    log.info(`rendering EntryRow for ${item.id} index ${index} `)
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          width: "100%",
        }}>
        <View
          style={{
            paddingVertical: 2 * Layout.scale.width,
            paddingHorizontal: 10 * Layout.scale.width,
            backgroundColor:
              gratitude.ownerId === user.id
                ? Colors.myGratitudeEntry
                : Colors.gratitudeEntry,
            marginBottom: 5,
            borderRadius: 17,
          }}>

          <Text style={[styles.entryText, { paddingRight: 2 }]}>
            {item.content}
          </Text>
        </View>

      </View>
    );
  };
  log.info(`rendering Gratitude Component`)
  return (
    <View>
      {mode === GratitudeRenderMode.NEW &&
        <View>
          <TouchableWithoutFeedback onPress={addSingleEntry}><Text>Add Single</Text></TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={add15Entries}><Text>Add 15</Text></TouchableWithoutFeedback>
        </View>
      }
      <View style={[mode == GratitudeRenderMode.NEW && { display: "none" }]}>
        <Text
          style={[
            styles.keyboardEntry,
            workingGratitude.ownerId === user.id && { display: "none" },
          ]}
        >
          {workingGratitude.owner.name}
        </Text>
        <Text style={[styles.keyboardEntry]}>{workingGratitude.title}</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          flex: 1,
          width: "100%",
        }}
      >

        <  KeyboardAwareFlatList
          data={workingGratitude.entries.items}
          renderItem={renderEntryRow}
          keyExtractor={keyExtractor}
          initialNumToRender={15}
          ListEmptyComponent={
            mode === GratitudeRenderMode.NEW ? (
              <Text
                style={[
                  styles.keyboardEntry,
                  { color: "gray", paddingLeft: 0 },
                ]}
              >
                What are you grateful for today
              </Text>
            ) : (
                <Text style={[styles.keyboardEntry, { paddingLeft: 0 }]}>
                  No Gratitude Entries
                </Text>
              )
          }
          ListFooterComponent={
            <View>
              <View
        style={[
          styles.statsRow,
          mode === GratitudeRenderMode.NEW && { display: "none" },
          counts.likes == 0 && { display: "none" },
        ]}
      >
        <Entypo
          style={counts.likes == 0 && { display: "none" }}
          name="leaf"
          size={14}
          color={counts.likes > 0 ? "green" : "grey"}
        />
        <Text style={[{ fontSize: 14 }]}>
          {userName}{" "}
          {counts.likes - 1 > 0 ? `and ${counts.likes - 1} others` : ``}
        </Text>

      </View>
      <View
        style={[counts.comments == 0 && { display: "none" }]}
      >
        <View>
          <Text style={[styles.keyboardEntry, {paddingHorizontal: 0}]}>Comments</Text>
        </View>
        <CommentsComponent comments={workingGratitude.comments.items} mode={mode}></CommentsComponent>
      </View>
      <View style={[styles.seperator, mode === GratitudeRenderMode.NEW && { display: "none" }]} />
              </View>
          }
          style={styles.gratitudeEntryList}
        />
      </View>
      

    </View>
  );
}

export function CommentButton({ callback }: { callback: Function }) {

  const styles = useStyles()
  return <TouchableWithoutFeedback
    onPress={() => callback()}
  >
    <View
      style={[
        styles.gratitudeButtons,
      ]}
    >
      <FontAwesome
        style={{ paddingLeft: 5 }}
        name="commenting"
        size={18}
        color={"dimgray"}
      />
      <Text style={styles.gratitudeButtonsText}>Comment</Text>
    </View>
  </TouchableWithoutFeedback>


}

export function DeleteButton({ callback }: { callback: Function }) {
  const styles = useStyles()
  return <TouchableWithoutFeedback onPress={() => callback()}>
    <View
      style={[
        styles.gratitudeButtons,
      ]}
    >
      <MaterialCommunityIcons 
        style={{ paddingLeft: 5, marginBottom: -3 }}
        name="delete-forever-outline" size={22} color="dimgray" />

      <Text style={styles.gratitudeButtonsText}>Delete</Text>
    </View>
  </TouchableWithoutFeedback>
}

export function ShareButton({ callback }: { callback: Function }) {
  const styles = useStyles()
  return <TouchableWithoutFeedback onPress={() => callback()}>
    <View
      style={[
        styles.gratitudeButtons,
      ]}
    >
      <FontAwesome
        style={{ paddingLeft: 5, marginBottom: -3 }}
        name="share-square-o"
        size={18}
        color={"dimgray"}
      />
      <Text style={styles.gratitudeButtonsText}>Share</Text>
    </View>
  </TouchableWithoutFeedback>
}

export function LikeButton({ gratitude, user, iLiked }: { gratitude: Gratitude, user: User, iLiked: boolean }) {
  const styles = useStyles()
  return <TouchableWithoutFeedback
    onPress={() => {
      mutateApi.likeGratitude({ gratitude, operatingUser: user });
    }}
  >
    <View
      style={[
        styles.gratitudeButtons,
      ]}
    >
      <Entypo
        name="leaf"
        size={18}
        color={iLiked ? "green" : "dimgray"}
      />
      <Text
        style={[
          styles.gratitudeButtonsText,
          iLiked && { color: "green" },
        ]}
      >
        Like
    </Text>
    </View>
  </TouchableWithoutFeedback>
}

function renderEntrySeprator(highlighted, leadingTiems) {
  return (
    <View
      style={{
        width: "90%",
        height: 1,
        borderBottomWidth: 0.3,
        borderBottomColor: "gray",
        alignSelf: "center",
      }}
    ></View>
  );
}

function CommentsComponent({ comments, mode }: { comments: Comment[], mode: GratitudeRenderMode }) {
  const Layout = useLayout();

  if (comments.length == 0) {
    return <View></View>
  }
  const styles = useStyles();
  if (mode == GratitudeRenderMode.SHORT) {
    const comment = comments[comments.length - 1]
    const remaining = comments.length - 1;
    let dateTimeString = ""
    const createdAt = moment(comment.createdAt*1000)
    const duration = moment.duration(createdAt.diff(moment()))
    if(duration.days() > 1){
      dateTimeString = createdAt.format(`MM/DD/YYYY`)
    }else {
      dateTimeString = createdAt.fromNow()
    }
    return (
      <View>
        <View
          key={comment.id}
          style={{

            justifyContent: "flex-start",

            borderColor: "lightgray",
            marginBottom: 5,
            borderWidth: 2,
            borderRadius: 5,
          }}
        >
          <View
            style={{
              paddingVertical: 2 * Layout.scale.width,
              paddingHorizontal: 10 * Layout.scale.width,
            }}
          >
            <Text
              style={[
                styles.entryText,
                { color: "black", paddingRight: 2 },
              ]}
            >
              {comment.comment}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              paddingLeft: 10,
              marginBottom: -1,
              paddingVertical: 1,
              alignItems: "center",
              backgroundColor: "lightgray",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontFamily: "opensans-light",
                color: "black",
              }}
            >
              {comment.user.name}{" "}
              {dateTimeString}
            </Text>
          </View>

        </View >
        {remaining > 0 &&
          <Text style={{ paddingLeft: 5 * Layout.scale.width }}>
            ... {remaining} more
            </Text>
        }
      </View>
    )

  }
  const toReturn = comments.map((comment: Comment) => {
    log.verbose(`comment ${comment.comment} and the date created is ${comment.createdAt}`)
    let dateTimeString = ""
    const createdAt = moment(comment.createdAt*1000)
    const duration = moment.duration(createdAt.diff(moment()))
    if(duration.days() > 1){
      dateTimeString = createdAt.format(`MM/DD/YYYY`)
    }else {
      dateTimeString = createdAt.fromNow()
    }

    return (
      <View
        key={comment.id}
        style={{

          justifyContent: "flex-start",

          borderColor: "lightgray",
          marginBottom: 5,
          borderWidth: 2,
          borderRadius: 5,
        }}
      >
        <View
          style={{
            paddingVertical: 2 * Layout.scale.width,
            paddingHorizontal: 10 * Layout.scale.width,
          }}
        >
          <Text
            style={[
              styles.entryText,
              { color: "black", paddingRight: 2 },
            ]}
          >
            {comment.comment}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            paddingLeft: 10,
            marginBottom: -1,
            paddingVertical: 1,
            alignItems: "center",
            backgroundColor: "lightgray",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: "opensans-light",
              color: "black",
            }}
          >
            {comment.user.name}{" "}
            {dateTimeString}
          </Text>
        </View>
      </View>
    );
  })

  return <View>{toReturn}</View>
}


const keyExtractor = (item, index): string => {
  return index + "";
};

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
  const Layout = useLayout();
  const {colors: Colors} = useColors();
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
      width: Layout.window.width - (20*Layout.scale.width),
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
      backgroundColor: Colors.primary1L3,
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
  return styles
}

