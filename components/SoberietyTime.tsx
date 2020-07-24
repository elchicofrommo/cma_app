import React, { useState } from 'react';
import { Text, View, StyleSheet, Dimensions, Animated, Easing, TouchableWithoutFeedback} from 'react-native';
import { MonoText } from './StyledText';
import { connect } from 'react-redux';
import moment from "moment";
import SliderToggle, {Toggle} from '../components/SliderToggle'
import Colors from '../constants/Colors';
import log from '../util/Logging'
import { LinearGradient } from "expo-linear-gradient"
function SoberietyTime({ dos, ...props }) {

  const [pressOffset, setPressOffset] = useState(new Animated.Value(0))

  log.info(`rendering SoberietyTime`)
  if (!dos) {
    return <WelcomeChip />
  }



  let time = "";
  let label = ""
  const firstDate = new moment(dos)
  const secondDate = new moment()
  const duration = moment.duration(secondDate.diff(firstDate))
  duration.add(1, 'd')
  const durationAsDays = duration.asDays()
  const durationAsMonths = duration.asMonths()
  let chip = <WelcomeChip />


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

  if (durationAsDays < 30) {
    chip = <WelcomeChip />
  }
  else if (durationAsDays < 60) {
    chip = <ThirtyDayChip />
  } else if (durationAsDays < 90) {
    chip = <SixtyDayChip />
  } else if (durationAsMonths < 4) {
    chip = <NinetyDayChip />
  } else if (durationAsMonths < 5) {
    chip = <FourMonthChip />
  } else if (durationAsMonths < 6) {
    chip = <FiveMonthChip />
  } else if (durationAsMonths < 7) {
    chip = <SixMonthChip />
  } else if (durationAsMonths < 8) {
    chip = <SevenrMonthChip />
  } else if (durationAsMonths < 9) {
    chip = <EightMonthChip />
  } else if (durationAsMonths < 10) {
    chip = <NineMonthChip />
  } else if (durationAsMonths < 11) {
    chip = <TenMonthChip />
  } else if (durationAsMonths < 12) {
    chip = <ElevenMonthChip />
  } else {
    chip = <AnnualChip years={Math.floor(duration.years())} />
  }

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


  const dateString = calcDate(Date.now(), dos)
  return (
    <View>
      {chip}
      <Text style={styles.dateText}  > {time} {label} </Text>
      <SliderToggle selectedIndex={ props.format==0?2:props.format==2?0:1} toggles={[
        {label: 'Years', callback: () => props.dispatchSetFormat(2)},
        {label: 'Months', callback: () => props.dispatchSetFormat(1)},
        {label: 'Days', callback: () => props.dispatchSetFormat(0)}]}/>
    </View>
  )
}

import Layout from '../constants/Layout';
import { container } from 'aws-amplify';




/*
            {
              toggles.map((data, index)=>{
                <TouchableWithoutFeedback onPress={()=>toggle(index)} ><Text style={[{ position: 'relative', zIndex: 5, elevation: 4, flex: 1, textAlign: 'center', color: (activeToggle==1 ? 'black' : Colors.primary), }, styles.textField]}>{data.label}</Text></TouchableWithoutFeedback>
              })
            }
*/
function WelcomeChip() {
  return (
    <CoreChip chipStyle={styles.welcome} chipText={'Welcome'} />
  )
}
function ThirtyDayChip() {
  return (
    <CoreChip chipStyle={styles.thirty} chipText={'Thirty Days'} />
  )
}
function SixtyDayChip() {
  return (
    <CoreChip chipStyle={styles.sixty} chipText={'Sixty Days'} />
  )
}

function NinetyDayChip() {
  return (
    <CoreChip chipStyle={styles.ninety} chipText={'Ninety Days'} />
  )
}
function FourMonthChip() {
  return (
    <CoreChip chipStyle={styles.fourMonths} chipText={'Four Months '} />
  )
}
function FiveMonthChip() {
  return (
    <CoreChip chipStyle={styles.fiveMonths} chipText={'Five Months '} />
  )
}
function SixMonthChip() {
  return (
    <CoreChip chipStyle={styles.sixMonths} chipText={'Six Months '} />
  )
}

function SevenrMonthChip() {
  return (
    <CoreChip chipStyle={styles.sevenMonths} chipText={'Seven Months '} />

  )
}

function EightMonthChip() {
  return (
    <CoreChip chipStyle={styles.eightMonths} chipText={'Eight Months '} />

  )
}
function NineMonthChip() {
  return (
    <CoreChip chipStyle={styles.nineMonths} chipText={'Nine Months '} />

  )
}
function TenMonthChip() {
  return (
    <CoreChip chipStyle={styles.tenMonths} chipText={'Ten Months '} />
  )
}
function ElevenMonthChip() {
  return (
    <CoreChip chipStyle={styles.elevenMonths} chipText={'Eleven Months '} />
  )
}
function AnnualChip({ years }) {
  return (
    <CoreChip chipStyle={styles.annual} chipText={`${years} year${years > 1 ? 's' : ''}`}
      contrastColor={'#d4af37'} reverse={true} />

  )
}

function CoreChip({ chipStyle, chipText, contrastColor = undefined, reverse = false }) {

  const outer1 = reverse ? '#FFFFFF20' : '#00000000'
  const outer2 = reverse ? '#FFFFFF00' : '#00000020'
  const inner1 = reverse ? '#00000020' : '#FFFFFF00'
  const inner2 = reverse ? '#00000000' : '#FFFFFF20'
  return (
    <View style={[shadow, {
      height: 170 * Layout.scale.width, alignSelf: 'center', marginBottom: 60,
      width: 170 * Layout.scale.width, borderRadius: 170 * Layout.scale.width
    }]}>
      <LinearGradient
        colors={[outer1, outer2, outer1]}
        style={[styles.chip, chipStyle, contrastColor && { borderColor: contrastColor }]}
        start={[0, 0]}
        end={[1, 1]}
        locations={[0, 0.5, 1]}
      >
        <LinearGradient
          colors={[inner1, inner2, inner1]}
          style={[styles.innerChip, contrastColor && { borderColor: contrastColor + "C0" }]}
          start={[0, 0]}
          end={[1, 1]}
          locations={[0, 0.5, 1]}
        ><Text style={[styles.chipText, contrastColor && { color: contrastColor }]}>{chipText}</Text>
        </LinearGradient>

      </LinearGradient>
    </View>
  )
}
function calcDate(date1, date2) {

  const firstDate = new moment(date1)
  const secondDate = new moment(date2)
  const duration = moment.duration(firstDate.diff(secondDate))
  const years = Math.floor(duration.asYears())
  const months = Math.floor(duration.asMonths() % 12)
  const days = Math.floor(duration.days())


  var yearsString = years == 0 ? "" : years == 1 ? `${years} year ` : `${years} years `
  var monthsString = months == 0 ? "" : months == 1 ? `${months} month ` : `${months} months `
  var daysString = days == 0 ? "First Day " : days == 1 ? `${days} day ` : `${days} days `

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
let shadow = Platform.OS === 'ios' ? {
  shadowColor: 'black',
  shadowOffset: { width: 6, height: 6 },
  shadowOpacity: .3,
  shadowRadius: 10,
} : {
    elevation: 4
  }

let innerShadow = Platform.OS === 'ios' ? {
  shadowColor: 'white',
  shadowOffset: { width: 2, height: 2 },
  shadowOpacity: .3,
  shadowRadius: 2,
} : { elevation: 2 }

const styles = StyleSheet.create({

  chip: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    height: 170 * Layout.scale.width,
    width: 170 * Layout.scale.width,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 85 * Layout.scale.width,
    margin: 30 * Layout.scale.width,

  },
  innerChip: {

    height: 130 * Layout.scale.width,
    width: 130 * Layout.scale.width,
    borderWidth: 1,
    borderRadius: 65 * Layout.scale.width,
    borderColor: '#00000070',
    justifyContent: 'center',
    alignItems: 'center',

  },
  welcome: {
    backgroundColor: 'white'
  },
  thirty: {
    backgroundColor: 'hotpink'
  },
  sixty: {
    backgroundColor: 'gold'
  },
  ninety: {
    backgroundColor: 'lightblue'
  },
  fourMonths: {
    backgroundColor: 'darkcyan'
  },
  fiveMonths: {
    backgroundColor: 'yellowgreen'
  },
  sixMonths: {
    backgroundColor: 'lightsalmon'
  },
  sevenMonths: {
    backgroundColor: 'teal'
  },
  eightMonths: {
    backgroundColor: 'plum'
  },
  nineMonths: {
    backgroundColor: 'paleturquoise'
  },
  tenMonths: {
    backgroundColor: 'orchid'
  },
  elevenMonths: {
    backgroundColor: 'orange'
  },
  annual: {
    backgroundColor: 'black',
    borderColor: 'white'
  },


  chipText: {
    fontFamily: 'merriweather',
    fontSize: 24 * Layout.scale.width,
    textAlign: 'center',

  },

  dateText: {
    fontSize: 30,
    fontFamily: 'opensans-light',
    textAlign: 'center'
  }


});