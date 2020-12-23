import { Scene } from './utils/gameObjects';
import createElement from './utils/createElement';
import { SCENE } from './utils/constants';

const scene = Scene();

const flyingAway = createElement({
  tagName: 'div',
  classNames: 'flying-away-msg',
});

const option = (classNames) => {
  return createElement({
    tagName: 'div',
    classNames,
  });
};

const ground = createElement({
  tagName: 'div',
  classNames: 'ground-container',
  children: [
    createElement({
      tagName: 'img',
      attrs: [['src', SCENE.frames.ground]],
    }),
  ],
});

const tree = createElement({
  tagName: 'div',
  classNames: 'tree-container',
  children: [
    createElement({
      tagName: 'img',
      attrs: [['src', SCENE.frames.tree]],
    }),
  ],
});

const setInfoBlock = (src, info) => {
  return createElement({
    tagName: 'div',
    classNames: 'info-block',
    children: [
      createElement({
        tagName: 'img',
        attrs: [['src', src]],
      }),
      createElement({
        tagName: 'p',
        textContent: info,
      }),
    ],
  });
};

const controlsInfo = createElement({
  tagName: 'div',
  classNames: 'controls-info',
  children: [
    setInfoBlock(SCENE.frames.up, 'Up'),
    setInfoBlock(SCENE.frames.down, 'Down'),
    setInfoBlock(SCENE.frames.left, 'Left'),
    setInfoBlock(SCENE.frames.right, 'Right'),
    setInfoBlock(SCENE.frames.space, 'Shoot'),
    setInfoBlock(SCENE.frames.pause, 'Pause'),
  ],
});

const pauseMenu = createElement({
  tagName: 'div',
  classNames: 'pauseMenu',
  children: [
    createElement({
      tagName: 'div',
      classNames: 'options',
      children: [
        option('active option resume'),
        option('restart option'),
        option('controls option'),
      ],
    }),
    controlsInfo,
  ],
});

const duckIcons = (state, src) => {
  const icons = [];
  for (let i = 0; i < 10; i += 1) {
    icons.push(
      createElement({
        tagName: 'div',
        classNames: `duck-icon ${state}`,
        children: [
          createElement({
            tagName: 'img',
            attrs: [
              ['id', `duck__${i}`],
              ['src', src],
              ['width', '100%'],
              ['height', '100%'],
            ],
          }),
        ],
      }),
    );
  }
  return icons;
};

const hits = () => {
  return createElement({
    tagName: 'div',
    classNames: 'duck-hits',
    children: [...duckIcons('alive', SCENE.frames.alive)],
  });
};

const bullets = (src) => {
  const blts = [];
  for (let i = 0; i < 3; i += 1) {
    blts.push(
      createElement({
        tagName: 'div',
        classNames: 'bullet-icon',
        children: [
          createElement({
            tagName: 'img',
            attrs: [
              ['id', `bullet__${i}`],
              ['src', src],
              ['width', '100%'],
              ['height', '100%'],
            ],
          }),
        ],
      }),
    );
  }
  return blts;
};

const bulletsDiv = () => {
  return createElement({
    tagName: 'div',
    classNames: 'bullets',
    children: [...bullets(SCENE.frames.bullet)],
  });
};

const score = () => {
  return createElement({
    tagName: 'div',
    classNames: 'score',
    children: [
      createElement({
        tagName: 'p',
        textContent: '000000',
      }),
    ],
  });
};

const hud = createElement({
  tagName: 'div',
  classNames: 'hud',
  children: [hits(), bulletsDiv(), score()],
});

scene.DOM.append(flyingAway, pauseMenu, tree, ground, hud);

export default scene;
