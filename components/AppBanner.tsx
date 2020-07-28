
import React, { useState, useEffect, useCallback, memo, useRef } from 'react';
import { Text, View , StyleSheet, Animated, Easing} from 'react-native';
import { connect } from 'react-redux';
import * as Animatable from 'react-native-animatable';
import {useLayout} from '../hooks/useLayout';
import {useColors} from '../hooks/useColors';
import log from '../util/Logging' 
function AppBanner(props){
    const [visible, setVisible] = useState(false)
    const [offset, setOffset] = useState(new Animated.Value(-100))
    const layout = useLayout()
    const extra = Platform.OS ==="ios"?0: 15;
    const [animation, setAnimation] = useState({from: {opacity: 0, translateY: 0}, to: {opacity: 0, translateY: -100}})
    const {colors: Colors} = useColors()
    const transform = {
        transform: [{ translateY: offset }]
    }
    
    

    const styles = StyleSheet.flatten({
        container: {
          flex: 1, 
          width: '100%',
          justifyContent: 'flex-end',
          backgroundColor: Colors.appBlue,
          padding: 5 * layout.scale.height,
          position: 'absolute',
          zIndex: 5,
          top: 0,
          height: layout.belowHeader + extra,
          left: 0,
        },
        warnContainer:{
            backgroundColor: Colors.appRed,
        },
        bannerText: {
            color: Colors.primaryContrast,
            fontSize: 18 * layout.scale.width,
        }
    })

    function hold(){
        log.info(`step 2`)
     /*   Animated.timing(offset, {
            toValue: layout.belowHeader,
            useNativeDriver: true,
            duration: 1800,
            easing: Easing.inOut(Easing.sin),
        }).start(()=> slideOut()) */
        
    }
    function slideOut(){
        log.info(`step 3`)
        setAnimation('fadeOutUp');

        /*Animated.timing(offset, {
            toValue: -100,
            useNativeDriver: true,
            duration: 400,
            easing: Easing.inOut(Easing.sin),
        }).start(()=>cleanUp()) */
        
    }

    function cleanUp(){
        props.dispatchSetBanner();
    }

    function slideIn(){
        log.info(`step 1`)
       /* Animated.timing(offset, {
            toValue: layout.belowHeader,
            useNativeDriver: true,
            duration: 400,
            easing: Easing.inOut(Easing.sin),
        }).start(()=> hold()) */
        setAnimation('fadeInDown');
        setTimeout(()=>slideOut(), 2000)
    }

    useEffect(()=>{
        if(props.banner && true){
            log.info(`starting banner seque3nce`)
            slideIn()
        }

    }, [props.banner]) 

    /*    <Animated.View style={[styles.container, transform, props.banner && props.banner.status == 'info' && styles.infoContainer]}>
        <Text style={[styles.bannerText, ]}>{props.banner && props.banner.message}</Text>
        
    </Animated.View>

    */
    return (
        <Animatable.View animation={animation} duration={300} useNativeDriver style={[styles.container, props.banner && props.banner.status != 'info' && styles.warnContainer]}>
            <Text style={[styles.bannerText, ]}>{props.banner && props.banner.message}</Text>
        </Animatable.View>
    
    )
    
}

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