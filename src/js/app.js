import scene from './scene';
import updateDuck from './duck';
import updateAim from './aim';
import updateDog from './dog';
import { loadImages } from './utils/loadImages';
import { DUCK, DOG, FLAGS, AMOUNTS, SCENE } from './utils/constants';

let animationID = 0;

const toggleActive = (current) => {
  document.querySelector('.active').classList.remove('active');
  current.classList.add('active');
};

const setInitialPauseOption = () => {
  if (!scene.DOM.classList.contains('paused')) {
    toggleActive(document.querySelector('.resume'));
  }
};

const animate = () => {
  const seconds = parseInt(animationID / 60, 10);

  // Defining round time
  if ((seconds === AMOUNTS.roundTime && !FLAGS.shootDown) || AMOUNTS.bullets === 0) {
    FLAGS.flyingAway = true;
  }

  if (FLAGS.flyingAway) {
    scene.DOM.classList.add('flying-away');
  }

  setInitialPauseOption();

  if (!FLAGS.paused) {
    updateDuck(animationID);
    updateAim(scene.keyState);
    updateDog();
    animationID += 1;
  }

  requestAnimationFrame(animate);
};

const paintDuckIcon = () => {
  if (FLAGS.shootDown) {
    const currentDuck = document.querySelector('.alive');
    currentDuck.childNodes[0].src = SCENE.frames.dead;
    currentDuck.classList.remove('alive');
  }
};

const handleShot = () => {
  if (scene.keyState[32]) {
    AMOUNTS.bullets -= 1;
    const current = document.querySelector(`#bullet__${AMOUNTS.bullets}`);
    if (current) current.style.opacity = 0;
    paintDuckIcon();
  }
};

const chooseOption = () => {
  const current = document.querySelector('.active');
  const options = document.querySelectorAll('.option');
  const controls = document.querySelector('.controls-info');
  if (!controls.classList.contains('active')) {
    if (scene.keyState[40]) {
      if (current.nextElementSibling) {
        toggleActive(current.nextElementSibling);
      } else {
        toggleActive(options[0]);
      }
    } else if (scene.keyState[38]) {
      if (current.previousElementSibling) {
        toggleActive(current.previousElementSibling);
      } else {
        toggleActive(options[options.length - 1]);
      }
    }
  }

  if (scene.keyState[13]) {
    if (current.classList.contains('resume')) {
      FLAGS.paused = false;
      scene.DOM.classList.toggle('paused');
    } else if (current.classList.contains('restart')) {
      // restart
    } else if (current.classList.contains('controls')) {
      // show constrols
      controls.classList.toggle('active');
    }
  }
};

const handlePause = () => {
  if (scene.keyState[80]) {
    FLAGS.paused = !FLAGS.paused;
    scene.DOM.classList.toggle('paused');
    document.querySelector('.controls-info').classList.remove('active');
  }

  if (FLAGS.paused) {
    chooseOption();
  }
};

const keyUp = () => {
  handlePause();
  handleShot();
};

const app = () => {
  scene.startKeyEvents({
    keyup: keyUp,
  });

  loadImages([DUCK.frames, DOG.frames, SCENE.frames], animate);
};

export default app;
