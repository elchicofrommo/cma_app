
import * as React from 'react';
import {Picker, Text, StyleSheet, View, TextInput, Button } from 'react-native';
import { BorderlessButton, ScrollView } from 'react-native-gesture-handler';
import DatePicker from 'react-native-datepicker'

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

import { connect } from 'react-redux';

function SettingsScreen(props) {
    return (
      <View style={styles.container}>
        <View>
        <TextInput 
          placeholder="Name" 
          style={styles.textField}
          value={props.general.name}
          onChangeText={(name)=>{props.dispatchNameChange(name)}}/>
        <DatePicker
        style={{width: 400,  marginTop: 5}}
        date={props.general.dos}
        mode="date"
        placeholder="select date"
        format="MM/DD/YYYY"
        minDate="01/01/1920"
        maxDate="01/01/2050"
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        customStyles={{
          dateIcon: {
            ... styles.dateIcon
          },
          dateInput: {
            ...styles.datePicker
          }
          // ... You can check the source to find the other keys.
        }}
        onDateChange={(date) => {props.dispatchDosChange(date)}}
      />

      </View>
      </View>
    );
  }

  export default connect(
    function mapStateToProps(state, ownProps){
        return state;
      }, 
      function mapDispatchToProps(dispatch, ownState){
        return {
          dispatchNameChange: (name) => {
            console.log("dispatching name change with input " + name);
            dispatch({type: "NAME_CHANGE", name})
          },
          dispatchDosChange: (date) => {
              console.log(`dispatching dos change ${date}`)
              dispatch({type: 'DOS_CHANGE', date})
          }
          
        }
      }
)(SettingsScreen)

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      justifyContent: 'center', 
      alignItems: 'center',
    },
    datePicker: {

        borderRadius: 25,

    },
    dateIcon: {
        position: 'absolute',
        left: 0,
        top: 4,
        marginLeft: 5
    },
    textField: {
        borderWidth: 1,
        borderRadius: 25,
        width: 400,
        textAlign: 'center',
        fontSize: 32,
        paddingLeft: 5,
        paddingRight: 5
    },
    developmentModeText: {
      marginBottom: 20,
      color: 'rgba(0,0,0,0.4)',
      fontSize: 14,
      lineHeight: 19,
      textAlign: 'center',
    },
    contentContainer: {
      paddingTop: 30,
    },
    welcomeContainer: {
      alignItems: 'center',
      marginTop: 10,
      marginBottom: 20,
    },
})
  