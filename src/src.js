($ => {
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

    $('img').each((i, image) => {
      const src = $(image).attr('data-src');
      const ratio = $(image).attr('ratio');
      const aspectRatio = {
        '16x9': 56.25,
        '4x3': 75,
        '6x4': 66.6,
        '8x5': 62.5,
        '7x5': 71.42,
        '1x1': 100,
      };
      $(image)
        .attr('src', '')
        .wrap($('<div/>', {
          class: 'lazy-image',
          css: {
            paddingBottom: `${aspectRatio[ratio]}%`,
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
  });
})($);
