/**
 * FreshMart Online Grocery Delivery System - Core Application JS
 * Hero Carousel & Search handling
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('FreshMart Grocery System Initialized - Day 2');
  
  // Search Input listener
  const mainSearchInput = document.getElementById('mainSearchInput');
  const mobileSearchInput = document.getElementById('mobileSearchInput');

  [mainSearchInput, mobileSearchInput].forEach(input => {
    if (input) {
      input.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        console.log('Searching for:', query);
      });
    }
  });

  // Initialize Hero Carousel with Bootstrap Carousel API
  const heroCarouselEl = document.getElementById('heroCarousel');
  if (heroCarouselEl && typeof bootstrap !== 'undefined') {
    new bootstrap.Carousel(heroCarouselEl, {
      interval: 4500,
      pause: 'hover',
      wrap: true,
      touch: true
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId.length > 1) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
});
