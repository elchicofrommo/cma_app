import React, {useState} from 'react';
import { Text, View , StyleSheet, Dimensions} from 'react-native';
import { MonoText } from '../components/StyledText';
import Swiper from 'react-native-swiper';
import ReadMore from 'react-native-read-more-text';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import moment from "moment";
import { faGratipay } from '@fortawesome/free-brands-svg-icons';

const {
  width: SCREEN_WIDTH, 
  height: SCREEN_HEIGHT
} = Dimensions.get('window')
const fontScale = SCREEN_WIDTH / 320;
const heightScale = SCREEN_HEIGHT / 680;
const longScreen = (SCREEN_WIDTH / SCREEN_HEIGHT )  *2

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
            dotStyle={{marginBottom: -7 * heightScale}}
            activeDotStyle={{marginBottom: -7 * heightScale}}
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
  let lines = Platform.OS ==='ios'? 5.5* fontScale: 4.7 * fontScale
  const [visible, setVisible] = useState(false)

  return(
  <View key={section} style={styles.section}>
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
      fontSize: fontScale *  17,
    },
    viewMore:{
      paddingTop: 6 * fontScale,
      color: 'blue',
    },  
    section: {
      paddingHorizontal: 10* fontScale,
      flexDirection: 'column',
      height: '94%',
      alignSelf: 'center',
      justifyContent: 'flex-start',
      width: '95%',
      backgroundColor: '#dfe2e2',

      borderRadius: 15,
      ...shadow,
    },
    sectionText: {
      fontSize: fontScale *  12,
      flex: 85,
    },
    sectionHeading: {
      textAlign: 'center',
      fontSize: fontScale *  15,
      fontWeight: 'bold',
      textAlignVertical: "bottom",
      paddingTop: 10* fontScale,
    },
    swiping:  {

      paddingTop: 5,
      flexDirection: 'column',
  
      marginTop: 5, 
      marginBottom: -5,

    },  
    modalText:{
      fontSize: 14 *fontScale,
      paddingVertical: 20* fontScale,
      paddingHorizontal: 10* fontScale,
      textAlign: 'left',
    },
     modalTextContainer: {
      backgroundColor: '#FFF',
      borderRadius: 5 * fontScale,
     },
    

  });