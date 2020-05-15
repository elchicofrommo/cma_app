
import * as React from 'react';
import Svg, { Circle, G, Path, Rect } from "react-native-svg";
import { AnimatedSVGPath } from 'react-native-svg-animations'

export default function Logo(props) {
  
    const circleD = describeArc(306.965,226.5, 194, 0, 359.99999)

    return (
      <Svg
        viewBox="0 0 640 480"
        shapeRendering="geometricPrecision"
        textRendering="geometricPrecision"
        {...props}
      >


        <AnimatedSVGPath
            duration={3000}
            strokeWidth={5}
            strokeColor={"white"}
            d={circleD}
            length={1219.11}
            loop={false}
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
            d="M150.75 322.75s158.5-96 158.25-96.25 155.75 97.25 155.5 97"
            length={368.50}
            delay={1000}
            loop={false}
          />
          
          <AnimatedSVGPath

            duration={2000}
            strokeWidth={5}
            strokeColor={"white"}
            d="M244.73 265.896h127.246"
            length={127.25}
            delay={1000}
            loop={false}
            strokeLinecap={"round"}
            strokeLinejoin={"bevel"}
          />

          <AnimatedSVGPath
            duration={2000}
            strokeWidth={5}
            strokeColor={"white"}
            d="M181.5 265.146l63.5-109.5s64 63 63.75 62.75 60.75-64.75 60.5-65 64.75 112.75 64.5 112.5"
            length={434.52}
            delay={1000}
            loop={false}
            strokeLinecap={"round"}
            strokeLinejoin={""}
            transform={{translate:'0, 2'}}
          />
          <AnimatedSVGPath
            duration={2000}
            strokeWidth={5}
            strokeLinecap={"round"}
            strokeLinejoin={""}
            strokeColor={"white"}
            d="M332.458 88.68s-23.505-39.646-24.5-39.63c-.996.015-58.198 100.9-58.198 100.9s118.469-.81 117.473-.794"
            length={280.61}
            delay={1000}
            loop={false}
            transform={{translate:'0, -6'}}
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