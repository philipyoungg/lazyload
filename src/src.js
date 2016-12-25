((w, d) => {
  const loadImage = imageObj => {
    const { image, src } = imageObj;
    image.setAttribute('src', src);
    image.addEventListener('load', () => {
      image.style.opacity = '1';
    });
  };

  const wrapElementWith = (reference, element) => {
    const DOMElement = reference.parentNode.insertBefore(element, reference);
    DOMElement.appendChild(reference);
  };

  const wrapImageWithLazyContainer = image => {
    const ratio = image.getAttribute('ratio').split('x');
    const aspectRatio = (parseInt(ratio[1], 10) / parseInt(ratio[0], 10)) * 100;
    const lazyImageContainer = d.createElement('div');
    lazyImageContainer.classList.add('lazy-image');
    lazyImageContainer.style.paddingBottom = `${aspectRatio}%`;
    wrapElementWith(image, lazyImageContainer);
  };

  const generateImagesToLazyLoad = selector => {
    const imagesToLazyLoad = [];

    [].forEach.call(d.querySelectorAll(selector), image => {
      const src = image.getAttribute('data-src');
      wrapImageWithLazyContainer(image);
      const imageObj = {
        image,
        src,
      };
      const offset = image.parentNode.getBoundingClientRect();
      if (offset.top < w.innerHeight) {
        loadImage(imageObj);
      } else {
        imagesToLazyLoad.push(imageObj);
      }
    });

    return imagesToLazyLoad;
  };

  const lazyLoad = (selector = 'img', triggerOffset = 0) => {
    const imagesQueue = generateImagesToLazyLoad(selector);
    let loadedCount = 0;
    d.addEventListener('scroll', function imagesScrollListener() {
      if (loadedCount === imagesQueue.length) {
        d.removeEventListener('scroll', imagesScrollListener);
      }
      imagesQueue.forEach((imageObj, index) => {
        if (imageObj) {
          const { image } = imageObj;
          const offset = image.parentNode.getBoundingClientRect();
          if (offset.top < w.innerHeight + triggerOffset &&
              offset.bottom + offset.height + triggerOffset > 0
          ) {
            loadImage(imageObj);
            imagesQueue[index] = null;
            loadedCount += 1;
          }
        }
      });
    });
  };

  w.lazyLoad = lazyLoad; //eslint-disable-line
})(window, document);
