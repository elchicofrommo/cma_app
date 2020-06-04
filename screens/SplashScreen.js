
import  React,  {useState, useEffect} from 'react';
import {  StyleSheet, View, Text, Animated } from 'react-native';
import Logo from '../assets/images/LogoComponent'
import LogoNoAnimation from '../assets/images/LogoComponetNoAnimation'
import WhiteLogo from '../assets/images/whiteLogo2.png'

export default function SplashScreen(props ){

  console.log(`rendering SplashScreen`)
  const component = Platform.OS === 'ios' ? <Logo height={"40%"} style={{marginLeft: 20}} />: 
    <LogoNoAnimation height={"40%"} style={{marginBottom: 20}} />
    const timeout = Platform.OS === 'ios'? 3000: 0;
    const duration = Platform.OS === 'ios'? 1000: 3000;

    const [opacity, setOpacity] = useState(new Animated.Value(0))
    const animation = Animated.timing(
        opacity, 
        {
            toValue: 1,
            duration: duration
        }
    );
    React.useEffect(()=>{
        setTimeout(animation.start, timeout)
    }, []);

  
  return (
    <View style={styles.container}>
        {component}
        <Animated.View  style={{opacity: opacity, }}>
            <View style={styles.labelView}>
                <Text style={styles.topLine}>Crystal Meth </Text>
                <Text style={styles.bottomLine}>Anonymous</Text>
            </View>
        </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1f6e21',
    justifyContent: "center"
  },
  labelView: {
      justifyContent: "center",
      alignContent: "center",
      marginTop: -40,
  },
  topLine: {
    fontFamily: 'merriweather',
    fontSize: 50,
    color: 'white',
    lineHeight: 65,
    textAlign: 'center',
  },
  bottomLine: {
    fontFamily: 'merriweather',
    fontSize: 50,
    color: 'white',
    lineHeight: 65,
    textAlign: 'center',
    marginLeft: 40,
    marginTop: -15,
  },
});
