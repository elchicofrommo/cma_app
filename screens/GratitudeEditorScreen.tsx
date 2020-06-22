
import React, { useState, useEffect, useCallback, memo, useRef } from 'react';
import {
    Image, Platform, StyleSheet, Text, TouchableOpacity,
    TextInput, View, Button, Dimensions, Keyboard, Linking, FlatList, KeyboardAvoidingView, Animated, Easing, StatusBar
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { connect } from 'react-redux';


import EditorMenu from '../navigation/GraditudeEditorMenu'
import { useFocusEffect } from '@react-navigation/native';
import { HeaderStyleInterpolators, HeaderBackButton } from '@react-navigation/stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCertificate } from '@fortawesome/free-solid-svg-icons';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';

import moment from 'moment'
import { TouchableWithoutFeedback, ScrollView } from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import KeyboardStickyView from "rn-keyboard-sticky-view"
import { FontAwesome5, Entypo, Octicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { DataStore, Predicates } from "@aws-amplify/datastore";
import { Gratitude , GratitudeEntry , GratitudeComment, GratitudeLike } from "../models/index";
import { enableNetworkProviderAsync } from 'expo-location';



const defaultEntry = {
    date: new Date(),
    title: moment().format('MMMM Do YYYY h:MM a'),
    entries: []
}

function GratitudeEditorScreen({ route, navigation, entry=defaultEntry, ...props }) {

    const [entryEdit, setEntryEdit] = useState(entry);
    const [editCount, setEditCount] = useState(0)
    const defaultRowEntry = {index: -1, text:""}
    const [rowEdit, setRowEdit] = useState(defaultRowEntry);
    const textInput = useRef(null);
    const [keyboardHeight, setKeyboardHeight] = useState(new Animated.Value(-30))
    const [opacity, setOpacity] = useState(new Animated.Value(0))


    

    
    function startEntry(index=-1, text:string=""){
        setRowEdit({index, text});
        textInput.current.focus();
    }

    function showKeyboard(event){
        console.log(`showing keyboard height is ${event.endCoordinates.height}`)

            Animated.stagger( event.duration , 
                [Animated.timing(keyboardHeight, {
                    duration: event.duration, 
                    useNativeDriver: true,
                    toValue: - event.endCoordinates.height ,
                    easing: Easing.inOut(Easing.linear),
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
        console.log('hide keybaord')
        if(Platform.OS==='android'){
            props.dispatchShowEditor();
            setRowEdit(defaultRowEntry)
        }else{
            Animated.parallel([
                Animated.timing(keyboardHeight, {
                    duration: event.duration,
                    useNativeDriver: true, 
                    toValue: -30,
                    easing: Easing.inOut(Easing.linear),
                }),
                Animated.timing(opacity, {
                    duration: event.duration/7 * 5, 
                    useNativeDriver: true,
                    toValue: 0 ,
                    easing: Easing.out(Easing.exp),
                })], {stopTogether: false}
                )
            .start(()=>{setRowEdit(defaultRowEntry)})
        }
        
    }


    useEffect(() => {
        console.log(`#####use effect in editor screen, entry is ${JSON.stringify(entry, null, 2)}`)
        let newEntry = entry;
        if(entry===defaultEntry){
            const date = new Date()
            newEntry = {
                date: date,
                title: moment().format('MMMM Do YYYY h:mm a'),
                entries: []
            }
        }
        console.log(`#####use effect in editor screen, entry is ${JSON.stringify(newEntry, null, 2)}`)
        
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
        
        console.log("committing entry")
        setEditCount((editCount)=>editCount + 1)
        setRowEdit({index: -1, text:""});
        // if it is -2 then the title is being edited
        if(rowEdit.index == -2){
            setEntryEdit((entryEdit)=>{entryEdit.title = rowEdit.text; return entryEdit})
            return;
        }
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
        setEditCount((editCount)=>editCount + 1)
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

    }

    let textEntry = undefined;

        
    if(Platform.OS === "ios"){
        console.log(`so the platform is ios??`)
        textEntry =                     
        <Animated.View style={[styles.keyboardEntryContainer, transform]}>
            <View style={styles.keyboardEntryBorder}>
            <TextInput
                ref={textInput}
                value={rowEdit ? rowEdit.text: ""}
                keyboardType={"twitter"}
                placeholder="Write something..."
                style={[styles.keyboardEntry, ] }
                multiline={true}
                onChangeText={(value)=>setRowEdit({index: rowEdit.index, text: value})}
            /></View>
             <TouchableOpacity style={styles.addEntryButton} onPress={rowEdit &&rowEdit.index > -1?deleteEntry: undefined}>
                <MaterialCommunityIcons name={"delete-circle"} size={38} color={rowEdit &&rowEdit.index > -1?Colors.primary:'gray'} style={styles.deleteEntryButton}/>
            </TouchableOpacity>  
            <TouchableOpacity style={styles.addEntryButton} onPress={rowEdit && rowEdit.text != "" ? commitEntry: undefined}>
                
                <FontAwesome5 name={"arrow-circle-up"} size={32} color={rowEdit && rowEdit.text != "" ? Colors.appBlue: 'gray'} style={styles.addEntryButton}/>
            </TouchableOpacity>
        </Animated.View>
    }else{
        console.log('platform is android')
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
                <MaterialCommunityIcons name={"delete-circle"} size={38} color={rowEdit &&rowEdit.index > -1?Colors.primary:'gray'} style={styles.deleteEntryButton}/>
            </TouchableOpacity>  
            <TouchableOpacity style={styles.addEntryButton} onPress={commitEntry}>
                
                <FontAwesome5 name={"arrow-circle-up"} size={32} color={Colors.appBlue} style={styles.addEntryButton}/>
            </TouchableOpacity>      
        </View>

    }


    return (
        <View style={styles.container}>


            <TouchableWithoutFeedback style={styles.title} onPress={()=>startEntry(-2,  entryEdit.title)}>
                <Text style={[styles.text]}>{entryEdit.title} </Text>
                
            </TouchableWithoutFeedback>
            
            <GratitudeList gratitudeData={entryEdit.entries}
                action={startEntry} editCount={editCount}/>
            {textEntry}
           

        </View>
    )
}
/*
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
                        console.log("focusing on text")
                        textInput.current.focus()
                    }
                }}
                onBackdropPress={()=>{

                    Keyboard.dismiss();

                } }
                style={{margin: 0, justifyContent: 'flex-end' }}>
                    
      
                    

              
          </Modal>
*/
GratitudeEditorScreen = connect(
    function mapStateToProps(state, ownProps) {
        console.log(`DetailsScreen connect observed redux change, detail ${state.general.meetingDetail}`)

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
                console.log("registering gratitudeEditor submenu")
                dispatch({ type: "REGISTER_SUBMENU", data })
            }

        }
    },

)(GratitudeEditorScreen)

function listCompare(prevProps, nextProps){
    return prevProps.editCount == nextProps.editCount
}


const GratitudeList = memo(({ gratitudeData, action })=> {

    console.log(`erndering grattitudelist ....`)
  
    const renderCallback = ({ item, index }, rowMap) => {
      //renderBackRow({data, rowMaps, props}),[])
      console.log(`item is :  index is: ${index} rowMap is ${rowMap} `)
      return (
        <TouchableWithoutFeedback key={index} onPress={()=>action(index, item)} style={styles.gratitudeRow}> 
            <Octicons name="primitive-dot" size={18} color={"black"} style={styles.bullet} />
            <Text style={[styles.keyboardEntry]}>{item}</Text>
        </TouchableWithoutFeedback>
      )
    }

    const keyExtractor = (item, index) =>{
        console.log("nre key extractor ")
        return index
    }

    return (
        
        <FlatList
            data={gratitudeData}
            renderItem={renderCallback}
            keyExtractor={keyExtractor}
            initialNumToRender={5}
            keyboardShouldPersistTaps={'always'}
            onScroll={(event)=>{Keyboard.dismiss()}}

            ListFooterComponent={<TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()} style={{ height: Layout.window.height}}/>}
            ListEmptyComponent={<Text style={styles.keyboardEntry}>Add your first entry</Text>}
            contentContainerStyle={styles.gratitudeList} />


    )
  }, listCompare)



function _GratitudeSaveButton({ navigation, entryEdit, email, ...props }) {
    
    async function saveGratitude(){

        if(entryEdit.entries.length == 0){
            console.log('nothign saved cuz no changes')
            return;
        }
      console.log("$$$$$$$$$$$$$$ saving gratitude 1")
      console.log(`gratitudeEntry is: ${JSON.stringify(entryEdit, null ,2)}`)
      StatusBar.setBarStyle("light-content", true)
      //
      
    

    
      try{
          const gratEntries = new Array<GratitudeEntry>();

          entryEdit.entries.forEach((item, index)=>{
              const entry = new GratitudeEntry({
                  index: index, 
                  content: item,
                  comments: new Array<GratitudeComment>(),
                  likes: new Array<GratitudeLike>()
              })

              entry.likes.push(new GratitudeLike({user: 'mario', created: new Date().getTime()}))
              gratEntries.push(entry)
          })
        
          const comment = new GratitudeComment({user: "Mario", created: new Date().getTime(), text: "comment 1"})
          const grat = new Gratitude({
            email: email,
            title: entryEdit.title,
            time: entryEdit.date.getTime(),
            entries: gratEntries,
            comments: new Array<GratitudeComment>()
          }) 
          grat.comments.push(comment);

        console.log("saving gratitude 2")
        const result = await DataStore.save(grat)
        entryEdit.id = result.id;
        entryEdit
        props.dispatchBanner({message: "Gratitude Saved", status: 'info'})
        props.dispatchAddGratitude(entryEdit)
        

      }catch(err){
        console.log(`error is  ${err}`)
        props.dispatchBanner({message: "Your data was not saved because your profile is incomplete."})
      }
    }
    return (
        <HeaderBackButton  label={"Save"} tintColor={Colors.primary}onPress={(event) => {
            props.dispatchHideEditor()
            navigation.goBack()
            saveGratitude()
        }}
            
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
        borderTopWidth: .3,
        borderTopColor: 'gray'

    },
    keyboardView:{
        alignItems: 'flex-end'
    },
    keyboardEntryBorder:{
        borderRadius: 18,
        borderWidth: 1,
        borderColor: 'gray',
        marginRight: 5,
        marginLeft: -5,
        paddingHorizontal: 8,
        paddingVertical: 0,
        flex: 10,
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