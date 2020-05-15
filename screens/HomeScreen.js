import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, Button, Dimensions } from 'react-native';
import { BorderlessButton, ScrollView } from 'react-native-gesture-handler';
import {NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUserCircle, faSearch} from '@fortawesome/free-solid-svg-icons';
import { fromBottom } from 'react-navigation-transitions';
import { MonoText } from '../components/StyledText';
import {WebView} from 'react-native-webview';
import { connect } from 'react-redux';
import moment from 'moment'

// Screens imported
import SoberietyTime from '../components/SoberietyTime'
import SettingsScreen from './SettingsScreen';
import MeetingSearchScreen from './MeetingSearchScreen';
import DailyReading from '../components/DailyReading';
const {
  width: SCREEN_WIDTH, 
  height: SCREEN_HEIGHT
} = Dimensions.get('window')
const fontScale = SCREEN_WIDTH / 320;

// assets imported
import Logo from '../assets/images/LogoComponent'
import SplashScreen  from './SplashScreen'
const HomeStack = createStackNavigator();

export default function HomeScreenStack(){
  return (
    <HomeStack.Navigator >
      <HomeStack.Screen 
        name="Crystal Meth Anonymous" 
        component={HomeScreen} 
        options={({navigation, route})=>({

          headerStyle: {
            backgroundColor: '#1f6e21',
            
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontFamily: 'merriweather',
            fontSize:  18 * fontScale
          },
          headerLeft: ()=>{ 
            return (
              <CustomButton icon={faUserCircle} 
                callback={() => navigation.navigate('Settings')} 
                style={{color: 'white', marginLeft: 10}}  
                size={25} />
            )},
          headerRight: ()=>{ 
              return (
                <CustomButton icon={faSearch} 
                  callback={() => navigation.navigate('Search')} 
                  style={{color: 'white', marginRight: 10}}  
                  size={25} />
              )},
        })}
        />
      <HomeStack.Screen
        name="Settings"
        component={SettingsScreen} 
        options={({navigation, route})=>({

          headerStyle: {
            backgroundColor: '#1f6e21',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          }
        })}/>
      <HomeStack.Screen
        name="Search"
        component={MeetingSearchScreen} 
        options={({navigation, route})=>({

          headerStyle: {
            backgroundColor: '#1f6e21',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          }
        })}/>
    </HomeStack.Navigator>
  )
}

function CustomButton({icon, callback, ...rest}){
  console.log(`${JSON.stringify(icon)}`)
  return (
      <BorderlessButton style={[styles.button]} onPress={()=>{callback()}}>

          <FontAwesomeIcon icon={icon} style={styles.icon} {...rest}/>

      </BorderlessButton>
  )
}


function HomeScreen({navigation, ...props}) {
  let twentyFour = props.general.dailyReaders.twentyFour;
  let men = props.general.dailyReaders.men;
  let women = props.general.dailyReaders.women;
  let readerDate = moment(props.general.readerDate)
  const holder =         <View style={styles.helpContainer}>
  <TouchableOpacity onPress={handleHelpPress} style={styles.helpLink}>
    <Text style={styles.helpLinkText}>Help, it didn’t automatically reload!</Text>
  </TouchableOpacity>
</View>
  console.log(`reader date is ${readerDate} and original is ${props.general.readerDate.toISOString()}`)
  return (
    <View style={styles.container}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.readingTitle}>Daily Reading {readerDate.format("MM/DD")}</Text>
        <DailyReading subtitle={twentyFour.subtitle} reading={{...twentyFour[readerDate.format('MM-DD')], ...men[readerDate.format('MM-DD')], ...women[readerDate.format('MM-DD')]}} />

        
        <View style={styles.meetings}>
          <Text>Meeting section</Text>
        </View>
        <View style={styles.gratitude}>
          <Text>Gratitude section</Text>
        </View>
      </ScrollView>

      <SoberietyTime />
    </View>
  );
}

HomeScreen = connect(
    function mapStateToProps(state, ownProps){
        return state;
      }, 
      function mapDispatchToProps(dispatch){
        return {
          testFunction: (testInput) => {
            console.log("dispatching test function with input " + testInput)
          }
        }
      }
)(HomeScreen)

HomeScreen.navigationOptions = {
  header: null,
};

function DevelopmentModeNotice() {
  if (__DEV__) {
    const learnMoreButton = (
      <Text onPress={handleLearnMorePress} style={styles.helpLinkText}>
        Learn more
      </Text>
    );

    return (
      <Text style={styles.developmentModeText}>
        Development mode is enabled: your app will be slower but you can use useful development
        tools. {learnMoreButton}
      </Text>
    );
  } else {
    return (
      <Text style={styles.developmentModeText}>
        You are not in development mode: your app will run at full speed.
      </Text>
    );
  }
}

function handleLearnMorePress() {
  WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/workflow/development-mode/');
}

function handleHelpPress() {
  WebBrowser.openBrowserAsync(
    'https://docs.expo.io/versions/latest/get-started/create-a-new-app/#making-your-first-change'
  );
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D4DAD4',
  },
  readingTitle: {
    fontSize: 18 * fontScale,
    paddingLeft: 7* fontScale,

  },
  meetings:{
    height: '30%',
    borderColor: '#fff',
    borderBottomWidth: 3,
    height: '30%'
  },
  gratitude:{
    height: '30%',
    borderColor: '#fff',
    height: '30%'
  },
  contentContainer: {
    flex: 1,
    justifyContent: "flex-start"
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },

  getStartedContainer: {
    marginHorizontal: 20,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },

  helpContainer: {
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },

});
