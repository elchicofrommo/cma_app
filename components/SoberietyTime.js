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
    console.log(`calculating date from ${date1} and ${date2}`)

    const dateDiff ={
        years: date1.getFullYear() - date2.getFullYear(),
        months: date1.getMonth() - date2.getMonth(),
        days: date1.getDate() - date2.getDate()
    }
    
    var years = dateDiff.years == 0 ? "" : dateDiff.years == 1 ? `${dateDiff.years} year ` : `${dateDiff.years} years `
    var months = dateDiff.months == 0 ? "" : dateDiff.months == 1 ? `${dateDiff.months} month ` : `${dateDiff.years} months `
    var days = dateDiff.days == 0 ? "" : dateDiff.days == 1 ? `${dateDiff.days} day ` : `${dateDiff.days} days `
    var message = "";
    if(months == days ){
        message = `🎉  ${years}  🎉`
    }
    else if(years == days){
        message = `🎉  ${months}  🎉`
    }else {
        message = `${years}${months}${days}`
    }

    return message

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