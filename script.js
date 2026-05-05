// ===== MOBILE MENU TOGGLE =====
document.addEventListener('DOMContentLoaded', function () {
  const menuToggle = document.getElementById('menu-toggle');
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');

  // Toggle menu on button click
  menuToggle.addEventListener('click', function () {
    navbar.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', navbar.classList.contains('active'));
  });

  // Close menu when nav link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', function () {
      navbar.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', function (event) {
    const isClickInsideMenu = navbar.contains(event.target);
    const isClickOnButton = menuToggle.contains(event.target);

    if (!isClickInsideMenu && !isClickOnButton && navbar.classList.contains('active')) {
      navbar.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
});

// ===== SMOOTH SCROLL NAVIGATION =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ===== DARK MODE TOGGLE =====
function initDarkMode() {
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  const isDarkMode = localStorage.getItem('darkMode') === 'true';

  if (isDarkMode) {
    document.body.classList.add('dark-mode');
    if (darkModeToggle) darkModeToggle.checked = true;
  }

  if (darkModeToggle) {
    darkModeToggle.addEventListener('change', function () {
      document.body.classList.toggle('dark-mode');
      localStorage.setItem('darkMode', this.checked);
    });
  }
}

initDarkMode();

// ===== FAVORITES FUNCTIONALITY =====
class FavoritesManager {
  constructor() {
    this.favorites = this.loadFavorites();
    this.initFavoritesButtons();
  }

  loadFavorites() {
    const stored = localStorage.getItem('animeFavorites');
    return stored ? JSON.parse(stored) : [];
  }

  saveFavorites() {
    localStorage.setItem('animeFavorites', JSON.stringify(this.favorites));
  }

  toggleFavorite(animeTitle) {
    if (this.favorites.includes(animeTitle)) {
      this.favorites = this.favorites.filter(fav => fav !== animeTitle);
    } else {
      this.favorites.push(animeTitle);
    }
    this.saveFavorites();
  }

  isFavorite(animeTitle) {
    return this.favorites.includes(animeTitle);
  }

  initFavoritesButtons() {
    const favoriteButtons = document.querySelectorAll('.btn-secondary');
    favoriteButtons.forEach(button => {
      const animeCard = button.closest('.anime-card');
      const animeTitle = animeCard.querySelector('.anime-title').textContent;

      // Update button state on load
      this.updateButtonState(button, animeTitle);

      // Add click listener
      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleFavorite(animeTitle);
        this.updateButtonState(button, animeTitle);
      });
    });
  }

  updateButtonState(button, animeTitle) {
    if (this.isFavorite(animeTitle)) {
      button.innerHTML = '❤️ Remove from Favorites';
      button.style.opacity = '1';
    } else {
      button.innerHTML = '♥ Add to Favorites';
      button.style.opacity = '0.8';
    }
  }
}

const favoritesManager = new FavoritesManager();

// ===== ACTIVE NAV LINK ON SCROLL =====
window.addEventListener('scroll', () => {
  let current = '';
  const sections = document.querySelectorAll('section');

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (scrollY >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href').slice(1) === current) {
      link.classList.add('active');
    }
  });
});

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = 'fadeInUp 0.8s ease both';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.anime-card').forEach(card => {
  observer.observe(card);
});

// ===== LAZY LOADING IMAGES =====
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        img.classList.add('loaded');
        observer.unobserve(img);
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// ===== SEARCH FUNCTIONALITY (Optional) =====
function searchAnime(query) {
  const animeCards = document.querySelectorAll('.anime-card');
  animeCards.forEach(card => {
    const title = card.querySelector('.anime-title').textContent.toLowerCase();
    const genres = Array.from(card.querySelectorAll('.genre-tag'))
      .map(tag => tag.textContent.toLowerCase())
      .join(' ');

    const matches = title.includes(query.toLowerCase()) || 
                   genres.includes(query.toLowerCase());

    card.style.display = matches ? 'flex' : 'none';
  });
}

// ===== RATING FILTER (Optional) =====
function filterByRating(minRating) {
  const animeCards = document.querySelectorAll('.anime-card');
  animeCards.forEach(card => {
    const rating = parseFloat(card.querySelector('.rating-badge').textContent);
    card.style.display = rating >= minRating ? 'flex' : 'none';
  });
}

// ===== EXPLORE NOW BUTTON =====
document.querySelector('.btn-primary')?.addEventListener('click', function () {
  const trendingSection = document.getElementById('trending');
  trendingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// ===== PAGE LOAD ANIMATION =====
window.addEventListener('load', () => {
  document.body.style.opacity = '1';
});

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', (e) => {
  // ESC key to close mobile menu
  if (e.key === 'Escape') {
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menu-toggle');
    navbar.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
  }

  // Skip to main content with keyboard shortcut
  if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    document.getElementById('main-content')?.focus();
  }
});

console.log('✨ AnimeWorld - All systems ready! 🚀');