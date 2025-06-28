document.addEventListener('DOMContentLoaded', () => {
  const slider = document.querySelector('.glide');
  if (!slider) return;

  // Coverflow Effect
  function Coverflow(glide, Components, Events) {
    const coverflow = {
      apply() {
        const slides = Components.Html.slides;
        const activeIndex = glide.index;
        const perView = glide.settings.perView;
        const slideWidth = Components.Sizes.slideWidth;

        slides.forEach((slide, index) => {
          const videoElement = slide.querySelector('[data-ref="hero[el]"]');
          const offset = index - activeIndex;
          const distance = Math.abs(offset);
          const scale = 1 - (distance * 0.1);
          const rotateY = offset * 10;
          const translateX = offset * (slideWidth / (perView * 1.5));
          const translateZ = -distance * 50;
          const opacity = distance > 2 ? 0 : 1;

          slide.style.transform = `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
          slide.style.zIndex = 100 - distance;
          slide.style.opacity = opacity;

          if (videoElement) {
            videoElement.style.filter = `brightness(${100 - (distance * 15)}%)`;
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
    autoplay: false, // Keep this false, we are handling autoplay manually
    animationDuration: 500,
    breakpoints: {
      992: {
        perView: 3,
        gap: 30
      },
      768: {
        perView: 1,
        gap: 20
      }
    }
  };

  class Autoplay {
    constructor(glide, slider) {
      this.glide = glide;
      this.slider = slider;
      this.userPausedVideos = new Set();
      this.isSliderVisible = true; // Default to not visible
      this._init();
    }

    _init() {
      // The core fix: use 'run.after' to ensure the active class is set
      this.glide.on(['mount.after', 'run.after'], () => {
        this.handlePlayback();
      });

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            this.isSliderVisible = entry.isIntersecting;
            this.handlePlayback();
          });
        },
        { threshold: 0.5 }
      );

      observer.observe(this.slider);
      this._setupVideoEventListeners();
    }

    _setupVideoEventListeners() {
      this.slider.querySelectorAll('video').forEach(video => {
        // When a user manually pauses a video, add it to our set
        video.addEventListener('pause', (e) => {
          if (e.isTrusted) this.userPausedVideos.add(video);
        });
        // When a user manually plays a video, remove it from our set
        video.addEventListener('play', (e) => {
          if (e.isTrusted) this.userPausedVideos.delete(video);
        });
      });
    }

    handlePlayback() {
      const activeSlide = this.slider.querySelector('.glide__slide--active');
      if (!activeSlide) return;

      // Pause all videos in non-active slides
      this.slider.querySelectorAll('.glide__slide:not(.glide__slide--active) video').forEach(video => {
        if (!video.paused) {
          video.pause();
        }
      });

      const activeVideo = activeSlide.querySelector('video');
      if (!activeVideo) return;

      // If the slider is visible on screen and the user has not manually paused this video
      if (this.isSliderVisible && !this.userPausedVideos.has(activeVideo)) {
        // If the video is paused, play it
        if (activeVideo.paused) {
          activeVideo.play().catch(e => console.warn("Autoplay was prevented by the browser."));
        }
      } else {
        // Otherwise, pause the video
        if (!activeVideo.paused) {
          activeVideo.pause();
        }
      }
    }
  }

  // Main initialization logic
  if (typeof Glide === 'function') {
    const glide = new Glide(slider, glideOptions).mount({
      Coverflow: Coverflow
    });
    new Autoplay(glide, slider);
  } else {
    console.error('Glide.js is not available.');
  }
});
