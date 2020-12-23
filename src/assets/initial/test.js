function createElement({ tagName, classNames, children, attrs, textContent, onClick, onChange }) {
  const element = document.createElement(tagName);

  if (classNames) {
    element.classList.add(...classNames.split(' '));
  }

  if (children && children.length) {
    children.forEach((child) => {
      element.append(child);
    });
  }

  if (attrs && attrs.length) {
    attrs.forEach(([attrName, attrVal]) => {
      element.setAttribute(attrName, attrVal);
    });
  }

  if (textContent) {
    element.textContent = textContent;
  }

  if (onClick) {
    if (Array.isArray(onClick)) {
      onClick.forEach((item) => {
        element.addEventListener('click', item);
      });
    } else {
      element.addEventListener('click', onClick);
    }
  }

  if (onChange) {
    element.addEventListener('change', onChange);
  }

  return element;
}

const global = new Global();
// by indexes: 0 - move points, 1 - speed, 2 - sign (direction)
const duck = new Duck([0, 0, Math.sign(Math.random() - 0.5)], [0, 0, -1], 8);
const dog = new Dog();
const aim = new Aim(8);

function Global() {
  this.animationID = 0;
  this.maxBullets = 3;
  this.maxDucks = 10;
  this.duckThreshold = 8;

  this.counters = {
    timeLine: 0,
    shotIndex: 0,
    cycle: 0,
    rounds: 1,
    scoreValue: 0,
    ducksShot: 0,
    imagesCounter: 0,
    imagesOnLoadCounter: 0,
    switchIndex: 1,
  };

  this.flags = {
    isPaused: false,
    shootDown: false,
    flewAway: false,
    flyingAway: false,
    outOfBullets: false,
    falling: false,
    gameOver: false,
    atResume: false,
    restart: false,
  };

  this.keyState = {};

  this.main = document.querySelector('.main');

  this.windowWidth = document.documentElement.clientWidth;
  this.windowHeight = document.documentElement.clientHeight;

  this.methods = {
    action(event) {
      const { flags, counters } = global;
      // Pause (P)
      if (event.keyCode === 80) {
        flags.isPaused = !flags.isPaused;
      }
      // Shoot (Space)
      else if (
        event.keyCode === 32 &&
        !flags.outOfBullets &&
        !flags.isPaused &&
        counters.timeLine > 300
      ) {
        this.bulletWaste();

        if (aim.hitDuck()) {
          counters.ducksShot++;
          flags.falling = true;
          this.hudChange();
        }
      }
      // Enter
      else if (event.keyCode === 13 && flags.gameOver) {
        flags.gameOver = false;
        counters.rounds = 0;
        document.querySelector('.restart').style.opacity = 0;
        document.querySelector('.round').innerHTML = 'R=1';
      }

      if (flags.isPaused) {
        const pointer = document.querySelector('#pointer');
        const pauseMenu = document.querySelector('.pauseMenu');
        pauseMenu.style.opacity = 0.6;
        if (event.keyCode === 40) {
          flags.atResume = true;
          pointer.style.top = '47.5vh';
        } else if (event.keyCode === 38) {
          flags.atResume = false;
          pointer.style.top = '37.5vh';
        }

        if (event.keyCode === 13) {
          flags.isPaused = false;
          flags.restart = true;
          if (flags.atResume) {
            pauseMenu.style.opacity = 0;
          } else {
            resetRound();
          }
        }
        // pointer.style.transitionDuration = '500ms';
      }
    },

    addRound() {
      const roundIcon = document.querySelector('.round');
      roundIcon.innerHTML = `R=${global.counters.rounds}`;
    },

    blink(element) {
      const { counters } = global;
      if (counters.timeLine % 30 === 0) {
        element.style.transitionDuration = '1000ms';
        element.style.opacity = counters.switchIndex;
        counters.switchIndex = -counters.switchIndex;
      }
    },

    bulletWaste() {
      const { flags, counters, maxBullets } = global;

      const bullet = document.querySelector(`#bullet-${counters.shotIndex}`);
      bullet.style.opacity = 0;
      counters.shotIndex++;
      if (counters.shotIndex === maxBullets) {
        flags.flyingAway = true;
        flags.outOfBullets = true;
      }
    },

    clearAndAppend(to, element) {
      to.innerHTML = '';
      to.append(element);
    },

    gameOver(opacity) {
      const gameOverDiv = document.querySelector('.gameOver');
      gameOverDiv.style.opacity = opacity;
      console.log('game over');
    },

    hudChange() {
      this.scoreBlink();
      this.scoreChange();
      this.iconChange();
    },

    iconBlink(timeLine) {
      const duckIcon = document.querySelector(`#alive-duck-${global.counters.cycle}`);
      this.blink(duckIcon, timeLine);
    },

    iconChange() {
      const duckIcon = document.querySelector(`#alive-duck-${global.counters.cycle}`);
      duckIcon.src = 'hud/dead.png';
    },

    getOffsetRect(elem) {
      const box = elem.getBoundingClientRect();

      const { body } = document;
      const docElem = document.documentElement;

      const scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
      const scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;

      const clientTop = docElem.clientTop || body.clientTop || 0;
      const clientLeft = docElem.clientLeft || body.clientLeft || 0;
      const clientWidth = docElem.clientWidth || body.clientWidth || 0;
      const clientHeight = docElem.clientHeight || body.clientHeight || 0;

      const top = box.top + scrollTop - clientTop;
      const left = box.left + scrollLeft - clientLeft;

      return {
        top: Math.round(top),
        left: Math.round(left),
        width: Math.round(clientWidth),
        height: Math.round(clientHeight),
      };
    },

    getRandom(elem) {
      Math.floor(Math.random() * Math.floor(elem.length));
    },

    resetBullets() {
      const bullets = [...document.getElementsByClassName('bullet')];
      bullets.forEach((bullet) => {
        bullet.style.opacity = 1;
      });
    },

    resetIcons() {
      const ducks = [...document.getElementsByClassName('duckIcon')];
      ducks.forEach((duckIcon) => {
        duckIcon.style.opacity = 1;
        duckIcon.src = 'hud/alive.png';
      });
    },

    scoreBlink() {
      const points = document.querySelector('.points');
      points.style.transform = `
            translate(
                ${duck.position.left - global.windowWidth * 0.15}px, 
                ${duck.position.top}px
                )`;
      points.innerHTML = '1000';
      points.style.color = 'white';
      points.style.opacity = 1;
    },

    scoreChange() {
      const score = document.querySelector('#counter');
      global.counters.scoreValue += 1000;
      score.innerHTML = `${global.counters.scoreValue}`;
    },
  };
}

function Dog() {
  this.index = 0;
  this.frameID = 0;
  this.position = undefined;
  this.container = document.querySelector('.dog-container');
  this.imageTags = {};
  this.frames = {
    sniff: [
      './dog/sniff/0.png',
      './dog/sniff/1.png',
      './dog/sniff/2.png',
      './dog/sniff/3.png',
      './dog/sniff/4.png',
    ],
    jump: ['./dog/jump/0.png', './dog/jump/1.png'],
    find: ['./dog/find/0.png'],
    single: ['./dog/single/0.png'],
    double: ['./dog/double/0.png'],
    laugh: ['./dog/laugh/0.png', './dog/laugh/1.png'],
  };

  this.progress = () => {
    const { methods } = global;

    this.frameID++;
    this.position = methods.getOffsetRect(this.container);

    if (this.frameID % 10 === 0) {
      this.index++;
      if (this.index >= 5) this.index = 0;
    }
  };

  this.single = (y) => {
    const { methods } = global;
    this.container.style.left = '40%';
    this.container.style.transform = `translate(0px, ${y * 0.3}vh)`;
    methods.clearAndAppend(this.container, this.imageTags.single[0]);
  };

  this.laugh = (y) => {
    const { methods } = global;
    if (this.frameID % 7 === 0) {
      this.index++;
      if (this.index >= 2) this.index = 0;
    }
    this.container.style.left = '40%';
    this.container.style.transform = `translate(0px, ${y * 0.3}vh)`;
    methods.clearAndAppend(this.container, this.imageTags.laugh[this.index]);
  };

  this.jumpStage1 = () => {
    const { methods } = global;
    methods.clearAndAppend(this.container, this.imageTags.jump[0]);
  };

  this.jumpStage2 = () => {
    const { container, imageTags } = this;
    container.style.transitionDuration = `${200}ms`;
    global.methods.clearAndAppend(container, imageTags.jump[1]);
    container.style.opacity = 0;
  };

  this.initialize = () => {
    this.container.style.transitionDuration = '0ms';
    this.frameID = 0;
    this.container.style.opacity = 0;
  };

  this.sniff = () => {
    const { methods } = global;
    methods.clearAndAppend(this.container, this.imageTags.sniff[this.index]);
  };

  this.found = () => {
    const { methods } = global;
    methods.clearAndAppend(this.container, this.imageTags.find[0]);
  };

  this.search = new DogSniff();
  this.reaction = new DogReaction();
}

function Duck(x, y, speed) {
  this.x = x;
  this.y = y;
  this.spot = 0;
  this.speed = speed;
  this.index = 0;
  this.frameID = 0;
  this.fallFrames = 0;
  this.position = undefined;
  this.container = document.querySelector('.duck-container');
  this.imageTags = {};
  this.frames = {
    left: ['./black/left/0.png', './black/left/1.png', './black/left/2.png'],

    topLeft: ['./black/top-left/0.png', './black/top-left/1.png', './black/top-left/2.png'],

    right: ['./black/right/0.png', './black/right/1.png', './black/right/2.png'],

    topRight: ['./black/top-right/0.png', './black/top-right/1.png', './black/top-right/2.png'],

    dead: ['./black/dead/0.png', './black/dead/1.png', './black/dead/2.png'],

    shot: ['./black/shot/0.png'],
  };

  this.constantSpeed = () => {
    return [Math.random() * this.speed, Math.sqrt(this.speed ** 2 - this.x[1] ** 2)];
  };

  this.changeSpeed = () => {
    const { x, y, constantSpeed } = this;
    x[1] = constantSpeed()[0];
    y[1] = constantSpeed()[1];
  };

  this.directionSwitch = (direction1, direction2, x1, y1, x2, y2) => {
    this.changeSpeed();
    if (direction1) {
      this.x[2] = x1;
      this.y[2] = y1;
    } else if (direction2) {
      this.x[2] = x2;
      this.y[2] = y2;
    }
  };

  this.escape = () => {
    const { flags, main } = global;
    if (this.frameID === 350 || flags.flyingAway || flags.outOfBullets) {
      main.style.backgroundColor = 'pink';
      flags.flyingAway = true;
      document.querySelector('.flyAway').style.opacity = 1;
    }
  };

  this.hitBorder = (directions) => {
    const { topLeft, topRight, bottomLeft, bottomRight } = directions;
    const { x, position, spot } = this;
    const { flags, windowWidth, windowHeight } = global;
    if (!flags.flyingAway) {
      // Top
      if (position.top <= 0) {
        this.directionSwitch(topLeft, topRight, -1, 1, 1, 1);
      }
      // Left
      else if (x[0] <= -spot) {
        this.directionSwitch(topLeft, bottomLeft, 1, -1, 1, 1);
      }
      // Right
      else if (position.left >= windowWidth * 0.78) {
        this.directionSwitch(bottomRight, topRight, -1, 1, -1, -1);
      }
    }
    // Bottom
    // Duck can't fly away from bottom
    if (position.top >= windowHeight * 0.75) {
      this.directionSwitch(bottomRight, bottomLeft, 1, -1, -1, -1);
    } else if (
      flags.flyingAway &&
      (position.top < -windowHeight || x[0] <= -spot - 80 || position.left >= windowWidth - 20)
    ) {
      flags.flewAway = true;
      console.log('flew away');
    }
  };

  this.imageSwitch = (directions, index) => {
    const { clearAndAppend } = global.methods;
    const { container, imageTags } = this;

    // Changing image depending on direction
    if (directions.bottomRight) {
      clearAndAppend(container, imageTags.right[index]);
    } else if (directions.topRight) {
      clearAndAppend(container, imageTags.topRight[index]);
    } else if (directions.bottomLeft) {
      clearAndAppend(container, imageTags.left[index]);
    } else if (directions.topLeft) {
      clearAndAppend(container, imageTags.topLeft[index]);
    }
  };

  this.flying = (directions) => {
    this.escape();

    this.x[0] += this.x[2] * this.x[1];
    this.y[0] += this.y[2] * this.y[1];

    this.imageSwitch(directions, this.index);
    this.hitBorder(directions);
  };

  this.falling = () => {
    const { methods, windowHeight, flags } = global;

    this.y[0] += 4;
    methods.clearAndAppend(this.container, this.imageTags.dead[this.index]);

    if (this.position.top >= windowHeight * 0.8) {
      flags.shootDown = true;
    }
  };

  this.agony = () => {
    const { methods } = global;
    methods.clearAndAppend(this.container, this.imageTags.shot[0]);
  };

  this.progress = () => {
    const { methods } = global;

    this.frameID++;
    this.container.style.opacity = 1;

    if (this.frameID % 5 === 0) {
      this.index++;
      if (this.index === 3) this.index = 0;
    }
    this.position = methods.getOffsetRect(this.container);
  };

  this.initialize = () => {
    this.spot = 100 + Math.random() * 500;
    this.x[0] = 0;
    this.y[0] = 0;
    this.fallFrames = 0;
    this.frameID = 0;
    global.counters.shotIndex = 0;
    this.container.style.opacity = 0;
  };
  this.move = new DuckMovement(this);
}

function Aim(speed) {
  this.speed = speed;
  this.position = undefined;
  this.container = document.querySelector('.aim-container');
  this.hitDuck = () => {
    if (
      this.position.top >= duck.position.top &&
      this.position.top <= duck.position.top + duck.container.offsetHeight &&
      this.position.left >= duck.position.left &&
      this.position.left <= duck.position.left + duck.container.offsetWidth
    ) {
      return true;
    }
    console.log(duck.container.offsetWidth, duck.container.offsetHeight);
    return false;
  };
  this.move = new AimMovement(this);
}

const start = () => {
  const { main, counters } = global;

  const build = () => {
    const dogImg = createElement({
      tagName: 'img',
      classNames: 'dog',
    });

    const dogContainer = createElement({
      tagName: 'div',
      classNames: 'dog-container',
      children: [dogImg],
    });

    dog.container = dogContainer;
    main.append(dogContainer);

    const points = createElement({
      tagName: 'span',
      classNames: 'points',
    });
    main.append(points);

    const styleMain = createElement({
      tagName: 'link',
      attrs: [
        ['rel', 'stylesheet'],
        ['type', 'text/css'],
        ['href', 'duck-style.css'],
      ],
    });

    const duckImg = createElement({
      tagName: 'img',
      classNames: 'duck',
    });

    const duckContainer = createElement({
      tagName: 'div',
      classNames: 'duck-container',
      children: [duckImg],
    });

    duck.container = duckContainer;
    main.append(duckContainer);

    document.head.append(styleMain);

    const flyText = createElement({
      tagName: 'p',
      textContent: 'Fly Away',
    });

    const flyAwayDiv = createElement({
      tagName: 'div',
      classNames: 'flyAway',
      children: [flyText],
    });

    const pressStart = createElement({
      tagName: 'span',
      textContent: 'Press "Enter" to kill birds again',
    });

    const pressStartDiv = createElement({
      tagName: 'div',
      classNames: 'restart',
      children: [pressStart],
    });

    main.append(flyAwayDiv);

    const gameOverText = createElement({
      tagName: 'p',
      textContent: 'Game Over',
    });

    const gameOverDiv = createElement({
      tagName: 'div',
      classNames: 'gameOver',
      children: [gameOverText],
    });

    main.append(gameOverDiv);

    const aimImg = createElement({
      tagName: 'img',
      classNames: 'aim',
      attrs: [['src', 'aim_PNG42.png']],
    });

    const aimContainer = createElement({
      tagName: 'div',
      classNames: 'aim-container',
      children: [aimImg],
    });

    aim.container = aimContainer;

    const aimStyle = createElement({
      tagName: 'link',
      attrs: [
        ['rel', 'stylesheet'],
        ['type', 'text/css'],
        ['href', 'aim-style.css'],
      ],
    });

    const gameScene = createElement({
      tagName: 'link',
      attrs: [
        ['rel', 'stylesheet'],
        ['type', 'text/css'],
        ['href', 'style.css'],
      ],
    });

    document.head.append(aimStyle, gameScene);
    main.append(aimContainer);
  };

  const imageOnload = () => {
    counters.imagesOnLoadCounter++;
    console.log('image loaded');
    if (counters.imagesOnLoadCounter === counters.imagesCounter) {
      animate();
      console.log('all images loaded');
    }
  };

  const loadImages = async (imagesContainer, imagesFrame) => {
    for (const imgContainer in imagesFrame) {
      imagesFrame[imgContainer].forEach((item) => {
        if (!(imgContainer in imagesContainer)) {
          imagesContainer[imgContainer] = [];
        }

        const imageDuck = createElement({
          tagName: 'img',
          attrs: [['src', item]],
          classNames: 'duck',
        });

        imagesContainer[imgContainer].push(imageDuck);
        imageDuck.onload = imageOnload;
        counters.imagesCounter++;
      });
    }
  };

  build();
  loadImages(dog.imageTags, dog.frames);
  loadImages(duck.imageTags, duck.frames);
};

const resetCycle = () => {
  const { flags, counters, main, methods } = global;

  const duckIcon = document.querySelector(`#alive-duck-${global.counters.cycle}`);
  duckIcon.style.opacity = 1;
  main.style.backgroundColor = 'rgb(0, 136, 255)';
  document.querySelector('.flyAway').style.opacity = 0;

  if (!flags.restart) {
    counters.cycle++;
  }

  for (const i in flags) {
    console.log(typeof i, i);
    if (i != 'gameOver') {
      flags[i] = false;
    }
  }

  methods.resetBullets();
  duck.initialize();
  dog.initialize();
};

function resetRound() {
  const { counters, duckThreshold, flags, methods } = global;
  counters.cycle = 0;
  counters.timeLine = 0;

  methods.resetIcons();

  console.log(counters.ducksShot, duckThreshold);

  if (!flags.restart && !flags.gameOver) {
    counters.rounds++;
    methods.addRound();
    if (counters.ducksShot < duckThreshold) {
      console.log('snth');
      flags.gameOver = true;
      methods.gameOver(1);
      document.querySelector('.round').innerHTML = 'R=1';
    }
  } else if (flags.gameOver || flags.restart) {
    counters.rounds = 0;
    counters.scoreValue = 0;
    document.querySelector('.round').innerHTML = 'R=1';
    document.querySelector('#counter').innerHTML = '0000';
  }

  counters.ducksShot = 0;
  document.querySelector('.points').style.opacity = 0;
  dog.container.style.zIndex = 500;
  dog.container.style.left = '5%';
  dog.search.x = 0;
  dog.search.y = 0;
  dog.search.dx = 0;
  dog.search.dy = 0;
  dog.position = undefined;
  resetCycle();
}

function DogReaction() {
  const { flags } = global;

  this.y = 0;
  this.dy = 1;

  this.draw = () => {
    document.querySelector('.points').style.opacity = 0;
    if (flags.shootDown) {
      dog.single(this.y);
    } else {
      dog.laugh(this.y);
    }
  };

  this.update = () => {
    dog.frameID++;

    if (dog.frameID <= 60) {
      this.y -= this.dy;
    } else if (dog.frameID >= 100) {
      this.y += this.dy;
    }

    if (dog.frameID >= 160) {
      this.y = 0;
      resetCycle();
    }

    this.draw();
  };
}

function DuckMovement(duck) {
  const { flags } = global;

  this.draw = () => {
    duck.container.style.transform = `translate(${(duck.x[0] + duck.spot) * 0.1}vw, ${
      duck.y[0] * 0.1
    }vh)`;
  };

  this.update = () => {
    const directions = {
      topLeft: duck.x[2] < 0 && duck.y[2] < 0,
      topRight: duck.x[2] > 0 && duck.y[2] < 0,
      bottomLeft: duck.x[2] < 0 && duck.y[2] > 0,
      bottomRight: duck.x[2] > 0 && duck.y[2] > 0,
    };

    duck.progress();

    if (!flags.falling && !flags.flewAway) {
      duck.flying(directions);
    } else if (flags.falling) {
      duck.fallFrames++;

      if (duck.fallFrames < 15) {
        duck.agony();
      } else {
        duck.falling();
      }
    }

    this.draw();
  };
}

function DogSniff() {
  const { main } = global;

  this.x = 0;
  this.y = 0;
  this.dx = 1;
  this.dy = 0;

  this.draw = () => {
    main.style.backgroundColor = 'rgb(0, 136, 255)';
    document.querySelector('.flyAway').style.opacity = 0;
    dog.container.style.transform = `translate(${this.x * 0.1}vw, ${this.y * 0.1}vh)`;
  };

  this.update = () => {
    dog.progress();

    this.x += this.dx;
    this.y += this.dy;

    if (dog.frameID < 200) {
      if (
        (dog.frameID > 50 && dog.frameID < 70) ||
        (dog.frameID > 150 && dog.frameID < 180) ||
        dog.frameID >= 199
      ) {
        this.dx = 0;
      } else {
        this.dx = 1;
      }
      dog.sniff();
    } else if (dog.frameID >= 200 && dog.frameID < 240) {
      dog.found();
    } else if (dog.frameID >= 240 && dog.frameID < 250) {
      dog.jumpStage1();
      this.dx = 0.5;
      this.dy = -5;
    } else if (dog.frameID >= 250 && dog.frameID < 300) {
      dog.jumpStage2();
    } else if (dog.frameID >= 300) {
      dog.initialize();
      this.dx = 0;
      this.dy = 0;
      this.x = 0;
      this.y = 0;
    }

    this.draw();
  };
}

function AimMovement(aim) {
  const { methods, keyState, windowHeight, windowWidth } = global;

  this.x = 0;
  this.y = 0;
  this.speed = aim.speed;

  this.draw = () => {
    aim.container.style.opacity = 1;
    aim.container.style.transform = `translate(${this.x * 0.1}vw, ${this.y * 0.1}vh)`;
    aim.container.style.transitionDuration = '150ms';
    aim.container.style.transitionTimingFunction = 'linear';
  };

  this.update = () => {
    aim.position = methods.getOffsetRect(aim.container);

    if (keyState[37] && this.x >= -350) {
      this.x -= this.speed;
    }

    if (keyState[39] && this.x <= 315) {
      this.x += this.speed;
    }
    if (keyState[38] && this.y > -500) {
      this.y -= this.speed;
    }
    if (keyState[40] && this.y < 200) {
      this.y += this.speed;
    }

    this.draw();
  };
}

document.onkeydown = document.onkeyup = (event) => {
  const { keyState, methods, flags } = global;

  if (event.type === 'keydown') {
    keyState[event.keyCode] = true;
  } else if (event.type === 'keyup') {
    keyState[event.keyCode] = false;
    if (!flags.gameOver) {
      methods.action(event);
    }
  }
};

function animate() {
  const { flags, counters, methods, maxDucks } = global;
  requestAnimationFrame(animate);

  global.windowWidth = document.documentElement.clientWidth;
  global.windowHeight = document.documentElement.clientHeight;

  if (counters.cycle === maxDucks) {
    resetRound();
  }

  if (!flags.isPaused && !flags.gameOver) {
    document.querySelector('.pauseMenu').style.opacity = 0;
    methods.gameOver(0);
    counters.timeLine++;
    if (counters.timeLine <= 300) {
      aim.container.style.opacity = 0;
      dog.container.style.opacity = 1;
      dog.search.update();
    } else {
      aim.move.update();
      duck.move.update();
      methods.iconBlink(counters.timeLine);
      if (flags.flewAway || flags.shootDown) {
        dog.container.style.opacity = 1;
        dog.container.style.zIndex = 0;
        duck.container.style.opacity = 0;
        dog.reaction.update();
      }
    }
  } else if (flags.gameOver) {
    methods.blink(document.querySelector('.restart'), counters.timeLine, 30);
  }
}

start();
