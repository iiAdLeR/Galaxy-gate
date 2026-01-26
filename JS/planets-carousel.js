// 3D Planets Carousel Controller
class PlanetsCarousel {
  constructor() {
    this.carousel = document.getElementById('planetsCarousel');
    this.items = document.querySelectorAll('.planet-3d-item');
    this.indicators = document.querySelectorAll('.planet-indicator');
    this.prevBtn = document.getElementById('prevPlanet');
    this.nextBtn = document.getElementById('nextPlanet');
    this.currentIndex = 2; // Start with Earth (index 2)
    this.isTransitioning = false;
    this.touchStartX = 0;
    this.touchEndX = 0;
    
    this.init();
  }
  
  init() {
    if (!this.carousel || this.items.length === 0) {
      console.warn('PlanetsCarousel: Carousel or items not found');
      return;
    }
    
    // Set initial positions
    this.updateCarousel();
    
    // Force button styles
    if (this.prevBtn) {
      this.prevBtn.style.pointerEvents = 'auto';
      this.prevBtn.style.cursor = 'pointer';
      this.prevBtn.style.zIndex = '1000';
      this.prevBtn.style.position = 'absolute';
      this.prevBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        console.log('Prev button clicked');
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
      console.error('PlanetsCarousel: Previous button not found!');
    }
    
    if (this.nextBtn) {
      this.nextBtn.style.pointerEvents = 'auto';
      this.nextBtn.style.cursor = 'pointer';
      this.nextBtn.style.zIndex = '1000';
      this.nextBtn.style.position = 'absolute';
      this.nextBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        console.log('Next button clicked');
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
      console.error('PlanetsCarousel: Next button not found!');
    }
    
    // Indicator clicks
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.goTo(index);
      });
    });
    
    // Planet item clicks - navigate to planets page
    this.items.forEach((item, index) => {
      item.style.cursor = 'pointer';
      item.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Pass the planet index to the planets page
        window.location.href = `HTML/planets.html?planet=${index}`;
      });
    });
    
    // Keyboard navigation - only when carousel is visible
    document.addEventListener('keydown', (e) => {
      // Check if carousel is in viewport
      const rect = this.carousel?.getBoundingClientRect();
      if (!rect) return;
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (isVisible) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          this.prev();
        }
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          this.next();
        }
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
    
    // Auto-play videos when they become active
    this.observeActiveItem();
    
    console.log('PlanetsCarousel initialized', {
      carousel: !!this.carousel,
      items: this.items.length,
      prevBtn: !!this.prevBtn,
      nextBtn: !!this.nextBtn
    });
  }
  
  updateCarousel() {
    console.log('updateCarousel called, currentIndex:', this.currentIndex, 'isTransitioning:', this.isTransitioning);
    
    if (!this.items || this.items.length === 0) {
      console.error('No items found in updateCarousel');
      return;
    }
    
    this.items.forEach((item, index) => {
      const offset = index - this.currentIndex;
      const absOffset = Math.abs(offset);
      
      // Remove all classes
      item.classList.remove('active', 'prev', 'next', 'far-prev', 'far-next');
      
      // Add appropriate classes based on position
      if (offset === 0) {
        item.classList.add('active');
      } else if (offset === -1) {
        item.classList.add('prev');
      } else if (offset === 1) {
        item.classList.add('next');
      } else if (offset < -1) {
        item.classList.add('far-prev');
      } else if (offset > 1) {
        item.classList.add('far-next');
      }
      
      // Update transform for 3D effect - Force update
      this.updateItemTransform(item, offset, absOffset);
    });
    
    // Update indicators
    this.indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === this.currentIndex);
    });
    
    // Update video playback
    this.updateVideoPlayback();
    
    // Force reflow to ensure updates are applied
    void this.carousel.offsetHeight;
  }
  
  updateItemTransform(item, offset, absOffset) {
    const translateZ = absOffset > 1 ? -800 : -400 * absOffset;
    const translateX = offset * 120;
    const scale = absOffset > 1 ? 0.3 : Math.max(0.4, 1 - (absOffset * 0.25));
    const opacity = absOffset > 1 ? 0.2 : Math.max(0.3, 1 - (absOffset * 0.3));
    const rotateY = offset * 45;
    
    // Force transform update
    const transformString = `translateX(${translateX}%) translateZ(${translateZ}px) scale(${scale}) rotateY(${rotateY}deg)`;
    item.style.transform = transformString;
    item.style.webkitTransform = transformString;
    item.style.opacity = Math.max(0.2, opacity);
    item.style.display = 'block';
    
    console.log(`Item ${item.dataset.planet || 'unknown'}: offset=${offset}, transform=${transformString}`);
  }
  
  updateVideoPlayback() {
    this.items.forEach((item, index) => {
      const video = item.querySelector('video');
      if (video) {
        if (index === this.currentIndex) {
          video.play().catch(() => {
            // Auto-play might be blocked, that's okay
          });
        } else {
          video.pause();
        }
      }
    });
  }
  
  observeActiveItem() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const video = entry.target.querySelector('video');
          if (video) {
            video.play().catch(() => {});
          }
        }
      });
    }, { threshold: 0.5 });
    
    this.items.forEach(item => observer.observe(item));
  }
  
  prev() {
    console.log('prev() called, isTransitioning:', this.isTransitioning, 'currentIndex:', this.currentIndex);
    if (!this.carousel || this.items.length === 0) {
      console.error('Cannot navigate: carousel or items missing');
      return;
    }
    
    if (this.isTransitioning) {
      console.log('Already transitioning, ignoring');
      return;
    }
    
    this.isTransitioning = true;
    const oldIndex = this.currentIndex;
    this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
    console.log(`Index changed: ${oldIndex} -> ${this.currentIndex}`);
    
    // Force update immediately
    this.updateCarousel();
    
    // Use requestAnimationFrame to ensure smooth transition
    requestAnimationFrame(() => {
      this.updateCarousel();
    });
    
    setTimeout(() => {
      this.isTransitioning = false;
      console.log('Transition complete');
    }, 650);
  }
  
  next() {
    console.log('next() called, isTransitioning:', this.isTransitioning, 'currentIndex:', this.currentIndex);
    if (!this.carousel || this.items.length === 0) {
      console.error('Cannot navigate: carousel or items missing');
      return;
    }
    
    if (this.isTransitioning) {
      console.log('Already transitioning, ignoring');
      return;
    }
    
    this.isTransitioning = true;
    const oldIndex = this.currentIndex;
    this.currentIndex = (this.currentIndex + 1) % this.items.length;
    console.log(`Index changed: ${oldIndex} -> ${this.currentIndex}`);
    
    // Force update immediately
    this.updateCarousel();
    
    // Use requestAnimationFrame to ensure smooth transition
    requestAnimationFrame(() => {
      this.updateCarousel();
    });
    
    setTimeout(() => {
      this.isTransitioning = false;
      console.log('Transition complete');
    }, 650);
  }
  
  goTo(index) {
    if (this.isTransitioning || index === this.currentIndex) return;
    this.isTransitioning = true;
    this.currentIndex = index;
    this.updateCarousel();
    setTimeout(() => {
      this.isTransitioning = false;
    }, 600);
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

// Initialize carousel when DOM is ready
function initPlanetsCarousel() {
  // Wait a bit to ensure all elements are rendered
  setTimeout(() => {
    try {
      const carousel = new PlanetsCarousel();
      // Make sure buttons are accessible
      window.planetsCarousel = carousel;
      console.log('PlanetsCarousel instance created:', carousel);
    } catch (error) {
      console.error('Error initializing PlanetsCarousel:', error);
    }
  }, 200);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPlanetsCarousel);
} else {
  initPlanetsCarousel();
}
