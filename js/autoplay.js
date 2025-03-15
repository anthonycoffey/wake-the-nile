document.addEventListener('DOMContentLoaded', () => {
  // Function to handle active slide changes
  function handleActiveSlideChange() {
    // Pause all videos first
    document.querySelectorAll('.glide__slide video').forEach(video => {
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
    
    // Play the video in the active slide
    if (activeVideo.readyState >= 2) {
      activeVideo.play().catch(error => {
        console.warn('Could not autoplay video:', error);
      });
    } else {
      // If not loaded, wait for it
      activeVideo.addEventListener('loadeddata', () => {
        activeVideo.play().catch(error => {
          console.warn('Could not autoplay video after loading:', error);
        });
      }, { once: true });
    }
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
          console.log('Active slide scrolled into view, playing video');
          if (videoElement.readyState >= 2) {
            videoElement.play().catch(error => {
              console.warn('Could not autoplay video:', error);
            });
          } else {
            videoElement.addEventListener('loadeddata', () => {
              videoElement.play().catch(error => {
                console.warn('Could not autoplay video after loading:', error);
              });
            }, { once: true });
          }
        } else {
          console.log('Active slide scrolled out of view, pausing video');
          videoElement.pause();
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
    const activeChanged = mutations.some(mutation => {
      if (mutation.type === 'attributes' && 
          mutation.attributeName === 'class' && 
          mutation.target.classList.contains('glide__slide')) {
        return true;
      }
      return false;
    });
    
    if (activeChanged) {
      handleActiveSlideChange();
    }
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
  
  // If your carousel has events you can listen to directly, you could also add:
  // For example, if using Glide.js:
  /*
  if (window.glide) {
    glide.on('run', () => {
      handleActiveSlideChange();
    });
  }
  */
  
  // Listen for arrow key navigation as another possible trigger
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      // Wait a brief moment for the carousel to update the active class
      setTimeout(handleActiveSlideChange, 50);
    }
  });
  
  // Initial check for active slide
  handleActiveSlideChange();
  
  console.log('Slide change detection initialized');
});