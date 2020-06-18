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

  primaryContrast: "white",
  background: "white",
}

export default {
  ...orangeTheme,
  appRed: "#f36468",
  appBlue: "#0273b1",
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
