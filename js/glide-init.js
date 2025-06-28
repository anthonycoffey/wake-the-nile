// Simplified Coverflow Effect
function simplifiedCoverflow(glide, Components, Events) {
  const coverflow = {
    apply: function() {
      const slides = Components.Html.slides;
      const activeIndex = glide.index;

      slides.forEach((slide, index) => {
        const videoElement = slide.querySelector('[data-ref="hero[el]"]');
        if (index === activeIndex) {
          // Active slide
          slide.style.zIndex = '2';
          if (videoElement) {
            videoElement.style.transform = 'scale(1)';
            videoElement.style.filter = 'brightness(100%)';
          }
        } else {
          // Inactive slides
          slide.style.zIndex = '1';
          if (videoElement) {
            videoElement.style.transform = 'scale(0.85)';
            videoElement.style.filter = 'brightness(70%)';
          }
        }
      });
    }
  };

  Events.on(['mount.after', 'run'], () => {
    coverflow.apply();
  });

  return coverflow;
}

// Glide.js options object
const glideOptions = {
  type: 'carousel',
  focusAt: 'center',
  perView: 3,
  gap: 100,
  startAt: 1,
  autoplay: false,
  animationDuration: 500,
  breakpoints: {
    992: {
      perView: 3,
      gap: 50
    },
    768: {
      perView: 1,
      gap: 100
    }
  }
};
