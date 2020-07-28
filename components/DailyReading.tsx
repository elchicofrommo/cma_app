import React, { useState } from 'react';
import { Text, View, StyleSheet, Platform } from 'react-native';

import ReadMore from 'react-native-read-more-text';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';

import { useLayout } from '../hooks/useLayout';
import { useColors } from '../hooks/useColors';
import { LinearGradient } from "expo-linear-gradient"
import log from '../util/Logging'


function DailyReading(props) {
  log.info(`rendering DailyReading`)

  let twentyFour = props.dailyReaders.twentyFour;
  let men = props.dailyReaders.men;
  let women = props.dailyReaders.women;
  let readerDate = props.date

  const reading = {
    ...twentyFour[readerDate],
    ...men[readerDate],
    ...women[readerDate]
  }


  const sections = [];

  for (const section in reading) {
    sections.push(
      <ReadingSection key={section} section={section} reading={reading} />

    )
    break;
  }
  return (
    <View>{sections[0]}</View>

  )
}

DailyReading = connect(
  function mapStateToProps(state, ownProps) {
    const { dailyReaders } = state.general
    return {
      dailyReaders
    };
  },
  function mapDispatchToProps(dispatch) {
    return {
      testFunction: (testInput) => {
        log.info("dispatching test function with input " + testInput)
      },
      dispatchRemoveMeeting: (data) => {
        log.info("dispatching remove meeting " + JSON.stringify(data))
        dispatch({ type: "REMOVE_MEETING", data })
      }
    }

  }
)(DailyReading)

export default DailyReading

function ReadingSection({section, reading }) {
  const styles = useStyles();
  const layout = useLayout();
  log.info(`rendering ReadingSection`)
  let lines = Platform.OS === 'ios' ? 5.5 * layout.scale.width : 4.7 * layout.scale.width
  const [visible, setVisible] = useState(false)
/*
    <LinearGradient
      colors={['#FFFFFF22', '#FFFFFFAA']}
      start={[0, 0]}
      end={[0, 3]}
      style={{paddingHorizontal: 5 * layout.scale.width}}
    >
    */
  return (
    <View style={styles.readingContainer}>

      <Text style={styles.sectionHeading}>{section}</Text>

      <ReadMore
        numberOfLines={lines}
        renderTruncatedFooter={(onPress) =>
          <View>
            <Text style={styles.viewMore} onPress={() => setVisible(true)}>View more</Text>
            <Modal isVisible={visible}
              onBackdropPress={() => setVisible(false)}
              onSwipeComplete={() => setVisible(false)}
              onBackButtonPress={() => setVisible(false)}
              swipeDirection={['up', 'down', 'left', 'right']}>

              <View style={styles.modalTextContainer}>
                <Text style={[styles.sectionHeading, {color: 'black'}]}>{section}</Text>
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


function useStyles() {
  const { colors: Colors } = useColors()
  const layout = useLayout();
  const styles = StyleSheet.create({

    readingContainer: {
      backgroundColor: Colors.primaryContrast,
      paddingHorizontal: 5* layout.scale.width
    },
    title: {
      fontFamily: 'merriweather-italic',
      textAlign: 'left',
      fontSize: layout.scale.width * 17,
    },
    viewMore: {
      paddingTop: 6 * layout.scale.width,
      color: Colors.primary1,
    },
    section: {

      flexDirection: 'column',
      height: '94%',
      alignSelf: 'center',
      justifyContent: 'flex-start',
      width: '95%',
      backgroundColor: '#44444422',

      overflow: 'hidden',
    },
    sectionText: {
      fontSize: layout.scale.width * 15,
      fontFamily: 'opensans-light',
      marginHorizontal: 5 * layout.scale.width
    },
    sectionHeading: {
      textAlign: 'center',
      fontSize: layout.scale.width * 15,
      fontFamily: 'opensans-bold',
      textAlignVertical: "bottom",
      paddingTop: 10 * layout.scale.width,
    },
    swiping: {

      paddingTop: 5,
      flexDirection: 'column',

    },
    modalText: {
      fontSize: 14 * layout.scale.width,
      paddingVertical: 20 * layout.scale.width,
      paddingHorizontal: 10 * layout.scale.width,
      textAlign: 'left',
    },
    modalTextContainer: {
      backgroundColor: Colors.background,
      borderRadius: 5 * layout.scale.width,
    },


  });
  return styles
}
