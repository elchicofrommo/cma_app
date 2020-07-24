import React, { useState } from 'react';
import { Text, View, StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import { MonoText } from '../components/StyledText';
import { connect } from 'react-redux';
import moment from "moment";
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Colors from '../constants/Colors';
import log from '../util/Logging'
function SoberietyTime({dos, ...props}) {

  const [pressOffset, setPressOffset] = useState(new Animated.Value(0))

  log.info(`rendering SoberietyTime`)
  if(!dos ){
    return <WelcomeChip />
  }


    let time = "";
    let label = ""
    const firstDate = new moment(dos)
    const secondDate = new moment()
    const duration = moment.duration(secondDate.diff(firstDate))
    const durationAsDays = duration.asDays()
    const durationAsMonths = duration.asMonths()
    let chip = <WelcomeChip/>



    if(durationAsDays < 30){
      chip = <WelcomeChip />
    }
    else if(durationAsDays<60){
      chip= <ThirtyDayChip />
    }else if(durationAsDays<90){
      chip = <SixtyDayChip />
    }else if(durationAsMonths < 4){
      chip = <NinetyDayChip />
    }else if(durationAsMonths < 5){
      chip = <FourMonthChip />
    }else if(durationAsMonths < 6){
      chip = <FiveMonthChip />
    }else if(durationAsMonths < 7){
      chip = <SixMonthChip />
    }else if(durationAsMonths < 8){
      chip = <SevenrMonthChip />
    }else if(durationAsMonths < 9){
      chip = <EightMonthChip/>
    }else if(durationAsMonths < 10){
      chip = <NineMonthChip />
    }else if(durationAsMonths < 11){
      chip = <TenMonthChip />
    }else if(durationAsMonths < 12){
      chip = <ElevenMonthChip />
    }else {
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
        <Text style={styles.dateText}  > {dateString} </Text>
      </View>
    )
}

import Layout from '../constants/Layout';


function WelcomeChip(){
  return(
    <View style={[styles.chip, styles.welcome]}>
      <View style={styles.innerChip}>
      <Text style={styles.chipText}>Welcome</Text>
      </View>
    </View>
  )
}
function ThirtyDayChip(){
  return(
    <View style={[styles.chip, styles.thirty]}>
      <View style={styles.innerChip}>
      <Text style={styles.chipText}>Thirty Days</Text>
      </View>
    </View>
  )
}
function SixtyDayChip(){
  return(
    <View style={[styles.chip, styles.sixty]}>
      <View style={styles.innerChip}>
      <Text style={styles.chipText}>Sixty Days</Text>
      </View>
    </View>
  )
}

function NinetyDayChip(){
  return(
    <View style={[styles.chip, styles.ninety]}>
      <View style={styles.innerChip}>
      <Text style={styles.chipText}>Ninety Days</Text>
      </View>
    </View>
  )
}
function FourMonthChip(){
  return(
    <View style={[styles.chip, styles.fourMonths]}>
      <View style={styles.innerChip}>
      <Text style={styles.chipText}>Four Months</Text>
      </View>
    </View>
  )
}
function FiveMonthChip(){
  return(
    <View style={[styles.chip, styles.FiveMonths]}>
      <View style={styles.innerChip}>
      <Text style={styles.chipText}>Five Months</Text>
      </View>
    </View>
  )
}
function SixMonthChip(){
  return(
    <View style={[styles.chip, styles.sixMonths]}>
      <View style={styles.innerChip}>
      <Text style={styles.chipText}>Six Months</Text>
      </View>
    </View>
  )
}

function SevenrMonthChip(){
  return(
    <View style={[styles.chip, styles.sevenMonths]}>
      <View style={styles.innerChip}>
      <Text style={styles.chipText}>Seven Months</Text>
      </View>
    </View>
  )
}

function EightMonthChip(){
  return(
    <View style={[styles.chip, styles.eightMonths]}>
      <View style={styles.innerChip}>
      <Text style={styles.chipText}>Eight Months</Text>
      </View>
    </View>
  )
}
function NineMonthChip(){
  return(
    <View style={[styles.chip, styles.nineMonths]}>
      <View style={styles.innerChip}>
      <Text style={styles.chipText}>Nine Months</Text>
      </View>
    </View>
  )
}
function TenMonthChip(){
  return(
    <View style={[styles.chip, styles.tenMonths]}>
      <View style={styles.innerChip}>
      <Text style={styles.chipText}>Ten Months</Text>
      </View>
    </View>
  )
}
function ElevenMonthChip(){
  return(
    <View style={[styles.chip, styles.elevenMonths]}>
      <View style={styles.innerChip}>
      <Text style={styles.chipText}>Eleven Months</Text>
      </View>
    </View>
  )
}
function AnnualChip({years}){
  return(
    <View style={[styles.chip, styles.annual]}>
      <View style={[styles.innerChip, {borderColor: 'white'}]}>
      <Text style={[styles.chipText, {color: 'white'}]}>{years} year{years > 1 && 's'}</Text>
      </View>
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
let shadow = Platform.OS === 'ios' ? {
  shadowColor: 'black',
  shadowOffset: { width: 6, height: 6 },
  shadowOpacity: .3,
  shadowRadius: 10,
} : {
  elevation: 4
} 

const styles = StyleSheet.create({

  chip: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    height: 170* Layout.scale.width,
    width: 170* Layout.scale.width,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 170* Layout.scale.width,
    margin: 30 * Layout.scale.width,
    ...shadow
  },
  innerChip: {

    height: 130* Layout.scale.width,
    width: 130* Layout.scale.width,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 130* Layout.scale.width, 
    justifyContent: 'center',
    alignItems: 'center',  
  },
  welcome:  {
    backgroundColor: 'white'
  },
  thirty:{
    backgroundColor: 'hotpink'
  },
  sixty: {
    backgroundColor: 'gold'
  },
  ninety:{
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
    fontSize: 20 * Layout.scale.width,
    textAlign: 'center'
  },
  
  dateText: {
    fontSize: 30,
    fontFamily: 'opensans-light',
    textAlign: 'center'
  }
  

});