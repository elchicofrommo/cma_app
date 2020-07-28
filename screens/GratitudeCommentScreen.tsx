
import React, { useState, useEffect, useCallback, memo, useRef } from 'react';
import {
    Image, Platform, StyleSheet, Text, TouchableOpacity,
    TextInput, View, Button, Dimensions, Keyboard, Linking, FlatList, KeyboardAvoidingView, Animated, Easing, StatusBar
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { connect } from 'react-redux';

import log from "../util/Logging"
import EditorMenu from '../navigation/GraditudeEditorMenu'
import { useFocusEffect } from '@react-navigation/native';
import { HeaderStyleInterpolators, HeaderBackButton } from '@react-navigation/stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCertificate } from '@fortawesome/free-solid-svg-icons';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';

import moment from 'moment'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import KeyboardStickyView from "rn-keyboard-sticky-view"
import { FontAwesome5, Entypo, Octicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { DataStore, Predicates } from "@aws-amplify/datastore";
import { Gratitude } from "../models/index";
import { enableNetworkProviderAsync } from 'expo-location';

const defaultEntry = {
    date: new Date(),
    title: moment().format('MMMM Do YYYY h:MM a'),
    entries: []
}

function GratitudeEditorScreen({ route, navigation, entry=defaultEntry, ...props }) {

    const [entryEdit, setEntryEdit] = useState(entry);

    const [rowEdit, setRowEdit] = useState<{index: number, text:string}>();
    const textInput = useRef(null);
    const [keyboardHeight, setKeyboardHeight] = useState(new Animated.Value(30))
    const [opacity, setOpacity] = useState(new Animated.Value(0))

    

    React.useLayoutEffect(() => {
        navigation.setOptions({

          headerLeft: () => <GratitudeSaveButton navigation={navigation} entryEdit={entryEdit}/>,
        });
        
    }, [entryEdit]);
    
    function startEntry(index=-1, text:string=""){
        setRowEdit({index, text});

    }

    function showKeyboard(event){
        log.info(`showing keyboard height is ${event.endCoordinates.height}`)

            Animated.stagger( event.duration /7 * 4, 
                [Animated.timing(keyboardHeight, {
                    duration: event.duration, 
                    useNativeDriver: true,
                    toValue: - event.endCoordinates.height ,
                    easing: Easing.in(Easing.quad),
                }),
                Animated.timing(opacity, {
                    duration: event.duration, 
                    useNativeDriver: true,
                    toValue: 1 ,
                    easing: Easing.in(Easing.quad),
                })
            ]).start()


    }
    function hideKeyboard(event){
        log.info('hide keybaord')
        if(Platform.OS==='android'){
            props.dispatchShowEditor();
            setRowEdit(undefined)
        }else{
            Animated.parallel([
                Animated.timing(keyboardHeight, {
                    duration: event.duration,
                    useNativeDriver: true, 
                    toValue: 30,
                    easing: Easing.in(Easing.quad),
                }),
                Animated.timing(opacity, {
                    duration: event.duration/7 * 5, 
                    useNativeDriver: true,
                    toValue: 0 ,
                    easing: Easing.out(Easing.exp),
                })], {stopTogether: false}
                )
            .start(()=>{setRowEdit(undefined)})
        }
        
    }


    useEffect(() => {
        log.info(`use effect in editor screen, `, {entry})
        let newEntry = entry;
        if(entry===defaultEntry){
            const date = new Date()
            newEntry = {
                date: date,
                title: moment().format('MMMM Do YYYY h:mm a'),
                entries: []
            }
        }
        log.info(`#####use effect in editor screen, `,{newEntry})
        
        setEntryEdit(newEntry);
        props.dispatchRegisterSubmenu({ submenu: <EditorMenu key={'gratitudeEditor'} callback={startEntry}/>, name: "gratitudeEditor" })
        const showHolder = Platform.OS==='ios' ? Keyboard.addListener('keyboardWillShow', showKeyboard):
            Keyboard.addListener('keyboardDidShow', showKeyboard);
        const hideHolder = Platform.OS==='ios' ?  Keyboard.addListener('keyboardWillHide', hideKeyboard):
            Keyboard.addListener('keyboardDidHide', hideKeyboard);
        StatusBar.setBarStyle("dark-content", true);
        props.dispatchShowEditor(route.params);
        return  ()=>{
            showHolder.remove();
            hideHolder.remove();
        }


    }, [])

    function commitEntry(){
        
        setRowEdit({index: -1, text:""});
        setEntryEdit(()=>{
            const {date, entries, title} = entryEdit;
            if(rowEdit.index > -1)
                entries[rowEdit.index] = rowEdit.text;
            else
                entries.push(rowEdit.text);
            const newEntry = {
                date, title, entries: [...entries]
            }

            return newEntry
        });
        textInput.current.clear();
    }

    function deleteEntry(){
        setRowEdit({index: -1, text:""});
        setEntryEdit(()=>{
           // entries.delete
            const {date, entries, title} = entryEdit;
            entries.splice(rowEdit.index, 1)
            const newEntry = {
                date, title, entries: [...entries]
            }

            return newEntry
        });
        textInput.current.clear();

    }

    function cancelEntry(){
        textInput.current.clear()
    }

    const transform = {
        transform: [{ translateY: keyboardHeight,  }],
        opacity: opacity
    }

    let textEntry = undefined;

        
    if(Platform.OS === "ios"){
        log.info(`so the platform is ios??`)
        textEntry =                     
        <Animated.View style={[transform, styles.keyboardEntryContainer]}>
            <TextInput
                ref={textInput}
                value={rowEdit ? rowEdit.text: ""}
                keyboardType={"twitter"}
                placeholder="Write something..."
                style={[styles.keyboardEntry, ] }
                multiline={true}
                onChangeText={(value)=>setRowEdit({index: rowEdit.index, text: value})}
            />
             <TouchableOpacity style={styles.addEntryButton} onPress={rowEdit &&rowEdit.index > -1?deleteEntry: undefined}>
                <MaterialCommunityIcons name={"delete-circle"} size={38} color={rowEdit &&rowEdit.index > -1?Colors.primary1:'gray'} style={styles.deleteEntryButton}/>
            </TouchableOpacity>  
            <TouchableOpacity style={styles.addEntryButton} onPress={commitEntry}>
                
                <FontAwesome5 name={"arrow-circle-up"} size={32} color={Colors.appBlue} style={styles.addEntryButton}/>
            </TouchableOpacity>
        </Animated.View>
    }else{
        log.info('platform is android')
        textEntry = <View style={styles.keyboardEntryContainer}>
            <TextInput
                ref={textInput}
                keyboardType={"visible-password"}
                placeholder="Write something..."
                style={[styles.keyboardEntry, ] }
                multiline={true}
                onChangeText={(value)=>setRowEdit({index: rowEdit.index, text: value})}
            />
             <TouchableOpacity style={styles.addEntryButton} onPress={rowEdit &&rowEdit.index > -1?deleteEntry: undefined}>
                <MaterialCommunityIcons name={"delete-circle"} size={38} color={rowEdit &&rowEdit.index > -1?Colors.primary1:'gray'} style={styles.deleteEntryButton}/>
            </TouchableOpacity>  
            <TouchableOpacity style={styles.addEntryButton} onPress={commitEntry}>
                
                <FontAwesome5 name={"arrow-circle-up"} size={32} color={Colors.appBlue} style={styles.addEntryButton}/>
            </TouchableOpacity>      
        </View>

    }


    return (
        <View style={styles.container}>


            <View style={styles.title}>
                <TextInput style={[styles.text]}>{entryEdit.title}</TextInput>
                

            </View>

            <GratitudeList gratitudeData={entryEdit.entries}
                action={startEntry}/>
            <Modal 
   
                animationInTiming={1}
                useNativeDriver={true}
                animationOut={"fadeOut"}
                animationOutTiming={100}
                backdropTransitionInTiming={100}
                backdropTransitionOutTiming={100}
                backdropOpacity={.2}
                isVisible={rowEdit&&true}
                onModalShow={()=>{
                    if(Platform.OS==='android'){
                        setTimeout(()=>textInput.current.focus(), 200)
                        props.dispatchHideEditor();
                    }else{
                        textInput.current.focus()
                    }
                }}
                onBackdropPress={()=>{

                    Keyboard.dismiss();

                } }
                style={{margin: 0, justifyContent: 'flex-end' }}>
                    
      
                    {textEntry}

              
          </Modal>

        </View>
    )
}

GratitudeEditorScreen = connect(
    function mapStateToProps(state, ownProps) {
        log.info(`DetailsScreen connect observed redux change, detail ${state.general.meetingDetail}`)

        return {

        };
    },
    function mapDispatchToProps(dispatch) {
        return {

            dispatchShowEditor: (data) => {
                dispatch(async (d1) => {
                    return new Promise(resolve => {

                        dispatch({ type: "SHOW_EDITOR" })
                        resolve();
                    })
                })
            },
            dispatchHideEditor: (data) => {
                dispatch(async (d1) => {
                    return new Promise(resolve => {

                        dispatch({ type: "HIDE_EDITOR" })
                        resolve();
                    })
                })
            },

            dispatchRegisterSubmenu: (data) => {
                log.info("registering gratitudeEditor submenu")
                dispatch({ type: "REGISTER_SUBMENU", data })
            }

        }
    },

)(GratitudeEditorScreen)


function GratitudeList({ gratitudeData, action, style = {} }) {

  
    const renderCallback = useCallback(({ item, index }, rowMap) => {
      //renderBackRow({data, rowMaps, props}),[])
      log.info(`item is :  index is: ${index} rowMap is ${rowMap} `)
      return (
        <TouchableWithoutFeedback key={index} onPress={()=>action(index, item)} style={styles.gratitudeRow}> 
            <Octicons name="primitive-dot" size={18} color={"black"} style={styles.bullet} />
            <Text style={[styles.keyboardEntry]}>{item}</Text>
        </TouchableWithoutFeedback>
      )
    }, [])

    const keyExtractor = useCallback((item, index) =>{

        return index
    }, [])

    return (
        <FlatList
            data={gratitudeData}
            renderItem={renderCallback}
            keyExtra

            
        />
    )
  
  }
  
  const GratitudeSaveButton = connect(
    function mapStateToProps(state, ownProps) {
        const {email,} = state.general;
  
        return {email}
    },
    function mapDispatchToProps(dispatch) {
        return {
            dispatchBanner:  (data)=> {
              dispatch({ type:"SET_BANNER", banner: data})
            },
            dispatchHideEditor: (data)=>{
                dispatch({type: "HIDE_EDITOR"})
            },
            dispatchAddGratitude: (data)=>{
                dispatch({type: "ADD_GRATITUDE", data})
            }
        }
    })(_GratitudeSaveButton)

const styles = StyleSheet.create({
    
    text: {
        flexWrap: 'wrap',
        fontSize: 18 * Layout.scale.width,
        fontFamily: 'opensans-bold'
        
    },
    title:{
        paddingHorizontal: 10 * Layout.scale.width,
        borderBottomColor: 'gainsboro',
        borderBottomWidth: .3,
        paddingVertical: 7* Layout.scale.width,
        justifyContent: 'center',
    },

    container: {
        flex: 1, 
        backgroundColor: '#FFF' ,

        
    },
    gratitudeRow:{ 
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 5*Layout.scale.width
    },
    gratitudeList:{
        paddingHorizontal: 10*Layout.scale.width,
    },
    addEntryButton:{
        marginRight: -3,
    },
    deleteEntryButton:{
        marginBottom: -3, 
        paddingRight: 8
    },
    bullet: {
        flex: .8,
    },
    keyboardEntryContainer:{
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        flexDirection: 'row',
        backgroundColor: 'white',
        paddingHorizontal: 10 * Layout.scale.width,
        paddingVertical: 3 * Layout.scale.width,
    },
    keyboardView:{
        alignItems: 'flex-end'
    },
    keyboardEntry: {
        flex: 10,
        
        margin: 0,
        flexWrap: 'wrap',
        fontSize: 18,
        fontFamily: 'opensans',
        paddingBottom: 5,
    }

});

export default GratitudeEditorScreen;