import React, { useState } from 'react';
import { Text, View, StyleSheet, Animated, Easing, TouchableWithoutFeedback } from 'react-native';

import Layout from '../constants/Layout';
import Colors from '../constants/Colors';
import log from '../util/Logging'

export type Toggle = {
    label: string;
    callback: Function;
}

export default function SliderToggle({ toggles, containerWidth = Layout.window.width * .8 , selectedIndex}: { toggles: Toggle[], containerWidth: number , selectedIndex: number}) {
    const toggleWidth = containerWidth / toggles.length;
    const tempStopPoints = calculateStopPoints(toggleWidth, toggles.length)
    const [offset, setOffset] = React.useState(new Animated.Value(tempStopPoints[selectedIndex]))
    const [activeToggle, setActiveToggle] = useState(selectedIndex);

    

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
    } : { elevation: 3 }
    return (
        <View style={{ backgroundColor: '#fff', paddingTop: 10 * Layout.scale.width }}>
            <View style={{
                position: 'relative',
                zIndex: 1,
                flexDirection: 'row',
                alignSelf: 'center',
                width: containerWidth,
                paddingVertical: 0,
                height: 34,
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#d1d7dd',
                borderRadius: 17,
            }}>
                <Animated.View style={[{ position: 'absolute', zIndex: 3, height: 29, width: toggleWidth - 3, backgroundColor: 'white', top: 2.5, left: 0, borderRadius: 16, ...shadow, ...transform }]}></Animated.View>

                <TouchableWithoutFeedback onPress={() => toggle(0)} >
                    <Text style={[{
                        position: 'relative', zIndex: 5, elevation: 4,
                        flex: 1, textAlign: 'center', color: (activeToggle == 0 ? Colors.primary : 'black'),
                    },
                    styles.textField]}>{toggles[0].label}</Text>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => toggle(1)} >
                    <Text style={[{
                        position: 'relative', zIndex: 5, elevation: 4,
                        flex: 1, textAlign: 'center', color: (activeToggle == 1 ? Colors.primary : 'black'),
                    },
                    styles.textField]}>{toggles[1].label}</Text>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => toggle(2)} >
                    <Text style={[{
                        position: 'relative', zIndex: 5, elevation: 4,
                        flex: 1, textAlign: 'center', color: (activeToggle == 2 ? Colors.primary : 'black'),
                    },
                    styles.textField]}>{toggles[2].label}</Text>
                </TouchableWithoutFeedback>

            </View>


        </View>
    )

    
}

const styles = StyleSheet.create({

    textField: {
        fontSize: 17 * Layout.scale.width,
        fontFamily: 'opensans'
      }
})
