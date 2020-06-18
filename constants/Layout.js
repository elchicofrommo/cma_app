import { Dimensions } from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const widthScale = width/ 320;
const heightScale = height / 680;
const ratio = ( width / height )  *2

export default {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
  scale:{
    width: widthScale,
    height: heightScale
  } ,
  ratio: ratio
};
