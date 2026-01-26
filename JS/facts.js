// Facts Page Interactive Features
class FactsPage {
  constructor() {
    this.cards = document.querySelectorAll('.fact-card');
    this.grid = document.querySelector('.facts-grid');
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
    
    // Add random fact highlight
    this.highlightRandomFact();
  }

  animateCardsOnLoad() {
    this.cards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px) rotateY(10deg)';
      
      setTimeout(() => {
        card.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0) rotateY(0deg)';
      }, index * 80);
    });
  }

  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -80px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          entry.target.style.animation = 'fadeInScale 0.5s ease-out forwards';
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
        <input type="text" id="searchInput" class="search-input" placeholder="Gerçek ara...">
        <select id="categoryFilter" class="category-filter">
          <option value="">Tüm Kategoriler</option>
          <option value="Dünya">Dünya</option>
          <option value="Güneş">Güneş</option>
          <option value="Ay">Ay</option>
          <option value="Satürn">Satürn</option>
          <option value="Venüs">Venüs</option>
          <option value="Yıldız">Yıldız</option>
          <option value="Uzay">Uzay</option>
          <option value="Jüpiter">Jüpiter</option>
          <option value="Neptün">Neptün</option>
          <option value="Uranüs">Uranüs</option>
          <option value="Mars">Mars</option>
          <option value="Göktaş">Göktaş</option>
        </select>
      </div>
      <div class="filter-results">
        <span id="resultCount">${this.cards.length} gerçek bulundu</span>
      </div>
    `;

    const factsContainer = document.querySelector('.facts-container');
    const grid = document.querySelector('.facts-grid');
    if (factsContainer && grid) {
      factsContainer.insertBefore(filterContainer, grid);
    }

    // Add filter functionality - Wait for elements to be ready
    setTimeout(() => {
      const searchInput = document.getElementById('searchInput');
      const categoryFilter = document.getElementById('categoryFilter');
      const resultCount = document.getElementById('resultCount');

      if (!searchInput || !categoryFilter || !resultCount) {
        console.error('Filter elements not found');
        return;
      }

      // Force enable pointer events
      searchInput.style.pointerEvents = 'auto';
      searchInput.style.cursor = 'text';
      categoryFilter.style.pointerEvents = 'auto';
      categoryFilter.style.cursor = 'pointer';

      const filterCards = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const category = categoryFilter.value.toLowerCase();
        let visibleCount = 0;

        this.cards.forEach(card => {
          const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
          const text = card.querySelector('p')?.textContent.toLowerCase() || '';
          const icon = card.querySelector('.fact-icon')?.textContent || '';
          
          const matchesSearch = !searchTerm || title.includes(searchTerm) || text.includes(searchTerm);
          const matchesCategory = !category || title.includes(category) || text.includes(category) || icon.includes(category);

          if (matchesSearch && matchesCategory) {
            card.style.display = '';
            card.style.opacity = '0';
            card.style.transform = 'scale(0.9) rotateY(10deg)';
            setTimeout(() => {
              card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              card.style.opacity = '1';
              card.style.transform = 'scale(1) rotateY(0deg)';
            }, 50);
            visibleCount++;
          } else {
            card.style.display = 'none';
          }
        });

        if (resultCount) {
          resultCount.textContent = `${visibleCount} gerçek bulundu`;
        }
      };

      searchInput.addEventListener('input', filterCards);
      searchInput.addEventListener('keyup', filterCards);
      categoryFilter.addEventListener('change', filterCards);
      categoryFilter.addEventListener('click', (e) => e.stopPropagation());
      
      console.log('Facts filters initialized');
    }, 100);
  }

  setupCardInteractions() {
    this.cards.forEach(card => {
      const icon = card.querySelector('.fact-icon');
      
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.05) rotateY(5deg)';
        card.style.boxShadow = '0 20px 50px rgba(100, 181, 246, 0.25)';
        
        if (icon) {
          icon.style.transform = 'scale(1.2) rotate(10deg)';
          icon.style.transition = 'transform 0.3s ease';
        }
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1) rotateY(0deg)';
        card.style.boxShadow = '';
        
        if (icon) {
          icon.style.transform = 'scale(1) rotate(0deg)';
        }
      });

      // Add click effect with icon animation
      card.addEventListener('click', () => {
        if (icon) {
          icon.style.animation = 'bounce 0.6s ease';
          setTimeout(() => {
            icon.style.animation = '';
          }, 600);
        }
      });
    });
  }

  highlightRandomFact() {
    // Highlight a random fact every 10 seconds
    setInterval(() => {
      const randomIndex = Math.floor(Math.random() * this.cards.length);
      const randomCard = this.cards[randomIndex];
      
      if (randomCard && randomCard.style.display !== 'none') {
        randomCard.style.animation = 'glow 2s ease';
        setTimeout(() => {
          randomCard.style.animation = '';
        }, 2000);
      }
    }, 10000);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new FactsPage();
  });
} else {
  new FactsPage();
}

