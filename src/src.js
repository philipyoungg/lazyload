((w, d) => {
  const loadImage = imageObj => {
    const image = imageObj.element;
    image.setAttribute('src', imageObj.src);
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
        element: image,
        offset: image.parentNode.getBoundingClientRect(),
        src,
      };
      if (imageObj.offset.top < w.innerHeight) {
        loadImage(imageObj);
      } else {
        imagesToLazyLoad.push(imageObj);
      }
    });

    return imagesToLazyLoad;
  };

  const lazyLoad = (selector = 'img', triggerOffset = 0) => {
    const imagesQueue = generateImagesToLazyLoad(selector);

    d.addEventListener('scroll', function imagesScrollListener() {
      if (imagesQueue.length === 0) {
        d.removeEventListener('scroll', imagesScrollListener);
      }
      imagesQueue.forEach(image => {
        if ((w.innerHeight + w.pageYOffset) + triggerOffset > image.offset.top) {
          loadImage(image);
          imagesQueue.splice(imagesQueue.indexOf(image), 1);
        }
      });
    });
  };

  w.lazyLoad = lazyLoad; //eslint-disable-line

  w.addEventListener('beforeunload', () => {
    w.scrollTo(0, 0);
  });
})(window, document);
