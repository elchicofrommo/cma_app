import React, { useState, useEffect, useRef } from "react";
//import signer from 'aws-signature-v4'
import {
  Picker,
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  findNodeHandle,
  LayoutAnimation,
} from "react-native";
import Svg, {
  Circle,
  Ellipse,
  G,

  TSpan,
  TextPath,
  Path,
  Polygon,
  Polyline,
  Line,
  Rect,
  Use,

  Symbol,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  ClipPath,
  Pattern,
  Mask,
} from 'react-native-svg';


import Modal from "react-native-modal";


import { Ionicons } from "@expo/vector-icons";
import { Themes, useColors } from "../hooks/useColors";
import { connect, } from "react-redux";

import { store } from '../redux/store'
import log from "../util/Logging"

import { Auth, } from "aws-amplify";

import mutateApi, { CreateUserInput, UpdateUserInput } from '../api/mutate'
import queryApi from '../api/query'
import { User, Channel, ChannelMember, Post, Broadcast, Meeting } from '../types/circles.'


import { useLayout } from '../hooks/useLayout'


export type SignInResult = {

  operatingUser?: User,
  ownedChannels?: Channel[],
  channelMembers?: ChannelMember[],
  posts?: Post[],
  broadcastMap?: Map<string, Broadcast[]>,
  meetings?: string[]
  error?: string,

}

export type AuthorizeTokens = {
  userName: string, 
  jwtToken?: string,
  refreshToken?: string,
  email: string,
  password: string,
  error?: string
}
export async function authorize(email: string, password: string): Promise<AuthorizeTokens>{


  log.info(
    `signing in with email: ${email} password: ${password}`
  ); 

  if (!email || !password) {

    return { email, password, error: "Fields not complete" };
  }
  let pattern = new RegExp(/\S+?@\S+?\.\S+/);
  if (!pattern.exec(email)) {

    return { email, password, error: "Email address is not valid format" };
  }

  try {
    const result = await Auth.signIn(email.trim(), password);
    // if we are here then successful, get user data from cloud
      log.verbose(`auth done`, {authResults: result})
    // now pull out jwtToken and refresh token
    const userName = result.username;
    const jwtToken = result.signInUserSession.idToken.jwtToken;
    const refreshToken = result.signInUserSession.refreshToken.token;
    store.dispatch({type: "SET_AUTH_TOKENS", tokens: {email, password, jwtToken, refreshToken}})
    return {userName, email, password, jwtToken, refreshToken}
  }catch(err){
    log.verbose("error in authentication", {error: err})
    return {userName: undefined, jwtToken: undefined, refreshToken: undefined, email, password}
  }
}

export async function getUserDetails(email: string, jwtToken: string): Promise<SignInResult> {

  try{
    const authResults = await queryApi.getAuthDetails(email)
    //  log.info(`authResults are ${JSON.stringify(result, null, 2)} next get auth details`)
    const opResults = await queryApi.fetchUser(authResults.id)
    log.info(`successful sign in, now dispatching save auth `);

    const broadcastsByChannel = await queryApi.fetchBroadcastPost(opResults.user, opResults.channelMembers);
    log.info(`broadcastByChannel`, { broadcastsByChannel })
    const signInResult = {
      operatingUser: opResults.user,
      posts: opResults.posts, ownedChannels: opResults.channels, 
      channelMembers: opResults.channelMembers, broadcastsByChannel,

    }

    store.dispatch({ type: "SAVE_AUTH", data: signInResult });

   // const meetingDetails = await apiGateway.getMeetingDetails(opResults.user)
   // store.dispatch({ type: 'SYNC_MEETINGS', data: meetingDetails })

    return signInResult
  } catch (err) {
    log.info(`caught error signing in`, { err })
    return {  error: err.message }

  }
}



function SignInScreen({ operatingUser: opUser, ...props }: { operatingUser: User, props: any }) {

  const { colors: Colors } = useColors();
  const styles = useStyles();
  const [isCancel, setIsCancel] = useState(false);
  const [error, setSigninError] = useState({ display: "none", message: "" });
  const [confirmEmail, setConfirmEmail] = useState(false);
  const [isSignUp, setIsSignup] = useState(false);
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("");
  const [name, setName] = useState("")
  const [loading, setLoading ] = useState(false)
  let scrollRef = undefined;
  async function runAuthLogs(){

    const authUserP = Auth.currentAuthenticatedUser()
    const userInfoP =  Auth.currentUserInfo();
    const sessionP =  Auth.currentSession();
    const credsP =  Auth.currentCredentials()
    try{
      const authUser = await authUserP;
      log.verbose('', {authUser })
    }catch(authErr){
      log.verbose('error with authUser', {authErr})
    }
    try{
      const userInfo = await userInfoP;
      log.verbose('', {userInfo})
    }catch(infoErr){
      log.verbose('error with userInfo', {infoErr})
    }
    
    try{
      const session = await sessionP;
      log.verbose(``, {session})
    }catch(sessionErr){
      log.verbose('error with session', {sessionErr})
    }
    
    try{
      const creds = await credsP;
     // const signature = signer.createSignature(creds.secretAccessKey, Date.now(), 'us-west-2', undefined,creds.accessKeyId )
      log.verbose('', {creds })
    }catch(credsErr){
      log.verbose('error with creds', {credsErr})
    }


    
  }

  useEffect(() => {

    setName("")
    setEmail("")
    runAuthLogs();

  }, [])


  const emailInput = useRef(null)




  async function signUp() {
    try {

      const signup = await Auth.signUp(email, password);
      log.verbose(`sign up response `, {signup});

      if(signup.userConfirmed){
        const authResult = await authorize(email, password);

      const userInput: CreateUserInput = {
        id: authResult.userName,
        email: email,
        name: name
      }
        await mutateApi.createUser(userInput)
        await getUserDetails(email, undefined)
      }
      

      setIsSignup(false)
    } catch (err2) {
      log.verbose(`sign up error `, {signUpErr: err2});
      if (err2.code == "UsernameExistsException")
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
    runAuthLogs();

  }

  async function signInAction() {
    log.info('sign in action');
    Keyboard.dismiss();
    setLoading(true);
    const tokens = await authorize(email, password)
    log.verbose("",{tokens})
    const result = await getUserDetails(email, tokens.jwtToken)
    setLoading(false);
    if (result.error) {
      setSigninError({ display: "flex", message: result.error });
    }else{
      setEmail()
      setPassword()
      
     // props.navigation.navigate('home')
    }
    runAuthLogs();
  }

  async function signOut(){
    await Auth.signOut()
    const creds = await Auth.currentCredentials();

  }

  function cancel() {
    log.info(`setting cancel ${isCancel}`);
    setIsCancel(true);
  }


  const pass = password ? password : "";
  const passwordColor =
    pass.match(/(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])/) &&
      password.length >= 8
      ? "green"
      : "red";

  const circleD = `M 283.00,30.98
      C 307.56,38.61 330.85,50.36 351.00,66.45
        369.42,81.17 385.49,98.94 397.94,119.00
        447.12,198.23 437.22,300.48 374.08,369.00
        358.10,386.35 339.12,401.12 318.00,411.75
        282.96,429.39 253.00,435.45 214.00,435.00
        198.04,434.81 176.30,430.42 161.00,425.72
        140.06,419.28 119.83,409.31 102.00,396.57
        25.00,341.54 -4.35,239.69 30.45,152.00
        51.25,99.59 93.59,57.25 146.00,36.45
        159.20,31.21 176.94,26.28 191.00,24.28
        191.00,24.28 208.00,22.42 208.00,22.42
        229.49,19.81 262.30,24.54 283.00,30.98 Z`
  const layout = useLayout()
  return (
    <View style={{flex: 1, backgroundColor: Colors.primaryContrast }}  >

    <KeyboardAvoidingView behavior={"position"} keyboardVerticalOffset={(10) *layout.scale.height}>
      <Svg height={(layout.headerHeight + layout.safeBottom) + (layout.scale.width * 125) + 1} width={layout.window.width}
      >
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={Colors.header1} stopOpacity="1" />
            <Stop offset="1" stopColor={Colors.header2} stopOpacity="1" />
          </LinearGradient>
          <RadialGradient
            id="shadow"
            cx={layout.window.width / 2}
            cy={layout.headerHeight + layout.safeBottom + 1}
            rx={layout.window.width / 1.8}
            ry={layout.scale.height * 20}
            fx={layout.window.width / 2}
            fy={layout.headerHeight + layout.safeBottom + 1}
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="90%" stopColor="black" stopOpacity=".2" />
            <Stop offset="100%" stopColor="black" stopOpacity=".08" />
          </RadialGradient>
        </Defs>
        <Circle x={-10 * layout.scale.width} y={50 * layout.scale.height} r={125 * layout.scale.width} fill={Colors.primary1} fillOpacity={.8}></Circle>
        <Circle x={110 * layout.scale.width} y={50 * layout.scale.height} r={100 * layout.scale.width} fill={Colors.primary1} fillOpacity={1}></Circle>
        <Circle x={10 * layout.scale.width} y={20 * layout.scale.height} r={70 * layout.scale.width} fill={Colors.header1} fillOpacity={1}></Circle>


        <G stroke={Colors.primaryContrast} fill="none" strokeWidth={6}
          transform={{
            scale: [.3 * layout.scale.width, .3 * layout.scale.width],
            translate: [90 * layout.scale.width, 60 * layout.scale.height]
          }}>
          <Path

            strokeWidth={5}
            stroke={"white"}
            fill={Colors.primary1}
            d={circleD}

            strokeLinecap={"square"}
            strokeLinejoin={"bevel"}
          />
          <Path

            strokeWidth={5}
            stroke={"white"}
            strokeLinecap={"round"}
            strokeLinejoin={"bevel"}
            d={`M 282.50,146.00
C 241.27,145.51 216.33,145.33 164.76,145.95
  193.00,95.33 196.71,84.62 222.00,45.00
  233.38,63.95 223.00,46.00 247.46,84.68M -173.00,-3.00`}

          />

          <Path

            strokeWidth={5}
            stroke={"white"}
            d={`M 348.62,267.75
C 330.00,236.00 312.50,204.50 285.50,156.00
  260.00,181.00 247.00,194.50 222.00,221.00
  201.50,200.00 183.25,181.25 159.87,157.50
  142.00,188.00 129.00,211.00 96.37,267.00M 222.00,45.50`}

            strokeLinecap={"round"}


          />
          <Path

            strokeWidth={5}
            strokeLinecap={"round"}

            stroke={"white"}
            d={`M 379.50,325.50
C 379.50,325.50 287.03,267.78 287.03,267.78
  287.03,267.78 237.49,238.08 222.00,229.00
  210.06,235.93 156.75,267.89 156.75,267.89
  156.75,267.89 84.03,311.73 84.03,311.73
  84.03,311.73 65.75,322.75 65.75,322.75M 287.00,268.00
C 287.00,268.00 157.00,268.00 157.00,268.00`}

          />

        </G>
      </Svg>

        <View style={styles.modalContainer}>
          <View style={styles.modalTextContainer}>

            <TouchableOpacity onPress={() => setIsSignup(false)}><Text style={[styles.modalText, !isSignUp ? { textDecorationLine: 'underline', textDecorationColor: Colors.primary1 } : {}]}>Sign in</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => setIsSignup(true)}><Text style={[styles.modalText, isSignUp ? { textDecorationLine: 'underline', textDecorationColor: Colors.primary1 } : {}]}>New User</Text></TouchableOpacity>
          </View>

          <View style={{ display: !confirmEmail ? "flex" : "none" }}>
            <View
              style={{
                backgroundColor: "#fff",
                paddingHorizontal: 10 * layout.scale.width,
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
                paddingHorizontal: 10 * layout.scale.width,
                display: isSignUp ? "flex" : "none",
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
                paddingHorizontal: 10 * layout.scale.width,
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
                  fontSize: 10 * layout.scale.width,
                  color: passwordColor,
                  paddingTop: 6 * layout.scale.width,
                }}
              >
                must include a uppercase, a lowercase, a number, and a special
                character and be more than 8 characters.
            </Text>
            </View>
            <View
              style={{
                backgroundColor: "#fff",
                paddingHorizontal: 10 * layout.scale.width,
                paddingVertical: 15 * layout.scale.width,
                display: error.display,

              }}
            >
              <Text style={[styles.inputLabel, { height: "auto" }]}>{error.message}</Text>
            </View>
            <TouchableOpacity
              style={[styles.button, styles.modalButton]}
              onPress={() => { isSignUp ? signUp() : signInAction() }}
            >
              <Text style={[styles.buttonText]}>{isSignUp ? "Sign Up" : "Sign In"}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.modalButton,]}
              onPress={async () => { await Auth.signOut(); runAuthLogs() }}
            >
              <Text style={[styles.buttonText]}>{ "Sign Out"}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{}}
              onPress={() => {

                new Promise((resolve) => {
                  store.dispatch({ type: "SET_GUEST_USER" })
                  resolve();
              }).then(()=>{
                log.info('dispatched guest user, now should be going home')
                props.navigation.navigate('home')
              })}}
          >
            <Text style={[styles.guestText]}>Continue as Guest</Text>
          </TouchableOpacity>
        </View>
        </View>

      </KeyboardAvoidingView >
      </View>
  );
}

export default connect(
  function mapStateToProps(state, ownProps) {
    return { operatingUser: state.general.operatingUser };
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
)(SignInScreen);

function useStyles() {
  const { colors: Colors } = useColors()
  const layout = useLayout()
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
    guestText: {
      fontSize: 20 * layout.scale.height,
      color: Colors.header1,
      textAlign: 'center',
      paddingTop: 5 * layout.scale.height,
    },
    trackDescription: {},
    inputLabel: {
      fontSize: 10 * layout.scale.height,
      color: "red",
      height: 20 * layout.scale.height,
    },
    textFieldContainer: {
      paddingHorizontal: 10 * layout.scale.height,
      paddingVertical: 5 * layout.scale.height,
      flexDirection: "column",
      height: 50 * layout.scale.height,
    },
    buttonText: {
      fontSize: 20 * layout.scale.height,
      color: "white",
    },
    modalContainer: {
      backgroundColor: 'white',

      overflow: "hidden"
    },
    modalButton: {
      marginTop: 5 * layout.scale.height
    },
    button: {
      backgroundColor: Colors.primary1,
      paddingVertical: 5 * layout.scale.height,
      textAlign: "center",
      justifyContent: "center",
      flexDirection: "row",
      height: 40 * layout.scale.height,
    },
    trackCreated: {
      flex: 2.1,
    },
    modalText: {
      fontSize: 26 * layout.scale.height,
      paddingVertical: 5 * layout.scale.height,
      paddingHorizontal: 10 * layout.scale.height,
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
      fontSize: 19 * layout.scale.height,
      height: 30 * layout.scale.height,
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
  return styles;
}


