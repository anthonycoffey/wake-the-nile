document.addEventListener('DOMContentLoaded', () => {
  const slider = document.querySelector('.glide');
  if (!slider) return;

  const container = slider.closest('.glide-container');
  if (!container) return;

  class AssetLoader {
    constructor(sliderContainer) {
      this.container = sliderContainer;
      this.assets = this._discoverAssets();
      this._createLoaderElement();
    }

    _discoverAssets() {
      const videos = Array.from(this.container.querySelectorAll('video'));
      const images = Array.from(this.container.querySelectorAll('img'));
      return [...videos, ...images];
    }

    _createLoaderElement() {
      this.loaderElement = document.createElement('div');
      this.loaderElement.className = 'slider-loading';
      this.loaderElement.textContent = 'Loading...';
      this.container.appendChild(this.loaderElement);
      this.container.classList.add('loading');
    }

    load() {
      if (this.assets.length === 0) {
        this._onLoadComplete();
        return Promise.resolve();
      }

      const promises = this.assets.map(asset => {
        return new Promise((resolve, reject) => {
          if (asset.tagName === 'VIDEO') {
            if (asset.readyState >= 2) {
              resolve();
            } else {
              asset.addEventListener('loadeddata', () => resolve(), { once: true });
              asset.addEventListener('error', () => reject(new Error(`Failed to load video: ${asset.src}`)), { once: true });
            }
          } else if (asset.tagName === 'IMG') {
            if (asset.complete) {
              resolve();
            } else {
              asset.addEventListener('load', () => resolve(), { once: true });
              asset.addEventListener('error', () => reject(new Error(`Failed to load image: ${asset.src}`)), { once: true });
            }
          }
        });
      });

      return Promise.all(promises)
        .then(() => this._onLoadComplete())
        .catch(error => {
          console.error('Error loading assets:', error);
          this._onLoadComplete(); // Still show slider even if some assets fail
        });
    }

    _onLoadComplete() {
      this.container.classList.remove('loading');
      this.container.classList.add('loaded');
      if (this.loaderElement) {
        this.loaderElement.remove();
      }
    }
  }

  class Autoplay {
    constructor(glide, slider) {
      this.glide = glide;
      this.slider = slider;
      this.userPausedVideos = new Set();
      this._init();
    }

    _init() {
      this.glide.on(['mount.after', 'run'], () => {
        this.handleVisibilityChange();
      });

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            this.isSliderVisible = entry.isIntersecting;
            this.handleVisibilityChange();
          });
        },
        { threshold: 0.5 }
      );

      observer.observe(this.slider);
      this._setupVideoEventListeners();
    }

    _setupVideoEventListeners() {
      this.slider.querySelectorAll('video').forEach(video => {
        video.addEventListener('pause', (e) => {
          if (e.isTrusted) this.userPausedVideos.add(video);
        });
        video.addEventListener('play', (e) => {
          if (e.isTrusted) this.userPausedVideos.delete(video);
        });
      });
    }

    handleVisibilityChange() {
      const activeSlide = this.slider.querySelector('.glide__slide--active');
      if (!activeSlide) return;

      // Pause all non-active videos
      this.slider.querySelectorAll('.glide__slide:not(.glide__slide--active) video').forEach(video => {
        if (!video.paused) video.pause();
      });

      const activeVideo = activeSlide.querySelector('video');
      if (!activeVideo) return;

      if (this.isSliderVisible && !this.userPausedVideos.has(activeVideo)) {
        if (activeVideo.paused) {
          activeVideo.play().catch(e => console.warn("Autoplay prevented:", e));
        }
      } else {
        if (!activeVideo.paused) {
          activeVideo.pause();
        }
      }
    }
  }

  // Main initialization logic
  const assetLoader = new AssetLoader(container);
  assetLoader.load().then(() => {
    // glideOptions and simplifiedCoverflow are now expected to be in the global scope
    // from glide-init.js
    if (typeof Glide === 'function' && typeof glideOptions !== 'undefined' && typeof simplifiedCoverflow !== 'undefined') {
      const glide = new Glide(slider, glideOptions).mount({
        Coverflow: simplifiedCoverflow
      });
      new Autoplay(glide, slider);
    } else {
      console.error('Glide.js or its configuration is not available.');
    }
  });
});
