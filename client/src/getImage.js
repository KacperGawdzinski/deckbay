import chess from './assets/images/chess_icon.png';
import checkers from './assets/images/checkers_icon.png';
import charades from './assets/images/charades_icon.png';

let imgs = {
    chess,
    checkers,
    charades
};

let getImage = (key) => imgs[key];

export default getImage;