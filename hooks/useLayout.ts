import { useSafeArea } from 'react-native-safe-area-context';
import { Dimensions } from 'react-native';


const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const widthScale = width/ 320;
const heightScale = height / 680;
const ratio = ( width / height )  *2


type Layout =  {
    window: {
      width: number,
      height: number,
    },
    isSmallDevice: boolean,
    scale:{
      width: number,
      height: number
    } ,
    headerHeight: number
    ratio: number,
    safeTop: number,
    safeBottom: number,
    safeLeft: number,
    safeRight: number,
    belowHeader: number,
    marginTop: number
  };

const staticLayout: Layout =  {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
  scale:{
    width: widthScale,
    height: heightScale
  } ,
  marginTop: heightScale * 10,
  headerHeight:30 * heightScale ,
  ratio: ratio,
  safeTop: undefined,
  safeBottom: undefined,
  safeLeft: undefined,
  safeRight: undefined,
  belowHeader: undefined,
};
export function useLayout(): Layout{
    const deviceLayout = useSafeArea();
    staticLayout.safeTop = deviceLayout.top > 0? deviceLayout.top: 8 *  staticLayout.scale.height;
    staticLayout.safeBottom = deviceLayout.bottom;
    staticLayout.safeLeft = deviceLayout.left;
    staticLayout.safeRight = deviceLayout.right;
    staticLayout.belowHeader = staticLayout.safeTop + staticLayout.headerHeight + 20* staticLayout.scale.height

    return staticLayout;
}