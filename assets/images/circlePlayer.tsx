
import * as React from 'react';
import Svg, { Circle, G, Path, Rect } from "react-native-svg";
import { AnimatedSVGPath, States } from 'react-native-svg-animations'
import { PlaybackMixin } from 'expo-av/build/AV';
import Colors from '../../constants/Colors'
export enum AnimationStates {
  PLAY,
  PAUSE,
  RESUME
}
export function CircleStart(props) {
  
  const circleD = `M 283.00,30.98
  C 307.56,38.61 330.85,50.36 351.00,66.45
    369.42,81.17 385.49,98.94 397.94,119.00
    447.12,198.23 437.22,300.48 374.08,369.00
    358.10,386.35 339.12,401.12 318.00,411.75
    282.96,429.39 253.00,435.45 214.00,435.00
    198.04,434.81 176.30,430.42 161.00,425.72
    140.06,419.28 119.83,409.31 102.00,396.57
    25.00,341.54 -4.35,239.69 30.45,152.00
    51.25,99.59 93.59,57.25 146.00,36.45
    159.20,31.21 176.94,26.28 191.00,24.28
    191.00,24.28 208.00,22.42 208.00,22.42
    229.49,19.81 262.30,24.54 283.00,30.98 Z`
    //describeArc(306.965,226.5, 194, 0, 359.99999)

  return (
    <Svg
      viewBox="0 0 450 450"
      shapeRendering="geometricPrecision"
      textRendering="geometricPrecision"
      {...props}
      style={{transform: [{rotate: '-14deg'}]}}
    >


      <Path

          strokeWidth={30}
          stroke={Colors.primary}
          d={circleD}
          fill={"none"}

          

        />

    </Svg>
  )
}
export function CircleEnd(props) {
  
  const circleD = `M 283.00,30.98
  C 307.56,38.61 330.85,50.36 351.00,66.45
    369.42,81.17 385.49,98.94 397.94,119.00
    447.12,198.23 437.22,300.48 374.08,369.00
    358.10,386.35 339.12,401.12 318.00,411.75
    282.96,429.39 253.00,435.45 214.00,435.00
    198.04,434.81 176.30,430.42 161.00,425.72
    140.06,419.28 119.83,409.31 102.00,396.57
    25.00,341.54 -4.35,239.69 30.45,152.00
    51.25,99.59 93.59,57.25 146.00,36.45
    159.20,31.21 176.94,26.28 191.00,24.28
    191.00,24.28 208.00,22.42 208.00,22.42
    229.49,19.81 262.30,24.54 283.00,30.98 Z`
    //describeArc(306.965,226.5, 194, 0, 359.99999)

  return (
    <Svg
      viewBox="0 0 450 450"
      shapeRendering="geometricPrecision"
      textRendering="geometricPrecision"
      {...props}
      style={{transform: [{rotate: '-14deg'}]}}
    >


      <Path

          strokeWidth={28}
          stroke={Colors.primary}
          d={circleD}
          fill={"none"}

          

        />

    </Svg>
  )
}
export  function AnimatedCircle({percentDone=0, duration=3000, state=AnimationStates.PLAY, ...props}:
  {percentDone: number, duration: number, state: AnimationStates}) {

    const circleD = `M 283.00,30.98
    C 307.56,38.61 330.85,50.36 351.00,66.45
      369.42,81.17 385.49,98.94 397.94,119.00
      447.12,198.23 437.22,300.48 374.08,369.00
      358.10,386.35 339.12,401.12 318.00,411.75
      282.96,429.39 253.00,435.45 214.00,435.00
      198.04,434.81 176.30,430.42 161.00,425.72
      140.06,419.28 119.83,409.31 102.00,396.57
      25.00,341.54 -4.35,239.69 30.45,152.00
      51.25,99.59 93.59,57.25 146.00,36.45
      159.20,31.21 176.94,26.28 191.00,24.28
      191.00,24.28 208.00,22.42 208.00,22.42
      229.49,19.81 262.30,24.54 283.00,30.98 Z`
      //describeArc(306.965,226.5, 194, 0, 359.99999)

    return (
      <Svg
        viewBox="0 0 450 450"
        shapeRendering="geometricPrecision"
        textRendering="geometricPrecision"
        {...props}
        style={{transform: [{rotate: '-18deg'}]}}
      >


        <AnimatedSVGPath
            duration={duration}
            strokeWidth={30}
            strokeColor={"lightgray"}
            fill={"none"}
            d={circleD}
            length={1298.48}
            loop={false}
            reverse={false}
            strokeDashArray={[1298.48, 1298.48]}
            strokeLinecap={"square"}
            strokeLinejoin={"bevel"}
            state={state==AnimationStates.PLAY?0:state==AnimationStates.PAUSE?1:2}

          />

      </Svg>
    )
  }

