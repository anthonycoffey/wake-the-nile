document.addEventListener('DOMContentLoaded', () => {
  // Keep track of videos that have been deliberately paused by the user
  const userPausedVideos = new Set();
  
  // Throttle function to prevent excessive event firing
  function throttle(callback, delay = 100) {
    let lastCall = 0;
    return function(...args) {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        callback(...args);
      }
    };
  }
  
  // Combine all video handling logic into a single function
  function handleVideoVisibility() {
    // Get the active slide
    const activeSlide = document.querySelector('.glide__slide--active');
    if (!activeSlide) return;
    
    // Get the video in active slide
    const activeVideo = activeSlide.querySelector('video');
    if (!activeVideo) return;
    
    // Check if the active slide is sufficiently visible
    const rect = activeSlide.getBoundingClientRect();
    const isVisible = (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
    
    // Pause all videos in non-active slides
    document.querySelectorAll('.glide__slide:not(.glide__slide--active) video').forEach(video => {
      video.pause();
      // Also clean up the paused states for non-active slides
      userPausedVideos.delete(video);
    });
    
    // Handle the active video based on visibility and user preference
    if (isVisible && !userPausedVideos.has(activeVideo)) {
      if (activeVideo.paused) {
        // Play only if the video is ready
        if (activeVideo.readyState >= 2) {
          activeVideo.play().catch(error => {
            console.warn('Could not autoplay video:', error);
          });
        } else {
          // One-time event listener for when video is ready
          activeVideo.addEventListener('loadeddata', () => {
            if (!userPausedVideos.has(activeVideo)) {
              activeVideo.play().catch(error => {
                console.warn('Could not autoplay video after loading:', error);
              });
            }
          }, { once: true });
        }
      }
    } else {
      // Mark this as a programmatic pause
      activeVideo._programmaticPause = true;
      activeVideo.pause();
      // Clear the flag shortly after
      setTimeout(() => {
        delete activeVideo._programmaticPause;
      }, 50);
    }
  }
  
  // Throttled version of the handler to reduce event firing
  const throttledHandler = throttle(handleVideoVisibility, 150);
  
  // Set up event listeners for user pause/play actions
  function setupVideoEventListeners() {
    document.querySelectorAll('.glide__slide video').forEach(video => {
      // Remove any existing listeners first (in case this is called multiple times)
      video.removeEventListener('pause', handleVideoPause);
      video.removeEventListener('play', handleVideoPlay);
      
      // Add the listeners
      video.addEventListener('pause', handleVideoPause);
      video.addEventListener('play', handleVideoPlay);
    });
  }
  
  // Handle user-initiated pause
  function handleVideoPause(event) {
    const video = event.target;
    
    // Skip if this is our programmatic pause
    if (video._programmaticPause) return;
    
    // Only track user-initiated pauses
    if (event.isTrusted) {
      userPausedVideos.add(video);
    }
  }
  
  // Handle user-initiated play
  function handleVideoPlay(event) {
    const video = event.target;
    
    // Only handle user-initiated plays
    if (event.isTrusted) {
      userPausedVideos.delete(video);
    }
  }
  
  // Use a single mutation observer for all slides
  const mutationObserver = new MutationObserver(mutations => {
    let hasActiveSlideChanged = false;
    
    mutations.forEach(mutation => {
      if (mutation.type === 'attributes' && 
          mutation.attributeName === 'class' && 
          mutation.target.classList.contains('glide__slide')) {
        
        if (mutation.target.classList.contains('glide__slide--active')) {
          hasActiveSlideChanged = true;
        }
      }
    });
    
    if (hasActiveSlideChanged) {
      throttledHandler();
    }
  });
  
  // Set up all observers and event handlers
  function initializeVideoControls() {
    // Set up video pause/play event listeners
    setupVideoEventListeners();
    
    // Observe all slides for class changes (active state)
    document.querySelectorAll('.glide__slide').forEach(slide => {
      mutationObserver.observe(slide, { 
        attributes: true, 
        attributeFilter: ['class'] 
      });
    });
    
    // Listen for scroll events
    window.addEventListener('scroll', throttledHandler);
    
    // Listen for window resize
    window.addEventListener('resize', throttledHandler);
    
    // Listen for arrow key navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        // Wait a brief moment for the carousel to update
        setTimeout(throttledHandler, 50);
      }
    });
    
    // Initial check
    throttledHandler();
    
    console.log('Video carousel controls initialized with optimized event handling');
  }
  
  // Initialize everything
  initializeVideoControls();
  
  // Re-initialize when new slides might be added
  // (Optional, in case your carousel dynamically adds slides)
  document.addEventListener('DOMNodeInserted', (e) => {
    if (e.target && (
      e.target.classList && e.target.classList.contains('glide__slide') ||
      e.target.querySelector && e.target.querySelector('.glide__slide')
    )) {
      // Wait a brief moment for the DOM to stabilize
      setTimeout(initializeVideoControls, 100);
    }
  });
});