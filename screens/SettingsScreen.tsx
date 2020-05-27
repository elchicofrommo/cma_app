
import React, {useState} from 'react';
import {Picker, Text, StyleSheet, View, TextInput, Button, Dimensions, TouchableOpacity } from 'react-native';
import { BorderlessButton, ScrollView } from 'react-native-gesture-handler';
import DatePicker from 'react-native-datepicker'
import { useFocusEffect } from '@react-navigation/native';
import Modal from 'react-native-modal';
import {AppState} from '../constants/AppState'
import Swiper from 'react-native-swiper';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

import { connect } from 'react-redux';


import Amplify from '@aws-amplify/core'
import config from '../aws-exports'
import { Auth, auth0SignInButton } from 'aws-amplify'

Amplify.configure(config)

const {
  width: SCREEN_WIDTH, 
  height: SCREEN_HEIGHT
} = Dimensions.get('window')
const fontScale = SCREEN_WIDTH / 320;

function SettingsScreen({general: state, ...props}) {

    props.navigation.setOptions({title: 'Settings'})

    const [isCancel, setIsCancel] = useState(false)
    const [error, setSigninError] = useState({display: "none", message: ""})
    const [confirmEmail, setConfirmEmail] = useState(false)

    useFocusEffect(

      React.useCallback(() => {

        console.log("creating savePreferences2")
        function savePreferences2(){
          props.dispatchSavePreferences('saving here');
        }
  
        return () => savePreferences2();
      }, [])
    )

    async function signIn(){
      console.log(`signing in with userName: ${state.email} password: ${state.password}`)

      
      try{
        const result = await Auth.signIn(state.email, state.password  )
        console.log(`successful sign in, now dispatching save auth ${JSON.stringify(result)}`)
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
              setSigninError({display: 'inline', message: "Check your email to complete registration then come back and sign in."})
            }else{
              
            }

            
          }catch(err2){
            console.log(`Could not sign up either because ${JSON.stringify(err2)}`)
            if(err2.code == "UsernameExistsException")
              setSigninError({display: "inline", message: JSON.stringify(err.message)})
            else
              setSigninError({display: "inline", message: JSON.stringify(err2.message)})

          }
        }else{
          console.log(`error siginin in ${JSON.stringify(err)}`)
          setSigninError({display: "inline", message: err.message})
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

    console.log(`error display: ${error.display}`)
    return (
      <View style={styles.container} >
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

              <View style={{display: (!confirmEmail)? "inline": "hidden"}}>
                <View style={{backgroundColor: '#fff', paddingHorizontal: 10* fontScale, paddingVertical: 15* fontScale}}>
                  
                  <TextInput 
                    placeholder="bill@cma.com" 
                    value={state.email}
                    autoCapitalize="none"
                    style={[styles.textField]}
                    onChangeText={(name)=>{props.dispatchEmailChange(name)}}
                  />
                  <Text style={{fontSize: 10 * fontScale, color: 'red'}}>Email</Text>
                </View>
                <View style={{backgroundColor: '#fff',paddingHorizontal: 10* fontScale, paddingVertical: 15* fontScale}}>
                    
                  <TextInput 
                  placeholder="*******" secureTextEntry={true}
                  autoCapitalize="none"
                  value={state.password}
                  style={[styles.textField]}
                  onChangeText={(name)=>{props.dispatchPasswordChange(name)}}
                  />
                  <Text style={{fontSize: 10 * fontScale, color: 'red'}}>Password</Text>
                  <Text style={{fontSize: 10 * fontScale, color: passwordColor, paddingTop: 6* fontScale}}>must include a uppercase, a lowercase, a number, and a special character and be more than 8 characters.</Text>
                </View>  
                <View style={{backgroundColor: '#fff', paddingHorizontal: 10* fontScale, paddingVertical: 15* fontScale, display: error.display}}>
                  <Text style={{fontSize: 10 * fontScale, color: 'red'}}>{error.message}</Text>
                </View> 
                <TouchableOpacity style={[styles.button, styles.modalButton]} onPress={signIn}>
                  <Text style={[styles.buttonText]}>Sign In</Text>
                </TouchableOpacity>
              </View>
 
          </Modal>
        <View>
          
          <View style={{backgroundColor: '#fff',paddingHorizontal: 10* fontScale, paddingVertical: 15* fontScale}}>
              
              <TextInput 
              placeholder="bill@cma.com" 
              value={state.email}
              autoCapitalize="none"
              editable={false}
              style={[styles.textField, styles.disabledText]}
              onChangeText={(name)=>{props.dispatchEmailChange(name)}}
              />
              <Text style={{fontSize: 10 * fontScale, color: 'red'}}>Email</Text>
          </View>
          <View style={{backgroundColor: '#fff',paddingHorizontal: 10* fontScale, paddingVertical: 15* fontScale}}>
              
              <TextInput 
              placeholder="*******" secureTextEntry={true}
              autoCapitalize="none"
              editable={false}
              value={state.password}
              style={[styles.textField, , styles.disabledText]}
              onChangeText={(name)=>{props.dispatchPasswordChange(name)}}
              />
              <Text style={{fontSize: 10 * fontScale, color: 'red'}}>Password</Text>
          </View>  
          <View style={{backgroundColor: '#fff',paddingHorizontal: 10* fontScale, paddingVertical: 15* fontScale}}>
              
              <TextInput 
              placeholder="sober1" 
              autoCapitalize="none"
              value={state.screenName}
              style={[styles.textField]}
              onChangeText={(name)=>{props.dispatchScreenNameChange(name)}}
              />
              <Text style={{fontSize: 10 * fontScale, color: 'red'}}>Screen Name</Text>
          </View>
          <View style={{backgroundColor: '#fff',paddingHorizontal: 10* fontScale, paddingVertical: 15* fontScale}}>
              
              <TextInput 
              value={state.name}
              placeholder="John Barlycorn" autoCapitalize="words"
              style={[styles.textField]}
              onChangeText={(name)=>{props.dispatchNameChange(name)}}
              />
              <Text style={{fontSize: 10 * fontScale, color: 'red'}}>Name</Text>
          </View>

          <View style={{ backgroundColor: '#fff',paddingHorizontal: 10* fontScale, paddingVertical: 15* fontScale}}>
              
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
                  fontSize: 20 * fontScale,
                  alignSelf: 'flex-start'
                },
                placeholderText: {
                  fontSize: 20 * fontScale,
                  alignSelf: 'flex-start'
                }

              }}
              onDateChange={(date) => {props.dispatchDosChange(date)}}
            />
            <Text style={{fontSize: 10 * fontScale, color: 'red'}}>Soberiety Date</Text>
          </View>
        </View>
        <View style={{ backgroundColor: '#fff',paddingHorizontal: 10* fontScale, paddingVertical: 15* fontScale, }}>
          <TouchableOpacity style={styles.button} onPress={signOut}>
                <Text style={styles.buttonText}> Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>
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
          dispatchSavePreferences:(data) =>{
            console.log("dispatching save preferences, don't need data as it's all in redux")
            dispatch({type: "SAVE_PREFERENCES", data})
          },
          dispatchSignOut:(data)=>{
            console.log("dispatching sign out");
            dispatch({type: "SIGN_OUT", data})
          },
          dispatchSaveAuth:(data)=>{
            console.log(`dispatching auth ${JSON.stringify(data)}`)
            dispatch({type: "SAVE_AUTH", data})
          }
          
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
  buttonText: {
    fontSize: 20 * fontScale, 
    color: 'white',     
  },
  modalButton: {
    borderBottomLeftRadius: 5 * fontScale,
    borderBottomRightRadius: 5 * fontScale,
  },
  button: {
    backgroundColor: '#1f6e21',
    paddingVertical: 5* fontScale,
    textAlign: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  trackCreated:{
    flex: 2.1
  },
  modalText:{
    fontSize: 21 *fontScale,
    paddingVertical: 20* fontScale,
    paddingHorizontal: 10* fontScale,
    textAlign: 'center',
  },
   modalTextContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    backgroundColor: '#FFF',
    borderTopLeftRadius: 5 * fontScale,
    borderTopRightRadius: 5 * fontScale,
   },
  container: {
    flex: 1,
    backgroundColor: '#D4DAD4',
    justifyContent: "space-between",
    backgroundColor: "#FFF"
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'yellow',
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
    fontSize: 19 * fontScale
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
