((window, document, $) => {
  $(document).ready(() => {
    const lazyLoadImage = (src, image, callback) => {
      const pos = $(image)[0].getBoundingClientRect();
      if (pos.top < window.innerHeight) {
        $(image)
        .attr('src', src)
        .on('load', e => {
          $(e.target).css({
            opacity: '1',
          });
        });
        if (callback) $(document).off('scroll', callback);
      }
    };

    const lazyLoad = selector => {
      $(selector).each((i, image) => {
        const src = $(image).attr('data-src');
        const ratio = $(image).attr('ratio').split('x');
        const aspectRatio = parseInt(ratio[1], 10) / parseInt(ratio[0], 10);
        $(image)
        .wrap($('<div/>', {
          class: 'lazy-image',
          css: {
            paddingBottom: `${aspectRatio}%`,
          },
        }));
        const pos = $(image).parent()[0].getBoundingClientRect();
        if (pos.top < window.innerHeight) {
          lazyLoadImage(src, image);
        } else {
          $(document).on('scroll', function lazyScrollHandlers() {
            lazyLoadImage(src, image, lazyScrollHandlers);
          });
        }
      });
    };
    window.lazyLoad = lazyLoad;
  });
})(window, document, $);
