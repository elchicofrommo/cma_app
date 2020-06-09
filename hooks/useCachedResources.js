import { Ionicons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as React from 'react';

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();

        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          'space-mono': require('../assets/fonts/SpaceMono-Regular.ttf'),
          'merriweather': require('../assets/fonts/Merriweather/Merriweather-Regular.ttf'),
          'merriweather-bold': require('../assets/fonts/Merriweather/Merriweather-Bold.ttf'),
          'merriweather-italic': require('../assets/fonts/Merriweather/Merriweather-Italic.ttf'),
          'opensans': require('../assets/fonts/OpenSans/OpenSans-Regular.ttf'),
          'opensans-bold': require('../assets/fonts/OpenSans/OpenSans-SemiBold.ttf')
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}
