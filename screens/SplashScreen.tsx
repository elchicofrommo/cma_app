
import  React,  {useState, } from 'react';
import {  StyleSheet, View, Text, Animated, Easing, Platform } from 'react-native';
import Logo from '../assets/images/LogoComponent'
import LogoNoAnimation from '../assets/images/LogoComponetNoAnimation'

import {useColors} from '../hooks/useColors'
import {useLayout} from '../hooks/useLayout'
import log from "../util/Logging"
export default function SplashScreen({navigation, route, ...props} ){
  const styles = useStyles();
  const Layout = useLayout();
  log.info(`rendering SplashScreen`)
  const component = Platform.OS === 'ios' ? <Logo height={"30%"} style={{marginLeft: 20}} />: 
    <LogoNoAnimation height={"30%"} style={{marginBottom: 20}} />
    const timeout = Platform.OS === 'ios'? 3000: 0;
    const duration = Platform.OS === 'ios'? 1000: 3000;

    const [opacity, setOpacity] = useState(new Animated.Value(0))
    const [offset, setOffset] = useState(new Animated.Value(0))
    const animation = Animated.timing(
        opacity, 
        {
            toValue: 1,
            duration: duration
        }
    );
    const disappear = Animated.timing(
      offset,
      {
        toValue: -Layout.window.height,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.linear),
        duration: 300
      }
    );
    React.useEffect(()=>{
        setTimeout( ()=>{
          animation.start(()=>{
            navigation.navigate('home')
          })
        }, timeout)
    }, []);

    const transform = {
      transform: [{ translateY: offset }],
    };
  return (
    <Animated.View style={styles.container}>
        {component}
        <Animated.View  style={{opacity: opacity, }}>
            <View style={styles.labelView}>
                <Text style={styles.topLine}>Crystal Meth </Text>
                <Text style={styles.bottomLine}>Anonymous</Text>
            </View>
        </Animated.View>
    </Animated.View>
  )
}
function useStyles(){
  const {colors: Colors} = useColors();
  const Layout = useLayout();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.primary,
      justifyContent: "center",
      position: 'absolute',
      top: 0,
      left: 0,
      height: Layout.window.height,
      width: Layout.window.width
      
    },
    labelView: {
        justifyContent: "center",
        alignContent: "center",
  
    },
    topLine: {
      fontFamily: 'merriweather',
      fontSize: 50,
      color: Colors.primaryContrast,
      lineHeight: 65,
      textAlign: 'center',
    },
    bottomLine: {
      fontFamily: 'merriweather',
      fontSize: 50,
      color: Colors.primaryContrast,
      lineHeight: 65,
      textAlign: 'center',
      marginLeft: 40,
      marginTop: -15,
    },
  });
  return styles;
}

