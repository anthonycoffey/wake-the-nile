// The selector for the elements to animate
const elementSelector = '[data-ref="hero[el]"]';

// Coverflow animation implementation
function createCoverflowEffect(glide, Components, Events) {
  const perspective = {
    // Set the current slide to flat perspective
    tilt: function(slide) {
      slide.querySelector(elementSelector).style.transform = "perspective(2400px) rotateY(0deg)";
      this.tiltPrevElements(slide);
      this.tiltNextElements(slide);
    },
    
    // Tilt previous slides with positive rotation (right side tilts away)
    tiltPrevElements: function(slide) {
      // Get all previous sibling elements
      const prevElements = getPrevSiblings(slide);
      
      for (let i = 0; i < prevElements.length; i++) {
        const element = prevElements[i].querySelector(elementSelector);
        element.style.transformOrigin = "100% 50%";
        element.style.transform = `perspective(2400px) rotateY(${20 * Math.max(i, 2)}deg)`;
      }
    },
    
    // Tilt next slides with negative rotation (left side tilts away)
    tiltNextElements: function(slide) {
      // Get all next sibling elements
      const nextElements = getNextSiblings(slide);
      
      for (let i = 0; i < nextElements.length; i++) {
        const element = nextElements[i].querySelector(elementSelector);
        element.style.transformOrigin = "0% 50%";
        element.style.transform = `perspective(2400px) rotateY(${-20 * Math.max(i, 2)}deg)`;
      }
    }
  };

  // Run the tilt effect after mount and on slide change
  Events.on(["mount.after", "run"], function() {
    perspective.tilt(Components.Html.slides[glide.index]);
  });

  return perspective;
}

// Helper function to get previous siblings
function getPrevSiblings(element) {
  const siblings = [];
  
  if (element) {
    while (element = element.previousElementSibling) {
      siblings.push(element);
    }
  }
  
  return siblings;
}

// Helper function to get next siblings
function getNextSiblings(element) {
  const siblings = [];
  
  if (element) {
    while (element = element.nextElementSibling) {
      siblings.push(element);
    }
  }
  
  return siblings;
}

// Example of how to initialize the slider with the Coverflow effect
function initializeSlider() {
  const slider = new Glide('.videos-slider', {
    focusAt: "center",
    perView: 3,
    peek: 60,
    gap: 60,
    autoplay: false,
    hoverpause: false,
    animationDuration: 1000,
    rewindDuration: 1000,
    touchRatio: 0.25,
    perTouch: 1,
    breakpoints: {
      480: { gap: 10, peek: 10, perView: 1 },
      768: { perView: 2 },
      1360: { perView: 3 },
      1600: { perView: 4 },
      1960: { perView: 5 }
    }
  }).mount({
    Coverflow: createCoverflowEffect
  });
  
  return slider;
}


// Initialize the slider when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeSlider();
});