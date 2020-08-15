import React, { useState, useEffect,  useRef } from "react";

import {

  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  View,
  Keyboard,
  Button,


  Animated,
  Easing,
  StatusBar,
} from "react-native";
import log from "../util/Logging"
import { connect } from "react-redux";
import mutateApi, { CreatePostInput} from "../api/mutate";
import { Post, Entry, Like, Comment, User, NestedArray, Broadcast } from "../types/circles";

import {PostComponent, PostRenderMode, LikeButton} from '../components/PostComponent'

import { shallowEqual, useSelector } from "react-redux";
import {
  HeaderBackButton,
} from "@react-navigation/stack";


import {useColors} from '../hooks/useColors'
import {useLayout} from '../hooks/useLayout'

import moment from "moment";
import {
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";

import {
  FontAwesome5,
  MaterialCommunityIcons
} from "@expo/vector-icons";


function defaultPost(user: User) :Post {
  log.info(`creating new defaultPostentry`)
  
  return{
    id: "new",
    ownerId: user.id,
    owner: user,
    createdAt: Date.now(),
    title: moment().format("MMMM Do YYYY"),
    comments: {
      items: []
    },
    likes: {
      items: []
    },
    entries:  {
      items: []
    },
  }
  
};

function PostEditorScreen({
  route,
  navigation,
  user,
  post = route.params?.post || defaultPost(user),
  channelId = route.params?.channelId || undefined,
  ...props}:  
  {
    route: any,
    user: User,
    navigation: any,
    channelId: string | undefined
    post: Post
  }) {


  const [postEdit, setPostEdit] = useState<Post>({...post});
  const [editCount, setEditCount] = useState(0);
  const defaultRowEntry = { index: -1, text: "" };
  const [rowEdit, setRowEdit] = useState(defaultRowEntry);
  const textInput = useRef(null);

  const [keyboardHeight, setKeyboardHeight] = useState(new Animated.Value(-30));
  const [opacity, setOpacity] = useState(new Animated.Value(0));
  const [marginBottom, setMarginBottom] = useState(new Animated.Value(30));
  const styles = useStyles();
  const Layout = useLayout();
  const {colors: Colors} = useColors(); 

  function startEntry(index = -1, text: string = "") {
    setRowEdit({ index, text });
    textInput.current.focus();
  }
  const postState: Post = useSelector(
    (state) => {
      if (postEdit.id === "new")
        return undefined
      const toReturn = state.general.posts.filter((temp: Post) => temp.id === post.id)
      if (toReturn?.length > 0)
        return toReturn[0]
      else
        return undefined;
    }
  )

  const broadcastState: Broadcast = useSelector(
    (state) => {
      if (postEdit.id === "new")
        return undefined
      if (channelId) {
        const toReturn = state.general.broadcastsByChannel.get(channelId).filter((temp: Broadcast) =>
          temp.postId == postEdit.id)
        return toReturn
      }
      return undefined
    },
  )

  useEffect(() => {
    log.info(`observed change in post component`, { postState })
    if (postState && postState.comments && postState.likes) {
      setPostEdit(postState)
    }


  }, [postState])

  useEffect(() => {
    log.info(`observed change in broadcast component `, { broadcastState })

    if (broadcastState && broadcastState[0] && broadcastState[0].post) {

      setPostEdit(broadcastState[0].post)
    }
  }, [broadcastState])

  function showKeyboard(event) {
    log.info(`showing keyboard height is ${event.endCoordinates.height}`);
    Animated.timing(marginBottom, {
      duration: event.duration,
      useNativeDriver: false,
      toValue: 0
    }).start()

    Animated.stagger(event.duration, [
      Animated.timing(keyboardHeight, {
        duration: event.duration,
        useNativeDriver: true,
        toValue: -event.endCoordinates.height,
        easing: Easing.inOut(Easing.linear),
      }),
      Animated.timing(opacity, {
        duration: event.duration,
        useNativeDriver: true,
        toValue: 1,
        easing: Easing.in(Easing.quad),
      }),
    ]).start();
  }
  function hideKeyboard(event) {
    log.info("hide keybaord");
    if (Platform.OS === "android") {
      props.dispatchShowEditor();
      setRowEdit(defaultRowEntry);
    } else {
      Animated.parallel(
        [
          Animated.timing(keyboardHeight, {
            duration: event.duration,
            useNativeDriver: true,
            toValue: -30,
          }),
          Animated.timing(opacity, {
            duration: (event.duration / 7) * 5,
            useNativeDriver: true,
            toValue: 0,
            easing: Easing.out(Easing.exp),
          }),
          Animated.timing(marginBottom, {
            duration: event.duration,
            useNativeDriver: false,
            toValue: 30
          })
        ],
        { stopTogether: false }
      ).start(() => {
        setRowEdit(defaultRowEntry);
      });
    }
  }

  React.useLayoutEffect(() => {
    log.info("maing a new save button");
    navigation.setOptions({
      headerLeft: () => (
        post.id==="new"?<PostCancelButton navigation={navigation}  />:
        <PostBackButton navigation={navigation}/>
      ),
    });
    if(editCount > 0 && post.id==="new"){
      navigation.setOptions({
        headerRight: () => (
          <PostSaveButton navigation={navigation} post={postEdit} />
        ),
      });
    }else if(post.id!=="new" && user.id != post.ownerId){
      navigation.setOptions({
        headerRight:()=>
            <View style={{paddingRight: 10*Layout.scale.width}}><LikeButton post={postEdit} user={user} iLiked={postEdit.likes.items.filter(like=>like.userId===user.id).length>0}/></View>
      })
    }
  }, [editCount, postEdit]);

  useEffect(() => {

    let newEntry:Post = {...post};


    setPostEdit(newEntry);
    setEditCount(0);

    const showHolder =
      Platform.OS === "ios"
        ? Keyboard.addListener("keyboardWillShow", showKeyboard)
        : Keyboard.addListener("keyboardDidShow", showKeyboard);
    const hideHolder =
      Platform.OS === "ios"
        ? Keyboard.addListener("keyboardWillHide", hideKeyboard)
        : Keyboard.addListener("keyboardDidHide", hideKeyboard);
    StatusBar.setBarStyle("dark-content", true);
    props.dispatchShowEditor(route.params);
    
    if(postEdit.id==="new")
      startEntry(-2, postEdit.title)

    return () => {
      showHolder.remove();
      hideHolder.remove();
    };
  }, [
    
  ]);

  function commitEntry() {
    log.info("committing text edit");
    setEditCount((editCount) => editCount + 1);
    setRowEdit({ index: -1, text: "" });
    if(post.id==="new"){
      // if it is -2 then the title is being edited
      if (rowEdit.index == -2) {
        setPostEdit((postEdit) => {
          postEdit.title = rowEdit.text;
          return postEdit;
        });
        return;
      }
      const  items = [...postEdit.entries.items];
        if (rowEdit.index > -1) items[rowEdit.index].content = rowEdit.text;
        else items.push({content:rowEdit.text, postId: 'none', likes: {items:[]}, comments: {items: []}} as Entry);
        const newEntry : Post = {...postEdit};
        newEntry.entries.items = items

      setPostEdit(newEntry);
    }else{
      const comment: Comment = {
        postId: post.id,
        userId: user.id,
        user: user,
        comment: rowEdit.text
      }
      const newEntry : Post = {...postEdit};
      newEntry.comments.items.push(comment)
      mutateApi.commentOnPost({post: postEdit, user: user, comment: rowEdit.text})
     // setPostEdit(newEntry)
    }
    
    textInput.current.clear();
  }

  function deleteEntry() {
    setEditCount((editCount) => editCount + 1);
    setRowEdit({ index: -1, text: "" });
    const items = [...postEdit.entries.items];
    items.splice(rowEdit.index, 1);
    const newEntry : Post = {...postEdit};
    newEntry.entries.items = items
    setPostEdit(newEntry);
    textInput.current.clear();
  }

  function cancelEntry() {
    textInput.current.clear();
  }

  const transform = {
    transform: [{ translateY: keyboardHeight }],
  };

  let textEntry = undefined;

  if (Platform.OS === "ios") {

    textEntry = (
      <Animated.View style={[styles.keyboardEntryContainer, transform]}>
        <TextInput
          ref={textInput}
          value={rowEdit ? rowEdit.text : ""}
          keyboardType={"twitter"}
          placeholder={post.id==='new'?"Write something...":'Add Comment'}
          style={[styles.keyboardEntry, styles.entry]}
          multiline={true}
          onChangeText={(value) =>
            setRowEdit({ index: rowEdit.index, text: value })
          }
        />
        <TouchableOpacity
          style={styles.addEntryButton}
          onPress={rowEdit && rowEdit.index > -1 ? deleteEntry : undefined}
        >
          <MaterialCommunityIcons
            name={"delete-circle"}
            size={38}
            color={rowEdit && rowEdit.index > -1 ? Colors.primary : "gray"}
            style={styles.deleteEntryButton}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addEntryButton}
          onPress={rowEdit && rowEdit.text != "" ? commitEntry : undefined}
        >
          <FontAwesome5
            name={"arrow-circle-up"}
            size={32}
            color={rowEdit && rowEdit.text != "" ? Colors.appBlue : "gray"}
            style={styles.addEntryButton}
          />
        </TouchableOpacity>
      </Animated.View>
    );
  } else {

    textEntry = (
      <View style={styles.keyboardEntryContainer}>
        <TextInput
          ref={textInput}
          value={rowEdit ? rowEdit.text : ""}
          keyboardType={"twitter"}
          placeholder="Write something..."
          style={[styles.keyboardEntry, styles.entry]}
          multiline={true}
          onChangeText={(value) =>
            setRowEdit({ index: rowEdit.index, text: value })
          }
        />
        <TouchableOpacity
          style={styles.addEntryButton}
          onPress={rowEdit && rowEdit.index > -1 ? deleteEntry : undefined}
        >
          <MaterialCommunityIcons
            name={"delete-circle"}
            size={38}
            color={rowEdit && rowEdit.index > -1 ? Colors.primary : "gray"}
            style={styles.deleteEntryButton}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.addEntryButton} onPress={commitEntry}>
          <FontAwesome5
            name={"arrow-circle-up"}
            size={32}
            color={Colors.appBlue}
            style={styles.addEntryButton}
          />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback
        
        style={[styles.title, (postEdit.id!=="new")&& {display: 'none'}]}
        onPress={() => startEntry(-2, postEdit.title)}
      >
        <Text style={[styles.text]}>{postEdit.title} </Text>
      </TouchableWithoutFeedback>

      <Animated.View style={{flex: 1, alignItems: "flex-start", marginBottom}}>
      <PostComponent 
        post={postEdit}
        channelId={channelId}
        action = {startEntry}
        navigation={navigation}
        mode={postEdit.id==="new"?PostRenderMode.NEW: PostRenderMode.EDIT}
      />

      </Animated.View>

      {textEntry}
    </View>
  );
}

PostEditorScreen = connect(
  function mapStateToProps(state, ownProps) {
    log.info(
      `DetailsScreen connect observed redux change, detail ${state.general.meetingDetail}`
    );
      const {operatingUser} = state.general;
    return {user: operatingUser};
  },
  function mapDispatchToProps(dispatch) {
    return {
      dispatchShowEditor: (data) => {
        dispatch(async (d1) => {
          return new Promise((resolve) => {
            dispatch({ type: "SHOW_EDITOR" });
            resolve();
          });
        });
      },
      dispatchHideEditor: (data) => {
        dispatch(async (d1) => {
          return new Promise((resolve) => {
            dispatch({ type: "HIDE_EDITOR" });
            resolve();
          });
        });
      },

    };
  }
)(PostEditorScreen);

function listCompare(prevProps, nextProps) {
  return prevProps.editCount == nextProps.editCount;
}

function renderSeperator(highlited, props) {
  return (
    <View
      style={{
        width: "75%",
        height: 1,
        borderBottomWidth: 0.3,
        borderBottomColor: "gray",
        alignSelf: "center",
      }}
    ></View>
  );
}

function _PostSaveButton({
  navigation,
  post,
  operatingUser,
  dispatchBanner, 
  ...props
}: {operatingUser: User, navigation: any, post: Post, dispatchBanner: Function}) {
  const Layout = useLayout();
  const {colors: Colors} = useColors();
  async function savePost() {
    log.info(`saving post`)
    if (post.entries.items.length == 0) {
      log.info("nothign saved cuz no changes");
      return;
    }
    if(post.id ==="new"){ 
      // need to empty this out
      post.id = undefined
    }

    //log.info(`postEntry is:`, {post});
    StatusBar.setBarStyle("light-content", true);
    //

    try {
        const entries = [];
        post.entries.items.forEach((item, index)=>{
            entries.push(item.content);
        })
        const postInput: CreatePostInput = {
            title: post.title,
            entries: entries
        }
        const gratResult = await mutateApi.createPost(operatingUser, postInput)

       // log.info(`results of post save are:`, {postResult} )
        dispatchBanner({ message: "Post Saved", status: "info" });
    //  props.dispatchAddPost(result);

    } catch (err) {
      log.info(`error is  ${err}`);
      dispatchBanner({
        message: "Your data was not saved " + JSON.stringify(err),
      });
    }
  }
  return (

    <View style={{paddingRight: 10 * Layout.scale.width}}>
    <Button
    title={"Save"}
    color={Colors.primary}

    onPress={(event) => {

      navigation.goBack();
      savePost();
    }}
  />
  </View>
  );
}

function PostCancelButton({
  navigation,
  ...props
}: {navigation: any}) {
  const {colors} = useColors()
  return (
    <HeaderBackButton
    label={"Cancel"}
    tintColor={colors.primary1}
    onPress={(event) => {
      navigation.goBack();
    }}
  />

  );
}

function PostBackButton({
  navigation,
  ...props
}: {navigation: any}) {
  const {colors} = useColors()
  return (
    <HeaderBackButton
    label={"Back"}
    tintColor={colors.primary1}
    onPress={(event) => {
      navigation.goBack();
    }}
  />

  );
}

const PostSaveButton = connect(
  function mapStateToProps(state, ownProps) {
    const { operatingUser } = state.general;

    return { operatingUser };
  },
  function mapDispatchToProps(dispatch) {
    return {
      dispatchBanner: (data) => {
        dispatch({ type: "SET_BANNER", banner: data });
      },
      dispatchHideEditor: (data) => {
        dispatch({ type: "HIDE_EDITOR" });
      },
      dispatchAddPost: (data) => {
        dispatch({ type: "ADD_POST", data });
      },
    };
  }
)(_PostSaveButton);

function useStyles(){

  const Layout = useLayout();
  const styles = StyleSheet.create({
    text: {
      flexWrap: "wrap",
      fontSize: 18 * Layout.scale.width,
      fontFamily: "opensans-bold",
    },
    title: {
      paddingHorizontal: 10 * Layout.scale.width,

      paddingVertical: 7 * Layout.scale.width,
      justifyContent: "center",
    },
  
    container: {
      flex: 1,
      backgroundColor: "#FFF",
    },


    addEntryButton: {
      marginRight: -3,
    },
    deleteEntryButton: {
      marginBottom: -3,
      paddingRight: 8,
    },

    keyboardEntryContainer: {
      justifyContent: "space-between",
      alignItems: "flex-end",
      flexDirection: "row",
      paddingHorizontal: 10 * Layout.scale.width,
      paddingVertical: 3 * Layout.scale.width,
      borderTopWidth: 0.3,
      borderTopColor: "gray",
      overflow: "visible",
      backgroundColor: 'white'
    },

  
    entry: {
      flex: 10,
      margin: 0,
      flexWrap: "wrap",
      fontSize: 18,
      fontFamily: "opensans",
      paddingBottom: 5,
    },
    keyboardEntry: {
      borderRadius: 18,
      borderWidth: 1,
      borderColor: "gray",
      marginRight: 5,
      marginLeft: -5,
      paddingLeft: 10,
      paddingRight: 10,
    },
  });

  return styles
}


export default PostEditorScreen;
