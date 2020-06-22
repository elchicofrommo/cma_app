
import React, {useState} from 'react';
import {Picker, Text, StyleSheet, View, TextInput, Button, 
  KeyboardAvoidingView, Dimensions, TouchableOpacity } from 'react-native';
import { BorderlessButton, ScrollView } from 'react-native-gesture-handler';
import DatePicker from 'react-native-datepicker'
import { useFocusEffect } from '@react-navigation/native';
import Modal from 'react-native-modal';
import {AppState} from '../constants/AppState'
import Swiper from 'react-native-swiper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSignOutAlt} from '@fortawesome/free-solid-svg-icons';

import Amplify from '@aws-amplify/core'
import config from '../aws-exports'
import { Auth, auth0SignInButton } from 'aws-amplify'

import { DataStore, Predicates } from "@aws-amplify/datastore";
import { Preferences, AuthDetail, Meetings } from "../models/index";
import { HeaderBackButton } from '@react-navigation/stack';


Amplify.configure(config)

const {
  width: SCREEN_WIDTH, 
  height: SCREEN_HEIGHT
} = Dimensions.get('window')
import Layout from '../constants/Layout';

function SettingsScreen({general: state, ...props}) {

    console.log(`rendering SettingsScreen`)
    props.navigation.setOptions({title: 'Settings'})

    const [isCancel, setIsCancel] = useState(false)
    const [error, setSigninError] = useState({display: "none", message: ""})
    const [confirmEmail, setConfirmEmail] = useState(false)


    async function signIn(){
      console.log(`signing in with email: ${state.email} password: ${state.password}`)

      if(!state.email||!state.password){
        setSigninError({display: "flex", message: 'Fields not complete'})
        return;
      }
      let pattern = new RegExp(/\S+?@\S+?\.\S+/)
      if(!pattern.exec(state.email)){
        setSigninError({display: "flex", message: 'Email address is not valid format.'})
        return;
      }
      
      try{
        const result = await Auth.signIn(state.email, state.password  )
        console.log(`successful sign in, now dispatching save auth ${result}`)
        props.dispatchSaveAuth(result.username )
      }catch(err){
        if(err.code == 'UserNotFoundException' || err.code == "NotAuthorizedException"){
          try{
            console.log("user doesn't exist so create it")
            const signin = await Auth.signUp(state.email, state.password)
            console.log(`sign up confirmed are ${JSON.stringify(signin.user)}`)
            console.log(`sign up confirmed are ${signin.userConfirmed}`)
            console.log(`sign up userSub are ${signin.userSub}`)

            if(!signin.userConfirmed){
              setSigninError({display: 'flex', message: "Check your email to complete registration then come back and sign in."})
            }else{
              
            }

            
          }catch(err2){
            console.log(`Could not sign up either because ${JSON.stringify(err2)}`)
            if(err2.code == "UsernameExistsException")
              setSigninError({display: "flex", message: JSON.stringify(err.message)})
            else
              setSigninError({display: "flex", message: JSON.stringify(err2.message)})

          }
        }else{
          console.log(`error siginin in ${JSON.stringify(err)}`)
          setSigninError({display: "flex", message: err.message})
        }
      }


    }

    function signOut(){
      
      setIsCancel(false)
      setSigninError({display: "none", message: ""})
      setConfirmEmail(false)
      props.dispatchSignOut();
    }

    function cancel(){
      console.log(`setting cancel ${isCancel}`)
      setIsCancel(true);
    }

    function onModalHide(){
      console.log("hello modal")
      if(isCancel)
        props.navigation.goBack();
    }

    const pass = state.password? state.password: ""
    const passwordColor = pass.match(/(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])/) 
      && state.password.length >= 8?
        "green" : "red"

    function SettingsSignoutButton(){
      return (
        <View style={{paddingRight: 10 * Layout.scale.width, marginBottom: -5}}>
          <TouchableOpacity onPress={signOut}>
            <Ionicons name="ios-log-out" color={Colors.primary} size={36}/>
          </TouchableOpacity>
        </View>
      )
    }
    React.useLayoutEffect(() => {
      props.navigation.setOptions({
        headerRight: () => (
          <SettingsSignoutButton />
        ),
        headerLeft: () => <SettingsBackButton navigation={props.navigation}/>,
      });
    }, [props.navigation]);
    return (
      
      <KeyboardAwareScrollView contentContainerStyle={styles.container} enableOnAndroid={true} extraHeight={130} extraScrollHeight={130}>

        <Modal isVisible={!state.authenticated && !isCancel} 
            onModalHide={onModalHide} 
            onBackdropPress={cancel}
            onSwipeComplete={cancel}
            onBackButtonPress={cancel}
            swipeDirection={['up', 'down', 'left', 'right']}>

            <View style={styles.modalTextContainer}>
              <Text style={styles.modalText} >
                Sign in/Sign up
              </Text>
            </View>

              <View style={{display: (!confirmEmail)? "flex": "none"}}>
                <View style={{backgroundColor: '#fff', paddingHorizontal: 10* Layout.scale.width, paddingVertical: 15* Layout.scale.width}}>
                  
                  <TextInput 
                    placeholder="bill@cma.com" 
                    value={state.email}
                    autoCapitalize="none"
                    style={[styles.textField]}
                    onChangeText={(name)=>{props.dispatchEmailChange(name)}}
                  />
                  <Text style={styles.inputLabel}>Email</Text>
                </View>
                <View style={{backgroundColor: '#fff',paddingHorizontal: 10* Layout.scale.width, paddingVertical: 15* Layout.scale.width}}>
                    
                  <TextInput 
                  placeholder="*******" secureTextEntry={true}
                  autoCapitalize="none"
                  value={state.password}
                  style={[styles.textField]}
                  onChangeText={(name)=>{props.dispatchPasswordChange(name)}}
                  />
                  <Text style={styles.inputLabel}>Password</Text>
                  <Text style={{fontSize: 10 * Layout.scale.width, color: passwordColor, paddingTop: 6* Layout.scale.width}}>must include a uppercase, a lowercase, a number, and a special character and be more than 8 characters.</Text>
                </View>  
                <View style={{backgroundColor: '#fff', paddingHorizontal: 10* Layout.scale.width, paddingVertical: 15* Layout.scale.width, display: error.display}}>
                  <Text style={styles.inputLabel}>{error.message}</Text>
                </View> 
                <TouchableOpacity style={[styles.button, styles.modalButton]} onPress={signIn}>
                  <Text style={[styles.buttonText]}>Sign In</Text>
                </TouchableOpacity>
              </View>
 
          </Modal>

        <View>
          <View style={styles.textFieldContainer}>
              
              <TextInput 
              placeholder="bill@cma.com" 
              value={state.email}
              autoCapitalize="none"
              editable={false}
              
              style={[styles.textField, styles.disabledText, {height: 30* Layout.scale.width}]}
              onChangeText={(name)=>{props.dispatchEmailChange(name)}}
              />
              <Text style={styles.inputLabel}>Email</Text>
          </View>
          <View style={styles.textFieldContainer}>
              
              <TextInput 
              placeholder="*******" secureTextEntry={true}
              autoCapitalize="none"
              editable={false}
              value={state.password}
              style={[styles.textField, , styles.disabledText]}
              onChangeText={(name)=>{props.dispatchPasswordChange(name)}}
              />
              <Text style={styles.inputLabel}>Password</Text>
          </View>  
          <View style={styles.textFieldContainer}>
              
              <TextInput 
              placeholder="sober1" 
              autoCapitalize="none"
              value={state.screenName}
              style={[styles.textField]}
              onChangeText={(name)=>{props.dispatchScreenNameChange(name)}}
              />
              <Text style={styles.inputLabel}>Screen Name</Text>
          </View>
          <View style={styles.textFieldContainer}>
              
              <TextInput 
              value={state.name}
              placeholder="John Barlycorn" autoCapitalize="words"
              style={[styles.textField]}
              onChangeText={(name)=>{props.dispatchNameChange(name)}}
              />
              <Text style={styles.inputLabel}>Name</Text>
          </View>

          <View style={styles.textFieldContainer}>
              
            <DatePicker
              style={{width: '100%'}}
              date={state.dos}
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
                  display: 'none'
                },  
                dateText: {
                  fontSize: 20 * Layout.scale.width,
                  alignSelf: 'flex-start'
                },
                placeholderText: {
                  fontSize: 20 * Layout.scale.width,
                  alignSelf: 'flex-start'
                }

              }}
              onDateChange={(date) => {props.dispatchDosChange(date)}}
            />
            <Text style={styles.inputLabel}>Soberiety Date</Text>
          </View>

        </View>
        <View style={{ backgroundColor: '#fff',paddingHorizontal: 10* Layout.scale.width, 
          paddingVertical: 15* Layout.scale.width, display: state.authenticated ? "flex":"none" }}>

        </View>
      </KeyboardAwareScrollView>
    );
  }

  export default connect(
    function mapStateToProps(state, ownProps){
        return state;
      }, 
      function mapDispatchToProps(dispatch, ownState){
        return {
          dispatchNameChange: (name) => {
            console.log("dispatching name change with input " + name);
            dispatch({type: "NAME_CHANGE", name})
          },
          dispatchDosChange: (date) => {
              console.log(`dispatching dos change ${date}`)
              dispatch({type: 'DOS_CHANGE', date})
          },
          dispatchScreenNameChange: (data) => {
            console.log("dispatching userName change with input " + data);
            dispatch({type: "SCREEN_NAME_CHANGE", data})
          },
          dispatchPasswordChange: (data) => {
            console.log("dispatching password change with input " + data);
            dispatch({type: "PASSWORD_CHANGE", data})
          },
          dispatchEmailChange: (data) => {
            console.log("dispatching email change with input " + data);
            dispatch({type: "EMAIL_CHANGE", data})
          },

          dispatchSignOut:(data)=>{
            console.log("dispatching sign out");
            dispatch({type: "SIGN_OUT", data})
          },
          dispatchSaveAuth:(data)=>{
            console.log(`dispatching auth ${data}`)
            dispatch({type: "SAVE_AUTH", data})
          },
          
        }
      }
)(SettingsScreen)




const styles = StyleSheet.create({
  trackTitleGroup:{
    flex: 1, 
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  title:{
    flex: 6,
    flexWrap: 'wrap'
  },
  duration:{
    textAlign: 'center'
  },
  trackDescription:{

  },
  inputLabel: {
    fontSize: 10 * Layout.scale.width, 
    color: 'red', 
    height: 20* Layout.scale.width
  },
  textFieldContainer:{

    paddingHorizontal: 10* Layout.scale.width, 
    paddingVertical: 5* Layout.scale.width,
    flexDirection: 'column',
    height: 50* Layout.scale.width,
  },
  buttonText: {
    fontSize: 20 * Layout.scale.width, 
    color: 'white',     
  },
  modalButton: {
    borderBottomLeftRadius: 5 * Layout.scale.width,
    borderBottomRightRadius: 5 * Layout.scale.width,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 5* Layout.scale.width,
    textAlign: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    height: 40* Layout.scale.width
  },
  trackCreated:{
    flex: 2.1
  },
  modalText:{
    fontSize: 21 *Layout.scale.width,
    paddingVertical: 20* Layout.scale.width,
    paddingHorizontal: 10* Layout.scale.width,
    textAlign: 'center',
  },
   modalTextContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    backgroundColor: '#FFF',
    borderTopLeftRadius: 5 * Layout.scale.width,
    borderTopRightRadius: 5 * Layout.scale.width,
   },
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: Colors.background
  },
  header: {
    flex: 1,
    flexDirection: 'row',
  },
  logo: {
    flex: 1, 
    height: '55%', 
    width: '55%',
    marginLeft: -10,
    marginRight: -10,
    borderWidth: 1,
  },
  headerText: {
    width: '40%',
    borderWidth: 1
  },
  textField: {
    fontSize: 19 * Layout.scale.width,
    height: 30 * Layout.scale.width,
  },
  disabledText: {
    color: 'grey'
  },
  contentContainer: {
    paddingTop: 15,
  },
  optionIconContainer: {
    marginRight: 12,
  },
  option: {
    backgroundColor: '#fdfdfd',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 0,
    borderColor: '#ededed',
  },
  lastOption: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionText: {
    fontSize: 15,
    alignSelf: 'flex-start',
    marginTop: 1,
  },
});


function SettingsBackButton({ navigation, email, screenName, dos, name, dispatchBanner }) {
  async function savePreferences(){
    console.log("saving preferences 1")
    const original = await DataStore.query(Preferences);
  
    let pref = undefined;
    if(!screenName){
      dispatchBanner({message: "To save a profile you must pick a screen name."})
      return;
    }
  
    try{
      if(original.length>0){
      //  console.log("saving preferences 3.1")
        pref = Preferences.copyOf(original[0], updated => {
          updated.email = email,
          updated.screenName = screenName,
          updated.soberietyDate= dos, 
          updated.name= name
        })
      }else{
     //   console.log("saving preferences 3.2")
        pref = new Preferences({
          email: email,
          screenName: screenName, 
          soberietyDate: dos, 
          name: name
        })
      }
   //   console.log("saving preferences 4")
      const result = await DataStore.save(pref)
      dispatchBanner({message: "Profile Saved", status: 'info'})
   //   console.log(`result from save is ${result}`)
    }catch(err){
      console.log(`error is  ${err}`)
      dispatchBanner({message: "Your data was not saved because your profile is incomplete."})
    }
  }
  return (
      <HeaderBackButton  label={"Save"} tintColor={Colors.primary}onPress={(event) => {
          
          navigation.goBack()
          savePreferences()
      }}
          
      />
  )

}

SettingsBackButton = connect(
  function mapStateToProps(state, ownProps) {
      const {email, screenName, dos, name} = state.general;

      return {email, screenName, dos, name}
  },
  function mapDispatchToProps(dispatch) {
      return {
          dispatchBanner:  (data)=> {
            dispatch({ type:"SET_BANNER", banner: data})
          }
      }
  })(SettingsBackButton)

  export {SettingsBackButton}

