// Scroll Section Indicators
class ScrollSectionIndicator {
  constructor() {
    this.sections = document.querySelectorAll('.gg-section');
    this.dots = [];
    this.activeIndex = 0;
    this.init();
  }

  init() {
    // Check if on mobile
    if (window.innerWidth <= 780) {
      return;
    }

    // Create indicator container
    const indicator = document.createElement('div');
    indicator.className = 'scroll-indicator';

    // Create dots for each section
    this.sections.forEach((section, index) => {
      const sectionTitle = section.querySelector('h1, h2')?.textContent?.trim() || `Section ${index + 1}`;
      
      const dot = document.createElement('button');
      dot.className = 'scroll-dot';
      dot.setAttribute('data-label', sectionTitle);
      dot.setAttribute('data-index', index);
      dot.setAttribute('aria-label', `Go to ${sectionTitle}`);
      
      if (index === 0) {
        dot.classList.add('active');
      }

      dot.addEventListener('click', () => this.scrollToSection(index));
      indicator.appendChild(dot);
      this.dots.push(dot);
    });

    document.body.appendChild(indicator);

    // Use Intersection Observer for reliable scroll detection
    this.setupIntersectionObserver();
    
    // Fallback scroll listener
    window.addEventListener('scroll', () => this.updateFromScroll(), { passive: true });
    window.addEventListener('resize', () => this.handleResize(), { passive: true });
  }

  setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = Array.from(this.sections).indexOf(entry.target);
          if (index !== -1) {
            this.setActiveIndicator(index);
          }
        }
      });
    }, options);

    this.sections.forEach((section) => {
      observer.observe(section);
    });
  }

  updateFromScroll() {
    if (window.innerWidth <= 780) return;

    const scrollPosition = window.scrollY;
    const viewportHeight = window.innerHeight;
    const scrollCenter = scrollPosition + viewportHeight / 2;

    let closestIndex = 0;
    let closestDistance = Infinity;

    this.sections.forEach((section, index) => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      const sectionCenter = (sectionTop + sectionBottom) / 2;
      const distance = Math.abs(scrollCenter - sectionCenter);

      if (sectionTop < scrollCenter + viewportHeight && sectionBottom > scrollPosition) {
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      }
    });

    if (closestIndex !== this.activeIndex) {
      this.setActiveIndicator(closestIndex);
    }
  }

  setActiveIndicator(index) {
    if (this.activeIndex === index) return;

    this.dots.forEach(dot => dot.classList.remove('active'));
    if (this.dots[index]) {
      this.dots[index].classList.add('active');
    }
    this.activeIndex = index;
  }

  scrollToSection(index) {
    const section = this.sections[index];
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  handleResize() {
    // Hide indicator on mobile
    const indicator = document.querySelector('.scroll-indicator');
    if (indicator) {
      indicator.style.display = window.innerWidth > 780 ? 'flex' : 'none';
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ScrollSectionIndicator();
  });
} else {
  new ScrollSectionIndicator();
}
