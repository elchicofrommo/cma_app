
import React, { useState, useEffect} from 'react';
import { StyleSheet,  Animated, Easing,  Platform, Keyboard } from 'react-native';
import {  TouchableOpacity } from 'react-native-gesture-handler';

import { connect } from 'react-redux';
import {useLayout} from "../hooks/useLayout"
import {useColors} from "../hooks/useColors"
import { AntDesign } from '@expo/vector-icons';
import log from '../util/Logging'
const PostEditorMenu = (props) => {
    log.info(`render DetailsMenu `)
    const [offset, setOffset] = useState(new Animated.Value(104))
    const Layout = useLayout();
    const {colors: Colors} = useColors();
    const [visible, setVisible] = useState(true)

    function hideMenu(){
        setVisible(false)
    }

    function showMenu(){
        setVisible(true)
    }

    useEffect(()=>{
        const keyboardShow = Keyboard.addListener('keyboardDidShow', hideMenu);
        const keyboardHide = Keyboard.addListener('keyboardDidHide', showMenu);

        return  ()=>{
        keyboardShow.remove();
        keyboardHide.remove();
        }
    }, [])

   if (props.showEditor) {
        log.info(`going to 0`)
        Animated.timing(offset, {
            toValue: 0,
            useNativeDriver: true,
            duration: 200,
            easing: Easing.inOut(Easing.sin),
        }).start();
    } else {
        log.info(`going to 100`)
        Animated.timing(offset, {
            toValue: 104,
            useNativeDriver: true,
            duration: 200,
            easing: Easing.inOut(Easing.sin),
        }).start();
    }

    
    const transform = {
        transform: [{ translateY: offset }]
    }

    const display = {
        display: visible? "flex":'none'
    }

        let button = undefined;

        const buttonSize = 45 * Layout.scale.width

        return (
            <Animated.View style={[styles.menuStyle, transform]}>
                <TouchableOpacity onPress={ props.callback} >
                    <AntDesign name="pluscircle" size={54} color={Colors.primary1} />
                </TouchableOpacity>

            </Animated.View>
        )

}

const topPadding = Platform.OS == 'ios' ? 19 : 8

const styles = StyleSheet.create({
    menuStyle: {
        position: 'absolute',
        top: 0,
        left: 0,
        marginTop: -20,
        paddingTop: topPadding,

        paddingHorizontal: 40,
        zIndex: 200,
        height: 100,
        backgroundColor: 'white',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    icon: {

    },
    minus: {
        color: '#f36468'
    },
    plus: {
        color: 'green'
    },
    directions: {
        color: '#0273b1'
    }

})


export default connect(
    function mapStateToProps(state, ownProps) {
        log.info(`PostEditorMenu connect observed redux change, detail ${state.general.meetingDetail}`)

        return {
            showEditor: state.general.showEditor,
        };
    },
    function mapDispatchToProps(dispatch) {
        return {
            dispatchAddMeeting: (data) => {
                log.info("dispatching add post entry " + data)
                dispatch({ type: "ADD_ENTRY", data })
            },

            dispatchSetBanner: (message)=>{
                dispatch({type: "SET_BANNER", banner: message})
            }
        }
    },

)(PostEditorMenu)
