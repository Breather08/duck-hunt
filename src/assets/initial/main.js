function createElement({
    tagName, classNames, children, attrs, textContent, onClick, onChange,
}) {
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

const generateBackGround = () => {
    const main = createElement({
        tagName: 'div',
        classNames: 'main',
    });

    const pointer = createElement({
        tagName: 'img',
        attrs: [
            ['id', 'pointer'],
            ['src', './black/shot/0.png']
        ] 
    });

    const resume = createElement({
        tagName: 'span',
        textContent: 'Resume',
        attrs: [
            ['id', 'resume'],
        ]
    });

    const restart = createElement({
        tagName: 'span',
        textContent: 'Restart',
        attrs: [
            ['id', 'restart'],
        ]
    });

    const pauseMenu = createElement({
        tagName: 'div',
        classNames: 'pauseMenu',
        children: [resume, restart, pointer]
    });

    const back = createElement({
        tagName: 'img',
        attrs: [
            ['id', 'back'],
            ['src', 'https://raw.githubusercontent.com/MattSurabian/DuckHunt-JS/master/src/assets/images/scene/back/0.png']
        ]
    });

    const tree = createElement({
        tagName: 'img',
        attrs: [
            ['id', 'tree'],
            ['src', 'https://raw.githubusercontent.com/MattSurabian/DuckHunt-JS/master/src/assets/images/scene/tree/0.png']
        ]
    });

    const backGround = createElement({
        tagName: 'div',
        classNames: 'ground',
        children: [back, tree]
    });

    main.append(backGround, pauseMenu);
    document.body.append(main);
};

const generateHud = () => {
    const main = document.querySelector('.main');

    const hud = createElement({
        tagName: 'div',
        classNames: 'hud',
    });

    const rounds = createElement({
        tagName: 'div',
        classNames: 'rounds',
        children: [
            createElement({
                tagName: 'span',
                classNames: 'round',
                textContent: 'R=1',
            })
        ]
    });

    const shots = createElement({
        tagName: 'div',
        classNames: 'shots',
    });

    const bullets = createElement({
        tagName: 'div',
        classNames: 'bullets',
    });

    for (let i = 0; i < 3; i += 1) {
        bullets.append(
            createElement({
                // генерим пули
                classNames: 'bullet',
                tagName: 'img',
                attrs: [
                    ['src', 'hud/bullet.png'],
                    ['id', `bullet-${i}`],
                ],
            })
        );
    }

    shots.append(bullets);
    shots.append(
        createElement({
            // текст под пулями
            tagName: 'img',
            attrs: [
                ['id', 'shotIcon'],
                ['src', 'hud/shot.png'],
            ],
        })
    );

    const hits = createElement({
        tagName: 'div',
        classNames: 'hits',
    });

    hits.append(
        createElement({
            // текст возле уток
            tagName: 'img',
            attrs: [
                ['src', 'hud/hit.png'],
                ['id', 'hitIcon']
            ],
        })
    );

    const ducks = createElement({
        tagName: 'div',
        classNames: 'ducks',
    });

    for (let i = 0; i < 10; i += 1) {
        ducks.append(
            createElement({
                // генерим уток
                classNames: 'duckIcon',
                tagName: 'img',
                attrs: [
                    ['src', 'hud/alive.png'],
                    ['id', `alive-duck-${i}`],
                ],
            }),
        );
    }

    hits.append(ducks);

    const score = createElement({
        tagName: 'div',
        classNames: 'score',
        children: [
            createElement({
                // надппись
                tagName: 'img',
                attrs: [
                    ['src', 'hud/score.png'],
                ],
            }),
            createElement({
                // очки
                tagName: 'span',
                textContent: '0000',
                attrs: [
                    ['id', 'counter']
                ],
            }),
        ],
    });

    hud.append(rounds, shots, hits, score);
    main.append(hud);
};

generateBackGround();
generateHud();