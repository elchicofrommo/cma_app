import React, {useState} from 'react';
import { Text, View , StyleSheet, Dimensions} from 'react-native';
import { MonoText } from '../components/StyledText';
import Swiper from 'react-native-swiper';
import ReadMore from 'react-native-read-more-text';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import moment from "moment";
import { faGratipay } from '@fortawesome/free-brands-svg-icons';
import Layout from '../constants/Layout';
import Colors from '../constants/Colors';
import {LinearGradient} from "expo-linear-gradient"

function DailyReading(props){
  console.log(`rendering DailyReading`)
  
  let twentyFour = props.dailyReaders.twentyFour;
  let men = props.dailyReaders.men;
  let women = props.dailyReaders.women;
  let readerDate = props.date 


  const {subtitle} = twentyFour.subtitle
  const reading={
    ...twentyFour[readerDate], 
    ...men[readerDate], 
    ...women[readerDate]}


  const sections = [];
  
  for(const section in reading){
    sections.push(
      <ReadingSection key={section}  subtitle={subtitle} section={section} reading={reading} />
      
    )
  }
    return(

          <Swiper 
            loop={true}
            showsPagination={true}
            dotColor={"lightgray"}
            activeDotColor={"#87A287"}
            index={0}
            dotStyle={{marginBottom: -7 * Layout.scale.height}}
            activeDotStyle={{marginBottom: -7 * Layout.scale.height}}
            containerStyle={styles.swiping}>
            {sections}
          </Swiper>

    )
}


DailyReading = connect(
  function mapStateToProps(state, ownProps){
      const { dailyReaders} = state.general
      return {
        dailyReaders
      };
    }, 
    function mapDispatchToProps(dispatch){
      return {
        testFunction: (testInput) => {
          console.log("dispatching test function with input " + testInput)
        },
        dispatchRemoveMeeting: (data) => {
          console.log("dispatching remove meeting " + JSON.stringify(data))
          dispatch({type: "REMOVE_MEETING", data})
        }
      }

    }
)(DailyReading)

export default DailyReading

function ReadingSection({title, subtitle, section, reading}){
  console.log(`rendering ReadingSection`)
  let lines = Platform.OS ==='ios'? 5.5* Layout.scale.width: 4.7 * Layout.scale.width
  const [visible, setVisible] = useState(false)

  return(
  <View key={section} style={styles.section}>
       <LinearGradient 
          colors={[Colors.primaryL2, Colors.primaryL1]}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
          }}
          start={[0,0]}
          end={[0, 3]}
        />
        <Text style={styles.sectionHeading}>{section}</Text>

        <ReadMore
            numberOfLines={lines}
            renderTruncatedFooter={(onPress)=> 
              <View>
                <Text style={styles.viewMore} onPress={()=>setVisible(true)}>View more</Text>
                <Modal isVisible={visible} 
            onBackdropPress={()=>setVisible(false)}
            onSwipeComplete={()=>setVisible(false)}
            onBackButtonPress={()=>setVisible(false)}
            swipeDirection={['up', 'down', 'left', 'right']}>

            <View style={styles.modalTextContainer}>
              <Text style={styles.sectionHeading}>{section}</Text>
              <Text style={styles.modalText} >
              {reading[section]}
              </Text>
            </View>
          </Modal>
              </View>
            }
          >

          <Text style={styles.sectionText} >{reading[section]}</Text>
        </ReadMore>
        
      </View>
  )
}
const shadow = Platform.OS === 'ios' ? {
  shadowColor: 'black',
  shadowOffset: { width: 4, height: 4 },
  shadowRadius: 3,
  shadowOpacity: .4,
} : { elevation: 15 }

const styles = StyleSheet.create({
    

    title: {
      fontFamily: 'merriweather-italic',
      textAlign: 'left',
      fontSize: Layout.scale.width *  17,
    },
    viewMore:{
      paddingTop: 6 * Layout.scale.width,
      color: 'blue',
    },  
    section: {
      paddingHorizontal: 10* Layout.scale.width,
      flexDirection: 'column',
      height: '94%',
      alignSelf: 'center',
      justifyContent: 'flex-start',
      width: '95%',
      backgroundColor: '#dfe2e2',

      borderRadius: 15,
      overflow: 'hidden',
      ...shadow,
    },
    sectionText: {
      fontSize: Layout.scale.width *  12,
      flex: 85,
    },
    sectionHeading: {
      textAlign: 'center',
      fontSize: Layout.scale.width *  15,
      fontWeight: 'bold',
      textAlignVertical: "bottom",
      paddingTop: 10* Layout.scale.width,
    },
    swiping:  {

      paddingTop: 5,
      flexDirection: 'column',
  
      marginTop: 5, 
      marginBottom: -5,

    },  
    modalText:{
      fontSize: 14 *Layout.scale.width,
      paddingVertical: 20* Layout.scale.width,
      paddingHorizontal: 10* Layout.scale.width,
      textAlign: 'left',
    },
     modalTextContainer: {
      backgroundColor: Colors.background,
      borderRadius: 5 * Layout.scale.width,
     },
    

  });