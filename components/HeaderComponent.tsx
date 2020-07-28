
import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, Button, Dimensions, Linking, Animated } from 'react-native';


import log from '../util/Logging'
import { BoxShadow } from 'react-native-shadow'


import { useLayout} from '../hooks/useLayout'
import { useColors } from '../hooks/useColors';
export default function HeaderComponent({ scene, previous, navigation, title, rightIcon, rightIconNavigation }:
  { scene: any, previous: any, navigation: any, title: string, rightIcon?: any, rightIconNavigation?: string }) {

  const { colors: Colors } = useColors();
  const styles = useStyles()
  let _rightIcon = undefined;
  const layout = useLayout();

  if (rightIcon)
    _rightIcon =
      <TouchableOpacity onPress={

        () => {
          navigation.navigate(rightIconNavigation)
        }
      }
        style={{
          width: 30 * layout.scale.height, height: 30 * layout.scale.height, backgroundColor: Colors.primary, borderColor: '#FFF',
          borderWidth: 2, borderRadius: 17 * layout.scale.height, justifyContent: 'center', alignItems: 'center',
          marginTop: 5 * layout.scale.height
        }}>
        {rightIcon}
      </TouchableOpacity>

  const shadowOpt = {
    width: layout.window.width * .9,
    height: layout.headerHeight,
    color: "#000000",
    border: 6,
    radius: 10,
    opacity: 0.2,
    x: 2,
    y: 2,
    style: { alignSelf: 'center', marginTop: layout.safeTop }
  }
  const _header = <View style={[{
    borderRadius: 10, height: layout.headerHeight, width: layout.window.width * .9, backgroundColor: '#00000088',
    position: 'relative', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 8 * layout.scale.width
  }, Platform.OS==='ios' && {marginTop: layout.safeTop,}]}>
    <Text style={{
      color: 'white', fontFamily: 'opensans', fontSize: 28 * layout.scale.height,  
    }}>{title}</Text>
    {_rightIcon}
  </View>

  if (Platform.OS === 'ios')
    return (
       <View>

          {_header}
       </View> 
    )
  else {
    return (
      <BoxShadow setting={shadowOpt}>

        {_header}

      </BoxShadow>
    )
  }


}

let shadow = Platform.OS === 'ios' ? {
  shadowColor: 'black',
  shadowOffset: { width: 6, height: 6 },
  shadowOpacity: .3,
  shadowRadius: 10,
} : {
  }

function useStyles() {
  const { colors: Colors } = useColors();
  const layout = useLayout();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white'
    },
    meetingSection: {
      flex: 20,

    },
    readerSection: {
      flex: 10.7 * layout.scale.width * layout.ratio,
      marginBottom: 15,
    },
    section: {
      paddingHorizontal: 10 * layout.scale.width,
      paddingTop: 10 * layout.scale.width,
    },
    sectionHeading: {
      fontSize: 18 * layout.scale.width,
      paddingLeft: 10 * layout.scale.width,
      paddingVertical: 8,
      width: '100%',
      fontFamily: 'opensans',
      color: Colors.primaryContrast,

    },
    meetings: {
      height: '30%',
      borderBottomWidth: 3,

    },
    icon: {
      color: 'gray'
    },
    gratitude: {
      height: '30%',
      borderColor: '#fff',

    },
    contentContainer: {
      flex: 1,
      justifyContent: "flex-start"
    },
    welcomeContainer: {
      alignItems: 'center',
      marginTop: 10,
      marginBottom: 20,
    },

    getStartedContainer: {
      marginHorizontal: 20,
    },
    homeScreenFilename: {
      marginVertical: 7,
    },
    codeHighlightText: {
      color: 'rgba(96,100,109, 0.8)',
    },


    helpContainer: {
      alignItems: 'center',
    },
    helpLink: {
      paddingVertical: 15,
    },
    directions: {
      paddingVertical: 5 * layout.scale.width,
      color: 'blue',
    },


  });
  return styles
}

