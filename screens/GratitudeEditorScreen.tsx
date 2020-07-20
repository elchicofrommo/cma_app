import React, { useState, useEffect, useCallback, memo, useRef } from "react";
import { useFocusEffect } from '@react-navigation/native';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  View,
  Keyboard,
  Button,
  FlatList,

  Animated,
  Easing,
  StatusBar,
} from "react-native";
import log from "../util/Logging"
import { connect } from "react-redux";
import mutateApi, { CreateGratitudeInput} from "../api/mutate";
import { Gratitude, Entry, Like, Comment, User, NestedArray, Broadcast } from "../types/gratitude";
import GratitudeList from '../components/GratitudeList'
import {GratitudeComponent, GratitudeRenderMode, LikeButton} from '../components/GratitudeComponent'
import EditorMenu from "../navigation/GraditudeEditorMenu";
import { shallowEqual, useSelector } from "react-redux";
import {
  HeaderBackButton,
} from "@react-navigation/stack";

import Colors from "../constants/Colors";
import Layout from "../constants/Layout";

import moment from "moment";
import {
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";

import {
  FontAwesome5,
  Entypo,
  Octicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Title } from "react-native-paper";
import { nav } from "aws-amplify";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

function defaultGratitude(user: User) :Gratitude {
  log.info(`creating new defaultGratitudeentry`)
  
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

function GratitudeEditorScreen({
  route,
  navigation,
  user,
  gratitude = route.params?.gratitude || defaultGratitude(user),
  channelId = route.params?.channelId || undefined,
  ...props}:  
  {
    route: any,
    user: User,
    navigation: any,
    channelId: string | undefined
    gratitude: Gratitude
  }) {


  const [gratitudeEdit, setGratitudeEdit] = useState<Gratitude>({...gratitude});
  const [editCount, setEditCount] = useState(0);
  const defaultRowEntry = { index: -1, text: "" };
  const [rowEdit, setRowEdit] = useState(defaultRowEntry);
  const textInput = useRef(null);

  const [keyboardHeight, setKeyboardHeight] = useState(new Animated.Value(-30));
  const [opacity, setOpacity] = useState(new Animated.Value(0));
  const [marginBottom, setMarginBottom] = useState(new Animated.Value(30));

  function startEntry(index = -1, text: string = "") {
    setRowEdit({ index, text });
    textInput.current.focus();
  }
  const gratitudeState: Gratitude = useSelector(
    (state) => {
      if (gratitudeEdit.id === "new")
        return undefined
      const toReturn = state.general.gratitudes.filter((temp: Gratitude) => temp.id === gratitude.id)
      if (toReturn?.length > 0)
        return toReturn[0]
      else
        return undefined;
    }
  )

  const broadcastState: Broadcast = useSelector(
    (state) => {
      if (gratitudeEdit.id === "new")
        return undefined
      if (channelId) {
        const toReturn = state.general.broadcastsByChannel.get(channelId).filter((temp: Broadcast) =>
          temp.gratitudeId == gratitudeEdit.id)
        return toReturn
      }
      return undefined
    },
  )

  useEffect(() => {
    log.info(`observed change in gratitude component`, { gratitudeState })
    if (gratitudeState && gratitudeState.comments && gratitudeState.likes) {
      setGratitudeEdit(gratitudeState)
    }


  }, [gratitudeState])

  useEffect(() => {
    log.info(`observed change in broadcast component `, { broadcastState })

    if (broadcastState && broadcastState[0] && broadcastState[0].gratitude) {

      setGratitudeEdit(broadcastState[0].gratitude)
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
        gratitude.id==="new"?<GratitudeCancelButton navigation={navigation}  />:
        <GratitudeBackButton navigation={navigation}/>
      ),
    });
    if(editCount > 0 && gratitude.id==="new"){
      navigation.setOptions({
        headerRight: () => (
          <GratitudeSaveButton navigation={navigation} gratitude={gratitudeEdit} />
        ),
      });
    }else if(gratitude.id!=="new" && user.id != gratitude.ownerId){
      navigation.setOptions({
        headerRight:()=>
            <View style={{paddingRight: 10*Layout.scale.width}}><LikeButton gratitude={gratitudeEdit} user={user} iLiked={gratitudeEdit.likes.items.filter(like=>like.userId===user.id).length>0}/></View>
      })
    }
  }, [editCount, gratitudeEdit]);

  useEffect(() => {

    let newEntry:Gratitude = {...gratitude};


    setGratitudeEdit(newEntry);
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
    
    if(gratitudeEdit.id==="new")
      startEntry(-2, gratitudeEdit.title)

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
    if(gratitude.id==="new"){
      // if it is -2 then the title is being edited
      if (rowEdit.index == -2) {
        setGratitudeEdit((gratitudeEdit) => {
          gratitudeEdit.title = rowEdit.text;
          return gratitudeEdit;
        });
        return;
      }
      const  items = [...gratitudeEdit.entries.items];
        if (rowEdit.index > -1) items[rowEdit.index].content = rowEdit.text;
        else items.push({content:rowEdit.text, gratitudeId: 'none', likes: {items:[]}, comments: {items: []}} as Entry);
        const newEntry : Gratitude = {...gratitudeEdit};
        newEntry.entries.items = items

      setGratitudeEdit(newEntry);
    }else{
      const comment: Comment = {
        gratitudeId: gratitude.id,
        userId: user.id,
        user: user,
        comment: rowEdit.text
      }
      const newEntry : Gratitude = {...gratitudeEdit};
      newEntry.comments.items.push(comment)
      mutateApi.commentOnGratitude({gratitude: gratitudeEdit, user: user, comment: rowEdit.text})
     // setGratitudeEdit(newEntry)
    }
    
    textInput.current.clear();
  }

  function deleteEntry() {
    setEditCount((editCount) => editCount + 1);
    setRowEdit({ index: -1, text: "" });
    const items = [...gratitudeEdit.entries.items];
    items.splice(rowEdit.index, 1);
    const newEntry : Gratitude = {...gratitudeEdit};
    newEntry.entries.items = items
    setGratitudeEdit(newEntry);
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
          placeholder={gratitude.id==='new'?"Write something...":'Add Comment'}
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
        
        style={[styles.title, (gratitudeEdit.id!=="new")&& {display: 'none'}]}
        onPress={() => startEntry(-2, gratitudeEdit.title)}
      >
        <Text style={[styles.text]}>{gratitudeEdit.title} </Text>
      </TouchableWithoutFeedback>

      <Animated.View style={{flex: 1, alignItems: "flex-start", marginBottom}}>
      <GratitudeComponent 
        gratitude={gratitudeEdit}
        channelId={channelId}
        action = {startEntry}
        navigation={navigation}
        mode={gratitudeEdit.id==="new"?GratitudeRenderMode.NEW: GratitudeRenderMode.EDIT}
      />

      </Animated.View>

      {textEntry}
    </View>
  );
}

GratitudeEditorScreen = connect(
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
)(GratitudeEditorScreen);

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

function _GratitudeSaveButton({
  navigation,
  gratitude,
  operatingUser,
  dispatchBanner, 
  ...props
}: {operatingUser: User, navigation: any, gratitude: Gratitude, dispatchBanner: Function}) {
  async function saveGratitude() {
    log.info(`saving gratitude`)
    if (gratitude.entries.items.length == 0) {
      log.info("nothign saved cuz no changes");
      return;
    }
    if(gratitude.id ==="new"){ 
      // need to empty this out
      gratitude.id = undefined
    }

    //log.info(`gratitudeEntry is:`, {gratitude});
    StatusBar.setBarStyle("light-content", true);
    //

    try {
        const entries = [];
        gratitude.entries.items.forEach((item, index)=>{
            entries.push(item.content);
        })
        const gratitudeInput: CreateGratitudeInput = {
            title: gratitude.title,
            entries: entries
        }
        const gratResult = await mutateApi.createGratitude(operatingUser, gratitudeInput)

       // log.info(`results of gratitude save are:`, {gratitudeResult} )
        dispatchBanner({ message: "Gratitude Saved", status: "info" });
    //  props.dispatchAddGratitude(result);

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
      saveGratitude();
    }}
  />
  </View>
  );
}

function GratitudeCancelButton({
  navigation,
  ...props
}: {navigation: any}) {
 
  return (
    <HeaderBackButton
    label={"Cancel"}
    tintColor={Colors.primary}
    onPress={(event) => {
      navigation.goBack();
    }}
  />

  );
}

function GratitudeBackButton({
  navigation,
  ...props
}: {navigation: any}) {
 
  return (
    <HeaderBackButton
    label={"Back"}
    tintColor={Colors.primary}
    onPress={(event) => {
      navigation.goBack();
    }}
  />

  );
}

const GratitudeSaveButton = connect(
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
      dispatchAddGratitude: (data) => {
        dispatch({ type: "ADD_GRATITUDE", data });
      },
    };
  }
)(_GratitudeSaveButton);

const styles = StyleSheet.create({
  text: {
    flexWrap: "wrap",
    fontSize: 18 * Layout.scale.width,
    fontFamily: "opensans-bold",
  },
  title: {
    paddingHorizontal: 10 * Layout.scale.width,
    borderBottomColor: "gainsboro",
    borderBottomWidth: 0.3,
    paddingVertical: 7 * Layout.scale.width,
    justifyContent: "center",
  },

  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  gratitudeRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 2 * Layout.scale.width,
  },
  gratitudeList: {
    paddingHorizontal: 10 * Layout.scale.width,
  },
  addEntryButton: {
    marginRight: -3,
  },
  deleteEntryButton: {
    marginBottom: -3,
    paddingRight: 8,
  },
  bullet: {
    flex: 0.8,
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
  keyboardView: {
    alignItems: "flex-end",
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

export default GratitudeEditorScreen;
