import React, { useState, useEffect, useCallback, memo, useRef } from "react";
import {

  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  View,
  TouchableWithoutFeedback,
  ScrollView,
  Keyboard,

  FlatList,
  KeyboardAvoidingView,
  Animated,
  Easing,
  StatusBar,
} from "react-native";
import log from "../util/Logging"
import { connect } from "react-redux";
import mutateApi from "../api/mutate";
import fetchApi  from "../api/fetch";
import {
  HeaderBackButton,
} from "@react-navigation/stack";

import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import AppBanner from '../components/AppBanner'

import moment from "moment";

import Modal from "react-native-modal";
import KeyboardStickyView from "rn-keyboard-sticky-view";
import {store} from '../components/store'
import {

} from "@expo/vector-icons";
import {User, UserChannel, ChannelDetails, Channel} from '../types/gratitude'
import { Button } from "react-native-paper";

function CircleAdminScreen({
  route, navigation,operatingUser,userChannels, ownedChannels, ...props
}: {operatingUser: User, userChannels: UserChannel[], route: any, navigation: any, ownedChannels: Channel[]}) {

log.info(`rendering CircleAdminScreen`)

  const [offset, setOffset] = useState(new Animated.Value(0))
  const [isJournal, setIsJournal] = useState(true)
  const [toggleWidth, setToggleWidth] = useState(0)
  
  const createLabels = {input: "Circle Name", placeholder: `${operatingUser.name}'s Circle`, }
  const joinLabels = {input: "Invitation Code", placeholder: `Given by Circle Member`, }
  const [labels, setLabels] = useState(createLabels)
  const [pressOffset, setPressOffset] = useState(new Animated.Value(0))
  const [input, setInput] = useState()
  const [isLoading, setIsLoading] = useState(false);
  const [channelDetails, setChannelDetails] = useState<ChannelDetails []>([]) 

  function pressDown(){
    log.info("press down")
    Animated.timing(pressOffset, {
      toValue: 3,
      useNativeDriver: true,
      duration: 50,
      easing: Easing.linear
    }).start();
  }

  function pressUp(){
    Animated.timing(pressOffset, {
      toValue: 0,
      useNativeDriver: true,
      duration: 50,
      easing: Easing.linear
    }).start();
  }

  useEffect(()=>{
    async function getChannelDetails(){
      const promises = [];
      userChannels.forEach(userChannel=>{
        promises.push(fetchApi.fetchChannelDetails(userChannel.channelId))
      })

      const results: ChannelDetails[] = await Promise.all(promises);
      log.info(`all settled `, {channelDetails: results})
      // should check if all fullfilled 
      setChannelDetails(results)
      setIsLoading(false);
    }
    setIsLoading(true);
    getChannelDetails()
    
  }, [userChannels])

  async function readyAction(){
    if(isJournal){
      setInput(undefined);

        const createPromise = mutateApi.createChannel(operatingUser, input, userChannels)
        store.dispatch(()=>{
          createPromise
          .then(async (createResult)=>{
            log.info(`room was created. results is`, {results: createResult})

            await new Promise((resolve, reject)=>{
              store.dispatch({type: "CREATE_CHANNEL", data: createResult}); resolve()
            })
            store.dispatch({type: "SET_BANNER", banner: {message: "Circle created and ready for sharing.", status: "info" }})
              
          })
          .catch((err1)=>{
            log.info(`could not create room for this reason:`, {error: err1})
            store.dispatch({type: "SET_BANNER", banner: {message: "Creating Circle Failed. Please try again."}})
          })
        })

    }else{
      const subscribePromise = mutateApi.subscribeToChannel(operatingUser, input, userChannels)
      store.dispatch(()=>{
        subscribePromise.then(async (result)=>{
          await new Promise((resolve, reject)=>{store.dispatch({type: "SUBSCRIBE_CHANNEL", data: result}); resolve()})
          store.dispatch({type: "SET_BANNER", banner: {message: `You have joined ${result.channel.name}.`, status: "info" }})
        }).catch(error=>{
          if(error.error)
            store.dispatch({type: "SET_BANNER", banner: {message: `Joining Circle Failed. ${error.error}`}})
          else
            store.dispatch({type: "SET_BANNER", banner: {message: `Joining Circle Failed. Problem unknown.`}})
        })
      })
    }
  }
/*
  async function unsubscribe(code){
    const unsubscribePromise = mutateApi.
  }
*/
  function createCircle(){
    setLabels(createLabels)
    setIsJournal(true)
    //navigation.navigate('journal')
    Animated.timing(offset, {
      toValue: (0),
      useNativeDriver: true,
      duration: 200,
      easing: Easing.inOut(Easing.ease)
    }).start();
  }
  
  function joinCircle(){
    setLabels(joinLabels)
    setIsJournal(false)
    //navigation.navigate('circle')
    Animated.timing(offset, {
      toValue: toggleWidth-4,
      useNativeDriver: true,
      duration: 200,
      easing: Easing.inOut(Easing.ease)
    }).start();
  }

  const toggleTransform = {
    transform: [{ translateX: offset }]
  }

  const buttonTransform = {
    transform: [{ translateY: pressOffset }, {translateX: pressOffset}],
  }

  React.useLayoutEffect(() => {
    log.info("maing a new save button");
    navigation.setOptions({
      headerLeft: () => (
        <BackButton navigation={navigation}  />
      ),
    });
  }, []);


  function renderUserChannel({item: channel, index}:{item: ChannelDetails, index: number}){
    log.info(`rendering `, {channel})
    const iOwn = channel.ownerId == operatingUser.id;
    return (
      <View style={{paddingTop: 10 * Layout.scale.width}}>
        <View style={{
          backgroundColor: Colors.primary, 
          width: '100%',
          paddingHorizontal: 10 * Layout.scale.width,
          paddingVertical: 1 * Layout.scale.width,
          }}>
          <Text style={{
            color: Colors.primaryContrast,
            fontFamily: 'opensans',
            fontSize: 16 * Layout.scale.width
          }}>{channel.name}</Text>
        </View>
        <View style={{
          flexDirection: "row"
        }}>
          <Text style={{flex: 3, textAlign: 'right', fontSize: 14 * Layout.scale.width, fontFamily: "opensans-light"}}>Owner</Text>
          <Text style={{flex: 7, textAlign: 'left', fontSize: 14 * Layout.scale.width, fontFamily: "opensans-light", paddingHorizontal: 10 * Layout.scale.width}}>{iOwn? "You are the owner": channel.owner.name}</Text>
        </View>
        <View style={{
          flexDirection: "row"
        }}>
          <Text style={{flex: 3, textAlign: 'right',fontSize: 14 * Layout.scale.width, fontFamily: "opensans-light"}}>Share Code</Text>
          <Text style={{flex: 7, textAlign: 'left', fontSize: 14 * Layout.scale.width, fontFamily: "opensans-light", paddingHorizontal: 10 * Layout.scale.width}}>{channel.id}</Text>
        </View>
        <View style={{
          flexDirection: "row"
        }}>
          <Text style={{flex: 3, textAlign: 'right', fontSize: 14 * Layout.scale.width, fontFamily: "opensans-light"}}>Members</Text>
          <View style={{flex: 7, alignSelf: 'flex-start',  paddingHorizontal: 10 * Layout.scale.width}}>
            {channel.subscribedUsers.map(user=><Text style={{fontSize: 14 * Layout.scale.width, fontFamily: "opensans-light",}}>{user.name}</Text>)}
          </View>

        </View>

      </View>
    )
  }

  return (
    <View style={styles.container}>
      <AppBanner/>

        <View style={styles.startContainer}>
          <View style={styles.toggleContainer}>
            <TouchableWithoutFeedback onPress={createCircle} style={styles.inactiveToggle} ><Text style={[styles.inactiveToggle, styles.toggleText,{color: (isJournal?Colors.primaryContrast:'black'), }, styles.textField]}>Create</Text></TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={joinCircle} style={styles.inactiveToggle} ><Text style={[styles.toggleText,{ color: (isJournal?'black':Colors.primaryContrast), }, styles.textField]}>Join</Text></TouchableWithoutFeedback>
            <Animated.View style={[styles.activeToggle, toggleTransform ]} onLayout={(event)=>{
              var {x, y, width,height}= event.nativeEvent.layout
              setToggleWidth(width)
            }}></Animated.View>

          </View>
          <View style={styles.entrySection}>
          <View
            style={{
              backgroundColor: "#fff",
              paddingHorizontal: 10 * Layout.scale.width,
            }}
          >
            <TextInput
              placeholder={labels.placeholder}
              value={input}
              autoCapitalize="none"
              style={[styles.textField]}
              onChangeText={(value) => {
                setInput(value)
              }}
            />
            <Text style={styles.inputLabel}>{labels.input}</Text>
            <TouchableOpacity onPressIn={pressDown} onPressOut={pressUp} onPress={readyAction} style={[styles.buttonContainer, buttonTransform]}>
              <Text style={styles.buttonText}>Ready</Text>
            </TouchableOpacity>
          </View>
          </View>
        </View>
        <FlatList
          data={channelDetails}
          renderItem={renderUserChannel}
          keyExtractor={(item, index)=>`${index}`}
        >

        </FlatList>

        
    </View>
  );
}

function _BackButton({
  navigation,
  operatingUser,
  ...props
}: {operatingUser: User, navigation: any}) {
 
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

const BackButton = connect(
  function mapStateToProps(state, ownProps) {
    const { operatingUser,  } = state.general;

    return { operatingUser,  };
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
)(_BackButton);

const shadow = Platform.OS === 'ios' ? {
  shadowColor: 'black',
  shadowOffset: { width: 1, height: 1 },
  shadowOpacity: .3,
} : { elevation: 3 }

const styles = StyleSheet.create({
  text: {
    flexWrap: "wrap",
    fontSize: 18 * Layout.scale.width,
    fontFamily: "opensans-bold",
  },
  sectionHeader: {
    paddingVertical: 4 * Layout.scale.width,
    backgroundColor: Colors.primary,
    paddingLeft: 10 * Layout.scale.width,
  },
  sectionHeaderText: {
    color: Colors.primaryContrast
  },
  startContainer: {
    backgroundColor: '#fff', 

    paddingHorizontal: 10 * Layout.scale.width

  },
  toggleContainer: {
    position: 'relative', 
    zIndex: 8,  
    flexDirection: 'row',
    height: 36, 
    justifyContent: 'space-between', 
    alignItems: 'center',
    backgroundColor: 'lightgray',
    borderRadius: 17,
  },
  toggleText: {
    position: 'relative', 
    zIndex: 5, elevation: 4,
    flex: 1, textAlign: 'center', 
  },
  inactiveToggle: {

    
  },
  buttonContainer: {
    backgroundColor: Colors.primary,
    alignSelf: 'center',
    borderRadius: 17,
    paddingHorizontal: 10,
    paddingVertical: 5,
    ...shadow,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'lightgray'
  },
  buttonText:{
    color: Colors.primaryContrast,

    fontSize: 16 * Layout.scale.width,


  },

  inputLabel: {
    fontSize: 10 * Layout.scale.width,
    color: "red",
    height: 20 * Layout.scale.width,
  },
  textFieldContainer: {
    paddingHorizontal: 10 * Layout.scale.width,
    paddingVertical: 5 * Layout.scale.width,
    flexDirection: "column",
    height: 50 * Layout.scale.width,
  },
  entrySection: {
    borderWidth: 2,

    position: 'relative',
    zIndex: 2,
    borderColor: Colors.primary,
    padding: 10 * Layout.scale.width,
    marginTop: 6 * Layout.scale.width,
    borderRadius: 17

  } ,

  activeToggle: {
    position: 'absolute', 
    zIndex: 3, 
    height: 32, 
    width: '50%', 
    backgroundColor: Colors.primary, 
    top: 2, left: 2, 
    borderRadius: 16 ,

    borderWidth: 2,
    borderColor: Colors.primary,

    ...shadow,
  

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
  textField: {
    fontSize: 17 * Layout.scale.width,
    fontFamily: 'opensans'
  },
});

export default connect(  
  function mapStateToProps(state, ownProps) {
  const { operatingUser, userChannels, ownedChannels } = state.general;
log.info(`userChannels is`, {userChannels})
  return { operatingUser, userChannels: userChannels, ownedChannels };
  },
  function mapDispatchToProps(dispatch) {
    return {
    };
})(CircleAdminScreen);
