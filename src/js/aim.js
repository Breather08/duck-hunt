import { GameObject } from './utils/gameObjects';
import { AIM, DUCK, FLAGS, AMOUNTS } from './utils/constants';

const aim = GameObject({
  className: 'aim',
  src: AIM.frame,
});

const vx = AIM.speed;
const vy = AIM.speed;

const block = (pos, wh) => {
  return pos - wh + AIM.speed >= 0;
};

const aimingDuck = () => {
  const aimX = AIM.position.left + AIM.position.width / 2;
  const aimY = AIM.position.top + AIM.position.height / 2;
  const matchesX = aimX >= DUCK.position.left && aimX <= DUCK.position.left + DUCK.position.width;
  const matchesY = aimY >= DUCK.position.top && aimY <= DUCK.position.top + DUCK.position.height;
  return matchesX && matchesY;
};

const moveAim = (keyState) => {
  AIM.position = aim.position();

  const state = {
    left: keyState[37],
    right: keyState[39],
    up: keyState[38],
    down: keyState[40],
    shoot: keyState[32],
  };

  if (state.left && block(AIM.position.left, AIM.position.width)) {
    aim.translate(-vx, 0);
  }

  if (state.right && block(AIM.position.right, AIM.position.width)) {
    aim.translate(vx, 0);
  }

  if (state.up && block(AIM.position.top, AIM.position.height)) {
    aim.translate(0, -vy);
  }

  if (state.down && block(AIM.position.bottom - 250, AIM.position.height)) {
    aim.translate(0, vy);
  }

  if (state.shoot && AMOUNTS.bullets > 0) {
    if (aimingDuck()) FLAGS.shootDown = true;
  }
  
};

const update = (keyState) => {
  moveAim(keyState);
};

export default update;
