import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import SoberietyTime from '../components/SoberietyTime'
import {NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import { connect } from 'react-redux';
import DocumentBrowserScreen from './DocumentBrowserScreen'
import Colors from '../constants/Colors';
import log from "../util/Logging"
const DocumentStack = createStackNavigator();
const {
  width: SCREEN_WIDTH, 
  height: SCREEN_HEIGHT
} = Dimensions.get('window')
import Layout from '../constants/Layout';

export default connect(
  function mapStateToProps(state, ownProps){
    const documents = state.general.paths
      return {documents};
    }, 
    function mapDispatchToProps(dispatch){
      return {
        testFunction: (testInput) => {
          log.info("dispatching test function with input " + testInput)
        }
      }
    }
)(DocumentScreenStack)

function DocumentScreenStack(props){
  log.info(`rendering docuemnt screenstack,`)
  const {format, pamphlet, readings} = props.documents;
  log.info(`rendering document screenstack`)
  const FormatWrapper = ({ navigation, route }) => (
    <DocumentBrowserScreen documents={format} />
  );
  const PamphletWrapper = ({ navigation, route }) => (
    <DocumentBrowserScreen  documents={pamphlet}/>

  );
  const ReadingsWrapper = ({ navigation, route }) => (
    <DocumentBrowserScreen  documents={readings}/>
  );
  return (
    <DocumentStack.Navigator>
      <DocumentStack.Screen 
        name="documents"
        component={DocumentScreen} 
        options={({navigation, route})=>({
          headerLeft: ()=>{
            return <Text style={{color: 'white', fontFamily: 'opensans', fontSize:  21 * Layout.scale.width, paddingLeft: 10* Layout.scale.width}}>CMA Resources</Text>
          },
          title:"",
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontFamily: 'opensans',
            fontSize:  21 * Layout.scale.width
          },
        })}/>
      <DocumentStack.Screen 
        name="Formats"
        component={FormatWrapper} 
        options={({navigation, route})=>({

          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontFamily: 'opensans',
            fontSize:  21 * Layout.scale.width
          },
        })}/>
      <DocumentStack.Screen 
        name="Pamphlets"
        component={PamphletWrapper} 
        options={({navigation, route})=>({

          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {

            fontFamily: 'opensans',
            fontSize:  21 * Layout.scale.width
          },
        })}/>      
      <DocumentStack.Screen 
        name="Readings"
        component={ReadingsWrapper} 
        options={({navigation, route})=>({

          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontFamily: 'opensans',
            fontSize:  21 * Layout.scale.width
          },
        })}/>
    </DocumentStack.Navigator>
  )
}

function DocumentScreen({navigation, ...props}) {
  log.info(`rendering documentscreen`)
  return (
    <View style={styles.container}>

      <OptionButton
        icon="md-school"
        label="Meeting Formats"
        onPress={() => navigation.navigate('Formats')}
      />

      <OptionButton
        icon="md-compass"
        label="Readings"
        onPress={() => navigation.navigate('Readings')}
      />

      <OptionButton
        icon="md-school"
        label="Pamphlets"
        onPress={() =>navigation.navigate('Pamphlets')}
        isLastOption
      />

    </View>
    
  );
}


function OptionButton({ icon, label, onPress, isLastOption }) {
  return (
    <RectButton style={[styles.option, isLastOption && styles.lastOption]} onPress={onPress}>
      <View style={{ flexDirection: 'row' }}>
        <View style={styles.optionIconContainer}>
          <Ionicons name={icon} size={22} color="rgba(0,0,0,0.35)" />
        </View>
        <View style={styles.optionTextContainer}>
          <Text style={styles.optionText}>{label}</Text>
        </View>
      </View>
    </RectButton>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  contentContainer: {
    paddingTop: 15,
  },
  optionIconContainer: {
    marginRight: 12,
  },
  option: {
    backgroundColor: '#fdfdfd',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 0,
    borderColor: '#ededed',
  },
  lastOption: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionText: {
    fontSize: 15,
    alignSelf: 'flex-start',
    marginTop: 1,
  },
});
