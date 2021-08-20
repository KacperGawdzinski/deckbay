import { COLORS } from '../configFiles/colors';

export const randomColor = () => {
  var result;
  var count = 0;
  for (var prop in COLORS) {
    if (Math.random() < 1 / ++count) {
      result = prop;
    }
  }
  return result;
};
