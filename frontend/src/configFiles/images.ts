import charades from '../assets/images/charades_icon.png';
import checkers from '../assets/images/checkers_icon.png';
import chess from '../assets/images/chess_icon.png';

interface imageMap {
  [key: string]: string;
}

export const IMAGE_MAP: imageMap = {
  chess,
  checkers,
  charades,
};
