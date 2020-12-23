import { FLAGS, DOG } from './utils/constants';
import { GameObject } from './utils/gameObjects';

const dog = GameObject({ className: 'dog', src: DOG.frames.single[0] });

let counter = 0; 

const changeFrame = (state) => {
  if (counter % DOG.frameRate === 0) {
    DOG.frameIndex += 1;
    if (DOG.frameIndex >= DOG.frames[state].length) DOG.frameIndex = 0;
  }
  dog.DOM.childNodes[0].src = DOG.frames[state][DOG.frameIndex];
};

const update = () => {
  if (FLAGS.flewAway) {
    counter += 1;
    DOG.seconds = parseInt(counter / 60, 10);

    if (FLAGS.shootDown) {
      changeFrame('single');
    } else {
      changeFrame('laugh');
    }

    if (DOG.seconds < 1) {
      dog.translate(0, -2);
    } else if (DOG.seconds === 2) {
      dog.translate(0, 2);
    }
  }
};

export default update;
