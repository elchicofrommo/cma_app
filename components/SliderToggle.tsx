import React, { useState } from 'react';
import { Text, View, StyleSheet, Animated, Easing, TouchableWithoutFeedback, Platform } from 'react-native';

import {useLayout} from '../hooks/useLayout'
import {useColors} from '../hooks/useColors'
import log from '../util/Logging'

export type Toggle = {
    label: string;
    callback: Function;
}

export default function SliderToggle({ toggles, containerWidth = -1, selectedIndex, activeColor, inactiveColor }:
    { toggles: Toggle[], containerWidth: number, selectedIndex: number, activeColor?: string, inactiveColor?: string }) {
    const toggleWidth = containerWidth / toggles.length;
    const Layout = useLayout();
    const {colors: Colors} = useColors();

    if(containerWidth == -1)
        containerWidth = Layout.window.width *.8
    const tempStopPoints = calculateStopPoints(toggleWidth, toggles.length)
    const [offset, setOffset] = React.useState(new Animated.Value(tempStopPoints[selectedIndex]))
    const [activeToggle, setActiveToggle] = useState(selectedIndex);

    const styles = useStyles()

    function calculateStopPoints(width, count): number[] {
        const stops = []

        for (let i = 0; i < count; i++) {
            let temp = width * i;
            if (i == 0)
                temp += 3
            stops.push(temp)
        }
        return stops
    }

    function toggle(index) {
        const stopPoints = calculateStopPoints(toggleWidth, toggles.length)
        toggles[index].callback();
        setActiveToggle(index)
        Animated.timing(offset, {
            toValue: (stopPoints[index]),
            useNativeDriver: true,
            duration: 200,
            easing: Easing.inOut(Easing.ease)
        }).start();
    }


    const transform = {
        transform: [{ translateX: offset }]
    }
    const shadow = Platform.OS === 'ios' ? {
        shadowColor: 'black',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: .3,
    } : { elevation: 0 }
    return (
        <View style={{ paddingTop: 10 * Layout.scale.width }}>
            <View style={{
                position: 'relative',
                zIndex: 1,
                flexDirection: 'row',
                alignSelf: 'center',
                width: containerWidth,
                paddingVertical: 0,
                height: 34 * Layout.scale.height,
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: inactiveColor ? inactiveColor : '#00000033',
                borderRadius: 17 * Layout.scale.height,
            }}>
                <Animated.View style={[{
                    position: 'absolute', zIndex: 3, height: 29 * Layout.scale.height, width: toggleWidth - 3, backgroundColor: activeColor ? activeColor : '#11111177',
                    top: 2.5 * Layout.scale.height, left: 0, borderRadius: 16 * Layout.scale.height, ...shadow, ...transform
                }]}></Animated.View>


                {
                    toggles.map((t: Toggle, index) => {
                        return (
                            <TouchableWithoutFeedback onPress={() => toggle(index)} key={index}>
                                <Text style={[styles.textField, {
                                    position: 'relative', zIndex: 5, elevation: 4,
                                    flex: 1, textAlign: 'center'
                                }, activeToggle == index && { color: Colors.primary }
                                ]}>{t.label}</Text>
                            </TouchableWithoutFeedback>
                        )
                    })
                }


            </View>


        </View>
    )


}
function useStyles() {
    const Layout = useLayout();
    const {colors: Colors} = useColors();

    const styles = StyleSheet.create({

        textField: {
            fontSize: 22 * Layout.scale.height,
            fontFamily: 'opensans',
            color: Colors.primaryContrast
        }
    })

    return styles
}
