import createElement from './utils/createElement';

const mainPage = () => {
  const logo = createElement({ tagName: 'div' });
  const score = createElement({ tagName: 'div' });

  const levelOne = createElement({ tagName: 'div' });
  const levelTwo = createElement({ tagName: 'div' });
  const levelThree = createElement({ tagName: 'div' });

  const levels = createElement({ tagName: 'div', children: [levelOne, levelTwo, levelThree] });

  const box = createElement({ tagName: 'div', children: [levels, score] });
  const layout = createElement({ tagName: 'div', children: [box] });

  document.body.append(layout, logo);
};

export default mainPage;
