// The selector for the elements to animate
const elementSelector = '[data-ref="hero[el]"]';

// Coverflow animation implementation
function createCoverflowEffect(glide, Components, Events) {
  const perspective = {
    // Set the current slide to flat perspective
    tilt: function(slide) {
      // Clear transformations first
      Components.Html.slides.forEach(s => {
        const el = s.querySelector(elementSelector);
        if (el) {
          el.style.transform = "";
          el.style.transformOrigin = "50% 50%";
        }
      });

      // Apply flat perspective to active slide
      const activeElement = slide.querySelector(elementSelector);
      activeElement.style.transform = "perspective(2400px) rotateY(0deg)";
      activeElement.style.transformOrigin = "50% 50%";
      this.tiltPrevElements(slide);
      this.tiltNextElements(slide);
    },
    
    // Tilt previous slides with positive rotation (right side tilts away)
    tiltPrevElements: function(slide) {
      // Get all previous sibling elements
      const prevElements = getPrevSiblings(slide);
      
      for (let i = 0; i < prevElements.length; i++) {
        const element = prevElements[i].querySelector(elementSelector);
        if (element) {
          element.style.transformOrigin = "100% 50%";
          // Adjust the angle based on position - prevent extreme angles
          const angle = Math.min(15 * (i + 1), 45); // Reduced angle
          element.style.transform = `perspective(2400px) rotateY(${angle}deg)`;
        }
      }
    },
    
    // Tilt next slides with negative rotation (left side tilts away)
    tiltNextElements: function(slide) {
      // Get all next sibling elements
      const nextElements = getNextSiblings(slide);
      
      for (let i = 0; i < nextElements.length; i++) {
        const element = nextElements[i].querySelector(elementSelector);
        if (element) {
          element.style.transformOrigin = "0% 50%";
          // Adjust the angle based on position - prevent extreme angles
          const angle = Math.min(15 * (i + 1), 45); // Reduced angle
          element.style.transform = `perspective(2400px) rotateY(${-angle}deg)`;
        }
      }
    }
  };

  // Run the tilt effect after mount and on slide change
  Events.on(["mount.after", "run"], function() {
    perspective.tilt(Components.Html.slides[glide.index]);
  });

  // Add event listener for window resize to reapply effects
  window.addEventListener('resize', function() {
    perspective.tilt(Components.Html.slides[glide.index]);
  });

  return perspective;
}

// Helper function to get previous siblings
function getPrevSiblings(element) {
  const siblings = [];
  let currentElement = element;
  
  if (currentElement) {
    while (currentElement = currentElement.previousElementSibling) {
      siblings.push(currentElement);
    }
  }
  
  return siblings;
}

// Helper function to get next siblings
function getNextSiblings(element) {
  const siblings = [];
  let currentElement = element;
  
  if (currentElement) {
    while (currentElement = currentElement.nextElementSibling) {
      siblings.push(currentElement);
    }
  }
  
  return siblings;
}

// Example of how to initialize the slider with the Coverflow effect
function initializeSlider() {
  const slider = new Glide('.videos-slider', {
    focusAt: "center",
    perView: 3, // Default perView
    peek: 0,
    gap: 20, // Default gap
    startAt: 2,
    autoplay: false,
    hoverpause: false,
    animationDuration: 1000,
    rewindDuration: 1000,
    touchRatio: 0.25,
    perTouch: 1,
    breakpoints: {
      480: { gap: 20, peek: 40, perView: 1 },
      768: { perView: 2, gap: 20 },
      1360: { perView: 3, gap: 30 },
      1600: { perView: 4, gap: 40 }, // Changed perView to 4 and adjusted gap
      1920: { perView: 5, gap: 50 }  // Added a new breakpoint for larger screens
    }
  }).mount({
    Coverflow: createCoverflowEffect
  });
  
  return slider;
}

// Initialize the slider when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeSlider();
  
  // Force recalculation of carousel on window resize
  window.addEventListener('resize', function() {
    // Add a slight delay to ensure DOM updates are complete
    setTimeout(function() {
      const event = new Event('resize');
      window.dispatchEvent(event);
    }, 100);
  });
});
