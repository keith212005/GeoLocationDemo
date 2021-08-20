import {StyleSheet} from 'react-native';

import {responsiveHeight, responsiveWidth} from '@resources';

export const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: responsiveHeight(70),
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
