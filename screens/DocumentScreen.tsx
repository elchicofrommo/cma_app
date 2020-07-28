import { Ionicons } from '@expo/vector-icons';

import * as React from 'react';
import { StyleSheet, Text, View,  } from 'react-native';
import { RectButton,  } from 'react-native-gesture-handler';

import { connect } from 'react-redux';

import {useColors} from '../hooks/useColors';
import log from "../util/Logging"
import HeaderComponent from "../components/HeaderComponent"
import {useLayout} from '../hooks/useLayout'
import { LinearGradient } from 'expo-linear-gradient';
import { createStackNavigator } from '@react-navigation/stack';

const DocumentStack = createStackNavigator();

function DocumentScreenStack(props){
  log.info(`rendering docuemnt screenstack,`)


  return (
    <DocumentStack.Navigator>
      <DocumentStack.Screen 
        name="documents"
        component={DocumentScreen} 
        options={({navigation, route})=>({
          title:"",

          headerMode: "float",
          headerTransparent: true,
          header: ({scene,previous, navigation})=>{
            return (
              <HeaderComponent scene={scene} previous={previous} navigation={navigation}
            title={"Documents"} /> ) }
           
          })}
        />
      
    </DocumentStack.Navigator>
  )
}
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


function DocumentScreen({navigation, ...props}) {
  log.info(`rendering documentscreen`)

  const Layout = useLayout();
  const {colors: Colors} = useColors();
  const styles = useStyles()
  return (
    <LinearGradient style={[styles.container, ]}
    colors={[Colors.primary, Colors.primaryL1]}
    start={[0 , 0]}
    end={[1.5, 1.5]}
    locations={[0, .5]}>   
      <View style={{paddingTop: (Layout.belowHeader) * Layout.scale.height}}></View>
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

    </LinearGradient>
    
  );
}


function OptionButton({ icon, label, onPress, isLastOption }) {
  const styles = useStyles()
  return (
    <RectButton onPress={onPress}>
      <View style={[styles.option, isLastOption && styles.lastOption, { flexDirection: 'row' }]}>
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

function useStyles(){
  const Layout = useLayout();
  const {colors: Colors} = useColors();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFF',
    },

    optionIconContainer: {
      marginRight: 12,
    },
    option: {
      backgroundColor: '#ffffff33',
      paddingHorizontal: 15,
      paddingVertical: 15,
      marginVertical: 3*Layout.scale.height,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: Colors.primaryContrast,
  
  
    },
    lastOption: {
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
    optionText: {
      fontSize: 15 * Layout.scale.width,
      color: Colors.primaryContrast,
      fontFamily: 'opensans',
      alignSelf: 'flex-start',
      marginTop: 1,
    },
  });
  return styles
}

