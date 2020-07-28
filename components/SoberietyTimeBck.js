import React, { useState } from 'react';
import { Text, View, StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import { MonoText } from '../components/StyledText';
import { connect } from 'react-redux';
import moment from "moment";
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Colors from '../constants/Colors';
import log from '../util/Logging'
function SoberietyTime(props) {

  const [pressOffset, setPressOffset] = useState(new Animated.Value(0))

  log.info(`rendering SoberietyTime`)
  if (props.dos) {

    let time = "";
    let label = ""
    const firstDate = new moment(props.dos)
    const secondDate = new moment()
    const duration = moment.duration(secondDate.diff(firstDate))

    if (props.format == 0) {
      time = duration.asDays().toFixed(0)
      label = "day" + (time == "1" ? "" : "s")
    } else if (props.format == 1) {
      time = duration.asMonths().toFixed(2).replace(/(\.0?0)$/, "")
      label = "month" + (time == "1" ? "" : "s")
    } else {
      time = duration.asYears().toFixed(2).replace(/(\.0?0)$/, "")
      label = "year" + (time == "1" ? "" : "s")
    }

    function pressDown(){
      log.info("press down")
      Animated.timing(pressOffset, {
        toValue: 3,
        useNativeDriver: true,
        duration: 50,
        easing: Easing.linear
      }).start();
    }

    function pressUp(){
      Animated.timing(pressOffset, {
        toValue: 0,
        useNativeDriver: true,
        duration: 50,
        easing: Easing.linear
      }).start();
    }

    const transform = {
      transform: [{ translateY: pressOffset }, {translateX: pressOffset}],
    }

    /*
    Need to integrate the rungs back into the calendar at some point

            <View style={styles.cal2Rungs}>
          <View style={styles.rung}>

          </View>
          <View style={styles.rungSpacer}></View>
          <View style={styles.rung} ></View>
        </View>
    */

    return (

      
      <View style={styles.cal2Outer}>
        <TouchableWithoutFeedback underlayColor="transparent" onPress={() => props.dispatchSetFormat((props.format + 1) % 3)} 
        onPressIn={pressDown} onPressOut={pressUp} style={[transform, {padding: 3}]} >
        <View style={styles.cal2}>
          <View style={styles.cal2Border}>

          </View>
          <View style={styles.cal2Content}>
          
              <Text style={styles.dateText}>{time}</Text>
              <Text style={styles.dateLabel}>{label}</Text>
             
          </View>
        </View>
        </TouchableWithoutFeedback>
      </View>
      
    )
  } else {
    return (
      <View style={styles.cal2Outer}>
        <View style={styles.cal2}>
          <View style={styles.cal2Border}>

          </View>
          <View style={styles.cal2Content}>
            <Text style={styles.dateLabel}>{"Enter\nTime"}</Text>
          </View>
        </View>
      </View>
    )
  }


}

import Layout from '../constants/Layout';

function calcDate(date1, date2) {

  const firstDate = new moment(date1)
  const secondDate = new moment(date2)
  const duration = moment.duration(firstDate.diff(secondDate))
  const years = Math.floor(duration.asYears())
  const months = Math.floor(duration.asMonths() % 12)
  const days = Math.floor(duration.days())


  var yearsString = years == 0 ? "" : years == 1 ? `${years} year ` : `${years} years `
  var monthsString = months == 0 ? "" : months == 1 ? `${months} month ` : `${months} months `
  var daysString = days == 0 ? "🎉 First Day  🎉" : days == 1 ? `${days} day ` : `${days} days `

  var message = "";
  if (monthsString == daysString) {
    message = `🎉  ${yearsString}  🎉`
  }
  else if (yearsString == daysString) {
    message = `🎉  ${monthsString}  🎉`
  } else {
    message = `${yearsString} ${monthsString} ${daysString}`
  }


  return `${yearsString} ${monthsString} ${daysString}`

}

export default connect(
  function mapStateToProps(state, ownProps) {
    const { operatingUser, soberietyFormat } = state.general
    return { dos: operatingUser.dos, format: soberietyFormat };
  },
  function mapDispatchToProps(dispatch) {
    return {
      testFunction: (testInput) => {
        log.info("dispatching test function with input " + testInput)
      },
      dispatchSetFormat: (format) => {
        dispatch({ type: "SET_SOBERIETY_FORMAT", data: format })
      }
    }
  }
)(SoberietyTime)
const borderRadius = 20
const middleFlex = 1
const calWidth = 80
const calHeight = 70
const iosShadow = Platform.OS === 'ios' ? {
  shadowColor: 'black',
  shadowOffset: { width: 4, height: 4 },
  shadowOpacity: .1,
  shadowRadius: 6,
} : { shadowOpacity: 0 }

const androidShadow = Platform.OS === 'android' ? {
  elevation: 3
} : { elevation: 0 }

const styles = StyleSheet.create({


  cal2Outer: {

    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadius,
    bottom: 10,
    right: 10,

    padding: 0,
    ...iosShadow

  },
  cal2Rungs: {
    position: 'absolute',
    left: 3,
    width: '100%',
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  cal2: {
    width: calWidth,
    height: calHeight,
    borderRadius: borderRadius,
    position: 'relative',
    zIndex: 5,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: 5, 
    overflow: "hidden",
    ...androidShadow,

  },
  rung: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    width: 8,
    borderRadius: 4,
    height: 17,
    backgroundColor: '#adb5bd'
  },
  rungSpacer: {
    width: '35%',
    height: 10
  },
  cal2Border: {

    height: 22,
    backgroundColor: Colors.primary12,
    borderBottomColor: Colors.primary1,
    borderBottomWidth: 5,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderTopLeftRadius: borderRadius,
    borderTopRightRadius: borderRadius,
    margin: 0,
  },
  dateText: {
    fontSize: 22,
    fontFamily: 'opensans-bold',
    textAlign: 'center'
  },
  dateLabel: {
    textTransform: 'capitalize',
    marginTop: -5,
    textAlign: 'center'
  },
  cal2Content: {
    width: '100%',
    flexGrow: 1,
    backgroundColor: 'white',
    borderColor: Colors.primary1,
    borderWidth: 1,
    borderBottomLeftRadius: borderRadius,
    borderBottomRightRadius: borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
  },

});