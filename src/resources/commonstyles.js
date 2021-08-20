import {StyleSheet} from 'react-native';
import {
  colors,
  fontSize,
  fonts,
  responsiveHeight,
  responsiveWidth,
} from '@resources';

export const commonStyles = StyleSheet.create({
  textStyle: (
    size = '_14',
    color = 'textPrimaryColor',
    type = 'manroperExtraBold',
    includeFontPadding,
  ) => {
    return {
      color: colors[color],
      fontSize: fontSize[size],
      fontFamily: fonts[type],
      includeFontPadding,
    };
  },
  squareLayout: (size) => {
    return {
      width: size,
      aspectRatio: 1,
    };
  },
  imageHolderLeftRightSytle: (
    backgroundColor = colors.blue,
    width = responsiveWidth(33),
    height = responsiveHeight(4.5),
  ) => {
    return {
      width: width,
      height: height,
      backgroundColor: backgroundColor,
    };
  },
});
