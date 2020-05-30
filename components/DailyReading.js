import React, {useState} from 'react';
import { Text, View , StyleSheet, Dimensions} from 'react-native';
import { MonoText } from '../components/StyledText';
import Swiper from 'react-native-swiper';
import ReadMore from 'react-native-read-more-text';
import Modal from 'react-native-modal';

import moment from "moment";
import { faGratipay } from '@fortawesome/free-brands-svg-icons';

const {
  width: SCREEN_WIDTH, 
  height: SCREEN_HEIGHT
} = Dimensions.get('window')
const fontScale = SCREEN_WIDTH / 320;
const longScreen = (SCREEN_WIDTH / SCREEN_HEIGHT )  *2

export default function DailyReading({title, subtitle, reading}){


  const sections = [];
  
  for(const section in reading){
    sections.push(
      <ReadingSection key={section} title={title} subtitle={subtitle} section={section} reading={reading} />
      
    )
  }
    return(

          <Swiper 
            loop={true}
            showsPagination={true}
            dotColor={"lightgray"}
            activeDotColor={"#87A287"}
            index={0}
            dotStyle={{marginBottom: -10 * fontScale}}
            activeDotStyle={{marginBottom: -10 * fontScale}}
            containerStyle={styles.swiping}>
            {sections}
          </Swiper>

    )
}
function ReadingSection({title, subtitle, section, reading}){
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
const styles = StyleSheet.create({
    

    readingContainer: {
      color: 'rgba(96,100,109, 0.8)',
      flexDirection: 'column',
      paddingHorizontal: 10,
      paddingTop: 10,
      paddingBottom: 30,
      borderColor: '#FFF',
    
    },
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
      height: 200 * fontScale,
      justifyContent: 'flex-start',
      paddingBottom: 20,
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

      flexDirection: 'column',
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
    tabBarInfoContainer: {
      position: 'absolute',
      bottom: 0, 
      left: 0,
      right: 0,
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
      backgroundColor: '#fbfbfb',
      paddingVertical: 15,
      flex: 1,
      flexDirection: 'row'
    },

  });