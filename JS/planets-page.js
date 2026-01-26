// Planets Page Viewer Controller
class PlanetsPageViewer {
  constructor() {
    this.carousel = document.getElementById('planetViewerCarousel');
    this.views = document.querySelectorAll('.planet-view');
    this.indicators = document.querySelectorAll('.planet-indicator');
    this.prevBtn = document.getElementById('prevPlanetBtn');
    this.nextBtn = document.getElementById('nextPlanetBtn');
    
    // Check if planet index is passed in URL
    const urlParams = new URLSearchParams(window.location.search);
    const planetIndex = urlParams.get('planet');
    this.currentIndex = planetIndex !== null ? parseInt(planetIndex) : 2; // Default to Earth (index 2)
    
    this.isTransitioning = false;
    this.touchStartX = 0;
    this.touchEndX = 0;
    
    this.init();
  }
  
  init() {
    if (!this.carousel || this.views.length === 0) {
      console.warn('PlanetsPageViewer: Carousel or views not found');
      return;
    }
    
    // Set initial view
    this.updateView();
    
    // Force button styles and add multiple event listeners
    if (this.prevBtn) {
      this.prevBtn.style.pointerEvents = 'auto';
      this.prevBtn.style.cursor = 'pointer';
      this.prevBtn.style.zIndex = '1000';
      this.prevBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        console.log('Prev button clicked (planets page)');
        this.prev();
        return false;
      };
      this.prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        console.log('Prev button clicked (addEventListener)');
        this.prev();
        return false;
      }, true);
    } else {
      console.error('PlanetsPageViewer: Previous button not found!');
    }
    
    if (this.nextBtn) {
      this.nextBtn.style.pointerEvents = 'auto';
      this.nextBtn.style.cursor = 'pointer';
      this.nextBtn.style.zIndex = '1000';
      this.nextBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        console.log('Next button clicked (planets page)');
        this.next();
        return false;
      };
      this.nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        console.log('Next button clicked (addEventListener)');
        this.next();
        return false;
      }, true);
    } else {
      console.error('PlanetsPageViewer: Next button not found!');
    }
    
    // Indicator clicks
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.goTo(index);
      });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.prev();
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.next();
      }
    });
    
    // Touch/swipe support
    if (this.carousel) {
      this.carousel.addEventListener('touchstart', (e) => {
        this.touchStartX = e.touches[0].clientX;
      }, { passive: true });
      
      this.carousel.addEventListener('touchend', (e) => {
        this.touchEndX = e.changedTouches[0].clientX;
        this.handleSwipe();
      }, { passive: true });
    }
    
    // Auto-play videos
    this.updateVideoPlayback();
    
    console.log('PlanetsPageViewer initialized', {
      carousel: !!this.carousel,
      views: this.views.length,
      prevBtn: !!this.prevBtn,
      nextBtn: !!this.nextBtn
    });
  }
  
  updateView() {
    console.log('updateView called, currentIndex:', this.currentIndex, 'isTransitioning:', this.isTransitioning);
    
    if (!this.views || this.views.length === 0) {
      console.error('No views found in updateView');
      return;
    }
    
    this.views.forEach((view, index) => {
      const isActive = index === this.currentIndex;
      view.classList.toggle('active', isActive);
      
      // Force visibility update
      if (isActive) {
        view.style.display = 'flex';
        view.style.opacity = '1';
        view.style.visibility = 'visible';
        view.style.zIndex = '10';
        view.style.position = 'relative';
      } else {
        view.style.display = 'none';
        view.style.opacity = '0';
        view.style.visibility = 'hidden';
        view.style.zIndex = '1';
      }
    });
    
    // Update indicators
    this.indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === this.currentIndex);
    });
    
    // Update video playback
    this.updateVideoPlayback();
    
    // Force reflow
    void this.carousel.offsetHeight;
  }
  
  updateVideoPlayback() {
    this.views.forEach((view, index) => {
      const video = view.querySelector('video');
      if (video) {
        if (index === this.currentIndex) {
          video.currentTime = 0;
          video.play().catch(() => {
            // Auto-play might be blocked, that's okay
          });
        } else {
          video.pause();
        }
      }
    });
  }
  
  prev() {
    console.log('prev() called (planets page), isTransitioning:', this.isTransitioning, 'currentIndex:', this.currentIndex);
    if (!this.carousel || this.views.length === 0) {
      console.error('Cannot navigate: carousel or views missing');
      return;
    }
    
    if (this.isTransitioning) {
      console.log('Already transitioning, ignoring');
      return;
    }
    
    this.isTransitioning = true;
    const oldIndex = this.currentIndex;
    this.currentIndex = (this.currentIndex - 1 + this.views.length) % this.views.length;
    console.log(`Index changed: ${oldIndex} -> ${this.currentIndex}`);
    
    // Force update immediately
    this.updateView();
    
    // Use requestAnimationFrame to ensure smooth transition
    requestAnimationFrame(() => {
      this.updateView();
    });
    
    setTimeout(() => {
      this.isTransitioning = false;
      console.log('Transition complete');
    }, 850);
  }
  
  next() {
    console.log('next() called (planets page), isTransitioning:', this.isTransitioning, 'currentIndex:', this.currentIndex);
    if (!this.carousel || this.views.length === 0) {
      console.error('Cannot navigate: carousel or views missing');
      return;
    }
    
    if (this.isTransitioning) {
      console.log('Already transitioning, ignoring');
      return;
    }
    
    this.isTransitioning = true;
    const oldIndex = this.currentIndex;
    this.currentIndex = (this.currentIndex + 1) % this.views.length;
    console.log(`Index changed: ${oldIndex} -> ${this.currentIndex}`);
    
    // Force update immediately
    this.updateView();
    
    // Use requestAnimationFrame to ensure smooth transition
    requestAnimationFrame(() => {
      this.updateView();
    });
    
    setTimeout(() => {
      this.isTransitioning = false;
      console.log('Transition complete');
    }, 850);
  }
  
  goTo(index) {
    if (this.isTransitioning || index === this.currentIndex) return;
    this.isTransitioning = true;
    this.currentIndex = index;
    this.updateView();
    setTimeout(() => {
      this.isTransitioning = false;
    }, 800);
  }
  
  handleSwipe() {
    const swipeThreshold = 50;
    const diff = this.touchStartX - this.touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        this.next();
      } else {
        this.prev();
      }
    }
  }
}

// Initialize viewer when DOM is ready
function initPlanetsPageViewer() {
  // Wait a bit to ensure all elements are rendered
  setTimeout(() => {
    try {
      const viewer = new PlanetsPageViewer();
      // Make sure buttons are accessible
      window.planetsPageViewer = viewer;
      console.log('PlanetsPageViewer instance created:', viewer);
    } catch (error) {
      console.error('Error initializing PlanetsPageViewer:', error);
    }
  }, 200);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPlanetsPageViewer);
} else {
  initPlanetsPageViewer();
}
