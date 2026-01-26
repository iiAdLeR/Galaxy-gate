// Astronauts Page Interactive Features
class AstronautsPage {
  constructor() {
    this.cards = document.querySelectorAll('.card');
    this.grid = document.querySelector('.astronauts-grid');
    this.init();
  }

  init() {
    // Animate cards on load
    this.animateCardsOnLoad();
    
    // Add intersection observer for scroll animations
    this.setupScrollAnimations();
    
    // Add filter/search functionality
    this.setupFilter();
    
    // Add card click interactions
    this.setupCardInteractions();
  }

  animateCardsOnLoad() {
    this.cards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      
      setTimeout(() => {
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }

  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
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
        <input type="text" id="searchInput" class="search-input" placeholder="Astronot ara...">
        <select id="countryFilter" class="country-filter">
          <option value="">Tüm Ülkeler</option>
          <option value="ABD">ABD</option>
          <option value="Kanada">Kanada</option>
          <option value="Fransa">Fransa</option>
          <option value="Japonya">Japonya</option>
        </select>
        <select id="statusFilter" class="status-filter">
          <option value="">Tüm Durumlar</option>
          <option value="Aktif">Aktif</option>
          <option value="Emekli">Emekli</option>
        </select>
      </div>
      <div class="filter-results">
        <span id="resultCount">${this.cards.length} astronot bulundu</span>
      </div>
    `;

    const listWrapper = document.querySelector('.list-wrapper');
    if (listWrapper) {
      listWrapper.insertBefore(filterContainer, this.grid);
    }

    // Add filter functionality - Wait for elements to be ready
    setTimeout(() => {
      const searchInput = document.getElementById('searchInput');
      const countryFilter = document.getElementById('countryFilter');
      const statusFilter = document.getElementById('statusFilter');
      const resultCount = document.getElementById('resultCount');

      if (!searchInput || !countryFilter || !statusFilter || !resultCount) {
        console.error('Filter elements not found');
        return;
      }

      // Force enable pointer events
      searchInput.style.pointerEvents = 'auto';
      searchInput.style.cursor = 'text';
      countryFilter.style.pointerEvents = 'auto';
      countryFilter.style.cursor = 'pointer';
      statusFilter.style.pointerEvents = 'auto';
      statusFilter.style.cursor = 'pointer';

      const filterCards = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const country = countryFilter.value;
        const status = statusFilter.value;
        let visibleCount = 0;

        this.cards.forEach(card => {
          const name = card.querySelector('h3')?.textContent.toLowerCase() || '';
          const meta = card.querySelector('.card-meta')?.textContent || '';
          const bio = card.querySelector('.card-bio')?.textContent.toLowerCase() || '';
          
          const matchesSearch = !searchTerm || name.includes(searchTerm) || bio.includes(searchTerm);
          const matchesCountry = !country || meta.includes(country);
          const matchesStatus = !status || meta.includes(status);

          if (matchesSearch && matchesCountry && matchesStatus) {
            card.style.display = '';
            card.style.opacity = '0';
            card.style.transform = 'scale(0.9)';
            setTimeout(() => {
              card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            }, 50);
            visibleCount++;
          } else {
            card.style.display = 'none';
          }
        });

        if (resultCount) {
          resultCount.textContent = `${visibleCount} astronot bulundu`;
        }
      };

      searchInput.addEventListener('input', filterCards);
      searchInput.addEventListener('keyup', filterCards);
      countryFilter.addEventListener('change', filterCards);
      countryFilter.addEventListener('click', (e) => e.stopPropagation());
      statusFilter.addEventListener('change', filterCards);
      statusFilter.addEventListener('click', (e) => e.stopPropagation());
      
      console.log('Astronauts filters initialized');
    }, 100);
  }

  setupCardInteractions() {
    this.cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px) scale(1.02)';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
      });

      // Add click effect
      card.addEventListener('click', () => {
        card.style.transform = 'scale(0.98)';
        setTimeout(() => {
          card.style.transform = 'translateY(-8px) scale(1.02)';
        }, 150);
      });
    });
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new AstronautsPage();
  });
} else {
  new AstronautsPage();
}

