import React, { useState, useEffect, useRef } from "react";
import {
  Picker,
  Text,
  StyleSheet,
  View,
  TextInput,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import DatePicker from "react-native-datepicker";
import { useFocusEffect } from "@react-navigation/native";
import Modal from "react-native-modal";
import { AppState } from "../constants/AppState";
import Swiper from "react-native-swiper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import { connect, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import {store} from '../components/store'
import log from "../util/Logging"
import Amplify from "@aws-amplify/core";
import config from "../aws-exports";
import { Auth, auth0SignInButton, API } from "aws-amplify";

import { DataStore, Predicates } from "@aws-amplify/datastore";
import { Preferences, AuthDetail, Meetings } from "../models/index";
import { HeaderBackButton } from "@react-navigation/stack";

import mutateApi, {CreateUserInput, UpdateUserInput} from '../api/mutate'
import queryApi from '../api/fetch'
import {User, Channel, UserChannel, Gratitude, Broadcast, Meeting} from '../types/gratitude'
import moment from 'moment'
import axios from 'axios';

Amplify.configure(config);

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
import Layout from "../constants/Layout";
import { getOperatingUser } from "../graphql/queries";

export type SignInResult ={
  email: string,
  password: String,
  operatingUser?: User,
  ownedChannels?: Channel[],
  userChannels?: UserChannel[],
  gratitudes?: Gratitude[],
  broadcastMap?: Map<string, Broadcast[]>,
  meetings?: string[]
  error?: string, 
}

export async function signIn(email: string, password: string) : Promise<SignInResult> {


  log.info(
    `signing in with email: ${email} password: ${password}`
  );

  if (!email || !password) {

    return {email, password, error: "Fields not complete"};
  }
  let pattern = new RegExp(/\S+?@\S+?\.\S+/);
  if (!pattern.exec(email)) {

    return {email, password, error: "Email address is not valid format"};
  }

  try {
    const result = await Auth.signIn(email, password);
    // if we are here then successful, get user data from cloud
  //  log.info(`auth done, results are ${JSON.stringify(result, null, 2)} next get auth details`)
    const authResults = await queryApi.getAuthDetails(email)
  //  log.info(`authResults are ${JSON.stringify(result, null, 2)} next get auth details`)
    const opResults = await queryApi.fetchOperatingUser(authResults.id)
    log.info(`successful sign in, now dispatching save auth `);

    const broadcastsByChannel = await queryApi.fetchBroadcastGratitude(opResults.user, opResults.userChannels);
    log.info(`broadcastByChannel`, {broadcastsByChannel})
    const signInResult = {email: email, password: password, operatingUser: opResults.user, 
      gratitudes: opResults.gratitudes, ownedChannels: opResults.channels, userChannels: opResults.userChannels, broadcastsByChannel}

    store.dispatch({type: "SAVE_AUTH", data: signInResult});

    const meetingDetails = await getMeetingDetails(opResults.user)
    store.dispatch({ type: 'SYNC_MEETINGS', data: meetingDetails })

    return signInResult
  } catch (err) {
    log.info(`caught error signing in` , {err})
    return {email, password, error: err.message}

  }
}

async function getMeetingDetails(operatingUser: User): Promise<Meeting[]> {

  if(!operatingUser.meetingIds || operatingUser.meetingIds.length ==0)
    return [];

  const meetingList = operatingUser.meetingIds.join(",");
  const query = `https://api.bit-word.com/cma/meeting/id?ids=${meetingList}`;

  log.info(`runnign query ${query}`)

  let response = undefined
  try {
    response = await axios.get(query)
    // log.info(`results from meeting query: ${JSON.stringify(response.data,null, 2)}`)

    const meetings: Meeting[] = response.data.map(rawMeeting => {

      const meeting: Meeting = {
        id: rawMeeting._id,
        name: rawMeeting.name,
        active: rawMeeting.active != 0,
        category: rawMeeting.category,
        location: { lat: rawMeeting.location.coordinates[1], long: rawMeeting.location.coordinates[0] },
        startTime: rawMeeting.start_time,
        weekday: rawMeeting.weekday,
        type: rawMeeting.type,
        street: rawMeeting.street,
        city: rawMeeting.city,
        state: rawMeeting.state,
        paid: rawMeeting.paid,
        zip: rawMeeting.zip
      }

      return meeting

    })
    return meetings
  } catch (err) {
    log.info(`Network problmes. Try again` , {err});
    return [];
  }

}


function SettingsScreen({ operatingUser: opUser, ...props } : {operatingUser: User, props: any}) {
  log.info(`rendering SettingsScreen`);
  

  const [isCancel, setIsCancel] = useState(false);
  const [error, setSigninError] = useState({ display: "none", message: "" });
  const [confirmEmail, setConfirmEmail] = useState(false);
  const [isSignUp, setIsSignup] = useState(false);
  const [email, setEmail] = useState ("")
  const [password, setPassword] = useState("");
  const [name, setName] = useState("")
  const [dos, setDos] = useState(moment().format("MM/DD/YYYY"))

  useEffect(()=>{
    setName(opUser.name || "")
    setDos(moment(opUser.dos||Date.now()).format("MM/DD/YYYY") )
    setEmail(opUser.email)
  }, [opUser])

  const emailInput = useRef(null)


  async function signUp() {
    try {

      const signin = await Auth.signUp(email, password);
      log.info(`sign up confirmed are ${JSON.stringify(signin.user)}`);
      log.info(`sign up confirmed are ${signin.userConfirmed}`);
      log.info(`sign up userSub are ${signin.userSub}`);
      setSigninError({
        display: "flex",
        message:
          "Check your email to complete registration then come back and sign in.",
      });

      const userInput: CreateUserInput = {
        email: email,
        name: name
      }
      mutateApi.createUser(userInput)
      setIsSignup(false)
    } catch (err2) {

      if(err2.code=="UsernameExistsException")
        setSigninError({
          display: "flex",
          message: "You must confirm your account. Check your email to complete registration.",
        });
      else
        setSigninError({
          display: "flex",
          message: JSON.stringify(err2),
        });
    }
  }

  async function signInAction(){
    const result = await signIn(email, password)
    props.navigation.setOptions({ title: "Settings" });
    if(result.error){
      setSigninError({ display: "flex", message: result.error });
    }
  }

  function signOut() {
    setIsCancel(false);
    setSigninError({ display: "none", message: "" });
    setConfirmEmail(false);
    setIsSignup(false)
    setEmail("")
    setPassword("")
    setName("")

    props.dispatchSignOut();
  }

  function cancel() {
    log.info(`setting cancel ${isCancel}`);
    setIsCancel(true);
  }

  function onModalHide() {
    log.info("hello modal");
    if (isCancel) {
      props.navigation.goBack();
    }
  }

  const pass = password ? password : "";
  const passwordColor =
    pass.match(/(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])/) &&
    password.length >= 8
      ? "green"
      : "red";

  function SettingsSignoutButton() {
    return (
      <View style={{ paddingRight: 10 * Layout.scale.width, marginBottom: -5 }}>
        <TouchableOpacity onPress={signOut}>
          <Ionicons name="ios-log-out" color={Colors.primary} size={36} />
        </TouchableOpacity>
      </View>
    );
  }
  React.useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => <SettingsSignoutButton />,
      headerLeft: () => <SettingsBackButton operatingUser={opUser} name={name} email={email} dosAsString={dos} navigation={props.navigation} />,
    });
  }, [props.navigation, opUser, name, email, dos, ]);
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      enableOnAndroid={true}
      extraHeight={130}
      extraScrollHeight={130}
    >
      <Modal
        isVisible={opUser.role =='guest' && !isCancel}
        onModalHide={onModalHide}
        onModalShow={()=>emailInput.current.focus()}
        onBackdropPress={cancel}
        onSwipeComplete={cancel}
        onBackButtonPress={cancel}

        swipeDirection={["up", "down", "left", "right"]}
      >
            <KeyboardAwareScrollView
            enableOnAndroid={true}
          >
        <View style={styles.modalContainer}>
        <View style={styles.modalTextContainer}>
          
          <TouchableOpacity onPress={()=>setIsSignup(false)}><Text style={[styles.modalText, !isSignUp ? {textDecorationLine: 'underline', textDecorationColor: Colors.primary}:{}]}>Sign in</Text></TouchableOpacity>
          <TouchableOpacity onPress={()=>setIsSignup(true)}><Text style={[styles.modalText, isSignUp ? {textDecorationLine: 'underline', textDecorationColor: Colors.primary}:{}]}>New User</Text></TouchableOpacity>
        </View>

        <View style={{ display: !confirmEmail ? "flex" : "none" }}>
          <View
            style={{
              backgroundColor: "#fff",
              paddingHorizontal: 10 * Layout.scale.width,
            }}
          >
            <TextInput
              placeholder="bill@cma.com"
              value={email}
              autoCapitalize="none"
              ref={emailInput}
              style={[styles.textField]}
              onChangeText={(value) => {
                setEmail(value);
              }}
            />
            <Text style={styles.inputLabel}>Email</Text>
          </View>
          <View
            style={{
              backgroundColor: "#fff",
              paddingHorizontal: 10 * Layout.scale.width,
              display: isSignUp? "flex" : "none",
              marginBottom: -1,
            }}
          >
            <TextInput
              placeholder="Bill W"
              value={name}
              autoCapitalize="none"
              style={[styles.textField]}
              onChangeText={(value) => {
                setName(value)
              }}
            />
            <Text style={styles.inputLabel}>Name</Text>
          </View>
          <View
            style={{
              backgroundColor: "#fff",
              paddingHorizontal: 10 * Layout.scale.width,
            }}
          >
            <TextInput
              placeholder="*******"
              secureTextEntry={true}
              autoCapitalize="none"
              value={password}
              style={[styles.textField]}
              onChangeText={(value) => {
                setPassword(value)
              }}
            />
            <Text style={styles.inputLabel}>Password</Text>
            <Text
              style={{
                fontSize: 10 * Layout.scale.width,
                color: passwordColor,
                paddingTop: 6 * Layout.scale.width,
              }}
            >
              must include a uppercase, a lowercase, a number, and a special
              character and be more than 8 characters.
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "#fff",
              paddingHorizontal: 10 * Layout.scale.width,
              paddingVertical: 15 * Layout.scale.width,
              display: error.display,

            }}
          >
            <Text style={[styles.inputLabel, {height: "auto"}]}>{error.message}</Text>
          </View>
          <TouchableOpacity
            style={[styles.button, styles.modalButton]}
            onPress={()=>{isSignUp?signUp(): signInAction()}}
          >
            <Text style={[styles.buttonText]}>{isSignUp?"Sign Up":"Sign In"}</Text>
          </TouchableOpacity>
        </View>
        </View>
        </KeyboardAwareScrollView>
      </Modal>

      <View>
        <View style={styles.textFieldContainer}>
          <TextInput
            placeholder="bill@cma.com"
            value={email}
            autoCapitalize="none"
            editable={false}
            style={[
              styles.textField,
              styles.disabledText,
              { height: 30 * Layout.scale.width },
            ]}

          />
          <Text style={styles.inputLabel}>Email</Text>
        </View>
        <View style={styles.textFieldContainer}>
          <TextInput
            placeholder="*******"
            secureTextEntry={true}
            autoCapitalize="none"
            editable={false}
            value={password}
            style={[styles.textField, , styles.disabledText]}

          />
          <Text style={styles.inputLabel}>Password</Text>
        </View>

        <View style={styles.textFieldContainer}>
          <TextInput
            value={name}
            placeholder="John Barlycorn"
            autoCapitalize="words"
            style={[styles.textField]}
            onChangeText={(value) => {
              setName(value)
            }}
          />
          <Text style={styles.inputLabel}>Name</Text>
        </View>

        <View style={styles.textFieldContainer}>
          <DatePicker
            style={{ width: "100%" }}
            date={dos}
            mode="date"
            placeholder="MM/DD/YYYY"
            format="MM/DD/YYYY"
            minDate="01/01/1920"
            maxDate="01/01/2050"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateInput: {
                borderWidth: 0,
              },
              dateIcon: {
                display: "none",
              },
              dateText: {
                fontSize: 20 * Layout.scale.width,
                alignSelf: "flex-start",
              },
              placeholderText: {
                fontSize: 20 * Layout.scale.width,
                alignSelf: "flex-start",
              },
            }}
            onDateChange={(date) => {
              setDos(date)
            }}
          />
          <Text style={styles.inputLabel}>Soberiety Date</Text>
        </View>
      </View>
      <View
        style={{
          backgroundColor: "#fff",
          paddingHorizontal: 10 * Layout.scale.width,
          paddingVertical: 15 * Layout.scale.width,
          display: opUser.role!=="guest" ? "flex" : "none",
        }}
      ></View>
    </KeyboardAwareScrollView>
  );
}

export default connect(
  function mapStateToProps(state, ownProps) {
    return {operatingUser: state.general.operatingUser};
  },
  function mapDispatchToProps(dispatch, ownState) {
    return {


      dispatchSignOut: (data) => {
        log.info("dispatching sign out");
        dispatch({ type: "SIGN_OUT", data });
      },
      dispatchSaveAuth: (data) => {
        log.info(`dispatching auth `);
        dispatch({ type: "SAVE_AUTH", data });
      },
    };
  }
)(SettingsScreen);

const styles = StyleSheet.create({
  trackTitleGroup: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    flex: 6,
    flexWrap: "wrap",
  },
  duration: {
    textAlign: "center",
  },
  trackDescription: {},
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
  buttonText: {
    fontSize: 20 * Layout.scale.width,
    color: "white",
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 5 * Layout.scale.width,
    overflow: "hidden"
  },
  modalButton: {

  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 5 * Layout.scale.width,
    textAlign: "center",
    justifyContent: "center",
    flexDirection: "row",
    height: 40 * Layout.scale.width,
  },
  trackCreated: {
    flex: 2.1,
  },
  modalText: {
    fontSize: 21 * Layout.scale.width,
    paddingVertical: 20 * Layout.scale.width,
    paddingHorizontal: 10 * Layout.scale.width,
    textAlign: "center",
  },
  modalTextContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "grey",
    backgroundColor: "#FFF",

    flexDirection: 'row',
    justifyContent: 'center'
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: Colors.background,
  },
  header: {
    flex: 1,
    flexDirection: "row",
  },
  logo: {
    flex: 1,
    height: "55%",
    width: "55%",
    marginLeft: -10,
    marginRight: -10,
    borderWidth: 1,
  },
  headerText: {
    width: "40%",
    borderWidth: 1,
  },
  textField: {
    fontSize: 19 * Layout.scale.width,
    height: 30 * Layout.scale.width,
  },
  disabledText: {
    color: "grey",
  },
  contentContainer: {
    paddingTop: 15,
  },
  optionIconContainer: {
    marginRight: 12,
  },
  option: {
    backgroundColor: "#fdfdfd",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 0,
    borderColor: "#ededed",
  },
  lastOption: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionText: {
    fontSize: 15,
    alignSelf: "flex-start",
    marginTop: 1,
  },
});

function SettingsBackButton({
  navigation,
  operatingUser,
  dosAsString,
  name,
  ...props
}: {operatingUser: User, email: string, dosAsString: string, name: string, navigation: any, props: any}) {
  async function savePreferences() {
    const userDosAsString = moment(operatingUser.dos).format("MM/DD/YYYY")
    if(operatingUser.name == name && dosAsString ==userDosAsString){
      log.info(`no changes to preferences, no action`)
      return;
    }

    const dos = moment(dosAsString).toDate().getTime()
    
    try {
      const input: UpdateUserInput = {
        id: operatingUser.id,
        dos,
        name,
        shareDos: false
      }
      type updateUserResult = {
        updateUser: User
      }
      const result = await mutateApi.updateUser(input)
     // log.info(JSON.stringify(result, null, 2))
      props.dispatchOperatingUser(result)
      //   log.info(`result from save is ${result}`)
    } catch (err) {
      log.info(`error is  ${err}`);
      props.dispatchBanner({
        message: "Your data was not saved because your profile is incomplete.",
      });
    }
  }
  return (
    <HeaderBackButton
      label={"Save"}
      tintColor={Colors.primary}
      onPress={(event) => {

        navigation.goBack();
        savePreferences();
      }}
    />
  );
}

SettingsBackButton = connect(
  function mapStateToProps(state, ownProps) {

    return {}
  },
  function mapDispatchToProps(dispatch) {
    return {

      dispatchOperatingUser: (data) => {
        dispatch(async (d1) => {
            return new Promise(resolve => {

                dispatch({ type: "UPDATE_OPERATING_USER", data })
                resolve(
                  dispatch({ type: "SET_BANNER", banner: {message: "Profile Saved", status: "info" }})
                );
            })
        })
      },
      dispatchBanner: (data) => {
        dispatch({ type: "SET_BANNER", banner: data });
      },
    };
  }
)(SettingsBackButton);

export { SettingsBackButton }
