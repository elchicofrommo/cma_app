
import React, { useState, useEffect, useCallback, memo } from 'react';
import { Text, View , StyleSheet, Animated, Easing} from 'react-native';
import { connect } from 'react-redux';
import { Banner } from 'react-native-paper';
import { faHandHolding } from '@fortawesome/free-solid-svg-icons';
import Layout from '../constants/Layout';
import Colors from '../constants/Colors';
import log from '../util/Logging' 
function AppBanner(props){
    const [visible, setVisible] = useState(false)
    const [offset, setOffset] = useState(new Animated.Value(-100))
    const transform = {
        transform: [{ translateY: offset }]
    }

    function hold(){
        log.info(`step 2`)
        Animated.timing(offset, {
            toValue: 0,
            useNativeDriver: true,
            duration: 1800,
            easing: Easing.inOut(Easing.sin),
        }).start(()=> slideOut())
    }
    function slideOut(){
        log.info(`step 3`)
        Animated.timing(offset, {
            toValue: -100,
            useNativeDriver: true,
            duration: 400,
            easing: Easing.inOut(Easing.sin),
        }).start(()=>cleanUp())
        
    }

    function cleanUp(){
        props.dispatchSetBanner();
    }

    function slideIn(){
        log.info(`step 1`)
        Animated.timing(offset, {
            toValue: 0,
            useNativeDriver: true,
            duration: 400,
            easing: Easing.inOut(Easing.sin),
        }).start(()=> hold())
    }

    useEffect(()=>{
        if(props.banner && true){
            log.info(`starting banner seque3nce`)
            slideIn()
        }

    }, [props.banner])
    return (
    <Animated.View style={[styles.container, transform, props.banner && props.banner.status == 'info' && styles.infoContainer]}>
        <Text style={[styles.bannerText, ]}>{props.banner && props.banner.message}</Text>
        
    </Animated.View>
    )
}
const styles = StyleSheet.create({
    container: {
      flex: 1, 
      width: '100%',
      backgroundColor: Colors.appRed,
      padding: 5 * Layout.scale.width,
      position: 'absolute',
      zIndex: 5,
      top: 0,
      left: 0,
    },
    infoContainer:{
        backgroundColor: Colors.appBlue,
    },
    bannerText: {
        color: 'white',
        fontSize: 15 * Layout.scale.width,
    }
})
export default connect(
    function mapStateToProps(state){
        log.info(`inside AppBanner observe state change, the banner is ${JSON.stringify(state.general.banner)}`)
        const {banner} = state.general;
        return { banner: banner}
    },
    function mapDispatchToProps(dispatch){
        return{
            dispatchSetBanner:  ()=> dispatch({ type:"SET_BANNER", banner: undefined})
        }
    }
)(AppBanner)