document.addEventListener('DOMContentLoaded', () => {
  // Keep track of videos that have been deliberately paused by the user
  const userPausedVideos = new Set();
  
  // Function to handle active slide changes
  function handleActiveSlideChange() {
    // Pause all videos first (except the active one)
    document.querySelectorAll('.glide__slide:not(.glide__slide--active) video').forEach(video => {
      video.pause();
    });
    
    // Find the currently active slide's video
    const activeVideo = document.querySelector('.glide__slide--active video');
    
    // If no video element is found in the active slide, exit
    if (!activeVideo) {
      console.log('No video element found in the active slide');
      return;
    }
    
    console.log('Active slide changed, found video:', activeVideo);
    
    // Check if the user deliberately paused this video
    if (userPausedVideos.has(activeVideo)) {
      console.log('Video was previously paused by user, not auto-playing');
      return;
    }
    
    // Play the video in the active slide if not paused by user
    if (activeVideo.readyState >= 2) {
      activeVideo.play().catch(error => {
        console.warn('Could not autoplay video:', error);
      });
    } else {
      // If not loaded, wait for it
      activeVideo.addEventListener('loadeddata', () => {
        if (!userPausedVideos.has(activeVideo)) {
          activeVideo.play().catch(error => {
            console.warn('Could not autoplay video after loading:', error);
          });
        }
      }, { once: true });
    }
  }
  
  // Function to reset the userPausedVideos state when slide changes
  function resetPausedStateOnSlideChange(newActiveSlide) {
    // Remove all videos from other slides from the userPausedVideos set
    document.querySelectorAll('.glide__slide:not(.glide__slide--active) video').forEach(video => {
      userPausedVideos.delete(video);
    });
    
    // We keep the active video's pause state as is
  }
  
  // Keep the intersection observer for scroll-based detection
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const slide = entry.target;
      
      // Only take action if this is the active slide
      if (slide.classList.contains('glide__slide--active')) {
        const videoElement = slide.querySelector('video');
        if (!videoElement) return;
        
        if (entry.isIntersecting) {
          console.log('Active slide scrolled into view');
          // Only play if not manually paused by user
          if (!userPausedVideos.has(videoElement)) {
            console.log('Playing video (not manually paused)');
            if (videoElement.readyState >= 2) {
              videoElement.play().catch(error => {
                console.warn('Could not autoplay video:', error);
              });
            } else {
              videoElement.addEventListener('loadeddata', () => {
                if (!userPausedVideos.has(videoElement)) {
                  videoElement.play().catch(error => {
                    console.warn('Could not autoplay video after loading:', error);
                  });
                }
              }, { once: true });
            }
          } else {
            console.log('Video remains paused due to user preference');
          }
        } else {
          console.log('Active slide scrolled out of view, pausing video');
          // Use a flag to mark this pause as programmatic, not user-initiated
          videoElement._programmaticPause = true;
          videoElement.pause();
          // Clear the flag after a short delay
          setTimeout(() => {
            delete videoElement._programmaticPause;
          }, 50);
        }
      }
    });
  }, {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
  });
  
  // Observer for DOM changes to detect class changes
  const mutationObserver = new MutationObserver(mutations => {
    // Check if any mutations affected the active class
    const activeSlideChange = mutations.some(mutation => {
      if (mutation.type === 'attributes' && 
          mutation.attributeName === 'class' && 
          mutation.target.classList.contains('glide__slide')) {
        
        // Check if this is a newly active slide
        if (mutation.target.classList.contains('glide__slide--active')) {
          resetPausedStateOnSlideChange(mutation.target);
          return true;
        }
      }
      return false;
    });
    
    if (activeSlideChange) {
      handleActiveSlideChange();
    }
  });
  
  // Add pause event listeners to all videos
  document.querySelectorAll('.glide__slide video').forEach(video => {
    // Track when a user deliberately pauses a video
    video.addEventListener('pause', (event) => {
      // Skip if this is our programmatic pause (from scrolling out of view)
      if (video._programmaticPause) {
        console.log('Ignoring programmatic pause (not user initiated)');
        return;
      }
      
      // Additional check for user-initiated actions
      if (!event.isTrusted) return;
      
      console.log('User manually paused video:', video);
      userPausedVideos.add(video);
    });
    
    // When a user manually plays a video, remove it from the paused set
    video.addEventListener('play', (event) => {
      // Check if the play was triggered by user action
      if (!event.isTrusted) return;
      
      console.log('User manually played video:', video);
      userPausedVideos.delete(video);
    });
  });
  
  // Observe all slides for class changes
  document.querySelectorAll('.glide__slide').forEach(slide => {
    // Watch for class changes on all slides
    mutationObserver.observe(slide, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });
    
    // Also add the intersection observer to all slides
    observer.observe(slide);
  });
  
  // Listen for arrow key navigation as another possible trigger
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      // Wait a brief moment for the carousel to update the active class
      setTimeout(handleActiveSlideChange, 50);
    }
  });
  
  // Initial check for active slide
  handleActiveSlideChange();
  
  console.log('Slide change detection initialized with user pause tracking');
});