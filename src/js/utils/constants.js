export const DUCK = {
  position: undefined,
  dx: 0,
  dy: 0,
  direction: 'right',
  speed: 8,
  fallSpeed: 4,
  frameRate: 10,
  frameIndex: 0,
  frames: {
    left: [
      '../../assets/initial/black/left/0.png',
      '../../assets/initial/black/left/1.png',
      '../../assets/initial/black/left/2.png',
    ],

    topLeft: [
      '../../assets/initial/black/top-left/0.png',
      '../../assets/initial/black/top-left/1.png',
      '../../assets/initial/black/top-left/2.png',
    ],

    right: [
      '../../assets/initial/black/right/0.png',
      '../../assets/initial/black/right/1.png',
      '../../assets/initial/black/right/2.png',
    ],

    topRight: [
      '../../assets/initial/black/top-right/0.png',
      '../../assets/initial/black/top-right/1.png',
      '../../assets/initial/black/top-right/2.png',
    ],

    dead: ['../../assets/initial/black/dead/0.png', '../../assets/initial/black/dead/1.png'],

    shot: ['../../assets/initial/black/shot/0.png'],
  },
};

export const DOG = {
  frames: {
    sniff: [
      '../../assets/initial/dog/sniff/0.png',
      '../../assets/initial/dog/sniff/1.png',
      '../../assets/initial/dog/sniff/2.png',
      '../../assets/initial/dog/sniff/3.png',
      '../../assets/initial/dog/sniff/4.png',
    ],
    jump: ['../../assets/initial/dog/jump/0.png', '../../assets/initial/dog/jump/1.png'],
    find: ['../../assets/initial/dog/find/0.png'],
    single: ['../../assets/initial/dog/single/0.png'],
    double: ['../../assets/initial/dog/double/0.png'],
    laugh: ['../../assets/initial/dog/laugh/0.png', '../../assets/initial/dog/laugh/1.png'],
  },
  frameIndex: 0,
  frameRate: 7,
};

export const SCENE = {
  frames: {
    tree:
      'https://raw.githubusercontent.com/MattSurabian/DuckHunt-JS/master/src/assets/images/scene/tree/0.png',
    ground:
      'https://raw.githubusercontent.com/MattSurabian/DuckHunt-JS/master/src/assets/images/scene/back/0.png',
    alive: '../../assets/initial/hud/alive.png',
    dead: '../../assets/initial/hud/dead.png',
    bullet: '../../assets/initial/hud/bullet.png',
    hit: '../../assets/initial/hud/hit.png',
    score: '../../assets/initial/hud/score.png',
    shot: '../../assets/initial/hud/shot.png',
    up: '../../assets/images/up.png',
    down: '../../assets/images/down.png',
    left: '../../assets/images/left.png',
    right: '../../assets/images/right.png',
    pause: '../../assets/images/pause.png',
    space: '../../assets/images/space.png',
  },
  bulletID: 0,
  duckID: 0,
  score: 0,
};

export const AIM = {
  position: undefined,
  frame: '../assets/initial/aim.png',
  speed: 8,
};

export const FLAGS = {
  paused: false,
  flyingAway: false,
  flewAway: false,
  shootDown: false,
  roundEnded: false,
};

export const AMOUNTS = {
  roundTime: 6,
  bullets: 3,
};
