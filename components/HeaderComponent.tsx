
import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, Button, Dimensions, Linking, Animated } from 'react-native';

import Svg, {
  Circle,
  Ellipse,
  G,

  TSpan,
  TextPath,
  Path,
  Polygon,
  Polyline,
  Line,
  Rect,
  Use,

  Symbol,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  ClipPath,
  Pattern,
  Mask,
} from 'react-native-svg';

import log from '../util/Logging'
import { BoxShadow } from 'react-native-shadow'

import AppBanner from './AppBanner'
import { useLayout } from '../hooks/useLayout'
import { useColors } from '../hooks/useColors';
export default function HeaderComponent({ scene, previous, navigation, title, rightIcon, rightIconNavigation }:
  { scene: any, previous: any, navigation: any, title: string, rightIcon?: any, rightIconNavigation?: string }) {

  const { colors: Colors } = useColors();
  const styles = useStyles()
  let _rightIcon = undefined;
  const layout = useLayout();

  if (rightIcon)
    _rightIcon =
      <TouchableOpacity onPress={(event) => {
        requestAnimationFrame(() => {

            navigation.navigate(rightIconNavigation)
        });
      }}
        style={{
          width: 30 * layout.scale.height, height: 30 * layout.scale.height, backgroundColor: Colors.primary, borderColor: '#FFF',
          borderWidth: 2, borderRadius: 17 * layout.scale.height, justifyContent: 'center', alignItems: 'center',
          marginTop: 5 * layout.scale.height,
        }}>
        {rightIcon}
      </TouchableOpacity>


  const _header =
    <View style={{position: 'relative', zIndex: 100}} >
     

      <Svg height={(layout.headerHeight + layout.safeBottom) + (layout.scale.height * 20) +1} width={layout.window.width}
        style={{ position: 'absolute', top: 0, left: 0, zIndex: 5, }}>
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={Colors.header1} stopOpacity="1" />
            <Stop offset="1" stopColor={Colors.header2} stopOpacity="1" />
          </LinearGradient>
          <RadialGradient
            id="shadow"
            cx={layout.window.width / 2}
            cy={layout.headerHeight + layout.safeBottom+1}
            rx={layout.window.width / 1.8}
            ry={layout.scale.height * 20} 
            fx={layout.window.width/2}
            fy={layout.headerHeight + layout.safeBottom+1} 
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="90%" stopColor="black" stopOpacity=".2" />
            <Stop offset="100%" stopColor="black" stopOpacity=".08" />
          </RadialGradient>
        </Defs>
        <Ellipse cx={layout.window.width / 2} cy={layout.headerHeight + layout.safeBottom +1}
          rx={layout.window.width / 1.8} ry={layout.scale.height * 20} fill="url(#shadow)"
        />
        <Ellipse cx={layout.window.width / 2} cy={layout.headerHeight + layout.safeBottom - 5}
          rx={layout.window.width / 1.8} ry={layout.scale.height * 20} fill="url(#grad)"

        />

        <Rect x={0} y={0} width={layout.window.width}
          height={layout.headerHeight + layout.safeBottom} fill="url(#grad)" />

      </Svg>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', position: 'relative', top: layout.safeTop - 5, left: 0, right: 0, zIndex: 10, paddingHorizontal: 10 * layout.scale.width }}>
        <Text style={{
          color: 'white', fontFamily: 'opensans', fontSize: 28 * layout.scale.height,
        }}>{title}</Text>
        {_rightIcon}
      </View>
    </View>

  if (Platform.OS === 'ios')
    return (
      <View>
        <AppBanner />
        {_header}
      </View>
    )
  else {
    return (
      <View style={{}}>
        <AppBanner />
        
        <View style={{marginLeft: 0}}>
          {_header}
        </View>

      </View>
    )
  }


}

let shadow = Platform.OS === 'ios' ? {
  shadowColor: 'black',
  shadowOffset: { width: 6, height: 6 },
  shadowOpacity: .3,
  shadowRadius: 10,
} : {
    elevation: 3
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

