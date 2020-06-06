import * as React from 'react';
import { Text, View , StyleSheet, Dimensions} from 'react-native';
import { MonoText } from '../components/StyledText';
import { connect } from 'react-redux';
import moment from "moment";


function SoberietyTime(props){
  console.log(`rendering SoberietyTime`)
    if(props.dos){
        console.log(`building date from ${props.dos} ${typeof props.dos}`)
        const dos = new Date(props.dos);
        const current = new Date();
        message = calcDate(current, dos);

        return(
          <View style={styles.tabBarInfoContainer}>
     
             <Text style={styles.timeLabel}>Clean Time:</Text>
             <Text  style={[styles.timeText]}>{message}</Text>
     
           </View>
         )
    }else{
      return(
        <View style={styles.tabBarInfoContainer}>
   
           <Text style={styles.timeText}>Enter Soberiety Date in Profile</Text>
   
         </View>
       )
    }
  
    
}
const {
  width: SCREEN_WIDTH, 
  height: SCREEN_HEIGHT
} = Dimensions.get('window')
const fontScale = SCREEN_WIDTH / 320;

function calcDate(date1, date2) {

    const firstDate = new moment(date1)
    const secondDate = new moment(date2)
    const duration = moment.duration(firstDate.diff(secondDate))
    const years = Math.floor(duration.asYears())
    const months = Math.floor(duration.asMonths()%12)
    const days = Math.floor(duration.days())

    
    var yearsString = years == 0 ? "" : years == 1 ? `${years} year ` : `${years} years `
    var monthsString = months == 0 ? "" : months == 1 ? `${months} month ` : `${months} months `
    var daysString = days == 0 ? "🎉 First Day  🎉" : days == 1 ? `${days} day ` : `${days} days `

    var message = "";
    if(monthsString == daysString ){
        message = `🎉  ${yearsString}  🎉`
    }
    else if(yearsString == daysString){
        message = `🎉  ${monthsString}  🎉`
    }else {
        message = `${yearsString} ${monthsString} ${daysString}`
    }
   

    return `${yearsString} ${monthsString} ${daysString}`

}

export default connect(
    function mapStateToProps(state, ownProps){
      const {dos} = state.general
        return {dos} ;
      }, 
      function mapDispatchToProps(dispatch){
        return {
          testFunction: (testInput) => {
            console.log("dispatching test function with input " + testInput)
          }
        }
      }
)(SoberietyTime)

const styles = StyleSheet.create({
    

    codeHighlightText: {
      color: 'rgba(96,100,109, 0.8)',
    },
    timeText: {
      
        fontSize: 15 * fontScale,
        fontStyle: 'italic',
        textAlign: 'center',
        flex: 1,
        marginBottom: -5 * fontScale,
        paddingBottom: 5 * fontScale,

    },
    timeLabel: {
      fontSize: 15 * fontScale,
      textAlign: "right",
      paddingLeft: 10 * fontScale,
      marginBottom: -5 * fontScale,
      paddingBottom: 5 * fontScale,
    },
    tabBarInfoContainer: {

      ...Platform.select({
        ios: {
          shadowColor: 'black',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
        },
        android: {
          elevation: 20,
        },
      }),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fbfbfb',
      paddingVertical: 10,
      flex: 1,
      flexDirection: 'row'
    },

  });