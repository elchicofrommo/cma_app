
import * as React from 'react';
import Svg, { Circle, G, Path, Rect } from "react-native-svg";
import { AnimatedSVGPath } from 'react-native-svg-animations'

export default function Logo(props) {
  
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
      >


        <AnimatedSVGPath
            duration={3000}
            strokeWidth={5}
            strokeColor={"white"}
            d={circleD}
            length={1319.11}
            loop={false}
            state={0}
            strokeLinecap={"square"}
            strokeLinejoin={"bevel"}
          />
        
        <G stroke="white" fill="none" strokeWidth={6}>

          <AnimatedSVGPath
            duration={2000}
            strokeWidth={5}
            strokeColor={"white"}
            strokeLinecap={"round"}
            strokeLinejoin={"bevel"}
            d={`M 282.50,146.00
            C 241.27,145.51 216.33,145.33 164.76,145.95
              193.00,95.33 196.71,84.62 222.00,45.00
              233.38,63.95 223.00,46.00 247.46,84.68M -173.00,-3.00`}
            length={468.50}
            delay={1000}
            state={0}
            loop={false}
          />

          <AnimatedSVGPath
            duration={2000}
            strokeWidth={5}
            strokeColor={"white"}
            d={`M 348.62,267.75
            C 330.00,236.00 312.50,204.50 285.50,156.00
              260.00,181.00 247.00,194.50 222.00,221.00
              201.50,200.00 183.25,181.25 159.87,157.50
              142.00,188.00 129.00,211.00 96.37,267.00M 222.00,45.50`}
            length={534.52}
            delay={1000}
            loop={false}
            state={0}
            strokeLinecap={"round"}
            strokeLinejoin={""}

          />
          <AnimatedSVGPath
            duration={2000}
            strokeWidth={5}
            strokeLinecap={"round"}
            strokeLinejoin={""}
            strokeColor={"white"}
            d={`M 379.50,325.50
            C 379.50,325.50 287.03,267.78 287.03,267.78
              287.03,267.78 237.49,238.08 222.00,229.00
              210.06,235.93 156.75,267.89 156.75,267.89
              156.75,267.89 84.03,311.73 84.03,311.73
              84.03,311.73 65.75,322.75 65.75,322.75M 287.00,268.00
            C 287.00,268.00 157.00,268.00 157.00,268.00`}
            length={380.61}
            delay={1000}
            loop={false}
            state={0}

          />

        </G>
      </Svg>
    )
  }

  function describeArc(x, y, radius, startAngle, endAngle){

    var start = polarToCartesian(x, y, radius, endAngle);
    var end = polarToCartesian(x, y, radius, startAngle);

    var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    var d = [
        "M", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");

    return d;
}

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

  return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
  };
}