import React, { useState, useEffect, } from "react";
import {

  Platform,
  StyleSheet,
  Text,

  TextInput,
  View,
  TouchableWithoutFeedback,
FlatList,

  Animated,
  Easing,
} from "react-native";
import log from "../util/Logging"
import { connect } from "react-redux";
import mutateApi from "../api/mutate";
import fetchApi  from "../api/fetch";
import {
  HeaderBackButton,
} from "@react-navigation/stack";

import {useColors} from '../hooks/useColors'
import {useLayout} from '../hooks/useLayout'

import Button from '../components/Button'
import {store} from '../components/store'
import {

} from "@expo/vector-icons";
import {User, UserChannel, ChannelDetails, Channel} from '../types/gratitude'



function CircleAdminScreen({
  route, navigation,operatingUser,userChannels, ownedChannels, ...props
}: {operatingUser: User, userChannels: UserChannel[], route: any, navigation: any, ownedChannels: Channel[]}) {


log.info(`rendering CircleAdminScreen`)
  const Layout = useLayout();
  const {colors: Colors} = useColors();
  const styles  = useStyles();

  const [offset, setOffset] = useState(new Animated.Value(0))
  const [isJournal, setIsJournal] = useState(true)
  const [toggleWidth, setToggleWidth] = useState(0)
  
  const createLabels = {input: "Circle Name", placeholder: `${operatingUser.name}'s Circle`, }
  const joinLabels = {input: "Invitation Code", placeholder: `Given by Circle Member`, }
  const [labels, setLabels] = useState(createLabels)

  const [input, setInput] = useState()
  const [isLoading, setIsLoading] = useState(false);
  const [channelDetails, setChannelDetails] = useState<ChannelDetails []>([]) 

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
        <View style={[{ 
          flexDirection: "row" , paddingVertical: 10
        },  {display: 'none'}]}>

          <View style={{justifyContent: 'center', flex: 1,  paddingHorizontal: 10 * Layout.scale.width}}>
            <Button onPress={()=>alert('deleting ' + channel.id)} style={styles.buttonContainer} label={"Remove"} />

          </View>
        </View>
        <View>


        
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>


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
            <Button onPress={readyAction} style={styles.buttonContainer} label={"Ready"} />

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

  const {colors: Colors} = useColors();
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

function useStyles(){
  const Layout = useLayout();
  const {colors: Colors} = useColors();
  const styles = StyleSheet.create({
    text: {
      flexWrap: "wrap",
      fontSize: 18 * Layout.scale.width,
      fontFamily: "opensans-bold",
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

    inputLabel: {
      fontSize: 10 * Layout.scale.width,
      color: "red",
      height: 20 * Layout.scale.width,
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

  
    entry: {
      flex: 10,
      margin: 0,
      flexWrap: "wrap",
      fontSize: 18,
      fontFamily: "opensans",
      paddingBottom: 5,
    },

    textField: {
      fontSize: 17 * Layout.scale.width,
      fontFamily: 'opensans'
    },
  });

  return styles
}


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
