document.addEventListener('DOMContentLoaded', () => {
  const slider = document.querySelector('.glide');
  if (!slider) return;

  const c = '[data-ref="hero[el]"]';

  function Coverflow(e, t, n) {
    const i = {
      tilt: function (e) {
        e.querySelector(c).style.transform = "perspective(1500px) rotateY(0deg)";
        this.tiltPrevElements(e);
        this.tiltNextElements(e);
      },
      tiltPrevElements: function (e) {
        for (
          var t = (function (e) {
            var t = [];
            if (e)
              for (; (e = e.previousElementSibling);) t.push(e);
            return t;
          })(e),
          n = 0; n < t.length; n++
        ) {
          var i = t[n].querySelector(c);
          i.style.transformOrigin = "100% 50%";
          i.style.transform = "perspective(1500px) rotateY(" + 20 * Math.max(n, 2) + "deg)";
        }
      },
      tiltNextElements: function (e) {
        for (
          var t = (function (e) {
            var t = [];
            if (e)
              for (; (e = e.nextElementSibling);) t.push(e);
            return t;
          })(e),
          n = 0; n < t.length; n++
        ) {
          var i = t[n].querySelector(c);
          i.style.transformOrigin = "0% 50%";
          i.style.transform = "perspective(1500px) rotateY(" + -20 * Math.max(n, 2) + "deg)";
        }
      }
    };

    n.on(["mount.after", "run"], () => {
      i.tilt(t.Html.slides[e.index]);
    });

    return i;
  }

  // Glide.js options object
  const glideOptions = {
    type: 'carousel',
    focusAt: 'center',
    startAt: 1,
    perView: 6,
    peek: 50,
    gap: 30,
    autoplay: false, // Keep this false, we are handling autoplay manually
    animationDuration: 1000,
    rewindDuration: 2000,
    touchRatio: .25,
    perTouch: 1,
    breakpoints: {
      480: {
        gap: 15,
        peek: 75,
        perView: 1
      },
      768: {
        perView: 2
      },
      1360: {
        perView: 3
      },
      1600: {
        perView: 4
      },
      1960: {
        perView: 5
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
