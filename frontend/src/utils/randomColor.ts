import { COLORS_TAB } from '../configFiles/colors';

export const randomColor = () => {
  // var result;
  // var count = 0;
  // for (var prop in COLORS) {
  //   if (Math.random() < 1 / ++count) {
  //     result = prop;
  //   }
  // }
  // return result;
  // return COLORS.a;
  const random = Math.random();
  console.log(COLORS_TAB[(random * COLORS_TAB.length) | 0]);

  return COLORS_TAB[(random * COLORS_TAB.length) | 0];
};
