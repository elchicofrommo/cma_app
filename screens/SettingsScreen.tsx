import React, { useState, useEffect, useRef } from "react";
import {
  Picker,
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback
} from "react-native";
import DatePicker from "react-native-datepicker";



import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Ionicons } from "@expo/vector-icons";
import { Themes, useColors } from "../hooks/useColors";
import { connect, } from "react-redux";


import log from "../util/Logging"
import {signOut} from "./SignIn"

import { HeaderBackButton } from "@react-navigation/stack";

import mutateApi, { UpdateUserInput } from '../api/mutate'

import moment from 'moment'



import { useLayout } from '../hooks/useLayout'

enum Mode {
  VIEW, EDIT
}


function SettingsScreen({ operatingUser: opUser, ...props }: { operatingUser: User, props: any }) {
  log.info(`rendering SettingsScreen`);

  const { colors: Colors, changeTheme, currentTheme } = useColors();
  const styles = useStyles();
  const [isCancel, setIsCancel] = useState(false);

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState(opUser);
  const [name, setName] = useState(opUser.name)
  const [dos, setDos] = useState(moment(opUser.dos).format("MM/DD/YYYY"))

  const [mode, setMode] = useState(Mode.VIEW)

  function signOutAction() {
    setIsCancel(false);


   signOut().then(() => {
      props.navigation.goBack();
    })


  }

  function cancel() {
    log.info(`setting cancel ${isCancel}`);
    setIsCancel(true);
  }


  async function savePreferences() {

    const time = moment(dos).toDate().getTime()

    try {
      const input: UpdateUserInput = {
        id: opUser.id,
        dos: time,
        name,
        shareDos: false
      }
      type updateUserResult = {
        updateUser: User
      }
      const result = await mutateApi.updateUser(input)
      // log.info(JSON.stringify(result, null, 2))
      props.dispatchOperatingUser(result, ()=>setMode(Mode.VIEW))

      //   log.info(`result from save is ${result}`)
    } catch (err) {
      log.info(`error is  ${err}`);
      props.dispatchBanner({
        message: "Your data was not saved because your profile is incomplete.",
      });
    }
  }

  function SettingsSignoutButton() {
    const { colors } = useColors();
    return (
      <View style={{ paddingRight: 10 * layout.scale.width, marginBottom: -5 }}>
        <TouchableOpacity onPress={signOutAction}>
          <Ionicons name="ios-log-out" color={colors.primary1} size={36} />
        </TouchableOpacity>
      </View>
    );
  }
  React.useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => <SettingsSignoutButton />,
      headerLeft: () => <SettingsBackButton text={mode == Mode.VIEW ? "Back" : "Cancel"} navigation={props.navigation} />,
    });
  }, [mode]);
  const layout = useLayout()
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      enableOnAndroid={true}
      extraHeight={10}
      extraScrollHeight={10}
    >

      <View >
        <View style={[{ position: "absolute", zIndex: 10, top: 5 * layout.scale.height, right: 10 * layout.scale.width, borderRadius: 17 * layout.scale.width, paddingHorizontal: 5 * layout.scale.width, paddingVertical: 3 * layout.scale.height },
        mode == Mode.EDIT && { backgroundColor: Colors.primary1, }]}>
          <TouchableWithoutFeedback onPress={() => {
            if (mode == Mode.EDIT) {
              // if user presed in edit mode then it is a save. 
              savePreferences();
            }else{
              setMode(mode => {
                let m;
                m = mode == Mode.VIEW ? Mode.EDIT : Mode.VIEW
                log.info(`mode was ${mode} now it is ${m}`)
                return m
              })
            }

          }}>
            <Text style={[{ fontSize: 16 * layout.scale.width, color: Colors.primary1 }, mode == Mode.EDIT && { color: Colors.primaryContrast }]}>{mode == Mode.VIEW ? "Edit" : "Save"}</Text>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.textFieldContainer}>
          <TextInput
            placeholder="bill@cma.com"
            value={email}
            autoCapitalize="none"
            editable={false}
            style={[
              styles.textField,
              styles.disabledText,
              { height: 30 * layout.scale.width },
            ]}

          />
          <Text style={styles.inputLabel}>Email</Text>
        </View>
        <View style={styles.textFieldContainer}>
          <TextInput
            placeholder="*******"
            secureTextEntry={true}
            autoCapitalize="none"
            editable={false}
            value={password}
            style={[styles.textField, , styles.disabledText]}

          />
          <Text style={styles.inputLabel}>Password</Text>
        </View>

        <View style={styles.textFieldContainer}>
          <TextInput
            value={name}
            placeholder="John Barlycorn"
            autoCapitalize="words"
            editable={mode==Mode.EDIT}
            style={[styles.textField]}
            onChangeText={(value) => {
              setName(value)
            }}
          />
          <Text style={styles.inputLabel}>Name</Text>
        </View>

        <View style={styles.textFieldContainer}>
          <DatePicker
            style={{ width: "100%" }}
            date={dos}
            mode="date"
            disabled={mode==Mode.VIEW}
            placeholder="MM/DD/YYYY"
            format="MM/DD/YYYY"
            maxDate={moment().format("MM/DD/YYYY")}
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateInput: {
                borderWidth: 0,
              },
              dateIcon: {
                display: "none",
              },
              dateText: {
                fontSize: 20 * layout.scale.width,
                alignSelf: "flex-start",
              },
              placeholderText: {
                fontSize: 20 * layout.scale.width,
                alignSelf: "flex-start",
              },
            }}
            onDateChange={(date) => {
              setDos(date)
            }}
          />
          <Text style={styles.inputLabel}>Soberiety Date</Text>
        </View>
     {  /* <Picker selectedValue={currentTheme} style={{ height: 20, width: 300, alignSelf: 'center' }}
          onValueChange={(itemValue) => changeTheme(itemValue)} >

          <Picker.Item label="Blue Magenta" value={Themes.BlueMagenta} />
          <Picker.Item label="Purple Magenta" value={Themes.PurpleMagenta} />
          <Picker.Item label="Yellow Green" value={Themes.YellowGreen} />
          <Picker.Item label="Red Red" value={Themes.RedRed} />
          <Picker.Item label="Red Orange" value={Themes.RedOrange} />
          <Picker.Item label="Blue Orange" value={Themes.BlueOrange} />
          </Picker> */ }
      </View>
      <View
        style={{
          backgroundColor: "#fff",
          paddingHorizontal: 10 * layout.scale.width,
          paddingVertical: 15 * layout.scale.width,
          display: opUser.role !== "guest" ? "flex" : "none",
        }}
      ></View>


    </KeyboardAwareScrollView>
  );
}

export default connect(
  function mapStateToProps(state, ownProps) {
    return { operatingUser: state.general.operatingUser };
  },
  function mapDispatchToProps(dispatch, ownState) {
    return {

      dispatchBanner: (banner => {
        dispatch({ type: "SET_BANNER", banner })
      }),

      dispatchOperatingUser: (data, modeUpdate) => {
        dispatch(async (d1) => {
          return new Promise(resolve => {

            dispatch({ type: "UPDATE_OPERATING_USER", data })
            resolve();
          }).then(()=>{
            dispatch({ type: "SET_BANNER", banner: { message: "Profile Saved", status: "info" } })
            modeUpdate()
          })
        })

      }
    }

  }
)(SettingsScreen);

function useStyles() {
  const { colors: Colors } = useColors()
  const layout = useLayout()
  const styles = StyleSheet.create({

    title: {
      flex: 6,
      flexWrap: "wrap",
    },

    inputLabel: {
      fontSize: 10 * layout.scale.width,
      color: "red",
      height: 20 * layout.scale.width,
    },
    textFieldContainer: {
      paddingHorizontal: 10 * layout.scale.width,
      paddingVertical: 5 * layout.scale.width,
      flexDirection: "column",
      height: 50 * layout.scale.width,
    },

    button: {
      backgroundColor: Colors.primary1,
      paddingVertical: 5 * layout.scale.width,
      textAlign: "center",
      justifyContent: "center",
      flexDirection: "row",
      height: 40 * layout.scale.width,
    },

    container: {
      flex: 1,
      justifyContent: "space-between",
      backgroundColor: Colors.primaryContrast,
    },
    header: {
      flex: 1,
      flexDirection: "row",
    },


    textField: {
      fontSize: 19 * layout.scale.width,
      height: 30 * layout.scale.width,
    },
    disabledText: {
      color: "grey",
    },
    contentContainer: {
      paddingTop: 15,
    },

    option: {
      backgroundColor: "#fdfdfd",
      paddingHorizontal: 15,
      paddingVertical: 15,
      borderBottomWidth: 0,
      borderColor: "#ededed",
    },


  });
  return styles;
}


function SettingsBackButton({
  navigation,
  text
}: { text: string, navigation: any }) {

  const { colors: Colors } = useColors()
  return (
    <HeaderBackButton
      label={text}
      tintColor={Colors.primary1}
      onPress={(event) => {

        navigation.goBack();

      }}
    />
  );
}
