import log from "../util/Logging";
import { useLayout } from '../hooks/useLayout'
import { useColors } from "../hooks/useColors";
import { shallowEqual, useSelector } from "react-redux";
import shortid from "shortid";

import {
  Post,
  User,
  Comment,

} from "../types/circles";
import React, { useEffect, useState } from "react";
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


export enum PostRenderMode {
  SHORT,
  EDIT,
  NEW
}

export function PostComponent({
  post,
  action,
  mode = PostRenderMode.SHORT,
}: {
  post: Post;
  action?: Function;
  navigation?: any;
  channelId?: string
  mode: PostRenderMode
}) {

  const counts = {
    comments: 0,
    likes: 0,
  };

  const styles = useStyles()
  const [workingPost, setWorkingPost] = useState(post);

  counts.comments += workingPost.comments.items.length;
  counts.likes += workingPost.likes.items.length;
  const Layout = useLayout();
  const { colors: Colors } = useColors();

  let userName = "";
  if (workingPost.likes.items.length > 0) {
    userName = workingPost.likes.items[0].user.name;
  }

  const user: User = useSelector(
    (state) => state.general.operatingUser,
    shallowEqual
  );





  /*
  
  */
  useEffect(() => {
    setWorkingPost(post)
  }, [post])


  const renderEntryRow = ({ item, index }: ListRenderItemInfo<string>) => {
    log.info(`rendering EntryRow for ${item} index ${index} `)
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          width: "100%",
        }}>
        <TouchableWithoutFeedback onPress={() => action && action(index, item)}>
          <View
            style={{
              paddingVertical: 2 * Layout.scale.width,
              paddingHorizontal: 10 * Layout.scale.width,
              backgroundColor:
                post.ownerId === user.id
                  ? Colors.myPostEntry
                  : Colors.postEntry,
              marginBottom: 5,
              borderRadius: 17,
            }}>

            <Text style={[styles.entryText, { paddingRight: 2 }]}>
              {item}
            </Text>

          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  };
  log.info(`rendering Post Component`)
  return (
    <View>
      {/*mode === PostRenderMode.NEW &&
        <View>
          <TouchableWithoutFeedback onPress={addSingleEntry}><Text>Add Single</Text></TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={add15Entries}><Text>Add 15</Text></TouchableWithoutFeedback>
        </View>
      */ }
      <View style={[mode == PostRenderMode.NEW && { display: "none" }]}>
        <Text
          style={[
            styles.keyboardEntry,
            workingPost.ownerId === user.id && { display: "none" },
          ]}
        >
          {workingPost.owner.name}
        </Text>

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
          data={[workingPost.content]}
          renderItem={renderEntryRow}
          keyExtractor={keyExtractor}
          initialNumToRender={15}
          ListEmptyComponent={
            mode === PostRenderMode.NEW ? (
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
                  No Post Entries
                </Text>
              )
          }
          ListFooterComponent={
            <View>
              <View
                style={[
                  styles.statsRow,
                  mode === PostRenderMode.NEW && { display: "none" },
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
                  <Text style={[styles.keyboardEntry, { paddingHorizontal: 0 }]}>Comments</Text>
                </View>
                <CommentsComponent comments={workingPost.comments.items} mode={mode}></CommentsComponent>
              </View>
              <View style={[styles.seperator, mode === PostRenderMode.NEW && { display: "none" }]} />
            </View>
          }
          style={styles.postEntryList}
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
        styles.postButtons,
      ]}
    >
      <FontAwesome
        style={{ paddingLeft: 5 }}
        name="commenting"
        size={18}
        color={"dimgray"}
      />
      <Text style={styles.postButtonsText}>Comment</Text>
    </View>
  </TouchableWithoutFeedback>


}

export function DeleteButton({ callback }: { callback: Function }) {
  const styles = useStyles()
  return <TouchableWithoutFeedback onPress={() => callback()}>
    <View
      style={[
        styles.postButtons,
      ]}
    >
      <MaterialCommunityIcons
        style={{ paddingLeft: 5, marginBottom: -3 }}
        name="delete-forever-outline" size={22} color="dimgray" />

      <Text style={styles.postButtonsText}>Delete</Text>
    </View>
  </TouchableWithoutFeedback>
}

export function ShareButton({ callback }: { callback: Function }) {
  const styles = useStyles()
  return <TouchableWithoutFeedback onPress={() => callback()}>
    <View
      style={[
        styles.postButtons,
      ]}
    >
      <FontAwesome
        style={{ paddingLeft: 5, marginBottom: -3 }}
        name="share-square-o"
        size={18}
        color={"dimgray"}
      />
      <Text style={styles.postButtonsText}>Share</Text>
    </View>
  </TouchableWithoutFeedback>
}

export function LikeButton({ post, user, iLiked }: { post: Post, user: User, iLiked: boolean }) {
  const styles = useStyles()
  return <TouchableWithoutFeedback
    onPress={() => {
      mutateApi.likePost({ post, operatingUser: user });
    }}
  >
    <View
      style={[
        styles.postButtons,
      ]}
    >
      <Entypo
        name="leaf"
        size={18}
        color={iLiked ? "green" : "dimgray"}
      />
      <Text
        style={[
          styles.postButtonsText,
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

function CommentsComponent({ comments, mode }: { comments: Comment[], mode: PostRenderMode }) {
  const Layout = useLayout();
  const styles = useStyles();

  if (comments.length == 0) {
    return <View></View>
  }

  if (mode == PostRenderMode.SHORT) {
    const comment = comments[comments.length - 1]
    const remaining = comments.length - 1;
    let dateTimeString = ""
    const createdAt = moment(comment.createdAt * 1000)
    const duration = moment.duration(createdAt.diff(moment()))
    if (duration.days() > 1) {
      dateTimeString = createdAt.format(`MM/DD/YYYY`)
    } else {
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

  } else {
    const toReturn = comments.map((comment: Comment) => {
      log.verbose(`comment ${comment.comment} and the date created is ${comment.createdAt}`)
      let dateTimeString = ""
      const createdAt = moment(comment.createdAt * 1000)
      const duration = moment.duration(createdAt.diff(moment()))
      if (duration.days() > 1) {
        dateTimeString = createdAt.format(`MM/DD/YYYY`)
      } else {
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

    return toReturn;
  }

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

function useStyles() {
  const Layout = useLayout();
  const { colors: Colors } = useColors();
  const styles = StyleSheet.create({
    mapStyle: {
      width: "100%",
      marginBottom: 20,
      flex: 6,
      backgroundColor: "#dadde0",
    },
    postButtons: {
      flexDirection: "row",
      paddingVertical: 7,
      alignItems: "center",
    },
    postButtonsText: {
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
      width: Layout.window.width - (20 * Layout.scale.width),
      borderTopWidth: StyleSheet.hairlineWidth,
      borderColor: "gray",
      alignSelf: "center",
    },
    postFooter: {
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
    postRowSeprator: {
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
    postList: {},
    postEntryList: {
      paddingHorizontal: 10 * Layout.scale.width,
      width: "100%",
    },
    postRow: {
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

