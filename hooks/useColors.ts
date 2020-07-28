import { shallowEqual, useSelector } from "react-redux";
import {store} from "../components/store"

const tintColor = '#2f95dc';
const greenTheme = {
  primary: "#1f6e21",
  priamryL1: "#339135",
  primaryL2: "#c5e4c6",
  primaryContrast: "white",
  background: "white"
}
const orangeTheme = {
  primary: "#e44f2e",
  primaryL1: "#f48a6f",
  primaryL2: "#f3d494",
  primaryL3: "#f48a6f",
  primaryContrast: "white",
  background: "white",
}
const blueMagentaTheme ={
  primary: "#3b39c6",
  primaryL1: "#BD15F2",
  primaryL2: "#f3d494",
  primaryL3: "#f48a6f",
  primaryContrast: "white",
  background: "white",
}

const blueBlueTheme = {
  primary: "#2769EA",
  primaryL1: "#0ab7e2",
  primaryL2: "#f3d494",
  primaryL3: "#f48a6f",
  primaryContrast: "white",
  background: "white",
}

const purpleTheme ={
  primary: "#7174e5",
  primaryL1: "#5f5ec5",
  primaryL2: "#f3d494",
  primaryL3: "#f48a6f",
  primaryContrast: "white",
  background: "white",
}

const yellowGreen ={
  primary: "#44b89a",
  primaryL1: "#4496aa",
  primaryL2: "#f3d494",
  primaryL3: "#f48a6f",
  primaryContrast: "white",
  background: "white",
}

const redOrange ={
  primary: "#f25f26",
  primaryL1: "#ffbc23",
  primaryL2: "#f3d494",
  primaryL3: "#f48a6f",
  primaryContrast: "white",
  background: "white",
}

const purpleMagenta ={
  primary: "#9b1cce",
  primaryL1: "#f25f26",
  primaryL2: "#f3d494",
  primaryL3: "#f48a6f",
  primaryContrast: "white",
  background: "white",
}

const redRed ={
  primary: "#7b2928",
  primaryL1: "#ce5252",
  primaryL2: "#f3d494",
  primaryL3: "#f48a6f",
  primaryContrast: "white",
  background: "white"
}
export  enum Themes{
  BlueMagenta, YellowGreen, PurpleMagenta, RedRed, RedOrange, BlueBlue
}

const themes = [];
themes[Themes.BlueMagenta] = blueMagentaTheme;
themes[Themes.YellowGreen] = yellowGreen;
themes[Themes.PurpleMagenta] = purpleMagenta;
themes[Themes.RedRed] = redRed;
themes[Themes.RedOrange] = redOrange;
themes[Themes.BlueBlue] = blueBlueTheme;


export var currentTheme = Themes.BlueMagenta



 const colors = {
  appRed: "#f36468",
  appBlue: "#0273b1",
  gratitudeEntry: "#3371ce",
  myGratitudeEntry: "#61b333",
  tintColor,
  tabIconDefault: '#ccc',
  tabIconSelected: tintColor,
  tabBar: '#fefefe',
  errorBackground: 'red',
  errorText: '#fff',
  warningBackground: '#EAEB5E',
  warningText: '#666804',
  noticeBackground: tintColor,
  noticeText: '#fff',
};

export default {
  ...colors,
  ...themes[currentTheme]
}

export function useColors(){
  const currentTheme = useSelector((state)=>state.general.currentTheme)

  function changeTheme(theme: Themes){
  //  console.log(`changing theme to ${theme}`)
    store.dispatch({type: "SET_THEME", theme: theme})
  }

 // console.log(`now returning new colors ${JSON.stringify(themes[currentTheme])}`)
  return {colors: {...colors, ...themes[currentTheme]}, changeTheme, currentTheme}
}
