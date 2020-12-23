import { GameObject } from "./utils/gameObjects";
import { DUCK, FLAGS } from "./utils/constants";

const duck = GameObject({ className: "duck", src: DUCK.frames.right[0] });

let dCounter = 0;

const setDirection = (xDir, yDir) => {
  if (xDir > 0 && yDir > 0) {
    DUCK.direction = "right";
  } else if (xDir > 0 && yDir < 0) {
    DUCK.direction = "topRight";
  } else if (xDir < 0 && yDir > 0) {
    DUCK.direction = "left";
  } else if (xDir < 0 && yDir < 0) {
    DUCK.direction = "topLeft";
  }

  // Setting constant speed to duck by: V^2 = Vx^2 + Vy^2
  // and randomizing directions
  DUCK.dx = Math.random() * DUCK.speed * xDir;
  DUCK.dy = Math.sqrt(DUCK.speed ** 2 - DUCK.dx ** 2) * yDir;
};

const outOfBorder = () => {
  return (
    DUCK.position.top < -DUCK.position.height ||
    DUCK.position.left < -DUCK.position.width ||
    DUCK.position.right < -DUCK.position.width ||
    DUCK.position.bottom < 0
  );
};

const duckDead = () => {
  dCounter += 1;
  DUCK.seconds = dCounter / 60;
  if (DUCK.seconds <= 0.3) {
    DUCK.direction = "shot";
    DUCK.dy = 0;
  } else {
    DUCK.direction = "dead";
    DUCK.dy = DUCK.fallSpeed;
  }
  DUCK.dx = 0;
};

const setMovement = () => {
  const rndDir = Math.random() > 0.5 ? 1 : -1;

  if (!FLAGS.flyingAway) {
    if (DUCK.position.left <= 0) {
      setDirection(1, rndDir);
      return;
    }
    if (DUCK.position.right <= 0) {
      setDirection(-1, rndDir);
      return;
    }
    if (DUCK.position.top <= 0) {
      setDirection(rndDir, 1);
      return;
    }
  }

  if (!FLAGS.shootDown && DUCK.position.bottom <= window.innerHeight / 8) {
    setDirection(rndDir, -1);
  } else if (FLAGS.shootDown) {
    duckDead();
  }

  if (outOfBorder()) {
    FLAGS.flewAway = true;
    duck.DOM.style.transform = "matrix(1, 0, 0, 1, 0, 0)";
  }
};

const changeFrame = (counter) => {
  if (counter % DUCK.frameRate === 0) {
    DUCK.frameIndex += 1;
    if (DUCK.frameIndex >= DUCK.frames[DUCK.direction].length)
      DUCK.frameIndex = 0;
  }
  duck.DOM.childNodes[0].src = DUCK.frames[DUCK.direction][DUCK.frameIndex];
};

const update = (counter) => {
  DUCK.position = duck.position();

  setMovement();
  changeFrame(counter);

  duck.translate(DUCK.dx, DUCK.dy);
};

export default update;
