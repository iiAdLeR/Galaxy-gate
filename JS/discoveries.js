// Discoveries Page Interactive Features
class DiscoveriesPage {
  constructor() {
    this.cards = document.querySelectorAll('.discovery-card');
    this.grid = document.querySelector('.discoveries-grid');
    this.init();
  }

  init() {
    // Animate cards on load
    this.animateCardsOnLoad();
    
    // Add intersection observer for scroll animations
    this.setupScrollAnimations();
    
    // Add filter/search functionality
    this.setupFilter();
    
    // Add card interactions
    this.setupCardInteractions();
    
    // Add number animations
    this.animateNumbers();
  }

  animateCardsOnLoad() {
    this.cards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(40px) scale(0.95)';
      
      setTimeout(() => {
        card.style.transition = 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0) scale(1)';
      }, index * 150);
    });
  }

  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    this.cards.forEach(card => {
      observer.observe(card);
    });
  }

  setupFilter() {
    // Create filter UI
    const filterContainer = document.createElement('div');
    filterContainer.className = 'filter-container';
    filterContainer.innerHTML = `
      <div class="filter-controls">
        <input type="text" id="searchInput" class="search-input" placeholder="Gezegen ara...">
        <select id="yearFilter" class="year-filter">
          <option value="">Tüm Yıllar</option>
          <option value="1999">1999</option>
          <option value="2015">2015</option>
          <option value="2016">2016</option>
          <option value="2017">2017</option>
        </select>
        <select id="typeFilter" class="type-filter">
          <option value="">Tüm Tipler</option>
          <option value="yaşanabilir">Yaşanabilir</option>
          <option value="kayalık">Kayalık</option>
          <option value="gaz">Gaz Devi</option>
        </select>
      </div>
      <div class="filter-results">
        <span id="resultCount">${this.cards.length} keşif bulundu</span>
      </div>
    `;

    const container = document.querySelector('.container');
    const grid = document.querySelector('.discoveries-grid');
    if (container && grid) {
      container.insertBefore(filterContainer, grid);
    }

    // Add filter functionality - Wait for elements to be ready
    setTimeout(() => {
      const searchInput = document.getElementById('searchInput');
      const yearFilter = document.getElementById('yearFilter');
      const typeFilter = document.getElementById('typeFilter');
      const resultCount = document.getElementById('resultCount');

      if (!searchInput || !yearFilter || !typeFilter || !resultCount) {
        console.error('Filter elements not found');
        return;
      }

      // Force enable pointer events
      searchInput.style.pointerEvents = 'auto';
      searchInput.style.cursor = 'text';
      yearFilter.style.pointerEvents = 'auto';
      yearFilter.style.cursor = 'pointer';
      typeFilter.style.pointerEvents = 'auto';
      typeFilter.style.cursor = 'pointer';

      const filterCards = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const year = yearFilter.value;
        const type = typeFilter.value.toLowerCase();
        let visibleCount = 0;

        this.cards.forEach(card => {
          const name = card.querySelector('h3')?.textContent.toLowerCase() || '';
          const description = card.querySelector('.discovery-description')?.textContent.toLowerCase() || '';
          const yearValue = card.querySelector('.discovery-stat-value')?.textContent || '';
          
          const matchesSearch = !searchTerm || name.includes(searchTerm) || description.includes(searchTerm);
          const matchesYear = !year || yearValue.includes(year);
          const matchesType = !type || description.includes(type);

          if (matchesSearch && matchesYear && matchesType) {
            card.style.display = '';
            card.style.opacity = '0';
            card.style.transform = 'scale(0.9)';
            setTimeout(() => {
              card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            }, 50);
            visibleCount++;
          } else {
            card.style.display = 'none';
          }
        });

        if (resultCount) {
          resultCount.textContent = `${visibleCount} keşif bulundu`;
        }
      };

      searchInput.addEventListener('input', filterCards);
      searchInput.addEventListener('keyup', filterCards);
      yearFilter.addEventListener('change', filterCards);
      yearFilter.addEventListener('click', (e) => e.stopPropagation());
      typeFilter.addEventListener('change', filterCards);
      typeFilter.addEventListener('click', (e) => e.stopPropagation());
      
      console.log('Discoveries filters initialized');
    }, 100);
  }

  setupCardInteractions() {
    this.cards.forEach(card => {
      const stats = card.querySelectorAll('.discovery-stat-value');
      
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px) scale(1.02)';
        card.style.boxShadow = '0 16px 40px rgba(100, 181, 246, 0.2)';
        
        // Animate stats
        stats.forEach(stat => {
          stat.style.transform = 'scale(1.1)';
          stat.style.transition = 'transform 0.3s ease';
        });
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
        card.style.boxShadow = '';
        
        stats.forEach(stat => {
          stat.style.transform = 'scale(1)';
        });
      });
    });
  }

  animateNumbers() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const statValues = entry.target.querySelectorAll('.discovery-stat-value');
          statValues.forEach(stat => {
            const text = stat.textContent;
            if (text.match(/\d/)) {
              stat.style.animation = 'pulse 0.5s ease';
            }
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    this.cards.forEach(card => observer.observe(card));
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new DiscoveriesPage();
  });
} else {
  new DiscoveriesPage();
}

