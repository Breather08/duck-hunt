const counters = {
  imagesOnLoadCounter: 0,
  imagesCounter: 0,
};

export const imageOnload = (callback) => {
  // eslint-disable-next-line no-plusplus
  counters.imagesOnLoadCounter++;
  if (counters.imagesOnLoadCounter === counters.imagesCounter) {
    setTimeout(() => {
      callback();
    }, 1000);
  }
};

export const loadImages = (frames, callback) => {
  frames.forEach((frame) => {
    const images = Object.values(frame).flat();
    counters.imagesCounter += images.length;

    images.forEach((image) => {
      const img = new Image();
      img.onload = imageOnload.bind(null, callback);
      img.src = image;
    });
  });
};
