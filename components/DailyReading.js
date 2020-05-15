import * as React from 'react';
import { Text, View , StyleSheet, Dimensions} from 'react-native';
import { MonoText } from '../components/StyledText';
import Swiper from 'react-native-swiper';

import moment from "moment";
import { faGratipay } from '@fortawesome/free-brands-svg-icons';

const {
  width: SCREEN_WIDTH, 
  height: SCREEN_HEIGHT
} = Dimensions.get('window')
const fontScale = SCREEN_WIDTH / 320;


export default function DailyReading({title, subtitle, reading}){

  const sections = [];
  for(const section in reading){
    sections.push(
      <View key={section} style={styles.section}>
        <Text style={styles.sectionHeading}>{section}</Text>
        <Text style={styles.sectionText}>{reading[section]}</Text>
      </View>
    )
  }
    return(
        <View style={styles.readingContainer}>
          <Swiper 
            loop={true}
            showsPagination={true}
            dotColor={"#F4F5F4"}
            activeDotColor={"#87A287"}
            index={1}
            dotStyle={{marginBottom: -20, width: 4, height: 4}}
            activeDotStyle={{marginBottom: -20, width: 4, height: 4}}
            style={styles.swiping}>
            {sections}
          </Swiper>
        </View>
    )
}

const styles = StyleSheet.create({
    

    readingContainer: {
      color: 'rgba(96,100,109, 0.8)',
      backgroundColor: "#D4DAD4",
      flex: 1,

      paddingHorizontal: 10,
      borderBottomWidth: 3,
      borderColor: '#FFF',
    
    },
    title: {
      fontFamily: 'merriweather-italic',
      textAlign: 'left',
      fontSize: fontScale *  17,
    },
    section: {
      flex: 1,

    },
    sectionText: {
      fontSize: fontScale *  12,
      flex: 85,
      
    },
    sectionHeading: {
      textAlign: 'center',
      fontSize: fontScale *  15,
      fontWeight: 'bold',
      flex: 15,
      textAlignVertical: "bottom"
    },
    swiping:  {

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